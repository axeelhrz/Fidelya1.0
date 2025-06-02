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
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  AttachMoney as AttachMoneyIcon,
  AccountCircle,
  ExitToApp,
  Dashboard as DashboardIcon,
  Notifications,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ventasService } from '../../services/ventasService';

// Importar componentes específicos de ventas
import VentasTable from './components/VentasTable';
import VentaDialog from './components/VentaDialog';
import VentaViewDialog from './components/VentaViewDialog';
import DeleteVentaDialog from './components/DeleteVentaDialog';
import VentasStats from './components/VentasStats';
import VentasFilters from './components/VentasFilters';

const VentasPage = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Estados para datos
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para diálogos
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  
  // Estados para filtros
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

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [ventasData, statsData] = await Promise.all([
        ventasService.obtenerVentas(filtros),
        ventasService.obtenerEstadisticasVentas()
      ]);
      
      setVentas(ventasData);
      setEstadisticas(statsData);
    } catch (error) {
      console.error('Error cargando datos de ventas:', error);
      setError('Error al cargar los datos de ventas. Por favor, intenta nuevamente.');
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

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#2E7D32', boxShadow: 2 }}>
        <Toolbar>
          <AttachMoneyIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Frutería Nina - Gestión de Ventas
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              Gestión de Ventas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Registra ventas, controla el inventario automáticamente y genera reportes detallados
            </Typography>
          </Box>

          {/* Estadísticas */}
          <VentasStats 
            estadisticas={estadisticas} 
            loading={loading} 
          />

          {/* Filtros */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <VentasFilters 
              filtros={filtros}
              onFiltrosChange={handleFiltrosChange}
            />
          </Paper>

          {/* Tabla de ventas */}
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <VentasTable
              ventas={ventas}
              loading={loading}
              onEdit={handleEditVenta}
              onView={handleViewVenta}
              onDelete={handleDeleteVenta}
            />
          </Paper>
        </motion.div>
      </Box>

      {/* Botón flotante para agregar venta */}
      <Fab
        color="primary"
        aria-label="agregar venta"
        onClick={handleCreateVenta}
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

export default VentasPage;