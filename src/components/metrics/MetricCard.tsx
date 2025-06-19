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
          aspectRatio: '1',
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <CardContent sx={{ p: 2, height: '100%' }}>
          <Stack spacing={1.5} sx={{ height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
            <Skeleton variant="text" width="50%" height={32} />
            <Skeleton variant="text" width="80%" height={14} />
            <Box sx={{ mt: 'auto' }}>
              <Skeleton variant="rectangular" width="100%" height={20} sx={{ borderRadius: 1 }} />
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
    if (card.trend.value > 0) return <TrendingUp sx={{ fontSize: 14, color: theme.palette.success.main }} />;
    if (card.trend.value < 0) return <TrendingDown sx={{ fontSize: 14, color: theme.palette.error.main }} />;
    return <TrendingFlat sx={{ fontSize: 14, color: theme.palette.text.secondary }} />;
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

  // Acortar título si es muy largo
  const getShortTitle = (title: string) => {
    const words = title.split(' ');
    if (words.length <= 2) return title;
    return words.slice(0, 2).join(' ');
  };

  return (
    <Grow in timeout={600 + delay * 100}>
      <Card 
        sx={{ 
          aspectRatio: '1',
          width: '100%',
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
        <CardContent sx={{ p: 2, height: '100%' }}>
          <Stack spacing={1} sx={{ height: '100%' }}>
            {/* Header compacto */}
            <Box display="flex" alignItems="flex-start" justifyContent="space-between">
              <Tooltip title={card.title} placement="top">
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    fontSize: '0.65rem',
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                    flex: 1,
                    mr: 1
                  }}
                >
                  {getShortTitle(card.title)}
                </Typography>
              </Tooltip>
              <Box
                className="metric-icon"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  background: alpha(getColorValue(), 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getColorValue(),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0,
                }}
              >
                <IconComponent sx={{ fontSize: 18 }} />
              </Box>
            </Box>

            {/* Value - centrado y prominente */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title={`Valor exacto: ${card.value}`} placement="top">
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
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: '"Inter", "Manrope", sans-serif',
                    lineHeight: 1,
                    fontSize: '1.5rem',
                    textAlign: 'center'
                  }}
                >
                  {formatValue(card.value)}
                </Typography>
              </Tooltip>
            </Box>

            {/* Subtitle compacto */}
            {card.subtitle && (
              <Box sx={{ textAlign: 'center' }}>
                <Tooltip title={card.subtitle} placement="bottom">
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      lineHeight: 1.2,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.65rem',
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
                justifyContent="center"
                sx={{
                  p: 0.5,
                  borderRadius: 1.5,
                  background: alpha(getTrendColor(), 0.08),
                  border: `1px solid ${alpha(getTrendColor(), 0.15)}`,
                  minHeight: 24
                }}
              >
                {getTrendIcon()}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    color: getTrendColor(),
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.6rem',
                    ml: 0.5
                  }}
                >
                  {card.trend.value > 0 ? '+' : ''}{Math.abs(card.trend.value).toFixed(0)}%
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Grow>
  );
}