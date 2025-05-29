import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A3CB38',
      dark: '#4CAF50',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h2: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h3: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h4: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h5: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h6: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A3CB38',
      dark: '#4CAF50',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h2: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h3: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h4: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h5: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h6: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
  },
});