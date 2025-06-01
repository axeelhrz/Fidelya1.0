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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { purchaseService } from '../../../services/purchaseService';
import { inventoryService } from '../../../services/inventoryService';

const CompraDialog = ({ open, onClose, onSuccess, mode = 'create', compra = null }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    proveedor: '',
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
    productos: []
  });

  // Estado para nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    producto: '',
    cantidad: '',
    unidad: 'kg',
    precio_unitario: ''
  });

  useEffect(() => {
    if (open) {
      cargarDatos();
      if (mode === 'edit' && compra) {
        cargarDatosCompra();
      } else {
        resetForm();
      }
    }
  }, [open, mode, compra]);

  const cargarDatos = async () => {
    try {
      const [proveedoresData, productosData] = await Promise.all([
        purchaseService.obtenerProveedores(),
        inventoryService.obtenerProductos()
      ]);
      setProveedores(proveedoresData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error cargando datos necesarios');
    }
  };

  const cargarDatosCompra = async () => {
    try {
      const compraDetalle = await purchaseService.obtenerCompra(compra.id);
      setFormData({
        proveedor: compraDetalle.proveedor,
        fecha: compraDetalle.fecha,
        notas: compraDetalle.notas || '',
        productos: compraDetalle.productos || []
      });
    } catch (error) {
      console.error('Error cargando compra:', error);
      setError('Error cargando datos de la compra');
    }
  };

  const resetForm = () => {
    setFormData({
      proveedor: '',
      fecha: new Date().toISOString().split('T')[0],
      notas: '',
      productos: []
    });
    setNuevoProducto({
      producto: '',
      cantidad: '',
      unidad: 'kg',
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
  };

  const agregarProducto = () => {
    if (!nuevoProducto.producto || !nuevoProducto.cantidad || !nuevoProducto.precio_unitario) {
      setError('Todos los campos del producto son requeridos');
      return;
    }

    const cantidad = parseFloat(nuevoProducto.cantidad);
    const precio = parseFloat(nuevoProducto.precio_unitario);

    if (cantidad <= 0 || precio <= 0) {
      setError('Cantidad y precio deben ser mayores a 0');
      return;
    }

    const subtotal = cantidad * precio;

    const producto = {
      producto: nuevoProducto.producto,
      cantidad: cantidad,
      unidad: nuevoProducto.unidad,
      precio_unitario: precio,
      subtotal: subtotal
    };

    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, producto]
    }));

    setNuevoProducto({
      producto: '',
      cantidad: '',
      unidad: 'kg',
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

  const calcularTotal = () => {
    return formData.productos.reduce((total, producto) => total + producto.subtotal, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async () => {
    if (!formData.proveedor || !formData.fecha || formData.productos.length === 0) {
      setError('Proveedor, fecha y al menos un producto son requeridos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const compraData = {
        proveedor: formData.proveedor,
        fecha: formData.fecha,
        notas: formData.notas,
        productos: formData.productos
      };

      if (mode === 'create') {
        await purchaseService.crearCompra(compraData);
      } else {
        await purchaseService.actualizarCompra(compra.id, {
          proveedor: formData.proveedor,
          fecha: formData.fecha,
          notas: formData.notas
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error guardando compra:', error);
      setError(error.message || 'Error al guardar la compra');
    } finally {
      setLoading(false);
    }
  };

  const productosDisponibles = productos.map(p => p.nombre);

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
          <ShoppingCartIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {mode === 'create' ? 'Registrar Nueva Compra' : 'Editar Compra'}
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
              options={proveedores}
              value={formData.proveedor}
              onChange={(event, newValue) => handleInputChange('proveedor', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proveedor *"
                  placeholder="Seleccionar o escribir proveedor"
                  variant="outlined"
                  fullWidth
                />
              )}
              freeSolo
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha *"
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notas"
              value={formData.notas}
              onChange={(e) => handleInputChange('notas', e.target.value)}
              placeholder="Notas adicionales sobre la compra"
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
                <Grid item xs={12} sm={3}>
                  <Autocomplete
                    options={productosDisponibles}
                    value={nuevoProducto.producto}
                    onChange={(event, newValue) => handleProductoChange('producto', newValue || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Producto"
                        size="small"
                        fullWidth
                      />
                    )}
                    freeSolo
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

                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    options={['kg', 'unidad', 'caja']}
                    value={nuevoProducto.unidad}
                    onChange={(event, newValue) => handleProductoChange('unidad', newValue || 'kg')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Unidad"
                        size="small"
                        fullWidth
                      />
                    )}
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

                <Grid item xs={12} sm={2}>
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
              Productos de la Compra
            </Typography>
            
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Unidad</TableCell>
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
                      <TableCell>{producto.producto}</TableCell>
                      <TableCell>{producto.cantidad}</TableCell>
                      <TableCell>{producto.unidad}</TableCell>
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
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell colSpan={mode === 'create' ? 4 : 3} sx={{ fontWeight: 600 }}>
                      TOTAL
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
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
          {loading ? 'Guardando...' : (mode === 'create' ? 'Registrar Compra' : 'Actualizar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompraDialog;