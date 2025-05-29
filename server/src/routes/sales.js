const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all sales
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, clientId, paymentMethod } = req.query;
    
    const skip = (page - 1) * limit;
    const where = {
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }),
      ...(clientId && { clientId }),
      ...(paymentMethod && { paymentMethod })
    };

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          client: { select: { name: true } },
          user: { select: { name: true } },
          saleItems: {
            include: {
              product: { select: { name: true, unit: true } }
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sale.count({ where })
    ]);

    res.json({
      sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
});

// Get sale by ID
router.get('/:id', async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: {
        client: true,
        user: { select: { name: true } },
        saleItems: {
          include: {
            product: { select: { name: true, unit: true } }
          }
        }
      }
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale', error: error.message });
  }
});

// Create sale
router.post('/', async (req, res) => {
  try {
    const { clientId, items, paymentMethod, discount = 0, tax = 0, notes } = req.body;

    // Calculate totals
    let subtotal = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(400).json({ 
          message: `Product with ID ${item.productId} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}` 
        });
      }

      const itemSubtotal = item.quantity * item.price;
      subtotal += itemSubtotal;

      saleItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: itemSubtotal
      });
    }

    const total = subtotal - discount + tax;

    // Generate sale number
    const saleCount = await prisma.sale.count();
    const saleNumber = `SALE-${String(saleCount + 1).padStart(6, '0')}`;

    // Create sale with transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create sale
      const newSale = await tx.sale.create({
        data: {
          saleNumber,
          subtotal,
          tax,
          discount,
          total,
          paymentMethod,
          notes,
          clientId,
          userId: req.user.id,
          saleItems: {
            create: saleItems
          }
        },
        include: {
          client: { select: { name: true } },
          user: { select: { name: true } },
          saleItems: {
            include: {
              product: { select: { name: true, unit: true } }
            }
          }
        }
      });

      // Update product stock and create inventory movements
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        const newStock = product.stock - item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock }
        });

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: 'OUT',
            quantity: item.quantity,
            previousStock: product.stock,
            newStock,
            reason: `Sale ${saleNumber}`
          }
        });
      }

      return newSale;
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale', error: error.message });
  }
});

// Cancel sale
router.delete('/:id', async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: { saleItems: true }
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Restore stock in transaction
    await prisma.$transaction(async (tx) => {
      // Restore product stock
      for (const item of sale.saleItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        const newStock = product.stock + item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock }
        });

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            type: 'IN',
            quantity: item.quantity,
            previousStock: product.stock,
            newStock,
            reason: `Sale cancellation ${sale.saleNumber}`
          }
        });
      }

      // Delete sale
      await tx.sale.delete({
        where: { id: req.params.id }
      });
    });

    res.json({ message: 'Sale cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling sale', error: error.message });
  }
});

module.exports = router;