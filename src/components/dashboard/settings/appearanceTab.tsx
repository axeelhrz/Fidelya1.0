'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Stack, 
  Button, 
  useTheme, 
  alpha,
  FormControlLabel,
  Divider,
  RadioGroup,
  Radio,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Check, 
  Palette, 
  TextT 
} from 'phosphor-react';
import { useSettings } from '@/hooks/use-settings';
import { useThemeContext } from '@/context/themeContext';
import { HexColorPicker } from 'react-colorful';

export default function AppearanceTab() {
  const theme = useTheme();
  const { mode, toggleColorMode, setPrimaryColor } = useThemeContext();
  const { 
    appearanceSettings, 
    updateAppearanceSettings, 
    loading 
  } = useSettings();
  
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(appearanceSettings.primaryColor);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Sincronizar tema con configuración
  useEffect(() => {
    if (!loading && appearanceSettings) {
      // Actualizar color primario
      setPrimaryColor(appearanceSettings.primaryColor);
      
      // Actualizar modo
      if (appearanceSettings.darkMode && mode === 'light') {
        toggleColorMode();
      } else if (!appearanceSettings.darkMode && mode === 'dark') {
        toggleColorMode();
      }
    }
  }, [loading, appearanceSettings, setPrimaryColor, toggleColorMode, mode]);
  
  // Manejar cambio de modo
  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    if (newMode === 'light') {
      if (mode === 'dark') toggleColorMode();
      updateAppearanceSettings({ darkMode: false });
    } else if (newMode === 'dark') {
      if (mode === 'light') toggleColorMode();
      updateAppearanceSettings({ darkMode: true });
    } else {
      // Modo sistema (por implementar)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark && mode === 'light') {
        toggleColorMode();
      } else if (!prefersDark && mode === 'dark') {
        toggleColorMode();
      }
      updateAppearanceSettings({ darkMode: prefersDark });
    }
  };
  
  // Manejar cambio de color
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };
  
  // Aplicar color seleccionado
  const applySelectedColor = () => {
    setPrimaryColor(selectedColor);
    updateAppearanceSettings({ primaryColor: selectedColor });
    setColorPickerOpen(false);
    setSnackbarOpen(true);
  };
  
  // Colores predefinidos
  const predefinedColors = [
    '#3f51b5', // Indigo
    '#2196f3', // Blue
    '#009688', // Teal
    '#4caf50', // Green
    '#ff9800', // Orange
    '#f44336', // Red
    '#9c27b0', // Purple
    '#795548', // Brown
  ];
  
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando configuración de apariencia...</Typography>
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
        Apariencia
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
          {/* Modo */}
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
                {mode === 'dark' ? (
                  <Moon weight="duotone" size={24} />
                ) : (
                  <Sun weight="duotone" size={24} />
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Modo
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Elige entre modo claro, oscuro o automático según tu sistema
                </Typography>
                
                <RadioGroup
                  value={mode === 'dark' ? 'dark' : 'light'}
                  onChange={(e) => handleModeChange(e.target.value as 'light' | 'dark' | 'system')}
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'row',
                    gap: 2
                  }}
                >
                  <FormControlLabel 
                    value="light" 
                    control={
                      <Radio 
                        sx={{ 
                          '&.Mui-checked': { 
                            color: theme.palette.primary.main 
                          } 
                        }} 
                      />
                    } 
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Sun weight="duotone" size={18} />
                        <Typography variant="body2">Claro</Typography>
                      </Stack>
                    }
                    sx={{ 
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: '10px',
                      px: 1,
                      mr: 0
                    }}
                  />
                  <FormControlLabel 
                    value="dark" 
                    control={
                      <Radio 
                        sx={{ 
                          '&.Mui-checked': { 
                            color: theme.palette.primary.main 
                          } 
                        }} 
                      />
                    } 
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Moon weight="duotone" size={18} />
                        <Typography variant="body2">Oscuro</Typography>
                      </Stack>
                    }
                    sx={{ 
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: '10px',
                      px: 1,
                      mr: 0
                    }}
                  />
                  <FormControlLabel 
                    value="system" 
                    control={
                      <Radio 
                        sx={{ 
                          '&.Mui-checked': { 
                            color: theme.palette.primary.main 
                          } 
                        }} 
                      />
                    } 
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Monitor weight="duotone" size={18} />
                        <Typography variant="body2">Sistema</Typography>
                      </Stack>
                    }
                    sx={{ 
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: '10px',
                      px: 1,
                      mr: 0
                    }}
                  />
                </RadioGroup>
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Color primario */}
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
                <Palette weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Color primario
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Personaliza el color principal de la interfaz
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 2,
                      flexWrap: 'wrap'
                    }}
                  >
                    {predefinedColors.map((color) => (
                      <Tooltip key={color} title={color} arrow>
                        <Box
                          component={motion.div}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: color,
                            cursor: 'pointer',
                            border: color === selectedColor 
                              ? `3px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'}`
                              : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => {
                            setSelectedColor(color);
                            setPrimaryColor(color);
                            updateAppearanceSettings({ primaryColor: color });
                          }}
                        >
                          {color === selectedColor && (
                            <Check weight="bold" size={18} color="white" />
                          )}
                        </Box>
                      </Tooltip>
                    ))}
                    
                    <Tooltip title="Personalizado" arrow>
                      <Box
                        component={motion.div}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          background: `linear-gradient(135deg, #f44336 0%, #2196f3 50%, #4caf50 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => setColorPickerOpen(!colorPickerOpen)}
                      >
                        <Palette weight="bold" size={18} color="white" />
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
                
                {colorPickerOpen && (
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 2, 
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: '16px',
                      bgcolor: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.background.default, 0.6) 
                        : alpha(theme.palette.background.default, 0.6),
                    }}
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Selecciona un color personalizado
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <HexColorPicker 
                        color={selectedColor} 
                        onChange={handleColorChange} 
                        style={{ width: '100%' }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          bgcolor: selectedColor,
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                        }} 
                      />
                      <Typography variant="body2">
                        {selectedColor}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={applySelectedColor}
                        sx={{ 
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                        component={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Aplicar color
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Tipografía */}
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
                <TextT weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Tipografía
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Selecciona la fuente para la interfaz
                </Typography>
                
                <RadioGroup
                  value={appearanceSettings.font}
                  onChange={(e) => updateAppearanceSettings({ font: e.target.value })}
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <FormControlLabel 
                    value="Sora" 
                    control={
                      <Radio 
                        sx={{ 
                          '&.Mui-checked': { 
                            color: theme.palette.primary.main 
                          } 
                        }} 
                      />
                    } 
                    label={
                      <Typography variant="body2" sx={{ fontFamily: 'Sora' }}>
                        Sora (Recomendado)
                      </Typography>
                    }
                  />
                  <FormControlLabel 
                    value="Inter" 
                    control={
                      <Radio 
                        sx={{ 
                          '&.Mui-checked': { 
                            color: theme.palette.primary.main 
                          } 
                        }} 
                      />
                    } 
                    label={
                      <Typography variant="body2" sx={{ fontFamily: 'Inter' }}>
                        Inter
                      </Typography>
                    }
                  />
                  <FormControlLabel 
                    value="Poppins" 
                    control={
                      <Radio 
                        sx={{ 
                          '&.Mui-checked': { 
                            color: theme.palette.primary.main 
                          } 
                        }} 
                      />
                    } 
                    label={
                      <Typography variant="body2" sx={{ fontFamily: 'Poppins' }}>
                        Poppins
                      </Typography>
                    }
                  />
                </RadioGroup>
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
              Vista previa
            </Typography>
            
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: '10px', 
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1, fontFamily: appearanceSettings.font }}>
                Título de ejemplo
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontFamily: appearanceSettings.font }}>
                Este es un texto de ejemplo para mostrar cómo se ve la tipografía seleccionada.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontFamily: appearanceSettings.font
                }}
              >
                Botón de ejemplo
              </Button>
            </Box>
          </Box>
        </Stack>
      </Card>
      
      {/* Snackbar de notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          Apariencia actualizada correctamente
        </Alert>
      </Snackbar>
    </Stack>
  );
}