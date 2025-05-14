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
  Alert,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  LightbulbFilament, 
  Bell, 
  EnvelopeSimple, 
  Check, 
  Brain, 
  ChartLine, 
  Sparkle 
} from 'phosphor-react';
import { useSettings } from '@/hooks/use-settings';

export default function AISettingTab() {
  const theme = useTheme();
  const { 
    aiSettings, 
    updateAISettings, 
    saveAISettings, 
    loading 
  } = useSettings();
  
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Manejar cambio de configuración
  const handleSettingChange = (setting: keyof typeof aiSettings) => {
    updateAISettings({
      [setting]: !aiSettings[setting]
    });
  };
  
  // Guardar configuración
  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await saveAISettings(aiSettings);
      if (success) {
        setSnackbarMessage('Configuración de IA guardada correctamente');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Error al guardar la configuración de IA');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error saving AI settings:', error);
      setSnackbarMessage('Error al guardar la configuración de IA');
      setSnackbarSeverity('error');
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando configuración de IA...</Typography>
      </Box>
    );
  }
  
  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Sora', 
            fontWeight: 600
          }}
        >
          Configuración de IA
        </Typography>
        <Chip 
          label="Enterprise" 
          size="small"
          color="primary"
          sx={{ 
            borderRadius: '6px',
            height: 24
          }}
        />
      </Stack>
      
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
          {/* Sugerencias de tareas */}
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
                <LightbulbFilament weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Sugerencias inteligentes de tareas
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  La IA analizará tus pólizas y clientes para sugerir tareas relevantes
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={aiSettings.suggestTasks} 
                      onChange={() => handleSettingChange('suggestTasks')}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {aiSettings.suggestTasks ? 'Activado' : 'Desactivado'}
                    </Typography>
                  }
                />
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Alertas inteligentes */}
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
                  Alertas inteligentes
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Recibe alertas predictivas sobre vencimientos, renovaciones y oportunidades
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={aiSettings.smartAlerts} 
                      onChange={() => handleSettingChange('smartAlerts')}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {aiSettings.smartAlerts ? 'Activado' : 'Desactivado'}
                    </Typography>
                  }
                />
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Emails automáticos */}
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
                <EnvelopeSimple weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Emails automáticos inteligentes
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  La IA redactará y enviará emails personalizados a tus clientes
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={aiSettings.autoEmails} 
                      onChange={() => handleSettingChange('autoEmails')}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {aiSettings.autoEmails ? 'Activado' : 'Desactivado'}
                    </Typography>
                  }
                />
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
              Funciones de IA activas
            </Typography>
            
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(
                      aiSettings.suggestTasks ? theme.palette.success.main : theme.palette.action.disabled, 
                      0.1
                    ), 
                    borderRadius: '8px', 
                    color: aiSettings.suggestTasks ? theme.palette.success.main : theme.palette.action.disabled
                  }}
                >
                  <Brain weight="duotone" size={20} />
                </Box>
                <Typography variant="body2">
                  Análisis predictivo de tareas
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(
                      aiSettings.smartAlerts ? theme.palette.success.main : theme.palette.action.disabled, 
                      0.1
                    ), 
                    borderRadius: '8px', 
                    color: aiSettings.smartAlerts ? theme.palette.success.main : theme.palette.action.disabled
                  }}
                >
                  <ChartLine weight="duotone" size={20} />
                </Box>
                <Typography variant="body2">
                  Detección de patrones y alertas
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(
                      aiSettings.autoEmails ? theme.palette.success.main : theme.palette.action.disabled, 
                      0.1
                    ), 
                    borderRadius: '8px', 
                    color: aiSettings.autoEmails ? theme.palette.success.main : theme.palette.action.disabled
                  }}
                >
                  <Sparkle weight="duotone" size={20} />
                </Box>
                <Typography variant="body2">
                  Generación de contenido personalizado
                </Typography>
              </Stack>
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