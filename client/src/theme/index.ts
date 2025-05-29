import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: {
      main: string;
      light: string;
      dark: string;
    };
  }

  interface PaletteOptions {
    accent?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    body2: {
      fontWeight: 300,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#62C370',
      light: '#8ED49A',
      dark: '#4A9B56',
    },
    secondary: {
      main: '#FF8C42',
      light: '#FFB366',
      dark: '#E6732A',
    },
    accent: {
      main: '#62C370',
      light: '#8ED49A',
      dark: '#4A9B56',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#666666',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FF8C42',
    },
    success: {
      main: '#62C370',
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#62C370',
      light: '#8ED49A',
      dark: '#4A9B56',
    },
    secondary: {
      main: '#FF8C42',
      light: '#FFB366',
      dark: '#E6732A',
    },
    accent: {
      main: '#62C370',
      light: '#8ED49A',
      dark: '#4A9B56',
    },
    background: {
      default: '#1E1E1E',
      paper: '#2A2A2A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FF8C42',
    },
    success: {
      main: '#62C370',
    },
  },
});