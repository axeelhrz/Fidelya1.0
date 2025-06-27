'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  Avatar,
  LinearProgress,
  IconButton,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ArrowForward,
  Remove,
} from '@mui/icons-material';

export interface UnifiedMetricProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
  delay?: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  progressValue?: number;
  badge?: string | number;
  description?: string;
}

const UnifiedMetricsCard: React.FC<UnifiedMetricProps> = ({
  title,
  value,
  change = 0,
  icon,
  color,
  gradient,
  delay = 0,
  subtitle,
  trend = 'neutral',
  onClick,
  loading = false,
  size = 'medium',
  variant = 'default',
  showProgress = true,
  progressValue,
  badge,
  description,
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      cardHeight: '140px',
      iconSize: 40,
      titleFontSize: '0.65rem',
      valueFontSize: '1.8rem',
      padding: 2,
    },
    medium: {
      cardHeight: '180px',
      iconSize: 56,
      titleFontSize: '0.7rem',
      valueFontSize: '2.2rem',
      padding: 3,
    },
    large: {
      cardHeight: '220px',
      iconSize: 72,
      titleFontSize: '0.75rem',
      valueFontSize: '2.8rem',
      padding: 4,
    },
  };

  const config = sizeConfig[size];
  const finalGradient = gradient || `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`;
  const calculatedProgressValue = progressValue !== undefined ? progressValue : Math.min(Math.abs(change) * 10, 100);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 16 }} />;
      default:
        return <Remove sx={{ fontSize: 16 }} />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatValue = (val: string | number) => {
    if (loading) return '...';
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: onClick ? -6 : -3,
        transition: { duration: 0.2 }
      }}
      style={{ height: '100%' }}
    >
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #f1f5f9',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: onClick ? 'pointer' : 'default',
          height: config.cardHeight,
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            borderColor: alpha(color, 0.3),
            boxShadow: `0 20px 60px -15px ${alpha(color, 0.25)}`,
            '& .metric-icon': {
              transform: 'scale(1.1) rotate(5deg)',
              background: finalGradient,
              color: 'white',
            },
            '& .metric-glow': {
              opacity: 1,
            },
            '& .metric-action': {
              opacity: 1,
              transform: 'scale(1)',
            }
          },
        }}
      >
        {/* Top glow effect */}
        <Box
          className="metric-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: finalGradient,
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Badge */}
        {badge && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
            }}
          >
            <Chip
              label={badge}
              size="small"
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 20,
              }}
            />
          </Box>
        )}
        
        <CardContent 
          sx={{ 
            p: config.padding, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Header Section */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Avatar
              className="metric-icon"
              sx={{
                width: config.iconSize,
                height: config.iconSize,
                bgcolor: alpha(color, 0.1),
                color: color,
                borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 6px 20px ${alpha(color, 0.2)}`,
              }}
            >
              {loading ? <CircularProgress size={config.iconSize * 0.4} sx={{ color: 'inherit' }} /> : icon}
            </Avatar>
            
            {/* Trend indicator */}
            {change !== 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {getTrendIcon()}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: getTrendColor(),
                    fontSize: '0.8rem'
                  }}
                >
                  {change > 0 ? '+' : ''}{change}%
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Content Section */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: '#94a3b8',
                  fontWeight: 700,
                  fontSize: config.titleFontSize,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  mb: 1,
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                  fontSize: config.valueFontSize,
                  letterSpacing: '-0.02em',
                  lineHeight: 0.9,
                  mb: subtitle || description ? 1 : 0,
                }}
              >
                {formatValue(value)}
              </Typography>
              
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    mb: description ? 0.5 : 0,
                  }}
                >
                  {subtitle}
                </Typography>
              )}

              {description && variant === 'detailed' && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94a3b8',
                    fontSize: '0.7rem',
                    lineHeight: 1.3,
                  }}
                >
                  {description}
                </Typography>
              )}
            </Box>
            
            {/* Footer Section */}
            <Box sx={{ mt: 'auto' }}>
              {/* Progress indicator */}
              {showProgress && (
                <Box sx={{ mb: onClick ? 2 : 0 }}>
                  <LinearProgress
                    variant="determinate"
                    value={loading ? 0 : calculatedProgressValue}
                    sx={{
                      height: 3,
                      borderRadius: 2,
                      bgcolor: alpha(color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>
              )}
              
              {/* Action button */}
              {onClick && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    className="metric-action"
                    size="small"
                    sx={{
                      color: color,
                      bgcolor: alpha(color, 0.1),
                      opacity: 0.7,
                      transform: 'scale(0.9)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(color, 0.2),
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <ArrowForward sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UnifiedMetricsCard;
