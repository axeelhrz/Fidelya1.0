import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ComprasStats = ({ estadisticas, loading }) => {
  const theme = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const StatCard = ({ title, value, subtitle, icon, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          boxShadow: theme.shadows[4],
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                

                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(color, 0.1),
                color: color,
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          
          {loading ? (
            <Box>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (!estadisticas && !loading) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Compras del Mes"
            value={loading ? '...' : estadisticas?.compras_mes || 0}
            subtitle="Compras realizadas este mes"
            icon={<ShoppingCartIcon />}
            color={theme.palette.primary.main}
            delay={0}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Gasto del Mes"
            value={loading ? '...' : formatCurrency(estadisticas?.gasto_mes || 0)}
            subtitle="Total gastado este mes"
            icon={<TrendingUpIcon />}
            color={theme.palette.success.main}
            delay={0.1}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Gasto Promedio"
            value={loading ? '...' : formatCurrency(estadisticas?.gasto_promedio || 0)}
            subtitle="Promedio por compra"
            icon={<InventoryIcon />}
            color={theme.palette.warning.main}
            delay={0.2}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Proveedor Principal"
            value={loading ? '...' : estadisticas?.proveedor_frecuente || 'N/A'}
            subtitle="Proveedor más frecuente"
            icon={<StoreIcon />}
            color={theme.palette.info.main}
            delay={0.3}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComprasStats;