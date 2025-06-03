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
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  LocalShipping,
  Inventory,
  Assessment,
  TrendingDown,
  MoreVert as MoreVertIcon,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ComprasStats = ({ estadisticas, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item}>
            <Card 
              sx={{ 
                borderRadius: 4,
                height: 180,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Box>
                </Box>
                <Skeleton variant="text" width="80%" />
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
      subtitle: `${estadisticas.compras_mes || 0} compras realizadas`,
      icon: AttachMoney,
      color: '#10B981',
      bgGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      bgColor: alpha('#10B981', 0.1),
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Gasto Promedio',
      value: `$${estadisticas.gasto_promedio?.toFixed(2) || '0.00'}`,
      subtitle: 'Por compra realizada',
      icon: Assessment,
      color: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      bgColor: alpha('#3B82F6', 0.1),
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Total Compras',
      value: estadisticas.total_compras || 0,
      subtitle: `$${estadisticas.gasto_total?.toFixed(2) || '0.00'} invertido total`,
      icon: ShoppingCart,
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      bgColor: alpha('#F59E0B', 0.1),
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Proveedores Activos',
      value: estadisticas.top_proveedores?.length || 0,
      subtitle: 'Con compras registradas',
      icon: LocalShipping,
      color: '#8B5CF6',
      bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      bgColor: alpha('#8B5CF6', 0.1),
      trend: '+3%',
      trendUp: true,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Tarjetas de estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  height: 180,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(stat.color, 0.1)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 12px 40px ${alpha(stat.color, 0.15)}`,
                    transform: 'translateY(-4px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: stat.bgGradient,
                  }
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          background: stat.bgGradient,
                          width: 48,
                          height: 48,
                          mr: 2,
                          boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}`,
                        }}
                      >
                        <stat.icon sx={{ color: 'white' }} />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1,
                            mb: 0.5,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            icon={stat.trendUp ? <ArrowUpward /> : <ArrowDownward />}
                            label={stat.trend}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: stat.trendUp ? '#10B981' : '#EF4444',
                              bgcolor: stat.trendUp ? alpha('#10B981', 0.1) : alpha('#EF4444', 0.1),
                              '& .MuiChip-icon': {
                                fontSize: '0.875rem',
                                color: stat.trendUp ? '#10B981' : '#EF4444',
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Tooltip title="Más opciones">
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Box sx={{ mt: 'auto' }}>
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
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Sección de Top Proveedores y Productos */}
      <Grid container spacing={3}>
        {/* Top Proveedores */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card 
              sx={{ 
                borderRadius: 4, 
                height: 400,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      <LocalShipping />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Top Proveedores
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Proveedores con más compras
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="Ver todos">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {estadisticas.top_proveedores?.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {estadisticas.top_proveedores.slice(0, 5).map((proveedor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem
                            sx={{
                              px: 0,
                              py: 2,
                              borderBottom: index < 4 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  background: `linear-gradient(135deg, hsl(${index * 60 + 120}, 70%, 50%), hsl(${index * 60 + 120}, 70%, 40%))`,
                                  width: 40,
                                  height: 40,
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  boxShadow: `0 2px 8px ${alpha(`hsl(${index * 60 + 120}, 70%, 50%)`, 0.3)}`,
                                }}
                              >
                                {proveedor.nombre?.charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {proveedor.nombre}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Chip
                                    label={`${proveedor.total_compras} compras`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      fontSize: '0.75rem', 
                                      height: 22,
                                      borderColor: alpha(theme.palette.primary.main, 0.3),
                                      color: 'primary.main',
                                    }}
                                  />
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#10B981' }}>
                                    ${proveedor.total_gastado?.toFixed(2)}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                #{index + 1}
                              </Typography>
                            </Box>
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <LocalShipping sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        No hay datos de proveedores disponibles
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Los proveedores aparecerán aquí cuando realices compras
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Productos Más Comprados */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card 
              sx={{ 
                borderRadius: 4, 
                height: 400,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      <Inventory />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Productos Más Comprados
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Productos con mayor volumen
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="Ver todos">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {estadisticas.productos_mas_comprados?.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {estadisticas.productos_mas_comprados.slice(0, 5).map((producto, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem
                            sx={{
                              px: 0,
                              py: 2,
                              borderBottom: index < 4 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.warning.main, 0.04),
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  background: `linear-gradient(135deg, hsl(${index * 72 + 30}, 70%, 50%), hsl(${index * 72 + 30}, 70%, 40%))`,
                                  width: 40,
                                  height: 40,
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  boxShadow: `0 2px 8px ${alpha(`hsl(${index * 72 + 30}, 70%, 50%)`, 0.3)}`,
                                }}
                              >
                                {producto.producto?.charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {producto.producto}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Chip
                                    label={`${producto.cantidad_total} unidades`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      fontSize: '0.75rem', 
                                      height: 22,
                                      borderColor: alpha(theme.palette.warning.main, 0.3),
                                      color: 'warning.main',
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {producto.veces_comprado} veces
                                  </Typography>
                                </Box>
                              }
                            />
                            <Box sx={{ width: 80, ml: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Progreso
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  {Math.round((producto.cantidad_total / (estadisticas.productos_mas_comprados[0]?.cantidad_total || 1)) * 100)}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min((producto.cantidad_total / (estadisticas.productos_mas_comprados[0]?.cantidad_total || 1)) * 100, 100)}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: alpha(theme.palette.grey[300], 0.3),
                                  '& .MuiLinearProgress-bar': {
                                    background: `linear-gradient(90deg, hsl(${index * 72 + 30}, 70%, 50%), hsl(${index * 72 + 30}, 70%, 40%))`,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Inventory sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        No hay datos de productos disponibles
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Los productos aparecerán aquí cuando realices compras
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComprasStats;
