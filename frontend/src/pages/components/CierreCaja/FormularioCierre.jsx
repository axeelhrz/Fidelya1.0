import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  AttachMoney as AttachMoneyIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cierreCajaService } from '../../../services/cierreCajaService';

// Esquema de validación
const schema = yup.object({
  total_efectivo_contado: yup
    .number()
    .required('El total de efectivo contado es requerido')
    .min(0, 'El monto debe ser mayor o igual a 0')
    .typeError('Debe ser un número válido'),
  observaciones: yup
    .string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      total_efectivo_contado: '',
      observaciones: ''
    }
  });

  const efectivoContado = watch('total_efectivo_contado');

  useEffect(() => {
    if (cierreExistente) {
      setValue('total_efectivo_contado', cierreExistente.total_efectivo_contado);
      setValue('observaciones', cierreExistente.observaciones || '');
    }
  }, [cierreExistente, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);

    try {
      const resultado = await cierreCajaService.registrarCierreCaja({
        total_efectivo_contado: parseFloat(data.total_efectivo_contado),
        observaciones: data.observaciones.trim() || null
      });

      onCierreRealizado(resultado.cierre);
      
      if (!cierreExistente) {
        reset();
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
      <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            Cierre Ya Realizado
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          El cierre de caja para el día de hoy ya fue registrado el{' '}
          {cierreCajaService.formatearFechaCierre(cierreExistente.fecha_cierre)} a las{' '}
          {cierreCajaService.formatearHoraCierre(cierreExistente.hora_cierre)}.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Efectivo Esperado
            </Typography>
            <Typography variant="h6">
              ${cierreExistente.total_ventas_esperado?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Efectivo Contado
            </Typography>
            <Typography variant="h6">
              ${cierreExistente.total_efectivo_contado?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Diferencia
          </Typography>
          <Typography 
            variant="h5" 
            color={`${estadoDiferencia.color}.main`}
            fontWeight={600}
          >
            ${Math.abs(cierreExistente.diferencia || 0).toFixed(2)}
            {cierreExistente.diferencia > 0 && ' (Sobrante)'}
            {cierreExistente.diferencia < 0 && ' (Faltante)'}
            {cierreExistente.diferencia === 0 && ' (Correcto)'}
          </Typography>
        </Box>

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
        <Paper sx={{ p: 2, mb: 2, bgcolor: `${estadoDiferencia.color}.50` }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Diferencia Calculada
          </Typography>
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
        sx={{ mb: 3 }}
      />

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
        disabled={!puedeRealizarCierre || submitting || !resumenVentas}
        sx={{
          py: 1.5,
          fontWeight: 600,
          fontSize: '1.1rem'
        }}
      >
        {submitting ? 'Registrando...' : 'Registrar Cierre de Caja'}
      </Button>

      {!resumenVentas && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          Cargando datos de ventas...
        </Typography>
      )}
    </Box>
  );
};

export default FormularioCierre;