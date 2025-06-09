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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Stack,
  Fade,
  Slide,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ventasService } from '../../../services/ventasService';
import inventoryService from '../../../services/inventoryService';
import { clienteService } from '../../../services/clienteService';

const VentaDialog = ({ open, onClose, onSuccess, mode = 'create', venta = null }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  
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

  const steps = ['Información Básica', 'Productos', 'Resumen'];

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
      setActiveStep(2); // Ir directamente al resumen en modo edición
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
    setActiveStep(0);
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

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (formData.productos.length === 0) {
        setError('Debe agregar al menos un producto');
        return;
      }
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Información del Cliente
                    </Typography>
                  </Box>
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
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Forma de Pago</InputLabel>
                  <Select
                    value={formData.forma_pago}
                    onChange={(e) => handleInputChange('forma_pago', e.target.value)}
                    label="Forma de Pago"
                  >
                    <MenuItem value="efectivo">💵 Efectivo</MenuItem>
                    <MenuItem value="tarjeta">💳 Tarjeta</MenuItem>
                    <MenuItem value="transferencia">🏦 Transferencia</MenuItem>
                    <MenuItem value="mixto">🔄 Mixto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Notas adicionales sobre la venta"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                />
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
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                  }}
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
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Agregar productos */}
            {mode === 'create' && (
              <Card sx={{ mb: 3, p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  🛒 Agregar Productos
                </Typography>
                
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
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Button
                      variant="contained"
                      onClick={agregarProducto}
                      startIcon={<AddIcon />}
                      fullWidth
                      size="small"
                      sx={{ py: 1.5 }}
                    >
                      Agregar
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            )}

            {/* Lista de productos */}
            {formData.productos.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    📦 Productos de la Venta
                  </Typography>
                  
                  <TableContainer>
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
                        <AnimatePresence>
                          {formData.productos.map((producto, index) => (
                            <motion.tr
                              key={index}
                              component={TableRow}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
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
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}

            {formData.productos.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No hay productos agregados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Agrega productos para continuar con la venta
                </Typography>
              </Box>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* Resumen de la venta */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      📋 Resumen de la Venta
                    </Typography>
                    
                    {/* Información del cliente */}
                    <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Cliente:
                      </Typography>
                      <Typography variant="body2">
                        {formData.cliente_id 
                          ? clientes.find(c => c.id === formData.cliente_id)?.nombre || 'Cliente desconocido'
                          : 'Venta rápida (sin cliente)'
                        }
                      </Typography>
                    </Box>

                    {/* Forma de pago */}
                    <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Forma de Pago:
                      </Typography>
                      <Chip 
                        label={formData.forma_pago.toUpperCase()}
                        color="success"
                        size="small"
                      />
                    </Box>

                    {/* Observaciones */}
                    {formData.observaciones && (
                      <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.grey[500], 0.05), borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Observaciones:
                        </Typography>
                        <Typography variant="body2">
                          {formData.observaciones}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Totales */}
              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: alpha(theme.palette.success.main, 0.05) }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      💰 Totales
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(calcularSubtotal())}
                        </Typography>
                      </Box>
                      
                      {formData.descuento > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="error">Descuento:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} color="error">
                            -{formatCurrency(formData.descuento)}
                          </Typography>
                        </Box>
                      )}
                      
                      {formData.impuestos > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Impuestos:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            +{formatCurrency(formData.impuestos)}
                          </Typography>
                        </Box>
                      )}
                      
                      <Divider />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                          {formatCurrency(calcularTotal())}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Productos resumen */}
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      📦 Productos ({formData.productos.length})
                    </Typography>
                    <Stack spacing={1}>
                      {formData.productos.map((producto, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            p: 1, 
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {producto.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {producto.cantidad} × {formatCurrency(producto.precio_unitario)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 4,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {mode === 'create' ? '🆕 Registrar Nueva Venta' : '✏️ Editar Venta'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                m: 3, 
                borderRadius: 3,
                fontWeight: 500
              }}
              icon={<WarningIcon />}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Stepper */}
        {mode === 'create' && (
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: completed 
                            ? theme.palette.success.main 
                            : active 
                              ? theme.palette.primary.main 
                              : theme.palette.grey[300],
                          color: 'white',
                          fontWeight: 600,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {completed ? <CheckCircleIcon /> : index + 1}
                      </Box>
                    )}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: activeStep === index ? 600 : 400,
                        color: activeStep === index ? theme.palette.primary.main : 'text.secondary'
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Contenido del paso */}
        <Box sx={{ p: 3, minHeight: 400 }}>
          <AnimatePresence mode="wait">
            {renderStepContent(mode === 'edit' ? 2 : activeStep)}
          </AnimatePresence>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.background.default, 0.5)
      }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Box>
            {mode === 'create' && activeStep > 0 && (
              <Button 
                onClick={handleBack}
                variant="outlined"
                sx={{ borderRadius: 3 }}
              >
                Anterior
              </Button>
            )}
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button 
              onClick={onClose} 
              variant="outlined"
              sx={{ borderRadius: 3 }}
            >
              Cancelar
            </Button>
            
            {mode === 'create' ? (
              activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={loading || formData.productos.length === 0}
                  sx={{ 
                    minWidth: 140,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                    }
                  }}
                  startIcon={loading ? null : <CheckCircleIcon />}
                >
                  {loading ? 'Guardando...' : 'Registrar Venta'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{ 
                    minWidth: 120,
                    borderRadius: 3
                  }}
                >
                  Siguiente
                </Button>
              )
            ) : (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{ 
                  minWidth: 120,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`,
                  }
                }}
                startIcon={loading ? null : <CheckCircleIcon />}
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default VentaDialog;