const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: { name, description }
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, description }
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: req.params.id, isActive: true }
    });

    if (productsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with active products' 
      });
    }

    await prisma.category.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

module.exports = router;