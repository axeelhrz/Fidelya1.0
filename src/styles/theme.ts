import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: {
      green: string;
      pink: string;
    };
  }
  interface PaletteOptions {
    accent: {
      green: string;
      pink: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1ED760', // Green accent
    },
    secondary: {
      main: '#FF3366', // Pink accent
    },
    background: {
      default: '#101010',
      paper: '#171717',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A3A3A3',
    },
    accent: {
      green: '#1ED760',
      pink: '#FF3366',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
    },
    button: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '12px 24px',
          fontSize: '1rem',
        },
        containedPrimary: {
          backgroundColor: '#FF3366',
          '&:hover': {
            backgroundColor: '#E62E5C',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(255, 51, 102, 0.3)',
          },
        },
        outlinedPrimary: {
          borderColor: '#1ED760',
          color: '#1ED760',
          '&:hover': {
            backgroundColor: 'rgba(30, 215, 96, 0.1)',
            borderColor: '#1ED760',
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
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#171717',
        },
      },
    },
  },
});

export default theme;