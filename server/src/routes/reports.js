const express = require('express');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Sales report
router.get('/sales', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const where = {
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const sales = await prisma.sale.findMany({
      where,
      include: {
        saleItems: {
          include: {
            product: {
              select: { name: true, category: { select: { name: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group sales by period
    const groupedSales = {};
    sales.forEach(sale => {
      let key;
      const date = new Date(sale.createdAt);
      
      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const week = getWeekNumber(date);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!groupedSales[key]) {
        groupedSales[key] = {
          period: key,
          totalSales: 0,
          totalAmount: 0,
          products: {}
        };
      }

      groupedSales[key].totalSales++;
      groupedSales[key].totalAmount += sale.total;

      // Group by products
      sale.saleItems.forEach(item => {
        const productName = item.product.name;
        if (!groupedSales[key].products[productName]) {
          groupedSales[key].products[productName] = {
            quantity: 0,
            revenue: 0
          };
        }
        groupedSales[key].products[productName].quantity += item.quantity;
        groupedSales[key].products[productName].revenue += item.subtotal;
      });
    });

    res.json(Object.values(groupedSales));
  } catch (error) {
    res.status(500).json({ message: 'Error generating sales report', error: error.message });
  }
});

// Profit report
router.get('/profit', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const sales = await prisma.sale.findMany({
      where,
      include: {
        saleItems: {
          include: {
            product: { select: { costPrice: true, name: true } }
          }
        }
      }
    });

    let totalRevenue = 0;
    let totalCost = 0;
    const productProfits = {};

    sales.forEach(sale => {
      sale.saleItems.forEach(item => {
        const revenue = item.subtotal;
        const cost = item.product.costPrice * item.quantity;
        const profit = revenue - cost;

        totalRevenue += revenue;
        totalCost += cost;

        if (!productProfits[item.product.name]) {
          productProfits[item.product.name] = {
            revenue: 0,
            cost: 0,
            profit: 0,
            margin: 0
          };
        }

        productProfits[item.product.name].revenue += revenue;
        productProfits[item.product.name].cost += cost;
        productProfits[item.product.name].profit += profit;
        productProfits[item.product.name].margin = 
          (productProfits[item.product.name].profit / productProfits[item.product.name].revenue) * 100;
      });
    });

    const totalProfit = totalRevenue - totalCost;


const totalMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    res.json({
      summary: {
        totalRevenue,
        totalCost,
        totalProfit,
        totalMargin
      },
      productProfits
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating profit report', error: error.message });
  }
});