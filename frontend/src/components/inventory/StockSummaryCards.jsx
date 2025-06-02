import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StockSummaryCards = ({ 
  estadisticas, 
  onRefresh, 
  loading = false,
  onCardClick 
}) => {
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

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-UY').format(number);
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUpIcon fontSize="small" sx={{ color: 'success.main' }} />;
    if (trend < 0) return <TrendingDownIcon fontSize="small" sx={{ color: 'error.main' }} />;
    return null;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'success.main';
    if (trend < 0) return 'error.main';
    return 'text.secondary';
  };

  const cards = [
    {
      id: 'total_productos',
      title: 'Total Productos',
      value: formatNumber(estadisticas.estadisticas_generales?.total_productos || 0),
      icon: InventoryIcon,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      description: 'Productos activos',
      trend: estadisticas.tendencias?.tendencia_porcentual || 0,
      subtitle: `+${estadisticas.tendencias?.productos_nuevos_mes || 0} este mes`,
      clickable: true,
    },
    {
      id: 'stock_bajo',
      title: 'Stock Bajo',
      value: formatNumber(estadisticas.estadisticas_generales?.productos_stock_bajo || 0),
      icon: WarningIcon,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      description: 'Requieren reposición',
      alert: (estadisticas.estadisticas_generales?.productos_stock_bajo || 0) > 0,
      percentage: estadisticas.estadisticas_generales?.total_productos > 0 
        ? ((estadisticas.estadisticas_generales.productos_stock_bajo / estadisticas.estadisticas_generales.total_productos) * 100).toFixed(1)
        : 0,
      clickable: true,
    },
    {
      id: 'valor_inventario',
      title: 'Valor Inventario',
      value: formatCurrency(estadisticas.estadisticas_generales?.valor_inventario || 0),
      icon: MoneyIcon,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      description: 'Valor total del stock',
      isMonetary: true,
      clickable: true,
    },
    {
      id: 'sin_stock',
      title: 'Sin Stock',
      value: formatNumber(estadisticas.estadisticas_generales?.productos_sin_stock || 0),
      icon: AssessmentIcon,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
      description: 'Productos agotados',
      alert: (estadisticas.estadisticas_generales?.productos_sin_stock || 0) > 0,
      critical: true,
      clickable: true,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header con botón de actualizar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          Resumen del Inventario
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            Última actualización: {new Date(estadisticas.fecha_actualizacion).toLocaleTimeString('es-UY')}
          </Typography>
          <Tooltip title="Actualizar datos">
            <IconButton 
              onClick={onRefresh} 
              disabled={loading}
              size="small"
              sx={{
                animation: loading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Tarjetas principales */}
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.id}>
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
                  cursor: card.clickable ? 'pointer' : 'default',
                  '&:hover': card.clickable ? {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-4px)',
                  } : {},
                  border: card.alert ? `2px solid ${card.color}` : 'none',
                  position: 'relative',
                  overflow: 'visible',
                }}
                onClick={() => card.clickable && onCardClick && onCardClick(card.id)}
              >
                {/* Indicador de alerta crítica */}
                {card.critical && card.alert && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)', opacity: 1 },
                        '50%': { transform: 'scale(1.1)', opacity: 0.7 },
                        '100%': { transform: 'scale(1)', opacity: 1 },
                      },
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 14, color: 'white' }} />
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          {card.title}
                        </Typography>
                        {card.trend !== undefined && card.trend !== 0 && (
                          <Tooltip title={`${card.trend > 0 ? '+' : ''}${card.trend.toFixed(1)}% vs mes anterior`}>
                            {getTrendIcon(card.trend)}
                          </Tooltip>
                        )}
                      </Box>
                      
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color={card.color}
                        sx={{ mb: 1 }}
                      >
                        {card.value}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary">
                        {card.description}
                      </Typography>

                      {/* Información adicional */}
                      {card.subtitle && (
                        <Typography 
                          variant="caption" 
                          color={getTrendColor(card.trend)}
                          sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}
                        >
                          {card.subtitle}
                        </Typography>
                      )}

                      {/* Porcentaje para stock bajo */}
                      {card.percentage !== undefined && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {card.percentage}% del inventario
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(parseFloat(card.percentage), 100)}
                            color={card.percentage > 20 ? "error" : "warning"}
                            sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      )}

                      {/* Chip de alerta */}
                      {card.alert && (
                        <Chip
                          label={card.critical ? "¡Crítico!" : "¡Atención!"}
                          color={card.critical ? "error" : "warning"}
                          size="small"
                          sx={{ mt: 1, fontWeight: 600 }}
                        />
                      )}
                    </Box>
                    
                    <Avatar
                      sx={{
                        bgcolor: card.bgColor,
                        color: card.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <card.icon fontSize="large" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Tarjeta de movimientos recientes */}
        <Grid item xs={12} md={6}>
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
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                    }}
                  >
                    <AssessmentIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Movimientos (7 días)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actividad reciente del inventario
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} borderRadius={2} bgcolor={alpha(theme.palette.success.main, 0.1)}>
                      <Typography variant="h5" fontWeight={700} color="success.main">
                        {estadisticas.movimientos_recientes?.ingresos || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ingresos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={2} borderRadius={2} bgcolor={alpha(theme.palette.error.main, 0.1)}>
                      <Typography variant="h5" fontWeight={700} color="error.main">
                        {estadisticas.movimientos_recientes?.egresos || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Egresos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box textAlign="center" p={2} borderRadius={2} bgcolor={alpha(theme.palette.warning.main, 0.1)}>
                      <Typography variant="h5" fontWeight={700} color="warning.main">
                        {estadisticas.movimientos_recientes?.ajustes || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ajustes manuales
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Tarjeta de proveedores principales */}
        <Grid item xs={12} md={6}>
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
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <InventoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Proveedores Principales
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Top 3 por productos suministrados
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  {estadisticas.proveedores_principales?.slice(0, 3).map((proveedor, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1.5}
                      borderBottom={index < 2 ? '1px solid' : 'none'}
                      borderColor="divider"
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {proveedor.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {proveedor.productos_suministrados} productos
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" color="primary" fontWeight={600}>
                          {formatCurrency(proveedor.valor_inventario)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          valor stock
                        </Typography>
                      </Box>
                    </Box>
                  )) || (
                    <Box textAlign="center" py={3}>
                      <Typography variant="body2" color="text.secondary">
                        No hay datos de proveedores
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Alertas importantes */}
      {estadisticas.alertas && estadisticas.alertas.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Alertas Importantes
          </Typography>
          <Grid container spacing={2}>
            {estadisticas.alertas.map((alerta, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: 2,
                      border: `2px solid ${
                        alerta.tipo === 'critico' ? theme.palette.error.main : theme.palette.warning.main
                      }`,
                      bgcolor: alpha(
                        alerta.tipo === 'critico' ? theme.palette.error.main : theme.palette.warning.main,
                        0.05
                      ),
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: alerta.tipo === 'critico' ? 'error.main' : 'warning.main',
                            color: 'white',
                            width: 40,
                            height: 40,
                          }}
                        >
                          <WarningIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {alerta.mensaje}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {alerta.accion}
                          </Typography>
                        </Box>
                        <Tooltip title="Más información">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default StockSummaryCards;