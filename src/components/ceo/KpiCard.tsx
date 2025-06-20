'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
  Grow,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Info,
  Assessment,
  TrendingUpRounded,
  BusinessCenter,
  Psychology,
  EventBusy,
  AccountBalance,
  Inventory,
  Receipt,
  Business,
} from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { CEOKPIData } from '@/types/ceo';

interface KpiCardProps {
  kpi: CEOKPIData;
  onDetailClick: (kpi: CEOKPIData) => void;
  delay?: number;
}

export default function KpiCard({ kpi, onDetailClick, delay = 0 }: KpiCardProps) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (iconName: string) => {
    const iconProps = { fontSize: 28 };
    switch (iconName) {
      case 'TrendingUp': return <TrendingUpRounded {...iconProps} />;
      case 'Assessment': return <Assessment {...iconProps} />;
      case 'Business': return <Business {...iconProps} />;
      case 'EventBusy': return <EventBusy {...iconProps} />;
      case 'Psychology': return <Psychology {...iconProps} />;
      case 'AccountBalance': return <AccountBalance {...iconProps} />;
      case 'Inventory': return <Inventory {...iconProps} />;
      case 'Receipt': return <Receipt {...iconProps} />;
      default: return <BusinessCenter {...iconProps} />;
    }
  };

  const getColorValue = () => {
    switch (kpi.color) {
      case 'primary': return theme.palette.primary.main;
      case 'secondary': return theme.palette.secondary.main;
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      case 'info': return theme.palette.info.main;
      default: return theme.palette.primary.main;
    }
  };

  const getSemaphoreColor = () => {
    switch (kpi.semaphore) {
      case 'green': return theme.palette.success.main;
      case 'amber': return theme.palette.warning.main;
      case 'red': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getTrendIcon = () => {
    if (kpi.trend.value > 0) return <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />;
    if (kpi.trend.value < 0) return <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />;
    return <TrendingFlat sx={{ fontSize: 16, color: theme.palette.text.secondary }} />;
  };

  const getTrendColor = () => {
    if (kpi.trend.isPositive) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const formatValue = (value: number, unit?: string) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    if (unit === '%') {
      return `${value}%`;
    }
    if (unit === 'x') {
      return `${value}x`;
    }
    return value.toLocaleString();
  };

  // Prepare sparkline data
  const sparklineData = kpi.sparklineData.map((value, index) => ({
    index,
    value
  }));

  return (
    <Grow in timeout={600 + delay * 100}>
      <Card 
        sx={{ 
          height: '100%', 
          minHeight: 220,
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
          border: `1px solid ${alpha(getColorValue(), 0.1)}`,
          cursor: 'pointer',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${getSemaphoreColor()} 0%, ${alpha(getSemaphoreColor(), 0.7)} 100%)`,
          },
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 25px -5px ${alpha(getColorValue(), 0.15)}, 0 8px 10px -6px ${alpha(getColorValue(), 0.15)}`,
            '& .kpi-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            },
            '& .kpi-value': {
              transform: 'scale(1.05)',
            },
            '& .sparkline-container': {
              opacity: 1,
            }
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onDetailClick(kpi)}
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box display="flex" flexDirection="column" height="100%">
            {/* Header with Semaphore */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography 
                  variant="overline" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    fontSize: '0.75rem',
                    fontFamily: '"Neris", sans-serif'
                  }}
                >
                  {kpi.title}
                </Typography>
                <Tooltip title={`Estado: ${kpi.semaphore}`}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: getSemaphoreColor(),
                      boxShadow: `0 0 8px ${alpha(getSemaphoreColor(), 0.5)}`,
                      animation: kpi.semaphore === 'red' ? 'pulse 2s infinite' : 'none',
                    }}
                  />
                </Tooltip>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  className="kpi-icon"
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
                  {getIcon(kpi.icon)}
                </Box>
                
                <Tooltip title="Ver detalles">
                  <IconButton
                    size="small"
                    sx={{
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <Info sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Value and Target */}
            <Box mb={2}>
              <Typography 
                variant="h3" 
                component="div" 
                className="kpi-value"
                sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${getColorValue()} 0%, ${alpha(getColorValue(), 0.8)} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: '"Neris", sans-serif',
                }}
              >
                {formatValue(kpi.value, kpi.unit)}
              </Typography>

              {kpi.target && (
                <Box sx={{ mb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Meta: {formatValue(kpi.target, kpi.unit)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((kpi.value / kpi.target) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (kpi.value / kpi.target) * 100)}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: alpha(getColorValue(), 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getColorValue(),
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Subtitle */}
            {kpi.subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2, 
                  lineHeight: 1.4,
                  fontFamily: '"Neris", sans-serif',
                }}
              >
                {kpi.subtitle}
              </Typography>
            )}

            {/* Sparkline */}
            <Box 
              className="sparkline-container"
              sx={{ 
                height: 40, 
                mb: 2,
                opacity: 0.7,
                transition: 'opacity 0.3s',
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getColorValue()}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3, fill: getColorValue() }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* Trend */}
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
                  fontFamily: '"Neris", sans-serif',
                }}
              >
                {kpi.trend.value > 0 ? '+' : ''}{kpi.trend.value.toFixed(1)}% {kpi.trend.period}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        {/* Pulse animation for critical items */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </Card>
    </Grow>
  );
}
