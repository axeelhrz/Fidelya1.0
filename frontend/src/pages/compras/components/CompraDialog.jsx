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
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { purchaseService } from '../../../services/purchaseService';
import { proveedorService } from '../../../services/proveedorService';
import { inventoryService } from '../../../services/inventoryService';

// Esquema de validación
const schema = yup.object().shape({
  proveedor_id: yup.number().required('El proveedor es requerido'),
  fecha: yup.string().required('La fecha es requerida'),
  nro_comprobante: yup.string(),
  observaciones: yup.string(),
  productos: yup.array().of(
    yup.object().shape({
      producto_id: yup.number().required('Producto requerido'),
      cantidad: yup.number().positive('Cantidad debe ser mayor a 0').required('Cantidad requerida'),
      precio_unitario: yup.number().positive('Precio debe ser mayor a 0').required('Precio requerido'),
    })
  ).min(1, 'Debe agregar al menos un producto'),
});

const CompraDialog = ({ open, onClose, onSuccess, mode = 'create', compra = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      proveedor_id: '',
    fecha: new Date().toISOString().split('T')[0],
      nro_comprobante: '',
      observaciones: '',
      productos: [{ producto_id: '', cantidad: '', precio_unitario: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productos'
  });

  const watchedProductos = watch('productos');
  useEffect(() => {
    if (open) {
      cargarDatos();
      if (mode === 'edit' && compra) {
        cargarDatosCompra();
      } else {
        reset({
          proveedor_id: '',
      fecha: new Date().toISOString().split('T')[0],
          nro_comprobante: '',
          observaciones: '',
          productos: [{ producto_id: '', cantidad: '', precio_unitario: '' }]
    });
      }
    }
  }, [open, mode, compra, reset]);

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
      setError('Error cargando datos necesarios');
    }
  };

  const cargarDatosCompra = async () => {
    try {
      const compraDetalle = await purchaseService.obtenerCompra(compra.id);
      reset({
        proveedor_id: compraDetalle.proveedor_id,
        fecha: compraDetalle.fecha,
        nro_comprobante: compraDetalle.nro_comprobante || '',
        observaciones: compraDetalle.observaciones || '',
        productos: compraDetalle.productos.map(p => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario
        }))
      });
    } catch (error) {
      console.error('Error cargando compra:', error);
      setError('Error cargando datos de la compra');
    }
};

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        await purchaseService.crearCompra(data);
      } else {
        await purchaseService.actualizarCompra(compra.id, data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error guardando compra:', error);
      setError(error.message || 'Error al guardar la compra');
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = () => {
    append({ producto_id: '', cantidad: '', precio_unitario: '' });
  };

  const eliminarProducto = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calcularSubtotal = (cantidad, precio) => {
    const cant = parseFloat(cantidad) || 0;
    const prec = parseFloat(precio) || 0;
    return cant * prec;
  };

  const calcularTotal = () => {
    return watchedProductos.reduce((total, producto) => {
      return total + calcularSubtotal(producto.cantidad, producto.precio_unitario);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCartIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {mode === 'create' ? 'Nueva Compra' : 'Editar Compra'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Información básica */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Información de la Compra
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="proveedor_id"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={proveedores}
                      getOptionLabel={(option) => option.nombre || ''}
                      value={proveedores.find(p => p.id === field.value) || null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue?.id || '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Proveedor *"
                          error={!!errors.proveedor_id}
                          helperText={errors.proveedor_id?.message}
                          fullWidth
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
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
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Controller
                  name="fecha"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fecha *"
                      type="date"
                      error={!!errors.fecha}
                      helperText={errors.fecha?.message}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Controller
                  name="nro_comprobante"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nº Comprobante"
                      placeholder="Ej: FAC-001234"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiptIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="observaciones"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Observaciones"
                      multiline
                      rows={2}
                      placeholder="Notas adicionales sobre la compra..."
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Productos */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Productos
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={agregarProducto}
                size="small"
              >
                Agregar Producto
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 120 }}>Cantidad</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 120 }}>Precio Unit.</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 120 }}>Subtotal</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 60 }}>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {fields.map((field, index) => (
                      <motion.tr
                        key={field.id}
                        component={TableRow}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell>
                          <Controller
                            name={`productos.${index}.producto_id`}
                            control={control}
                            render={({ field: productField }) => (
                              <Autocomplete
                                {...productField}
                                options={productos}
                                getOptionLabel={(option) => option.nombre || ''}
                                value={productos.find(p => p.id === productField.value) || null}
                                onChange={(event, newValue) => {
                                  productField.onChange(newValue?.id || '');
                                  if (newValue) {
                                    setValue(`productos.${index}.precio_unitario`, newValue.precio_unitario || '');
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    error={!!errors.productos?.[index]?.producto_id}
                                    placeholder="Seleccionar producto"
                                  />
                                )}
                                renderOption={(props, option) => (
                                  <Box component="li" {...props}>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {option.nombre}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Stock: {option.stock_actual} {option.unidad} | ${option.precio_unitario}
                                      </Typography>
                                    </Box>
                                  </Box>
                                )}
                              />
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Controller
                            name={`productos.${index}.cantidad`}
                            control={control}
                            render={({ field: cantField }) => (
                              <TextField
                                {...cantField}
                                size="small"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                                error={!!errors.productos?.[index]?.cantidad}
                                fullWidth
                              />
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Controller
                            name={`productos.${index}.precio_unitario`}
                            control={control}
                            render={({ field: precioField }) => (
                              <TextField
                                {...precioField}
                                size="small"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                                error={!!errors.productos?.[index]?.precio_unitario}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <MoneyIcon sx={{ fontSize: 16 }} />
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                              />
                            )}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={formatCurrency(calcularSubtotal(
                              watchedProductos[index]?.cantidad,
                              watchedProductos[index]?.precio_unitario
                            ))}
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <IconButton
                            onClick={() => eliminarProducto(index)}
                            disabled={fields.length === 1}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total: {formatCurrency(calcularTotal())}
                </Typography>
              </Paper>
            </Box>

            {errors.productos && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.productos.message}
              </Alert>
            )}
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Guardando...' : mode === 'create' ? 'Crear Compra' : 'Actualizar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CompraDialog;