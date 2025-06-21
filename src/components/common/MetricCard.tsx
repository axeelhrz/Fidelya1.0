'use client';

import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';
import ModernCard from './ModernCard';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  progress?: number;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  color = 'primary',
  progress,
  variant = 'default',
  loading = false,
}: MetricCardProps) {
  const theme = useTheme();

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 16 }} />;
      case 'flat':
        return <TrendingFlat sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      case 'flat':
        return theme.palette.text.secondary;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getColorValue = () => {
    switch (color) {
      case 'primary':
        return '#5D4FB0';
      case 'secondary':
        return '#A593F3';
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return '#A5CAE6';
      default:
        return '#5D4FB0';
    }
  };

  if (loading) {
    return (
      <ModernCard variant="glass">
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              height: 20,
              background: 'linear-gradient(90deg, transparent, rgba(93, 79, 176, 0.1), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 1,
              mb: 2,
            }}
          />
          <Box
            sx={{
              height: 32,
              background: 'linear-gradient(90deg, transparent, rgba(93, 79, 176, 0.1), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 1,
              mb: 1,
            }}
          />
          <Box
            sx={{
              height: 16,
              width: '60%',
              background: 'linear-gradient(90deg, transparent, rgba(93, 79, 176, 0.1), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 1,
            }}
          />
        </Box>
      </ModernCard>
    );
  }

  return (
    <ModernCard
      variant="gradient"
      sx={{
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${getColorValue()} 0%, ${alpha(getColorValue(), 0.5)} 100%)`,
        },
      }}
    >
      <Box sx={{ p: variant === 'compact' ? 2 : 3 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                color: 'text.secondary',
                mb: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant={variant === 'compact' ? 'h5' : 'h4'}
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: 'text.primary',
                lineHeight: 1.2,
                background: `linear-gradient(135deg, ${getColorValue()} 0%, ${alpha(getColorValue(), 0.7)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {value}
            </Typography>
          </Box>
          
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(getColorValue(), 0.1)} 0%, ${alpha(getColorValue(), 0.05)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getColorValue(),
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"Inter", sans-serif',
              color: 'text.secondary',
              mb: trend || trendValue ? 1 : 0,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {(trend || trendValue) && (
          <Stack direction="row" alignItems="center" spacing={1} mb={progress !== undefined ? 1 : 0}>
            {trend && (
              <Chip
                icon={getTrendIcon()}
                label={trendValue || ''}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  fontFamily: '"Outfit", sans-serif',
                  background: alpha(getTrendColor(), 0.1),
                  color: getTrendColor(),
                  border: `1px solid ${alpha(getTrendColor(), 0.2)}`,
                  '& .MuiChip-icon': {
                    color: getTrendColor(),
                  },
                }}
              />
            )}
          </Stack>
        )}

        {progress !== undefined && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Progreso
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  color: getColorValue(),
                  fontWeight: 600,
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(getColorValue(), 0.1),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${getColorValue()} 0%, ${alpha(getColorValue(), 0.8)} 100%)`,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </ModernCard>
  );
}
