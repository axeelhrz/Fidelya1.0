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
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as SalesIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatearPrecio } from '../../types/inventory';

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
      trend: null,
    },
    {
      title: 'Stock Bajo',
      value: estadisticas.productos_stock_bajo,
      icon: WarningIcon,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      description: 'Requieren atención',
      alert: estadisticas.productos_stock_bajo > 0,
      percentage: estadisticas.total_productos > 0 
        ? ((estadisticas.productos_stock_bajo / estadisticas.total_productos) * 100).toFixed(1)
        : 0,
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
        {/* Tarjetas de estadísticas principales */}
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

                      {/* Porcentaje para stock bajo */}
                      {stat.percentage !== undefined && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                            {stat.percentage}% del inventario
                            </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(parseFloat(stat.percentage), 100)}
                            color="warning"
                            sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      )}

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

        {/* Distribución por categorías mejorada */}
        {estadisticas.productos_por_categoria && Object.keys(estadisticas.productos_por_categoria).length > 0 && (
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  height: '100%',
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

                  <Grid container spacing={3}>
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

                      const categoryColor = getCategoryColor(categoria);

                      return (
                        <Grid item xs={12} sm={4} key={categoria}>
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              bgcolor: alpha(categoryColor, 0.1),
                              border: `1px solid ${alpha(categoryColor, 0.2)}`,
                              textAlign: 'center',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4],
                              },
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              color={categoryColor}
                              gutterBottom
                            >
                              {cantidad}
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              textTransform="capitalize"
                              gutterBottom
                            >
                              {categoria}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {percentage}% del total
                            </Typography>
                            
                            {/* Barra de progreso visual */}
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(percentage)}
                              sx={{
                                mt: 1,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: alpha(categoryColor, 0.2),
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: categoryColor,
                                },
                              }}
                            />
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

        {/* Productos más vendidos */}
        {estadisticas.productos_mas_vendidos && estadisticas.productos_mas_vendidos.length > 0 && (
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                      }}
                    >
                      <SalesIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Más Vendidos
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Últimos 30 días
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    {estadisticas.productos_mas_vendidos.slice(0, 5).map((producto, index) => (
                      <Box
                        key={index}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        py={2}
                        borderBottom={index < 4 ? '1px solid' : 'none'}
                        borderColor="divider"
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            {index + 1}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {producto.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Producto
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" color="primary" fontWeight={600}>
                            {producto.cantidad_vendida}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            unidades
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
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