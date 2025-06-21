import { createTheme, Theme } from '@mui/material/styles';
import { CenterTheme } from '@/types/center';

// Colores oficiales del brand kit
export const ceoBrandColors = {
  primary: '#5D4FB0',         // púrpura profesional
  secondary: '#A593F3',       // lavanda claro
  accentBlue: '#A5CAE6',      // azul suave
  accentPink: '#D97DB7',      // rosa emocional
  background: '#F2EDEA',      // fondo claro suave
  text: '#2E2E2E',            // gris oscuro elegante
  surface: '#FFFFFF',         // superficie blanca
  surfaceElevated: '#FEFEFE', // superficie elevada
};

export const defaultLightTheme: CenterTheme = {
  primary: ceoBrandColors.primary,
  secondary: ceoBrandColors.secondary,
  accent: ceoBrandColors.accentBlue,
  background: ceoBrandColors.background,
  surface: ceoBrandColors.surface,
  text: ceoBrandColors.text,
  textSecondary: '#64748b',
  border: 'rgba(93, 79, 176, 0.12)',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: ceoBrandColors.accentBlue,
};

export const defaultDarkTheme: CenterTheme = {
  primary: '#7C6FDC',
  secondary: '#B8A9F5',
  accent: '#B8D4E8',
  background: '#0F0F1A',
  surface: '#1A1B2E',
  text: '#F8F9FA',
  textSecondary: '#CBD5E1',
  border: 'rgba(124, 111, 220, 0.15)',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#B8D4E8',
};

