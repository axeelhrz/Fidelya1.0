'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Warning,
  Lightbulb,
} from '@mui/icons-material';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { CEODashboardState } from '@/types/ceo';

// Minimalist color palette
const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
};

interface ResumenTabProps {
  ceoMetrics: CEODashboardState;
}

export default function ResumenTab({ ceoMetrics }: ResumenTabProps) {
  const getIcon = (iconName: string) => {
    const iconProps = { sx: { fontSize: 24, color: colors.primary } };
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
      case 'green': return colors.success;
      case 'amber': return colors.warning;
      case 'red': return colors.error;
      default: return colors.secondary;
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
      {/* KPI Grid - Clean and minimal */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            color: colors.text,
            mb: 3,
          }}
        >
          Métricas Principales
        </Typography>
        
        <Grid container spacing={3}>
          {ceoMetrics.kpis.slice(0, 6).map((kpi) => (
            <Grid item xs={12} sm={6} lg={4} key={kpi.id}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: colors.surface,
                  border: `1px solid #e2e8f0`,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: colors.primary,
                    boxShadow: `0 4px 12px rgba(37, 99, 235, 0.1)`,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        color: colors.textSecondary,
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {kpi.title}
                    </Typography>
                    
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: `${getSemaphoreColor(kpi.semaphore)}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getIcon(kpi.icon)}
                    </Box>
                  </Box>

                  {/* Value */}
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 700,
                      color: colors.text,
                      mb: 1,
                    }}
                  >
                    {formatValue(kpi.value, kpi.unit)}
                  </Typography>

                  {/* Target Progress */}
                  {kpi.target && (
                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 400,
                            color: colors.textSecondary,
                          }}
                        >
                          Meta: {formatValue(kpi.target, kpi.unit)}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600,
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
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: '#f1f5f9',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getSemaphoreColor(kpi.semaphore),
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Subtitle */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      color: colors.textSecondary,
                      mb: 2,
                    }}
                  >
                    {kpi.subtitle}
                  </Typography>

                  {/* Trend */}
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: kpi.trend.isPositive ? `${colors.success}15` : `${colors.error}15`,
                    }}
                  >
                    {kpi.trend.isPositive ? (
                      <TrendingUp sx={{ fontSize: 16, color: colors.success, mr: 1 }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 16, color: colors.error, mr: 1 }} />
                    )}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        color: kpi.trend.isPositive ? colors.success : colors.error,
                      }}
                    >
                      {kpi.trend.value > 0 ? '+' : ''}{kpi.trend.value.toFixed(1)}% {kpi.trend.period}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Burn & Earn Trend Chart - Clean design */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          backgroundColor: colors.surface,
          border: `1px solid #e2e8f0`,
          borderRadius: 2,
          boxShadow: 'none',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                color: colors.text,
                mb: 1,
              }}
            >
              Ingresos vs Egresos (Últimos 14 días)
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: colors.textSecondary,
              }}
            >
              Análisis diario de flujo de caja
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={burnEarnChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="fecha" 
                stroke={colors.textSecondary}
                fontSize={12}
                fontFamily='"Inter", sans-serif'
              />
              <YAxis 
                stroke={colors.textSecondary}
                fontSize={12}
                fontFamily='"Inter", sans-serif'
              />
              <RechartsTooltip 
                contentStyle={{
                  backgroundColor: colors.surface,
                  border: `1px solid #e2e8f0`,
                  borderRadius: 8,
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="ingresos" 
                stackId="1"
                stroke={colors.primary}
                fill={`${colors.primary}30`}
                name="Ingresos"
              />
              <Area 
                type="monotone" 
                dataKey="egresos" 
                stackId="2"
                stroke={colors.error}
                fill={`${colors.error}30`}
                name="Egresos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Alertas y AI Insights - Clean layout */}
      <Grid container spacing={4}>
        {/* Alertas Críticas */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Warning sx={{ color: colors.error, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  Alertas Críticas
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Requieren atención inmediata
                </Typography>
              </Box>
            </Box>

            <Box>
              {ceoMetrics.criticalAlerts.slice(0, 3).map((alert) => (
                <Box
                  key={alert.id}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: `${colors.error}08`,
                    border: `1px solid ${colors.error}20`,
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600,
                      color: colors.text,
                      mb: 1,
                    }}
                  >
                    {alert.titulo}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      color: colors.textSecondary,
                      mb: 2,
                    }}
                  >
                    {alert.descripcion}
                  </Typography>
                  <Chip
                    label={alert.urgencia}
                    size="small"
                    sx={{
                      backgroundColor: colors.error,
                      color: 'white',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* AI Insight */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid #e2e8f0`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Lightbulb sx={{ color: colors.primary, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  AI Insight del Día
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
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
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    color: colors.text,
                    mb: 2,
                  }}
                >
                  {ceoMetrics.aiInsights[0].titulo}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
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
                      backgroundColor: colors.primary,
                      color: 'white',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label={`Impacto: ${ceoMetrics.aiInsights[0].impacto}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: colors.primary,
                      color: colors.primary,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    color: colors.textSecondary,
                  }}
                >
                  Acciones recomendadas: {ceoMetrics.aiInsights[0].accionesRecomendadas.join(', ')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}