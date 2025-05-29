const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    
    const skip = (page - 1) * limit;
    const where = {
      ...(isRead !== undefined && { isRead: isRead === 'true' })
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where })
    ]);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Create notification
router.post('/', async (req, res) => {
  try {
    const { title, message, type = 'INFO' } = req.body;

    const notification = await prisma.notification.create({
      data: { title, message, type }
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications', error: error.message });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    await prisma.notification.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
});

module.exports = router;