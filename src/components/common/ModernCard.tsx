'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Box,
  Typography,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';

interface ModernCardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  gradient?: boolean;
  glassEffect?: boolean;
  elevation?: number;
  hover?: boolean;
  className?: string;
  sx?: any;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'glass' | 'gradient';
}

export default function ModernCard({
  children,
  title,
  subtitle,
  actions,
  gradient = false,
  glassEffect = false,
  elevation = 1,
  hover = true,
  className,
  sx,
  headerAction,
  variant = 'default',
}: ModernCardProps) {
  const theme = useTheme();

  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: 6,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #5D4FB0 0%, #A593F3 50%, #A5CAE6 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      ...(hover && {
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 20px 40px rgba(0, 0, 0, 0.4)'
            : '0 20px 40px rgba(93, 79, 176, 0.15)',
          '&::before': {
            opacity: 1,
          },
        },
      }),
    };

    switch (variant) {
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
        };
      
      case 'gradient':
        return {
          ...baseStyles,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #1A1B2E 0%, #252640 100%)'
            : 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFF 100%)',
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          background: 'transparent',
          border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        };
      
      default:
        return {
          ...baseStyles,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #1A1B2E 0%, #252640 100%)'
            : 'linear-gradient(145deg, #FFFFFF 0%, #FAFBFF 100%)',
        };
    }
  };

  return (
    <Fade in timeout={600}>
      <Card
        elevation={elevation}
        className={className}
        sx={{
          ...getCardStyles(),
          ...sx,
        }}
      >
        {(title || subtitle || headerAction) && (
          <CardHeader
            title={title && (
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: subtitle ? 0.5 : 0,
                }}
              >
                {title}
              </Typography>
            )}
            subheader={subtitle && (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </Typography>
            )}
            action={headerAction}
            sx={{
              pb: children ? 1 : 3,
            }}
          />
        )}
        
        {children && (
          <CardContent sx={{ pt: title || subtitle ? 0 : 3 }}>
            {children}
          </CardContent>
        )}
        
        {actions && (
          <CardActions sx={{ p: 3, pt: 0 }}>
            {actions}
          </CardActions>
        )}
      </Card>
    </Fade>
  );
}
