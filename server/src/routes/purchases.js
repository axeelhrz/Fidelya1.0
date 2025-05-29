const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, supplierId } = req.query;
    
    const skip = (page - 1) * limit;
    const where = {
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }),
      ...(supplierId && { supplierId })
    };

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        include: {
          supplier: { select: { name: true } },
          user: { select: { name: true } },
          purchaseItems: {
            include: {
              product: { select: { name: true, unit: true } }
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.purchase.count({ where })
    ]);

    res.json({
      purchases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error: error.message });
  }
});

// Get purchase by ID
router.get('/:id', async (req, res) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: req.params.id },
      include: {
        supplier: true,
        user: { select: { name: true } },
        purchaseItems: {
          include: {
            product: { select: { name: true, unit: true } }
          }
        }
      }
    });

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase', error: error.message });
  }
});

// Create purchase
router.post('/', async (req, res) => {
  try {
    const { supplierId, items, notes } = req.body;

    // Calculate total
    let total = 0;
    const purchaseItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(400).json({ 
          message: `Product with ID ${item.productId} not found` 
        });
      }

      const itemSubtotal = item.quantity * item.cost;
      total += itemSubtotal;

      purchaseItems.push({
        productId: item.productId,
        quantity: item.quantity,
        cost: item.cost,
        subtotal: itemSubtotal
      });
    }

    // Generate purchase number
    const purchaseCount = await prisma.purchase.count();
    const purchaseNumber = `PUR-${String(purchaseCount + 1).padStart(6, '0')}`;

    // Create purchase with transaction
    const purchase = await prisma.$transaction(async (tx) => {
      // Create purchase
      const newPurchase = await tx.purchase.create({
        data: {
          purchaseNumber,
          total,
          notes,
          supplierId,
          userId: req.user.id,
          purchaseItems: {
            create: purchaseItems
          }
        },
        include: {
          supplier: { select: { name: true } },
          user: { select: { name: true } },
          purchaseItems: {
            include: {
              product: { select: { name: true, unit: true } }
            }
          }
        }
      });

      // Update product stock and cost price
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        const newStock = product.stock + item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { 
            stock: newStock,
            costPrice: item.cost // Update cost price with latest purchase
          }
        });

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: 'IN',
            quantity: item.quantity,
            previousStock: product.stock,
            newStock,
            reason: `Purchase ${purchaseNumber}`
          }
        });
      }

      return newPurchase;
    });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase', error: error.message });
  }
});

module.exports = router;