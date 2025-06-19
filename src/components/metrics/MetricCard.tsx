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
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  People,
  EventNote,
  Warning,
  AssignmentTurnedIn,
  PriorityHigh,
  Analytics
} from '@mui/icons-material';
import { DashboardCard } from '@/types/metrics';

interface MetricCardProps {
  card: DashboardCard;
  loading?: boolean;
  delay?: number;
}

const iconMap = {
  people: People,
  event_note: EventNote,
  trending_up: Analytics,
  warning: Warning,
  assignment_turned_in: AssignmentTurnedIn,
  priority_high: PriorityHigh,
};

export default function MetricCard({ 
  card,
  loading = false,
  delay = 0
}: MetricCardProps) {
  const theme = useTheme();

  if (loading) {
    return (
      <Card 
        sx={{ 
          height: '100%',
          minHeight: 180,
          borderRadius: 4,
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="circular" width={48} height={48} />
            </Box>
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton variant="text" width="80%" height={16} />
            <Box sx={{ mt: 'auto' }}>
              <Skeleton variant="rectangular" width="100%" height={24} sx={{ borderRadius: 2 }} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const getColorValue = () => {
    switch (card.color) {
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
    if (!card.trend) return null;
    if (card.trend.value > 0) return <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />;
    if (card.trend.value < 0) return <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />;
    return <TrendingFlat sx={{ fontSize: 16, color: theme.palette.text.secondary }} />;
  };

  const getTrendColor = () => {
    if (!card.trend) return theme.palette.text.secondary;
    if (card.trend.isPositive) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const IconComponent = card.icon ? iconMap[card.icon as keyof typeof iconMap] : Analytics;

  // Formatear valor para que sea más compacto
  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  return (
    <Grow in timeout={600 + delay * 100}>
      <Card 
        sx={{ 
          height: '100%',
          minHeight: 180,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
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
            boxShadow: `0 20px 25px -5px ${alpha(getColorValue(), 0.15)}, 0 8px 10px -6px ${alpha(getColorValue(), 0.1)}`,
            '& .metric-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            },
            '& .metric-value': {
              transform: 'scale(1.05)',
            }
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography 
                variant="overline" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  fontSize: '0.75rem',
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.2
                }}
              >
                {card.title}
              </Typography>
              <Box
                className="metric-icon"
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
                <IconComponent sx={{ fontSize: 24 }} />
              </Box>
            </Box>

            {/* Value */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                className="metric-value"
                sx={{ 
                  fontWeight: 700,
                  background: getGradient(),
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: '"Inter", "Manrope", sans-serif',
                  lineHeight: 1,
                  fontSize: { xs: '1.75rem', sm: '2rem' }
                }}
              >
                {formatValue(card.value)}
              </Typography>
            </Box>

            {/* Subtitle */}
            {card.subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.3,
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.875rem'
                }}
              >
                {card.subtitle}
                            </Typography>
            )}

            {/* Trend */}
            {card.trend && (
              <Box 
                display="flex" 
                alignItems="center" 
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: alpha(getTrendColor(), 0.1),
                  border: `1px solid ${alpha(getTrendColor(), 0.15)}`,
                  mt: 'auto'
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
                    fontSize: '0.75rem'
                  }}
                >
                  {card.trend.value > 0 ? '+' : ''}{Math.abs(card.trend.value).toFixed(1)}% {card.trend.period}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Grow>
  );
}

