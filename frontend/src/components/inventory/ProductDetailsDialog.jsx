import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Assessment as StatsIcon,
  LocalOffer as PriceIcon,
  Category as CategoryIcon,
  Business as SupplierIcon,
  Scale as UnitIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import inventoryServiceEnhanced from '../../services/inventoryServiceEnhanced';

const ProductDetailsDialog = ({ 
  open, 
  onClose, 
  producto = null,
  onEditProduct,
  onAdjustStock 
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [movimientos, setMovimientos] = useState([]);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);

  // Cargar datos adicionales cuando se abre el diálogo
  useEffect(() => {
    if (open && producto) {
      cargarMovimientos();
      calcularEstadisticas();
    }
  }, [open, producto]);

  const cargarMovimientos = async () => {
    if (!producto) return;
    
    try {
      setLoadingMovimientos(true);
      const historial = await inventoryServiceEnhanced.obtenerHistorialProducto(
        producto.id, 
        { limite: 20 }
      );
      setMovimientos(historial);
    } catch (error) {
      console.error('Error cargando movimientos:', error);
      setMovimientos([]);
    } finally {
      setLoadingMovimientos(false);
    }
  };

  const calcularEstadisticas = () => {
    if (!producto) return;

    const stockActual = Number(producto.stock_actual) || 0;
    const stockMinimo = Number(producto.stock_minimo) || 0;
    const precioUnitario = Number(producto.precio_unitario) || 0;
    const valorTotal = stockActual * precioUnitario;

    // Calcular estadísticas de movimientos
    const totalMovimientos = movimientos.length;
    const ingresos = movimientos.filter(m => m.tipo === 'ingreso').length;
    const egresos = movimientos.filter(m => m.tipo === 'egreso').length;
    const ajustes = movimientos.filter(m => m.tipo === 'ajuste').length;

    setEstadisticas({
      valorTotal,
      porcentajeStock: stockMinimo > 0 ? (stockActual / stockMinimo) * 100 : 0,
      totalMovimientos,
      ingresos,
      egresos,
      ajustes,
      ultimoMovimiento: movimientos[0] || null
    });
  };

  const getStockStatus = () => {
    if (!producto) return { label: 'N/A', color: 'default', icon: null };
    
    const stockActual = Number(producto.stock_actual) || 0;
    const stockMinimo = Number(producto.stock_minimo) || 0;
    
    if (stockActual === 0) {
      return { 
        label: 'Sin Stock', 
        color: 'error', 
        icon: <WarningIcon fontSize="small" />,
        severity: 'high'
      };
    } else if (stockActual <= stockMinimo) {
      return { 
        label: 'Stock Bajo', 
        color: 'warning', 
        icon: <TrendingDownIcon fontSize="small" />,
        severity: 'medium'
      };
    } else {
      return { 
        label: 'En Stock', 
        color: 'success', 
        icon: <CheckCircleIcon fontSize="small" />,
        severity: 'low'
      };
    }
  };

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTipoMovimientoConfig = (tipo) => {
    switch (tipo) {
      case 'ingreso':
        return {
          icon: TrendingUpIcon,
          color: 'success.main',
          bgColor: alpha(theme.palette.success.main, 0.1),
          label: 'Ingreso'
        };
      case 'egreso':
        return {
          icon: TrendingDownIcon,
          color: 'error.main',
          bgColor: alpha(theme.palette.error.main, 0.1),
          label: 'Egreso'
        };
      case 'ajuste':
        return {
          icon: EditIcon,
          color: 'warning.main',
          bgColor: alpha(theme.palette.warning.main, 0.1),
          label: 'Ajuste'
        };
      default:
        return {
          icon: HistoryIcon,
          color: 'grey.500',
          bgColor: alpha(theme.palette.grey[500], 0.1),
          label: 'Movimiento'
        };
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!producto) return null;

  const stockStatus = getStockStatus();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '80vh',
          maxHeight: '90vh',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                {producto.nombre?.charAt(0)?.toUpperCase() || 'P'}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  {producto.nombre}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <Chip
                    label={producto.categoria || 'Sin categoría'}
                    size="small"
                    variant="filled"
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      fontWeight: 500,
                      textTransform: 'capitalize',
                    }}
                  />
                  <Chip
                    icon={stockStatus.icon}
                    label={stockStatus.label}
                    color={stockStatus.color}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => onEditProduct && onEditProduct(producto)}
                size="small"
              >
                Editar
              </Button>
              <Button
                variant="contained"
                startIcon={<InventoryIcon />}
                onClick={() => onAdjustStock && onAdjustStock(producto)}
                size="small"
              >
                Ajustar Stock
              </Button>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 0 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 3 }}>
              <Tab 
                icon={<StatsIcon />} 
                label="Información General" 
                iconPosition="start"
              />
              <Tab 
                icon={<HistoryIcon />} 
                label="Historial de Movimientos" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    {/* Información básica */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            Información Básica
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <CategoryIcon color="action" />
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Categoría
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {producto.categoria || 'Sin categoría'}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box display="flex" alignItems="center" gap={2}>
                              <UnitIcon color="action" />
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Unidad de medida
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                  {producto.unidad || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>

                            {producto.proveedor && (
                              <Box display="flex" alignItems="center" gap={2}>
                                <SupplierIcon color="action" />
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Proveedor
                                  </Typography>
                                  <Typography variant="body1" fontWeight={500}>
                                    {producto.proveedor}
                                  </Typography>
                                </Box>
                              </Box>
                            )}

                            {producto.codigo_barras && (
                              <Box display="flex" alignItems="center" gap={2}>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Código de barras
                                  </Typography>
                                  <Typography 
                                    variant="body1" 
                                    fontWeight={500}
                                    sx={{ 
                                      fontFamily: 'monospace',
                                      bgcolor: alpha(theme.palette.grey[500], 0.1),
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      display: 'inline-block'
                                    }}
                                  >
                                    {producto.codigo_barras}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Stock y precios */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            Stock y Precios
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box textAlign="center" p={2} bgcolor={alpha(theme.palette.primary.main, 0.05)} borderRadius={2}>
                                <Typography variant="h4" fontWeight={700} color="primary">
                                  {producto.stock_actual || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Stock Actual
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box textAlign="center" p={2} bgcolor={alpha(theme.palette.warning.main, 0.05)} borderRadius={2}>
                                <Typography variant="h4" fontWeight={700} color="warning.main">
                                  {producto.stock_minimo || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Stock Mínimo
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box display="flex" alignItems="center" gap={2} mt={2}>
                                <PriceIcon color="action" />
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Precio Unitario
                                  </Typography>
                                  <Typography variant="h6" fontWeight={600} color="success.main">
                                    {formatCurrency(producto.precio_unitario)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            {estadisticas && (
                              <Grid item xs={12}>
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Valor Total en Stock
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600} color="primary">
                                      {formatCurrency(estadisticas.valorTotal)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Estadísticas */}
                    {estadisticas && (
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              Estadísticas de Movimientos
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={3}>
                                <Box textAlign="center" p={2}>
                                  <Typography variant="h5" fontWeight={700} color="text.primary">
                                    {estadisticas.totalMovimientos}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Total Movimientos
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Box textAlign="center" p={2}>
                                  <Typography variant="h5" fontWeight={700} color="success.main">
                                    {estadisticas.ingresos}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Ingresos
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Box textAlign="center" p={2}>
                                  <Typography variant="h5" fontWeight={700} color="error.main">
                                    {estadisticas.egresos}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Egresos
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Box textAlign="center" p={2}>
                                  <Typography variant="h5" fontWeight={700} color="warning.main">
                                    {estadisticas.ajustes}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Ajustes
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}

                    {/* Alertas */}
                    {stockStatus.severity === 'high' && (
                      <Grid item xs={12}>
                        <Alert severity="error">
                          <Typography variant="body2">
                            <strong>¡Producto sin stock!</strong> Es necesario reabastecer este producto urgentemente.
                          </Typography>
                        </Alert>
                      </Grid>
                    )}

                    {stockStatus.severity === 'medium' && (
                      <Grid item xs={12}>
                        <Alert severity="warning">
                          <Typography variant="body2">
                            <strong>Stock bajo:</strong> El producto está por debajo del stock mínimo recomendado.
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  key="movimientos"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Historial de Movimientos
                  </Typography>
                  
                  {loadingMovimientos ? (
                    <Box display="flex" justifyContent="center" py={4}>
                      <CircularProgress />
                    </Box>
                  ) : movimientos.length > 0 ? (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tipo</TableCell>
                            <TableCell align="center">Cantidad</TableCell>
                            <TableCell>Motivo</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Usuario</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {movimientos.map((movimiento, index) => {
                            const tipoConfig = getTipoMovimientoConfig(movimiento.tipo);
                            const IconComponent = tipoConfig.icon;
                            
                            return (
                              <TableRow key={index} hover>
                                <TableCell>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Box
                                      sx={{
                                        p: 0.5,
                                        borderRadius: 1,
                                        bgcolor: tipoConfig.bgColor,
                                        color: tipoConfig.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <IconComponent fontSize="small" />
                                    </Box>
                                    <Typography variant="body2" fontWeight={500}>
                                      {tipoConfig.label}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography 
                                    variant="body2" 
                                    fontWeight={600}
                                    color={movimiento.tipo === 'ingreso' ? 'success.main' : 
                                           movimiento.tipo === 'egreso' ? 'error.main' : 'warning.main'}
                                  >
                                    {movimiento.tipo === 'egreso' ? '-' : '+'}
                                    {movimiento.cantidad} {producto.unidad}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {movimiento.motivo || 'Sin motivo especificado'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(movimiento.fecha)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {movimiento.usuario_nombre || 'Sistema'}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        No hay movimientos registrados para este producto.
                      </Typography>
                    </Alert>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
          >
            Cerrar
          </Button>
          <Button
            onClick={() => onEditProduct && onEditProduct(producto)}
            variant="outlined"
            startIcon={<EditIcon />}
            size="large"
          >
            Editar Producto
          </Button>
          <Button
            onClick={() => onAdjustStock && onAdjustStock(producto)}
            variant="contained"
            startIcon={<InventoryIcon />}
            size="large"
          >
            Ajustar Stock
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default ProductDetailsDialog;
