'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  TrendingDown,
  Schedule,
  Group,
  Assessment,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { DashboardMetrics } from '@/types/metrics';

interface PerformanceMetricsProps {
  metrics: DashboardMetrics;
  loading?: boolean;
}

export default function PerformanceMetrics({ metrics, loading = false }: PerformanceMetricsProps) {
  const theme = useTheme();

  // Calcular métricas de rendimiento
  const totalRiskPatients = metrics.highRiskPatients + metrics.mediumRiskPatients + metrics.lowRiskPatients;
  const riskDistribution = totalRiskPatients > 0 ? {
    high: (metrics.highRiskPatients / totalRiskPatients) * 100,
    medium: (metrics.mediumRiskPatients / totalRiskPatients) * 100,
    low: (metrics.lowRiskPatients / totalRiskPatients) * 100
  } : { high: 0, medium: 0, low: 0 };

  // Top motivos de consulta
  const topMotives = Object.entries(metrics.motivesDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Distribución de tipos de sesión
  const sessionTypes = Object.entries(metrics.sessionTypeDistribution)
    .sort(([, a], [, b]) => b - a);

  const getRiskColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
    }
  };

  const getRiskLabel = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'Alto Riesgo';
      case 'medium': return 'Riesgo Medio';
      case 'low': return 'Bajo Riesgo';
    }
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <Card>
              <CardContent>
                <Box sx={{ height: 200, bgcolor: 'grey.300', borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Distribución de Riesgo */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Distribución de Riesgo
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {(['high', 'medium', 'low'] as const).map((level) => {
                const count = level === 'high' ? metrics.highRiskPatients :
                             level === 'medium' ? metrics.mediumRiskPatients :
                             metrics.lowRiskPatients;
                const percentage = riskDistribution[level];
                
                return (
                  <Box key={level} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: getRiskColor(level)
                          }}
                        />
                        <Typography variant="body2">
                          {getRiskLabel(level)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {count} ({percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 6,
                        bgcolor: alpha(getRiskColor(level), 0.1),
                        borderRadius: 3,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${percentage}%`,
                          height: '100%',
                          bgcolor: getRiskColor(level),
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {totalRiskPatients}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total pacientes evaluados
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Motivos de Consulta */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Principales Motivos de Consulta
            </Typography>
            
            <List sx={{ p: 0 }}>
              {topMotives.map(([motive, count], index) => (
                <ListItem key={motive} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap>
                        {motive}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {count} pacientes
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {topMotives.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Assessment sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay datos de motivos de consulta
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Tipos de Sesión */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tipos de Sesión
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {sessionTypes.map(([type, count], index) => {
                const percentage = metrics.totalSessions > 0 ? (count / metrics.totalSessions) * 100 : 0;
                const colors = [
                  theme.palette.primary.main,
                  theme.palette.secondary.main,
                  theme.palette.success.main,
                  theme.palette.warning.main,
                  theme.palette.info.main
                ];
                const color = colors[index % colors.length];
                
                return (
                  <Box key={type} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
                        {type}
                      </Typography>
                      <Chip
                        label={`${count} (${percentage.toFixed(1)}%)`}
                        size="small"
                        sx={{
                          bgcolor: alpha(color, 0.1),
                          color: color,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 4,
                        bgcolor: alpha(color, 0.1),
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${percentage}%`,
                          height: '100%',
                          bgcolor: color,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {sessionTypes.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay datos de tipos de sesión
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {metrics.totalSessions}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total sesiones
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="secondary">
                  {metrics.averageSessionsPerPatient.toFixed(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Promedio/paciente
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
