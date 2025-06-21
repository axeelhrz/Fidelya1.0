'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period?: string;
  };
  icon?: LucideIcon;
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  sparklineData?: number[];
  onClick?: () => void;
  loading?: boolean;
}

const KPICardProfessional: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  status = 'neutral',
  sparklineData,
  onClick,
  loading = false,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return {
          border: 'border-success',
          bg: 'bg-success-bg',
          text: 'text-success',
          accent: '#10B981',
        };
      case 'warning':
        return {
          border: 'border-warning',
          bg: 'bg-warning-bg',
          text: 'text-warning',
          accent: '#F59E0B',
        };
      case 'error':
        return {
          border: 'border-error',
          bg: 'bg-error-bg',
          text: 'text-error',
          accent: '#EF4444',
        };
      case 'info':
        return {
          border: 'border-info',
          bg: 'bg-info-bg',
          text: 'text-info',
          accent: '#3B82F6',
        };
      default:
        return {
          border: 'border-light',
          bg: 'bg-surface',
          text: 'text-primary',
          accent: '#2463EB',
        };
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-tertiary';
    
    switch (trend.direction) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-tertiary';
    }
  };

  const statusColors = getStatusColor();

  if (loading) {
    return (
      <Card 
        className="kpi-card loading-professional"
        sx={{ 
          height: '200px',
          cursor: 'default',
        }}
      >
        <CardContent>
          <Box className="animate-pulse space-y-4">
            <Box className="h-4 bg-surface-elevated rounded w-3/4" />
            <Box className="h-8 bg-surface-elevated rounded w-1/2" />
            <Box className="h-3 bg-surface-elevated rounded w-2/3" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <Card 
        className={`kpi-card ${status} hover-lift-subtle`}
        sx={{ 
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(135deg, ${statusColors.accent} 0%, ${statusColors.accent}CC 100%)`,
            opacity: 0,
            transition: 'opacity 0.4s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
        }}
      >
        <CardContent sx={{ padding: '2rem 1.5rem' }}>
          {/* Header */}
          <Box className="flex-between mb-4">
            <Typography 
              variant="body2" 
              className="text-secondary font-medium"
              sx={{ 
                fontFamily: 'var(--font-family-inter)',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
            {Icon && (
              <Box 
                className={`p-2 rounded-lg ${statusColors.bg}`}
                sx={{ 
                  backgroundColor: `${statusColors.accent}10`,
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: statusColors.accent }}
                />
              </Box>
            )}
          </Box>

          {/* Value */}
          <Box className="mb-3">
            <Typography 
              variant="h3" 
              className="text-display-professional"
              sx={{ 
                fontFamily: 'var(--font-family-space-grotesk)',
                fontSize: '2.25rem',
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                className="text-tertiary mt-1"
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Trend */}
          {trend && (
            <Box className="flex items-center justify-between">
              <Box className={`flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <Typography 
                  variant="body2" 
                  className="font-medium"
                  sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </Typography>
                {trend.period && (
                  <Typography 
                    variant="caption" 
                    className="text-tertiary"
                    sx={{ fontSize: '0.7rem' }}
                  >
                    {trend.period}
                  </Typography>
                )}
              </Box>
              
              {status !== 'neutral' && (
                <Chip
                  size="small"
                  label={status}
                  sx={{
                    backgroundColor: `${statusColors.accent}15`,
                    color: statusColors.accent,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    height: '20px',
                    '& .MuiChip-label': {
                      padding: '0 6px',
                    },
                  }}
                />
              )}
            </Box>
          )}

          {/* Sparkline placeholder */}
          {sparklineData && sparklineData.length > 0 && (
            <Box className="mt-4 h-8 flex items-end space-x-1">
              {sparklineData.slice(-12).map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(point / Math.max(...sparklineData)) * 100}%` }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  className="flex-1 rounded-sm"
                  style={{ 
                    backgroundColor: `${statusColors.accent}40`,
                    minHeight: '2px',
                  }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KPICardProfessional;
