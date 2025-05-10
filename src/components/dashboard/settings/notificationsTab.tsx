'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Stack, 
  Button, 
  useTheme, 
  alpha,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Bell, 
  EnvelopeSimple, 
  WhatsappLogo, 
  BellRinging, 
  Check, 
  Clock, 
  FileText, 
  CurrencyCircleDollar 
} from 'phosphor-react';
import { useSettings } from '@/hooks/use-settings';

export default function NotificationsTab() {
  const theme = useTheme();
  const { 
    notificationSettings, 
    updateNotificationSettings, 
    saveNotificationSettings, 
    loading 
  } = useSettings();
  
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Manejar cambio de canal
  const handleChannelChange = (channel: keyof Pick<typeof notificationSettings, 'email' | 'sms' | 'push'>) => {
    updateNotificationSettings({
      [channel]: !notificationSettings[channel]
    });
  };
  
  // Manejar cambio de tipo de notificación
  const handleTypeChange = (type: keyof Pick<typeof notificationSettings, 'vencimiento' | 'nuevaPoliza' | 'pago'>) => {
    updateNotificationSettings({
      [type]: !notificationSettings[type]
    });
  };
  
  // Guardar configuración
  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await saveNotificationSettings(notificationSettings);
      if (success) {
        setSnackbarMessage('Configuración de notificaciones guardada correctamente');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Error al guardar la configuración de notificaciones');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setSnackbarMessage('Error al guardar la configuración de notificaciones');
      setSnackbarSeverity('error');
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando configuración de notificaciones...</Typography>
      </Box>
    );
  }
  
  return (
    <Stack spacing={4}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontFamily: 'Sora', 
          fontWeight: 600,
          mb: 2 
        }}
      >
        Notificaciones
      </Typography>
      
      <Card 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.6) 
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Stack spacing={4}>
          {/* Canales de notificación */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 1, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  borderRadius: '10px', 
                  color: theme.palette.primary.main 
                }}
              >
                <Bell weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Canales de notificación
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Selecciona cómo quieres recibir las notificaciones
                </Typography>
                
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationSettings.email} 
                        onChange={() => handleChannelChange('email')}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EnvelopeSimple weight="duotone" size={20} />
                        <Typography variant="body2">Email</Typography>
                      </Stack>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationSettings.sms} 
                        onChange={() => handleChannelChange('sms')}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WhatsappLogo weight="duotone" size={20} />
                        <Typography variant="body2">WhatsApp</Typography>
                      </Stack>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationSettings.push} 
                        onChange={() => handleChannelChange('push')}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BellRinging weight="duotone" size={20} />
                        <Typography variant="body2">Notificaciones push</Typography>
                      </Stack>
                    }
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Tipos de notificación */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 1, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  borderRadius: '10px', 
                  color: theme.palette.primary.main 
                }}
              >
                <BellRinging weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Tipos de notificación
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Selecciona qué eventos quieres que te notifiquemos
                </Typography>
                
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationSettings.vencimiento} 
                        onChange={() => handleTypeChange('vencimiento')}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Clock weight="duotone" size={20} />
                        <Typography variant="body2">Vencimientos de pólizas</Typography>
                      </Stack>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationSettings.nuevaPoliza} 
                        onChange={() => handleTypeChange('nuevaPoliza')}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FileText weight="duotone" size={20} />
                        <Typography variant="body2">Nuevas pólizas</Typography>
                      </Stack>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationSettings.pago} 
                        onChange={() => handleTypeChange('pago')}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CurrencyCircleDollar weight="duotone" size={20} />
                        <Typography variant="body2">Pagos y comisiones</Typography>
                      </Stack>
                    }
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
          
          {/* Vista previa */}
          <Box 
            sx={{ 
              p: 3, 
              borderRadius: '12px', 
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.default, 0.4) 
                : alpha(theme.palette.background.default, 0.4),
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Resumen de notificaciones
            </Typography>
            
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Canales activos:</strong> {[
                  notificationSettings.email ? 'Email' : null,
                  notificationSettings.sms ? 'WhatsApp' : null,
                  notificationSettings.push ? 'Push' : null
                ].filter(Boolean).join(', ') || 'Ninguno'}
              </Typography>
              
              <Typography variant="body2">
                <strong>Notificaciones activas:</strong> {[
                  notificationSettings.vencimiento ? 'Vencimientos' : null,
                  notificationSettings.nuevaPoliza ? 'Nuevas pólizas' : null,
                  notificationSettings.pago ? 'Pagos' : null
                ].filter(Boolean).join(', ') || 'Ninguna'}
              </Typography>
              
              <Typography variant="body2" sx={{ mt: 1 }}>
                {notificationSettings.email || notificationSettings.sms || notificationSettings.push ? (
                  <>
                    Recibirás notificaciones sobre {[
                      notificationSettings.vencimiento ? 'vencimientos de pólizas' : null,
                      notificationSettings.nuevaPoliza ? 'nuevas pólizas' : null,
                      notificationSettings.pago ? 'pagos y comisiones' : null
                    ].filter(Boolean).join(', ') || 'ningún evento'} a través de {[
                      notificationSettings.email ? 'email' : null,
                      notificationSettings.sms ? 'WhatsApp' : null,
                      notificationSettings.push ? 'notificaciones push' : null
                    ].filter(Boolean).join(', ')}.
                  </>
                ) : (
                  'No recibirás ninguna notificación. Te recomendamos activar al menos un canal.'
                )}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Card>
      
      {/* Botón para guardar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Check weight="bold" />}
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 500,
            px: 3
          }}
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </Box>
      
      {/* Snackbar de notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}