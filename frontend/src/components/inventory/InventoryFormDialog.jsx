import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Inventory2 as InventoryIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

// Esquema de validación
const schema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  categoria: yup
    .string()
    .required('La categoría es requerida')
    .oneOf(['fruta', 'verdura', 'otro'], 'Categoría inválida'),
  proveedor: yup
    .string()
    .max(100, 'El proveedor no puede exceder 100 caracteres'),
  unidad: yup
    .string()
    .required('La unidad es requerida')
    .max(20, 'La unidad no puede exceder 20 caracteres'),
  precio_compra: yup
    .number()
    .min(0, 'El precio de compra debe ser mayor o igual a 0')
    .typeError('Debe ser un número válido'),
  precio_venta: yup
    .number()
    .min(0, 'El precio de venta debe ser mayor o igual a 0')
    .typeError('Debe ser un número válido'),
  stock: yup
    .number()
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock debe ser mayor o igual a 0')
    .typeError('Debe ser un número válido'),
  stock_minimo: yup
    .number()
    .integer('El stock mínimo debe ser un número entero')
    .min(0, 'El stock mínimo debe ser mayor o igual a 0')
    .typeError('Debe ser un número válido'),
});

const InventoryFormDialog = ({ open, onClose, onSubmit, producto, editMode }) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
      categoria: 'fruta',
      proveedor: '',
      unidad: 'kg',
      precio_compra: 0,
      precio_venta: 0,
      stock: 0,
      stock_minimo: 5,
    },
  });

  // Observar precios para calcular margen
  const precioCompra = watch('precio_compra');
  const precioVenta = watch('precio_venta');

  // Calcular margen de ganancia
  const calcularMargen = () => {
    if (precioCompra > 0 && precioVenta > 0) {
      const margen = ((precioVenta - precioCompra) / precioCompra) * 100;
      return margen.toFixed(1);
    }
    return '0.0';
  };

  // Resetear formulario cuando cambie el producto o se abra/cierre
  useEffect(() => {
    if (open) {
      if (editMode && producto) {
        reset({
          nombre: producto.nombre || '',
          categoria: producto.categoria || 'fruta',
          proveedor: producto.proveedor || '',
          unidad: producto.unidad || 'kg',
          precio_compra: producto.precio_compra || 0,
          precio_venta: producto.precio_venta || 0,
          stock: producto.stock || 0,
          stock_minimo: producto.stock_minimo || 5,
        });
      } else {
        reset({
          nombre: '',
          categoria: 'fruta',
          proveedor: '',
          unidad: 'kg',
          precio_compra: 0,
          precio_venta: 0,
          stock: 0,
          stock_minimo: 5,
        });
      }
    }
  }, [open, editMode, producto, reset]);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Error en formulario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <InventoryIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {editMode ? 'Editar Producto' : 'Nuevo Producto'}
            </Typography>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent sx={{ pb: 2 }}>
            <Grid container spacing={3}>
              {/* Información básica */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>
                  Información Básica
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre del producto"
                      placeholder="Ej: Manzana Roja"
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="categoria"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.categoria}>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        {...field}
                        label="Categoría"
                        disabled={loading}
                      >
                        <MenuItem value="fruta">Fruta</MenuItem>
                        <MenuItem value="verdura">Verdura</MenuItem>
                        <MenuItem value="otro">Otro</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <Controller
                  name="proveedor"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Proveedor"
                      placeholder="Ej: Frutas del Sur"
                      error={!!errors.proveedor}
                      helperText={errors.proveedor?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="unidad"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Unidad de medida"
                      placeholder="Ej: kg, unidad, caja"
                      error={!!errors.unidad}
                      helperText={errors.unidad?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              {/* Precios */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>
                  Precios
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="precio_compra"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Precio de compra"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={!!errors.precio_compra}
                      helperText={errors.precio_compra?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="precio_venta"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Precio de venta"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={!!errors.precio_venta}
                      helperText={errors.precio_venta?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Alert
                  severity={parseFloat(calcularMargen()) > 0 ? "success" : "warning"}
                  sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="body2">
                    <strong>Margen: {calcularMargen()}%</strong>
                  </Typography>
                </Alert>
              </Grid>

              {/* Stock */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>
                  Inventario
                </Typography>
              </Grid>


              <Grid item xs={12} md={6}>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Stock inicial"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      error={!!errors.stock}
                      helperText={errors.stock?.message || (editMode ? "Para ajustar stock, usa la opción 'Ajustar Stock'" : "")}
                      disabled={loading || editMode}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="stock_minimo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Stock mínimo"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      error={!!errors.stock_minimo}
                      helperText={errors.stock_minimo?.message || "Cantidad mínima antes de alerta"}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              {editMode && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Nota:</strong> Para modificar el stock actual, utiliza la función "Ajustar Stock" 
                      desde la tabla de productos. Esto mantendrá un registro de los movimientos.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              startIcon={<CloseIcon />}
              sx={{ borderRadius: 2 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? null : <SaveIcon />}
              sx={{ borderRadius: 2, minWidth: 120 }}
            >
              {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <SaveIcon />
                  </motion.div>
                  Guardando...
                </Box>
              ) : (
                editMode ? 'Actualizar' : 'Crear Producto'
              )}
            </Button>
          </DialogActions>
        </form>
      </motion.div>
    </Dialog>
  );
};

export default InventoryFormDialog;