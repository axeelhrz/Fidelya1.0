import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Tune as TuneIcon,
  Save as SaveIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import configuracionService from '../../services/configuracionService';

const ParametrosSistema = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [parametros, setParametros] = useState({
    moneda: 'UYU',
    decimales: 2,
    idioma: 'es',
    tema_oscuro: false,
    mostrar_alertas: true,
    backup_automatico: true,
    notificaciones_email: true,
    notificaciones_stock: true
  });

  useEffect(() => {
    cargarParametros();
  }, []);

  const cargarParametros = async () => {
    try {
      setLoading(true);
      const config = await configuracionService.obtenerConfiguracion();
      setParametros(prev => ({
        ...prev,
        moneda: config.moneda || 'UYU',
        decimales: config.decimales || 2,
        // Los demás parámetros se pueden cargar desde localStorage o configuración adicional
        idioma: localStorage.getItem('idioma') || 'es',
        tema_oscuro: localStorage.getItem('tema_oscuro') === 'true',
        mostrar_alertas: localStorage.getItem('mostrar_alertas') !== 'false',
        backup_automatico: localStorage.getItem('backup_automatico') !== 'false',
        notificaciones_email: localStorage.getItem('notificaciones_email') !== 'false',
        notificaciones_stock: localStorage.getItem('notificaciones_stock') !== 'false'
      }));
    } catch (error) {
      onError('Error cargando parámetros del sistema');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setParametros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);

      // Guardar configuración principal (moneda, decimales)
      await configuracionService.actualizarConfiguracion({
        moneda: parametros.moneda,
        decimales: parametros.decimales
      });

      // Guardar preferencias locales
      localStorage.setItem('idioma', parametros.idioma);
      localStorage.setItem('tema_oscuro', parametros.tema_oscuro.toString());
      localStorage.setItem('mostrar_alertas', parametros.mostrar_alertas.toString());
      localStorage.setItem('backup_automatico', parametros.backup_automatico.toString());
      localStorage.setItem('notificaciones_email', parametros.notificaciones_email.toString());
      localStorage.setItem('notificaciones_stock', parametros.notificaciones_stock.toString());

      onSuccess('Parámetros del sistema actualizados exitosamente');
    } catch (error) {
      onError(error.message || 'Error actualizando parámetros del sistema');
    } finally {
      setLoading(false);
    }
  };

  const monedas = [
    { value: 'UYU', label: 'Peso Uruguayo (UYU)' },
    { value: 'USD', label: 'Dólar Americano (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'ARS', label: 'Peso Argentino (ARS)' },
    { value: 'BRL', label: 'Real Brasileño (BRL)' }
  ];

  const idiomas = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TuneIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          Parámetros del Sistema
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Configuración Financiera */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Configuración Financiera</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Moneda por Defecto</InputLabel>
                    <Select
                      value={parametros.moneda}
                      onChange={handleChange('moneda')}
                      label="Moneda por Defecto"
                    >
                      {monedas.map((moneda) => (
                        <MenuItem key={moneda.value} value={moneda.value}>
                          {moneda.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Número de Decimales"
                    type="number"
                    value={parametros.decimales}
                    onChange={handleChange('decimales')}
                    inputProps={{ min: 0, max: 4 }}
                    fullWidth
                    helperText="Decimales para mostrar en precios (0-4)"
                  />
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Los precios se mostrarán como: $123{'.'.repeat(parametros.decimales)}
                  {parametros.decimales > 0 && '00'.substring(0, parametros.decimales)} {parametros.moneda}
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Interfaz */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Interfaz y Apariencia</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Idioma</InputLabel>
                    <Select
                      value={parametros.idioma}
                      onChange={handleChange('idioma')}
                      label="Idioma"
                    >
                      {idiomas.map((idioma) => (
                        <MenuItem key={idioma.value} value={idioma.value}>
                          {idioma.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={parametros.tema_oscuro}
                        onChange={handleChange('tema_oscuro')}
                      />
                    }
                    label="Tema Oscuro"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={parametros.mostrar_alertas}
                        onChange={handleChange('mostrar_alertas')}
                      />
                    }
                    label="Mostrar Alertas del Sistema"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Notificaciones */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Notificaciones</Typography>
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={parametros.notificaciones_email}
                        onChange={handleChange('notificaciones_email')}
                      />
                    }
                    label="Notificaciones por Email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={parametros.notificaciones_stock}
                        onChange={handleChange('notificaciones_stock')}
                      />
                    }
                    label="Alertas de Stock Bajo"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración del Sistema */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sistema y Seguridad
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={parametros.backup_automatico}
                        onChange={handleChange('backup_automatico')}
                      />
                    }
                    label="Backup Automático Diario"
                  />
                </Grid>
              </Grid>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Se recomienda mantener activado el backup automático para proteger los datos.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botón guardar */}
      <Paper sx={{ mt: 3, p: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleGuardar}
          disabled={loading}
          sx={{ minWidth: 200 }}
        >
          {loading ? 'Guardando...' : 'Guardar Parámetros'}
        </Button>
      </Paper>

      {/* Información adicional */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Nota:</strong> Algunos cambios pueden requerir recargar la página para aplicarse completamente.
          La configuración de moneda y decimales afectará todos los cálculos y reportes del sistema.
        </Typography>
      </Alert>
    </Box>
  );
};

export default ParametrosSistema;