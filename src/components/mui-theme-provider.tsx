"use client";

import React, { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useTheme } from '@/hooks/use-theme';

// Define custom color palette
const customColors = {
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Typography configuration
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.025em',
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none' as const,
    letterSpacing: '0.025em',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
};

// Component overrides
const getComponentOverrides = (isDark: boolean) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: isDark ? '#4b5563 #1f2937' : '#d1d5db #f9fafb',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: isDark ? '#1f2937' : '#f9fafb',
        },
        '&::-webkit-scrollbar-thumb': {
          background: isDark ? '#4b5563' : '#d1d5db',
          borderRadius: '4px',
          '&:hover': {
            background: isDark ? '#6b7280' : '#9ca3af',
          },
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        padding: '10px 20px',
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none' as const,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        '&:focus': {
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        },
      },
      contained: {
        background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #eab308 100%)',
        color: '#ffffff',
        '&:hover': {
          background: 'linear-gradient(135deg, #b91c1c 0%, #c2410c 50%, #ca8a04 100%)',
        },
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: isDark 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        '&:hover': {
          boxShadow: isDark
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          '& fieldset': {
            borderColor: isDark ? '#4b5563' : '#d1d5db',
          },
          '&:hover fieldset': {
            borderColor: isDark ? '#6b7280' : '#9ca3af',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#dc2626',
            borderWidth: '2px',
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
      },
      elevation1: {
        boxShadow: isDark
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '16px',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        '& .MuiTabs-indicator': {
          backgroundColor: '#dc2626',
          height: '3px',
          borderRadius: '3px',
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontWeight: 500,
        fontSize: '0.875rem',
        '&.Mui-selected': {
          color: '#dc2626',
        },
      },
    },
  },
});

// Create light theme
const createLightTheme = () => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: customColors.primary[600],
      light: customColors.primary[400],
      dark: customColors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: customColors.secondary[500],
      light: customColors.secondary[300],
      dark: customColors.secondary[700],
      contrastText: '#ffffff',
    },
    error: {
      main: customColors.error[500],
      light: customColors.error[300],
      dark: customColors.error[700],
      contrastText: '#ffffff',
    },
    warning: {
      main: customColors.warning[500],
      light: customColors.warning[300],
      dark: customColors.warning[700],
      contrastText: '#ffffff',
    },
    info: {
      main: customColors.info[500],
      light: customColors.info[300],
      dark: customColors.info[700],
      contrastText: '#ffffff',
    },
    success: {
      main: customColors.success[500],
      light: customColors.success[300],
      dark: customColors.success[700],
      contrastText: '#ffffff',
    },
    grey: customColors.gray,
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: customColors.gray[900],
      secondary: customColors.gray[600],
      disabled: customColors.gray[400],
    },
    divider: customColors.gray[200],
  },
  typography,
  shape: {
    borderRadius: 12,
  },
  components: getComponentOverrides(false),
});

// Create dark theme
const createDarkTheme = () => createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: customColors.primary[500],
      light: customColors.primary[300],
      dark: customColors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: customColors.secondary[400],
      light: customColors.secondary[200],
      dark: customColors.secondary[600],
      contrastText: '#000000',
    },
    error: {
      main: customColors.error[400],
      light: customColors.error[200],
      dark: customColors.error[600],
      contrastText: '#ffffff',
    },
    warning: {
      main: customColors.warning[400],
      light: customColors.warning[200],
      dark: customColors.warning[600],
      contrastText: '#000000',
    },
    info: {
      main: customColors.info[400],
      light: customColors.info[200],
      dark: customColors.info[600],
      contrastText: '#ffffff',
    },
    success: {
      main: customColors.success[400],
      light: customColors.success[200],
      dark: customColors.success[600],
      contrastText: '#000000',
    },
    grey: customColors.gray,
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      disabled: '#6b7280',
    },
    divider: '#374151',
  },
  typography,
  shape: {
    borderRadius: 12,
  },
  components: getComponentOverrides(true),
});

// Main MuiThemeProvider Component
export const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  const muiTheme = useMemo(() => {
    return resolvedTheme === 'dark' ? createDarkTheme() : createLightTheme();
  }, [resolvedTheme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

// Export theme creators for external use
export { createLightTheme, createDarkTheme, customColors };

export default MuiThemeProvider;