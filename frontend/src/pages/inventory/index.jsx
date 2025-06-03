import React, { useState, useEffect, useCallback } from 'react';
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
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory2 as InventoryIcon,
  History as HistoryIcon,
  GetApp as ExportIcon,
  Assessment as StatsIcon,
  QrCodeScanner as ScannerIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  BulkEdit as BulkEditIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Importar componentes mejorados
import InventoryTable from '../../components/inventory/InventoryTable';
import InventoryFormDialog from '../../components/inventory/InventoryFormDialog';
import StockMovementDialog from '../../components/inventory/StockMovementDialog';
import DeleteProductDialog from '../../components/inventory/DeleteProductDialog';
import AdvancedInventoryFilters from '../../components/inventory/AdvancedInventoryFilters';
import StockSummaryCards from '../../components/inventory/StockSummaryCards';
import LowStockAlertCard from '../../components/inventory/LowStockAlertCard';
import MovimientosTable from '../../components/inventory/MovimientosTable';

// Importar servicios mejorados
import inventoryServiceEnhanced from '../../services/inventoryServiceEnhanced';
import movimientoService from '../../services/movimientoService';
import proveedorService from '../../services/proveedorService';

const InventoryPageEnhanced = () => {
  const theme = useTheme();
  
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [resumenInventario, setResumenInventario] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [filtrosGuardados, setFiltrosGuardados] = useState([]);
  
  // Estados de carga y errores
  const [loading, setLoading] = useState(true);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estados de navegación
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para diálogos
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
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
    limite: 50
  });

  const [filtrosMovimientos, setFiltrosMovimientos] = useState({
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    limit: 50
  });

  // Estados para paginación
  const [paginacion, setPaginacion] = useState({
    pagina_actual: 1,
    limite: 50,
    total_registros: 0,
    total_paginas: 0,
    tiene_siguiente: false,
    tiene_anterior: false
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
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

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      await Promise.all([
        cargarResumenInventario(),
        cargarProveedores(),
        cargarFiltrosGuardados(),
        cargarProductos()
      ]);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setError('Error cargando los datos del inventario');
    } finally {
      setLoading(false);
    }
  };

  const cargarResumenInventario = async () => {
    try {
      setLoadingResumen(true);
      const data = await inventoryServiceEnhanced.obtenerResumenInventario();
      setResumenInventario(data);
    } catch (error) {
      console.error('Error cargando resumen:', error);
    } finally {
      setLoadingResumen(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await inventoryServiceEnhanced.busquedaAvanzadaProductos(filtros);
      setProductos(data.productos);
      setPaginacion(data.paginacion);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(error.message || 'Error cargando productos');
    }
  };

  const cargarProveedores = async () => {
    try {
      const data = await proveedorService.obtenerProveedores();



      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  };

  const cargarFiltrosGuardados = async () => {
    try {
      const data = await inventoryServiceEnhanced.obtenerFiltrosPersonalizados();
      setFiltrosGuardados(data);
    } catch (error) {
      console.error('Error cargando filtros guardados:', error);
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
      // Cargar historial de movimientos del producto
      const historial = await inventoryServiceEnhanced.obtenerHistorialProducto(
        producto.id, 
        { limite: 10 }
      );
      setSelectedProduct({ ...producto, historialMovimientos: historial });
      setStockDialogOpen(true);
    } catch (error) {
      console.error('Error cargando historial:', error);
      setSelectedProduct(producto);
      setStockDialogOpen(true);
    }
  };

  const handleFormSubmit = async (datosProducto) => {
    try {
      if (editMode && selectedProduct) {
        await inventoryServiceEnhanced.actualizarProducto(selectedProduct.id, datosProducto);
        setSuccess('Producto actualizado exitosamente');
      } else {
        await inventoryServiceEnhanced.crearProducto(datosProducto);
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
      await inventoryServiceEnhanced.registrarMovimientoStock(movimiento);
      setSuccess('Stock ajustado exitosamente');
      setStockDialogOpen(false);
      await Promise.all([cargarProductos(), cargarResumenInventario()]);
      
      if (tabValue === 1) {
        await cargarMovimientos();
      }
    } catch (error) {
      console.error('Error ajustando stock:', error);
      setError(error.message || 'Error ajustando stock');
    }
  };

  // Handlers para filtros
  const handleFiltrosChange = useCallback((nuevosFiltros) => {
    setFiltros(prev => ({ 
      ...prev, 
      ...nuevosFiltros,
      pagina: 1 // Resetear a primera página cuando cambien filtros
    }));
  }, []);

  const handleFiltrosMovimientosChange = (nuevosFiltros) => {
    setFiltrosMovimientos(prev => ({ ...prev, ...nuevosFiltros }));
  };

  const handleGuardarFiltro = async (filtroData) => {
    try {
      await inventoryServiceEnhanced.guardarFiltroPersonalizado(filtroData);
      setSuccess('Filtro guardado exitosamente');
      await cargarFiltrosGuardados();
    } catch (error) {
      console.error('Error guardando filtro:', error);
      setError('Error guardando filtro');
    }
  };

  // Handlers para navegación
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handlers para exportación
  const handleExportarPDF = async () => {
    try {
      const result = await inventoryServiceEnhanced.exportarInventario('pdf', filtros);
      setSuccess('Exportación PDF iniciada');
      console.log('Exportación PDF:', result);
    } catch (error) {
      console.error('Error exportando PDF:', error);
      setError('Error al exportar PDF');
    }
  };

  const handleExportarExcel = async () => {
    try {
      const result = await inventoryServiceEnhanced.exportarInventario('excel', filtros);
      setSuccess('Exportación Excel iniciada');
      console.log('Exportación Excel:', result);
    } catch (error) {
      console.error('Error exportando Excel:', error);
      setError('Error al exportar Excel');
    }
  };

  // Handlers para selección múltiple
  const handleToggleBulkEdit = () => {
    setBulkEditMode(!bulkEditMode);
    setSelectedProducts([]);
  };

  const handleSelectProduct = (productId, selected) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleSelectAllProducts = (selected) => {
    if (selected) {
      setSelectedProducts(productos.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleBulkOperation = async (operacion, parametros) => {
    try {
      if (selectedProducts.length === 0) {
        setError('Selecciona al menos un producto');
        return;
      }

      const result = await inventoryServiceEnhanced.operacionesMasivasProductos(
        operacion,
        selectedProducts,
        parametros
      );

      setSuccess(`Operación completada: ${result.resultados.exitosos} productos actualizados`);
      setBulkEditDialogOpen(false);
      setSelectedProducts([]);
      await Promise.all([cargarProductos(), cargarResumenInventario()]);
    } catch (error) {
      console.error('Error en operación masiva:', error);
      setError(error.message || 'Error en operación masiva');
    }
  };

  // Handlers para tarjetas de resumen
  const handleCardClick = (cardId) => {
    switch (cardId) {
      case 'stock_bajo':
        setFiltros(prev => ({ ...prev, stockBajo: true, pagina: 1 }));
        setTabValue(0);
        break;
      case 'sin_stock':
        setFiltros(prev => ({ ...prev, sinStock: true, pagina: 1 }));
        setTabValue(0);
        break;
      case 'total_productos':
        setFiltros(prev => ({ 
          ...prev, 
          stockBajo: false, 
          sinStock: false, 
          categoria: 'todos',
          pagina: 1 
        }));
        setTabValue(0);
        break;
      default:
        break;
    }
  };

  // Handlers para paginación
  const handleChangePage = (nuevaPagina) => {
    setFiltros(prev => ({ ...prev, pagina: nuevaPagina }));
  };

  const handleChangeRowsPerPage = (nuevoLimite) => {
    setFiltros(prev => ({ ...prev, limite: nuevoLimite, pagina: 1 }));
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
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
        // TODO: Implementar escáner de código de barras
        setSuccess('Funcionalidad de escáner próximamente');
      },
    },
    {
      icon: <BulkEditIcon />,
      name: 'Edición Masiva',
      onClick: handleToggleBulkEdit,
    },
    {
      icon: <RefreshIcon />,
      name: 'Actualizar',
      onClick: cargarDatosIniciales,
    },
  ];

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
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto', position: 'relative' }}>
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
                Control de Inventario Avanzado
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestión completa de productos, stock y movimientos
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            {bulkEditMode && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setBulkEditDialogOpen(true)}
                disabled={selectedProducts.length === 0}
                startIcon={<BulkEditIcon />}
              >
                Editar Seleccionados ({selectedProducts.length})
              </Button>
            )}
            
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

      {/* Tarjetas de Resumen */}
      {resumenInventario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StockSummaryCards 
            estadisticas={resumenInventario}
            onRefresh={cargarResumenInventario}
            loading={loadingResumen}
            onCardClick={handleCardClick}
          />
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
              label={`Productos (${paginacion.total_registros})`}
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
            <Tab
              icon={<AnalyticsIcon />}
              label="Análisis"
              iconPosition="start"
              sx={{ gap: 1 }}
            />
          </Tabs>
        </Paper>
      </motion.div>

      {/* Contenido de las pestañas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabValue}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Pestaña de Productos */}
          {tabValue === 0 && (
            <>
              {/* Filtros Avanzados */}
              <AdvancedInventoryFilters
                filtros={filtros}
                onFiltrosChange={handleFiltrosChange}
                totalProductos={paginacion.total_registros}
                proveedores={proveedores}
                onExport={handleExportarExcel}
                onSaveFilter={handleGuardarFiltro}
                savedFilters={filtrosGuardados}
                loading={loading}
              />

              {/* Modo de edición masiva */}
              {bulkEditMode && (
                <Card sx={{ mb: 3, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={2}>
                        <BulkEditIcon color="info" />
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            Modo de Edición Masiva
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Selecciona productos para realizar operaciones en lote
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedProducts.length === productos.length && productos.length > 0}
                              indeterminate={selectedProducts.length > 0 && selectedProducts.length < productos.length}
                              onChange={(e) => handleSelectAllProducts(e.target.checked)}
                            />
                          }
                          label="Seleccionar todos"
                        />
                        <Button
                          variant="outlined"
                          onClick={handleToggleBulkEdit}
                        >
                          Salir del modo edición
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Tabla de Productos */}
              <InventoryTable
                productos={productos}
                onEdit={handleEditarProducto}
                onDelete={handleEliminarProducto}
                onAdjustStock={handleAjustarStock}
                loading={loading}
                bulkEditMode={bulkEditMode}
                selectedProducts={selectedProducts}
                onSelectProduct={handleSelectProduct}
                paginacion={paginacion}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
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
                  const producto = productos.find(p => p.nombre === movimiento.producto_nombre);
                  if (producto) {
                    handleAjustarStock(producto);
                  }
                }}
              />
            </>
          )}

          {/* Pestaña de Estadísticas Detalladas */}
          {tabValue === 2 && resumenInventario && (
            <Grid container spacing={3}>
              {/* Distribución por categorías */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Distribución por Categorías
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {resumenInventario.distribucion_categorias?.length > 0 ? (
                      resumenInventario.distribucion_categorias.map((categoria, index) => (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          py={1}
                          borderBottom={index < resumenInventario.distribucion_categorias.length - 1 ? '1px solid' : 'none'}
                          borderColor="divider"
                        >
                          <Typography variant="body2" fontWeight={500} textTransform="capitalize">
                            {categoria.categoria}
                          </Typography>
                          <Box textAlign="right">
                            <Typography variant="body2" color="primary" fontWeight={600}>
                              {categoria.cantidad_productos} productos
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${categoria.valor_total.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        No hay datos de categorías disponibles
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Productos más vendidos */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Productos Más Vendidos (30 días)
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {resumenInventario.productos_mas_vendidos?.length > 0 ? (
                      resumenInventario.productos_mas_vendidos.map((producto, index) => (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          py={1}
                          borderBottom={index < resumenInventario.productos_mas_vendidos.length - 1 ? '1px solid' : 'none'}
                          borderColor="divider"
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {producto.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" textTransform="capitalize">
                              {producto.categoria}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="body2" color="primary" fontWeight={600}>
                              {producto.cantidad_vendida} unidades
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${producto.ingresos_generados.toLocaleString()}
                            </Typography>
                          </Box>
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

              {/* Proveedores principales */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Proveedores Principales
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      {resumenInventario.proveedores_principales?.map((proveedor, index) => (
                        <Grid item xs={12} md={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" fontWeight={600} color="primary">
                              {proveedor.nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {proveedor.productos_suministrados} productos
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              ${proveedor.valor_inventario.toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Pestaña de Análisis */}
          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, textAlign: 'center', p: 4 }}>
                  <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Análisis Avanzado
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Funcionalidades de análisis predictivo y reportes avanzados próximamente
                  </Typography>
                  <Button variant="outlined" size="large">
                    Solicitar Acceso Beta
                  </Button>
                </Card>
              </Grid>
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>

      {/* SpeedDial para acciones rápidas */}
      <SpeedDial
        ariaLabel="Acciones rápidas"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
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
        movimientosRecientes={selectedProduct?.historialMovimientos || []}
      />

      <DeleteProductDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmarEliminacion}
        producto={selectedProduct}
      />

      {/* Diálogo de Edición Masiva */}
      <BulkEditDialog
        open={bulkEditDialogOpen}
        onClose={() => setBulkEditDialogOpen(false)}
        onSubmit={handleBulkOperation}
        selectedCount={selectedProducts.length}
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

// Componente para el diálogo de edición masiva
const BulkEditDialog = ({ open, onClose, onSubmit, selectedCount }) => {
  const [operacion, setOperacion] = useState('');
  const [parametros, setParametros] = useState({});

  const handleSubmit = () => {
    onSubmit(operacion, parametros);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Edición Masiva - {selectedCount} productos seleccionados
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Operación</InputLabel>
              <Select
                value={operacion}
                onChange={(e) => setOperacion(e.target.value)}
                label="Tipo de Operación"
              >
                <MenuItem value="actualizar_precios">Actualizar Precios</MenuItem>
                <MenuItem value="cambiar_categoria">Cambiar Categoría</MenuItem>
                <MenuItem value="ajustar_stock_minimo">Ajustar Stock Mínimo</MenuItem>
                <MenuItem value="desactivar">Desactivar Productos</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {operacion === 'actualizar_precios' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Porcentaje de Cambio"
                  type="number"
                  fullWidth
                  value={parametros.porcentaje_cambio || ''}
                  onChange={(e) => setParametros(prev => ({ 
                    ...prev, 
                    porcentaje_cambio: parseFloat(e.target.value) 
                  }))}
                  helperText="Ejemplo: 10 para aumentar 10%, -5 para reducir 5%"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Precio Fijo (Opcional)"
                  type="number"
                  fullWidth
                  value={parametros.precio_fijo || ''}
                  onChange={(e) => setParametros(prev => ({ 
                    ...prev, 
                    precio_fijo: parseFloat(e.target.value) 
                  }))}
                  helperText="Establecer el mismo precio para todos"
                />
              </Grid>
            </>
          )}

          {operacion === 'cambiar_categoria' && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Nueva Categoría</InputLabel>
                <Select
                  value={parametros.categoria || ''}
                  onChange={(e) => setParametros(prev => ({ 
                    ...prev, 
                    categoria: e.target.value 
                  }))}
                  label="Nueva Categoría"
                >
                  <MenuItem value="frutas">Frutas</MenuItem>
                  <MenuItem value="verduras">Verduras</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          {operacion === 'ajustar_stock_minimo' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nuevo Stock Mínimo"
                  type="number"
                  fullWidth
                  value={parametros.stock_minimo || ''}
                  onChange={(e) => setParametros(prev => ({ 
                    ...prev, 
                    stock_minimo: parseInt(e.target.value) 
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="% del Stock Actual (Opcional)"
                  type="number"
                  fullWidth
                  value={parametros.porcentaje_stock_actual || ''}
                  onChange={(e) => setParametros(prev => ({ 
                    ...prev, 
                    porcentaje_stock_actual: parseFloat(e.target.value) 
                  }))}
                  helperText="Ejemplo: 20 para 20% del stock actual"
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!operacion}
        >
          Aplicar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryPageEnhanced;