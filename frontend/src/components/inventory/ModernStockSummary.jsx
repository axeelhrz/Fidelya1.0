import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ModernStockSummary = ({ resumen, loading = false, sx = {} }) => {
  const theme = useTheme();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const getStockHealthColor = (percentage) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getStockHealthLabel = (percentage) => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Crítico';
  };

  if (loading) {
    return (
      <Grid container spacing={3} sx={sx}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width="60%" height={32} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="40%" height={24} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!resumen) return null;

  const stockSaludable = resumen.total_productos > 0 
    ? ((resumen.total_productos - resumen.productos_stock_bajo - resumen.productos_sin_stock) / resumen.total_productos) * 100
    : 0;

  const cards = [
    {
      title: 'Total Productos',
      value: formatNumber(resumen.total_productos || 0),
      icon: <InventoryIcon />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      subtitle: 'Productos activos',
    },
    {
      title: 'Valor Inventario',
      value: formatCurrency(resumen.valor_total_inventario || 0),
      icon: <MoneyIcon />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      subtitle: 'Valor total en stock',
    },
    {
      title: 'Stock Bajo',
      value: formatNumber(resumen.productos_stock_bajo || 0),
      icon: <TrendingDownIcon />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      subtitle: 'Requieren reposición',
      alert: (resumen.productos_stock_bajo || 0) > 0,
    },
    {
      title: 'Sin Stock',
      value: formatNumber(resumen.productos_sin_stock || 0),
      icon: <WarningIcon />,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
      subtitle: 'Productos agotados',
      alert: (resumen.productos_sin_stock || 0) > 0,
    },
  ];

  return (
    <Box sx={sx}>
      {/* Tarjetas principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {card.alert && (
                  <Chip
                    label="¡Atención!"
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: 16,
                      zIndex: 1,
                      fontWeight: 600,
                    }}
                  />
                )}
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: card.bgColor,
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {card.icon}
                    </Box>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="text.primary"
                        sx={{ mb: 0.5 }}
                      >
                        {card.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {card.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Indicador de salud del stock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(getStockHealthColor(stockSaludable), 0.1),
                  color: getStockHealthColor(stockSaludable),
                }}
              >
                <TrendingUpIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Salud del Inventario
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getStockHealthLabel(stockSaludable)} - {stockSaludable.toFixed(1)}% de productos con stock adecuado
                </Typography>
              </Box>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={stockSaludable}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.grey[500], 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: getStockHealthColor(stockSaludable),
                  borderRadius: 4,
                },
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Distribución por categorías */}
      {resumen.distribucion_categorias && resumen.distribucion_categorias.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                  }}
                >
                  <CategoryIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Distribución por Categorías
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos y valor por categoría
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {resumen.distribucion_categorias.map((categoria, index) => (
                  <Grid item xs={12} sm={6} md={4} key={categoria.categoria}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="text.primary"
                        sx={{ mb: 1 }}
                      >
                        {categoria.categoria}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(categoria.total_productos)} productos
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(categoria.valor_total)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default ModernStockSummary;