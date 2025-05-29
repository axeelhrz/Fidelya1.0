const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get inventory movements
router.get('/movements', async (req, res) => {
  try {
    const { page = 1, limit = 20, productId, type, startDate, endDate } = req.query;
    
    const skip = (page - 1) * limit;
    const where = {
      ...(productId && { productId }),
      ...(type && { type }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [movements, total] = await Promise.all([
      prisma.inventoryMovement.findMany({
        where,
        include: {
          product: { 
            select: { 
              name: true, 
              unit: true,
              category: { select: { name: true } }
            } 
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.inventoryMovement.count({ where })
    ]);

    res.json({
      movements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory movements', error: error.message });
  }
});

// Adjust stock
router.post('/adjust', async (req, res) => {
  try {
    const { productId, newStock, reason } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const quantity = Math.abs(newStock - product.stock);
    const type = newStock > product.stock ? 'IN' : 'OUT';

    // Update stock and create movement in transaction
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: { stock: newStock }
      });

      await tx.inventoryMovement.create({
        data: {
          productId,
          type: 'ADJUSTMENT',
          quantity,
          previousStock: product.stock,
          newStock,
          reason: reason || 'Manual adjustment'
        }
      });
    });

    res.json({ message: 'Stock adjusted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adjusting stock', error: error.message });
  }
});

// Get low stock products
router.get('/low-stock', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          lte: prisma.product.fields.minStock
        }
      },
      include: {
        category: { select: { name: true } },
        supplier: { select: { name: true } }
      },
      orderBy: { stock: 'asc' }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock products', error: error.message });
  }
});

// Get products near expiry
router.get('/near-expiry', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        expiryDate: {
          lte: futureDate,
          gte: new Date()
        }
      },
      include: {
        category: { select: { name: true } },
        supplier: { select: { name: true } }
      },
      orderBy: { expiryDate: 'asc' }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products near expiry', error: error.message });
  }
});

module.exports = router;