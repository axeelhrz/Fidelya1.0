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
  Divider,
  Chip,
  useTheme,
  alpha,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ComprasReports = ({ open, onClose, compras = [], estadisticas = {} }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Calcular estadísticas de reportes
  const reportStats = useMemo(() => {
    if (!Array.isArray(compras)) return {};

    const totalCompras = compras.length;
    const totalInvertido = compras.reduce((sum, compra) => sum + (parseFloat(compra.total) || 0), 0);
    const promedioCompra = totalCompras > 0 ? totalInvertido / totalCompras : 0;

    // Agrupar por proveedor
    const porProveedor = compras.reduce((acc, compra) => {
      const proveedor = compra.proveedor_nombre || 'Sin proveedor';
      if (!acc[proveedor]) {
        acc[proveedor] = { total: 0, compras: 0 };
      }
      acc[proveedor].total += parseFloat(compra.total) || 0;
      acc[proveedor].compras += 1;
      return acc;
    }, {});

    // Agrupar por mes
    const porMes = compras.reduce((acc, compra) => {
      const fecha = new Date(compra.fecha);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[mes]) {
        acc[mes] = { total: 0, compras: 0 };
      }
      acc[mes].total += parseFloat(compra.total) || 0;
      acc[mes].compras += 1;
      return acc;
    }, {});

    return {
      totalCompras,
      totalInvertido,
      promedioCompra,
      porProveedor,
      porMes,
      topProveedores: Object.entries(porProveedor)
        .sort(([,a], [,b]) => b.total - a.total)
        .slice(0, 5),
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

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );

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
          <AssessmentIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Reportes de Compras
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="report tabs">
            <Tab label="Resumen General" />
            <Tab label="Por Proveedor" />
            <Tab label="Tendencias" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {reportStats.totalCompras || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Compras
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AttachMoneyIcon sx={{ color: 'success.main', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatCurrency(reportStats.totalInvertido || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Invertido
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BusinessIcon sx={{ color: 'info.main', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                        {Object.keys(reportStats.porProveedor || {}).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Proveedores Activos
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarIcon sx={{ color: 'warning.main', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {formatCurrency(reportStats.promedioCompra || 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Promedio por Compra
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Top 5 Proveedores por Volumen de Compras
          </Typography>
          <Grid container spacing={2}>
            {reportStats.topProveedores?.map(([proveedor, data], index) => (
              <Grid item xs={12} key={proveedor}>
                <Paper sx={{ p: 2, borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatCurrency(data.total)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.compras} compras
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Tendencias Mensuales
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(reportStats.porMes || {})
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 6)
              .map(([mes, data]) => (
              <Grid item xs={12} sm={6} md={4} key={mes}>
                <Paper sx={{ p: 2, borderRadius: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {new Date(mes + '-01').toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {formatCurrency(data.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.compras} compras realizadas
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          onClick={() => {
            // Implementar exportación
            console.log('Exportar reporte');
          }}
        >
          Exportar
        </Button>
        <Button
          startIcon={<PrintIcon />}
          variant="outlined"
          onClick={() => {
            // Implementar impresión
            console.log('Imprimir reporte');
          }}
        >
          Imprimir
        </Button>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComprasReports;
