'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  EventNote,
  Psychology,
  Star
} from '@mui/icons-material';
import { DashboardMetrics } from '@/types/metrics';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExecutiveSummaryProps {
  metrics: DashboardMetrics;
  comparison?: {
    totalActivePatients: { current: number; previous: number; change: number };
    totalSessions: { current: number; previous: number; change: number };
    followUpRate: { current: number; previous: number; change: number };
  };
  loading?: boolean;
}

export default function ExecutiveSummary({ metrics, comparison, loading = false }: ExecutiveSummaryProps) {
  const theme = useTheme();

  // Calcular métricas clave
  const sessionCompletionRate = metrics.totalSessions > 0 
    ? ((metrics.totalSessions - (metrics.highRiskPatients + metrics.mediumRiskPatients)) / metrics.totalSessions) * 100
    : 0;

  const patientEngagementScore = metrics.totalActivePatients > 0
    ? (metrics.followUpRate + sessionCompletionRate) / 2
    : 0;

  const centerEfficiencyScore = Math.min(100, 
    (metrics.averageSessionsPerPatient * 20) + 
    (metrics.followUpRate * 0.5) + 
    (sessionCompletionRate * 0.3)
  );

  const getTrendIcon = (change: number) => {
    return change >= 0 ? 
      <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 16 }} /> :
      <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 16 }} />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    if (score >= 40) return 'Regular';
    return 'Necesita atención';
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Resumen Ejecutivo
          </Typography>
          <Box sx={{ mt: 2 }}>
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ width: '60%', height: 20, bgcolor: 'grey.300', borderRadius: 1 }} />
                  <Box sx={{ width: '20%', height: 20, bgcolor: 'grey.300', borderRadius: 1 }} />
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.300', borderRadius: 1 }} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Resumen Ejecutivo
          </Typography>
          <Chip
            label={format(new Date(), "MMMM yyyy", { locale: es })}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Puntuación general del centro */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Puntuación General del Centro
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: getScoreColor(centerEfficiencyScore), fontSize: 20 }} />
                <Typography variant="h6" sx={{ color: getScoreColor(centerEfficiencyScore) }}>
                  {centerEfficiencyScore.toFixed(0)}/100
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={centerEfficiencyScore}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(getScoreColor(centerEfficiencyScore), 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: getScoreColor(centerEfficiencyScore),
                  borderRadius: 4
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {getScoreLabel(centerEfficiencyScore)}
            </Typography>
          </Box>

          {/* Métricas clave */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              '& > *': {
                flex: '1 1 250px',
                minWidth: '250px'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mr: 2 }}>
                <People />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">Pacientes Activos</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{metrics.totalActivePatients}</Typography>
                  {comparison && (
                    <>
                      {getTrendIcon(comparison.totalActivePatients.change)}
                      <Typography variant="caption" color="text.secondary">
                        {comparison.totalActivePatients.change > 0 ? '+' : ''}{comparison.totalActivePatients.change.toFixed(1)}%
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', mr: 2 }}>
                <EventNote />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">Sesiones Realizadas</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{metrics.totalSessions}</Typography>
                  {comparison && (
                    <>
                      {getTrendIcon(comparison.totalSessions.change)}
                      <Typography variant="caption" color="text.secondary">
                        {comparison.totalSessions.change > 0 ? '+' : ''}{comparison.totalSessions.change.toFixed(1)}%
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Tasa de compromiso del paciente */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">Compromiso del Paciente</Typography>
              <Typography variant="body2" color="text.secondary">
                {patientEngagementScore.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={patientEngagementScore}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: theme.palette.info.main,
                  borderRadius: 3
                }
              }}
            />
          </Box>

          {/* Tasa de seguimiento */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">Tasa de Seguimiento</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {metrics.followUpRate.toFixed(1)}%
                </Typography>
                {comparison && (
                  <>
                    {getTrendIcon(comparison.followUpRate.change)}
                    <Typography variant="caption" color="text.secondary">
                      {comparison.followUpRate.change > 0 ? '+' : ''}{comparison.followUpRate.change.toFixed(1)}%
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={metrics.followUpRate}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: theme.palette.secondary.main,
                  borderRadius: 3
                }
              }}
            />
          </Box>

          {/* Tiempo promedio entre sesiones */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', mr: 2 }}>
              <Psychology />
            </Avatar>
            <Box>
              <Typography variant="subtitle2">Tiempo Promedio Entre Sesiones</Typography>
              <Typography variant="h6">
                {metrics.averageTimeBetweenSessions.toFixed(0)} días
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Promedio de {metrics.averageSessionsPerPatient.toFixed(1)} sesiones por paciente
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}