const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const clients = await prisma.client.findMany({
      where,
      include: {
        _count: {
          select: { sales: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        sales: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: { 
            id: true, 
            saleNumber: true, 
            total: true, 
            createdAt: true,
            paymentMethod: true
          }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client', error: error.message });
  }
});

// Create client
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, taxId, notes } = req.body;

    const client = await prisma.client.create({
      data: { name, email, phone, address, taxId, notes }
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address, taxId, notes } = req.body;

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: { name, email, phone, address, taxId, notes }
    });

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
});

// Delete client (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.client.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
});

module.exports = router;