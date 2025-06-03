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
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  ShoppingCart,
  Today,
  CalendarMonth,
  Assessment,
  Timeline,
  CreditCard,
  LocalOffer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const VentasStats = ({ estadisticas, loading }) => {
  const theme = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-UY').format(number || 0);
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    gradient, 
    subtitle, 
    trend,
    trendValue,
    delay = 0,
    progress,
    chip
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      <Card
        sx={{
          height: '100%',
          background: gradient,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          border: 'none',
          boxShadow: theme.shadows[4],
          '&:hover': {
            boxShadow: theme.shadows[12],
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 2, p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.9, 
                  fontWeight: 500,
                  mb: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem'
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <Icon sx={{ fontSize: 24 }} />
            </Box>
          </Box>
          
          {/* Value */}
          {loading ? (
            <Skeleton 
              variant="text" 
              width="70%" 
              height={48} 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} 
            />
          ) : (
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                mb: 1,
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
          )}

          {/* Progress bar */}
          {progress !== undefined && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: 3,
                  }
                }}
              />
              <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: 'block' }}>
                {progress}% del objetivo mensual
              </Typography>
            </Box>
          )}

          {/* Trend */}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5, opacity: 0.8 }} />
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {trend} {trendValue && `(${trendValue})`}
              </Typography>
            </Box>
          )}

          {/* Chip */}
          {chip && (
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={chip}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          )}
        </CardContent>
        
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.05)',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.03)',
            zIndex: 1,
          }}
        />
      </Card>
    </motion.div>
  );

  if (!estadisticas && !loading) {
    return null;
  }

  const gradients = {
    primary: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    success: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    info: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
    warning: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
    secondary: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    error: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    orange: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    teal: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  };

  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 700,
            color: theme.palette.text.primary
          }}
        >
          📊 Estadísticas de Ventas
        </Typography>
      </motion.div>
      
      <Grid container spacing={3}>
        {/* Ventas Hoy */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Ventas Hoy"
            value={loading ? '...' : formatNumber(estadisticas?.ventas_hoy || 0)}
            icon={Today}
            gradient={gradients.primary}
            subtitle="Transacciones del día"
            trend="+12% vs ayer"
            delay={0}
          />
        </Grid>
        
        {/* Ingresos Hoy */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Ingresos Hoy"
            value={loading ? '...' : formatCurrency(estadisticas?.ingresos_hoy)}
            icon={AttachMoney}
            gradient={gradients.success}
            subtitle="Facturación del día"
            trend="+8% vs ayer"
            delay={0.1}
          />
        </Grid>
        
        {/* Ventas del Mes */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Ventas del Mes"
            value={loading ? '...' : formatNumber(estadisticas?.ventas_mes || 0)}
            icon={CalendarMonth}
            gradient={gradients.info}
            subtitle="Transacciones mensuales"
            progress={75}
            delay={0.2}
          />
        </Grid>
        
        {/* Ingresos del Mes */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Ingresos del Mes"
            value={loading ? '...' : formatCurrency(estadisticas?.ingresos_mes)}
            icon={TrendingUp}
            gradient={gradients.warning}
            subtitle="Facturación mensual"
            trend="+15% vs mes anterior"
            delay={0.3}
          />
        </Grid>
        
        {/* Venta Promedio */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            title="Ticket Promedio"
            value={loading ? '...' : formatCurrency(estadisticas?.venta_promedio)}
            icon={Assessment}
            gradient={gradients.secondary}
            subtitle="Valor promedio por venta"
            trend="+5% vs mes anterior"
            delay={0.4}
          />
        </Grid>
        
        {/* Producto Más Vendido */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            title="Top Producto"
            value={loading ? '...' : (estadisticas?.producto_mas_vendido || 'N/A')}
            icon={LocalOffer}
            gradient={gradients.purple}
            subtitle="Producto más vendido"
            chip="🏆 Bestseller"
            delay={0.5}
          />
        </Grid>
        
        {/* Forma de Pago Preferida */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            title="Método Preferido"
            value={loading ? '...' : (estadisticas?.forma_pago_preferida || 'efectivo').toUpperCase()}
            icon={CreditCard}
            gradient={gradients.teal}
            subtitle="Forma de pago más usada"
            chip="💳 Popular"
            delay={0.6}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VentasStats;