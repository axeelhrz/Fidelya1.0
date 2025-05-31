import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
  Grid,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Apple as FruitIcon,
  Grass as VegetableIcon,
  Category as OtherIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

// Esquema de validación con Yup
const schema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  categoria: yup
    .string()
    .required('La categoría es requerida')
    .oneOf(['frutas', 'verduras', 'otros'], 'Categoría inválida'),
  precio_unitario: yup
    .number()
    .required('El precio es requerido')
    .positive('El precio debe ser mayor a 0')
    .max(999999, 'El precio es demasiado alto'),
  stock_actual: yup
    .number()
    .required('El stock actual es requerido')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  stock_minimo: yup
    .number()
    .required('El stock mínimo es requerido')
    .integer('El stock mínimo debe ser un número entero')
    .min(0, 'El stock mínimo no puede ser negativo'),
  unidad: yup
    .string()
    .required('La unidad es requerida')
    .oneOf(['kg', 'unidad', 'caja'], 'Unidad inválida'),
  proveedor: yup
    .string()
    .max(100, 'El proveedor no puede exceder 100 caracteres'),
});

const InventoryFormDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  producto = null, 
  editMode = false 
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
      categoria: 'frutas',
      precio_unitario: '',
      stock_actual: '',
      stock_minimo: '',
      unidad: 'kg',
      proveedor: '',
    },
  });

  const watchedCategoria = watch('categoria');

  // Resetear formulario cuando se abre/cierra o cambia el producto
  useEffect(() => {
    if (open) {
      if (editMode && producto) {
        reset({
          nombre: producto.nombre || '',
          categoria: producto.categoria || 'frutas',
          precio_unitario: producto.precio_unitario || '',
          stock_actual: producto.stock_actual || '',
          stock_minimo: producto.stock_minimo || '',
          unidad: producto.unidad || 'kg',
          proveedor: producto.proveedor || '',
        });
      } else {
        reset({
          nombre: '',
          categoria: 'frutas',
          precio_unitario: '',
          stock_actual: '',
          stock_minimo: '',
          unidad: 'kg',
          proveedor: '',
        });
      }
    }
  }, [open, editMode, producto, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error en formulario:', error);
    }
  };

  const getCategoryIcon = (categoria) => {
    switch (categoria) {
      case 'frutas':
        return <FruitIcon sx={{ color: 'success.main' }} />;
      case 'verduras':
        return <VegetableIcon sx={{ color: 'primary.main' }} />;
      default:
        return <OtherIcon sx={{ color: 'warning.main' }} />;
    }
  };

  const categorias = [
    { value: 'frutas', label: 'Frutas', icon: <FruitIcon /> },
    { value: 'verduras', label: 'Verduras', icon: <VegetableIcon /> },
    { value: 'otros', label: 'Otros', icon: <OtherIcon /> },
  ];

  const unidades = [
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'unidad', label: 'Unidad' },
    { value: 'caja', label: 'Caja' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '60vh',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              {editMode ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {editMode ? 'Editar Producto' : 'Nuevo Producto'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editMode 
                    ? 'Modifica los datos del producto' 
                    : 'Completa la información del nuevo producto'
                  }
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={3}>
              {/* Información básica */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
                      label="Nombre del producto"
                      fullWidth
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {getCategoryIcon(watchedCategoria)}
                          </InputAdornment>
                        ),
                      }}
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
                      <Select {...field} label="Categoría">
                        {categorias.map((cat) => (
                          <MenuItem key={cat.value} value={cat.value}>
                            <Box display="flex" alignItems="center" gap={1}>
                              {cat.icon}
                              {cat.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.categoria && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.categoria.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="proveedor"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Proveedor (opcional)"
                      fullWidth
                      error={!!errors.proveedor}
                      helperText={errors.proveedor?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="unidad"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.unidad}>
                      <InputLabel>Unidad de medida</InputLabel>
                      <Select {...field} label="Unidad de medida">
                        {unidades.map((unidad) => (
                          <MenuItem key={unidad.value} value={unidad.value}>
                            {unidad.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.unidad && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.unidad.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Precio y Stock */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                  Precio y Stock
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="precio_unitario"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Precio unitario"
                      type="number"
                      fullWidth
                      error={!!errors.precio_unitario}
                      helperText={errors.precio_unitario?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="stock_actual"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Stock actual"
                      type="number"
                      fullWidth
                      error={!!errors.stock_actual}
                      helperText={errors.stock_actual?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="stock_minimo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Stock mínimo"
                      type="number"
                      fullWidth
                      error={!!errors.stock_minimo}
                      helperText={errors.stock_minimo?.message || 'Para alertas de stock bajo'}
                    />
                  )}
                />
              </Grid>

              {/* Información adicional */}
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Tip:</strong> El stock mínimo se usa para generar alertas automáticas 
                    cuando el producto esté por agotarse.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default InventoryFormDialog;