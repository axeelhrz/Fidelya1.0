import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const InventoryStats = ({ estadisticas }) => {
  const theme = useTheme();

  if (!estadisticas) {
    return null;
  }
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'Total Productos',
      value: estadisticas.total_productos,
      icon: InventoryIcon,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      description: 'Productos registrados',
    },
    {
      title: 'Stock Bajo',
      value: estadisticas.productos_stock_bajo,
      icon: WarningIcon,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      description: 'Requieren atención',
      alert: estadisticas.productos_stock_bajo > 0,
    },
    {
      title: 'Valor Inventario',
      value: formatCurrency(estadisticas.valor_inventario),
      icon: MoneyIcon,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      description: 'Valor total del stock',
      isMonetary: true,
    },
    {
      title: 'Stock Total',
      value: estadisticas.stock_total,
      icon: TrendingUpIcon,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
      description: 'Unidades disponibles',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
      >
              <Card
                  sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-4px)',
                  },
                  border: stat.alert ? `2px solid ${theme.palette.warning.main}` : 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        gutterBottom
                      >
                        {stat.title}
                      </Typography>
                      
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color={stat.color}
                        sx={{ mb: 1 }}
                      >
                        {stat.value}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary">
                        {stat.description}
                      </Typography>

                      {stat.alert && (
                        <Chip
                          label="¡Atención!"
                          color="warning"
                          size="small"
                          sx={{ mt: 1, fontWeight: 600 }}
                        />
                      )}
    </Box>
                    
                    <Avatar
                      sx={{
                        bgcolor: stat.bgColor,
                        color: stat.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <stat.icon fontSize="large" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Distribución por categorías */}
        {estadisticas.productos_por_categoria && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <CategoryIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Distribución por Categorías
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Productos organizados por tipo
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    {Object.entries(estadisticas.productos_por_categoria).map(([categoria, cantidad]) => {
                      const getCategoryColor = (cat) => {
                        switch (cat) {
                          case 'frutas':
                            return theme.palette.success.main;
                          case 'verduras':
                            return theme.palette.primary.main;
                          default:
                            return theme.palette.warning.main;
                        }
};

                      const percentage = estadisticas.total_productos > 0 
                        ? ((cantidad / estadisticas.total_productos) * 100).toFixed(1)
                        : 0;

                      return (
                        <Grid item xs={12} sm={4} key={categoria}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: alpha(getCategoryColor(categoria), 0.1),
                              border: `1px solid ${alpha(getCategoryColor(categoria), 0.2)}`,
                            }}
                          >
                            <Typography
                              variant="h5"
                              fontWeight={700}
                              color={getCategoryColor(categoria)}
                            >
                              {cantidad}
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              textTransform="capitalize"
                            >
                              {categoria}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {percentage}% del total
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InventoryStats;