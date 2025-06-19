'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Skeleton,
  alpha,
  Grow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  loading?: boolean;
  delay?: number;
}

export default function DashboardCard({ 
  title,
  value,
  icon,
  color = 'primary',
  subtitle,
  trend,
  loading = false,
  delay = 0
}: DashboardCardProps) {
  const theme = useTheme();

  if (loading) {
    return (
      <Card 
        sx={{ 
          height: '100%', 
          minHeight: 180,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="circular" width={48} height={48} />
            </Box>
            <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} />
            <Box mt="auto" pt={2}>
              <Skeleton variant="text" width="50%" height={16} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const getColorValue = () => {
    switch (color) {
      case 'primary': return theme.palette.primary.main;
      case 'secondary': return theme.palette.secondary.main;
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      case 'info': return theme.palette.info.main;
      default: return theme.palette.primary.main;
    }
  };

  const getGradient = () => {
    const baseColor = getColorValue();
    const lightColor = alpha(baseColor, 0.8);
    return `linear-gradient(135deg, ${baseColor} 0%, ${lightColor} 100%)`;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />;
    if (trend.value < 0) return <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />;
    return <TrendingFlat sx={{ fontSize: 16, color: theme.palette.text.secondary }} />;
  };

  const getTrendColor = () => {
    if (!trend) return theme.palette.text.secondary;
    if (trend.isPositive) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  return (
    <Grow in timeout={600 + delay * 100}>
      <Card 
        sx={{ 
          height: '100%', 
          minHeight: 180,
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
          border: `1px solid ${alpha(getColorValue(), 0.1)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: getGradient(),
          },
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 25px -5px ${alpha(getColorValue(), 0.1)}, 0 8px 10px -6px ${alpha(getColorValue(), 0.1)}`,
            '& .stat-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            },
            '& .stat-value': {
              transform: 'scale(1.05)',
            }
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box display="flex" flexDirection="column" height="100%">
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography 
                variant="overline" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  fontSize: '0.75rem',
                  fontFamily: '"Inter", sans-serif'
                }}
              >
                {title}
              </Typography>
              <Box
                className="stat-icon"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  background: alpha(getColorValue(), 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getColorValue(),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {icon}
              </Box>
            </Box>

            {/* Value */}
            <Typography 
              variant="h3" 
              component="div" 
              className="stat-value"
              sx={{ 
                fontWeight: 700,
                background: getGradient(),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>

            {/* Subtitle */}
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2, 
                  lineHeight: 1.4,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {subtitle}
              </Typography>
            )}

            {/* Trend */}
            {trend && (
              <Box 
                display="flex" 
                alignItems="center" 
                mt="auto"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: alpha(getTrendColor(), 0.1),
                }}
              >
                {getTrendIcon()}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 1, 
                    fontWeight: 600,
                    color: getTrendColor(),
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {trend.label}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
}