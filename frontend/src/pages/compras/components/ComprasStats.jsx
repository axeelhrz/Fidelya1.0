import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  LocalShipping,
  Inventory,
  Assessment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ComprasStats = ({ estadisticas, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!estadisticas) {
    return null;
  }

  const statsCards = [
    {
      title: 'Invertido Este Mes',
      value: `$${estadisticas.total_invertido_mes?.toFixed(2) || '0.00'}`,
      subtitle: `${estadisticas.compras_mes || 0} compras`,
      icon: AttachMoney,
      color: '#4CAF50',
      bgColor: 'rgba(76, 175, 80, 0.1)',
    },
    {
      title: 'Gasto Promedio',
      value: `$${estadisticas.gasto_promedio?.toFixed(2) || '0.00'}`,
      subtitle: 'Por compra',
      icon: Assessment,
      color: '#2196F3',
      bgColor: 'rgba(33, 150, 243, 0.1)',
    },
    {
      title: 'Total Compras',
      value: estadisticas.total_compras || 0,
      subtitle: `$${estadisticas.gasto_total?.toFixed(2) || '0.00'} total`,
      icon: ShoppingCart,
      color: '#FF9800',
      bgColor: 'rgba(255, 152, 0, 0.1)',
    },
    {
      title: 'Proveedores Activos',
      value: estadisticas.top_proveedores?.length || 0,
      subtitle: 'Con compras',
      icon: LocalShipping,
      color: '#9C27B0',
      bgColor: 'rgba(156, 39, 176, 0.1)',
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Tarjetas de estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${stat.bgColor} 0%, rgba(255,255,255,0.9) 100%)`,
                  border: `1px solid ${stat.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${stat.color}30`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <stat.icon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: stat.color,
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Sección de Top Proveedores y Productos */}
      <Grid container spacing={3}>
        {/* Top Proveedores */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShipping sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Top Proveedores
                  </Typography>
                </Box>
                
                {estadisticas.top_proveedores?.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {estadisticas.top_proveedores.slice(0, 5).map((proveedor, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          px: 0,
                          py: 1,
                          borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: `hsl(${index * 60}, 70%, 50%)`,
                              width: 32,
                              height: 32,
                              fontSize: '0.875rem',
                            }}
                          >
                            {proveedor.nombre?.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {proveedor.nombre}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={`${proveedor.total_compras} compras`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem', height: 20 }}
                              />
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                                ${proveedor.total_gastado?.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay datos de proveedores disponibles
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Productos Más Comprados */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Inventory sx={{ color: '#FF9800', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Productos Más Comprados
                  </Typography>
                </Box>
                
                {estadisticas.productos_mas_comprados?.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {estadisticas.productos_mas_comprados.slice(0, 5).map((producto, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          px: 0,
                          py: 1,
                          borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: `hsl(${index * 72 + 180}, 60%, 50%)`,
                              width: 32,
                              height: 32,
                              fontSize: '0.875rem',
                            }}
                          >
                            {producto.producto?.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {producto.producto}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={`${producto.cantidad_total} unidades`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem', height: 20 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {producto.veces_comprado} veces
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ width: 60, ml: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((producto.cantidad_total / (estadisticas.productos_mas_comprados[0]?.cantidad_total || 1)) * 100, 100)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: `hsl(${index * 72 + 180}, 60%, 50%)`,
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay datos de productos disponibles
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComprasStats;