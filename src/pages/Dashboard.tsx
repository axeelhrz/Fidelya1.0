import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Fab,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  ShoppingCart,
  AttachMoney,
  Warning,
  People,
  Receipt,
  Add,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Product, Sale } from '../types';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Manzanas Rojas',
    category: 'Frutas',
    price: 2500,
    cost: 1500,
    stock: 5, // Stock bajo
    minStock: 10,
    supplier: 'Frutería Central',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Bananos',
    category: 'Frutas',
    price: 1800,
    cost: 1000,
    stock: 30,
    minStock: 5,
    supplier: 'Distribuidora Tropical',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Naranjas',
    category: 'Frutas',
    price: 2000,
    cost: 1200,
    stock: 3, // Stock bajo
    minStock: 8,
    supplier: 'Frutería Central',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Lechuga',
    category: 'Verduras',
    price: 1500,
    cost: 800,
    stock: 20,
    minStock: 5,
    supplier: 'Verduras Frescas',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSales: Sale[] = [
  {
    id: '1',
    products: [
      { productId: '1', productName: 'Manzanas Rojas', quantity: 2, price: 2500, total: 5000 },
      { productId: '2', productName: 'Bananos', quantity: 1, price: 1800, total: 1800 },
    ],
    total: 6800,
    subtotal: 6800,
    discount: 0,
    paymentMethod: 'cash',
    customerName: 'Juan Pérez',
    createdAt: new Date(),
    userId: '1',
  },
  {
    id: '2',
    products: [
      { productId: '3', productName: 'Naranjas', quantity: 3, price: 2000, total: 6000 },
    ],
    total: 6000,
    subtotal: 6000,
    discount: 0,
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 86400000), // Ayer
    userId: '1',
  },
];

// Componente para métricas principales
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  index: number;
}> = ({ title, value, icon, color, trend, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
                {value}
              </Typography>
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {trend.isPositive ? (
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                  )}
                  <Typography 
                    variant="body2" 
                    color={trend.isPositive ? 'success.main' : 'error.main'}
                  >
                    {trend.value}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ 
              p: 2, 
              borderRadius: '50%', 
              backgroundColor: `${color}.light`,
              color: `${color}.main`
            }}>
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente para productos con stock bajo
const LowStockAlert: React.FC<{
  products: Product[];
}> = ({ products }) => {
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  if (lowStockProducts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Alert 
        severity="warning" 
        icon={<Warning />}
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small">
            Ver Inventario
          </Button>
        }
      >
        <Typography variant="subtitle2" gutterBottom>
          Stock Bajo Detectado
        </Typography>
        <Typography variant="body2">
          {lowStockProducts.length} producto{lowStockProducts.length > 1 ? 's' : ''} necesita{lowStockProducts.length === 1 ? '' : 'n'} reposición:
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {lowStockProducts.map((product) => (
            <Chip
              key={product.id}
              label={`${product.name} (${product.stock})`}
              size="small"
              color="warning"
              variant="outlined"
            />
          ))}
        </Box>
      </Alert>
    </motion.div>
  );
};

// Componente para ventas recientes
const RecentSales: React.FC<{
  sales: Sale[];
}> = ({ sales }) => {
  const recentSales = sales.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Ventas Recientes
            </Typography>
            <Button size="small" endIcon={<ShoppingCart />}>
              Ver Todas
            </Button>
          </Box>
          
          {recentSales.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No hay ventas registradas
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentSales.map((sale, index) => (
                <Box
                  key={sale.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {sale.customerName || 'Cliente anónimo'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sale.products.length} producto{sale.products.length > 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(sale.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                      ${sale.total.toLocaleString()}
                    </Typography>
                    <Chip
                      label={sale.paymentMethod === 'cash' ? 'Efectivo' : 
                            sale.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente para productos más vendidos
const TopProducts: React.FC<{
  sales: Sale[];
  products: Product[];
}> = ({ sales, products }) => {
  const topProducts = useMemo(() => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    
    sales.forEach(sale => {
      sale.products.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.total;
        } else {
          productSales[item.productId] = {
            name: item.productName,
            quantity: item.quantity,
            revenue: item.total
          };
        }
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [sales]);

  const maxQuantity = Math.max(...topProducts.map(p => p.quantity), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Productos Más Vendidos
            </Typography>
            <Button size="small" endIcon={<Inventory />}>
              Ver Inventario
            </Button>
          </Box>
          
          {topProducts.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No hay datos de ventas
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topProducts.map((product, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.quantity} vendidos
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(product.quantity / maxQuantity) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Ingresos: ${product.revenue.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const Dashboard: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [sales] = useState<Sale[]>(mockSales);
  const [refreshing, setRefreshing] = useState(false);

  // Calcular métricas
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  
  const today = new Date();
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate.toDateString() === today.toDateString();
  });
  
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 }
        }}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Resumen general de tu frutería
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </Box>
      </motion.div>

      {/* Alertas de stock bajo */}
      <LowStockAlert products={products} />

      {/* Métricas principales */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap',
        gap: 3,
        mb: 3
      }}>
        <Box sx={{ flex: { xs: '1', sm: '1 1 250px' } }}>
          <MetricCard
            title="Ventas de Hoy"
            value={`$${todayRevenue.toLocaleString()}`}
            icon={<AttachMoney />}
            color="primary"
            trend={{ value: 12.5, isPositive: true }}
            index={0}
          />
        </Box>
        <Box sx={{ flex: { xs: '1', sm: '1 1 250px' } }}>
          <MetricCard
            title="Transacciones"
            value={todaySales.length}
            icon={<Receipt />}
            color="secondary"
            trend={{ value: 8.2, isPositive: true }}
            index={1}
          />
        </Box>
        <Box sx={{ flex: { xs: '1', sm: '1 1 250px' } }}>
          <MetricCard
            title="Productos"
            value={totalProducts}
            icon={<Inventory />}
            color="success"
            index={2}
          />
        </Box>
        <Box sx={{ flex: { xs: '1', sm: '1 1 250px' } }}>
          <MetricCard
            title="Stock Bajo"
            value={lowStockProducts}
            icon={<Warning />}
            color="warning"
            index={3}
          />
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3
      }}>
        {/* Columna izquierda */}
        <Box sx={{ flex: { xs: '1', lg: '2' } }}>
          <RecentSales sales={sales} />
        </Box>

        {/* Columna derecha */}
        <Box sx={{ flex: { xs: '1', lg: '1' } }}>
          <TopProducts sales={sales} products={products} />
        </Box>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="nueva venta"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};