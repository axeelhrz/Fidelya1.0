'use client';

import { createTheme } from '@mui/material/styles';

// Declaramos las variantes personalizadas para TypeScript
declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    titleLarge?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    priceDisplay?: React.CSSProperties;
    categoryTitle?: React.CSSProperties;
    menuItem?: React.CSSProperties;
    menuDescription?: React.CSSProperties;
  }
  interface TypographyVariants {
    titleLarge: React.CSSProperties;
    titleMedium: React.CSSProperties;
    priceDisplay: React.CSSProperties;
    categoryTitle: React.CSSProperties;
    menuItem: React.CSSProperties;
    menuDescription: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    titleLarge: true;
    titleMedium: true;
    priceDisplay: true;
    categoryTitle: true;
    menuItem: true;
    menuDescription: true;
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37', // Dorado argentino
      light: '#E8C547',
      dark: '#B8941F',
    },
    secondary: {
      main: '#2C2C2E', // Gris neutro
      light: '#48484A',
      dark: '#1C1C1E',
    },
    success: {
      main: '#D4AF37',
      light: '#E8C547',
      dark: '#B8941F',
    },
    background: {
      default: '#0A0A0A', // Negro profundo
      paper: '#1A1A1A',   // Gris muy oscuro
    },
    text: {
      primary: '#F8F8F8',   // Blanco suave
      secondary: '#B8B8B8', // Gris medio
    },
    divider: '#2C2C2E',
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif",
    
    // Títulos minimalistas
    h1: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      color: '#F8F8F8',
    },
    h2: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: '#F8F8F8',
    },
    h3: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '0em',
      lineHeight: 1.3,
      color: '#F8F8F8',
    },
    
    // Nombres de productos - estilo argentino
    h4: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      fontSize: '1.1rem',
      letterSpacing: '0em',
      lineHeight: 1.4,
      color: '#F8F8F8',
      textAlign: 'left',
    },
    h5: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      fontSize: '1rem',
      letterSpacing: '0em',
      lineHeight: 1.4,
      color: '#F8F8F8',
      textAlign: 'left',
    },
    h6: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      fontSize: '0.9rem',
      letterSpacing: '0em',
      lineHeight: 1.4,
      color: '#F8F8F8',
    },
    
    // Descripciones compactas
    body1: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.85rem',
      lineHeight: 1.5,
      letterSpacing: '0em',
      color: '#B8B8B8',
      fontWeight: 400,
    },
    body2: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.8rem',
      lineHeight: 1.5,
      letterSpacing: '0em',
      color: '#B8B8B8',
      fontWeight: 400,
    },
    subtitle1: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.9rem',
      fontWeight: 500,
      letterSpacing: '0em',
      lineHeight: 1.4,
      color: '#F8F8F8',
    },
    subtitle2: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.8rem',
      fontWeight: 500,
      letterSpacing: '0em',
      lineHeight: 1.4,
      color: '#B8B8B8',
    },
    
    button: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
      letterSpacing: '0.02em',
          textTransform: 'none',
          },
    
    // Variantes personalizadas minimalistas
    categoryTitle: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      lineHeight: 1.3,
      color: '#D4AF37',
      textTransform: 'uppercase',
      },
    
    menuItem: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0em',
      lineHeight: 1.4,
      color: '#F8F8F8',
          },
    
    menuDescription: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.8rem',
      fontWeight: 400,
      letterSpacing: '0em',
      lineHeight: 1.5,
      color: '#B8B8B8',
          },
    
    // Precios argentinos
    priceDisplay: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0em',
      lineHeight: 1.2,
      color: '#D4AF37',
      textAlign: 'right',
        },
    
    titleLarge: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.1,
      color: '#F8F8F8',
      },
    titleMedium: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.75rem',
          fontWeight: 600,
      letterSpacing: '0em',
      lineHeight: 1.2,
      color: '#F8F8F8',
        },
      },
  shape: {
    borderRadius: 0, // Sin bordes redondeados para look minimalista
    },
  shadows: [
    'none',
    '0px 1px 2px rgba(0,0,0,0.2)',
    '0px 2px 4px rgba(0,0,0,0.25)',
    '0px 3px 6px rgba(0,0,0,0.3)',
    '0px 4px 8px rgba(0,0,0,0.35)',
    '0px 5px 10px rgba(0,0,0,0.4)',
    '0px 6px 12px rgba(0,0,0,0.45)',
    '0px 7px 14px rgba(0,0,0,0.5)',
    '0px 8px 16px rgba(0,0,0,0.55)',
    '0px 9px 18px rgba(0,0,0,0.6)',
    '0px 10px 20px rgba(0,0,0,0.65)',
    '0px 11px 22px rgba(0,0,0,0.7)',
    '0px 12px 24px rgba(0,0,0,0.75)',
    '0px 13px 26px rgba(0,0,0,0.8)',
    '0px 14px 28px rgba(0,0,0,0.85)',
    '0px 15px 30px rgba(0,0,0,0.9)',
    '0px 16px 32px rgba(0,0,0,0.95)',
    '0px 17px 34px rgba(0,0,0,1)',
    '0px 18px 36px rgba(0,0,0,1)',
    '0px 19px 38px rgba(0,0,0,1)',
    '0px 20px 40px rgba(0,0,0,1)',
    '0px 21px 42px rgba(0,0,0,1)',
    '0px 22px 44px rgba(0,0,0,1)',
    '0px 23px 46px rgba(0,0,0,1)',
    '0px 24px 48px rgba(0,0,0,1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0A0A0A',
          color: '#F8F8F8',
          fontFamily: "'Inter', sans-serif",
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '10px 20px',
          fontWeight: 500,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
          minHeight: 40,
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: '#D4AF37',
          color: '#0A0A0A',
          border: '1px solid #D4AF37',
          '&:hover': {
            backgroundColor: '#E8C547',
            boxShadow: '0px 2px 8px rgba(212, 175, 55, 0.2)',
      },
    },
        outlined: {
          borderWidth: '1px',
          borderColor: '#D4AF37',
          color: '#D4AF37',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderColor: '#D4AF37',
        },
      },
    },
        },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: 0,
          border: '1px solid rgba(212, 175, 55, 0.15)',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.3)',
      },
    },
  },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 32,
          border: 'none',
          letterSpacing: '0.02em',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            color: '#D4AF37',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: 'rgba(44, 44, 46, 0.8)',
            color: '#F8F8F8',
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            color: '#D4AF37',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(212, 175, 55, 0.2)',
          margin: '16px 0',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          titleLarge: 'h1',
          titleMedium: 'h2',
          categoryTitle: 'h3',
          menuItem: 'h4',
          menuDescription: 'p',
          priceDisplay: 'span',
        },
      },
    },
  },
});

export default theme;