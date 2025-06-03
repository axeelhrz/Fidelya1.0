import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ventasService } from '../../../services/ventasService';
import inventoryService from '../../../services/inventoryService';
import { clienteService } from '../../../services/clienteService';

const VentaDialog = ({ open, onClose, onSuccess, mode = 'create', venta = null }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    cliente_id: null,
    forma_pago: 'efectivo',
    descuento: 0,
    impuestos: 0,
    observaciones: '',
    productos: []
  });

  // Estado para nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    producto_id: null,
    cantidad: '',
    precio_unitario: ''
  });

  useEffect(() => {
    if (open) {
      cargarDatos();
      if (mode === 'edit' && venta) {
        cargarDatosVenta();
      } else {
        resetForm();
      }
    }
  }, [open, mode, venta]);

  const cargarDatos = async () => {
    try {
      const [productosData, clientesData] = await Promise.all([
        inventoryService.obtenerProductos(),
        clienteService.obtenerClientes()
      ]);
      setProductos(productosData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error cargando datos necesarios');
    }
  };

  const cargarDatosVenta = async () => {
    try {
      const ventaDetalle = await ventasService.obtenerVenta(venta.id);
      setFormData({
        cliente_id: ventaDetalle.cliente_id,
        forma_pago: ventaDetalle.forma_pago,
        descuento: ventaDetalle.descuento,
        impuestos: ventaDetalle.impuestos,
        observaciones: ventaDetalle.observaciones || '',
        productos: ventaDetalle.productos.map(p => ({
          producto_id: p.producto_id,
          nombre: p.producto_nombre,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario,
          subtotal: p.subtotal
        }))
      });
    } catch (error) {
      console.error('Error cargando venta:', error);
      setError('Error cargando datos de la venta');
    }
  };

  const resetForm = () => {
    setFormData({
      cliente_id: null,
      forma_pago: 'efectivo',
      descuento: 0,
      impuestos: 0,
      observaciones: '',
      productos: []
    });
    setNuevoProducto({
      producto_id: null,
      cantidad: '',
      precio_unitario: ''
    });
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductoChange = (field, value) => {
    setNuevoProducto(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-completar precio cuando se selecciona un producto
    if (field === 'producto_id' && value) {
      const producto = productos.find(p => p.id === value);
      if (producto) {
        setNuevoProducto(prev => ({
          ...prev,
          precio_unitario: producto.precio_unitario
        }));
      }
    }
  };

  const agregarProducto = () => {
    if (!nuevoProducto.producto_id || !nuevoProducto.cantidad || !nuevoProducto.precio_unitario) {
      setError('Todos los campos del producto son requeridos');
      return;
    }

    const cantidad = parseFloat(nuevoProducto.cantidad);
    const precio = parseFloat(nuevoProducto.precio_unitario);

    if (cantidad <= 0 || precio <= 0) {
      setError('Cantidad y precio deben ser mayores a 0');
      return;
    }

    const producto = productos.find(p => p.id === nuevoProducto.producto_id);
    
    // Verificar stock disponible
    if (producto && producto.stock_actual < cantidad) {
      setError(`Stock insuficiente. Disponible: ${producto.stock_actual} ${producto.unidad}`);
      return;
    }

    // Verificar si el producto ya está en la lista
    const productoExistente = formData.productos.find(p => p.producto_id === nuevoProducto.producto_id);
    if (productoExistente) {
      setError('Este producto ya está en la lista');
      return;
    }

    const subtotal = cantidad * precio;

    const nuevoProductoCompleto = {
      producto_id: nuevoProducto.producto_id,
      nombre: producto.nombre,
      cantidad: cantidad,
      precio_unitario: precio,
      subtotal: subtotal
    };

    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, nuevoProductoCompleto]
    }));

    setNuevoProducto({
      producto_id: null,
      cantidad: '',
      precio_unitario: ''
    });
    setError(null);
  };

  const eliminarProducto = (index) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
  };

  const calcularSubtotal = () => {
    return formData.productos.reduce((total, producto) => total + producto.subtotal, 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const descuento = parseFloat(formData.descuento) || 0;
    const impuestos = parseFloat(formData.impuestos) || 0;
    return subtotal - descuento + impuestos;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async () => {
    if (formData.productos.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ventaData = {
        cliente_id: formData.cliente_id,
        forma_pago: formData.forma_pago,
        descuento: parseFloat(formData.descuento) || 0,
        impuestos: parseFloat(formData.impuestos) || 0,
        observaciones: formData.observaciones,
        productos: formData.productos
      };

      if (mode === 'create') {
        await ventasService.crearVenta(ventaData);
      } else {
        await ventasService.actualizarVenta(venta.id, {
          cliente_id: formData.cliente_id,
          forma_pago: formData.forma_pago,
          descuento: parseFloat(formData.descuento) || 0,
          impuestos: parseFloat(formData.impuestos) || 0,
          observaciones: formData.observaciones
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error guardando venta:', error);
      setError(error.message || 'Error al guardar la venta');
    } finally {
      setLoading(false);
    }
  };

  const productosDisponibles = productos.filter(p => p.stock_actual > 0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoneyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {mode === 'create' ? 'Registrar Nueva Venta' : 'Editar Venta'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Información básica */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={clientes}
              getOptionLabel={(option) => option.nombre || ''}
              value={clientes.find(c => c.id === formData.cliente_id) || null}
              onChange={(event, newValue) => handleInputChange('cliente_id', newValue ? newValue.id : null)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente (Opcional)"
                  placeholder="Seleccionar cliente o dejar vacío para venta rápida"
                  variant="outlined"
                  fullWidth
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.nombre}
                    </Typography>
                    {option.correo && (
                      <Typography variant="caption" color="text.secondary">
                        {option.correo}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Forma de Pago</InputLabel>
              <Select
                value={formData.forma_pago}
                onChange={(e) => handleInputChange('forma_pago', e.target.value)}
                label="Forma de Pago"
              >
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                <MenuItem value="transferencia">Transferencia</MenuItem>
                <MenuItem value="mixto">Mixto</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Descuento"
              type="number"
              value={formData.descuento}
              onChange={(e) => handleInputChange('descuento', e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Impuestos"
              type="number"
              value={formData.impuestos}
              onChange={(e) => handleInputChange('impuestos', e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Notas adicionales sobre la venta"
              multiline
              rows={2}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Agregar productos */}
        {mode === 'create' && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Agregar Productos
            </Typography>
            
            <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={productosDisponibles}
                    getOptionLabel={(option) => option.nombre || ''}
                    value={productosDisponibles.find(p => p.id === nuevoProducto.producto_id) || null}
                    onChange={(event, newValue) => handleProductoChange('producto_id', newValue ? newValue.id : null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Producto"
                        size="small"
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {option.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Stock: {option.stock_actual} {option.unidad} - {formatCurrency(option.precio_unitario)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={nuevoProducto.cantidad}
                    onChange={(e) => handleProductoChange('cantidad', e.target.value)}
                    size="small"
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Precio Unitario"
                    type="number"
                    value={nuevoProducto.precio_unitario}
                    onChange={(e) => handleProductoChange('precio_unitario', e.target.value)}
                    size="small"
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={agregarProducto}
                    startIcon={<AddIcon />}
                    fullWidth
                    size="small"
                  >
                    Agregar
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Lista de productos */}
        {formData.productos.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Productos de la Venta
            </Typography>
            
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Precio Unit.</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                    {mode === 'create' && (
                      <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.productos.map((producto, index) => (
                    <TableRow key={index}>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>{producto.cantidad}</TableCell>
                      <TableCell>{formatCurrency(producto.precio_unitario)}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {formatCurrency(producto.subtotal)}
                      </TableCell>
                      {mode === 'create' && (
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => eliminarProducto(index)}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  
                  {/* Fila de totales */}
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell colSpan={mode === 'create' ? 3 : 2} sx={{ fontWeight: 600 }}>
                      SUBTOTAL
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {formatCurrency(calcularSubtotal())}
                    </TableCell>
                    {mode === 'create' && <TableCell />}
                  </TableRow>
                  
                  {(formData.descuento > 0 || formData.impuestos > 0) && (
                    <>
                      {formData.descuento > 0 && (
                        <TableRow>
                          <TableCell colSpan={mode === 'create' ? 3 : 2} sx={{ fontWeight: 600 }}>
                            DESCUENTO
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                            -{formatCurrency(formData.descuento)}
                          </TableCell>
                          {mode === 'create' && <TableCell />}
                        </TableRow>
                      )}
                      
                      {formData.impuestos > 0 && (
                        <TableRow>
                          <TableCell colSpan={mode === 'create' ? 3 : 2} sx={{ fontWeight: 600 }}>
                            IMPUESTOS
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            +{formatCurrency(formData.impuestos)}
                          </TableCell>
                          {mode === 'create' && <TableCell />}
                        </TableRow>
                      )}
                    </>
                  )}
                  
                  <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                    <TableCell colSpan={mode === 'create' ? 3 : 2} sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      TOTAL
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '1.2rem', color: theme.palette.success.main }}>
                      {formatCurrency(calcularTotal())}
                    </TableCell>
                    {mode === 'create' && <TableCell />}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || formData.productos.length === 0}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Guardando...' : (mode === 'create' ? 'Registrar Venta' : 'Actualizar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VentaDialog;