import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.025em',
    },
    body1: {
      letterSpacing: '0.025em',
    },
    body2: {
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 20px 20px 0',
          border: 'none',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 4,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateX(8px)',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: '1px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
})

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  components: {
    ...theme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(59, 130, 246, 0.2)',
        },
      },
    },
  },
})