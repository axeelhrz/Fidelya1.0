import { createTheme } from '@mui/material/styles';

const createCustomTheme = (mode = 'light') => {
  return createTheme({
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
      divider: mode === 'dark' ? '#334155' : '#E2E8F0',
  },
  typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
        fontWeight: 800,
      fontSize: '2.5rem',
        lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
        lineHeight: 1.3,
    },
    h3: {
        fontWeight: 700,
      fontSize: '1.75rem',
        lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
        lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
        lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
        lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
          fontSize: '1rem',
      lineHeight: 1.5,
  },
      subtitle2: {
      fontWeight: 500,
          fontSize: '0.875rem',
        lineHeight: 1.5,
        },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
          },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '0.875rem',
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
    },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        },
      },
    shape: {
      borderRadius: 12,
        },
    shadows: [
      'none',
      '0px 1px 2px rgba(0, 0, 0, 0.05)',
      '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
      '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
      '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0px 35px 60px -12px rgba(0, 0, 0, 0.3)',
      '0px 45px 70px -12px rgba(0, 0, 0, 0.35)',
      // ... más sombras según necesidad
    ],
    components: {
      MuiButton: {
      styleOverrides: {
        root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-1px)',
  },
            transition: 'all 0.2s ease-in-out',
            },
          contained: {
            '&:hover': {
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
      MuiCard: {
      styleOverrides: {
        root: {
            borderRadius: 16,
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        },
            transition: 'all 0.2s ease-in-out',
      },
    },
        },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
      },
    },
  },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#64748B' : '#CBD5E1',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 12,
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
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? '#1E293B' : '#F8FAFC',
            borderBottom: `1px solid ${mode === 'dark' ? '#334155' : '#E2E8F0'}`,
          },
          body: {
            borderBottom: `1px solid ${mode === 'dark' ? '#334155' : '#F1F5F9'}`,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: mode === 'dark' ? '#334155' : '#E2E8F0',
          },
          bar: {
            borderRadius: 4,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 500,
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            '& .MuiAlert-root': {
              borderRadius: 12,
            },
          },
        },
      },
    },
});
};

export default createCustomTheme;
