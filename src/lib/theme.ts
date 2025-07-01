'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Paleta de colores profesional clínica según especificaciones
const colors = {
  primary: '#2463EB',
  secondary: '#EFF3FB',
  background: '#F9FAFB',
  textPrimary: '#1C1E21',
  textSecondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  surfaceElevated: '#EFF3FB',
};

// Configuración de tipografías
const typography = {
  fontFamily: {
    primary: '"Inter", "Helvetica", "Arial", sans-serif',
    heading: '"Space Grotesk", "Inter", sans-serif',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Breakpoints personalizados
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

// Configuración del tema MUI
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light', // Forzar modo claro
    primary: {
      main: colors.primary,
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.textSecondary,
      light: '#9CA3AF',
      dark: '#4B5563',
      contrastText: colors.textPrimary,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    success: {
      main: colors.success,
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: colors.warning,
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    error: {
      main: colors.error,
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    divider: colors.border,
  },
  
  breakpoints: {
    values: breakpoints,
  },
  
  typography: {
    fontFamily: typography.fontFamily.primary,
    h1: {
      fontFamily: typography.fontFamily.heading,
      fontSize: '2.5rem',
      fontWeight: typography.weights.bold,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.textPrimary,
    },
    h2: {
      fontFamily: typography.fontFamily.heading,
      fontSize: '2rem',
      fontWeight: typography.weights.semibold,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: colors.textPrimary,
    },
    h3: {
      fontFamily: typography.fontFamily.heading,
      fontSize: '1.75rem',
      fontWeight: typography.weights.semibold,
      lineHeight: 1.3,
      color: colors.textPrimary,
    },
    h4: {
      fontFamily: typography.fontFamily.heading,
      fontSize: '1.5rem',
      fontWeight: typography.weights.medium,
      lineHeight: 1.4,
      color: colors.textPrimary,
    },
    h5: {
      fontFamily: typography.fontFamily.heading,
      fontSize: '1.25rem',
      fontWeight: typography.weights.medium,
      lineHeight: 1.4,
      color: colors.textPrimary,
    },
    h6: {
      fontFamily: typography.fontFamily.heading,
      fontSize: '1.125rem',
      fontWeight: typography.weights.medium,
      lineHeight: 1.4,
      color: colors.textPrimary,
    },
    body1: {
      fontFamily: typography.fontFamily.primary,
      fontSize: '1rem',
      fontWeight: typography.weights.regular,
      lineHeight: 1.6,
      color: colors.textPrimary,
    },
    body2: {
      fontFamily: typography.fontFamily.primary,
      fontSize: '0.875rem',
      fontWeight: typography.weights.regular,
      lineHeight: 1.6,
      color: colors.textSecondary,
    },
    caption: {
      fontFamily: typography.fontFamily.primary,
      fontSize: '0.75rem',
      fontWeight: typography.weights.regular,
      lineHeight: 1.5,
      color: colors.textSecondary,
    },
    button: {
      fontFamily: typography.fontFamily.heading,
      fontSize: '0.875rem',
      fontWeight: typography.weights.semibold,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
  },
  
  shape: {
    borderRadius: 16, // 2xl según especificaciones
  },
  
  spacing: 8, // Base de 8px
  
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)', // card
    '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)', // elevated
    '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.06)', // floating
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // modal
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  ],
  
  components: {
    // Configuración de componentes MUI
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: typography.fontFamily.primary,
          backgroundColor: colors.background,
          color: colors.textPrimary,
          lineHeight: 1.6,
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '1rem', // 16px
          padding: '0.875rem 2rem',
          fontSize: '0.875rem',
          fontWeight: typography.weights.semibold,
          fontFamily: typography.fontFamily.heading,
          textTransform: 'none',
          letterSpacing: '0.025em',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          backgroundColor: colors.primary,
          color: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(36, 99, 235, 0.25)',
          '&:hover': {
            backgroundColor: '#1D4ED8',
            boxShadow: '0 10px 15px -3px rgba(36, 99, 235, 0.4)',
          },
        },
        outlined: {
          borderColor: colors.border,
          color: colors.textPrimary,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.primary,
          },
        },
        text: {
          color: colors.primary,
          '&:hover': {
            backgroundColor: `${colors.primary}08`,
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          borderRadius: '1.5rem', // 24px
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '2rem 1.5rem',
          '&:last-child': {
            paddingBottom: '2rem',
          },
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.875rem', // 14px
            backgroundColor: colors.surface,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: colors.border,
            },
            '&:hover fieldset': {
              borderColor: colors.textSecondary,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary,
              boxShadow: `0 0 0 3px ${colors.primary}20`,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.textSecondary,
            fontFamily: typography.fontFamily.primary,
            '&.Mui-focused': {
              color: colors.primary,
            },
          },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          fontFamily: typography.fontFamily.primary,
          fontWeight: typography.weights.medium,
          fontSize: '0.75rem',
        },
        filled: {
          backgroundColor: colors.surfaceElevated,
          color: colors.textPrimary,
          '&:hover': {
            backgroundColor: colors.border,
          },
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          borderRadius: '1rem',
          border: `1px solid ${colors.border}`,
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: `${colors.surface}F5`, // 96% opacity
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          color: colors.textPrimary,
        },
      },
    },
    
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surfaceElevated,
          borderRadius: '1rem',
          padding: '0.5rem',
          minHeight: 'auto',
        },
        indicator: {
          display: 'none',
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          margin: '0 0.25rem',
          minHeight: 'auto',
          padding: '0.75rem 1.5rem',
          fontFamily: typography.fontFamily.heading,
          fontWeight: typography.weights.medium,
          fontSize: '0.875rem',
          textTransform: 'none',
          color: colors.textSecondary,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            backgroundColor: colors.surface,
            color: colors.primary,
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
          },
          '&:hover': {
            backgroundColor: colors.surface,
            color: colors.textPrimary,
          },
        },
      },
    },
    
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.textPrimary,
          color: colors.surface,
          fontSize: '0.75rem',
          fontFamily: typography.fontFamily.primary,
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
        arrow: {
          color: colors.textPrimary,
        },
      },
    },
  },
};

// Crear el tema
export const theme = createTheme(themeOptions);

// Extensiones del tema para uso personalizado (solo valores serializables)
export const customTheme = {
  colors,
  typography,
  breakpoints,
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
  shadows: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
    elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
    floating: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: `0 0 0 1px ${colors.primary}20, 0 4px 6px -1px ${colors.primary}25`,
  },
  gradients: {
    primary: `linear-gradient(135deg, ${colors.primary} 0%, #1D4ED8 100%)`,
    success: `linear-gradient(135deg, ${colors.success} 0%, #059669 100%)`,
    warning: `linear-gradient(135deg, ${colors.warning} 0%, #D97706 100%)`,
    error: `linear-gradient(135deg, ${colors.error} 0%, #DC2626 100%)`,
    surface: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.surfaceElevated} 100%)`,
  },
  animations: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionSlow: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export default theme;