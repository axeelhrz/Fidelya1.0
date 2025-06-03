import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#62a83d', // Verde manzana
      light: '#8bc34a',
      dark: '#4a7c2a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffaa00', // Naranja suave
      light: '#ffcc33',
      dark: '#cc8800',
      contrastText: mode === 'dark' ? '#ffffff' : '#333333',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#333333',
      secondary: mode === 'dark' ? '#b3b3b3' : '#666666',
    },
    error: {
      main: '#e53935',
    },
    success: {
      main: '#43a047',
    },
    warning: {
      main: '#ffaa00',
    },
    info: {
      main: '#2196f3',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  },
});

const createAppTheme = (mode = 'light') => createTheme({
  ...getDesignTokens(mode),
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
          fontSize: '1rem',
        },
    button: {
      fontWeight: 500,
      textTransform: 'none',
          },
    body1: {
      fontWeight: 400,
        },
    body2: {
      fontWeight: 400,
      },
    },
  shape: {
            borderRadius: 12,
            },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(98, 168, 61, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(98, 168, 61, 0.4)',
            transform: 'translateY(-2px)',
      },
    },
  },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
              borderColor: '#62a83d',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#62a83d',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'dark' 
            ? 'rgba(0,0,0,0.3) 0px 4px 20px' 
            : 'rgba(0,0,0,0.1) 0px 4px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'dark'
            ? 'rgba(0,0,0,0.2) 0px 4px 16px'
            : 'rgba(0,0,0,0.08) 0px 4px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: mode === 'dark'
              ? 'rgba(0,0,0,0.3) 0px 8px 24px'
              : 'rgba(0,0,0,0.12) 0px 8px 24px',
            transform: 'translateY(-4px)',
          },
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
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          borderRight: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.12)' 
            : '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          color: mode === 'dark' ? '#ffffff' : '#333333',
        },
      },
    },
  },
});

// Exportar tema por defecto (modo claro)
const theme = createAppTheme('light');

export default theme;
export { createAppTheme };