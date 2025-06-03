import React, { useState, useEffect } from 'react';
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
  Avatar,
  Stack,
  Tooltip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
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
  Person,
  Group,
  Star,
  ExpandMore,
  ExpandLess,
  TrendingDown,
  Schedule,
  Category,
  EmojiEvents,
  Speed,
  Insights,
  Analytics,
  PersonAdd,
  ShoppingBag,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ventasService } from '../../../services/ventasService';

const VentasStats = ({ estadisticas, loading }) => {
  const theme = useTheme();
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [datosRelacionados, setDatosRelacionados] = useState(null);
  const [analisisVendedores, setAnalisisVendedores] = useState(null);
  const [analisisProductos, setAnalisisProductos] = useState(null);
  const [analisisClientes, setAnalisisClientes] = useState(null);
  const [metricasEnTiempoReal, setMetricasEnTiempoReal] = useState(null);
  const [loadingRelacionados, setLoadingRelacionados] = useState(false);

  useEffect(() => {
    if (estadisticas && !loadingRelacionados) {
      cargarDatosRelacionados();
    }
  }, [estadisticas]);

  const cargarDatosRelacionados = async () => {
    setLoadingRelacionados(true);
    try {
      const [relacionados, vendedores, productos, clientes, metricas] = await Promise.all([
        ventasService.obtenerDatosRelacionados(),
        ventasService.obtenerAnalisisVendedores(),
        ventasService.obtenerAnalisisProductos(),
        ventasService.obtenerAnalisisClientes(),
        ventasService.obtenerMetricasEnTiempoReal(),
      ]);

      setDatosRelacionados(relacionados);
      setAnalisisVendedores(vendedores);
      setAnalisisProductos(productos);
      setAnalisisClientes(clientes);
      setMetricasEnTiempoReal(metricas);
    } catch (error) {
      console.error('Error cargando datos relacionados:', error);
    } finally {
      setLoadingRelacionados(false);
    }
  };

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

  const toggleCardExpansion = (cardId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const StatCard = ({ 
    id,
    title, 
    value, 
    icon: Icon, 
    gradient, 
    subtitle, 
    trend,
    trendValue,
    delay = 0,
    progress,
    chip,
    expandable = false,
    children,
    badge,
    relatedData = []
  }) => {
    const isExpanded = expandedCards.has(id);

    return (
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
            height: expandable && isExpanded ? 'auto' : '100%',
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {badge && (
                  <Badge badgeContent={badge} color="error">
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Icon sx={{ fontSize: 24 }} />
                    </Box>
                  </Badge>
                )}
                {!badge && (
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Icon sx={{ fontSize: 24 }} />
                  </Box>
                )}
                {expandable && (
                  <IconButton
                    size="small"
                    onClick={() => toggleCardExpansion(id)}
                    sx={{ color: 'white', opacity: 0.8 }}
                  >
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </Box>
            </Box>
            
            {/* Value */}
            {loading || loadingRelacionados ? (
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

            {/* Related Data Preview */}
            {relatedData.length > 0 && !isExpanded && (
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {relatedData.slice(0, 3).map((item, index) => (
                    <Chip
                      key={index}
                      label={item.label}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    />
                  ))}
                  {relatedData.length > 3 && (
                    <Typography variant="caption" sx={{ opacity: 0.7, alignSelf: 'center' }}>
                      +{relatedData.length - 3} más
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}

            {/* Expanded Content */}
            <AnimatePresence>
              {expandable && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
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
  };

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
    pink: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    green: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    blue: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
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
          📊 Dashboard Completo de Ventas
        </Typography>
      </motion.div>
      
      <Grid container spacing={3}>
        {/* Métricas en Tiempo Real */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            id="tiempo-real"
            title="Tiempo Real"
            value={loading ? '...' : formatNumber(metricasEnTiempoReal?.ventas_ultima_hora || 0)}
            icon={Speed}
            gradient={gradients.error}
            subtitle="Ventas última hora"
            badge={metricasEnTiempoReal?.tendencia_actual === 'subiendo' ? '🔥' : null}
            expandable={true}
            delay={0}
            relatedData={[
              { label: `${formatCurrency(metricasEnTiempoReal?.ingresos_ultima_hora || 0)}` },
              { label: `${metricasEnTiempoReal?.productos_vendidos_hoy || 0} productos` },
              { label: `${metricasEnTiempoReal?.clientes_atendidos_hoy || 0} clientes` }
            ]}
          >
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <AttachMoney />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Ingresos última hora"
                  secondary={formatCurrency(metricasEnTiempoReal?.ingresos_ultima_hora || 0)}
                  sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <ShoppingBag />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Productos vendidos hoy"
                  secondary={`${metricasEnTiempoReal?.productos_vendidos_hoy || 0} unidades`}
                  sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </ListItem>
              {metricasEnTiempoReal?.vendedor_del_dia && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <EmojiEvents />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Vendedor del día"
                    secondary={metricasEnTiempoReal.vendedor_del_dia}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              )}
            </List>
          </StatCard>
        </Grid>

        {/* Ventas Hoy */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            id="ventas-hoy"
            title="Ventas Hoy"
            value={loading ? '...' : formatNumber(estadisticas?.ventas_hoy || 0)}
            icon={Today}
            gradient={gradients.primary}
            subtitle="Transacciones del día"
            trend="+12% vs ayer"
            expandable={true}
            delay={0.1}
            relatedData={analisisClientes?.clientes_nuevos?.slice(0, 3).map(c => ({ label: c.nombre })) || []}
          >
            <List dense>
              {analisisClientes?.clientes_frecuentes?.slice(0, 3).map((cliente, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={cliente.nombre}
                    secondary={`${cliente.total_compras} compras - ${formatCurrency(cliente.total_gastado)}`}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              )) || []}
            </List>
          </StatCard>
        </Grid>
        
        {/* Ingresos Hoy */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            id="ingresos-hoy"
            title="Ingresos Hoy"
            value={loading ? '...' : formatCurrency(estadisticas?.ingresos_hoy)}
            icon={AttachMoney}
            gradient={gradients.success}
            subtitle="Facturación del día"
            trend="+8% vs ayer"
            expandable={true}
            delay={0.2}
            relatedData={[
              { label: `Ticket promedio: ${formatCurrency(estadisticas?.venta_promedio || 0)}` },
              { label: `Meta: ${formatCurrency((estadisticas?.ingresos_hoy || 0) * 1.2)}` }
            ]}
          >
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Assessment />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Ticket promedio"
                  secondary={formatCurrency(estadisticas?.venta_promedio || 0)}
                  sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Timeline />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Tendencia"
                  secondary="Crecimiento sostenido"
                  sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </ListItem>
            </List>
          </StatCard>
        </Grid>
        
        {/* Ventas del Mes */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            id="ventas-mes"
            title="Ventas del Mes"
            value={loading ? '...' : formatNumber(estadisticas?.ventas_mes || 0)}
            icon={CalendarMonth}
            gradient={gradients.info}
            subtitle="Transacciones mensuales"
            progress={75}
            expandable={true}
            delay={0.3}
            relatedData={analisisVendedores?.vendedores?.slice(0, 3).map(v => ({ label: `${v.nombre}: ${v.ventas}` })) || []}
          >
            <List dense>
              {analisisVendedores?.vendedores?.slice(0, 3).map((vendedor, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={vendedor.nombre}
                    secondary={`${vendedor.ventas} ventas - ${formatCurrency(vendedor.ingresos)}`}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              )) || []}
            </List>
          </StatCard>
        </Grid>
        
        {/* Productos Top */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            id="productos-top"
            title="Top Productos"
            value={loading ? '...' : (
            estadisticas?.producto_mas_vendido || 'N/A')}
            icon={LocalOffer}
            gradient={gradients.warning}
            subtitle="Producto estrella"
            expandable={true}
            delay={0.4}
            relatedData={analisisProductos?.productos_top?.slice(0, 3).map(p => ({ label: `${p.nombre}: ${p.cantidad_vendida}` })) || []}
          >
            <List dense>
              {analisisProductos?.productos_top?.slice(0, 5).map((producto, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <ShoppingCart />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={producto.nombre}
                    secondary={`${producto.cantidad_vendida} vendidos - ${formatCurrency(producto.ingresos_generados)}`}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              )) || []}
            </List>
          </StatCard>
        </Grid>

        {/* Clientes Frecuentes */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            id="clientes-frecuentes"
            title="Clientes VIP"
            value={loading ? '...' : formatNumber(analisisClientes?.clientes_frecuentes?.length || 0)}
            icon={Group}
            gradient={gradients.purple}
            subtitle="Clientes frecuentes"
            expandable={true}
            delay={0.5}
            relatedData={analisisClientes?.clientes_frecuentes?.slice(0, 3).map(c => ({ label: `${c.nombre}: ${c.total_compras}` })) || []}
          >
            <List dense>
              {analisisClientes?.clientes_frecuentes?.slice(0, 5).map((cliente, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <Star />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={cliente.nombre}
                    secondary={`${cliente.total_compras} compras - ${formatCurrency(cliente.total_gastado)}`}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              )) || []}
            </List>
          </StatCard>
        </Grid>

        {/* Forma de Pago Preferida */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            id="forma-pago"
            title="Forma de Pago"
            value={loading ? '...' : (estadisticas?.forma_pago_preferida || 'Efectivo')}
            icon={CreditCard}
            gradient={gradients.orange}
            subtitle="Método preferido"
            expandable={true}
            delay={0.6}
            relatedData={Object.entries(estadisticas?.ventas_por_forma_pago || {}).map(([forma, cantidad]) => ({ label: `${forma}: ${cantidad}` }))}
          >
            <List dense>
              {Object.entries(estadisticas?.ventas_por_forma_pago || {}).map(([forma, cantidad], index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <CreditCard />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={forma.charAt(0).toUpperCase() + forma.slice(1)}
                    secondary={`${cantidad} transacciones`}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              ))}
            </List>
          </StatCard>
        </Grid>

        {/* Análisis de Categorías */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            id="categorias"
            title="Categorías Top"
            value={loading ? '...' : formatNumber(estadisticas?.categorias_mas_vendidas?.length || 0)}
            icon={Category}
            gradient={gradients.teal}
            subtitle="Categorías activas"
            expandable={true}
            delay={0.7}
            relatedData={estadisticas?.categorias_mas_vendidas?.slice(0, 3).map(c => ({ label: `${c.categoria}: ${c.ventas}` })) || []}
          >
            <List dense>
              {estadisticas?.categorias_mas_vendidas?.slice(0, 3).map((categoria, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <Category />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={categoria.categoria}
                    secondary={`${categoria.ventas} ventas - ${formatCurrency(categoria.ingresos)}`}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              )) || []}
            </List>
          </StatCard>
        </Grid>

        {/* Clientes Nuevos */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            id="clientes-nuevos"
            title="Clientes Nuevos"
            value={loading ? '...' : formatNumber(estadisticas?.clientes_nuevos_mes || 0)}
            icon={PersonAdd}
            gradient={gradients.pink}
            subtitle="Este mes"
            trend="+15% vs mes anterior"
            expandable={true}
            delay={0.8}
            relatedData={analisisClientes?.clientes_nuevos?.slice(0, 3).map(c => ({ label: c.nombre })) || []}
          >
            <List dense>
              {analisisClientes?.clientes_nuevos?.slice(0, 5).map((cliente, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <PersonAdd />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={cliente.nombre}
                    secondary={`Registrado: ${new Date(cliente.fecha_registro).toLocaleDateString()}`}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              )) || []}
            </List>
          </StatCard>
        </Grid>

        {/* Horarios Pico */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            id="horarios-pico"
            title="Horarios Pico"
            value={loading ? '...' : (estadisticas?.horarios_pico?.[0]?.hora || 'N/A')}
            icon={Schedule}
            gradient={gradients.green}
            subtitle="Hora más activa"
            expandable={true}
            delay={0.9}
            relatedData={estadisticas?.horarios_pico?.slice(0, 3).map(h => ({ label: `${h.hora}: ${h.ventas} ventas` })) || []}
          >
            <List dense>
              {estadisticas?.horarios_pico?.slice(0, 5).map((horario, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <Schedule />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${horario.hora}:00`}
                    secondary={`${horario.ventas} ventas - ${formatCurrency(horario.ingresos)}`}
                    sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                  />
                </ListItem>
              )) || []}
            </List>
          </StatCard>
        </Grid>

        {/* Análisis de Rendimiento */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            id="rendimiento"
            title="Rendimiento"
            value={loading ? '...' : '📈'}
            icon={Analytics}
            gradient={gradients.blue}
            subtitle="Análisis general"
            expandable={true}
            delay={1.0}
            relatedData={[
              { label: `Crecimiento: ${estadisticas?.comparacion_mes_anterior?.crecimiento || 0}%` },
              { label: `Eficiencia: ${estadisticas?.comparacion_mes_anterior?.eficiencia || 0}%` }
            ]}
          >
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <TrendingUp />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Crecimiento mensual"
                  secondary={`${estadisticas?.comparacion_mes_anterior?.crecimiento || 0}%`}
                  sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Assessment />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Eficiencia operativa"
                  secondary={`${estadisticas?.comparacion_mes_anterior?.eficiencia || 0}%`}
                  sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Insights />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Tendencia general"
                  secondary="Positiva y sostenible"
                  sx={{ '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' } }}
                />
              </ListItem>
            </List>
          </StatCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VentasStats;