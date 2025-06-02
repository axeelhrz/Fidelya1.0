import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory2 as InventoryIcon,
  History as HistoryIcon,
  GetApp as ExportIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import inventoryService from '../../services/inventoryService';
import movimientoService from '../../services/movimientoService';
import InventoryTable from '../../components/inventory/InventoryTable';
import InventoryFormDialog from '../../components/inventory/InventoryFormDialog';
import StockMovementDialog from '../../components/inventory/StockMovementDialog';
import DeleteProductDialog from '../../components/inventory/DeleteProductDialog';
import InventoryFilters from '../../components/inventory/InventoryFilters';
import InventoryStats from '../../components/inventory/InventoryStats';
import LowStockAlertCard from '../../components/inventory/LowStockAlertCard';
import MovimientosTable from '../../components/inventory/MovimientosTable';

const InventoryPage = () => {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para diálogos
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  const [filtrosMovimientos, setFiltrosMovimientos] = useState({
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    limit: 50
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Recargar productos cuando cambien los filtros
  useEffect(() => {
    cargarProductos();
  }, [filtros]);

  // Cargar movimientos cuando cambie la pestaña o filtros
  useEffect(() => {
    if (tabValue === 1) {
      cargarMovimientos();
    }
  }, [tabValue, filtrosMovimientos]);

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
    }
  };

  const cargarMovimientos = async () => {
    try {
      setLoadingMovimientos(true);
      const data = await movimientoService.obtenerMovimientos(filtrosMovimientos);
      setMovimientos(data);
    } catch (error) {
      console.error('Error cargando movimientos:', error);
      setError('Error cargando movimientos de stock');
    } finally {
      setLoadingMovimientos(false);
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

  const handleEliminarProducto = (id) => {
    const producto = productos.find(p => p.id === id);
    setSelectedProduct(producto);
    setDeleteDialogOpen(true);
  };

  const handleConfirmarEliminacion = async (id) => {
    try {
      await inventoryService.eliminarProducto(id);
      setSuccess('Producto eliminado exitosamente');
      setDeleteDialogOpen(false);
      await cargarDatos();
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
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando producto:', error);
      setError(error.message || 'Error guardando producto');
    }
  };

  const handleStockSubmit = async (movimiento) => {
    try {
      const movimientoData = {
        producto_id: selectedProduct.id,
        tipo: movimiento.tipo,
        cantidad: movimiento.cantidad,
        motivo: movimiento.motivo || 'Ajuste manual'
      };
      
      await inventoryService.registrarMovimientoStock(movimientoData);
      setSuccess('Stock ajustado exitosamente');
      setStockDialogOpen(false);
      await cargarDatos();
      
      // Si estamos en la pestaña de movimientos, recargar
      if (tabValue === 1) {
        await cargarMovimientos();
      }
    } catch (error) {
      console.error('Error ajustando stock:', error);
      setError(error.message || 'Error ajustando stock');
    }
  };

  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  };

  const handleFiltrosMovimientosChange = (nuevosFiltros) => {
    setFiltrosMovimientos(prev => ({ ...prev, ...nuevosFiltros }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExportarPDF = async () => {
    try {
      const result = await inventoryService.exportarProductosPDF();
      setSuccess('Exportación PDF iniciada');
      console.log('Exportación PDF:', result);
    } catch (error) {
      console.error('Error exportando PDF:', error);
      setError('Error al exportar PDF');
    }
  };

  const handleExportarExcel = async () => {
    try {
      const result = await inventoryService.exportarProductosExcel();
      setSuccess('Exportación Excel iniciada');
      console.log('Exportación Excel:', result);
    } catch (error) {
      console.error('Error exportando Excel:', error);
      setError('Error al exportar Excel');
    }
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
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportarPDF}
              size="large"
              sx={{ borderRadius: 2 }}
            >
              PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportarExcel}
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Excel
            </Button>
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

      {/* Pestañas de navegación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 600,
              },
            }}
          >
            <Tab
              icon={<InventoryIcon />}
              label="Productos"
              iconPosition="start"
              sx={{ gap: 1 }}
            />
            <Tab
              icon={<HistoryIcon />}
              label="Movimientos"
              iconPosition="start"
              sx={{ gap: 1 }}
            />
            <Tab
              icon={<StatsIcon />}
              label="Estadísticas"
              iconPosition="start"
              sx={{ gap: 1 }}
            />
          </Tabs>
        </Paper>
      </motion.div>

      {/* Contenido de las pestañas */}
      <motion.div
        key={tabValue}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Pestaña de Productos */}
        {tabValue === 0 && (
          <>
            {/* Filtros */}
            <InventoryFilters
              filtros={filtros}
              onFiltrosChange={handleFiltrosChange}
              totalProductos={productos.length}
            />

            {/* Tabla de Productos */}
            <InventoryTable
              productos={productos}
              onEdit={handleEditarProducto}
              onDelete={handleEliminarProducto}
              onAdjustStock={handleAjustarStock}
              loading={loading}
            />
          </>
        )}

        {/* Pestaña de Movimientos */}
        {tabValue === 1 && (
          <>
            {/* Filtros de Movimientos */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Filtros de Movimientos
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Tipo de Movimiento
                      </Typography>
                      <select
                        value={filtrosMovimientos.tipo}
                        onChange={(e) => handleFiltrosMovimientosChange({ tipo: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Todos los tipos</option>
                        <option value="ingreso">Ingresos</option>
                        <option value="egreso">Egresos</option>
                        <option value="ajuste">Ajustes</option>
                      </select>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Fecha Inicio
                      </Typography>
                      <input
                        type="date"
                        value={filtrosMovimientos.fecha_inicio}
                        onChange={(e) => handleFiltrosMovimientosChange({ fecha_inicio: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          fontSize: '14px'
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Fecha Fin
                      </Typography>
                      <input
                        type="date"
                        value={filtrosMovimientos.fecha_fin}
                        onChange={(e) => handleFiltrosMovimientosChange({ fecha_fin: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          fontSize: '14px'
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Límite de Resultados
                      </Typography>
                      <select
                        value={filtrosMovimientos.limit}
                        onChange={(e) => handleFiltrosMovimientosChange({ limit: parseInt(e.target.value) })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          fontSize: '14px'
                        }}
                      >
                        <option value={25}>25 registros</option>
                        <option value={50}>50 registros</option>
                        <option value={100}>100 registros</option>
                        <option value={200}>200 registros</option>
                      </select>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Tabla de Movimientos */}
            <MovimientosTable
              movimientos={movimientos}
              loading={loadingMovimientos}
              onProductoClick={(movimiento) => {
                // Buscar el producto y abrir diálogo de ajuste
                const producto = productos.find(p => p.nombre === movimiento.producto_nombre);
                if (producto) {
                  handleAjustarStock(producto);
                }
              }}
            />
          </>
        )}

        {/* Pestaña de Estadísticas Detalladas */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            {/* Estadísticas Principales */}
            <Grid item xs={12}>
              {estadisticas && <InventoryStats estadisticas={estadisticas} />}
            </Grid>

            {/* Productos Más Vendidos */}
            {estadisticas?.productos_mas_vendidos && (
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Productos Más Vendidos (30 días)
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {estadisticas.productos_mas_vendidos.length > 0 ? (
                      estadisticas.productos_mas_vendidos.map((producto, index) => (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          py={1}
                          borderBottom={index < estadisticas.productos_mas_vendidos.length - 1 ? '1px solid' : 'none'}
                          borderColor="divider"
                        >
                          <Typography variant="body2" fontWeight={500}>
                            {producto.nombre}
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight={600}>
                            {producto.cantidad_vendida} unidades
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        No hay datos de ventas disponibles
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Resumen de Categorías */}
            {estadisticas?.categorias_principales && (
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Distribución por Categorías
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {estadisticas.categorias_principales.length > 0 ? (
                      estadisticas.categorias_principales.map((categoria, index) => {
                        const porcentaje = estadisticas.total_productos > 0 
                          ? ((categoria.cantidad / estadisticas.total_productos) * 100).toFixed(1)
                          : 0;
                        
                        return (
                          <Box
                            key={index}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            py={1}
                            borderBottom={index < estadisticas.categorias_principales.length - 1 ? '1px solid' : 'none'}
                            borderColor="divider"
                          >
                            <Typography variant="body2" fontWeight={500} textTransform="capitalize">
                              {categoria.categoria}
                            </Typography>
                            <Box textAlign="right">
                              <Typography variant="body2" color="primary" fontWeight={600}>
                                {categoria.cantidad} productos
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {porcentaje}%
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        No hay categorías disponibles
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Alertas y Recomendaciones */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Alertas y Recomendaciones
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    {estadisticas?.productos_stock_bajo > 0 && (
                      <Grid item xs={12} md={4}>
                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                          <Typography variant="body2" fontWeight={600}>
                            Stock Bajo Detectado
                          </Typography>
                          <Typography variant="caption">
                            {estadisticas.productos_stock_bajo} productos requieren reposición
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                    
                    {estadisticas?.valor_inventario > 0 && (
                      <Grid item xs={12} md={4}>
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                          <Typography variant="body2" fontWeight={600}>
                            Valor del Inventario
                          </Typography>
                          <Typography variant="caption">
                            Total: ${estadisticas.valor_inventario.toLocaleString()}
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                    
                    {estadisticas?.total_productos > 0 && (
                      <Grid item xs={12} md={4}>
                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                          <Typography variant="body2" fontWeight={600}>
                            Inventario Activo
                          </Typography>
                          <Typography variant="caption">
                            {estadisticas.total_productos} productos registrados
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
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

      <DeleteProductDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmarEliminacion}
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