'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define custom colors
const customColors = {
    primary: {
    main: '#1ED760', // Spotify green
    light: '#4AE87C',
    dark: '#19C055',
      contrastText: '#FFFFFF',
    },
    secondary: {
    main: '#FF3366', // Pink
    light: '#FF6B91',
      dark: '#E62E5C',
      contrastText: '#FFFFFF',
    },
    background: {
    default: '#0A0A0A', // Near black
    paper: '#171717', // Dark gray
    },
    text: {
      primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    },
  divider: 'rgba(255, 255, 255, 0.12)',
  error: {
    main: '#FF5252',
    light: '#FF7B7B',
    dark: '#E64A4A',
  },
  warning: {
    main: '#FFB84D',
    light: '#FFC976',
    dark: '#E6A745',
    },
  info: {
    main: '#64B5F6',
    light: '#8FCAF9',
    dark: '#5AA3DD',
    },
  success: {
    main: '#66BB6A',
    light: '#8BC98F',
    dark: '#5CA860',
    },
};

// Create theme options
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    ...customColors,
    },
  typography: {
    fontFamily: '"Sora", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Sora", sans-serif',
          fontWeight: 600,
          },
    button: {
      fontWeight: 600,
      textTransform: 'none',
        },
      },
  shape: {
    borderRadius: 12,
    },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
        },
      },
        containedPrimary: {
          background: 'linear-gradient(90deg, #1ED760 0%, #19C055 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #4AE87C 0%, #1ED760 100%)',
    },
        },
        containedSecondary: {
          background: 'linear-gradient(90deg, #FF3366 0%, #E62E5C 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #FF6B91 0%, #FF3366 100%)',
      },
    },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
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
};

// Create and export theme
const theme = createTheme(themeOptions);
export default theme;