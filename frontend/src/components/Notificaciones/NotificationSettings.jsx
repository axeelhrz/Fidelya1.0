import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Notifications as NotificationsIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import notificationService from '../../services/notificationService';

const NotificationSettings = ({ open, onClose, onSave }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [configuracion, setConfiguracion] = useState({
    recibir_email: true,
    recibir_sms: false,
    telefono: '',
    frecuencia: 'inmediata'
  });

  useEffect(() => {
    if (open) {
      cargarConfiguracion();
    }
  }, [open]);

  const cargarConfiguracion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const config = await notificationService.obtenerConfiguracion();
      setConfiguracion(config);
    } catch (error) {
      console.error('Error cargando configuración:', error);
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validaciones
      if (configuracion.recibir_sms && !configuracion.telefono) {
        setError('Debe ingresar un número de teléfono para recibir SMS');
        return;
      }
      
      await notificationService.actualizarConfiguracion(configuracion);
      setSuccess(true);
      
      if (onSave) {
        onSave(configuracion);
      }
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setError(error.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setConfiguracion(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
    setSuccess(false);
  };

  const formatearTelefono = (telefono) => {
    // Remover caracteres no numéricos
    const numeros = telefono.replace(/\D/g, '');
    
    // Formatear como +598 XX XXX XXX
    if (numeros.length <= 8) {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return numeros;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 500,
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <SettingsIcon />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Configuración de Notificaciones
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Configuración guardada exitosamente
                </Alert>
              )}

              {/* Notificaciones Web */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  mb: 3,
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <NotificationsIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Notificaciones Web
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Las notificaciones web siempre están activas y aparecen en el centro de notificaciones.
                </Typography>
                <Alert severity="info" variant="outlined">
                  ✅ Activo - Recibirás notificaciones en tiempo real en el sistema
                </Alert>
              </Box>

              {/* Notificaciones por Email */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  mb: 3,
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <EmailIcon color="success" />
                    <Typography variant="h6" fontWeight={600}>
                      Notificaciones por Email
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={configuracion.recibir_email}
                        onChange={(e) => handleChange('recibir_email', e.target.checked)}
                        color="success"
                      />
                    }
                    label=""
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Recibe alertas importantes por correo electrónico (stock bajo, pagos pendientes, etc.)
                </Typography>
              </Box>

              {/* Notificaciones por SMS */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  mb: 3,
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <SmsIcon color="warning" />
                    <Typography variant="h6" fontWeight={600}>
                      Notificaciones por SMS
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={configuracion.recibir_sms}
                        onChange={(e) => handleChange('recibir_sms', e.target.checked)}
                        color="warning"
                      />
                    }
                    label=""
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Recibe alertas críticas por mensaje de texto
                </Typography>

                {configuracion.recibir_sms && (
                  <TextField
                    fullWidth
                    label="Número de Teléfono"
                    placeholder="099 123 456"
                    value={configuracion.telefono}
                    onChange={(e) => handleChange('telefono', formatearTelefono(e.target.value))}
                    helperText="Formato: 099 123 456 (sin +598)"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Frecuencia de Notificaciones */}
              <Box>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Frecuencia de Notificaciones
                </Typography>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    ¿Con qué frecuencia deseas recibir notificaciones?
                  </FormLabel>
                  <RadioGroup
                    value={configuracion.frecuencia}
                    onChange={(e) => handleChange('frecuencia', e.target.value)}
                  >
                    <FormControlLabel
                      value="inmediata"
                      control={<Radio color="primary" />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Inmediata
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recibe notificaciones al momento que ocurren
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="diaria"
                      control={<Radio color="primary" />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Resumen Diario
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recibe un resumen al final del día
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="semanal"
                      control={<Radio color="primary" />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Resumen Semanal
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recibe un resumen cada lunes
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Información adicional */}
              <Alert severity="info" variant="outlined">
                <Typography variant="body2">
                  <strong>Nota:</strong> Las alertas críticas (como stock agotado) siempre se envían 
                  inmediatamente, independientemente de la configuración de frecuencia.
                </Typography>
              </Alert>
            </Box>
          </motion.div>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
          disabled={saving || loading}
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationSettings;