import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Fab,
  useTheme,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle,
  ExitToApp,
  Dashboard as DashboardIcon,
  Notifications,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
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
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50', boxShadow: 2 }}>
        <Toolbar>
          <ShoppingCartIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Frutería Nina - Gestión de Compras
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Botones de navegación */}
            <IconButton color="inherit" onClick={() => handleNavigation('/dashboard')}>
              <HomeIcon />
            </IconButton>
            
            <IconButton color="inherit" onClick={() => handleNavigation('/inventario')}>
              <InventoryIcon />
            </IconButton>
            
            <IconButton color="inherit" onClick={() => handleNavigation('/clientes')}>
              <PeopleIcon />
            </IconButton>
            
            <IconButton color="inherit" onClick={() => handleNavigation('/ventas')}>
              <ReceiptIcon />
            </IconButton>
            
            <IconButton color="inherit" onClick={cargarDatos}>
              <RefreshIcon />
            </IconButton>
            
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            
            <Chip
              label={user?.rol || 'Usuario'}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
              size="small"
            />
            
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF9800', fontWeight: 600 }}>
                {user?.nombre?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { mt: 1, minWidth: 180 }
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Encabezado */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              Gestión de Compras
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Administra las compras a proveedores y controla el inventario automáticamente
            </Typography>
          </Box>

          {/* Estadísticas */}
          <ComprasStats 
            estadisticas={estadisticas} 
            loading={loading} 
          />

          {/* Filtros */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <ComprasFilters 
              filtros={filtros}
              onFiltrosChange={handleFiltrosChange}
            />
          </Paper>

          {/* Tabla de compras */}
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <ComprasTable
              compras={compras}
              loading={loading}
              onEdit={handleEditCompra}
              onView={handleViewCompra}
              onDelete={handleDeleteCompra}
            />
          </Paper>
        </motion.div>
      </Box>

      {/* SpeedDial para acciones rápidas */}
      <SpeedDial
        ariaLabel="Acciones de compras"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
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
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComprasPage;