import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Fab,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

// Importar componentes del módulo de facturación
import FacturaForm from './components/Facturacion/FacturaForm';
import HistorialFacturas from './components/Facturacion/HistorialFacturas';
import DetalleFactura from './components/Facturacion/DetalleFactura';
import VistaPreviaFactura from './components/Facturacion/VistaPreviaFactura';

// Importar servicios
import { facturacionService } from '../services/facturacionService';

// Componente de TabPanel para las pestañas
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`facturacion-tabpanel-${index}`}
      aria-labelledby={`facturacion-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Facturacion = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados principales
  const [tabActual, setTabActual] = useState(0);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [facturaPrevia, setFacturaPrevia] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const stats = await facturacionService.obtenerEstadisticasFacturacion();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      mostrarNotificacion('Error cargando estadísticas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarNotificacion = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const cerrarNotificacion = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCambiarTab = (event, newValue) => {
    setTabActual(newValue);
    // Limpiar estados al cambiar de pestaña
    setFacturaSeleccionada(null);
    setMostrarDetalle(false);
    setMostrarVistaPrevia(false);
    setFacturaPrevia(null);
  };

  const handleFacturaCreada = (factura) => {
    mostrarNotificacion(`Factura ${factura.nro_factura} creada exitosamente`, 'success');
    // Actualizar estadísticas
    cargarEstadisticas();
    // Cambiar a la pestaña de historial
    setTabActual(1);
  };

  const handleVerDetalle = (factura) => {
    setFacturaSeleccionada(factura);
    setMostrarDetalle(true);
  };

  const handleCerrarDetalle = () => {
    setMostrarDetalle(false);
    setFacturaSeleccionada(null);
  };

  const handleMostrarVistaPrevia = (datosFactura) => {
    setFacturaPrevia(datosFactura);
    setMostrarVistaPrevia(true);
  };

  const handleCerrarVistaPrevia = () => {
    setMostrarVistaPrevia(false);
    setFacturaPrevia(null);
  };

  const handleConfirmarFactura = async (datosFactura) => {
    try {
      setLoading(true);
      const resultado = await facturacionService.crearFactura(datosFactura);
      handleFacturaCreada(resultado.factura);
      handleCerrarVistaPrevia();
    } catch (error) {
      console.error('Error confirmando factura:', error);
      mostrarNotificacion(error.message || 'Error creando factura', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <ReceiptIcon fontSize="large" />
          Módulo de Facturación
        </Typography>
        
        {estadisticas && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            mt: 2
          }}>
            <Paper sx={{ p: 2, minWidth: 150 }}>
              <Typography variant="h6" color="primary">
                {estadisticas.facturas_hoy}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Facturas Hoy
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, minWidth: 150 }}>
              <Typography variant="h6" color="success.main">
                ${estadisticas.facturado_hoy.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Facturado Hoy
              </Typography>
            </Paper>
            

            <Paper sx={{ p: 2, minWidth: 150 }}>
              <Typography variant="h6" color="info.main">
                {estadisticas.total_facturas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Facturas
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="h6" color="warning.main">
                ${estadisticas.promedio_factura.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Promedio por Factura
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Navegación por pestañas */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabActual}
          onChange={handleCambiarTab}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab
            icon={<AddIcon />}
            label="Nueva Factura"
            id="facturacion-tab-0"
            aria-controls="facturacion-tabpanel-0"
          />
          <Tab
            icon={
              <Badge 
                badgeContent={estadisticas?.facturas_hoy || 0} 
                color="primary"
                max={99}
              >
                <HistoryIcon />
              </Badge>
            }
            label="Historial"
            id="facturacion-tab-1"
            aria-controls="facturacion-tabpanel-1"
          />
          <Tab
            icon={<AssessmentIcon />}
            label="Estadísticas"
            id="facturacion-tab-2"
            aria-controls="facturacion-tabpanel-2"
          />
        </Tabs>
      </Paper>

      {/* Contenido de las pestañas */}
      <Box sx={{ minHeight: '60vh' }}>
        {/* Pestaña: Nueva Factura */}
        <TabPanel value={tabActual} index={0}>
          <FacturaForm
            onFacturaCreada={handleFacturaCreada}
            onMostrarVistaPrevia={handleMostrarVistaPrevia}
            loading={loading}
          />
        </TabPanel>

        {/* Pestaña: Historial */}
        <TabPanel value={tabActual} index={1}>
          <HistorialFacturas
            onVerDetalle={handleVerDetalle}
            onActualizar={cargarEstadisticas}
          />
        </TabPanel>

        {/* Pestaña: Estadísticas */}
        <TabPanel value={tabActual} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Estadísticas de Facturación
            </Typography>
            
            {estadisticas ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 3,
                mt: 3
              }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Resumen General
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Total Facturas:</Typography>
                      <Typography fontWeight="bold">{estadisticas.total_facturas}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Total Facturado:</Typography>
                      <Typography fontWeight="bold" color="success.main">
                        ${estadisticas.total_facturado.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Promedio por Factura:</Typography>
                      <Typography fontWeight="bold">
                        ${estadisticas.promedio_factura.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="info.main">
                    Actividad de Hoy
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Facturas Emitidas:</Typography>
                      <Typography fontWeight="bold">{estadisticas.facturas_hoy}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Total Facturado:</Typography>
                      <Typography fontWeight="bold" color="success.main">
                        ${estadisticas.facturado_hoy.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Cliente Más Frecuente:</Typography>
                      <Typography fontWeight="bold" sx={{ maxWidth: 150, textAlign: 'right' }}>
                        {estadisticas.cliente_mas_frecuente}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ) : (
              <Alert severity="info">
                Cargando estadísticas...
              </Alert>
            )}
          </Box>
        </TabPanel>
      </Box>

      {/* Botón flotante para nueva factura (solo en móvil) */}
      {isMobile && tabActual !== 0 && (
        <Fab
          color="primary"
          aria-label="nueva factura"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
          onClick={() => setTabActual(0)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Diálogo de Detalle de Factura */}
      {mostrarDetalle && facturaSeleccionada && (
        <DetalleFactura
          open={mostrarDetalle}
          factura={facturaSeleccionada}
          onClose={handleCerrarDetalle}
        />
      )}

      {/* Diálogo de Vista Previa */}
      {mostrarVistaPrevia && facturaPrevia && (
        <VistaPreviaFactura
          open={mostrarVistaPrevia}
          datosFactura={facturaPrevia}
          onClose={handleCerrarVistaPrevia}
          onConfirmar={handleConfirmarFactura}
          loading={loading}
        />
      )}

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={cerrarNotificacion}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Facturacion;