export function createCenterTheme(centerTheme: CenterTheme, mode: 'light' | 'dark'): Theme {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: centerTheme.primary,
        light: isDark ? '#9C8AE8' : '#8B7DD8',
        dark: isDark ? '#6B5FD4' : '#4A3D8A',
        contrastText: '#ffffff',
      },
      secondary: {
        main: centerTheme.secondary,
        light: isDark ? '#D4C7F7' : '#C4B5F7',
        dark: isDark ? '#9B88F1' : '#7C6BC9',
        contrastText: '#ffffff',
      },
      background: {
        default: centerTheme.background,
        paper: centerTheme.surface,
      },
      text: {
        primary: centerTheme.text,
        secondary: centerTheme.textSecondary,
      },
      success: {
        main: centerTheme.success,
        light: isDark ? '#6EE7B7' : '#34D399',
        dark: isDark ? '#10B981' : '#059669',
      },
      warning: {
        main: centerTheme.warning,
        light: isDark ? '#FCD34D' : '#FBBF24',
        dark: isDark ? '#F59E0B' : '#D97706',
      },
      error: {
        main: centerTheme.error,
        light: isDark ? '#FCA5A5' : '#F87171',
        dark: isDark ? '#EF4444' : '#DC2626',
      },
      info: {
        main: centerTheme.info,
        light: isDark ? '#D4E7F0' : ceoBrandColors.accentBlue,
        dark: isDark ? '#9BC4DF' : '#7BA8C7',
      },
      divider: centerTheme.border,
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontFamily: '"Outfit", "Poppins", sans-serif',
        fontWeight: 800,
        fontSize: '3rem',
        lineHeight: 1.1,
        letterSpacing: '-0.025em',
        background: isDark 
          ? 'linear-gradient(135deg, #7C6FDC 0%, #B8A9F5 100%)'
          : 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      h2: {
        fontFamily: '"Outfit", "Poppins", sans-serif',
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: '"Outfit", "Poppins", sans-serif',
        fontWeight: 700,
        fontSize: '1.875rem',
        lineHeight: 1.3,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontFamily: '"Outfit", "Poppins", sans-serif',
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontFamily: '"Outfit", "Poppins", sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.5,
        letterSpacing: '0em',
      },
      h6: {
        fontFamily: '"Outfit", "Poppins", sans-serif',
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.5,
        letterSpacing: '0em',
      },
      body1: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '1rem',
        lineHeight: 1.6,
        fontWeight: 400,
      },
      body2: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 400,
      },
      subtitle1: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '1rem',
        lineHeight: 1.5,
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      subtitle2: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      caption: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.75rem',
        lineHeight: 1.4,
        fontWeight: 400,
        letterSpacing: '0.02em',
      },
      overline: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontSize: '0.75rem',
        lineHeight: 1.4,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
      button: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      '0 1px 2px 0 rgba(93, 79, 176, 0.05)',
      '0 1px 3px 0 rgba(93, 79, 176, 0.1), 0 1px 2px -1px rgba(93, 79, 176, 0.1)',
      '0 4px 6px -1px rgba(93, 79, 176, 0.1), 0 2px 4px -2px rgba(93, 79, 176, 0.1)',
      '0 10px 15px -3px rgba(93, 79, 176, 0.1), 0 4px 6px -4px rgba(93, 79, 176, 0.1)',
      '0 20px 25px -5px rgba(93, 79, 176, 0.1), 0 8px 10px -6px rgba(93, 79, 176, 0.1)',
      '0 25px 50px -12px rgba(93, 79, 176, 0.25)',
      isDark ? '0 35px 60px -12px rgba(0, 0, 0, 0.4)' : '0 35px 60px -12px rgba(93, 79, 176, 0.3)',
      isDark ? '0 45px 70px -12px rgba(0, 0, 0, 0.45)' : '0 45px 70px -12px rgba(93, 79, 176, 0.35)',
      isDark ? '0 55px 80px -12px rgba(0, 0, 0, 0.5)' : '0 55px 80px -12px rgba(93, 79, 176, 0.4)',
      isDark ? '0 65px 90px -12px rgba(0, 0, 0, 0.55)' : '0 65px 90px -12px rgba(93, 79, 176, 0.45)',
      isDark ? '0 75px 100px -12px rgba(0, 0, 0, 0.6)' : '0 75px 100px -12px rgba(93, 79, 176, 0.5)',
      isDark ? '0 85px 110px -12px rgba(0, 0, 0, 0.65)' : '0 85px 110px -12px rgba(93, 79, 176, 0.55)',
      isDark ? '0 95px 120px -12px rgba(0, 0, 0, 0.7)' : '0 95px 120px -12px rgba(93, 79, 176, 0.6)',
      isDark ? '0 105px 130px -12px rgba(0, 0, 0, 0.75)' : '0 105px 130px -12px rgba(93, 79, 176, 0.65)',
      isDark ? '0 115px 140px -12px rgba(0, 0, 0, 0.8)' : '0 115px 140px -12px rgba(93, 79, 176, 0.7)',
      isDark ? '0 125px 150px -12px rgba(0, 0, 0, 0.85)' : '0 125px 150px -12px rgba(93, 79, 176, 0.75)',
      isDark ? '0 135px 160px -12px rgba(0, 0, 0, 0.9)' : '0 135px 160px -12px rgba(93, 79, 176, 0.8)',
      isDark ? '0 145px 170px -12px rgba(0, 0, 0, 0.95)' : '0 145px 170px -12px rgba(93, 79, 176, 0.85)',
      isDark ? '0 155px 180px -12px rgba(0, 0, 0, 1)' : '0 155px 180px -12px rgba(93, 79, 176, 0.9)',
      isDark ? '0 165px 190px -12px rgba(0, 0, 0, 1)' : '0 165px 190px -12px rgba(93, 79, 176, 0.95)',
      isDark ? '0 175px 200px -12px rgba(0, 0, 0, 1)' : '0 175px 200px -12px rgba(93, 79, 176, 1)',
      isDark ? '0 185px 210px -12px rgba(0, 0, 0, 1)' : '0 185px 210px -12px rgba(93, 79, 176, 1)',
      isDark ? '0 195px 220px -12px rgba(0, 0, 0, 1)' : '0 195px 220px -12px rgba(93, 79, 176, 1)',
      isDark ? '0 205px 230px -12px rgba(0, 0, 0, 1)' : '0 205px 230px -12px rgba(93, 79, 176, 1)',
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@import': [
            'url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap")',
            'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap")',
            'url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap")'
          ],
          body: {
            fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            padding: '12px 28px',
            fontSize: '0.875rem',
            fontFamily: '"Outfit", "Inter", sans-serif',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'left 0.5s',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDark 
                ? '0 12px 24px rgba(0, 0, 0, 0.4)'
                : '0 12px 24px rgba(93, 79, 176, 0.3)',
              '&::before': {
                left: '100%',
              },
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${centerTheme.primary} 0%, ${centerTheme.secondary} 100%)`,
            boxShadow: isDark 
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(93, 79, 176, 0.3)',
            color: '#ffffff',
            '&:hover': {
              background: `linear-gradient(135deg, ${centerTheme.secondary} 0%, ${centerTheme.primary} 100%)`,
            },
          },
          outlined: {
            borderColor: centerTheme.primary,
            color: centerTheme.primary,
            borderWidth: 2,
            '&:hover': {
              borderColor: centerTheme.secondary,
              background: `rgba(${centerTheme.primary.replace('#', '')}, 0.05)`,
            },
          },
          text: {
            color: centerTheme.primary,
            '&:hover': {
              background: `rgba(${centerTheme.primary.replace('#', '')}, 0.05)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            background: isDark 
              ? 'linear-gradient(145deg, #1A1B2E 0%, #252640 100%)'
              : 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFF 100%)',
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(93, 79, 176, 0.1)',
            border: `1px solid ${centerTheme.border}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${centerTheme.primary} 0%, ${centerTheme.secondary} 50%, ${centerTheme.accent} 100%)`,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: isDark
                ? '0 20px 40px rgba(0, 0, 0, 0.4)'
                : '0 20px 40px rgba(93, 79, 176, 0.15)',
              '&::before': {
                opacity: 1,
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            background: isDark 
              ? 'linear-gradient(145deg, #1A1B2E 0%, #252640 100%)'
              : 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
          elevation1: {
            boxShadow: isDark 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
              : '0 2px 8px rgba(93, 79, 176, 0.1)',
          },
          elevation2: {
            boxShadow: isDark 
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(93, 79, 176, 0.1)',
          },
          elevation3: {
            boxShadow: isDark 
              ? '0 8px 24px rgba(0, 0, 0, 0.3)'
              : '0 8px 24px rgba(93, 79, 176, 0.1)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 600,
            fontSize: '0.75rem',
            fontFamily: '"Outfit", "Inter", sans-serif',
            height: 32,
            '& .MuiChip-label': {
              padding: '0 12px',
            },
          },
          filled: {
            background: `linear-gradient(135deg, ${centerTheme.primary} 0%, ${centerTheme.secondary} 100%)`,
            color: '#ffffff',
          },
          outlined: {
            borderColor: centerTheme.primary,
            color: centerTheme.primary,
            borderWidth: 2,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${centerTheme.primary} 0%, ${centerTheme.accent} 100%)`,
            fontWeight: 700,
            fontFamily: '"Outfit", sans-serif',
            boxShadow: isDark 
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(93, 79, 176, 0.2)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(93, 79, 176, 0.08)',
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            marginBottom: 4,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(93, 79, 176, 0.04)',
              transform: 'translateX(8px)',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: isDark 
              ? 'linear-gradient(180deg, #0F0F1A 0%, #1A1B2E 100%)'
              : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
            borderRight: `1px solid ${centerTheme.border}`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark 
              ? 'rgba(15, 15, 26, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${centerTheme.border}`,
            boxShadow: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              background: isDark 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.8)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.9)',
              },
              '&.Mui-focused': {
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 1)',
                boxShadow: `0 0 0 3px rgba(${centerTheme.primary.replace('#', '')}, 0.1)`,
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            background: isDark 
              ? 'linear-gradient(145deg, #1A1B2E 0%, #252640 100%)'
              : 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFF 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            background: isDark 
              ? 'rgba(26, 27, 46, 0.95)'
              : 'rgba(46, 46, 46, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontSize: '0.75rem',
            fontFamily: '"Inter", sans-serif',
          },
        },
      },
    },
  });
}