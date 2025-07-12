'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Target,
  CheckCircle,
  Heart
} from 'lucide-react';
import { AnalyticsMetric } from '@/types/analytics';

interface KPICardsTherapistProps {
  metrics: AnalyticsMetric[];
  loading?: boolean;
}

export default function KPICardsTherapist({ metrics, loading = false }: KPICardsTherapistProps) {
  const getIcon = (metricId: string) => {
    switch (metricId) {
      case 'total-patients': return Users;
      case 'active-sessions': return Calendar;
      case 'avg-sessions': return TrendingUp;
      case 'active-alerts': return AlertTriangle;
      case 'follow-up-rate': return Target;
      case 'completion-rate': return CheckCircle;
      default: return Heart;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      case 'info': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      case 'stable': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        {[...Array(6)].map((_, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(229, 231, 235, 0.6)',
              height: 160
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#F3F4F6',
                  mr: 2
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    height: 20,
                    backgroundColor: '#F3F4F6',
                    borderRadius: 1,
                    mb: 1
                  }}
                />
                <Box
                  sx={{
                    height: 16,
                    backgroundColor: '#F3F4F6',
                    borderRadius: 1,
                    width: '60%'
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                height: 32,
                backgroundColor: '#F3F4F6',
                borderRadius: 1,
                mb: 2
              }}
            />
            <Box
              sx={{
                height: 16,
                backgroundColor: '#F3F4F6',
                borderRadius: 1,
                width: '40%'
              }}
            />
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3,
        mb: 4
      }}
    >
      {metrics.map((metric, index) => {
        const IconComponent = getIcon(metric.id);
        const statusColor = getStatusColor(metric.status);
        const trendColor = getTrendColor(metric.trend);

        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                height: '100%'
              }}
            >
              {/* Efecto de fondo */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 80,
                  height: 80,
                  background: `${statusColor}08`,
                  borderRadius: '50%'
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header con icono y trend */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${statusColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${statusColor}20`
                    }}
                  >
                    <IconComponent size={20} color={statusColor} />
                  </Box>
                  <Chip
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>{getTrendIcon(metric.trend)}</span>
                        <span>{metric.change ? `${metric.change > 0 ? '+' : ''}${metric.change}%` : metric.trend}</span>
                      </Box>
                    }
                    size="small"
                    sx={{
                      backgroundColor: `${trendColor}15`,
                      color: trendColor,
                      border: `1px solid ${trendColor}20`,
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>

                {/* Valor principal */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#1C1E21',
                    mb: 0.5,
                    fontFamily: 'Space Grotesk, sans-serif',
                    lineHeight: 1.2
                  }}
                >
                  {metric.value}
                  {metric.unit && (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: '#6B7280',
                        fontWeight: 400,
                        ml: 0.5
                      }}
                    >
                      {metric.unit}
                    </Typography>
                  )}
                </Typography>

                {/* Nombre de la métrica */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6B7280',
                    fontWeight: 500,
                    mb: 1
                  }}
                >
                  {metric.name}
                </Typography>

                {/* Progreso hacia el objetivo */}
                {metric.target && typeof metric.value === 'number' && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        Objetivo: {metric.target}{metric.unit}
                      </Typography>
                      <Typography variant="caption" sx={{ color: statusColor, fontWeight: 600 }}>
                        {Math.round((metric.value / metric.target) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (metric.value / metric.target) * 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: `${statusColor}15`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: statusColor,
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Sparkline (si está disponible) */}
                {metric.sparklineData && metric.sparklineData.length > 0 && (
                  <Box sx={{ mt: 2, height: 40, display: 'flex', alignItems: 'end', gap: 0.5 }}>
                    {metric.sparklineData.map((value, idx) => {
                      const maxValue = Math.max(...metric.sparklineData!);
                      const height = (value / maxValue) * 30;
                      return (
                        <Box
                          key={idx}
                          sx={{
                            flex: 1,
                            height: `${height}px`,
                            backgroundColor: `${statusColor}40`,
                            borderRadius: 0.5,
                            transition: 'all 0.3s ease'
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              </Box>

              {/* Tooltip con descripción */}
              <Tooltip title={metric.description} placement="top">
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'help'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.625rem',
                      color: '#6B7280',
                      fontWeight: 600
                    }}
                  >
                    ?
                  </Typography>
                </Box>
              </Tooltip>
            </Paper>
          </motion.div>
        );
      })}
    </Box>
  );
}