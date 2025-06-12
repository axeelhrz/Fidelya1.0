import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Alert
} from '@mui/material';
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import configuracionService from '../../services/configuracionService';

const DatosFruteriaForm = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState({
    nombre_fruteria: '',
    direccion: '',
    telefono: '',
    email: '',
    rut: '',
    logo_url: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const config = await configuracionService.obtenerConfiguracion();
      setDatos({
        nombre_fruteria: config.nombre_fruteria || '',
        direccion: config.direccion || '',
        telefono: config.telefono || '',
        email: config.email || '',
        rut: config.rut || '',
        logo_url: config.logo_url || ''
      });
    } catch (error) {
      onError('Error cargando datos de la frutería');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setDatos(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);

      // Validaciones básicas
      if (!datos.nombre_fruteria.trim()) {
        onError('El nombre de la frutería es requerido');
        return;
      }

      if (datos.email && !isValidEmail(datos.email)) {
        onError('El formato del email no es válido');
        return;
      }

      await configuracionService.actualizarConfiguracion(datos);
      onSuccess('Datos de la frutería actualizados exitosamente');
      await cargarDatos();
    } catch (error) {
      onError(error.message || 'Error actualizando datos de la frutería');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // En una implementación real, aquí subirías el archivo al servidor
      // Por ahora, solo simulamos la URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setDatos(prev => ({
          ...prev,
          logo_url: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          Datos de la Frutería
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Logo y datos principales */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Logo del Negocio
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Avatar
                src={datos.logo_url}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'primary.light'
                }}
              >
                <StoreIcon sx={{ fontSize: 60 }} />
              </Avatar>
              
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="logo-upload"
                type="file"
                onChange={handleLogoUpload}
              />
              <label htmlFor="logo-upload">
                <IconButton color="primary" component="span">
                  <PhotoCameraIcon />
                </IconButton>
              </label>
            </Box>

            <Alert severity="info" sx={{ textAlign: 'left' }}>
              <Typography variant="body2">
                Sube el logo de tu frutería. Se recomienda una imagen cuadrada de al menos 200x200 píxeles.
              </Typography>
            </Alert>
          </Paper>
        </Grid>

        {/* Formulario de datos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Negocio
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre de la Frutería"
                  value={datos.nombre_fruteria}
                  onChange={handleChange('nombre_fruteria')}
                  fullWidth
                  required
                  placeholder="Ej: Frutería Nina"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Dirección"
                  value={datos.direccion}
                  onChange={handleChange('direccion')}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Dirección completa del negocio"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  value={datos.telefono}
                  onChange={handleChange('telefono')}
                  fullWidth
                  placeholder="Ej: +598 99 123 456"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={datos.email}
                  onChange={handleChange('email')}
                  fullWidth
                  placeholder="contacto@fruteria.com"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="RUT / Datos Fiscales"
                  value={datos.rut}
                  onChange={handleChange('rut')}
                  fullWidth
                  placeholder="Número de RUT o identificación fiscal"
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleGuardar}
              disabled={loading}
              size="large"
              sx={{ mt: 3 }}
              fullWidth
            >
              {loading ? 'Guardando...' : 'Guardar Datos'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Vista previa de factura */}
      <Paper sx={{ mt: 3, p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Vista Previa en Facturas
        </Typography>
        
        <Box sx={{ 
          border: 1, 
          borderColor: 'grey.300', 
          borderRadius: 1, 
          p: 2, 
          bgcolor: 'white',
          maxWidth: 400
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {datos.logo_url && (
              <Avatar 
                src={datos.logo_url} 
                sx={{ width: 40, height: 40, mr: 2 }}
              />
            )}
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {datos.nombre_fruteria || 'Nombre de la Frutería'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                RUT: {datos.rut || 'No especificado'}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2">
            {datos.direccion || 'Dirección no especificada'}
          </Typography>
          <Typography variant="body2">
            Tel: {datos.telefono || 'No especificado'}
          </Typography>
          <Typography variant="body2">
            Email: {datos.email || 'No especificado'}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Así aparecerán los datos de tu frutería en las facturas emitidas.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DatosFruteriaForm;