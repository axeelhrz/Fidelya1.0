const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const settingsData = req.body;

    // Update or create each setting
    const updatePromises = Object.entries(settingsData).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// Get specific setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: req.params.key }
    });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    res.json({ value: setting.value });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching setting', error: error.message });
  }
});

module.exports = router;