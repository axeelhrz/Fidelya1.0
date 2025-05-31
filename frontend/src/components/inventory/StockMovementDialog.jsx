import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as SwapHorizIcon,
  Inventory2 as InventoryIcon,
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
    .integer('La cantidad debe ser un número entero')
    .typeError('Debe ser un número válido'),
  motivo: yup
    .string()
    .max(255, 'El motivo no puede exceder 255 caracteres'),
});

const StockMovementDialog = ({ open, onClose, onSubmit, producto }) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 'ingreso',
      cantidad: 1,
      motivo: '',
    },
  });

  const tipoMovimiento = watch('tipo');
  const cantidad = watch('cantidad');

  // Calcular nuevo stock
  const calcularNuevoStock = () => {
    if (!producto || !cantidad) return producto?.stock || 0;
    
    switch (tipoMovimiento) {
      case 'ingreso':
        return producto.stock + parseInt(cantidad);
      case 'egreso':
        return Math.max(0, producto.stock - parseInt(cantidad));
      case 'ajuste':
        return parseInt(cantidad);
      default:
        return producto.stock;
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Error en movimiento de stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  const getTipoInfo = (tipo) => {
    const tipos = {
      ingreso: {
        icon: <TrendingUpIcon />,
        color: 'success',
        label: 'Ingreso de Stock',
        description: 'Aumenta el stock actual',
        ejemplos: ['Compra de mercadería', 'Devolución de cliente', 'Corrección por faltante']
      },
      egreso: {
        icon: <TrendingDownIcon />,
        color: 'error',
        label: 'Egreso de Stock',
        description: 'Reduce el stock actual',
        ejemplos: ['Venta', 'Producto dañado', 'Merma', 'Muestra gratuita']
      },
      ajuste: {
        icon: <SwapHorizIcon />,
        color: 'warning',
        label: 'Ajuste de Stock',
        description: 'Establece un stock específico',
        ejemplos: ['Inventario físico', 'Corrección de sistema', 'Reconteo']
      }
    };
    return tipos[tipo];
  };

  const tipoInfo = getTipoInfo(tipoMovimiento);

  if (!producto) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <InventoryIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Ajustar Stock
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {producto.nombre}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent sx={{ pb: 2 }}>
            <Stack spacing={3}>
              {/* Información actual del producto */}
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    <strong>Stock actual:</strong> {producto.stock} {producto.unidad}
                  </Typography>
                  <Chip
                    label={producto.categoria}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </Alert>

              {/* Tipo de movimiento */}
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.tipo}>
                    <InputLabel>Tipo de movimiento</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de movimiento"
                      disabled={loading}
                    >
                      <MenuItem value="ingreso">
                        <Box display="flex" alignItems="center" gap={1}>
                          <TrendingUpIcon color="success" />
                          Ingreso de Stock
                        </Box>
                      </MenuItem>
                      <MenuItem value="egreso">
                        <Box display="flex" alignItems="center" gap={1}>
                          <TrendingDownIcon color="error" />
                          Egreso de Stock
                        </Box>
                      </MenuItem>
                      <MenuItem value="ajuste">
                        <Box display="flex" alignItems="center" gap={1}>
                          <SwapHorizIcon color="warning" />
                          Ajuste de Stock
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              {/* Información del tipo seleccionado */}
              <motion.div
                key={tipoMovimiento}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity={tipoInfo.color} sx={{ borderRadius: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                      {tipoInfo.label}
                    </Typography>
                    <Typography variant="body2" mb={1}>
                      {tipoInfo.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ejemplos: {tipoInfo.ejemplos.join(', ')}
                    </Typography>
                  </Box>
                </Alert>
              </motion.div>

              {/* Cantidad */}
              <Controller
                name="cantidad"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={tipoMovimiento === 'ajuste' ? 'Nuevo stock' : 'Cantidad'}
                    type="number"
                    inputProps={{ min: tipoMovimiento === 'ajuste' ? 0 : 1, step: 1 }}
                    error={!!errors.cantidad}
                    helperText={
                      errors.cantidad?.message ||
                      (tipoMovimiento === 'egreso' && cantidad > producto.stock
                        ? `⚠️ Stock insuficiente (disponible: ${producto.stock})`
                        : '')
                    }
                    disabled={loading}
                  />
                )}
              />

              {/* Motivo */}
              <Controller
                name="motivo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Motivo (opcional)"
                    placeholder="Describe el motivo del movimiento..."
                    multiline
                    rows={2}
                    error={!!errors.motivo}
                    helperText={errors.motivo?.message}
                    disabled={loading}
                  />
                )}
              />

              <Divider />

              {/* Resumen del cambio */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  Resumen del cambio:
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    Stock actual: <strong>{producto.stock}</strong>
                  </Typography>
                  <Typography variant="h6">→</Typography>
                  <Typography variant="body2">
                    Nuevo stock: <strong style={{ color: tipoInfo.color === 'error' ? '#d32f2f' : '#2e7d32' }}>
                      {calcularNuevoStock()}
                    </strong>
                  </Typography>
                </Stack>
                
                {calcularNuevoStock() <= producto.stock_minimo && (
                  <Alert severity="warning" sx={{ mt: 1, borderRadius: 1 }}>
                    <Typography variant="caption">
                      ⚠️ El nuevo stock estará por debajo del mínimo ({producto.stock_minimo})
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Stack>
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
              disabled={loading || (tipoMovimiento === 'egreso' && cantidad > producto.stock)}
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
                  Procesando...
                </Box>
              ) : (
                'Confirmar Movimiento'
              )}
            </Button>
          </DialogActions>
        </form>
      </motion.div>
    </Dialog>
  );
};

export default StockMovementDialog;