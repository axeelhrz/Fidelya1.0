'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { createCenterTheme, defaultLightTheme, defaultDarkTheme } from '@/lib/theme';
import { CenterTheme } from '@/types/center';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  centerTheme: CenterTheme;
  setCenterTheme: (theme: CenterTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [centerTheme, setCenterTheme] = useState<CenterTheme>(defaultLightTheme);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
    
    // Cargar preferencias del localStorage solo en el cliente
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    const savedTheme = localStorage.getItem('center-theme');
    
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
    
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setCenterTheme(parsedTheme);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);

  // Actualizar tema cuando cambia el modo
  useEffect(() => {
    if (mounted) {
      const newTheme = mode === 'dark' ? defaultDarkTheme : defaultLightTheme;
      setCenterTheme(newTheme);
    }
  }, [mode, mounted]);

  // Guardar preferencias en localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme-mode', mode);
      localStorage.setItem('center-theme', JSON.stringify(centerTheme));
    }
  }, [mode, centerTheme, mounted]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const theme = createCenterTheme(centerTheme, mode);

  const value: ThemeContextType = {
    mode,
    toggleMode,
    centerTheme,
    setCenterTheme,
  };

  // Renderizar sin tema hasta que esté montado para evitar hidratación
  if (!mounted) {
    return (
      <div className="no-fouc">
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <div className="no-fouc loaded">
            {children}
          </div>
        </LocalizationProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}