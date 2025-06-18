import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Collapse,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import {
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Inventory as InventoryIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModernLowStockAlert = ({ productos = [], onAjustarStock, sx = {} }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!productos || productos.length === 0) {
    return null;
  }

  const formatNumber = (value) => {
    const number = Number(value) || 0;
    return new Intl.NumberFormat('es-CO').format(number);
  };

  const getStockSeverity = (producto) => {
    const stockActual = Number(producto.stock_actual) || 0;
    const stockMinimo = Number(producto.stock_minimo) || 0;
    if (stockActual === 0) return 'critical';
    if (stockMinimo > 0 && stockActual <= stockMinimo * 0.5) return 'high';
    return 'medium';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return theme.palette.error.main;
      case 'high':
        return theme.palette.warning.main;
      case 'medium':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'critical':
        return 'Crítico';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
      default:
        return 'Bajo';
    }
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2 };
    const aSeverity = getStockSeverity(a);
    const bSeverity = getStockSeverity(b);
    return severityOrder[aSeverity] - severityOrder[bSeverity];
  });

  const productosCriticos = productosOrdenados.filter(p => getStockSeverity(p) === 'critical');
  const productosAltos = productosOrdenados.filter(p => getStockSeverity(p) === 'high');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={sx}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `2px solid ${theme.palette.warning.main}`,
          bgcolor: alpha(theme.palette.warning.main, 0.02),
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Indicador de alerta */}
        <Box
          sx={{
            position: 'absolute',
            top: -1,
            left: -1,
            right: -1,
            height: 4,
            bgcolor: theme.palette.warning.main,
            borderRadius: '12px 12px 0 0',
          }}
        />

        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
              }}
            >
              <WarningIcon fontSize="large" />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                ⚠️ Alerta de Stock Bajo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {productos.length} producto{productos.length !== 1 ? 's' : ''} requiere{productos.length === 1 ? '' : 'n'} atención inmediata
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {productosCriticos.length > 0 && (
                <Chip
                  label={`${productosCriticos.length} Crítico${productosCriticos.length !== 1 ? 's' : ''}`}
                  size="small"
                  color="error"
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
              )}
              
              {productosAltos.length > 0 && (
                <Chip
                  label={`${productosAltos.length} Alto${productosAltos.length !== 1 ? 's' : ''}`}
                  size="small"
                  color="warning"
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>

            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                color: theme.palette.warning.main,
                '&:hover': {
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                },
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {/* Resumen rápido */}
          {!expanded && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {productosOrdenados.slice(0, 3).map((producto) => {
                const severity = getStockSeverity(producto);
                return (
                  <Chip
                    key={producto.id}
                    label={`${producto.nombre}: ${formatNumber(producto.stock_actual)}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(getSeverityColor(severity), 0.1),
                      color: getSeverityColor(severity),
                      fontWeight: 500,
                    }}
                  />
                );
              })}
              {productos.length > 3 && (
                <Chip
                  label={`+${productos.length - 3} más`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              )}
            </Box>
          )}

          {/* Lista detallada */}
          <Collapse in={expanded}>
            <Box sx={{ mt: 2 }}>
              <List disablePadding>
                <AnimatePresence>
                  {productosOrdenados.map((producto, index) => {
                    const severity = getStockSeverity(producto);
                    const severityColor = getSeverityColor(severity);
                    
                    return (
                      <motion.div
                        key={producto.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <ListItem
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            bgcolor: alpha(severityColor, 0.05),
                            border: `1px solid ${alpha(severityColor, 0.2)}`,
                            '&:hover': {
                              bgcolor: alpha(severityColor, 0.1),
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: alpha(severityColor, 0.1),
                              color: severityColor,
                              mr: 2,
                              fontSize: '1rem',
                              fontWeight: 600,
                            }}
                          >
                            {producto.nombre?.charAt(0)?.toUpperCase() || 'P'}
                          </Avatar>
                          
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {producto.nombre}
                                </Typography>
                                <Chip
                                  label={getSeverityLabel(severity)}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(severityColor, 0.2),
                                    color: severityColor,
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: 20,
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Stock actual: <strong>{formatNumber(producto.stock_actual)}</strong> | 
                                  Mínimo: <strong>{formatNumber(producto.stock_minimo)}</strong>
                                </Typography>
                                {producto.categoria && (
                                  <Typography variant="caption" color="text.secondary">
                                    Categoría: {producto.categoria}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          
                          <ListItemSecondaryAction>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<InventoryIcon />}
                              onClick={() => onAjustarStock(producto)}
                              sx={{
                                bgcolor: severityColor,
                                color: 'white',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                '&:hover': {
                                  bgcolor: alpha(severityColor, 0.8),
                                },
                              }}
                            >
                              Ajustar
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </List>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModernLowStockAlert;