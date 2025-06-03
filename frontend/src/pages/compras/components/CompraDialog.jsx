import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Fade,
  useTheme,
  alpha,
  Autocomplete,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  Inventory as InventoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { purchaseService } from '../../../services/purchaseService';
import { proveedorService } from '../../../services/proveedorService';
import inventoryService from '../../../services/inventoryService';

const CompraDialog = ({ open, onClose, onSuccess, mode = 'create', compra = null }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    proveedor_id: '',
    fecha: new Date().toISOString().split('T')[0],
    numero_comprobante: '',
    metodo_pago: 'efectivo',
    observaciones: '',
    detalles: []
  });

  // Estado para nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    producto_id: '',
    cantidad: '',
    precio_unitario: '',
    subtotal: 0
  });

  useEffect(() => {
    if (open) {
      cargarDatos();
      if (mode === 'edit' && compra) {
        setFormData({
          proveedor_id: compra.proveedor_id || '',
          fecha: compra.fecha ? compra.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
          numero_comprobante: compra.numero_comprobante || '',
          metodo_pago: compra.metodo_pago || 'efectivo',
          observaciones: compra.observaciones || '',
          detalles: compra.detalles || []
        });
      }
    }
  }, [open, mode, compra]);

  const cargarDatos = async () => {
    try {
      const [proveedoresData, productosData] = await Promise.all([
        proveedorService.obtenerProveedores(),
        inventoryService.obtenerProductos()
      ]);
      setProveedores(proveedoresData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleProductoChange = (field, value) => {
    setNuevoProducto(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcular subtotal automáticamente
      if (field === 'cantidad' || field === 'precio_unitario') {
        const cantidad = parseFloat(updated.cantidad) || 0;
        const precio = parseFloat(updated.precio_unitario) || 0;
        updated.subtotal = cantidad * precio;
      }
      
      return updated;
    });
  };

  const agregarProducto = () => {
    if (!nuevoProducto.producto_id || !nuevoProducto.cantidad || !nuevoProducto.precio_unitario) {
      return;
    }

    const producto = productos.find(p => p.id === nuevoProducto.producto_id);
    const detalle = {
      id: nuevoProducto.producto_id, // Usar el ID del producto para el backend
      producto_id: nuevoProducto.producto_id,
      cantidad: parseFloat(nuevoProducto.cantidad),
      precio_unitario: parseFloat(nuevoProducto.precio_unitario),
      subtotal: parseFloat(nuevoProducto.subtotal),
      producto_nombre: producto?.nombre || '',
      temp_id: Date.now() // ID temporal solo para la tabla del frontend
    };

    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, detalle]
    }));

    // Limpiar formulario de producto
    setNuevoProducto({
      producto_id: '',
      cantidad: '',
      precio_unitario: '',
      subtotal: 0
    });
  };

  const eliminarProducto = (index) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const calcularTotal = () => {
    return formData.detalles.reduce((total, detalle) => total + (detalle.subtotal || 0), 0);
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.proveedor_id) {
      newErrors.proveedor_id = 'Selecciona un proveedor';
    }
    if (!formData.fecha) {
      newErrors.fecha = 'Ingresa la fecha';
    }
    if (formData.detalles.length === 0) {
      newErrors.detalles = 'Agrega al menos un producto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      // Preparar datos para el backend - cambiar 'detalles' por 'productos'
      const compraData = {
        proveedor_id: formData.proveedor_id,
        fecha: formData.fecha,
        numero_comprobante: formData.numero_comprobante,
        metodo_pago: formData.metodo_pago,
        observaciones: formData.observaciones,
        productos: formData.detalles.map(detalle => ({
          id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal
        })),
        total: calcularTotal(),
        subtotal: calcularTotal(), // El backend también espera subtotal
        impuestos: 0 // Agregar impuestos si es necesario
      };

      console.log('Enviando datos de compra:', compraData);

      if (mode === 'create') {
        await purchaseService.crearCompra(compraData);
      } else {
        await purchaseService.actualizarCompra(compra.id, compraData);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error guardando compra:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      proveedor_id: '',
      fecha: new Date().toISOString().split('T')[0],
      numero_comprobante: '',
      metodo_pago: 'efectivo',
      observaciones: '',
      detalles: []
    });
    setNuevoProducto({
      producto_id: '',
      cantidad: '',
      precio_unitario: '',
      subtotal: 0
    });
    setErrors({});
    onClose();
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            component: motion.div,
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            sx: {
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.15)}`,
            }
          }}
          BackdropProps={{
            sx: {
              backgroundColor: alpha(theme.palette.common.black, 0.7),
              backdropFilter: 'blur(8px)',
            }
          }}
        >
          {/* Header del diálogo */}
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3,
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    color: 'white',
                    width: 48,
                    height: 48,
                  }}
                >
                  <ShoppingCartIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {mode === 'create' ? 'Nueva Compra' : 'Editar Compra'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {mode === 'create' 
                      ? 'Registra una nueva compra a proveedor'
                      : `Modificar compra #${compra?.id || ''}`
                    }
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: 'white',
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: 3 }}>
              {/* Información general */}
              <Card 
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <BusinessIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Información General
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        value={proveedores.find(p => p.id === formData.proveedor_id) || null}
                        onChange={(event, newValue) => {
                          handleInputChange('proveedor_id', newValue?.id || '');
                        }}
                        options={proveedores}
                        getOptionLabel={(option) => option.nombre || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Proveedor *"
                            error={!!errors.proveedor_id}
                            helperText={errors.proveedor_id}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BusinessIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                              }
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 2,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                              }}
                            >
                              {option.nombre?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {option.nombre}
                              </Typography>
                              {option.rut && (
                                <Typography variant="caption" color="text.secondary">
                                  RUT: {option.rut}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha de compra *"
                        value={formData.fecha}
                        onChange={(e) => handleInputChange('fecha', e.target.value)}
                        error={!!errors.fecha}
                        helperText={errors.fecha}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Número de comprobante"
                        value={formData.numero_comprobante}
                        onChange={(e) => handleInputChange('numero_comprobante', e.target.value)}
                        placeholder="Ej: FAC-001234"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ReceiptIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Método de pago</InputLabel>
                        <Select
                          value={formData.metodo_pago}
                          onChange={(e) => handleInputChange('metodo_pago', e.target.value)}
                          label="Método de pago"
                          startAdornment={
                            <InputAdornment position="start">
                              <AttachMoneyIcon color="action" sx={{ ml: 1 }} />
                            </InputAdornment>
                          }
                          sx={{
                            borderRadius: 3,
                          }}
                        >
                          <MenuItem value="efectivo">Efectivo</MenuItem>
                          <MenuItem value="transferencia">Transferencia</MenuItem>
                          <MenuItem value="cheque">Cheque</MenuItem>
                          <MenuItem value="credito">Crédito</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Observaciones"
                        value={formData.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Notas adicionales sobre la compra..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Agregar productos */}
              <Card 
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Agregar Productos
                    </Typography>
                  </Box>

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        value={productos.find(p => p.id === nuevoProducto.producto_id) || null}
                        onChange={(event, newValue) => {
                          handleProductoChange('producto_id', newValue?.id || '');
                        }}
                        options={productos}
                        getOptionLabel={(option) => option.nombre || ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Producto"
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                mr: 1,
                                bgcolor: 'secondary.main',
                                fontSize: '0.75rem',
                              }}
                            >
                              {option.nombre?.charAt(0).toUpperCase()}
                            </Avatar>
                            {option.nombre}
                          </Box>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Cantidad"
                        value={nuevoProducto.cantidad}
                        onChange={(e) => handleProductoChange('cantidad', e.target.value)}
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Precio unitario"
                        value={nuevoProducto.precio_unitario}
                        onChange={(e) => handleProductoChange('precio_unitario', e.target.value)}
                        inputProps={{ min: 0, step: 0.01 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Subtotal"
                        value={nuevoProducto.subtotal.toFixed(2)}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={agregarProducto}
                        disabled={!nuevoProducto.producto_id || !nuevoProducto.cantidad || !nuevoProducto.precio_unitario}
                        startIcon={<AddIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        }}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>

                  {errors.detalles && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.detalles}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Lista de productos */}
              {formData.detalles.length > 0 && (
                <Card 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Productos Agregados
                      </Typography>
                    </Box>

                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                            <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Precio Unit.</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <AnimatePresence>
                            {formData.detalles.map((detalle, index) => (
                              <motion.tr
                                key={detalle.temp_id || index}
                                component={TableRow}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                sx={{
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                                  }
                                }}
                              >
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        mr: 1,
                                        bgcolor: 'secondary.main',
                                        fontSize: '0.75rem',
                                      }}
                                    >
                                      {detalle.producto_nombre?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    {detalle.producto_nombre}
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={detalle.cantidad}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  ${parseFloat(detalle.precio_unitario).toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                  <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                                    ${detalle.subtotal.toFixed(2)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Eliminar producto">
                                    <IconButton
                                      size="small"
                                      onClick={() => eliminarProducto(index)}
                                      sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.error.main, 0.1),
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Total */}
                    <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Total de la compra:
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            color: 'success.main',
                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          ${calcularTotal().toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: alpha(theme.palette.grey[400], 0.5),
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'grey.400',
                  bgcolor: alpha(theme.palette.grey[400], 0.05),
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || formData.detalles.length === 0}
              startIcon={loading ? null : <SaveIcon />}
              sx={{
                borderRadius: 3,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme

.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                '&:disabled': {
                  background: alpha(theme.palette.grey[400], 0.3),
                  color: 'text.disabled',
                },
              }}
            >
              {loading ? 'Guardando...' : (mode === 'create' ? 'Crear Compra' : 'Actualizar Compra')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CompraDialog;