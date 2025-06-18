'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';
import { DashboardCard as DashboardCardType } from '@/types/metrics';

interface DashboardCardProps {
  card: DashboardCardType;
  loading?: boolean;
}

export default function DashboardCard({ card, loading = false }: DashboardCardProps) {
  const theme = useTheme();

  const getTrendIcon = () => {
    if (!card.trend) return null;
    
    if (card.trend.value > 0) {
      return <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 16 }} />;
    } else if (card.trend.value < 0) {
      return <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 16 }} />;
    } else {
      return <TrendingFlat sx={{ color: theme.palette.grey[500], fontSize: 16 }} />;
    }
  };

  const getTrendColor = () => {
    if (!card.trend) return 'default';
    return card.trend.isPositive ? 'success' : 'error';
  };

  const getCardColor = () => {
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

  if (loading) {
    return (
      <Card sx={{ height: 160, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="70%" height={16} sx={{ mb: 1 }} />
          <Box sx={{ mt: 'auto' }}>
            <Skeleton variant="rounded" width={80} height={20} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: 160,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `4px solid ${getCardColor()}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Título */}
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            mb: 1,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: 1.2,
          }}
        >
          {card.title}
        </Typography>

        {/* Valor principal */}
        <Typography 
          variant="h4" 
          component="div"
          sx={{ 
            fontWeight: 700,
            color: getCardColor(),
            lineHeight: 1,
            mb: 1,
            fontSize: '1.75rem',
          }}
        >
          {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
        </Typography>

        {/* Subtítulo */}
        {card.subtitle && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.7rem',
              lineHeight: 1.2,
              mb: 'auto',
            }}
          >
            {card.subtitle}
          </Typography>
        )}

        {/* Tendencia */}
        {card.trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            {getTrendIcon()}
            <Chip
              label={`${card.trend.value > 0 ? '+' : ''}${card.trend.value.toFixed(1)}%`}
              size="small"
              color={getTrendColor()}
              variant="outlined"
              sx={{ 
                fontSize: '0.65rem', 
                height: 20,
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}