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
          height: 200,
          borderRadius: 4,
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="circular" width={56} height={56} />
            </Box>
            <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} />
            <Box mt="auto" pt={2}>
              <Skeleton variant="rectangular" width="100%" height={32} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
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
    if (card.trend.value > 0) return <TrendingUp sx={{ fontSize: 18, color: theme.palette.success.main }} />;
    if (card.trend.value < 0) return <TrendingDown sx={{ fontSize: 18, color: theme.palette.error.main }} />;
    return <TrendingFlat sx={{ fontSize: 18, color: theme.palette.text.secondary }} />;
  };

  const getTrendColor = () => {
    if (!card.trend) return theme.palette.text.secondary;
    if (card.trend.isPositive) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const IconComponent = card.icon ? iconMap[card.icon as keyof typeof iconMap] : Analytics;

  return (
    <Grow in timeout={600 + delay * 100}>
      <Card 
        sx={{ 
          height: 200,
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
          <Box display="flex" flexDirection="column" height="100%">
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography 
                variant="overline" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  fontSize: '0.75rem',
                  fontFamily: '"Inter", sans-serif',
                  textTransform: 'uppercase'
                }}
              >
                {card.title}
              </Typography>
              <Box
                className="metric-icon"
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: alpha(getColorValue(), 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getColorValue(),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <IconComponent sx={{ fontSize: 28 }} />
              </Box>
            </Box>

            {/* Value */}
            <Typography 
              variant="h3" 
              component="div" 
              className="metric-value"
              sx={{ 
                fontWeight: 800,
                background: getGradient(),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: '"Inter", "Manrope", sans-serif',
                lineHeight: 1.2,
              }}
            >
              {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
            </Typography>

            {/* Subtitle */}
            {card.subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2, 
                  lineHeight: 1.4,
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
                mt="auto"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: alpha(getTrendColor(), 0.1),
                  border: `1px solid ${alpha(getTrendColor(), 0.2)}`,
                }}
              >
                {getTrendIcon()}
                <Box sx={{ ml: 1.5, flex: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 700,
                      color: getTrendColor(),
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.875rem',
                      lineHeight: 1.2
                    }}
                  >
                    {card.trend.value > 0 ? '+' : ''}{card.trend.value.toFixed(1)}%
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.75rem'
                    }}
                  >
                    {card.trend.period}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
}
