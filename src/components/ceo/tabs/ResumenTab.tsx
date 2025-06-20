'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Business,
  EventBusy,
  Psychology,
  AccountBalance,
  Inventory,
  Receipt,
  Info,
  Lightbulb,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { motion } from 'framer-motion';
import { CEODashboardState } from '@/types/ceo';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

interface ResumenTabProps {
  ceoMetrics: CEODashboardState;
}

export default function ResumenTab({ ceoMetrics }: ResumenTabProps) {
  const theme = useTheme();

  const getIcon = (iconName: string) => {
    const iconProps = { sx: { fontSize: 32 } };
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp {...iconProps} />;
      case 'Assessment': return <Assessment {...iconProps} />;
      case 'Business': return <Business {...iconProps} />;
      case 'EventBusy': return <EventBusy {...iconProps} />;
      case 'Psychology': return <Psychology {...iconProps} />;
      case 'AccountBalance': return <AccountBalance {...iconProps} />;
      case 'Inventory': return <Inventory {...iconProps} />;
      case 'Receipt': return <Receipt {...iconProps} />;
      default: return <Assessment {...iconProps} />;
    }
  };

  const getSemaphoreColor = (semaphore: string) => {
    switch (semaphore) {
      case 'green': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'red': return '#ef4444';
      default: return ceoBrandColors.text;
    }
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

  // Prepare burn & earn chart data
  const burnEarnChartData = ceoMetrics.burnEarnData.slice(-14).map(item => ({
    fecha: new Date(item.fecha).getDate(),
    ingresos: item.ingresos,
    egresos: item.egresos,
  }));

  return (
    <Box>
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: `linear-gradient(135deg, ${ceoBrandColors.primary} 0%, ${ceoBrandColors.secondary} 100%)`,
            color: 'white',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3,
            }
          }}
        >
          <Box position="relative" zIndex={1}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600, // Semibold
                mb: 1,
              }}
            >
              📊 Resumen Ejecutivo
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 300, // Light
                opacity: 0.9,
                mb: 2,
              }}
            >
              Vista general de métricas clave y rendimiento del centro
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: '"Neris", sans-serif',
                fontWeight: 300, // Light
                opacity: 0.8,
                maxWidth: '60%',
              }}
            >
              Su liderazgo impulsa la excelencia en salud mental. Cada métrica refleja el impacto de su visión estratégica.
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* KPI Grid - 6 tarjetas principales */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600, // Semibold
            color: ceoBrandColors.text,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          🎯 KPI Dashboard - Métricas Ejecutivas
        </Typography>
        
        <Grid container spacing={3}>
          {ceoMetrics.kpis.slice(0, 6).map((kpi, index) => (
            <Grid item xs={12} sm={6} lg={4} key={kpi.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 240,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(getSemaphoreColor(kpi.semaphore), 0.2)}`,
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: getSemaphoreColor(kpi.semaphore),
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 25px -5px ${alpha(getSemaphoreColor(kpi.semaphore), 0.15)}`,
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
                          sx={{ 
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 600, // Semibold
                            color: alpha(ceoBrandColors.text, 0.7),
                            letterSpacing: '0.1em',
                          }}
                        >
                          {kpi.title}
                        </Typography>
                        
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            background: alpha(getSemaphoreColor(kpi.semaphore), 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getSemaphoreColor(kpi.semaphore),
                          }}
                        >
                          {getIcon(kpi.icon)}
                        </Box>
                      </Box>

                      {/* Value */}
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 600, // Semibold
                          color: ceoBrandColors.text,
                          mb: 1,
                        }}
                      >
                        {formatValue(kpi.value, kpi.unit)}
                      </Typography>

                      {/* Target Progress */}
                      {kpi.target && (
                        <Box sx={{ mb: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: '"Neris", sans-serif',
                                fontWeight: 300, // Light
                                color: alpha(ceoBrandColors.text, 0.6),
                              }}
                            >
                              Meta: {formatValue(kpi.target, kpi.unit)}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: '"Neris", sans-serif',
                                fontWeight: 600, // Semibold
                                color: getSemaphoreColor(kpi.semaphore),
                              }}
                            >
                              {Math.round((kpi.value / kpi.target) * 100)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, (kpi.value / kpi.target) * 100)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: alpha(getSemaphoreColor(kpi.semaphore), 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getSemaphoreColor(kpi.semaphore),
                                borderRadius: 3,
                              }
                            }}
                          />
                        </Box>
                      )}

                      {/* Subtitle */}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Neris", sans-serif',
                          fontWeight: 300, // Light
                          color: alpha(ceoBrandColors.text, 0.6),
                          mb: 2,
                          flex: 1,
                        }}
                      >
                        {kpi.subtitle}
                      </Typography>

                      {/* Sparkline */}
                      <Box sx={{ height: 40, mb: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={kpi.sparklineData.map((value, idx) => ({ index: idx, value }))}>
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={getSemaphoreColor(kpi.semaphore)}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 3, fill: getSemaphoreColor(kpi.semaphore) }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>

                      {/* Trend */}
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: alpha(kpi.trend.isPositive ? '#10b981' : '#ef4444', 0.1),
                        }}
                      >
                        {kpi.trend.isPositive ? (
                          <TrendingUp sx={{ fontSize: 16, color: '#10b981', mr: 1 }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 16, color: '#ef4444', mr: 1 }} />
                        )}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: '"Neris", sans-serif',
                            fontWeight: 600, // Semibold
                            color: kpi.trend.isPositive ? '#10b981' : '#ef4444',
                          }}
                        >
                          {kpi.trend.value > 0 ? '+' : ''}{kpi.trend.value.toFixed(1)}% {kpi.trend.period}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Burn & Earn Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="between" mb={3}>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 600, // Semibold
                  color: ceoBrandColors.text,
                  mb: 1,
                }}
              >
                📈 Tendencia Ingresos vs Egresos (Últimos 14 días)
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: '"Neris", sans-serif',
                  fontWeight: 300, // Light
                  color: alpha(ceoBrandColors.text, 0.6),
                }}
              >
                Análisis diario de flujo de caja y rentabilidad operativa
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burnEarnChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(ceoBrandColors.text, 0.1)} />
                <XAxis 
                  dataKey="fecha" 
                  stroke={alpha(ceoBrandColors.text, 0.6)}
                  fontSize={12}
                  fontFamily='"Neris", sans-serif'
                />
                <YAxis 
                  stroke={alpha(ceoBrandColors.text, 0.6)}
                  fontSize={12}
                  fontFamily='"Neris", sans-serif'
                />
                <RechartsTooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: `1px solid ${alpha(ceoBrandColors.primary, 0.2)}`,
                    borderRadius: 8,
                    fontFamily: '"Neris", sans-serif',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ingresos" 
                  stackId="1"
                  stroke={ceoBrandColors.primary}
                  fill={alpha(ceoBrandColors.primary, 0.3)}
                  name="Ingresos"
                />
                <Area 
                  type="monotone" 
                  dataKey="egresos" 
                  stackId="2"
                  stroke={ceoBrandColors.accentPink}
                  fill={alpha(ceoBrandColors.accentPink, 0.3)}
                  name="Egresos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </motion.div>

      {/* Alertas Críticas y AI Insights */}
      <Grid container spacing={4}>
        {/* Alertas Críticas */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Paper
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha('#ef4444', 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Warning sx={{ color: '#ef4444', fontSize: 28 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    🚨 Alertas Críticas
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    Requieren atención inmediata
                  </Typography>
                </Box>
              </Box>

              <Box>
                {ceoMetrics.criticalAlerts.slice(0, 3).map((alert, index) => (
                  <Box
                    key={alert.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      background: alpha('#ef4444', 0.05),
                      border: `1px solid ${alpha('#ef4444', 0.1)}`,
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600, // Semibold
                        color: ceoBrandColors.text,
                        mb: 0.5,
                      }}
                    >
                      {alert.titulo}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 300, // Light
                        color: alpha(ceoBrandColors.text, 0.7),
                        mb: 1,
                      }}
                    >
                      {alert.descripcion}
                    </Typography>
                    <Chip
                      label={alert.urgencia}
                      size="small"
                      sx={{
                        background: '#ef4444',
                        color: 'white',
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600, // Semibold
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* AI Insight Destacado */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Paper
              sx={{
                p: 4,
                background: `linear-gradient(135deg, ${alpha(ceoBrandColors.accentBlue, 0.1)} 0%, ${alpha(ceoBrandColors.secondary, 0.1)} 100%)`,
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `1px solid ${alpha(ceoBrandColors.accentBlue, 0.2)}`,
                height: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Lightbulb sx={{ color: ceoBrandColors.accentBlue, fontSize: 28 }} />
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                    }}
                  >
                    🤖 AI Insight del Día
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    Sugerencia inteligente basada en datos
                  </Typography>
                </Box>
              </Box>

              {ceoMetrics.aiInsights.length > 0 && (
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600, // Semibold
                      color: ceoBrandColors.text,
                      mb: 2,
                    }}
                  >
                    {ceoMetrics.aiInsights[0].titulo}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.8),
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {ceoMetrics.aiInsights[0].descripcion}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Chip
                      label={`Confianza: ${ceoMetrics.aiInsights[0].confianza}%`}
                      size="small"
                      sx={{
                        background: ceoBrandColors.accentBlue,
                        color: 'white',
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600, // Semibold
                      }}
                    />
                    <Chip
                      label={`Impacto: ${ceoMetrics.aiInsights[0].impacto}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: ceoBrandColors.accentBlue,
                        color: ceoBrandColors.accentBlue,
                        fontFamily: '"Neris", sans-serif',
                        fontWeight: 600, // Semibold
                      }}
                    />
                  </Box>

                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 300, // Light
                      color: alpha(ceoBrandColors.text, 0.6),
                    }}
                  >
                    💡 Acciones recomendadas: {ceoMetrics.aiInsights[0].accionesRecomendadas.join(', ')}
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
