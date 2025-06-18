'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createCenterTheme, defaultLightTheme, defaultDarkTheme } from '@/lib/theme';
import { useAuth } from '@/context/AuthContext';
import { FirestoreService } from '@/services/firestore';
import { CenterTheme } from '@/types/center';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  centerTheme: {
    light: CenterTheme;
    dark: CenterTheme;
  };
  updateCenterTheme: (theme: { light: CenterTheme; dark: CenterTheme }) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [centerTheme, setCenterTheme] = useState({
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  });
  
  const { user } = useAuth();

  // Cargar tema del centro cuando el usuario se autentica
  useEffect(() => {
    const loadCenterTheme = async () => {
      if (user?.centerId) {
        try {
          const centerSettings = await FirestoreService.getCenterSettings(user.centerId);
          if (centerSettings?.theme) {
            setCenterTheme({
              light: centerSettings.theme.light,
              dark: centerSettings.theme.dark,
            });
            setMode(centerSettings.theme.mode === 'system' ? 
              (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') :
              centerSettings.theme.mode
            );
          }
        } catch (error) {
          console.error('Error loading center theme:', error);
        }
      }
    };

    loadCenterTheme();
  }, [user?.centerId]);

  // Detectar cambios en el tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (user?.centerId) {
        FirestoreService.getCenterSettings(user.centerId).then(settings => {
          if (settings?.theme.mode === 'system') {
            setMode(e.matches ? 'dark' : 'light');
          }
        });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [user?.centerId]);

  const toggleMode = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);

    // Guardar preferencia en Firestore
    if (user?.centerId) {
      try {
        await FirestoreService.updateCenterSettings(user.centerId, {
          theme: {
            ...centerTheme,
            mode: newMode,
          },
        });
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  };

  const updateCenterTheme = async (newTheme: { light: CenterTheme; dark: CenterTheme }) => {
    setCenterTheme(newTheme);

    // Guardar en Firestore
    if (user?.centerId) {
      try {
        await FirestoreService.updateCenterSettings(user.centerId, {
          theme: {
            ...newTheme,
            mode,
          },
        });
      } catch (error) {
        console.error('Error saving center theme:', error);
      }
    }
  };

  const theme = createCenterTheme(
    mode === 'light' ? centerTheme.light : centerTheme.dark,
    mode
  );

  const value: ThemeContextType = {
    mode,
    toggleMode,
    centerTheme,
    updateCenterTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within a ThemeProvider');
  }
  return context;
}
