import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  Alert,
  CircularProgress,
  Skeleton,
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
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { purchaseService } from '../../../services/purchaseService';
import { proveedorService } from '../../../services/proveedorService';
import inventoryService from '../../../services/inventoryService';

const CompraDialog = ({ open, onClose, onSuccess, mode = 'create', compra = null }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  // Refs para optimización
  const debounceTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);
  
  // Estados del formulario optimizados
  const [formData, setFormData] = useState({
    proveedor_id: '',
    fecha: new Date().toISOString().split('T')[0],
    numero_comprobante: '',
    metodo_pago: 'efectivo',
    observaciones: '',
    detalles: []
  });

  // Estado para nuevo producto optimizado
  const [nuevoProducto, setNuevoProducto] = useState({
    producto_id: '',
    cantidad: '',
    precio_unitario: '',
    subtotal: 0
  });

  // Función optimizada para cargar datos iniciales
  const cargarDatos = useCallback(async () => {
    if (loadingData) return; // Evitar múltiples cargas simultáneas
    
    setLoadingData(true);
    setErrors({});
    
    try {
      console.log('🔄 Cargando datos para CompraDialog...');
      
      // Cargar datos en paralelo para mejor rendimiento
      const [proveedoresData, productosData] = await Promise.allSettled([
        proveedorService.obtenerProveedores(),
        inventoryService.obtenerProductos()
      ]);
      
      // Manejar proveedores
      if (proveedoresData.status === 'fulfilled') {
        const proveedoresList = Array.isArray(proveedoresData.value) ? proveedoresData.value : [];
        setProveedores(proveedoresList);
        console.log('✅ Proveedores cargados:', proveedoresList.length);
      } else {
        console.warn('⚠️ Error cargando proveedores:', proveedoresData.reason);
        setProveedores([]);
      }
      
      // Manejar productos
      if (productosData.status === 'fulfilled') {
        const productosList = Array.isArray(productosData.value) ? productosData.value : [];
        setProductos(productosList);
        console.log('✅ Productos cargados:', productosList.length);
      } else {
        console.warn('⚠️ Error cargando productos:', productosData.reason);
        setProductos([]);
      }
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setErrors({ general: 'Error cargando datos. Intenta nuevamente.' });
    } finally {
      setLoadingData(false);
    }
  }, [loadingData]);

  // Inicializar datos cuando se abre el dialog
  useEffect(() => {
    if (open && !isInitializedRef.current) {
      isInitializedRef.current = true;
      cargarDatos();
      
      // Configurar datos para edición
      if (mode === 'edit' && compra) {
        setFormData({
          proveedor_id: compra.proveedor_id || '',
          fecha: compra.fecha ? compra.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
          numero_comprobante: compra.numero_comprobante || '',
          metodo_pago: compra.metodo_pago || 'efectivo',
          observaciones: compra.observaciones || '',
          detalles: Array.isArray(compra.detalles) ? compra.detalles.map(detalle => ({
            ...detalle,
            temp_id: detalle.temp_id || `${Date.now()}-${Math.random()}`
          })) : []
        });
      }
    }
  }, [open, mode, compra, cargarDatos]);

  // Limpiar refs cuando se cierra el dialog
  useEffect(() => {
    if (!open) {
      isInitializedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    }
  }, [open]);

  // Validación optimizada en tiempo real con debouncing
  const validacionTiempoReal = useMemo(() => {
    if (!submitAttempted) return {};
    
    const errores = {};

    if (!formData.proveedor_id) {
      errores.proveedor_id = 'Selecciona un proveedor';
    }
    if (!formData.fecha) {
      errores.fecha = 'Ingresa la fecha';
    }
    if (formData.detalles.length === 0) {
      errores.detalles = 'Agrega al menos un producto';
    }
    
    // Validar productos de forma optimizada
    formData.detalles.forEach((detalle, index) => {
      if (!detalle.producto_id) {
        errores[`detalle_${index}_producto`] = 'Producto requerido';
      }
      if (!detalle.cantidad || parseFloat(detalle.cantidad) <= 0) {
        errores[`detalle_${index}_cantidad`] = 'Cantidad inválida';
      }
      if (!detalle.precio_unitario || parseFloat(detalle.precio_unitario) <= 0) {
        errores[`detalle_${index}_precio`] = 'Precio inválido';
      }
    });

    return errores;
  }, [formData, submitAttempted]);

  // Calcular total optimizado con memoización
  const totalCalculado = useMemo(() => {
    return formData.detalles.reduce((total, detalle) => {
      const subtotal = parseFloat(detalle.subtotal) || 0;
      return total + subtotal;
    }, 0);
  }, [formData.detalles]);

  // Handler optimizado para cambios en el formulario
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo específico
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Handler optimizado para cambios en nuevo producto con debouncing
  const handleProductoChange = useCallback((field, value) => {
    setNuevoProducto(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcular subtotal automáticamente con debouncing
      if (field === 'cantidad' || field === 'precio_unitario') {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        
        debounceTimeoutRef.current = setTimeout(() => {
          const cantidad = parseFloat(updated.cantidad) || 0;
          const precio = parseFloat(updated.precio_unitario) || 0;
          updated.subtotal = cantidad * precio;
          
          setNuevoProducto(current => ({
            ...current,
            subtotal: cantidad * precio
          }));
        }, 300);
      }
      
      return updated;
    });
  }, []);

  // Función optimizada para agregar producto
  const agregarProducto = useCallback(() => {
    // Validaciones optimizadas
    const erroresProducto = {};
    
    if (!nuevoProducto.producto_id) {
      erroresProducto.nuevo_producto = 'Selecciona un producto';
    }
    if (!nuevoProducto.cantidad || parseFloat(nuevoProducto.cantidad) <= 0) {
      erroresProducto.nuevo_cantidad = 'Ingresa una cantidad válida';
    }
    if (!nuevoProducto.precio_unitario || parseFloat(nuevoProducto.precio_unitario) <= 0) {
      erroresProducto.nuevo_precio = 'Ingresa un precio válido';
    }

    // Verificar si el producto ya está agregado
    const productoExistente = formData.detalles.find(d => d.producto_id === nuevoProducto.producto_id);
    if (productoExistente) {
      erroresProducto.nuevo_producto = 'Este producto ya está agregado';
    }

    if (Object.keys(erroresProducto).length > 0) {
      setErrors(prev => ({ ...prev, ...erroresProducto }));
      return;
    }

    // Buscar información del producto
    const producto = productos.find(p => p.id === nuevoProducto.producto_id);
    const cantidad = parseFloat(nuevoProducto.cantidad);
    const precioUnitario = parseFloat(nuevoProducto.precio_unitario);
    
    const detalle = {
      producto_id: nuevoProducto.producto_id,
      cantidad: cantidad,
      precio_unitario: precioUnitario,
      subtotal: cantidad * precioUnitario,
      producto_nombre: producto?.nombre || 'Producto sin nombre',
      temp_id: `${Date.now()}-${Math.random()}` // ID temporal único
    };

    // Actualizar formulario de forma optimizada
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

    // Limpiar errores de producto
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.nuevo_producto;
      delete newErrors.nuevo_cantidad;
      delete newErrors.nuevo_precio;
      return newErrors;
    });
  }, [nuevoProducto, formData.detalles, productos]);

  // Función optimizada para eliminar producto
  const eliminarProducto = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  }, []);

  // Función optimizada para actualizar producto en la tabla
  const actualizarProducto = useCallback((index, campo, valor) => {
    setFormData(prev => {
      const nuevosDetalles = [...prev.detalles];
      nuevosDetalles[index] = {
        ...nuevosDetalles[index],
        [campo]: valor
      };
      
      // Recalcular subtotal si se cambia cantidad o precio
      if (campo === 'cantidad' || campo === 'precio_unitario') {
        const cantidad = parseFloat(nuevosDetalles[index].cantidad) || 0;
        const precio = parseFloat(nuevosDetalles[index].precio_unitario) || 0;
        nuevosDetalles[index].subtotal = cantidad * precio;
      }
      
      return {
        ...prev,
        detalles: nuevosDetalles
      };
    });
  }, []);

  // Validación optimizada del formulario
  const validarFormulario = useCallback(() => {
    setSubmitAttempted(true);
    
    const validacion = purchaseService.validarCompra({
      proveedor_id: formData.proveedor_id,
      fecha: formData.fecha,
      productos: formData.detalles,
      total: totalCalculado
    });

    if (!validacion.valido) {
      setErrors(validacion.errores);
      return false;
    }

    return true;
  }, [formData, totalCalculado]);

  // Handler optimizado para envío del formulario
  const handleSubmit = useCallback(async () => {
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      // Preparar datos optimizados para el backend
      const compraData = {
        proveedor_id: parseInt(formData.proveedor_id),
        fecha: formData.fecha,
        numero_comprobante: formData.numero_comprobante || '',
        metodo_pago: formData.metodo_pago,
        observaciones: formData.observaciones,
        productos: formData.detalles.map(detalle => ({
          id: parseInt(detalle.producto_id),
          cantidad: parseFloat(detalle.cantidad),
          precio_unitario: parseFloat(detalle.precio_unitario),
          subtotal: parseFloat(detalle.subtotal)
        })),
        total: totalCalculado,
        subtotal: totalCalculado,
        impuestos: 0
      };

      console.log('💾 Enviando datos de compra:', compraData);

      let resultado;
      if (mode === 'create') {
        resultado = await purchaseService.crearCompra(compraData);
        console.log('✅ Compra creada exitosamente:', resultado);
      } else {
        resultado = await purchaseService.actualizarCompra(compra.id, compraData);
        console.log('✅ Compra actualizada exitosamente:', resultado);
      }

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess(resultado);
      }
      
      handleClose();
    } catch (error) {
      console.error('❌ Error guardando compra:', error);
      setErrors({ 
        general: error.message || 'Error al guardar la compra. Intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  }, [formData, totalCalculado, mode, compra, validarFormulario, onSuccess]);

  // Handler optimizado para cerrar dialog
  const handleClose = useCallback(() => {
    // Limpiar timeouts
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Resetear estados
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
    setSubmitAttempted(false);
    isInitializedRef.current = false;
    
    onClose();
  }, [onClose]);

  // Función optimizada para formatear moneda
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  }, []);

  // Variantes de animación optimizadas
  const dialogVariants = useMemo(() => ({
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
  }), []);

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
          {/* Header del diálogo optimizado */}
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
                disabled={loading}
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
            {/* Mostrar errores generales */}
            {errors.general && (
              <Alert 
                severity="error" 
                icon={<WarningIcon />}
                sx={{ m: 3, mb: 0 }}
                onClose={() => setErrors(prev => ({ ...prev, general: null }))}
              >
                {errors.general}
              </Alert>
            )}

            {loadingData ? (
              <Box sx={{ p: 3 }}>
                {/* Skeleton loading optimizado */}
                <Card sx={{ mb: 3, borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                      {[...Array(4)].map((_, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
                <Card sx={{ mb: 3, borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
                    <Grid container spacing={2}>
                      {[...Array(5)].map((_, index) => (
                        <Grid item xs={12} md={2.4} key={index}>
                          <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Box sx={{ p: 3 }}>
                {/* Información general optimizada */}
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
                          loading={loadingData}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Proveedor *"
                              error={!!(validacionTiempoReal.proveedor_id || errors.proveedor_id)}
                              helperText={validacionTiempoReal.proveedor_id || errors.proveedor_id}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <BusinessIcon color="action" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <>
                                    {loadingData ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
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
                          noOptionsText="No hay proveedores disponibles"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Fecha de compra *"
                          value={formData.fecha}
                          onChange={(e) => handleInputChange('fecha', e.target.value)}
                          error={!!(validacionTiempoReal.fecha || errors.fecha)}
                          helperText={validacionTiempoReal.fecha || errors.fecha}
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
                            <MenuItem value="efectivo">💵 Efectivo</MenuItem>
                            <MenuItem value="transferencia">🏦 Transferencia</MenuItem>
                            <MenuItem value="cheque">📝 Cheque</MenuItem>
                            <MenuItem value="credito">💳 Crédito</MenuItem>
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

                {/* Agregar productos optimizado */}
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
                              error={!!errors.nuevo_producto}
                              helperText={errors.nuevo_producto}
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
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {option.nombre}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Stock: {option.stock || 0}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          noOptionsText="No hay productos disponibles"
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
                          error={!!errors.nuevo_cantidad}
                          helperText={errors.nuevo_cantidad}
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
                          error={!!errors.nuevo_precio}
                          helperText={errors.nuevo_precio}
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
                          value={formatCurrency(nuevoProducto.subtotal)}
                          InputProps={{
                            readOnly: true,
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

                    {(validacionTiempoReal.detalles || errors.detalles) && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {validacionTiempoReal.detalles || errors.detalles}
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Lista de productos optimizada */}
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
                          Productos Agregados ({formData.detalles.length})
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
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {detalle.producto_nombre}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="center">
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={detalle.cantidad}
                                      onChange={(e) => actualizarProducto(index, 'cantidad', parseFloat(e.target.value) || 0)}
                                      inputProps={{ min: 0, step: 0.01 }}
                                      sx={{ width: 80 }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={detalle.precio_unitario}
                                      onChange={(e) => actualizarProducto(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                                      inputProps={{ min: 0, step: 0.01 }}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                      }}
                                      sx={{ width: 100 }}
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                                      {formatCurrency(detalle.subtotal)}
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

                      {/* Total optimizado */}
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
                            {formatCurrency(totalCalculado)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
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
              disabled={loading || formData.detalles.length === 0 || loadingData}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{
                borderRadius: 3,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
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