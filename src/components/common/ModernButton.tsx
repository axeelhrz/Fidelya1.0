'use client';

import React from 'react';
import {
  Button,
  ButtonProps,
  useTheme,
  alpha,
  CircularProgress,
  Box,
} from '@mui/material';

interface ModernButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text' | 'gradient' | 'glass';
  loading?: boolean;
  gradient?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  glow?: boolean;
  pulse?: boolean;
}

export default function ModernButton({
  children,
  variant = 'contained',
  loading = false,
  gradient = 'primary',
  glow = false,
  pulse = false,
  disabled,
  sx,
  ...props
}: ModernButtonProps) {
  const theme = useTheme();

  const getGradientColors = () => {
    switch (gradient) {
      case 'primary':
        return 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, #A593F3 0%, #A5CAE6 100%)';
      case 'accent':
        return 'linear-gradient(135deg, #A5CAE6 0%, #D97DB7 100%)';
      case 'success':
        return `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`;
      case 'warning':
        return `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`;
      case 'error':
        return `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`;
      default:
        return 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)';
    }
  };

  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: 3,
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      textTransform: 'none' as const,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
      '&:hover::before': {
        left: '100%',
      },
      '&:hover': {
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(0px)',
      },
      ...(glow && {
        boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
        '&:hover': {
          boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.6)}`,
        },
      }),
      ...(pulse && {
        animation: 'pulse 2s infinite',
      }),
    };

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyles,
          background: getGradientColors(),
          color: '#ffffff',
          border: 'none',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(93, 79, 176, 0.3)',
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0, 0, 0, 0.4)'
              : '0 8px 24px rgba(93, 79, 176, 0.4)',
          },
          '&:disabled': {
            background: alpha(theme.palette.text.disabled, 0.12),
            color: theme.palette.text.disabled,
          },
        };

      case 'glass':
        return {
          ...baseStyles,
          background: theme.palette.mode === 'dark'
            ? 'rgba(26, 27, 46, 0.4)'
            : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.18)'}`,
          color: theme.palette.primary.main,
          '&:hover': {
            ...baseStyles['&:hover'],
            background: theme.palette.mode === 'dark'
              ? 'rgba(26, 27, 46, 0.6)'
              : 'rgba(255, 255, 255, 0.35)',
          },
        };

      case 'outlined':
        return {
          ...baseStyles,
          border: `2px solid ${theme.palette.primary.main}`,
          color: theme.palette.primary.main,
          background: 'transparent',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: alpha(theme.palette.primary.main, 0.08),
            borderColor: theme.palette.primary.dark,
          },
        };

      case 'text':
        return {
          ...baseStyles,
          color: theme.palette.primary.main,
          background: 'transparent',
          '&:hover': {
            ...baseStyles['&:hover'],
            background: alpha(theme.palette.primary.main, 0.08),
          },
        };

      default: // contained
        return {
          ...baseStyles,
          background: getGradientColors(),
          color: '#ffffff',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(93, 79, 176, 0.3)',
          '&:hover': {
            ...baseStyles['&:hover'],
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0, 0, 0, 0.4)'
              : '0 8px 24px rgba(93, 79, 176, 0.4)',
          },
        };
    }
  };

  return (
    <Button
      disabled={disabled || loading}
      sx={{
        ...getButtonStyles(),
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading && (
          <CircularProgress
            size={16}
            sx={{
              color: variant === 'outlined' || variant === 'text' 
                ? theme.palette.primary.main 
                : '#ffffff',
            }}
          />
        )}
        {children}
      </Box>
    </Button>
  );
}
