import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, subtitle, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}25`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {icon}
          </Box>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
);

const InventoryStats = ({ estadisticas }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
    }).format(value);
  };

  const getCategoriaColor = (categoria) => {
    const colores = {
      fruta: '#4CAF50',
      verdura: '#FF9800',
      otro: '#2196F3',
    };
    return colores[categoria] || '#757575';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" color="text.primary" mb={3}>
        Resumen del Inventario
      </Typography>
      
      <Grid container spacing={3}>
        {/* Total de Productos */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Productos"
            value={estadisticas.total_productos}
            icon={<InventoryIcon />}
            color="#2196F3"
            delay={0}
          />
        </Grid>

        {/* Productos con Stock Bajo */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Stock Bajo"
            value={estadisticas.productos_stock_bajo}
            icon={<WarningIcon />}
            color="#FF5722"
            subtitle={estadisticas.productos_stock_bajo > 0 ? "Requieren atención" : "Todo en orden"}
            delay={0.1}
          />
        </Grid>

        {/* Valor del Inventario */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valor Inventario"
            value={formatCurrency(estadisticas.valor_inventario)}
            icon={<MoneyIcon />}
            color="#4CAF50"
            delay={0.2}
          />
        </Grid>

        {/* Productos Sin Movimiento */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sin Movimiento"
            value={estadisticas.productos_sin_movimiento}
            icon={<TrendingDownIcon />}
            color="#FF9800"
            subtitle="Últimos 30 días"
            delay={0.3}
          />
        </Grid>
      </Grid>

      {/* Distribución por Categorías */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card sx={{ mt: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <CategoryIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Distribución por Categorías
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {Object.entries(estadisticas.productos_por_categoria).map(([categoria, cantidad]) => (
                <Chip
                  key={categoria}
                  label={`${categoria.charAt(0).toUpperCase() + categoria.slice(1)}: ${cantidad}`}
                  sx={{
                    backgroundColor: `${getCategoriaColor(categoria)}20`,
                    color: getCategoriaColor(categoria),
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 1,
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default InventoryStats;