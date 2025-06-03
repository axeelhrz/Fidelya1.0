import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha,
  Fab,
  Zoom,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar,
  Container,
} from '@mui/material';
import {
  Add,
  Refresh,
  FilterList,
  Analytics,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import VentasStats from './components/VentasStats';
import VentasTable from './components/VentasTable';
import VentasFilters from './components/VentasFilters';
import VentaDialog from './components/VentaDialog';
import VentaViewDialog from './components/VentaViewDialog';
import DeleteVentaDialog from './components/DeleteVentaDialog';
import { ventasService } from '../../services/ventasService';

const VentasPage = () => {
  const theme = useTheme();
  // Estados principales
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [datosRelacionados, setDatosRelacionados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    cliente_id: '',
    usuario_id: '',
    forma_pago: '',
    producto: '',
    estado: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Estados de diálogos
  const [ventaDialog, setVentaDialog] = useState({ open: false, venta: null, mode: 'create' });
  const [viewDialog, setViewDialog] = useState({ open: false, venta: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, venta: null });
  
  // Estados de notificaciones
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Cargar ventas cuando cambian los filtros
  useEffect(() => {
    if (datosRelacionados) {
      cargarVentas();
    }
  }, [filtros, datosRelacionados]);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      // Cargar todos los datos en paralelo para mejor rendimiento
      const [
        ventasData,
        estadisticasData,
        relacionadosData
      ] = await Promise.all([
        ventasService.obtenerVentas(filtros),
        ventasService.obtenerEstadisticasVentas(),
        ventasService.obtenerDatosRelacionados()
      ]);
      
      setVentas(ventasData);
      setEstadisticas(estadisticasData);
      setDatosRelacionados(relacionadosData);
      
      console.log('✅ Datos de ventas cargados:', {
        ventas: ventasData.length,
        estadisticas: estadisticasData,
        relacionados: relacionadosData
      });
    } catch (error) {
      console.error('❌ Error cargando datos de ventas:', error);
      mostrarNotificacion('Error cargando datos de ventas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cargarVentas = async () => {
    try {
      const ventasData = await ventasService.obtenerVentas(filtros);
      setVentas(ventasData);
    } catch (error) {
      console.error('❌ Error cargando ventas:', error);
      mostrarNotificacion('Error cargando ventas', 'error');
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const estadisticasData = await ventasService.obtenerEstadisticasVentas();
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
    }
  };

  const refrescarDatos = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        cargarVentas(),
        cargarEstadisticas()
      ]);
      mostrarNotificacion('Datos actualizados correctamente', 'success');
    } catch (error) {
      console.error('❌ Error refrescando datos:', error);
      mostrarNotificacion('Error actualizando datos', 'error');
    } finally {
      setRefreshing(false);
    }
  }, [filtros]);

  const mostrarNotificacion = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const cerrarNotificacion = () => {
    setNotification({ ...notification, open: false });
  };

  // Handlers de diálogos
  const handleCreateVenta = () => {
    setVentaDialog({ open: true, venta: null, mode: 'create' });
  };

  const handleEditVenta = (venta) => {
    setVentaDialog({ open: true, venta, mode: 'edit' });
  };

  const handleViewVenta = (venta) => {
    setViewDialog({ open: true, venta });
  };

  const handleDeleteVenta = (venta) => {
    setDeleteDialog({ open: true, venta });
  };

  const handleCloseVentaDialog = () => {
    setVentaDialog({ open: false, venta: null, mode: 'create' });
  };

  const handleCloseViewDialog = () => {
    setViewDialog({ open: false, venta: null });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, venta: null });
  };

  // Handlers de CRUD
  const handleVentaCreated = async (nuevaVenta) => {
    try {
      await cargarVentas();
      await cargarEstadisticas();
      mostrarNotificacion('Venta creada exitosamente', 'success');
      handleCloseVentaDialog();
    } catch (error) {
      console.error('❌ Error después de crear venta:', error);
    }
};

  const handleVentaUpdated = async (ventaActualizada) => {
    try {
      await cargarVentas();
      await cargarEstadisticas();
      mostrarNotificacion('Venta actualizada exitosamente', 'success');
      handleCloseVentaDialog();
    } catch (error) {
      console.error('❌ Error después de actualizar venta:', error);
    }
  };

  const handleVentaDeleted = async () => {
    try {
      await cargarVentas();
      await cargarEstadisticas();
      mostrarNotificacion('Venta eliminada exitosamente', 'success');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('❌ Error después de eliminar venta:', error);
    }
  };

  // Handler de filtros
  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
};

  const limpiarFiltros = () => {
    setFiltros({
      fecha_inicio: '',
      fecha_fin: '',
      cliente_id: '',
      usuario_id: '',
      forma_pago: '',
      producto: '',
      estado: ''
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <PageHeader
          title="💰 Gestión de Ventas"
          subtitle="Administra y analiza todas las ventas de la frutería"
          actions={
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                sx={{ borderRadius: 2 }}
              >
                Filtros
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refrescarDatos}
                disabled={refreshing}
                sx={{ borderRadius: 2 }}
              >
                {refreshing ? 'Actualizando...' : 'Actualizar'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateVenta}
                sx={{ 
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                  }
                }}
              >
                Nueva Venta
              </Button>
            </Box>
          }
        />

        {/* Filtros */}
        <AnimatePresence>
          {mostrarFiltros && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <VentasFilters
                  filtros={filtros}
                  onFiltrosChange={handleFiltrosChange}
                  onLimpiarFiltros={limpiarFiltros}
                  datosRelacionados={datosRelacionados}
                />
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estadísticas */}
        <VentasStats 
          estadisticas={estadisticas} 
          loading={loading}
          datosRelacionados={datosRelacionados}
        />

        {/* Tabla de Ventas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    📋 Lista de Ventas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ventas.length} ventas encontradas
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Analytics color="primary" />
                  <Typography variant="body2" color="primary.main" fontWeight={500}>
                    Total: {new Intl.NumberFormat('es-UY', {
                      style: 'currency',
                      currency: 'UYU',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(ventas.reduce((sum, venta) => sum + (venta.total || 0), 0))}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <VentasTable
              ventas={ventas}
              onEdit={handleEditVenta}
              onView={handleViewVenta}
              onDelete={handleDeleteVenta}
              loading={loading}
              datosRelacionados={datosRelacionados}
            />
          </Paper>
        </motion.div>

        {/* FAB para nueva venta */}
        <Zoom in={!loading}>
          <Fab
            color="primary"
            aria-label="Nueva venta"
            onClick={handleCreateVenta}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: theme.shadows[8],
              '&:hover': {
                boxShadow: theme.shadows[12],
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Add />
          </Fab>
        </Zoom>

        {/* Diálogos */}
        <VentaDialog
          open={ventaDialog.open}
          onClose={handleCloseVentaDialog}
          venta={ventaDialog.venta}
          mode={ventaDialog.mode}
          onVentaCreated={handleVentaCreated}
          onVentaUpdated={handleVentaUpdated}
          datosRelacionados={datosRelacionados}
        />

        <VentaViewDialog
          open={viewDialog.open}
          onClose={handleCloseViewDialog}
          venta={viewDialog.venta}
          datosRelacionados={datosRelacionados}
        />

        <DeleteVentaDialog
          open={deleteDialog.open}
          onClose={handleCloseDeleteDialog}
          venta={deleteDialog.venta}
          onVentaDeleted={handleVentaDeleted}
        />

        {/* Backdrop para loading */}
        <Backdrop
          sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando datos de ventas...
            </Typography>
          </Box>
        </Backdrop>

        {/* Notificaciones */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={cerrarNotificacion}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={cerrarNotificacion}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default VentasPage;