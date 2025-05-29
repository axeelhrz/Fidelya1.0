const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard KPIs
router.get('/kpis', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Sales today
    const salesToday = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      _sum: { total: true },
      _count: true
    });

    // Sales this month
    const salesThisMonth = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: { total: true },
      _count: true
    });

    // Low stock products
    const lowStockProducts = await prisma.product.count({
      where: {
        stock: {
          lte: prisma.product.fields.minStock
        },
        isActive: true
      }
    });

    // Products near expiry (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const productsNearExpiry = await prisma.product.count({
      where: {
        expiryDate: {
          lte: nextWeek,
          gte: new Date()
        },
        isActive: true
      }
    });

    // Total products
    const totalProducts = await prisma.product.count({
      where: { isActive: true }
    });

    // Total clients
    const totalClients = await prisma.client.count({
      where: { isActive: true }
    });

    res.json({
      salesToday: {
        amount: salesToday._sum.total || 0,
        count: salesToday._count || 0
      },
      salesThisMonth: {
        amount: salesThisMonth._sum.total || 0,
        count: salesThisMonth._count || 0
      },
      lowStockProducts,
      productsNearExpiry,
      totalProducts,
      totalClients
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching KPIs', error: error.message });
  }
});

// Get sales chart data (last 30 days)
router.get('/sales-chart', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await prisma.sale.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: { total: true },
      _count: true,
      orderBy: { createdAt: 'asc' }
    });

    // Group by day
    const dailySales = {};
    salesData.forEach(sale => {
      const date = sale.createdAt.toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { total: 0, count: 0 };
      }
      dailySales[date].total += sale._sum.total || 0;
      dailySales[date].count += sale._count || 0;
    });

    res.json(dailySales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales chart', error: error.message });
  }
});

// Get recent activities
router.get('/recent-activities', async (req, res) => {
  try {
    const recentSales = await prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { name: true } },
        user: { select: { name: true } }
      }
    });

    const recentPurchases = await prisma.purchase.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        supplier: { select: { name: true } },
        user: { select: { name: true } }
      }
    });

    res.json({
      recentSales,
      recentPurchases
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
  }
});

module.exports = router;