import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
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
      contrastText: '#333333',
    },
    background: {
      default: '#f5f5f5', // Fondo general
      paper: '#ffffff',   // Fondo tarjeta
    },
    text: {
      primary: '#333333',   // Texto principal
      secondary: '#666666', // Texto secundario
    },
    error: {
      main: '#e53935', // Rojo MUI
    },
    success: {
      main: '#43a047', // Verde MUI
    },
  },
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
    borderRadius: 18, // Especificado en el diseño
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
          borderRadius: 18, // Especificado en el diseño
          boxShadow: 'rgba(0,0,0,0.1) 0px 4px 20px', // Especificado en el diseño
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: 'rgba(0,0,0,0.08) 0px 4px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 'rgba(0,0,0,0.12) 0px 8px 24px',
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
  },
});

export default theme;