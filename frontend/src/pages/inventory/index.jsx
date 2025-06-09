import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useTheme,
  alpha,
  Container,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory2 as InventoryIcon,
  QrCodeScanner as ScannerIcon,
  Refresh as RefreshIcon,
  Edit as BulkEditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Importar componentes mejorados
import ModernInventoryTable from '../../components/inventory/ModernInventoryTable';
import InventoryFormDialog from '../../components/inventory/InventoryFormDialog';
import StockMovementDialog from '../../components/inventory/StockMovementDialog';
import DeleteProductDialog from '../../components/inventory/DeleteProductDialog';
import ProductDetailsDialog from '../../components/inventory/ProductDetailsDialog';
import ModernInventoryFilters from '../../components/inventory/ModernInventoryFilters';
import ModernStockSummary from '../../components/inventory/ModernStockSummary';
import ModernLowStockAlert from '../../components/inventory/ModernLowStockAlert';
// Importar servicios
import inventoryServiceEnhanced from '../../services/inventoryServiceEnhanced';
import proveedorService from '../../services/proveedorService';

const ModernInventoryPage = () => {
  const theme = useTheme();
  
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [resumenInventario, setResumenInventario] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  // Estados de carga y errores
  const [loading, setLoading] = useState(true);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [creatingTestProducts, setCreatingTestProducts] = useState(false);
  
  // Estados para diálogos
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Estados para selección múltiple
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    categoria: 'todos',
    busqueda: '',
    proveedor_id: null,
    stockBajo: false,
    sinStock: false,
    orden: 'nombre',
    direccion: 'asc',
    pagina: 1,
    limite: 25
  });

  // Estados para paginación
  const [paginacion, setPaginacion] = useState({
    pagina_actual: 1,
    limite: 25,
    total_registros: 0,
    total_paginas: 0,
    tiene_siguiente: false,
    tiene_anterior: false
  });

  // Función para crear productos de prueba con stock bajo
  const handleCreateTestProducts = async () => {
    setCreatingTestProducts(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/test/crear-productos-stock-bajo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setSuccess(`${result.productos_actualizados.length} productos actualizados con stock bajo`);
        // Recargar datos
        await cargarDatosIniciales();
      } else {
        setError('Error creando productos de prueba');
      }
    } catch (error) {
      console.error('Error creando productos de prueba:', error);
      setError('Error creando productos de prueba');
    } finally {
      setCreatingTestProducts(false);
    }
  };

  // Funciones de carga de datos
  const cargarResumenInventario = useCallback(async () => {
    try {
      setLoadingResumen(true);
      const data = await inventoryServiceEnhanced.obtenerResumenInventario();
      console.log('Resumen inventario cargado:', data);
      setResumenInventario(data);
    } catch (error) {
      console.error('Error cargando resumen:', error);
    } finally {
      setLoadingResumen(false);
    }
  }, []);

  const cargarProductos = useCallback(async () => {
    try {
      const data = await inventoryServiceEnhanced.busquedaAvanzadaProductos(filtros);
      setProductos(data.productos);
      setPaginacion(data.paginacion);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(error.message || 'Error cargando productos');
    }
  }, [filtros]);

  const cargarProveedores = useCallback(async () => {
    try {
      const data = await proveedorService.obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  }, []);

  const cargarDatosIniciales = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        cargarResumenInventario(),
        cargarProveedores(),
        cargarProductos()
      ]);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setError('Error cargando los datos del inventario');
    } finally {
      setLoading(false);
    }
  }, [cargarResumenInventario, cargarProveedores, cargarProductos]);

  // Efectos
  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  useEffect(() => {
    if (!loading) {
    cargarProductos();
    }
  }, [cargarProductos, loading]);

  // Handlers para productos
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

  const handleEliminarProducto = (id) => {
    const producto = productos.find(p => p.id === id);
    setSelectedProduct(producto);
    setDeleteDialogOpen(true);
  };

  const handleVerDetalles = (producto) => {
    setSelectedProduct(producto);
    setDetailsDialogOpen(true);
  };

  const handleConfirmarEliminacion = async (id) => {
    try {
      await inventoryServiceEnhanced.eliminarProducto(id);
      setSuccess('Producto eliminado exitosamente');
      setDeleteDialogOpen(false);
      
      await Promise.all([cargarProductos(), cargarResumenInventario()]);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setError(error.message || 'Error eliminando producto');
    }
  };

  const handleAjustarStock = async (producto) => {
    try {
      // Cargar historial de movimientos para el producto
      const historial = await inventoryServiceEnhanced.obtenerHistorialProducto(
        producto.id, 
        { limite: 10 }
      );
      setSelectedProduct({ ...producto, historialMovimientos: historial });
      setStockDialogOpen(true);
    } catch (error) {
      console.error('Error cargando historial:', error);
      // Abrir diálogo sin historial si hay error
      setSelectedProduct(producto);
      setStockDialogOpen(true);
    }
  };

  const handleFormSubmit = async (datosProducto) => {
    try {
      let resultado;
      if (editMode && selectedProduct) {
        resultado = await inventoryServiceEnhanced.actualizarProducto(selectedProduct.id, datosProducto);
        setSuccess('Producto actualizado exitosamente');
      } else {
        resultado = await inventoryServiceEnhanced.crearProducto(datosProducto);
        setSuccess('Producto creado exitosamente');
      }
      
      setFormDialogOpen(false);
      await Promise.all([cargarProductos(), cargarResumenInventario()]);
    } catch (error) {
      console.error('Error guardando producto:', error);
      setError(error.message || 'Error guardando producto');
    }
  };

  const handleStockSubmit = async (movimiento) => {
    try {
      const resultado = await inventoryServiceEnhanced.registrarMovimientoStock(movimiento);
      setSuccess('Stock ajustado exitosamente');
      setStockDialogOpen(false);
      
      await Promise.all([cargarProductos(), cargarResumenInventario()]);
    } catch (error) {
      console.error('Error ajustando stock:', error);
      setError(error.message || 'Error ajustando stock');
    }
  };

  const handlePaginaChange = (nuevaPagina) => {
    setFiltros(prev => ({ 
      ...prev, 
      pagina: nuevaPagina
        }));
  };

  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros(prev => ({
      ...prev,
      ...nuevosFiltros,
      pagina: 1 // Reset página al cambiar filtros
    }));
  };

  // Handlers para selección múltiple
  const handleSelectionChange = (selectedIds) => {
    setSelectedProducts(selectedIds);
  };

  const handleBulkEdit = () => {
    setBulkEditMode(true);
    // Implementar lógica de edición masiva
  };

  const handleRefresh = () => {
    cargarDatosIniciales();
  };

  // Acciones del SpeedDial
  const speedDialActions = [
    {
      icon: <AddIcon />,
      name: 'Nuevo Producto',
      onClick: handleCrearProducto,
    },
    {
      icon: <ScannerIcon />,
      name: 'Escanear Código',
      onClick: () => {
        // Implementar escáner de códigos
        console.log('Abrir escáner');
      },
    },
    {
      icon: <BulkEditIcon />,
      name: 'Edición Masiva',
      onClick: handleBulkEdit,
      disabled: selectedProducts.length === 0,
    },
    {
      icon: <RefreshIcon />,
      name: 'Actualizar',
      onClick: handleRefresh,
    },
  ];

  // CORREGIDO: Verificar si hay productos con stock bajo
  const productosStockBajo = Array.isArray(resumenInventario?.productos_stock_bajo) 
    ? resumenInventario.productos_stock_bajo 
    : [];
  const tieneStockBajo = productosStockBajo.length > 0;

  console.log('Productos stock bajo:', productosStockBajo);
  console.log('Tiene stock bajo:', tieneStockBajo);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} />
                    </Grid>
                      ))}
                    </Grid>
        
        <Skeleton variant="rectangular" height={400} />
      </Container>
  );
  }
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
              >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}>
                <InventoryIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  Inventario de Productos
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Gestiona tu inventario de manera eficiente y profesional
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
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
        >
              Nuevo Producto
        </Button>
          </Box>
        </Box>

        {/* Resumen del Inventario */}
        <AnimatePresence>
          {resumenInventario && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ModernStockSummary 
                resumen={resumenInventario}
                loading={loadingResumen}
                sx={{ mb: 3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alertas de Stock Bajo */}
        <AnimatePresence>
          {tieneStockBajo ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ModernLowStockAlert 
                productos={productosStockBajo}
                onAjustarStock={handleAjustarStock}
                sx={{ mb: 3 }}
              />
            </motion.div>
          ) : (
            // Mostrar tarjeta cuando no hay stock bajo
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  bgcolor: alpha(theme.palette.success.main, 0.02),
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                        }}
                      >
                        <InventoryIcon fontSize="large" />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700} color="success.main">
                          ✅ Stock en Buen Estado
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Todos los productos tienen stock suficiente
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={creatingTestProducts ? <CircularProgress size={16} /> : <WarningIcon />}
                      onClick={handleCreateTestProducts}
                      disabled={creatingTestProducts}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      {creatingTestProducts ? 'Creando...' : 'Simular Stock Bajo'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ModernInventoryFilters
            filtros={filtros}
            proveedores={proveedores}
            onFiltrosChange={handleFiltrosChange}
            totalProductos={paginacion.total_registros}
            sx={{ mb: 3 }}
          />
        </motion.div>

        {/* Tabla de Productos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: 'hidden',
              bgcolor: 'background.paper'
            }}
          >
            <ModernInventoryTable
              productos={productos}
              paginacion={paginacion}
              onEditarProducto={handleEditarProducto}
              onEliminarProducto={handleEliminarProducto}
              onAjustarStock={handleAjustarStock}
              onVerDetalles={handleVerDetalles}
              onPaginaChange={handlePaginaChange}
              onSelectionChange={handleSelectionChange}
              selectedProducts={selectedProducts}
              loading={false}
            />
          </Paper>
        </motion.div>

        {/* Speed Dial para acciones rápidas */}
        <SpeedDial
          ariaLabel="Acciones de inventario"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            '& .MuiFab-primary': {
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease'
            }
          }}
          icon={<SpeedDialIcon />}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
              disabled={action.disabled}
              sx={{
                '& .MuiFab-primary': {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease'
                }
              }}
            />
          ))}
        </SpeedDial>

        {/* Diálogos */}
        <InventoryFormDialog
          open={formDialogOpen}
          onClose={() => setFormDialogOpen(false)}
          onSubmit={handleFormSubmit}
          producto={selectedProduct}
          editMode={editMode}
          proveedores={proveedores}
        />

        <StockMovementDialog
          open={stockDialogOpen}
          onClose={() => setStockDialogOpen(false)}
          onSubmit={handleStockSubmit}
          producto={selectedProduct}
        />

        <ProductDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          producto={selectedProduct}
          onEditProduct={handleEditarProducto}
          onAdjustStock={handleAjustarStock}
        />

        <DeleteProductDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmarEliminacion}
          producto={selectedProduct}
        />

        {/* Notificaciones */}
        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={() => setSuccess(null)} 
            severity="success" 
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default ModernInventoryPage;