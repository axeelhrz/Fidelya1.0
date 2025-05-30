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
      main: '#D4AF37', // Dorado elegante para elementos premium
      light: '#F4E4BC',
      dark: '#B8941F',
    },
    secondary: {
      main: '#2C2C2E', // Gris carbón sofisticado
      light: '#48484A',
      dark: '#1C1C1E',
    },
    success: {
      main: '#D4AF37', // Dorado para elementos destacados
      light: '#F4E4BC',
      dark: '#B8941F',
    },
    background: {
      default: '#0A0A0A', // Negro profundo más elegante
      paper: '#1A1A1A',   // Gris muy oscuro para tarjetas
    },
    text: {
      primary: '#F8F8F8',   // Blanco cálido más suave
      secondary: '#B8B8B8', // Gris medio para descripciones
    },
    divider: '#2C2C2E', // Separadores sutiles
  },
  typography: {
    fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Times New Roman', serif",
    
    // Títulos principales - elegantes y sofisticados
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      color: '#F8F8F8',
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: '2.25rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      color: '#F8F8F8',
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: '1.875rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      color: '#F8F8F8',
    },
    
    // Nombres de productos - estilo menú clásico
    h4: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
      fontSize: '1.375rem',
      letterSpacing: '0.01em',
      lineHeight: 1.3,
      color: '#F8F8F8',
      textAlign: 'left',
    },
    h5: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 500,
      fontSize: '1.25rem',
      letterSpacing: '0.01em',
      lineHeight: 1.3,
      color: '#F8F8F8',
      textAlign: 'left',
    },
    h6: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 500,
      fontSize: '1.125rem',
      letterSpacing: '0.01em',
      lineHeight: 1.4,
      color: '#F8F8F8',
    },
    
    // Descripciones - fuente sans-serif para legibilidad
    body1: {
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      fontSize: '0.9rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      color: '#B8B8B8',
      fontWeight: 400,
    },
    body2: {
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      fontSize: '0.8rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      color: '#B8B8B8',
      fontWeight: 400,
    },
    subtitle1: {
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
      color: '#F8F8F8',
    },
    subtitle2: {
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
      color: '#B8B8B8',
    },
    
    button: {
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
          textTransform: 'none',
          },
    
    // Variantes personalizadas para el menú
    categoryTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      color: '#D4AF37',
      textTransform: 'uppercase',
      },
    
    menuItem: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1.3,
      color: '#F8F8F8',
          },
    
    menuDescription: {
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
      color: '#B8B8B8',
      fontStyle: 'italic',
          },
    
    // Precios - destacados en dorado
    priceDisplay: {
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      fontSize: '1.25rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      color: '#D4AF37',
      textAlign: 'right',
        },
    
    titleLarge: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      color: '#F8F8F8',
      },
    titleMedium: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2rem',
          fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      color: '#F8F8F8',
        },
      },
  shape: {
    borderRadius: 0, // Bordes rectos para un look más clásico y elegante
    },
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.3)',
    '0px 2px 6px rgba(0,0,0,0.35)',
    '0px 3px 9px rgba(0,0,0,0.4)',
    '0px 4px 12px rgba(0,0,0,0.45)',
    '0px 5px 15px rgba(0,0,0,0.5)',
    '0px 6px 18px rgba(0,0,0,0.55)',
    '0px 7px 21px rgba(0,0,0,0.6)',
    '0px 8px 24px rgba(0,0,0,0.65)',
    '0px 9px 27px rgba(0,0,0,0.7)',
    '0px 10px 30px rgba(0,0,0,0.75)',
    '0px 11px 33px rgba(0,0,0,0.8)',
    '0px 12px 36px rgba(0,0,0,0.85)',
    '0px 13px 39px rgba(0,0,0,0.9)',
    '0px 14px 42px rgba(0,0,0,0.95)',
    '0px 15px 45px rgba(0,0,0,1)',
    '0px 16px 48px rgba(0,0,0,1)',
    '0px 17px 51px rgba(0,0,0,1)',
    '0px 18px 54px rgba(0,0,0,1)',
    '0px 19px 57px rgba(0,0,0,1)',
    '0px 20px 60px rgba(0,0,0,1)',
    '0px 21px 63px rgba(0,0,0,1)',
    '0px 22px 66px rgba(0,0,0,1)',
    '0px 23px 69px rgba(0,0,0,1)',
    '0px 24px 72px rgba(0,0,0,1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0A0A0A',
          color: '#F8F8F8',
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          backgroundImage: 'none', // Sin texturas para un look más limpio
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '12px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          minHeight: 44,
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: '#D4AF37',
          color: '#0A0A0A',
          border: '1px solid #D4AF37',
          '&:hover': {
            backgroundColor: '#F4E4BC',
            boxShadow: '0px 4px 12px rgba(212, 175, 55, 0.3)',
      },
    },
        outlined: {
          borderWidth: '1px',
          borderColor: '#D4AF37',
          color: '#D4AF37',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderColor: '#F4E4BC',
        },
      },
    },
        },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: 0,
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.4)',
      },
    },
  },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
          border: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
            color: '#D4AF37',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: 'rgba(44, 44, 46, 0.8)',
            color: '#F8F8F8',
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
            color: '#D4AF37',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(212, 175, 55, 0.3)',
          margin: '24px 0',
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