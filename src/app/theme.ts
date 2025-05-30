'use client';

import { createTheme } from '@mui/material/styles';

// Declaramos las variantes personalizadas para TypeScript
declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    titleLarge?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    priceDisplay?: React.CSSProperties;
    categoryTitle?: React.CSSProperties;
  }
  interface TypographyVariants {
    titleLarge: React.CSSProperties;
    titleMedium: React.CSSProperties;
    priceDisplay: React.CSSProperties;
    categoryTitle: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    titleLarge: true;
    titleMedium: true;
    priceDisplay: true;
    categoryTitle: true;
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6', // azul profesional moderno
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#F59E0B', // mostaza/dorado sutil para precios
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10B981', // verde para elementos recomendados
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#1C1C1E', // negro texturizado principal
      paper: '#2C2C2E',   // gris oscuro más claro para tarjetas
    },
    text: {
      primary: '#F5F5F7',   // blanco cálido
      secondary: '#A1A1AA', // gris claro para descripciones
    },
    divider: '#3A3A3C', // separadores apenas perceptibles
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Outfit', 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif",
    
    // Títulos de secciones/categorías - peso medio-alto, tamaño grande, blanco cálido
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
      color: '#F5F5F7',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: '#F5F5F7',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: '#F5F5F7',
    },
    
    // Nombres de productos - alineados izquierda, tamaño medio, peso medio, blanco
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: '#F5F5F7',
      textAlign: 'left',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: '#F5F5F7',
      textAlign: 'left',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      color: '#F5F5F7',
    },
    
    // Descripciones - fuente pequeña, peso normal, gris claro
    body1: {
      fontSize: '0.9rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      color: '#A1A1AA',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.8rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      color: '#A1A1AA',
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
      color: '#F5F5F7',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
      color: '#A1A1AA',
    },
    
    button: {
      fontWeight: 600,
      letterSpacing: '0.01em',
          textTransform: 'none',
          },
    
    // Variantes personalizadas
    categoryTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: '#F5F5F7',
      },
    
    // Precios - destacados en mostaza, alineados derecha, peso alto
    priceDisplay: {
      fontSize: '1.375rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
            color: '#F59E0B',
      textAlign: 'right',
          },
    
    titleLarge: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
      color: '#F5F5F7',
          },
    titleMedium: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: '#F5F5F7',
        },
      },
  shape: {
    borderRadius: 12, // bordes redondeados suaves
    },
  shadows: [
    'none',
    '0px 2px 8px rgba(0,0,0,0.15)',
    '0px 4px 12px rgba(0,0,0,0.18)',
    '0px 6px 16px rgba(0,0,0,0.20)',
    '0px 8px 20px rgba(0,0,0,0.22)',
    '0px 10px 24px rgba(0,0,0,0.25)',
    '0px 12px 28px rgba(0,0,0,0.28)',
    '0px 14px 32px rgba(0,0,0,0.30)',
    '0px 16px 36px rgba(0,0,0,0.32)',
    '0px 18px 40px rgba(0,0,0,0.35)',
    '0px 20px 44px rgba(0,0,0,0.38)',
    '0px 22px 48px rgba(0,0,0,0.40)',
    '0px 24px 52px rgba(0,0,0,0.42)',
    '0px 26px 56px rgba(0,0,0,0.45)',
    '0px 28px 60px rgba(0,0,0,0.48)',
    '0px 30px 64px rgba(0,0,0,0.50)',
    '0px 32px 68px rgba(0,0,0,0.52)',
    '0px 34px 72px rgba(0,0,0,0.55)',
    '0px 36px 76px rgba(0,0,0,0.58)',
    '0px 38px 80px rgba(0,0,0,0.60)',
    '0px 40px 84px rgba(0,0,0,0.62)',
    '0px 42px 88px rgba(0,0,0,0.65)',
    '0px 44px 92px rgba(0,0,0,0.68)',
    '0px 46px 96px rgba(0,0,0,0.70)',
    '0px 48px 100px rgba(0,0,0,0.72)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1C1C1E',
          color: '#F5F5F7',
          fontFamily: "'Plus Jakarta Sans', 'Outfit', 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif",
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
          },
        },
      },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '14px 28px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
          minHeight: 48,
          '&:hover': {
            transform: 'translateY(-2px)',
        },
      },
        contained: {
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.25)',
          '&:hover': {
            backgroundColor: '#2563eb',
            boxShadow: '0px 8px 24px rgba(59, 130, 246, 0.35)',
    },
        },
        outlined: {
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          color: '#F5F5F7',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2E',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
          border: 'none',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#3B82F6',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10B981',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: 'rgba(255,255,255,0.06)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#3A3A3C',
          margin: '20px 0',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          titleLarge: 'h1',
          titleMedium: 'h2',
          categoryTitle: 'h3',
          priceDisplay: 'span',
        },
      },
    },
  },
});

export default theme;