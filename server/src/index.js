const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('../generated/prisma');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const supplierRoutes = require('./routes/suppliers');
const clientRoutes = require('./routes/clients');
const saleRoutes = require('./routes/sales');
const purchaseRoutes = require('./routes/purchases');
const inventoryRoutes = require('./routes/inventory');
const reportRoutes = require('./routes/reports');
const settingRoutes = require('./routes/settings');
const notificationRoutes = require('./routes/notifications');
const dashboardRoutes = require('./routes/dashboard');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make prisma available in all routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/suppliers', authMiddleware, supplierRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/sales', authMiddleware, saleRoutes);
app.use('/api/purchases', authMiddleware, purchaseRoutes);
app.use('/api/inventory', authMiddleware, inventoryRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/settings', authMiddleware, settingRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});