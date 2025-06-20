import { createTheme, Theme } from '@mui/material/styles';
import { CenterTheme } from '@/types/center';

// Official CEO Dashboard Colors - Exact as specified
export const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  backgroundLight: '#F2EDEA',
  textPrimary: '#2E2E2E',
};

export const defaultLightTheme: CenterTheme = {
  primary: ceoBrandColors.primary,
  secondary: ceoBrandColors.secondary,
  accent: ceoBrandColors.accentBlue,
  background: ceoBrandColors.backgroundLight,
  surface: '#ffffff',
  text: ceoBrandColors.textPrimary,
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: ceoBrandColors.accentBlue,
};

export const defaultDarkTheme: CenterTheme = {
  primary: '#818cf8',
  secondary: '#94a3b8',
  accent: '#22d3ee',
  background: '#0f0f23',
  surface: '#1a1d29',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  border: '#334155',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
};

export function createCenterTheme(centerTheme: CenterTheme, mode: 'light' | 'dark'): Theme {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: centerTheme.primary,
        light: isDark ? '#a5b4fc' : '#8b7dd8',
        dark: isDark ? '#6366f1' : '#4a3d8a',
        contrastText: '#ffffff',
      },
      secondary: {
        main: centerTheme.secondary,
        light: isDark ? '#cbd5e1' : '#c4b5f7',
        dark: isDark ? '#64748b' : '#7c6bc9',
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
        light: isDark ? '#6ee7b7' : '#34d399',
        dark: isDark ? '#10b981' : '#059669',
      },
      warning: {
        main: centerTheme.warning,
        light: isDark ? '#fcd34d' : '#fbbf24',
        dark: isDark ? '#f59e0b' : '#d97706',
      },
      error: {
        main: centerTheme.error,
        light: isDark ? '#fca5a5' : '#f87171',
        dark: isDark ? '#ef4444' : '#dc2626',
      },
      info: {
        main: centerTheme.info,
        light: isDark ? '#93c5fd' : ceoBrandColors.accentBlue,
        dark: isDark ? '#3b82f6' : '#2563eb',
      },
      divider: centerTheme.border,
    },
    typography: {
      fontFamily: '"Neris", "Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Neris", "Poppins", sans-serif',
        fontWeight: 800, // Extra Bold
        fontSize: '3rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Neris", "Poppins", sans-serif',
        fontWeight: 700, // Bold
        fontSize: '2.25rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: '"Neris", "Poppins", sans-serif',
        fontWeight: 700, // Bold
        fontSize: '1.875rem',
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: '"Neris", "Poppins", sans-serif',
        fontWeight: 600, // Semibold
        fontSize: '1.5rem',
        lineHeight: 1.4,
        letterSpacing: '0em',
      },
      h5: {
        fontFamily: '"Neris", "Poppins", sans-serif',
        fontWeight: 600, // Semibold
        fontSize: '1.25rem',
        lineHeight: 1.5,
      },
      h6: {
        fontFamily: '"Neris", "Poppins", sans-serif',
        fontWeight: 600, // Semibold
        fontSize: '1.125rem',
        lineHeight: 1.5,
      },
      body1: {
        fontFamily: '"Neris", "Inter", sans-serif',
        fontSize: '1rem',
        lineHeight: 1.6,
        fontWeight: 400, // Regular
      },
      body2: {
        fontFamily: '"Neris", "Inter", sans-serif',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 400, // Regular
      },
      subtitle1: {
        fontFamily: '"Neris", "Inter", sans-serif',
        fontSize: '1rem',
        lineHeight: 1.5,
        fontWeight: 600, // Semibold
      },
      subtitle2: {
        fontFamily: '"Neris", "Inter", sans-serif',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 600, // Semibold
      },
      caption: {
        fontFamily: '"Neris", "Inter", sans-serif',
        fontSize: '0.75rem',
        lineHeight: 1.4,
        fontWeight: 300, // Light
      },
      overline: {
        fontFamily: '"Neris", "Inter", sans-serif',
        fontSize: '0.75rem',
        lineHeight: 1.4,
        fontWeight: 600, // Semibold
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '0 25px 50px -12px rgb(0 25 50 / 0.25)',
      '0 35px 60px -12px rgb(0 0 0 / 0.3)',
      '0 45px 70px -12px rgb(0 0 0 / 0.35)',
      '0 55px 80px -12px rgb(0 0 0 / 0.4)',
      '0 65px 90px -12px rgb(0 0 0 / 0.45)',
      '0 75px 100px -12px rgb(0 0 0 / 0.5)',
      '0 85px 110px -12px rgb(0 0 0 / 0.55)',
      '0 95px 120px -12px rgb(0 0 0 / 0.6)',
      '0 105px 130px -12px rgb(0 0 0 / 0.65)',
      '0 115px 140px -12px rgb(0 0 0 / 0.7)',
      '0 125px 150px -12px rgb(0 0 0 / 0.75)',
      '0 135px 160px -12px rgb(0 0 0 / 0.8)',
      '0 145px 170px -12px rgb(0 0 0 / 0.85)',
      '0 155px 180px -12px rgb(0 0 0 / 0.9)',
      '0 165px 190px -12px rgb(0 0 0 / 0.95)',
      '0 175px 200px -12px rgb(0 0 0 / 1)',
      '0 185px 210px -12px rgb(0 0 0 / 1)',
      '0 195px 220px -12px rgb(0 0 0 / 1)',
      '0 205px 230px -12px rgb(0 0 0 / 1)',
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@import': [
            'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap")',
            'url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap")'
          ],
          body: {
            fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600, // Semibold
            borderRadius: 12,
            padding: '10px 24px',
            fontSize: '0.875rem',
            fontFamily: '"Neris", "Inter", sans-serif',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${centerTheme.primary} 0%, ${isDark ? '#a5b4fc' : '#4a3d8a'} 100%)`,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            '&:hover': {
              background: `linear-gradient(135deg, ${isDark ? '#a5b4fc' : '#4a3d8a'} 0%, ${centerTheme.primary} 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            background: isDark 
              ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
            boxShadow: isDark
              ? '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)'
              : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            border: `1px solid ${centerTheme.border}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDark
                ? '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)'
                : '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            background: isDark 
              ? 'linear-gradient(145deg, #1a1d29 0%, #252a3a 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600, // Semibold
            fontSize: '0.75rem',
            fontFamily: '"Neris", "Inter", sans-serif',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${centerTheme.primary} 0%, ${centerTheme.accent} 100%)`,
            fontWeight: 700, // Bold
            fontFamily: '"Neris", sans-serif',
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
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            marginBottom: 4,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              transform: 'translateX(4px)',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: isDark 
              ? 'linear-gradient(180deg, #1a1d29 0%, #252a3a 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
            borderRight: `1px solid ${centerTheme.border}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark 
              ? 'rgba(26, 29, 41, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${centerTheme.border}`,
          },
        },
      },
    },
  });
}