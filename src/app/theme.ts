'use client';

import { createTheme } from '@mui/material/styles';

// Declaramos la fuente Plus Jakarta Sans para TypeScript
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

// Actualizamos los componentes Typography con las nuevas variantes
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    titleLarge: true;
    titleMedium: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6', // Azul profesional
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#F59E0B', // Acento dorado/sabores
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10B981', // Para "Recomendado" o especialidades
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#FFFFFF', // Fondo puro
      paper: '#F5F5F5',   // Secciones
    },
    text: {
      primary: '#111827', // Texto principal
      secondary: '#4B5563', // Texto secundario
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    // Variantes personalizadas
    titleLarge: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    titleMedium: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(0, 0, 0, 0.04)',
    '0px 4px 16px rgba(0, 0, 0, 0.06)',
    '0px 6px 24px rgba(0, 0, 0, 0.08)',
    '0px 8px 32px rgba(0, 0, 0, 0.10)',
    '0px 10px 36px rgba(0, 0, 0, 0.12)',
    '0px 12px 40px rgba(0, 0, 0, 0.14)',
    '0px 14px 44px rgba(0, 0, 0, 0.16)',
    '0px 16px 48px rgba(0, 0, 0, 0.18)',
    '0px 18px 52px rgba(0, 0, 0, 0.20)',
    '0px 20px 56px rgba(0, 0, 0, 0.22)',
    '0px 22px 60px rgba(0, 0, 0, 0.24)',
    '0px 24px 64px rgba(0, 0, 0, 0.26)',
    '0px 26px 68px rgba(0, 0, 0, 0.28)',
    '0px 28px 72px rgba(0, 0, 0, 0.30)',
    '0px 30px 76px rgba(0, 0, 0, 0.32)',
    '0px 32px 80px rgba(0, 0, 0, 0.34)',
    '0px 34px 84px rgba(0, 0, 0, 0.36)',
    '0px 36px 88px rgba(0, 0, 0, 0.38)',
    '0px 38px 92px rgba(0, 0, 0, 0.40)',
    '0px 40px 96px rgba(0, 0, 0, 0.42)',
    '0px 42px 100px rgba(0, 0, 0, 0.44)',
    '0px 44px 104px rgba(0, 0, 0, 0.46)',
    '0px 46px 108px rgba(0, 0, 0, 0.48)',
    '0px 48px 112px rgba(0, 0, 0, 0.50)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100, // Estilo pill
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          textTransform: 'none',
        },
        contained: {
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.15)',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.25)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        },
        elevation1: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 28,
        },
        filled: {
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          color: '#3B82F6',
          '&.MuiChip-colorSecondary': {
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            color: '#F59E0B',
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            color: '#10B981',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          opacity: 0.2,
          margin: '16px 0',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '50%',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            transform: 'translateY(-2px)',
          },
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