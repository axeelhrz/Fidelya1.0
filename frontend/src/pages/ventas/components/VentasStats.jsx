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
  TrendingUp,
  AttachMoney,
  ShoppingCart,
  Today,
  CalendarMonth,
  Assessment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const VentasStats = ({ estadisticas, loading }) => {
  const theme = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon sx={{ fontSize: 40, mr: 2, opacity: 0.9 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          
          {loading ? (
            <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          )}
        </CardContent>
        
        {/* Decoración de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />
      </Card>
    </motion.div>
  );

  if (!estadisticas && !loading) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Estadísticas de Ventas
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ventas Hoy"
            value={loading ? '...' : estadisticas?.ventas_hoy || 0}
            icon={Today}
            color={theme.palette.primary.main}
            subtitle="Transacciones del día"
            delay={0}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ingresos Hoy"
            value={loading ? '...' : formatCurrency(estadisticas?.ingresos_hoy)}
            icon={AttachMoney}
            color={theme.palette.success.main}
            subtitle="Facturación del día"
            delay={0.1}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ventas del Mes"
            value={loading ? '...' : estadisticas?.ventas_mes || 0}
            icon={CalendarMonth}
            color={theme.palette.info.main}
            subtitle="Transacciones mensuales"
            delay={0.2}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ingresos del Mes"
            value={loading ? '...' : formatCurrency(estadisticas?.ingresos_mes)}
            icon={TrendingUp}
            color={theme.palette.warning.main}
            subtitle="Facturación mensual"
            delay={0.3}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Venta Promedio"
            value={loading ? '...' : formatCurrency(estadisticas?.venta_promedio)}
            icon={Assessment}
            color={theme.palette.secondary.main}
            subtitle="Ticket promedio"
            delay={0.4}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Producto Más Vendido"
            value={loading ? '...' : estadisticas?.producto_mas_vendido || 'N/A'}
            icon={ShoppingCart}
            color={theme.palette.error.main}
            subtitle="Top producto"
            delay={0.5}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Forma de Pago Preferida"
            value={loading ? '...' : (estadisticas?.forma_pago_preferida || 'efectivo').toUpperCase()}
            icon={AttachMoney}
            color="#9C27B0"
            subtitle="Método más usado"
            delay={0.6}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VentasStats;