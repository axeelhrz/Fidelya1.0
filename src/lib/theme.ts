import { createTheme, Theme } from '@mui/material/styles';
import { CenterTheme } from '@/types/center';

export const defaultLightTheme: CenterTheme = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#0ea5e9',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const defaultDarkTheme: CenterTheme = {
  primary: '#3b82f6',
  secondary: '#94a3b8',
  accent: '#0ea5e9',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export function createCenterTheme(centerTheme: CenterTheme, mode: 'light' | 'dark'): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: centerTheme.primary,
      },
      secondary: {
        main: centerTheme.secondary,
      },
      background: {
        default: centerTheme.background,
        paper: centerTheme.surface,
      },
      text: {
        primary: centerTheme.text,
        secondary: centerTheme.textSecondary,
      },
      success: {
        main: centerTheme.success,
      },
      warning: {
        main: centerTheme.warning,
      },
      error: {
        main: centerTheme.error,
      },
      info: {
        main: centerTheme.info,
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 500,
        fontSize: '1.25rem',
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
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
  });
}