import React, { useState, useMemo } from 'react';
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
  IconButton,
  useTheme,
  alpha,
  Tab,
  Tabs,
  Paper,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ComprasAnalytics = ({ open, onClose, compras = [], estadisticas = {} }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Calcular analytics avanzados
  const analytics = useMemo(() => {
    if (!Array.isArray(compras)) return {};

    const totalCompras = compras.length;
    const totalInvertido = compras.reduce((sum, compra) => sum + (parseFloat(compra.total) || 0), 0);

    // Análisis temporal
    const comprasPorMes = compras.reduce((acc, compra) => {
      const fecha = new Date(compra.fecha);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[mes]) acc[mes] = [];
      acc[mes].push(compra);
      return acc;
    }, {});

    // Calcular tendencias
    const meses = Object.keys(comprasPorMes).sort();
    const tendencias = meses.map(mes => ({
      mes,
      total: comprasPorMes[mes].reduce((sum, c) => sum + (parseFloat(c.total) || 0), 0),
      cantidad: comprasPorMes[mes].length,
    }));

    // Análisis de proveedores
    const proveedorAnalysis = compras.reduce((acc, compra) => {
      const proveedor = compra.proveedor_nombre || 'Sin proveedor';
      if (!acc[proveedor]) {
        acc[proveedor] = {
          total: 0,
          compras: 0,
          productos: new Set(),
          ultimaCompra: null,
        };
      }
      acc[proveedor].total += parseFloat(compra.total) || 0;
      acc[proveedor].compras += 1;
      
      if (compra.detalles) {
        compra.detalles.forEach(detalle => {
          acc[proveedor].productos.add(detalle.producto_nombre);
        });
      }
      
      const fechaCompra = new Date(compra.fecha);
      if (!acc[proveedor].ultimaCompra || fechaCompra > new Date(acc[proveedor].ultimaCompra)) {
        acc[proveedor].ultimaCompra = compra.fecha;
      }
      
      return acc;
    }, {});

    // Convertir Set a número para productos únicos
    Object.keys(proveedorAnalysis).forEach(proveedor => {
      proveedorAnalysis[proveedor].productosUnicos = proveedorAnalysis[proveedor].productos.size;
      delete proveedorAnalysis[proveedor].productos;
    });

    // Análisis de eficiencia
    const promedioCompra = totalCompras > 0 ? totalInvertido / totalCompras : 0;
    const comprasGrandes = compras.filter(c => parseFloat(c.total) > promedioCompra * 1.5).length;
    const comprasPequenas = compras.filter(c => parseFloat(c.total) < promedioCompra * 0.5).length;

    return {
      totalCompras,
      totalInvertido,
      promedioCompra,
      tendencias,
      proveedorAnalysis,
      comprasGrandes,
      comprasPequenas,
      eficiencia: {
        porcentajeComprasGrandes: totalCompras > 0 ? (comprasGrandes / totalCompras) * 100 : 0,
        porcentajeComprasPequenas: totalCompras > 0 ? (comprasPequenas / totalCompras) * 100 : 0,
      }
    };
  }, [compras]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );

  const topProveedores = Object.entries(analytics.proveedorAnalysis || {})
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 5);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.15)}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AnalyticsIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Analytics de Compras
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="Resumen Ejecutivo" />
            <Tab label="Análisis de Proveedores" />
            <Tab label="Eficiencia" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Métricas Principales
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Total Invertido</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatCurrency(analytics.totalInvertido || 0)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Promedio por Compra</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                        {formatCurrency(analytics.promedioCompra || 0)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Total de Compras</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {analytics.totalCompras || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Distribución de Compras
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Compras Grandes</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {analytics.comprasGrandes || 0}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={analytics.eficiencia?.porcentajeComprasGrandes || 0}
                        sx={{ height: 8, borderRadius: 4 }}
                        color="success"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Compras Pequeñas</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {analytics.comprasPequenas || 0}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={analytics.eficiencia?.porcentajeComprasPequenas || 0}
                        sx={{ height: 8, borderRadius: 4 }}
                        color="warning"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Tendencias Mensuales
                  </Typography>
                  <Grid container spacing={2}>
                    {analytics.tendencias?.slice(-6).map((mes, index) => (
                      <Grid item xs={12} sm={6} md={2} key={mes.mes}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(mes.mes + '-01').toLocaleDateString('es-ES', { 
                              month: 'short',
                              year: '2-digit'
                            })}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {formatCurrency(mes.total)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {mes.cantidad} compras
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Análisis Detallado de Proveedores
          </Typography>
          <Grid container spacing={2}>
            {topProveedores.map(([proveedor, data], index) => (
              <Grid item xs={12} key={proveedor}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip 
                          label={`#${index + 1}`} 
                          color="primary" 
                          size="small" 
                          sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {proveedor}
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatCurrency(data.total)}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {data.compras}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Compras Realizadas
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                            {data.productosUnicos || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Productos Únicos
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                            {formatCurrency(data.total / data.compras)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Promedio por Compra
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {data.ultimaCompra ? 
                              new Date(data.ultimaCompra).toLocaleDateString('es-ES') : 
                              'N/A'
                            }
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Última Compra
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Análisis de Eficiencia
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Compras de Alto Valor
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {formatPercentage(analytics.eficiencia?.porcentajeComprasGrandes || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analytics.comprasGrandes || 0} compras por encima del promedio
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TrendingDownIcon sx={{ color: 'warning.main', fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Compras de Bajo Valor
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    {formatPercentage(analytics.eficiencia?.porcentajeComprasPequenas || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analytics.comprasPequenas || 0} compras por debajo del promedio
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Recomendaciones de Optimización
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {analytics.eficiencia?.porcentajeComprasPequenas > 30 && (
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                        Alto porcentaje de compras pequeñas
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Considera consolidar compras pequeñas para optimizar costos de transacción
                      </Typography>
                    </Box>
                  )}
                  {Object.keys(analytics.proveedorAnalysis || {}).length > 10 && (
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main' }}>
                        Muchos proveedores activos
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Evalúa la posibilidad de reducir el número de proveedores para obtener mejores precios
                      </Typography>
                    </Box>
                  )}
                  {analytics.eficiencia?.porcentajeComprasGrandes > 60 && (
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        Excelente eficiencia en compras
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mantén esta estrategia de compras de alto valor para maximizar eficiencia
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComprasAnalytics;
