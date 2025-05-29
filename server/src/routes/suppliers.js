const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const suppliers = await prisma.supplier.findMany({
      where,
      include: {
        _count: {
          select: { products: true, purchases: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
  }
});

// Get supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: req.params.id },
      include: {
        products: {
          where: { isActive: true },
          select: { id: true, name: true, stock: true, salePrice: true }
        },
        purchases: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: { id: true, purchaseNumber: true, total: true, createdAt: true }
        }
      }
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supplier', error: error.message });
  }
});

// Create supplier
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, taxId } = req.body;

    const supplier = await prisma.supplier.create({
      data: { name, email, phone, address, taxId }
    });

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier', error: error.message });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address, taxId } = req.body;

    const supplier = await prisma.supplier.update({
      where: { id: req.params.id },
      data: { name, email, phone, address, taxId }
    });

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error: error.message });
  }
});

// Delete supplier (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.supplier.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error: error.message });
  }
});

module.exports = router;