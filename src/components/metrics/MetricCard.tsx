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
  Tooltip,
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
          height: 160,
          borderRadius: 3,
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <CardContent sx={{ p: 2.5, height: '100%' }}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
            <Skeleton variant="text" width="50%" height={36} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={16} sx={{ mb: 1 }} />
            <Box mt="auto">
              <Skeleton variant="rectangular" width="100%" height={24} sx={{ borderRadius: 1.5 }} />
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
          height: 160,
          borderRadius: 3,
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
            height: 3,
            background: getGradient(),
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 20px -5px ${alpha(getColorValue(), 0.15)}, 0 6px 8px -4px ${alpha(getColorValue(), 0.1)}`,
            '& .metric-icon': {
              transform: 'scale(1.1)',
            },
            '& .metric-value': {
              transform: 'scale(1.02)',
            }
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <CardContent sx={{ p: 2.5, height: '100%' }}>
          <Box display="flex" flexDirection="column" height="100%" justifyContent="space-between">
            {/* Header compacto */}
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Tooltip title={card.title} placement="top">
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      fontSize: '0.7rem',
                      fontFamily: '"Inter", sans-serif',
                      textTransform: 'uppercase',
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {card.title}
                  </Typography>
                </Tooltip>
              </Box>
              <Box
                className="metric-icon"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: alpha(getColorValue(), 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getColorValue(),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0,
                  ml: 1
                }}
              >
                <IconComponent sx={{ fontSize: 20 }} />
              </Box>
            </Box>

            {/* Value - más compacto */}
            <Box sx={{ mb: 1 }}>
              <Tooltip title={`Valor exacto: ${card.value}`} placement="top">
                <Typography 
                  variant="h4" 
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
                    fontSize: '1.75rem'
                  }}
                >
                  {formatValue(card.value)}
                </Typography>
              </Tooltip>
            </Box>

            {/* Subtitle compacto */}
            {card.subtitle && (
              <Box sx={{ mb: 1.5 }}>
                <Tooltip title={card.subtitle} placement="bottom">
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      lineHeight: 1.3,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {card.subtitle}
                  </Typography>
                </Tooltip>
              </Box>
            )}

            {/* Trend compacto */}
            {card.trend && (
              <Box 
                display="flex" 
                alignItems="center" 
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: alpha(getTrendColor(), 0.08),
                  border: `1px solid ${alpha(getTrendColor(), 0.15)}`,
                  minHeight: 32
                }}
              >
                {getTrendIcon()}
                <Box sx={{ ml: 1, flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      color: getTrendColor(),
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.7rem',
                      lineHeight: 1.2
                    }}
                  >
                    {card.trend.value > 0 ? '+' : ''}{Math.abs(card.trend.value).toFixed(1)}%
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.65rem',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
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