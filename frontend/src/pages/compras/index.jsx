import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Container,
  Fade,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Chip,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import {
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  ErrorOutline as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { purchaseService } from '../../services/purchaseService';

// Importar componentes específicos de compras
import ComprasTable from './components/ComprasTable';
import CompraDialog from './components/CompraDialog';
import CompraViewDialog from './components/CompraViewDialog';
import DeleteCompraDialog from './components/DeleteCompraDialog';
import ComprasStats from './components/ComprasStats';
import ComprasFilters from './components/ComprasFilters';
import SuppliersManager from './components/SuppliersManager';

const ComprasPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Refs para optimización
  const isLoadingRef = useRef(false);
  const lastUpdateRef = useRef(Date.now());
  const filterTimeoutRef = useRef(null);
  
  // Estados para datos optimizados
  const [compras, setCompras] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para diálogos optimizados
  const [dialogs, setDialogs] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
    suppliers: false,
  });
  const [selectedCompra, setSelectedCompra] = useState(null);
  
  // Estados para filtros optimizados
  const [filtros, setFiltros] = useState({
    proveedor_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    producto: '',
    metodo_pago: ''
  });

  // Estado para SpeedDial
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  // Función optimizada para cargar compras con debouncing
  const cargarCompras = useCallback(async (filtrosActuales = filtros, force = false) => {
    // Evitar múltiples cargas simultáneas
    if (isLoadingRef.current && !force) {
      console.log('🔄 Carga ya en progreso, omitiendo...');
      return;
    }
    
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando compras con filtros:', filtrosActuales);
      const comprasData = await purchaseService.obtenerCompras(filtrosActuales);
      
      if (Array.isArray(comprasData)) {
        setCompras(comprasData);
        lastUpdateRef.current = Date.now();
        console.log('✅ Compras cargadas exitosamente:', comprasData.length);
      } else {
        console.warn('⚠️ Datos de compras no válidos:', comprasData);
        setCompras([]);
      }
    } catch (error) {
      console.error('❌ Error cargando compras:', error);
      setError('Error al cargar las compras. Por favor, intenta nuevamente.');
      setCompras([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [filtros]);

  // Función optimizada para cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
    setLoadingStats(true);
    
    try {
      console.log('📊 Cargando estadísticas de compras');
      const statsData = await purchaseService.obtenerEstadisticasCompras();
      setEstadisticas(statsData);
      console.log('✅ Estadísticas cargadas exitosamente');
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
      // No mostrar error para estadísticas, usar datos por defecto
      setEstadisticas({
        total_invertido_mes: 0,
        compras_mes: 0,
        gasto_promedio: 0,
        top_proveedores: [],
        productos_mas_comprados: [],
        total_compras: 0,
        gasto_total: 0
      });
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Función optimizada para cargar todos los datos
  const cargarDatos = useCallback(async (force = false) => {
    const promises = [
      cargarCompras(filtros, force),
      cargarEstadisticas()
    ];
    
    await Promise.allSettled(promises);
  }, [cargarCompras, cargarEstadisticas, filtros]);

  // Función optimizada para refrescar datos
  const refrescarDatos = useCallback(async () => {
    setRefreshing(true);
    
    try {
      // Limpiar cache antes de refrescar
      purchaseService.limpiarCache();
      await cargarDatos(true);
      setSuccess('Datos actualizados correctamente');
    } catch (error) {
      console.error('❌ Error refrescando datos:', error);
      setError('Error al actualizar los datos');
    } finally {
      setRefreshing(false);
    }
  }, [cargarDatos]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Efecto optimizado para recargar compras cuando cambian los filtros con debouncing
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = setTimeout(() => {
      cargarCompras(filtros);
    }, 500); // Debounce de 500ms

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [filtros, cargarCompras]);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  // Memoizar estadísticas calculadas
  const statsCalculadas = useMemo(() => {
    if (!Array.isArray(compras)) return { total: 0, sinFiltros: 0, totalInvertido: 0 };
    
    return {
      total: compras.length,
      sinFiltros: compras.length,
      totalInvertido: compras.reduce((sum, compra) => sum + (parseFloat(compra.total) || 0), 0),
    };
  }, [compras]);

  // Handlers optimizados para diálogos
  const openDialog = useCallback((dialogType, compra = null) => {
    setSelectedCompra(compra);
    setDialogs(prev => ({ ...prev, [dialogType]: true }));
    setSpeedDialOpen(false);
  }, []);

  const closeDialog = useCallback((dialogType) => {
    setDialogs(prev => ({ ...prev, [dialogType]: false }));
    setSelectedCompra(null);
  }, []);

  // Handlers específicos para cada acción
  const handleCreateCompra = useCallback(() => openDialog('create'), [openDialog]);
  const handleEditCompra = useCallback((compra) => openDialog('edit', compra), [openDialog]);
  const handleViewCompra = useCallback((compra) => openDialog('view', compra), [openDialog]);
  const handleDeleteCompra = useCallback((compra) => openDialog('delete', compra), [openDialog]);
  const handleOpenSuppliersManager = useCallback(() => openDialog('suppliers'), [openDialog]);

  // Handlers optimizados para eventos de éxito
  const handleCompraCreated = useCallback(async (nuevaCompra) => {
    closeDialog('create');
    setSuccess('Compra registrada exitosamente');
    
    // Actualizar datos de forma optimizada
    await Promise.allSettled([
      cargarCompras(filtros, true),
      cargarEstadisticas()
    ]);
  }, [closeDialog, cargarCompras, cargarEstadisticas, filtros]);

  const handleCompraUpdated = useCallback(async (compraActualizada) => {
    closeDialog('edit');
    setSuccess('Compra actualizada exitosamente');
    
    // Actualizar datos de forma optimizada
    await Promise.allSettled([
      cargarCompras(filtros, true),
      cargarEstadisticas()
    ]);
  }, [closeDialog, cargarCompras, cargarEstadisticas, filtros]);

  const handleCompraDeleted = useCallback(async () => {
    closeDialog('delete');
    setSuccess('Compra eliminada exitosamente');
    
    // Actualizar datos de forma optimizada
    await Promise.allSettled([
      cargarCompras(filtros, true),
      cargarEstadisticas()
    ]);
  }, [closeDialog, cargarCompras, cargarEstadisticas, filtros]);

  // Handler optimizado para cambios de filtros
  const handleFiltrosChange = useCallback((nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  }, []);

  // Handlers para cerrar notificaciones
  const handleCloseError = useCallback(() => setError(null), []);
  const handleCloseSuccess = useCallback(() => setSuccess(null), []);

  // Configuración optimizada del SpeedDial
  const speedDialActions = useMemo(() => [
    {
      icon: <AddIcon />,
      name: 'Nueva Compra',
      onClick: handleCreateCompra,
    },
    {
      icon: <BusinessIcon />,
      name: 'Gestionar Proveedores',
      onClick: handleOpenSuppliersManager,
    },
    {
      icon: <RefreshIcon />,
      name: 'Actualizar Datos',
      onClick: refrescarDatos,
    },
  ], [handleCreateCompra, handleOpenSuppliersManager, refrescarDatos]);

  // Variantes de animación optimizadas
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }), []);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          zIndex: 0,
        }
      }}
    >
      {/* Backdrop para operaciones de carga */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)',
        }}
        open={refreshing}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Actualizando datos...
          </Typography>
        </Box>
      </Backdrop>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 3 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header optimizado con Breadcrumbs */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 4 }}>
              <Breadcrumbs 
                aria-label="breadcrumb" 
                sx={{ 
                  mb: 2,
                  '& .MuiBreadcrumbs-separator': {
                    color: 'text.secondary'
                  }
                }}
              >
                <Link 
                  underline="hover" 
                  color="inherit" 
                  href="/dashboard"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  Dashboard
                </Link>
                <Typography 
                  color="text.primary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 600
                  }}
                >
                  <ShoppingCartIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  Gestión de Compras
                </Typography>
              </Breadcrumbs>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Gestión de Compras
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ maxWidth: 600 }}
                  >
                    Administra las compras a proveedores, controla el inventario automáticamente y mantén un registro detallado de todas las transacciones
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`${statsCalculadas.total} Compras`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  {statsCalculadas.totalInvertido > 0 && (
                    <Chip
                      icon={<AssessmentIcon />}
                      label={`$${statsCalculadas.totalInvertido.toFixed(2)} Invertido`}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateCompra}
                    disabled={loading || refreshing}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      '&:disabled': {
                        background: alpha(theme.palette.grey[400], 0.3),
                        transform: 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Nueva Compra
                  </Button>
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Estadísticas optimizadas */}
          <motion.div variants={itemVariants}>
            <ComprasStats 
              estadisticas={estadisticas} 
              loading={loadingStats} 
            />
          </motion.div>

          {/* Filtros optimizados */}
          <motion.div variants={itemVariants}>
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            >
              <ComprasFilters 
                filtros={filtros}
                onFiltrosChange={handleFiltrosChange}
                loading={loading || refreshing}
              />
            </Paper>
          </motion.div>

          {/* Tabla de compras optimizada */}
          <motion.div variants={itemVariants}>
            <Paper 
              sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            >
              <ComprasTable
                compras={compras}
                loading={loading}
                onEdit={handleEditCompra}
                onView={handleViewCompra}
                onDelete={handleDeleteCompra}
              />
            </Paper>
          </motion.div>

          {/* Mensaje optimizado cuando no hay datos */}
          {!loading && !loadingStats && compras.length === 0 && !error && (
            <motion.div 
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                  mt: 3
                }}
              >
                <ShoppingCartIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: alpha(theme.palette.primary.main, 0.3),
                    mb: 2 
                  }} 
                />
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                  ¡Comienza a registrar compras!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                  No tienes compras registradas aún. Haz clic en "Nueva Compra" para comenzar a gestionar tus compras a proveedores.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleCreateCompra}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Registrar Primera Compra
                </Button>
              </Paper>
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* SpeedDial optimizado para acciones rápidas */}
      <SpeedDial
        ariaLabel="Acciones de compras"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          '& .MuiFab-primary': {
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }
        }}
        icon={<SpeedDialIcon />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
        hidden={loading || refreshing}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            sx={{
              '& .MuiFab-primary': {
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              }
            }}
          />
        ))}
      </SpeedDial>

      {/* Botón flotante para agregar compra */}
      <Fab
        color="primary"
        aria-label="agregar compra"
        onClick={handleCreateCompra}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          boxShadow: theme.shadows[8],
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: theme.shadows[12],
          },
          transition: 'all 0.3s ease',
        }}
      >
        <AddIcon />
      </Fab>

      {/* Diálogos optimizados */}
      <CompraDialog
        open={dialogs.create}
        onClose={() => closeDialog('create')}
        onSuccess={handleCompraCreated}
        mode="create"
      />

      <CompraDialog
        open={dialogs.edit}
        onClose={() => closeDialog('edit')}
        onSuccess={handleCompraUpdated}
        mode="edit"
        compra={selectedCompra}
      />

      <CompraViewDialog
        open={dialogs.view}
        onClose={() => closeDialog('view')}
        compra={selectedCompra}
        onEdit={handleEditCompra}
      />

      <DeleteCompraDialog
        open={dialogs.delete}
        onClose={() => closeDialog('delete')}
        onSuccess={handleCompraDeleted}
        compra={selectedCompra}
      />

      <SuppliersManager
        open={dialogs.suppliers}
        onClose={() => closeDialog('suppliers')}
        onProveedorUpdated={cargarEstadisticas}
      />

      {/* Snackbars optimizados para notificaciones */}
      <AnimatePresence>
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Alert 
                onClose={handleCloseError} 
                severity="error" 
                icon={<ErrorIcon />}
                sx={{ 
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[8],
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                  }
                }}
              >
                {error}
              </Alert>
            </motion.div>
          </Snackbar>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <Snackbar
            open={!!success}
            autoHideDuration={4000}
            onClose={handleCloseSuccess}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Alert 
                onClose={handleCloseSuccess} 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ 
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[8],
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                  }
                }}
              >
                {success}
              </Alert>
            </motion.div>
          </Snackbar>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ComprasPage;