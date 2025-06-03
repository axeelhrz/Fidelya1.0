import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
  Fab,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Slide,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ventasService } from '../../services/ventasService';

// Importar componentes modernizados
import VentasStats from './components/VentasStats';
import VentasTable from './components/VentasTable';
import VentasFilters from './components/VentasFilters';
import VentaDialog from './components/VentaDialog';
import VentaViewDialog from './components/VentaViewDialog';
import DeleteVentaDialog from './components/DeleteVentaDialog';

const VentasPage = () => {
  const theme = useTheme();
  // Estados para datos
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para diálogos
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  
  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    cliente_id: '',
    usuario_id: '',
    forma_pago: '',
    producto: ''
  });
  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
    setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      console.log('🔄 Cargando datos de ventas...');
      
      const [ventasData, statsData] = await Promise.all([
        ventasService.obtenerVentas(filtros),
        ventasService.obtenerEstadisticasVentas()
      ]);
      
      console.log('✅ Datos cargados:', {
        ventas: ventasData.length,
        estadisticas: statsData
      });
      
      setVentas(ventasData);
      setEstadisticas(statsData);
    } catch (error) {
      console.error('❌ Error cargando datos de ventas:', error);
      setError('Error al cargar los datos de ventas. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    cargarDatos(true);
  };

  const handleCreateVenta = () => {
    setSelectedVenta(null);
    setOpenCreateDialog(true);
  };

  const handleEditVenta = (venta) => {
    setSelectedVenta(venta);
    setOpenEditDialog(true);
  };

  const handleViewVenta = (venta) => {
    setSelectedVenta(venta);
    setOpenViewDialog(true);
  };

  const handleDeleteVenta = (venta) => {
    setSelectedVenta(venta);
    setOpenDeleteDialog(true);
  };

  const handleVentaCreated = async () => {
    setOpenCreateDialog(false);
    setSuccess('Venta registrada exitosamente');
    await cargarDatos();
  };

  const handleVentaUpdated = async () => {
    setOpenEditDialog(false);
    setSuccess('Venta actualizada exitosamente');
    await cargarDatos();
  };

  const handleVentaDeleted = async () => {
    setOpenDeleteDialog(false);
    setSuccess('Venta eliminada exitosamente');
    await cargarDatos();
  };

  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
};

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCloseError = () => {
    setError(null);
};

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: theme.palette.background.default,
        pb: 4
      }}>
        <Container maxWidth="xl" sx={{ pt: 3 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs 
            aria-label="breadcrumb" 
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            <Link 
              underline="hover" 
              color="inherit" 
              href="/dashboard"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              Ventas
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Gestión de Ventas
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ maxWidth: 600 }}
              >
                Registra ventas, controla el inventario automáticamente y genera reportes detallados
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={toggleFilters}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={refreshing ? <RefreshIcon sx={{ animation: 'spin 1s linear infinite' }} /> : <RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Actualizar
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateVenta}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Nueva Venta
              </Button>
            </Box>
          </Box>

          {/* Estadísticas - Pasando tanto estadisticas como ventas */}
          <VentasStats 
            estadisticas={estadisticas} 
            loading={loading}
            ventas={ventas}
          />

          {/* Filtros */}
          <AnimatePresence>
            {showFilters && (
              <Slide direction="down" in={showFilters} mountOnEnter unmountOnExit>
                <Paper 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02)
                  }}
                >
                  <VentasFilters 
                    filtros={filtros}
                    onFiltrosChange={handleFiltrosChange}
                  />
                </Paper>
              </Slide>
            )}
          </AnimatePresence>

          {/* Tabla de ventas */}
          <Paper 
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: theme.shadows[2]
            }}
          >
            <VentasTable
              ventas={ventas}
              loading={loading}
              onEdit={handleEditVenta}
              onView={handleViewVenta}
              onDelete={handleDeleteVenta}
            />
          </Paper>
        </Container>

        {/* Botón flotante para agregar venta */}
        <Fab
          color="primary"
          aria-label="agregar venta"
          onClick={handleCreateVenta}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 64,
            height: 64,
            boxShadow: theme.shadows[8],
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: theme.shadows[12],
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>

        {/* Diálogos */}
        <VentaDialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          onSuccess={handleVentaCreated}
          mode="create"
        />

        <VentaDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSuccess={handleVentaUpdated}
          mode="edit"
          venta={selectedVenta}
        />

        <VentaViewDialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          venta={selectedVenta}
        />

        <DeleteVentaDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onSuccess={handleVentaDeleted}
          venta={selectedVenta}
        />

        {/* Snackbars para notificaciones */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseError} 
            severity="error" 
            sx={{ 
              width: '100%',
              borderRadius: 3,
              fontWeight: 500
            }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSuccess} 
            severity="success" 
            sx={{ 
              width: '100%',
              borderRadius: 3,
              fontWeight: 500
            }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Box>

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default VentasPage;