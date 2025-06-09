import React, { useMemo } from 'react';
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
  Alert,
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
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ComprasStats = ({ estadisticas, loading }) => {
  const theme = useTheme();

  // Memoizar cálculos para mejor rendimiento
  const statsCalculadas = useMemo(() => {
    if (!estadisticas) {
      return {
        totalInvertidoMes: 0,
        comprasMes: 0,
        gastoPromedio: 0,
        totalCompras: 0,
        gastoTotal: 0,
        topProveedores: [],
        productosMasComprados: [],
        comprasPorMetodo: {},
        tendenciaMensual: [],
      };
    }

    return {
      totalInvertidoMes: parseFloat(estadisticas.total_invertido_mes) || 0,
      comprasMes: parseInt(estadisticas.compras_mes) || 0,
      gastoPromedio: parseFloat(estadisticas.gasto_promedio) || 0,
      totalCompras: parseInt(estadisticas.total_compras) || 0,
      gastoTotal: parseFloat(estadisticas.gasto_total) || 0,
      topProveedores: Array.isArray(estadisticas.top_proveedores) ? estadisticas.top_proveedores : [],
      productosMasComprados: Array.isArray(estadisticas.productos_mas_comprados) ? estadisticas.productos_mas_comprados : [],
      comprasPorMetodo: estadisticas.compras_por_metodo || {},
      tendenciaMensual: Array.isArray(estadisticas.tendencia_mensual) ? estadisticas.tendencia_mensual : [],
    };
  }, [estadisticas]);

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return '$0.00';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(numericAmount);
  };

  // Función para calcular tendencias
  const calcularTendencia = (valorActual, valorAnterior) => {
    if (!valorAnterior || valorAnterior === 0) return { porcentaje: 0, esPositiva: true };
    
    const diferencia = valorActual - valorAnterior;
    const porcentaje = Math.abs((diferencia / valorAnterior) * 100);
    
    return {
      porcentaje: Math.round(porcentaje),
      esPositiva: diferencia >= 0
    };
  };

  // Calcular tendencias simuladas (en un caso real vendrían del backend)
  const tendencias = useMemo(() => {
    const mesAnterior = statsCalculadas.totalInvertidoMes * 0.85; // Simulado
    const promedioAnterior = statsCalculadas.gastoPromedio * 0.92; // Simulado
    const comprasAnterior = statsCalculadas.comprasMes * 0.88; // Simulado
    
    return {
      invertido: calcularTendencia(statsCalculadas.totalInvertidoMes, mesAnterior),
      promedio: calcularTendencia(statsCalculadas.gastoPromedio, promedioAnterior),
      compras: calcularTendencia(statsCalculadas.comprasMes, comprasAnterior),
      proveedores: { porcentaje: 3, esPositiva: true }, // Simulado
    };
  }, [statsCalculadas]);

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

  const statsCards = [
    {
      title: 'Invertido Este Mes',
      value: formatCurrency(statsCalculadas.totalInvertidoMes),
      subtitle: `${statsCalculadas.comprasMes} compras realizadas`,
      icon: AttachMoney,
      color: '#10B981',
      bgGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      bgColor: alpha('#10B981', 0.1),
      trend: `${tendencias.invertido.porcentaje}%`,
      trendUp: tendencias.invertido.esPositiva,
    },
    {
      title: 'Gasto Promedio',
      value: formatCurrency(statsCalculadas.gastoPromedio),
      subtitle: 'Por compra realizada',
      icon: Assessment,
      color: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      bgColor: alpha('#3B82F6', 0.1),
      trend: `${tendencias.promedio.porcentaje}%`,
      trendUp: tendencias.promedio.esPositiva,
    },
    {
      title: 'Total Compras',
      value: statsCalculadas.totalCompras.toLocaleString(),
      subtitle: `${formatCurrency(statsCalculadas.gastoTotal)} invertido total`,
      icon: ShoppingCart,
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      bgColor: alpha('#F59E0B', 0.1),
      trend: `${tendencias.compras.porcentaje}%`,
      trendUp: tendencias.compras.esPositiva,
    },
    {
      title: 'Proveedores Activos',
      value: statsCalculadas.topProveedores.length.toLocaleString(),
      subtitle: 'Con compras registradas',
      icon: LocalShipping,
      color: '#8B5CF6',
      bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      bgColor: alpha('#8B5CF6', 0.1),
      trend: `${tendencias.proveedores.porcentaje}%`,
      trendUp: tendencias.proveedores.esPositiva,
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
                  {statsCalculadas.topProveedores.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {statsCalculadas.topProveedores.slice(0, 5).map((proveedor, index) => (
                        <motion.div
                          key={proveedor.id || index}
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
                                {(proveedor.nombre || 'P').charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {proveedor.nombre || 'Proveedor sin nombre'}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Chip
                                    label={`${proveedor.total_compras || 0} compras`}
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
                                    {formatCurrency(proveedor.total_gastado || 0)}
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
                  {statsCalculadas.productosMasComprados.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {statsCalculadas.productosMasComprados.slice(0, 5).map((producto, index) => {
                        const maxCantidad = statsCalculadas.productosMasComprados[0]?.cantidad_total || 1;
                        const progreso = Math.min((producto.cantidad_total / maxCantidad) * 100, 100);
                        
                        return (
                          <motion.div
                            key={producto.producto_id || index}
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
                                  {(producto.producto || 'P').charAt(0).toUpperCase()}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {producto.producto || 'Producto sin nombre'}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Chip
                                      label={`${producto.cantidad_total || 0} unidades`}
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
                                      {producto.veces_comprado || 0} veces
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
                                    {Math.round(progreso)}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={progreso}
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
                        );
                      })}
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

      {/* Alerta informativa si no hay datos */}
      {!loading && (!estadisticas || (statsCalculadas.totalCompras === 0 && statsCalculadas.topProveedores.length === 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Alert 
            severity="info" 
            icon={<InfoIcon />}
            sx={{ 
              mt: 3,
              borderRadius: 3,
              '& .MuiAlert-message': {
                fontWeight: 500,
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              ¡Comienza a registrar compras!
            </Typography>
            <Typography variant="body2">
              Una vez que registres tus primeras compras, aquí verás estadísticas detalladas sobre tus proveedores, productos más comprados y tendencias de gasto.
            </Typography>
          </Alert>
        </motion.div>
      )}
    </Box>
  );
};

export default ComprasStats;