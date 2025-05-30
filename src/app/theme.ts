'use client';

import { createTheme } from '@mui/material/styles';

// Declaramos las variantes personalizadas para TypeScript
declare module '@mui/material/styles' {
  interface TypographyVariantsOptions {
    titleLarge?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
  }

  interface TypographyVariants {
    titleLarge: React.CSSProperties;
    titleMedium: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    titleLarge: true;
    titleMedium: true;
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6', // azul eléctrico para botones y acentos principales
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#F59E0B', // color mostaza para precios y promociones
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10B981', // verde para "Recomendado"
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#1C1C1E', // fondo general oscuro (negro elegante)
      paper: '#2C2C2E',   // tarjetas y contenedores
    },
    text: {
      primary: '#F5F5F7',   // texto claro
      secondary: '#A1A1AA', // descripciones
    },
    divider: '#3A3A3C', // separadores suaves
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: '#F5F5F7',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#F5F5F7',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: '#F5F5F7',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      color: '#F5F5F7',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      color: '#F5F5F7',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.5,
      color: '#F5F5F7',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      color: '#F5F5F7',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      color: '#A1A1AA',
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
    titleLarge: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: '#F5F5F7',
    },
    titleMedium: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: '#F5F5F7',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 6px 18px rgba(0,0,0,0.12)',
    '0px 8px 24px rgba(0,0,0,0.15)',
    '0px 12px 32px rgba(0,0,0,0.18)',
    '0px 16px 40px rgba(0,0,0,0.20)',
    '0px 20px 48px rgba(0,0,0,0.22)',
    '0px 24px 56px rgba(0,0,0,0.25)',
    '0px 28px 64px rgba(0,0,0,0.28)',
    '0px 32px 72px rgba(0,0,0,0.30)',
    '0px 36px 80px rgba(0,0,0,0.32)',
    '0px 40px 88px rgba(0,0,0,0.35)',
    '0px 44px 96px rgba(0,0,0,0.38)',
    '0px 48px 104px rgba(0,0,0,0.40)',
    '0px 52px 112px rgba(0,0,0,0.42)',
    '0px 56px 120px rgba(0,0,0,0.45)',
    '0px 60px 128px rgba(0,0,0,0.48)',
    '0px 64px 136px rgba(0,0,0,0.50)',
    '0px 68px 144px rgba(0,0,0,0.52)',
    '0px 72px 152px rgba(0,0,0,0.55)',
    '0px 76px 160px rgba(0,0,0,0.58)',
    '0px 80px 168px rgba(0,0,0,0.60)',
    '0px 84px 176px rgba(0,0,0,0.62)',
    '0px 88px 184px rgba(0,0,0,0.65)',
    '0px 92px 192px rgba(0,0,0,0.68)',
    '0px 96px 200px rgba(0,0,0,0.70)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1C1C1E',
          color: '#F5F5F7',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 600,
          boxShadow: 'none',
            transition: 'all 0.3s ease',
          textTransform: 'none',
          minHeight: 48,
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        contained: {
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          boxShadow: '0px 6px 18px rgba(59, 130, 246, 0.25)',
          '&:hover': {
            backgroundColor: '#2563eb',
            boxShadow: '0px 8px 24px rgba(59, 130, 246, 0.35)',
      },
    },
        outlined: {
          borderWidth: '1.5px',
          borderColor: '#3B82F6',
          color: '#3B82F6',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderColor: '#2563eb',
        },
      },
    },
  },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2E',
          borderRadius: 16,
          boxShadow: '0px 6px 18px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 28,
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
          borderRadius: 12,
          transition: 'all 0.3s ease',
          minHeight: 48,
          minWidth: 48,
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#3A3A3C',
          margin: '24px 0',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          titleLarge: 'h1',
          titleMedium: 'h2',
        },
      },
    },
  },
});

export default theme;