import React, { useMemo, useState } from 'react';
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
  Collapse,
  Button,
  Divider,
  Paper,
  CircularProgress,
  Tab,
  Tabs,
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
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Speed,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  Area,
  AreaChart,
  Legend
} from 'recharts';

const ComprasStats = ({ estadisticas, loading, statsCalculadas }) => {
  const theme = useTheme();
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // Memoizar cálculos para mejor rendimiento
  const statsCalculadasMemo = useMemo(() => {
    if (!estadisticas) {
      return {
        totalInvertidoMes: 0.0,
        comprasMes: 0,
        gastoPromedio: 0.0,
        totalCompras: 0,
        gastoTotal: 0.0,
        topProveedores: [],
        productosMasComprados: [],
        comprasPorMetodo: {},
        tendenciaMensual: [],
        comparacionMesAnterior: { porcentaje: 0, esPositiva: true },
        alertas: [],
        metricsAvanzadas: {
          frecuenciaCompras: 0,
          proveedorMasUsado: null,
          metodoPagoPreferido: null,
          horasPicoCompras: [],
          estacionalidad: [],
          eficienciaCompras: 0,
        }
      };
    }

    // Calcular métricas avanzadas
    const metricsAvanzadas = {
      frecuenciaCompras: estadisticas.compras_mes > 0 ? (30 / estadisticas.compras_mes).toFixed(1) : 0,
      proveedorMasUsado: estadisticas.top_proveedores?.[0] || null,
      metodoPagoPreferido: Object.keys(estadisticas.compras_por_metodo || {}).reduce((a, b) => 
        (estadisticas.compras_por_metodo[a] || 0) > (estadisticas.compras_por_metodo[b] || 0) ? a : b, 'efectivo'),
      horasPicoCompras: estadisticas.horas_pico || [
        { hora: '09:00', compras: 15 },
        { hora: '11:00', compras: 25 },
        { hora: '14:00', compras: 20 },
        { hora: '16:00', compras: 18 }
      ],
      estacionalidad: estadisticas.estacionalidad || [
        { mes: 'Ene', compras: 45, gasto: 12000 },
        { mes: 'Feb', compras: 52, gasto: 15000 },
        { mes: 'Mar', compras: 48, gasto: 13500 },
        { mes: 'Abr', compras: 60, gasto: 18000 },
        { mes: 'May', compras: 55, gasto: 16500 },
        { mes: 'Jun', compras: 58, gasto: 17200 }
      ],
      eficienciaCompras: estadisticas.eficiencia_compras || 85,
    };

    return {
      totalInvertidoMes: parseFloat(estadisticas.total_invertido_mes) || 0.0,
      comprasMes: parseInt(estadisticas.compras_mes) || 0,
      gastoPromedio: parseFloat(estadisticas.gasto_promedio) || 0.0,
      totalCompras: parseInt(estadisticas.total_compras) || 0,
      gastoTotal: parseFloat(estadisticas.gasto_total) || 0.0,
      topProveedores: Array.isArray(estadisticas.top_proveedores) ? estadisticas.top_proveedores.map(proveedor => ({
        id: proveedor.id,
        nombre: proveedor.nombre || 'Sin nombre',
        total_compras: parseInt(proveedor.total_compras) || 0,
        total_gastado: parseFloat(proveedor.total_gastado) || 0.0,
        ultimo_pedido: proveedor.ultimo_pedido,
        eficiencia: Math.random() * 100, // Simulado
        rating: 4 + Math.random(), // Simulado,
      })).filter(Boolean) : [],
      productosMasComprados: Array.isArray(estadisticas.productos_mas_comprados) ? estadisticas.productos_mas_comprados.map(producto => ({
        producto_id: producto.producto_id,
        producto: producto.producto || producto.nombre || 'Sin nombre',
        cantidad_total: parseFloat(producto.cantidad_total) || 0,
        veces_comprado: parseInt(producto.veces_comprado) || 0,
        gasto_total: parseFloat(producto.gasto_total) || 0.0,
        categoria: producto.categoria || 'Sin categoría',
        tendencia: Math.random() > 0.5 ? 'up' : 'down', // Simulado
      })).filter(Boolean) : [],
      comprasPorMetodo: estadisticas.compras_por_metodo || {},
      tendenciaMensual: Array.isArray(estadisticas.tendencia_mensual) ? estadisticas.tendencia_mensual : [],
      comparacionMesAnterior: estadisticas.comparacion_mes_anterior || { porcentaje: 0, esPositiva: true },
      alertas: estadisticas.alertas || [],
      metricsAvanzadas,
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

  // Calcular tendencias simuladas
  const tendencias = useMemo(() => {
    const mesAnterior = statsCalculadasMemo.totalInvertidoMes * 0.85;
    const promedioAnterior = statsCalculadasMemo.gastoPromedio * 0.92;
    const comprasAnterior = statsCalculadasMemo.comprasMes * 0.88;
    
    return {
      invertido: {
        porcentaje: mesAnterior > 0 ? Math.round(((statsCalculadasMemo.totalInvertidoMes - mesAnterior) / mesAnterior) * 100) : 0,
        esPositiva: statsCalculadasMemo.totalInvertidoMes >= mesAnterior
      },
      promedio: {
        porcentaje: promedioAnterior > 0 ? Math.round(((statsCalculadasMemo.gastoPromedio - promedioAnterior) / promedioAnterior) * 100) : 0,
        esPositiva: statsCalculadasMemo.gastoPromedio >= promedioAnterior
      },
      compras: {
        porcentaje: comprasAnterior > 0 ? Math.round(((statsCalculadasMemo.comprasMes - comprasAnterior) / comprasAnterior) * 100) : 0,
        esPositiva: statsCalculadasMemo.comprasMes >= comprasAnterior
      },
      proveedores: { porcentaje: 3, esPositiva: true },
    };
  }, [statsCalculadasMemo]);

  // Datos para gráficos
  const chartData = useMemo(() => {
    const metodoPagoData = Object.entries(statsCalculadasMemo.comprasPorMetodo).map(([metodo, cantidad]) => ({
      name: metodo.charAt(0).toUpperCase() + metodo.slice(1),
      value: cantidad,
      color: {
        efectivo: '#10B981',
        transferencia: '#3B82F6',
        cheque: '#F59E0B',
        credito: '#8B5CF6'
      }[metodo] || '#6B7280'
    }));

    return {
      metodoPago: metodoPagoData,
      tendenciaMensual: statsCalculadasMemo.metricsAvanzadas.estacionalidad,
      horasPico: statsCalculadasMemo.metricsAvanzadas.horasPicoCompras,
    };
  }, [statsCalculadasMemo]);

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
      value: formatCurrency(statsCalculadasMemo.totalInvertidoMes),
      subtitle: `${statsCalculadasMemo.comprasMes} compras realizadas`,
      icon: AttachMoney,
      color: '#10B981',
      bgGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      bgColor: alpha('#10B981', 0.1),
      trend: `${tendencias.invertido.porcentaje}%`,
      trendUp: tendencias.invertido.esPositiva,
      metric: 'invertido',
    },
    {
      title: 'Gasto Promedio',
      value: formatCurrency(statsCalculadasMemo.gastoPromedio),
      subtitle: 'Por compra realizada',
      icon: Assessment,
      color: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      bgColor: alpha('#3B82F6', 0.1),
      trend: `${tendencias.promedio.porcentaje}%`,
      trendUp: tendencias.promedio.esPositiva,
      metric: 'promedio',
    },
    {
      title: 'Total Compras',
      value: statsCalculadasMemo.totalCompras.toLocaleString(),
      subtitle: `${formatCurrency(statsCalculadasMemo.gastoTotal)} invertido total`,
      icon: ShoppingCart,
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      bgColor: alpha('#F59E0B', 0.1),
      trend: `${tendencias.compras.porcentaje}%`,
      trendUp: tendencias.compras.esPositiva,
      metric: 'compras',
    },
    {
      title: 'Eficiencia',
      value: `${statsCalculadasMemo.metricsAvanzadas.eficienciaCompras}%`,
      subtitle: 'Índice de eficiencia',
      icon: Speed,
      color: '#8B5CF6',
      bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      bgColor: alpha('#8B5CF6', 0.1),
      trend: `${tendencias.proveedores.porcentaje}%`,
      trendUp: tendencias.proveedores.esPositiva,
      metric: 'eficiencia',
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
                  cursor: 'pointer',
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
                onClick={() => setExpandedCard(expandedCard === stat.metric ? null : stat.metric)}
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
                    <Tooltip title="Más detalles">
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        {expandedCard === stat.metric ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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

      {/* Panel expandido con detalles */}
      <AnimatePresence>
        {expandedCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              sx={{ 
                mb: 4,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Análisis Detallado - {statsCards.find(s => s.metric === expandedCard)?.title}
                  </Typography>
                  
                  <Tabs 
                    value={selectedTab} 
                    onChange={(e, newValue) => setSelectedTab(newValue)}
                    sx={{ mb: 3 }}
                  >
                    <Tab label="Tendencias" icon={<TimelineIcon />} />
                    <Tab label="Distribución" icon={<PieChartIcon />} />
                    <Tab label="Comparativas" icon={<BarChartIcon />} />
                  </Tabs>
                </Box>

                <Box sx={{ p: 3, pt: 0 }}>
                  {selectedTab === 0 && (
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.tendenciaMensual}>
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                          <XAxis 
                            dataKey="mes" 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <YAxis 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                              borderRadius: 8,
                              boxShadow: theme.shadows[8],
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="gasto" 
                            stroke={theme.palette.primary.main}
                            fill={alpha(theme.palette.primary.main, 0.2)}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  )}

                  {selectedTab === 1 && (
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center' }}>
                      <ResponsiveContainer width="50%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.metodoPago}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.metodoPago.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ flex: 1, pl: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Métodos de Pago
                        </Typography>
                        {chartData.metodoPago.map((item, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box 
                              sx={{ 
                                width: 12, 
                                height: 12, 
                                bgcolor: item.color, 
                                borderRadius: '50%', 
                                mr: 1 
                              }} 
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {selectedTab === 2 && (
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.horasPico}>
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                          <XAxis 
                            dataKey="hora" 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <YAxis 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                              borderRadius: 8,
                              boxShadow: theme.shadows[8],
                            }}
                          />
                          <Bar 
                            dataKey="compras" 
                            fill={theme.palette.success.main}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
                height: 450,
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
                  {statsCalculadasMemo.topProveedores.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {statsCalculadasMemo.topProveedores.slice(0, 5).map((proveedor, index) => (
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <Box 
                                  sx={{ 
                                    width: 6, 
                                    height: 6, 
                                    borderRadius: '50%', 
                                    bgcolor: proveedor.eficiencia > 80 ? '#10B981' : proveedor.eficiencia > 60 ? '#F59E0B' : '#EF4444' 
                                  }} 
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {proveedor.eficiencia?.toFixed(0)}% eficiencia
                                </Typography>
                              </Box>
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
                height: 450,
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
                  {statsCalculadasMemo.productosMasComprados.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {statsCalculadasMemo.productosMasComprados.slice(0, 5).map((producto, index) => {
                        const maxCantidad = statsCalculadasMemo.productosMasComprados[0]?.cantidad_total || 1;
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
                                    {producto.tendencia && (
                                      <Chip
                                        icon={producto.tendencia === 'up' ? <TrendingUp /> : <TrendingDown />}
                                        label=""
                                        size="small"
                                        sx={{
                                          width: 24,
                                          height: 20,
                                          '& .MuiChip-icon': {
                                            margin: 0,
                                            fontSize: '0.875rem',
                                            color: producto.tendencia === 'up' ? '#10B981' : '#EF4444',
                                          }
                                        }}
                                      />
                                    )}
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

      {/* Métricas adicionales */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, p: 2, textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {statsCalculadasMemo.metricsAvanzadas.frecuenciaCompras} días
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Frecuencia promedio entre compras
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, p: 2, textAlign: 'center' }}>
            <BusinessIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {statsCalculadasMemo.metricsAvanzadas.proveedorMasUsado?.nombre || 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Proveedor más frecuente
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, p: 2, textAlign: 'center' }}>
            <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {statsCalculadasMemo.metricsAvanzadas.metodoPagoPreferido}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Método de pago preferido
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Alerta informativa si no hay datos */}
      {!loading && (!estadisticas || (statsCalculadasMemo.totalCompras === 0 && statsCalculadasMemo.topProveedores.length === 0)) && (
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