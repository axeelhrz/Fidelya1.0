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
  StepContent,
  Collapse,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  CheckCircle as CheckIcon,
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
  producto = null
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [movimientosRecientes, setMovimientosRecientes] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
      cargarHistorialReciente();
    }
  }, [open, producto, reset]);

  // Cargar historial reciente del producto
  const cargarHistorialReciente = async () => {
    if (!producto) return;
    
    try {
      setLoadingHistory(true);
      // Si el producto ya tiene historial, usarlo; si no, hacer petición
      if (producto.historialMovimientos) {
        setMovimientosRecientes(producto.historialMovimientos.slice(0, 5));
      } else {
        // Aquí podrías hacer una petición al servicio si es necesario
        setMovimientosRecientes([]);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      setMovimientosRecientes([]);
    } finally {
      setLoadingHistory(false);
    }
  };

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

  // Validaciones para el botón siguiente
  const canProceedToNext = () => {
    if (!watchedTipo || !watchedCantidad || errors.cantidad || errors.motivo) {
      return false;
    }
    
    // Validación específica para egreso
    if (watchedTipo === 'egreso' && parseFloat(watchedCantidad) > producto.stock_actual) {
      return false;
    }
    
    return true;
  };

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
                color={showHistory ? 'primary' : 'default'}
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
                    {loadingHistory ? (
                      <Typography variant="body2">Cargando...</Typography>
                    ) : movimientosRecientes.length > 0 ? (
                      <List dense>
                        {movimientosRecientes.map((mov, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              {mov.tipo === 'ingreso' ? <IngresoIcon color="success" /> :
                               mov.tipo === 'egreso' ? <EgresoIcon color="error" /> :
                               <AjusteIcon color="warning" />}
                            </ListItemIcon>
                            <ListItemText
                              primary={`${mov.tipo} - ${mov.cantidad} unidades`}
                              secondary={mov.motivo}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No hay movimientos recientes
                      </Typography>
                    )}
                  </Box>
                </Collapse>
        
                <DialogContent>
                  <Stepper activeStep={currentStep} orientation="vertical">
                    <Step>
                      <StepLabel>Configurar Movimiento</StepLabel>
                      <StepContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <InputLabel>Tipo de Movimiento</InputLabel>
                                <Controller
                                  name="tipo"
                                  control={control}
                                  render={({ field }) => (
                                    <Select {...field} label="Tipo de Movimiento">
                                      <MenuItem value="ingreso">Ingreso</MenuItem>
                                      <MenuItem value="egreso">Egreso</MenuItem>
                                      <MenuItem value="ajuste">Ajuste</MenuItem>
                                    </Select>
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Controller
                                name="cantidad"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    label="Cantidad"
                                    type="number"
                                    error={!!errors.cantidad}
                                    helperText={errors.cantidad?.message}
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
                                    fullWidth
                                    label="Motivo"
                                    error={!!errors.motivo}
                                    helperText={errors.motivo?.message}
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
                                    fullWidth
                                    label="Observaciones"
                                    multiline
                                    rows={3}
                                    error={!!errors.observaciones}
                                    helperText={errors.observaciones?.message}
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                          
                          <Box sx={{ mt: 2 }}>
                            <Button 
                              onClick={handleNext} 
                              variant="contained" 
                              disabled={!canProceedToNext()}
                            >
                              Siguiente
                            </Button>
                          </Box>
                        </form>
                      </StepContent>
                    </Step>
                    
                    <Step>
                      <StepLabel>Confirmar y Guardar</StepLabel>
                      <StepContent>
                        {previewData && (
                          <Card sx={{ mb: 2 }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Resumen del Movimiento
                              </Typography>
                              <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Stock Actual:</Typography>
                                <Typography>{previewData.stockActual}</Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Stock Nuevo:</Typography>
                                <Typography color={previewData.nuevoStock > previewData.stockActual ? 'success.main' : 'error.main'}>
                                  {previewData.nuevoStock}
                                </Typography>
                              </Box>
                              {previewData.alertaStockBajo && (
                                <Alert severity="warning" sx={{ mt: 1 }}>
                                  El stock quedará por debajo del mínimo ({previewData.stockMinimo})
                                </Alert>
                              )}
                            </CardContent>
                          </Card>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button onClick={handleBack}>
                            Atrás
                          </Button>
                          <Button 
                            onClick={handleSubmit(handleFormSubmit)}
                            variant="contained"
                            disabled={isSubmitting}
                            startIcon={<SaveIcon />}
                          >
                            Guardar Movimiento
                          </Button>
                        </Box>
                      </StepContent>
                    </Step>
                  </Stepper>
                </DialogContent>
              </motion.div>
            </Dialog>
          );
        };
        
        export default StockMovementDialog;