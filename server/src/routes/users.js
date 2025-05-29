const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Create user (admin only)
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { email, password, name, role = 'EMPLOYEE' } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { name, role, isActive } = req.body;
    const userId = req.params.id;

    // Only admin can update other users or change roles
    if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role !== 'ADMIN' && role) {
      return res.status(403).json({ message: 'Cannot change role' });
    }

    const updateData = { name };
    if (req.user.role === 'ADMIN') {
      if (role) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Change password
router.put('/:id/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Users can only change their own password
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
});

module.exports = router;