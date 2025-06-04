import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
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
  // Estados para datos
  const [compras, setCompras] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para diálogos
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSuppliersManager, setOpenSuppliersManager] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    proveedor_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    producto: ''
  });

  // Estado para SpeedDial
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [comprasData, statsData] = await Promise.all([
        purchaseService.obtenerCompras(filtros),
        purchaseService.obtenerEstadisticasCompras()
      ]);
      
      setCompras(comprasData);
      setEstadisticas(statsData);
    } catch (error) {
      console.error('Error cargando datos de compras:', error);
      setError('Error al cargar los datos de compras. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompra = () => {
    setSelectedCompra(null);
    setOpenCreateDialog(true);
    setSpeedDialOpen(false);
  };

  const handleEditCompra = (compra) => {
    setSelectedCompra(compra);
    setOpenEditDialog(true);
  };

  const handleViewCompra = (compra) => {
    setSelectedCompra(compra);
    setOpenViewDialog(true);
  };

  const handleDeleteCompra = (compra) => {
    setSelectedCompra(compra);
    setOpenDeleteDialog(true);
  };

  const handleOpenSuppliersManager = () => {
    setOpenSuppliersManager(true);
    setSpeedDialOpen(false);
  };

  const handleCompraCreated = async () => {
    setOpenCreateDialog(false);
    setSuccess('Compra registrada exitosamente');
    await cargarDatos();
  };

  const handleCompraUpdated = async () => {
    setOpenEditDialog(false);
    setSuccess('Compra actualizada exitosamente');
    await cargarDatos();
  };

  const handleCompraDeleted = async () => {
    setOpenDeleteDialog(false);
    setSuccess('Compra eliminada exitosamente');
    await cargarDatos();
  };

  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const handleCloseError = () => {
    setError(null);
};

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  const speedDialActions = [
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
      onClick: cargarDatos,
          },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
};

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

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
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 3 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header con Breadcrumbs */}
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

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`${compras?.length || 0} Compras`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateCompra}
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
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Nueva Compra
                  </Button>
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Estadísticas */}
          <motion.div variants={itemVariants}>
            <ComprasStats 
              estadisticas={estadisticas} 
              loading={loading} 
            />
          </motion.div>

          {/* Filtros */}
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
              />
            </Paper>
          </motion.div>

          {/* Tabla de compras */}
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
        </motion.div>
      </Container>

      {/* SpeedDial para acciones rápidas */}
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

      {/* Diálogos */}
      <CompraDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={handleCompraCreated}
        mode="create"
      />

      <CompraDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSuccess={handleCompraUpdated}
        mode="edit"
        compra={selectedCompra}
      />

      <CompraViewDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        compra={selectedCompra}
      />

      <DeleteCompraDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSuccess={handleCompraDeleted}
        compra={selectedCompra}
      />

      <SuppliersManager
        open={openSuppliersManager}
        onClose={() => setOpenSuppliersManager(false)}
      />

      {/* Snackbars para notificaciones */}
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
                sx={{ 
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[8]
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
                sx={{ 
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[8]
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