import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#10B981', // Verde esmeralda moderno
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B5CF6', // Púrpura moderno
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#F59E0B', // Ámbar
      light: '#FBBF24',
      dark: '#D97706',
    },
    accent: {
      main: '#EF4444', // Rojo coral
      light: '#F87171',
      dark: '#DC2626',
    },
    background: {
      default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
      paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
      surface: mode === 'dark' ? '#334155' : '#F1F5F9',
    },
    text: {
      primary: mode === 'dark' ? '#F8FAFC' : '#1E293B',
      secondary: mode === 'dark' ? '#CBD5E1' : '#64748B',
      tertiary: mode === 'dark' ? '#94A3B8' : '#94A3B8',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    divider: mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(30, 41, 59, 0.08)',
  },
});

const createAppTheme = (mode = 'light') => createTheme({
  ...getDesignTokens(mode),
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
          fontSize: '1rem',
      letterSpacing: '-0.01em',
        },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '-0.01em',
      },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
  },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
            },
  shape: {
    borderRadius: 16,
            },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.05), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.05), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.15)',
    ...Array(19).fill('0px 25px 50px -12px rgba(0, 0, 0, 0.15)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(16, 185, 129, 0.15)',
          '&:hover': {
            boxShadow: '0px 8px 20px rgba(16, 185, 129, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(30, 41, 59, 0.05)',
          boxShadow: mode === 'dark'
            ? '0px 4px 20px rgba(0, 0, 0, 0.3)'
            : '0px 4px 20px rgba(30, 41, 59, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            boxShadow: mode === 'dark'
              ? '0px 8px 30px rgba(0, 0, 0, 0.4)'
              : '0px 8px 30px rgba(30, 41, 59, 0.08)',
            transform: 'translateY(-2px)',
        },
      },
    },
        },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(30, 41, 59, 0.05)',
          boxShadow: mode === 'dark'
            ? '0px 4px 20px rgba(0, 0, 0, 0.3)'
            : '0px 4px 20px rgba(30, 41, 59, 0.04)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover fieldset': {
              borderColor: '#10B981',
  },
            '&.Mui-focused fieldset': {
              borderColor: '#10B981',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Exportar tema por defecto (modo claro)
const theme = createAppTheme('light');

export default theme;
export { createAppTheme };