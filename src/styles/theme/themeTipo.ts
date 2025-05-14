import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Declarar módulo para extender el tema
declare module '@mui/material/styles' {
  interface Palette {
    // Puedes añadir colores personalizados aquí
    custom: {
      main: string;
      light: string;
      dark: string;
    }
  }
  interface PaletteOptions {
    // Opciones para colores personalizados
    custom?: {
      main?: string;
      light?: string;
      dark?: string;
    }
  }
}

// Crear tema base
const baseTheme = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#fff',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#fff',
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#fff',
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
        contrastText: '#fff',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#fff',
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#fff',
      },
      background: {
        default: isLight ? '#f5f5f7' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: isLight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        disabled: isLight ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.38)',
      },
      divider: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      h1: {
        fontFamily: 'Sora, sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: 'Sora, sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: 'Sora, sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: 'Sora, sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: 'Sora, sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: 'Sora, sans-serif',
        fontWeight: 600,
      },
      subtitle1: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
      },
      subtitle2: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
      },
      body1: {
        fontFamily: 'Inter, sans-serif',
      },
      body2: {
        fontFamily: 'Inter, sans-serif',
      },
      button: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        textTransform: 'none',
      },
      caption: {
        fontFamily: 'Inter, sans-serif',
      },
      overline: {
        fontFamily: 'Inter, sans-serif',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
      '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)',
      '0px 3px 5px -1px rgba(0,0,0,0.07),0px 5px 8px 0px rgba(0,0,0,0.05),0px 1px 14px 0px rgba(0,0,0,0.07)',
      '0px 4px 5px -2px rgba(0,0,0,0.08),0px 7px 10px 1px rgba(0,0,0,0.06),0px 2px 16px 1px rgba(0,0,0,0.08)',
      '0px 5px 5px -3px rgba(0,0,0,0.09),0px 8px 10px 1px rgba(0,0,0,0.07),0px 3px 14px 2px rgba(0,0,0,0.09)',
      '0px 6px 6px -3px rgba(0,0,0,0.1),0px 10px 14px 1px rgba(0,0,0,0.08),0px 4px 18px 3px rgba(0,0,0,0.1)',
      '0px 7px 8px -4px rgba(0,0,0,0.11),0px 12px 17px 2px rgba(0,0,0,0.09),0px 5px 22px 4px rgba(0,0,0,0.11)',
      '0px 8px 9px -5px rgba(0,0,0,0.12),0px 15px 22px 2px rgba(0,0,0,0.1),0px 6px 28px 5px rgba(0,0,0,0.12)',
      '0px 9px 10px -6px rgba(0,0,0,0.13),0px 18px 28px 2px rgba(0,0,0,0.11),0px 7px 34px 6px rgba(0,0,0,0.13)',
      '0px 10px 11px -7px rgba(0,0,0,0.14),0px 20px 31px 3px rgba(0,0,0,0.12),0px 8px 38px 7px rgba(0,0,0,0.14)',
      '0px 11px 12px -7px rgba(0,0,0,0.15),0px 22px 35px 3px rgba(0,0,0,0.13),0px 8px 42px 7px rgba(0,0,0,0.15)',
      '0px 12px 13px -8px rgba(0,0,0,0.16),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.16)',
      '0px 12px 17px -8px rgba(0,0,0,0.17),0px 24px 38px 3px rgba(0,0,0,0.15),0px 9px 46px 8px rgba(0,0,0,0.17)',
      '0px 13px 19px -9px rgba(0,0,0,0.18),0px 26px 40px 4px rgba(0,0,0,0.16),0px 10px 50px 9px rgba(0,0,0,0.18)',
      '0px 14px 21px -10px rgba(0,0,0,0.19),0px 28px 42px 4px rgba(0,0,0,0.17),0px 11px 54px 10px rgba(0,0,0,0.19)',
      '0px 15px 22px -10px rgba(0,0,0,0.2),0px 30px 45px 5px rgba(0,0,0,0.18),0px 12px 58px 11px rgba(0,0,0,0.2)',
      '0px 15px 24px -11px rgba(0,0,0,0.21),0px 32px 48px 5px rgba(0,0,0,0.19),0px 13px 62px 12px rgba(0,0,0,0.21)',
      '0px 16px 25px -12px rgba(0,0,0,0.22),0px 34px 51px 6px rgba(0,0,0,0.2),0px 14px 66px 13px rgba(0,0,0,0.22)',
      '0px 17px 26px -12px rgba(0,0,0,0.23),0px 36px 54px 6px rgba(0,0,0,0.21),0px 15px 70px 14px rgba(0,0,0,0.23)',
      '0px 18px 28px -13px rgba(0,0,0,0.24),0px 38px 56px 7px rgba(0,0,0,0.22),0px 16px 74px 15px rgba(0,0,0,0.24)',
      '0px 19px 29px -14px rgba(0,0,0,0.25),0px 40px 58px 7px rgba(0,0,0,0.23),0px 17px 78px 16px rgba(0,0,0,0.25)',
      '0px 20px 31px -15px rgba(0,0,0,0.26),0px 42px 60px 8px rgba(0,0,0,0.24),0px 18px 82px 17px rgba(0,0,0,0.26)',
      '0px 21px 33px -16px rgba(0,0,0,0.27),0px 44px 62px 8px rgba(0,0,0,0.25),0px 19px 86px 18px rgba(0,0,0,0.27)',
      '0px 22px 35px -17px rgba(0,0,0,0.28),0px 46px 65px 9px rgba(0,0,0,0.26),0px 20px 90px 19px rgba(0,0,0,0.28)',
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight ? '#f1f1f1' : '#2d2d2d',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isLight ? '#c1c1c1' : '#5c5c5c',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: isLight ? '#a8a8a8' : '#6e6e6e',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: isLight 
              ? '0 4px 20px rgba(0, 0, 0, 0.05)' 
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isLight 
              ? alpha('#000', 0.8) 
              : alpha('#fff', 0.8),
            color: isLight ? '#fff' : '#000',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            padding: '8px 12px',
            borderRadius: '8px',
          },
        },
      },
    },
  });
};

// Crear tema con modo claro
export const lightTheme = responsiveFontSizes(baseTheme('light'));

// Crear tema con modo oscuro
export const darkTheme = responsiveFontSizes(baseTheme('dark'));

// Exportar función para obtener tema según modo
export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'light' ? lightTheme : darkTheme;
};