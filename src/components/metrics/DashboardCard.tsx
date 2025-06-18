'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme
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
      return <TrendingUp sx={{ color: theme.palette.success.main }} />;
    } else if (card.trend.value < 0) {
      return <TrendingDown sx={{ color: theme.palette.error.main }} />;
    } else {
      return <TrendingFlat sx={{ color: theme.palette.grey[500] }} />;
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
      <Card sx={{ height: '100%', minHeight: 140 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box 
              sx={{ 
                height: 20, 
                bgcolor: 'grey.300', 
                borderRadius: 1,
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
            <Box 
              sx={{ 
                height: 32, 
                bgcolor: 'grey.300', 
                borderRadius: 1,
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
            <Box 
              sx={{ 
                height: 16, 
                bgcolor: 'grey.300', 
                borderRadius: 1,
                width: '60%',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%', 
        minHeight: 140,
        borderLeft: `4px solid ${getCardColor()}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Título */}
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {card.title}
          </Typography>

          {/* Valor principal */}
          <Typography 
            variant="h4" 
            component="div"
            sx={{ 
              fontWeight: 'bold',
              color: getCardColor(),
              lineHeight: 1.2
            }}
          >
            {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
          </Typography>

          {/* Subtítulo */}
          {card.subtitle && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {card.subtitle}
            </Typography>
          )}

          {/* Tendencia */}
          {card.trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              {getTrendIcon()}
              <Chip
                label={`${card.trend.value > 0 ? '+' : ''}${card.trend.value.toFixed(1)}%`}
                size="small"
                color={getTrendColor()}
                variant="outlined"
                sx={{ fontSize: '0.75rem', height: 24 }}
              />
              <Typography variant="caption" color="text.secondary">
                vs {card.trend.period}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
