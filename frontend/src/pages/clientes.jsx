import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
  Fab,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes
import ClientesTable from '../components/clientes/ClientesTable';
import ClienteDialog from '../components/clientes/ClienteDialog';
import DeleteClienteDialog from '../components/clientes/DeleteClienteDialog';
import ClientesFilters from '../components/clientes/ClientesFilters';

// Servicios
import { obtenerClientes, obtenerEstadisticasClientes } from '../services/clienteService';

const ClientesPage = () => {
  // Estados principales
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({});

  // Estados de diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrar clientes cuando cambie el término de búsqueda
  useEffect(() => {
    filtrarClientes();
  }, [searchTerm, clientes]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [clientesData, estadisticasData] = await Promise.all([
        obtenerClientes(),
        obtenerEstadisticasClientes().catch(() => ({}))
      ]);
      
      setClientes(clientesData);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      mostrarSnackbar('Error cargando los datos de clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtrarClientes = () => {
    if (!searchTerm.trim()) {
      setFilteredClientes(clientes);
      return;
    }

    const filtered = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm)
    );

    setFilteredClientes(filtered);
  };

  const handleOpenDialog = (cliente = null) => {
    setSelectedCliente(cliente);
    setEditMode(!!cliente);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCliente(null);
    setEditMode(false);
  };

  const handleOpenDeleteDialog = (cliente) => {
    setSelectedCliente(cliente);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCliente(null);
  };

  const handleClienteCreated = () => {
    cargarDatos();
    handleCloseDialog();
    mostrarSnackbar('Cliente creado exitosamente', 'success');
  };

  const handleClienteUpdated = () => {
    cargarDatos();
    handleCloseDialog();
    mostrarSnackbar('Cliente actualizado exitosamente', 'success');
  };

  const handleClienteDeleted = () => {
    cargarDatos();
    handleCloseDeleteDialog();
    mostrarSnackbar('Cliente eliminado exitosamente', 'success');
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleRefresh = () => {
    cargarDatos();
    mostrarSnackbar('Datos actualizados', 'info');
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Gestión de Clientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {estadisticas.total_clientes || 0} clientes registrados
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(98, 168, 61, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(98, 168, 61, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Nuevo Cliente
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Estadísticas rápidas */}
      {estadisticas.total_clientes > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              textAlign: 'center'
            }}>
              <Box>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  {estadisticas.total_clientes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Clientes
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {estadisticas.clientes_mes || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Este Mes
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="info.main" fontWeight="bold">
                  {estadisticas.porcentaje_con_correo || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Con Email
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="warning.main" fontWeight="bold">
                  {estadisticas.porcentaje_con_telefono || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Con Teléfono
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ClientesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalClientes={clientes.length}
          filteredCount={filteredClientes.length}
        />
      </motion.div>

      {/* Tabla de clientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <ClientesTable
            clientes={filteredClientes}
            loading={loading}
            onEdit={handleOpenDialog}
            onDelete={handleOpenDeleteDialog}
          />
        </Paper>
      </motion.div>

      {/* Botón flotante para agregar cliente */}
      <Fab
        color="primary"
        aria-label="agregar cliente"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          boxShadow: '0 8px 24px rgba(98, 168, 61, 0.3)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(98, 168, 61, 0.4)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease'
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Diálogos */}
      <AnimatePresence>
        {openDialog && (
          <ClienteDialog
            open={openDialog}
            onClose={handleCloseDialog}
            cliente={selectedCliente}
            editMode={editMode}
            onClienteCreated={handleClienteCreated}
            onClienteUpdated={handleClienteUpdated}
          />
        )}
      </AnimatePresence>

      <DeleteClienteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        cliente={selectedCliente}
        onClienteDeleted={handleClienteDeleted}
      />

      {/* Backdrop de carga */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientesPage;