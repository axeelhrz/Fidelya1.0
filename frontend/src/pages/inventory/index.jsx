import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory2 as InventoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import inventoryService from '../../services/inventoryService';
import InventoryTable from '../../components/inventory/InventoryTable';
import InventoryFormDialog from '../../components/inventory/InventoryFormDialog';
import StockMovementDialog from '../../components/inventory/StockMovementDialog';
import InventoryFilters from '../../components/inventory/InventoryFilters';
import InventoryStats from '../../components/inventory/InventoryStats';
import LowStockAlertCard from '../../components/inventory/LowStockAlertCard';

const InventoryPage = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados para diálogos
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    categoria: 'todos',
    busqueda: '',
    stockBajo: false,
    orden: 'nombre',
    direccion: 'asc'
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Recargar productos cuando cambien los filtros
  useEffect(() => {
    cargarProductos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      await Promise.all([
        cargarProductos(),
        cargarEstadisticas()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error cargando los datos del inventario');
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await inventoryService.obtenerProductos(filtros);
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(error.message || 'Error cargando productos');
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const data = await inventoryService.obtenerEstadisticas();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // No mostrar error para estadísticas, es información secundaria
    }
  };

  const handleCrearProducto = () => {
    setSelectedProduct(null);
    setEditMode(false);
    setFormDialogOpen(true);
  };

  const handleEditarProducto = (producto) => {
    setSelectedProduct(producto);
    setEditMode(true);
    setFormDialogOpen(true);
  };

  const handleEliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await inventoryService.eliminarProducto(id);
      setSuccess('Producto eliminado exitosamente');
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setError(error.message || 'Error eliminando producto');
    }
  };

  const handleAjustarStock = (producto) => {
    setSelectedProduct(producto);
    setStockDialogOpen(true);
  };

  const handleFormSubmit = async (datosProducto) => {
    try {
      if (editMode && selectedProduct) {
        await inventoryService.actualizarProducto(selectedProduct.id, datosProducto);
        setSuccess('Producto actualizado exitosamente');
      } else {
        await inventoryService.crearProducto(datosProducto);
        setSuccess('Producto creado exitosamente');
      }
      
      setFormDialogOpen(false);
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error guardando producto:', error);
      setError(error.message || 'Error guardando producto');
    }
  };

  const handleStockSubmit = async (movimiento) => {
    try {
      await inventoryService.ajustarStock(selectedProduct.id, movimiento);
      setSuccess('Stock ajustado exitosamente');
      setStockDialogOpen(false);
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error ajustando stock:', error);
      setError(error.message || 'Error ajustando stock');
    }
  };

  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Cargando inventario...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Gestión de Inventario
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administra productos, stock y movimientos
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCrearProducto}
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Nuevo Producto
          </Button>
        </Box>
      </motion.div>

      {/* Estadísticas */}
      {estadisticas && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <InventoryStats estadisticas={estadisticas} />
        </motion.div>
      )}

      {/* Alerta de Stock Bajo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LowStockAlertCard 
          productos={productos.filter(p => p.stock_bajo)} 
          onProductClick={handleAjustarStock}
        />
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <InventoryFilters
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          totalProductos={productos.length}
        />
      </motion.div>

      {/* Tabla de Productos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <InventoryTable
          productos={productos}
          onEdit={handleEditarProducto}
          onDelete={handleEliminarProducto}
          onAdjustStock={handleAjustarStock}
          loading={loading}
        />
      </motion.div>

      {/* Diálogos */}
      <InventoryFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
        producto={selectedProduct}
        editMode={editMode}
      />

      <StockMovementDialog
        open={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
        onSubmit={handleStockSubmit}
        producto={selectedProduct}
      />

      {/* Snackbars para notificaciones */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryPage;