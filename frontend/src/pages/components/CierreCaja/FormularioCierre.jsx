import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
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
  Save as SaveIcon,
  AttachMoney as AttachMoneyIcon,
  Lock as LockIcon,
  Calculate as CalculateIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Timer as TimerIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cierreCajaService } from '../../../services/cierreCajaService';

// Denominaciones de billetes y monedas uruguayos
const DENOMINACIONES = {
  billetes: [
    { valor: 2000, nombre: '$2000', color: '#8E24AA' },
    { valor: 1000, nombre: '$1000', color: '#1976D2' },
    { valor: 500, nombre: '$500', color: '#388E3C' },
    { valor: 200, nombre: '$200', color: '#F57C00' },
    { valor: 100, nombre: '$100', color: '#D32F2F' },
    { valor: 50, nombre: '$50', color: '#7B1FA2' },
    { valor: 20, nombre: '$20', color: '#303F9F' },
  ],
  monedas: [
    { valor: 10, nombre: '$10', color: '#5D4037' },
    { valor: 5, nombre: '$5', color: '#616161' },
    { valor: 2, nombre: '$2', color: '#795548' },
    { valor: 1, nombre: '$1', color: '#9E9E9E' },
  ]
};

// Esquema de validación mejorado
const schema = yup.object({
  total_efectivo_contado: yup
    .number()
    .required('El total de efectivo contado es requerido')
    .min(0, 'El monto debe ser mayor o igual a 0')
    .typeError('Debe ser un número válido'),
  observaciones: yup
    .string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres'),
  verificacion_seguridad: yup
    .boolean()
    .oneOf([true], 'Debe verificar la seguridad del conteo'),
});

const FormularioCierre = ({ 
  resumenVentas, 
  cierreExistente, 
  puedeRealizarCierre, 
  onCierreRealizado,
  loading 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [denominacionesOpen, setDenominacionesOpen] = useState(false);
  const [conteoManual, setConteoManual] = useState(false);
  const [denominaciones, setDenominaciones] = useState({});
  const [tiempoConteo, setTiempoConteo] = useState(0);
  const [conteoIniciado, setConteoIniciado] = useState(false);
  const [validacionesOpen, setValidacionesOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      total_efectivo_contado: '',
      observaciones: '',
      verificacion_seguridad: false
    }
  });

  const efectivoContado = watch('total_efectivo_contado');
  const verificacionSeguridad = watch('verificacion_seguridad');

  // Timer para el conteo
  useEffect(() => {
    let interval;
    if (conteoIniciado) {
      interval = setInterval(() => {
        setTiempoConteo(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [conteoIniciado]);

  useEffect(() => {
    if (cierreExistente) {
      setValue('total_efectivo_contado', cierreExistente.total_efectivo_contado);
      setValue('observaciones', cierreExistente.observaciones || '');
      setValue('verificacion_seguridad', true);
    }
  }, [cierreExistente, setValue]);
  const calcularTotalDenominaciones = useCallback(() => {
    let total = 0;
    Object.entries(denominaciones).forEach(([denominacion, cantidad]) => {
      const valor = parseFloat(denominacion);
      const cant = parseInt(cantidad) || 0;
      total += valor * cant;
    });
    return total;
  }, [denominaciones]);

  const handleDenominacionChange = (denominacion, cantidad) => {
    setDenominaciones(prev => ({
      ...prev,
      [denominacion]: cantidad
    }));
  };

  const aplicarConteoAutomatico = () => {
    const total = calcularTotalDenominaciones();
    setValue('total_efectivo_contado', total.toFixed(2));
    trigger('total_efectivo_contado');
    setDenominacionesOpen(false);
    setActiveStep(1);
  };

  const iniciarConteo = () => {
    setConteoIniciado(true);
    setTiempoConteo(0);
    setActiveStep(0);
  };

  const finalizarConteo = () => {
    setConteoIniciado(false);
    setActiveStep(2);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);

    try {
      const datosCompletos = {
        total_efectivo_contado: parseFloat(data.total_efectivo_contado),
        observaciones: data.observaciones.trim() || null,
        tiempo_conteo: tiempoConteo,
        denominaciones_detalle: conteoManual ? denominaciones : null,
        verificacion_seguridad: data.verificacion_seguridad
      };

      const resultado = await cierreCajaService.registrarCierreCaja(datosCompletos);
      onCierreRealizado(resultado.cierre);
      
      if (!cierreExistente) {
        reset();
        setDenominaciones({});
        setTiempoConteo(0);
        setActiveStep(0);
      }
    } catch (error) {
      console.error('Error registrando cierre:', error);
      setError(error.message || 'Error al registrar el cierre de caja');
    } finally {
      setSubmitting(false);
    }
  };

  const calcularDiferencia = () => {
    if (!efectivoContado || !resumenVentas) return 0;
    return parseFloat(efectivoContado) - (resumenVentas.total_efectivo || 0);
  };

  const diferencia = calcularDiferencia();
  const estadoDiferencia = cierreCajaService.calcularEstadoDiferencia(diferencia);

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getValidaciones = () => {
    const validaciones = [];
    
    if (efectivoContado) {
      const monto = parseFloat(efectivoContado);
      
      if (monto < 0) {
        validaciones.push({
          tipo: 'error',
          mensaje: 'El monto no puede ser negativo'
        });
      }
      
      if (resumenVentas && Math.abs(diferencia) > (resumenVentas.total_efectivo * 0.1)) {
        validaciones.push({
          tipo: 'warning',
          mensaje: 'Diferencia mayor al 10% del total esperado'
        });
      }
      
      if (conteoManual && calcularTotalDenominaciones() !== monto) {
        validaciones.push({
          tipo: 'error',
          mensaje: 'El total manual no coincide con las denominaciones'
        });
      }
    }
    
    if (tiempoConteo > 0 && tiempoConteo < 60) {
      validaciones.push({
        tipo: 'warning',
        mensaje: 'Conteo muy rápido, verificar precisión'
      });
    }
    
    return validaciones;
  };

  const validaciones = getValidaciones();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si ya existe un cierre cerrado
  if (cierreExistente && cierreExistente.estado === 'cerrado') {
    return (
      <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            Cierre Ya Realizado
          </Typography>
          <Chip 
            label="Completado" 
            color="success" 
            size="small" 
            sx={{ ml: 'auto' }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          El cierre de caja para el día de hoy ya fue registrado el{' '}
          {cierreCajaService.formatearFechaCierre(cierreExistente.fecha_cierre)} a las{' '}
          {cierreCajaService.formatearHoraCierre(cierreExistente.hora_cierre)}.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Efectivo Esperado
              </Typography>
              <Typography variant="h6" color="primary.main">
                ${cierreExistente.total_ventas_esperado?.toFixed(2) || '0.00'}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Efectivo Contado
              </Typography>
              <Typography variant="h6" color="secondary.main">
                ${cierreExistente.total_efectivo_contado?.toFixed(2) || '0.00'}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Diferencia
              </Typography>
              <Typography 
                variant="h6" 
                color={`${estadoDiferencia.color}.main`}
                fontWeight={600}
              >
                ${Math.abs(cierreExistente.diferencia || 0).toFixed(2)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Tiempo Conteo
              </Typography>
              <Typography variant="h6">
                {formatearTiempo(cierreExistente.tiempo_conteo || 0)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {cierreExistente.observaciones && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Observaciones
            </Typography>
            <Typography variant="body2">
              {cierreExistente.observaciones}
            </Typography>
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!puedeRealizarCierre && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Ya existe un cierre registrado para el día de hoy.
        </Alert>
      )}

      {/* Stepper del proceso */}
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
        <Step>
          <StepLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Conteo de Efectivo
              {conteoIniciado && (
                <Chip 
                  icon={<TimerIcon />}
                  label={formatearTiempo(tiempoConteo)}
                  size="small"
                  color="primary"
                />
              )}
            </Box>
          </StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={conteoManual}
                    onChange={(e) => setConteoManual(e.target.checked)}
                  />
                }
                label="Conteo manual por denominaciones"
              />
              
              {!conteoIniciado ? (
                <Button
                  variant="contained"
                  onClick={iniciarConteo}
                  startIcon={<TimerIcon />}
                  sx={{ mt: 1, display: 'block' }}
                >
                  Iniciar Conteo
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={finalizarConteo}
                  startIcon={<CheckCircleIcon />}
                  sx={{ mt: 1, display: 'block' }}
                >
                  Finalizar Conteo
                </Button>
              )}
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Registro del Monto</StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              {/* Botón para abrir conteo por denominaciones */}
              {conteoManual && (
                <Button
                  variant="outlined"
                  onClick={() => setDenominacionesOpen(true)}
                  startIcon={<CalculateIcon />}
                  sx={{ mb: 2 }}
                  fullWidth
                >
                  Conteo por Denominaciones
                </Button>
              )}

              {/* Campo de efectivo contado */}
              <TextField
                fullWidth
                label="Total Efectivo Contado"
                type="number"
                inputProps={{ 
                  step: "0.01",
                  min: "0"
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
                {...register('total_efectivo_contado')}
                error={!!errors.total_efectivo_contado}
                helperText={errors.total_efectivo_contado?.message}
                disabled={!puedeRealizarCierre || submitting}
                sx={{ mb: 2 }}
              />

              {/* Mostrar diferencia en tiempo real */}
              {efectivoContado && resumenVentas && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: `${estadoDiferencia.color}.50`,
                    border: `1px solid ${estadoDiferencia.color}.200`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {estadoDiferencia.color === 'success' ? <CheckCircleIcon color="success" /> :
                       estadoDiferencia.color === 'error' ? <WarningIcon color="error" /> :
                       <InfoIcon color="info" />}
                      <Typography variant="subtitle2" sx={{ ml: 1 }} fontWeight={600}>
                        Diferencia Calculada
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h6" 
                      color={`${estadoDiferencia.color}.main`}
                      fontWeight={600}
                    >
                      {estadoDiferencia.mensaje}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Efectivo contado: ${parseFloat(efectivoContado).toFixed(2)} - 
                      Efectivo esperado: ${(resumenVentas.total_efectivo || 0).toFixed(2)}
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Verificación y Observaciones</StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              {/* Validaciones */}
              {validaciones.length > 0 && (
                <Card sx={{ mb: 2, border: '1px solid', borderColor: 'warning.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SecurityIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Validaciones de Seguridad
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => setValidacionesOpen(!validacionesOpen)}
                        sx={{ ml: 'auto' }}
                      >
                        {validacionesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    <Collapse in={validacionesOpen}>
                      <List dense>
                        {validaciones.map((validacion, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              {validacion.tipo === 'error' ? 
                                <WarningIcon color="error" /> : 
                                <InfoIcon color="warning" />
                              }
                            </ListItemIcon>
                            <ListItemText primary={validacion.mensaje} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </CardContent>
                </Card>
              )}

              {/* Campo de observaciones */}
              <TextField
                fullWidth
                label="Observaciones"
                multiline
                rows={3}
                placeholder="Notas adicionales sobre el cierre (opcional)"
                {...register('observaciones')}
                error={!!errors.observaciones}
                helperText={errors.observaciones?.message}
                disabled={!puedeRealizarCierre || submitting}
                sx={{ mb: 2 }}
              />

              {/* Verificación de seguridad */}
              <Controller
                name="verificacion_seguridad"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        disabled={!puedeRealizarCierre || submitting}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VerifiedIcon sx={{ mr: 1, color: verificacionSeguridad ? 'success.main' : 'grey.400' }} />
                        He verificado el conteo y confirmo su exactitud
                      </Box>
                    }
                  />
                )}
              />
              {errors.verificacion_seguridad && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.verificacion_seguridad.message}
                </Typography>
              )}
            </Box>
          </StepContent>
        </Step>
      </Stepper>

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
        disabled={!puedeRealizarCierre || submitting || !resumenVentas || !verificacionSeguridad}
        sx={{
          py: 1.5,
          fontWeight: 600,
          fontSize: '1.1rem',
          background: 'linear-gradient(45deg, #1565C0, #0D47A1)',
          '&:hover': {
            background: 'linear-gradient(45deg, #0D47A1, #1565C0)',
          }
        }}
      >
        {submitting ? 'Registrando...' : 'Registrar Cierre de Caja'}
      </Button>

      {!resumenVentas && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          Cargando datos de ventas...
        </Typography>
      )}

      {/* Dialog para conteo por denominaciones */}
      <Dialog
        open={denominacionesOpen}
        onClose={() => setDenominacionesOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalculateIcon sx={{ mr: 1 }} />
            Conteo por Denominaciones
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Billetes */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Billetes
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Denominación</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DENOMINACIONES.billetes.map((billete) => (
                      <TableRow key={billete.valor}>
                        <TableCell>
                          <Chip
                            label={billete.nombre}
                            sx={{ 
                              backgroundColor: billete.color,
                              color: 'white',
                              fontWeight: 600
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            size="small"
                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                            value={denominaciones[billete.valor] || ''}
                            onChange={(e) => handleDenominacionChange(billete.valor, e.target.value)}
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={500}>
                            ${((denominaciones[billete.valor] || 0) * billete.valor).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Monedas */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Monedas
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Denominación</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DENOMINACIONES.monedas.map((moneda) => (
                      <TableRow key={moneda.valor}>
                        <TableCell>
                          <Chip
                            label={moneda.nombre}
                            sx={{ 
                              backgroundColor: moneda.color,
                              color: 'white',
                              fontWeight: 600
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            size="small"
                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                            value={denominaciones[moneda.valor] || ''}
                            onChange={(e) => handleDenominacionChange(moneda.valor, e.target.value)}
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={500}>
                            ${((denominaciones[moneda.valor] || 0) * moneda.valor).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {/* Total calculado */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
            <Typography variant="h6" align="center" color="primary.main" fontWeight={600}>
              Total Calculado: ${calcularTotalDenominaciones().toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDenominacionesOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={aplicarConteoAutomatico}
            startIcon={<CheckCircleIcon />}
          >
            Aplicar Total
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormularioCierre;
