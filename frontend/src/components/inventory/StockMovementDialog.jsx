import React, { useState, useEffect } from 'react';
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
  Grid,
  Alert,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Card,
  CardContent,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  TrendingUp as IngresoIcon,
  TrendingDown as EgresoIcon,
  Edit as AjusteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
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
    .max(10000, 'La cantidad es demasiado alta'),
  motivo: yup
    .string()
    .required('El motivo es requerido')
    .min(3, 'El motivo debe tener al menos 3 caracteres')
    .max(255, 'El motivo no puede exceder 255 caracteres'),
  observaciones: yup
    .string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres'),
});

const StockMovementDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  producto = null,
  movimientosRecientes = []
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 'ingreso',
      cantidad: '',
      motivo: '',
      observaciones: '',
    },
  });

  const watchedTipo = watch('tipo');
  const watchedCantidad = watch('cantidad');

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (open && producto) {
      reset({
        tipo: 'ingreso',
        cantidad: '',
        motivo: '',
        observaciones: '',
      });
      setCurrentStep(0);
      setPreviewData(null);
    }
  }, [open, producto, reset]);

  // Actualizar preview cuando cambian los datos
  useEffect(() => {
    if (producto && watchedTipo && watchedCantidad) {
      const cantidad = parseFloat(watchedCantidad) || 0;
      let nuevoStock = producto.stock_actual;
      
      if (watchedTipo === 'ingreso') {
        nuevoStock = producto.stock_actual + cantidad;
      } else if (watchedTipo === 'egreso') {
        nuevoStock = Math.max(0, producto.stock_actual - cantidad);
      } else if (watchedTipo === 'ajuste') {
        nuevoStock = cantidad;
      }

      setPreviewData({
        stockActual: producto.stock_actual,
        nuevoStock: nuevoStock,
        diferencia: nuevoStock - producto.stock_actual,
        stockMinimo: producto.stock_minimo,
        alertaStockBajo: nuevoStock <= producto.stock_minimo,
        alertaSinStock: nuevoStock <= 0
      });
    }
  }, [producto, watchedTipo, watchedCantidad]);

  const getTipoConfig = (tipo) => {
    switch (tipo) {
      case 'ingreso':
        return {
          icon: IngresoIcon,
          color: 'success.main',
          bgColor: 'success.light',
          label: 'Ingreso de Stock',
          description: 'Aumentar la cantidad disponible'
        };
      case 'egreso':
        return {
          icon: EgresoIcon,
          color: 'error.main',
          bgColor: 'error.light',
          label: 'Egreso de Stock',
          description: 'Reducir la cantidad disponible'
        };
      case 'ajuste':
        return {
          icon: AjusteIcon,
          color: 'warning.main',
          bgColor: 'warning.light',
          label: 'Ajuste de Stock',
          description: 'Establecer cantidad exacta'
        };
      default:
        return {
          icon: InfoIcon,
          color: 'grey.500',
          bgColor: 'grey.100',
          label: 'Movimiento',
          description: ''
        };
    }
  };

  const motivosComunes = {
    ingreso: [
      'Compra a proveedor',
      'Devolución de cliente',
      'Corrección de inventario',
      'Transferencia entre sucursales',
      'Producción interna'
    ],
    egreso: [
      'Venta a cliente',
      'Producto dañado',
      'Producto vencido',
      'Muestra gratuita',
      'Transferencia entre sucursales'
    ],
    ajuste: [
      'Corrección por conteo físico',
      'Ajuste por diferencia de sistema',
      'Corrección de error de registro',
      'Actualización de inventario inicial'
    ]
  };

  const handleFormSubmit = async (data) => {
    try {
      const movimientoData = {
        producto_id: producto.id,
        tipo: data.tipo,
        cantidad: parseFloat(data.cantidad),
        motivo: data.motivo,
        observaciones: data.observaciones || null
      };
      
      await onSubmit(movimientoData);
      onClose();
    } catch (error) {
      console.error('Error en formulario de movimiento:', error);
    }
  };

  const handleNext = () => {
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const steps = ['Configurar Movimiento', 'Confirmar y Guardar'];

  if (!producto) return null;

  const tipoConfig = getTipoConfig(watchedTipo);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '70vh',
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
              <Avatar sx={{ bgcolor: tipoConfig.bgColor, color: tipoConfig.color }}>
                <tipoConfig.icon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Movimiento de Stock
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {producto.nombre} - {producto.categoria}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() => setShowHistory(!showHistory)}
                size="small"
                sx={{ mr: 1 }}
              >
                <HistoryIcon />
              </IconButton>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        {/* Historial de movimientos colapsable */}
        <Collapse in={showHistory}>
          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Movimientos Recientes
            </Typography>
            {movimientosRecientes.length > 0 ? (
              <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                {movimientosRecientes.slice(0, 5).map((mov, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={1}
                    borderBottom="1px solid"
                    borderColor="divider"
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={mov.tipo}
                        size="small"
                        color={mov.tipo === 'ingreso' ? 'success' : mov.tipo === 'egreso' ? 'error' : 'warning'}
                      />
                      <Typography variant="caption">
                        {mov.cantidad} {producto.unidad}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(mov.fecha).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No hay movimientos recientes
              </Typography>
            )}
          </Box>
        </Collapse>

        {/* Stepper */}
        <Box sx={{ px: 3, pt: 2 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ pt: 3 }}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Paso 1: Configuración */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Información del producto */}
                <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Stock Actual
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="primary">
                          {producto.stock_actual} {producto.unidad}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Stock Mínimo
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {producto.stock_minimo} {producto.unidad}
                        </Typography>
                        {producto.stock_actual <= producto.stock_minimo && (
                          <Chip
                            label="Stock Bajo"
                            color="warning"
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Grid container spacing={3}>
                  {/* Tipo de movimiento */}
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
                                <IngresoIcon color="success" />
                                Ingreso - Aumentar stock
                              </Box>
                            </MenuItem>
                            <MenuItem value="egreso">
                              <Box display="flex" alignItems="center" gap={1}>
                                <EgresoIcon color="error" />
                                Egreso - Reducir stock
                              </Box>
                            </MenuItem>
                            <MenuItem value="ajuste">
                              <Box display="flex" alignItems="center" gap={1}>
                                <AjusteIcon color="warning" />
                                Ajuste - Establecer cantidad exacta
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

                  {/* Cantidad */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="cantidad"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={watchedTipo === 'ajuste' ? 'Cantidad Final' : 'Cantidad a Mover'}
                          type="number"
                          fullWidth
                          error={!!errors.cantidad}
                          helperText={errors.cantidad?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {producto.unidad}
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Preview del resultado */}
                  {previewData && (
                    <Grid item xs={12} md={6}>
                      <Card 
                        sx={{ 
                          bgcolor: previewData.alertaSinStock ? 'error.light' : 
                                  previewData.alertaStockBajo ? 'warning.light' : 'success.light',
                          color: 'white'
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Resultado del Movimiento
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {previewData.nuevoStock} {producto.unidad}
                          </Typography>
                          <Typography variant="caption">
                            {previewData.diferencia > 0 ? '+' : ''}{previewData.diferencia} {producto.unidad}
                          </Typography>
                          {previewData.alertaSinStock && (
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <WarningIcon fontSize="small" />
                              <Typography variant="caption">
                                ¡Producto sin stock!
                              </Typography>
                            </Box>
                          )}
                          {previewData.alertaStockBajo && !previewData.alertaSinStock && (
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <WarningIcon fontSize="small" />
                              <Typography variant="caption">
                                Stock por debajo del mínimo
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Motivo */}
                  <Grid item xs={12}>
                    <Controller
                      name="motivo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Motivo del Movimiento"
                          fullWidth
                          multiline
                          rows={2}
                          error={!!errors.motivo}
                          helperText={errors.motivo?.message}
                          placeholder="Describe el motivo de este movimiento..."
                        />
                      )}
                    />
                  </Grid>

                  {/* Motivos comunes */}
                  {motivosComunes[watchedTipo] && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Motivos Comunes:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {motivosComunes[watchedTipo].map((motivo, index) => (
                          <Chip
                            key={index}
                            label={motivo}
                            variant="outlined"
                            size="small"
                            clickable
                            onClick={() => setValue('motivo', motivo)}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {/* Observaciones adicionales */}
                  <Grid item xs={12}>
                    <Controller
                      name="observaciones"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Observaciones Adicionales (Opcional)"
                          fullWidth
                          multiline
                          rows={2}
                          error={!!errors.observaciones}
                          helperText={errors.observaciones?.message}
                          placeholder="Información adicional sobre este movimiento..."
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* Validaciones y alertas */}
                {watchedTipo === 'egreso' && watchedCantidad && parseFloat(watchedCantidad) > producto.stock_actual && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Stock insuficiente:</strong> No puedes retirar más stock del disponible.
                      Stock actual: {producto.stock_actual} {producto.unidad}
                    </Typography>
                  </Alert>
                )}

                {previewData && previewData.alertaStockBajo && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Advertencia:</strong> Este movimiento dejará el producto por debajo del stock mínimo.
                    </Typography>
                  </Alert>
                )}
              </motion.div>
            )}

            {/* Paso 2: Confirmación */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Confirmar Movimiento de Stock
                </Typography>
                
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Producto
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {producto.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {producto.categoria} • {producto.unidad}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Tipo de Movimiento
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <tipoConfig.icon sx={{ color: tipoConfig.color }} />
                          <Typography variant="body1" fontWeight={600}>
                            {tipoConfig.label}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Stock Actual
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {producto.stock_actual} {producto.unidad}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Cantidad a Mover
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color={tipoConfig.color}>
                          {watchedTipo === 'egreso' ? '-' : watchedTipo === 'ingreso' ? '+' : '='}{watchedCantidad} {producto.unidad}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Stock Final
                        </Typography>
                        <Typography 
                          variant="h6" 
                          fontWeight={600}
                          color={previewData?.alertaSinStock ? 'error.main' : 
                                previewData?.alertaStockBajo ? 'warning.main' : 'success.main'}
                        >
                          {previewData?.nuevoStock} {producto.unidad}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Motivo
                        </Typography>
                        <Typography variant="body1">
                          {watch('motivo')}
                        </Typography>
                        
                        {watch('observaciones') && (
                          <>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                              Observaciones
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {watch('observaciones')}
                            </Typography>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Alertas finales */}
                {previewData?.alertaSinStock && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>¡Atención!</strong> Este movimiento dejará el producto sin stock disponible.
                    </Typography>
                  </Alert>
                )}

                {previewData?.alertaStockBajo && !previewData?.alertaSinStock && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Advertencia:</strong> El stock quedará por debajo del mínimo recomendado.
                    </Typography>
                  </Alert>
                )}

                <Alert severity="info">
                  <Typography variant="body2">
                    Este movimiento se registrará en el historial y no podrá ser modificado posteriormente.
                    Asegúrate de que todos los datos sean correctos antes de confirmar.
                  </Typography>
                </Alert>
              </motion.div>
            )}
          </form>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 2 }}>
          {currentStep === 0 ? (
            <>
              <Button
                onClick={onClose}
                variant="outlined"
                size="large"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                size="large"
                disabled={!watchedTipo || !watchedCantidad || !!errors.cantidad || !!errors.motivo}
                sx={{ minWidth: 120 }}
              >
                Siguiente
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleBack}
                variant="outlined"
                size="large"
                disabled={isSubmitting}
              >
                Atrás
              </Button>
              <Button
                onClick={handleSubmit(handleFormSubmit)}
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? 'Guardando...' : 'Confirmar Movimiento'}
              </Button>
            </>
          )}
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default StockMovementDialog;