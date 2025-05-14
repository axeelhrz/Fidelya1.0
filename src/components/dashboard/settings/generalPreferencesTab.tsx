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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Globe, 
  CurrencyCircleDollar, 
  CalendarBlank, 
  Check, 
  Translate 
} from 'phosphor-react';
import { useSettings } from '@/hooks/use-settings';

// Definir la interfaz para las preferencias generales
export interface GeneralPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

interface SettingsContextType {
  generalPreferences?: GeneralPreferences;
  saveGeneralPreferences?: (preferences: GeneralPreferences) => Promise<boolean>;
  loading?: boolean;
}

export default function GeneralPreferencesTab() {
  const theme = useTheme();
  const { 
    generalPreferences = {
      language: 'es-ES',
      timezone: 'America/Argentina/Buenos_Aires',
      dateFormat: 'DD/MM/YYYY',
      currency: 'ARS',
    }, 
    saveGeneralPreferences = async () => true,
    loading = false
  } = useSettings() as SettingsContextType;
  
  const [preferences, setPreferences] = useState<GeneralPreferences>(generalPreferences);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Manejar cambios en los campos
  const handleChange = (field: keyof GeneralPreferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar preferencias
  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await saveGeneralPreferences(preferences);
      if (success) {
        setSnackbarMessage('Preferencias guardadas correctamente');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Error al guardar las preferencias');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSnackbarMessage('Error al guardar las preferencias');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando preferencias generales...</Typography>
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
        Preferencias generales
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
          {/* Idioma */}
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
                <Translate weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Idioma
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Selecciona el idioma de la interfaz
                </Typography>
                
                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
                  <InputLabel id="language-select-label">Idioma</InputLabel>
                  <Select
                    labelId="language-select-label"
                    value={preferences.language}
                    label="Idioma"
                    onChange={(e) => handleChange('language', e.target.value)}
                  >
                    <MenuItem value="es-ES">Español (España)</MenuItem>
                    <MenuItem value="es-AR">Español (Argentina)</MenuItem>
                    <MenuItem value="es-MX">Español (México)</MenuItem>
                    <MenuItem value="en-US">English (US)</MenuItem>
                    <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Zona horaria */}
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
                <Globe weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Zona horaria
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Selecciona tu zona horaria para fechas y horas correctas
                </Typography>
                
                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
                  <InputLabel id="timezone-select-label">Zona horaria</InputLabel>
                  <Select
                    labelId="timezone-select-label"
                    value={preferences.timezone}
                    label="Zona horaria"
                    onChange={(e) => handleChange('timezone', e.target.value)}
                  >
                    <MenuItem value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</MenuItem>
                    <MenuItem value="America/Mexico_City">Ciudad de México (GMT-6)</MenuItem>
                    <MenuItem value="America/Bogota">Bogotá (GMT-5)</MenuItem>
                    <MenuItem value="America/Santiago">Santiago (GMT-4)</MenuItem>
                    <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                    <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Formato de fecha */}
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
                <CalendarBlank weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Formato de fecha
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Elige cómo se mostrarán las fechas en la plataforma
                </Typography>
                
                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
                  <InputLabel id="date-format-select-label">Formato de fecha</InputLabel>
                  <Select
                    labelId="date-format-select-label"
                    value={preferences.dateFormat}
                    label="Formato de fecha"
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</MenuItem>
                    <MenuItem value="DD-MMM-YYYY">DD-MMM-YYYY (31-Dic-2023)</MenuItem>
                  </Select>
                  <FormHelperText>
                    Ejemplo: {preferences.dateFormat.replace('DD', '31').replace('MM', '12').replace('YYYY', '2023').replace('MMM', 'Dic')}
                  </FormHelperText>
                </FormControl>
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Moneda */}
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
                <CurrencyCircleDollar weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Moneda predeterminada
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Selecciona la moneda para primas y valores de pólizas
                </Typography>
                
                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
                  <InputLabel id="currency-select-label">Moneda</InputLabel>
                  <Select
                    labelId="currency-select-label"
                    value={preferences.currency}
                    label="Moneda"
                    onChange={(e) => handleChange('currency', e.target.value)}
                  >
                    <MenuItem value="ARS">Peso Argentino (ARS)</MenuItem>
                    <MenuItem value="MXN">Peso Mexicano (MXN)</MenuItem>
                    <MenuItem value="COP">Peso Colombiano (COP)</MenuItem>
                    <MenuItem value="CLP">Peso Chileno (CLP)</MenuItem>
                    <MenuItem value="EUR">Euro (EUR)</MenuItem>
                    <MenuItem value="USD">Dólar Estadounidense (USD)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Box>
          
          {/* Vista previa */}
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: '12px', 
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.default, 0.4) 
                : alpha(theme.palette.background.default, 0.4),
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Vista previa de configuración
            </Typography>
            
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Idioma:</strong> {preferences.language === 'es-ES' ? 'Español (España)' : 
                  preferences.language === 'es-AR' ? 'Español (Argentina)' : 
                  preferences.language === 'es-MX' ? 'Español (México)' : 
                  preferences.language === 'en-US' ? 'English (US)' : 'Português (Brasil)'}
              </Typography>
              
              <Typography variant="body2">
                <strong>Zona horaria:</strong> {preferences.timezone.split('/').pop()?.replace('_', ' ')}
              </Typography>
              
              <Typography variant="body2">
                <strong>Fecha de ejemplo:</strong> {preferences.dateFormat.replace('DD', '31').replace('MM', '12').replace('YYYY', '2023').replace('MMM', 'Dic')}
              </Typography>
              
              <Typography variant="body2">
                <strong>Valor de ejemplo:</strong> {preferences.currency === 'ARS' ? '$10.000,00 ARS' : 
                  preferences.currency === 'MXN' ? '$10,000.00 MXN' : 
                  preferences.currency === 'COP' ? '$10.000.000,00 COP' : 
                  preferences.currency === 'CLP' ? '$10.000.000 CLP' : 
                  preferences.currency === 'EUR' ? '€10.000,00' : '$10,000.00 USD'}
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
          {saving ? 'Guardando...' : 'Guardar preferencias'}
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
