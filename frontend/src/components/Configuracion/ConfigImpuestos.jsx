import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  InputAdornment,
  Chip
} from '@mui/material';
import { Receipt as ReceiptIcon, Save as SaveIcon } from '@mui/icons-material';
import configuracionService from '../../services/configuracionService';

const ConfigImpuestos = ({ onSuccess, onError }) => {
  const [iva, setIva] = useState(22);
  const [loading, setLoading] = useState(false);
  const [configuracion, setConfiguracion] = useState(null);

  const cargarConfiguracion = useCallback(async () => {
    try {
      setLoading(true);
      const config = await configuracionService.obtenerConfiguracion();
      setConfiguracion(config);
      setIva(config.iva || 22);
    } catch (error) {
      onError('Error cargando configuración de impuestos');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const handleIvaChange = (event, newValue) => {
    setIva(newValue);
  };

  useEffect(() => {
    cargarConfiguracion();
  }, [cargarConfiguracion]);

  const handleIvaInputChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 30) {
      setIva(value);
    }
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);
      
      if (iva < 0 || iva > 30) {
        onError('El IVA debe estar entre 0% y 30%');
        return;
      }

      await configuracionService.actualizarConfiguracion({
        ...configuracion,
        iva: iva
      });

      onSuccess('Configuración de IVA actualizada exitosamente');
      await cargarConfiguracion();
    } catch (error) {
      onError(error.message || 'Error actualizando configuración de IVA');
    } finally {
      setLoading(false);
    }
  };

  const calcularEjemplo = (precio) => {
    const ivaCalculado = precio * (iva / 100);
    const total = precio + ivaCalculado;
    return { ivaCalculado, total };
  };

  const ejemplos = [
    { precio: 100, descripcion: 'Producto de $100' },
    { precio: 250, descripcion: 'Producto de $250' },
    { precio: 500, descripcion: 'Producto de $500' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ReceiptIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          Configuración de Impuestos (IVA)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Configuración de IVA */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Porcentaje de IVA
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configura el porcentaje de IVA que se aplicará automáticamente a todas las ventas y facturas.
            </Typography>

            {/* Slider */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                IVA: {iva}%
              </Typography>
              <Slider
                value={iva}
                onChange={handleIvaChange}
                min={0}
                max={30}
                step={0.5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 10, label: '10%' },
                  { value: 22, label: '22%' },
                  { value: 30, label: '30%' }
                ]}
                valueLabelDisplay="auto"
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Input numérico */}
            <TextField
              label="Porcentaje de IVA"
              type="number"
              value={iva}
              onChange={handleIvaInputChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{
                min: 0,
                max: 30,
                step: 0.5
              }}
              fullWidth
              sx={{ mb: 3 }}
            />

            {/* Botón guardar */}
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleGuardar}
              disabled={loading}
              fullWidth
              size="large"
            >
              {loading ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </Paper>
        </Grid>

        {/* Ejemplos de cálculo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ejemplos de Cálculo
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Así se aplicará el IVA del {iva}% en las ventas:
            </Typography>

            {ejemplos.map((ejemplo, index) => {
              const { ivaCalculado, total } = calcularEjemplo(ejemplo.precio);
              
              return (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {ejemplo.descripcion}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">${ejemplo.precio.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">IVA ({iva}%):</Typography>
                    <Typography variant="body2">${ivaCalculado.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: 1, borderColor: 'divider', pt: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">Total:</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">${total.toFixed(2)}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Paper>

          {/* Información adicional */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Nota:</strong> El IVA configurado se aplicará automáticamente a:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>Nuevas ventas registradas</li>
              <li>Facturas emitidas</li>
              <li>Cálculos en reportes financieros</li>
            </Box>
          </Alert>
        </Grid>
      </Grid>

      {/* Estado actual */}
      {configuracion && (
        <Paper sx={{ mt: 3, p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">
              IVA Actual del Sistema: 
            </Typography>
            <Chip 
              label={`${configuracion.iva}%`} 
              color="success" 
              variant="filled"
              sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ConfigImpuestos;