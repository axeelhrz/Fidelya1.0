const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, categoryId, supplierId, lowStock } = req.query;
    
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { barcode: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(categoryId && { categoryId }),
      ...(supplierId && { supplierId }),
      ...(lowStock === 'true' && {
        stock: { lte: prisma.product.fields.minStock }
      })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true } },
          supplier: { select: { name: true } }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        supplier: true,
        inventoryMovements: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      barcode,
      unit,
      costPrice,
      salePrice,
      stock,
      minStock,
      expiryDate,
      categoryId,
      supplierId
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        barcode,
        unit,
        costPrice: parseFloat(costPrice),
        salePrice: parseFloat(salePrice),
        stock: parseFloat(stock || 0),
        minStock: parseFloat(minStock || 0),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        categoryId,
        supplierId
      },
      include: {
        category: { select: { name: true } },
        supplier: { select: { name: true } }
      }
    });

    // Create inventory movement
    if (stock > 0) {
      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: 'IN',
          quantity: parseFloat(stock),
          previousStock: 0,
          newStock: parseFloat(stock),
          reason: 'Initial stock'
        }
      });
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      description,
      barcode,
      unit,
      costPrice,
      salePrice,
      stock,
      minStock,
      expiryDate,
      categoryId,
      supplierId
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        barcode,
        unit,
        costPrice: parseFloat(costPrice),
        salePrice: parseFloat(salePrice),
        stock: parseFloat(stock),
        minStock: parseFloat(minStock || 0),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        categoryId,
        supplierId
      },
      include: {
        category: { select: { name: true } },
        supplier: { select: { name: true } }
      }
    });

    // Create inventory movement if stock changed
    if (existingProduct.stock !== parseFloat(stock)) {
      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: parseFloat(stock) > existingProduct.stock ? 'IN' : 'OUT',
          quantity: Math.abs(parseFloat(stock) - existingProduct.stock),
          previousStock: existingProduct.stock,
          newStock: parseFloat(stock),
          reason: 'Manual adjustment'
        }
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;