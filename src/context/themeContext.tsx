'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
  primaryColor: '#3f51b5',
  setPrimaryColor: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [mode, setMode] = useState<PaletteMode>('light');
  const [primaryColor, setPrimaryColor] = useState<string>('#3f51b5');
  const [loading, setLoading] = useState(true);

  // Cargar preferencias de tema desde Firestore
  useEffect(() => {
    const loadThemePreferences = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().appearanceSettings) {
          const { darkMode, primaryColor: storedColor } = userDoc.data().appearanceSettings;
          
          if (darkMode !== undefined) {
            setMode(darkMode ? 'dark' : 'light');
          }
          
          if (storedColor) {
            setPrimaryColor(storedColor);
          }
        }
      } catch (error) {
        console.error('Error al cargar preferencias de tema:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThemePreferences();
  }, [user]);

  // Guardar preferencias de tema en Firestore
  const saveThemePreferences = async (darkMode: boolean, color: string) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        'appearanceSettings.darkMode': darkMode,
        'appearanceSettings.primaryColor': color,
      });
    } catch (error) {
      console.error('Error al guardar preferencias de tema:', error);
    }
  };

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      if (user) {
        saveThemePreferences(newMode === 'dark', primaryColor);
      }
      return newMode;
    });
  };

  const handleSetPrimaryColor = (color: string) => {
    setPrimaryColor(color);
    if (user) {
      saveThemePreferences(mode === 'dark', color);
    }
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: primaryColor,
          },
        },
        typography: {
          fontFamily: '"Sora", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '16px',
              },
            },
          },
        },
      }),
    [mode, primaryColor]
  );

  const contextValue = {
    mode,
    toggleColorMode,
    primaryColor,
    setPrimaryColor: handleSetPrimaryColor,
  };

  if (loading) {
    return null; // O un componente de carga
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}