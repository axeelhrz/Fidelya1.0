import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: {
      green: string;
      pink: string;
      gradient: string;
    };
  }
  interface PaletteOptions {
    accent: {
      green: string;
      pink: string;
      gradient: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1ED760', // Green accent
      light: '#4AE07D',
      dark: '#18B050',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF3366', // Pink accent
      light: '#FF6B8E',
      dark: '#E62E5C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#101010',
      paper: '#171717',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A3A3A3',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    accent: {
      green: '#1ED760',
      pink: '#FF3366',
      gradient: 'linear-gradient(90deg, #1ED760 0%, #FF3366 100%)',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.01em',
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
      letterSpacing: '0.02em',
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
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
          padding: '12px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #1ED760 0%, #19C055 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #19C055 0%, #15A348 100%)',
            boxShadow: '0 10px 25px rgba(30, 215, 96, 0.3)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(90deg, #FF3366 0%, #E62E5C 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #E62E5C 0%, #D12953 100%)',
            boxShadow: '0 10px 25px rgba(255, 51, 102, 0.3)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(30, 215, 96, 0.1)',
            boxShadow: '0 10px 25px rgba(30, 215, 96, 0.2)',
          },
        },
        outlinedSecondary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(255, 51, 102, 0.1)',
            boxShadow: '0 10px 25px rgba(255, 51, 102, 0.2)',
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1.125rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#171717',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
        elevation3: {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        },
        elevation4: {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
        },
        elevation5: {
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#101010',
          backgroundImage: 'none',
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
    MuiMenuItem: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
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
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Sora', sans-serif",
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            color: '#1ED760',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
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
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#171717',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          fontSize: '0.75rem',
          padding: '8px 12px',
          borderRadius: 8,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
  },
});

export default theme;