import { landingColors as landingColorsTheme } from '@/styles/theme/landing-colors';

import {
    Box,
    Drawer,
    ListItemButton,
    ListItemIcon,
    styled,
    alpha,
  } from "@mui/material";
  
  export const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: 280,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 280,
      boxSizing: 'border-box',
      border: 'none',
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.95)
        : theme.palette.background.paper,
      backdropFilter: 'blur(20px)',
      boxShadow: theme.palette.mode === 'dark'
        ? `0 0 24px ${alpha(theme.palette.common.black, 0.3)}`
        : `0 0 24px ${alpha(theme.palette.common.black, 0.1)}`,
      transition: theme.transitions.create(['background-color', 'box-shadow'], {
        duration: theme.transitions.duration.standard,
      }),
    },
  }));
  
  export const MenuSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    transition: theme.transitions.create('padding', {
      duration: theme.transitions.duration.shorter,
    }),
  }));
  
  export const MenuLabel = styled(Box)(({ theme }) => ({
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    letterSpacing: '0.5px',
    transition: theme.transitions.create(['color', 'margin'], {
      duration: theme.transitions.duration.shorter,
    }),
  }));
  
  export const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'active',
  })<{ active?: boolean }>(({ theme, active }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    marginBottom: 6,
    padding: theme.spacing(1.2, 2),
    transition: theme.transitions.create(
      ['background-color', 'color', 'padding', 'margin'],
      { duration: theme.transitions.duration.shorter }
    ),
    
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      transform: 'translateX(4px)',
    },
  
    ...(active && {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.16),
      },
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
      '& .MuiTypography-root': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    }),
  }));
  
  export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    minWidth: 36,
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(['color', 'margin'], {
      duration: theme.transitions.duration.shorter,
    }),
  }));

interface LandingColors {
    primary: { main: string; gradient: string };
    secondary: { main: string };
    text: { primary: string };
    background: { paper: string; gradient: string };
    divider?: string;
    lightGray?: string;
}

const landingColors: LandingColors = {
    primary: { main: landingColorsTheme.primary, gradient: 'linear-gradient(to right, #000000, #333333)' },
    secondary: { main: landingColorsTheme.secondary },
    text: { primary: '#000000' },
    background: { paper: '#ffffff', gradient: 'linear-gradient(to right, #ffffff, #eeeeee)' },
    divider: '#cccccc',
    lightGray: '#dddddd',
};

export const headerStyles = {
    appBar: (isScrolled: boolean) => ({
        top: { xs: 8, md: 16 },
        left: 0,
        right: 0,
        background: isScrolled
            ? `linear-gradient(to right, ${landingColors.background.paper} 0%, ${landingColors.background.paper} F2 100%)`
            : `linear-gradient(to right, ${landingColors.background.paper}E6, ${landingColors.background.paper}E6)`,
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        maxWidth: '96%',
        mx: 'auto',
        zIndex: 1200,
        transition: 'all 0.3s ease-in-out',
        border: '1px solid',
        borderColor: isScrolled
            ? (landingColors.divider || '#ccc')
            : (landingColors.lightGray || '#ddd'),
        boxShadow: isScrolled
            ? '0 4px 20px rgba(0, 0, 0, 0.08)'
            : '0 4px 30px rgba(0, 0, 0, 0.03)',
    }),

    toolbar: {
        px: 2,
        minHeight: { xs: 64, md: 72 },
        transition: 'all 0.3s ease-in-out',
    },

    logoContainer: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
    },

    logoText: {
        ml: 1.5,
        fontWeight: 500,
        display: { xs: 'none', md: 'inline' },
        background: `linear-gradient(to right, ${landingColors.primary.main}, ${landingColors.secondary.main})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '0.95rem',
    },

    navContainer: {
        display: { xs: 'none', md: 'flex' },
        gap: 3,
        mr: 4,
    },

    navLink: (isActive: boolean) => ({
        color: isActive ? landingColors.primary.main : landingColors.text.primary,
        fontWeight: 500,
        textTransform: 'none',
        position: 'relative',
        '&:hover': {
            color: landingColors.primary.main,
            backgroundColor: 'transparent',
            '&::after': {
                width: '100%',
            },
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: isActive ? '100%' : '0%',
            height: 2,
            backgroundColor: landingColors.primary.main,
            transition: 'width 0.3s ease-in-out',
            borderRadius: 1,
        },
    }),

    authButton: (variant: 'text' | 'contained') => ({
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        borderRadius: '9999px',
        ...(variant === 'contained' && {
            background: landingColors.primary.gradient,
            boxShadow: `0 4px 14px ${landingColors.primary.main}40`,
            '&:hover': {
                background: landingColors.primary.gradient,
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${landingColors.primary.main}60`
            }
        }),
        ...(variant === 'text' && {
            color: landingColors.text.primary,
            '&:hover': {
                backgroundColor: `${landingColors.primary.main}10`
            },
        }),
    }),

    mobileMenuButton: {
        color: landingColors.primary.main,
        '&:hover': {
            backgroundColor: `${landingColors.primary.main}10`,
        },
    },

    drawer: {
        width: 280,
        background: landingColors.background.gradient,
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    },

    drawerItem: (isActive: boolean) => ({
        color: isActive ? landingColors.primary.main : landingColors.text.primary,
        borderLeft: '3px solid',
        borderColor: isActive ? landingColors.primary.main : 'transparetn',
        '&:hover': {
            backgroundColor: `${landingColors.primary.main}10`,
        }
    }),
};