import { useMemo } from 'react';

// Constantes de tema autocontenidas
export const THEME_CONSTANTS = {
  colors: {
    primary: '#2463EB',
    primaryLight: '#60A5FA',
    primaryDark: '#1D4ED8',
    secondary: '#EFF3FB',
    secondaryLight: '#F8FAFF',
    secondaryDark: '#E2E8F0',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceElevated: '#EFF3FB',
    surfaceHover: '#F8FAFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',
    textPrimary: '#1C1E21',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    textAccent: '#2463EB',
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    warningBg: '#FFFBEB',
    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#DC2626',
    errorBg: '#FEF2F2',
    info: '#3B82F6',
    infoLight: '#60A5FA',
    infoDark: '#2563EB',
    infoBg: '#EFF6FF',
    borderLight: '#E5E7EB',
    borderMedium: '#D1D5DB',
    borderStrong: '#9CA3AF',
    borderPrimary: '#2463EB',
  },
  
  fonts: {
    primary: '"Inter", ui-sans-serif, system-ui, sans-serif',
    heading: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  },
  
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
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
    full: '9999px',
  },
  
  shadows: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
    elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
    floating: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 0 1px rgba(36, 99, 235, 0.05), 0 4px 6px -1px rgba(36, 99, 235, 0.25)',
    glowStrong: '0 0 20px rgba(36, 99, 235, 0.15), 0 0 40px rgba(36, 99, 235, 0.1)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    surface: 'linear-gradient(135deg, #F9FAFB 0%, #EFF3FB 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  },
  
  animations: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionSlow: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionFast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
};

// Hook para generar estilos responsivos
export const useResponsiveStyles = () => {
  return useMemo(() => ({
    mediaQuery: {
      sm: `@media (min-width: ${THEME_CONSTANTS.breakpoints.sm}px)`,
      md: `@media (min-width: ${THEME_CONSTANTS.breakpoints.md}px)`,
      lg: `@media (min-width: ${THEME_CONSTANTS.breakpoints.lg}px)`,
      xl: `@media (min-width: ${THEME_CONSTANTS.breakpoints.xl}px)`,
      xxl: `@media (min-width: ${THEME_CONSTANTS.breakpoints.xxl}px)`,
    },
    
    getResponsiveValue: <T>(values: { xs?: T; sm?: T; md?: T; lg?: T; xl?: T; xxl?: T }) => {
      const currentWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
      
      if (currentWidth >= THEME_CONSTANTS.breakpoints.xxl && values.xxl !== undefined) return values.xxl;
      if (currentWidth >= THEME_CONSTANTS.breakpoints.xl && values.xl !== undefined) return values.xl;
      if (currentWidth >= THEME_CONSTANTS.breakpoints.lg && values.lg !== undefined) return values.lg;
      if (currentWidth >= THEME_CONSTANTS.breakpoints.md && values.md !== undefined) return values.md;
      if (currentWidth >= THEME_CONSTANTS.breakpoints.sm && values.sm !== undefined) return values.sm;
      return values.xs;
    },
  }), []);
};

// Hook principal para estilos
export const useStyles = () => {
  const responsive = useResponsiveStyles();
  
  return useMemo(() => ({
    theme: THEME_CONSTANTS,
    responsive,
    
    // Utilidades de estilo comunes
    utils: {
      flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      flexBetween: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      
      flexColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
      },
      
      absoluteCenter: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      
      truncate: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
      },
      
      visuallyHidden: {
        position: 'absolute' as const,
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap' as const,
        border: 0,
      },
    },
  }), [responsive]);
};

export default useStyles;
