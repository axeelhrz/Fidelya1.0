import React from 'react';
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
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import {
  TrendingUp as StockIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as AdjustIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

// Esquema de validación
const schema = yup.object({
  tipo: yup
    .string()
    .required('El tipo de movimiento es requerido')
    .oneOf(['ingreso', 'egreso', 'ajuste'], 'Tipo de movimiento inválido'),
  cantidad: yup
    .number()
    .required('La cantidad es requerida')
    .positive('La cantidad debe ser mayor a 0')
    .integer('La cantidad debe ser un número entero'),
  motivo: yup
    .string()
    .max(255, 'El motivo no puede exceder 255 caracteres'),
});

const StockMovementDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  producto = null 
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
      tipo: 'ingreso',
      cantidad: '',
      motivo: '',
    },
  });

  const watchedTipo = watch('tipo');

  React.useEffect(() => {
    if (open) {
      reset({
        tipo: 'ingreso',
        cantidad: '',
        motivo: '',
      });
    }
  }, [open, reset]);
  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error en movimiento de stock:', error);
    }
  };

  if (!producto) return null;

  const getTipoConfig = (tipo) => {
    switch (tipo) {
      case 'ingreso':
        return {
          label: 'Ingreso de Stock',
          icon: AddIcon,
          color: 'success',
          description: 'Agregar productos al inventario',
        };
      case 'egreso':
        return {
          label: 'Egreso de Stock',
          icon: RemoveIcon,
          color: 'error',
          description: 'Retirar productos del inventario',
        };
      case 'ajuste':
        return {
          label: 'Ajuste de Stock',
          icon: AdjustIcon,
          color: 'warning',
          description: 'Corregir cantidad en inventario',
        };
      default:
        return {
          label: 'Movimiento',
          icon: StockIcon,
          color: 'primary',
          description: '',
        };
    }
  };

  const tipoConfig = getTipoConfig(watchedTipo);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
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
              <Avatar
                sx={{
                  bgcolor: `${tipoConfig.color}.main`,
                  color: 'white',
                }}
              >
                <tipoConfig.icon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Ajustar Stock
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {producto.nombre}
                </Typography>
              </Box>
            </Box>
            <Button onClick={onClose} size="small" sx={{ minWidth: 'auto', p: 1 }}>
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {/* Información del producto */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
              mb: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Stock Actual
                </Typography>
                <Typography variant="h6" fontWeight={600} color="primary">
                  {producto.stock_actual} {producto.unidad}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Stock Mínimo
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {producto.stock_minimo} {producto.unidad}
                </Typography>
              </Grid>
            </Grid>
            
            {producto.stock_bajo && (
              <Chip
                label="Stock Bajo"
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.tipo}>
                      <InputLabel>Tipo de Movimiento</InputLabel>
                      <Select {...field} label="Tipo de Movimiento">
                        <MenuItem value="ingreso">
                          <Box display="flex" alignItems="center" gap={1}>
                            <AddIcon color="success" />
                            Ingreso - Agregar stock
                          </Box>
                        </MenuItem>
                        <MenuItem value="egreso">
                          <Box display="flex" alignItems="center" gap={1}>
                            <RemoveIcon color="error" />
                            Egreso - Retirar stock
                          </Box>
                        </MenuItem>
                        <MenuItem value="ajuste">
                          <Box display="flex" alignItems="center" gap={1}>
                            <AdjustIcon color="warning" />
                            Ajuste - Corregir stock
                          </Box>
                        </MenuItem>
                      </Select>
                      {errors.tipo && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                          {errors.tipo.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Alert severity={tipoConfig.color} sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>{tipoConfig.label}:</strong> {tipoConfig.description}
                  </Typography>
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="cantidad"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={`Cantidad ${watchedTipo === 'ajuste' ? '(nueva cantidad total)' : ''}`}
                      type="number"
                      fullWidth
                      error={!!errors.cantidad}
                      helperText={
                        errors.cantidad?.message || 
                        (watchedTipo === 'ajuste' 
                          ? 'Ingresa la cantidad total que debería tener el producto'
                          : `Cantidad a ${watchedTipo === 'ingreso' ? 'agregar' : 'retirar'} en ${producto.unidad}`
                        )
                      }
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" color="text.secondary">
                            {producto.unidad}
                          </Typography>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="motivo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Motivo (opcional)"
                      multiline
                      rows={3}
                      fullWidth
                      error={!!errors.motivo}
                      helperText={errors.motivo?.message || 'Describe el motivo del movimiento'}
                      placeholder="Ej: Compra a proveedor, venta, producto dañado, inventario físico..."
                    />
                  )}
                />
              </Grid>

              {/* Previsualización del resultado */}
              {watchedTipo && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${tipoConfig.color}.50`,
                      border: `1px solid`,
                      borderColor: `${tipoConfig.color}.200`,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Vista previa del cambio:
                    </Typography>
                    <Typography variant="body2">
                      Stock actual: <strong>{producto.stock_actual} {producto.unidad}</strong>
                    </Typography>
                    <Typography variant="body2" color={`${tipoConfig.color}.main`}>
                      {watchedTipo === 'ajuste' 
                        ? 'Nuevo stock: Se establecerá según la cantidad ingresada'
                        : `Después del ${watchedTipo}: Se ${watchedTipo === 'ingreso' ? 'sumará' : 'restará'} la cantidad especificada`
                      }
                    </Typography>
                  </Box>
                </Grid>
              )}
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
            color={tipoConfig.color}
            size="large"
            startIcon={<tipoConfig.icon />}
            disabled={isSubmitting}
            sx={{ minWidth: 140 }}
          >
            {isSubmitting ? 'Procesando...' : `Confirmar ${tipoConfig.label}`}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default StockMovementDialog;