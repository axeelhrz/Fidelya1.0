'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Skeleton,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  People,
  EventNote,
  Warning,
  Psychology,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  AccessTime,
  MoreVert,
  Notifications,
  CheckCircle,
  Schedule,
  Person
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardCard from '@/components/metrics/DashboardCard';
import SessionsLineChart from '@/components/metrics/SessionsLineChart';
import EmotionPieChart from '@/components/metrics/EmotionPieChart';
import { useMetrics, useComparativeMetrics } from '@/hooks/useMetrics';
import { useSessions } from '@/hooks/useSessions';
import { useAlerts } from '@/hooks/useAlerts';
import { usePatients } from '@/hooks/usePatients';
import { format, startOfDay, endOfDay, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Componente para tarjetas de estadísticas con datos reales
function StatCard({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  subtitle,
  loading = false
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: { value: number; isPositive: boolean; period: string };
  subtitle?: string;
  loading?: boolean;
}) {
  const theme = useTheme();

  if (loading) {
    return (
      <Card sx={{ height: '100%', minHeight: 140 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box flexGrow={1}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={40} sx={{ my: 1 }} />
              <Skeleton variant="text" width="80%" height={16} />
            </Box>
            <Skeleton variant="circular" width={56} height={56} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const getColorValue = () => {
    switch (color) {
      case 'primary': return theme.palette.primary.main;
      case 'secondary': return theme.palette.secondary.main;
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      case 'info': return theme.palette.info.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        minHeight: 140,
        borderLeft: `4px solid ${getColorValue()}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box flexGrow={1}>
            <Typography color="text.secondary" gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" color={getColorValue()}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend.isPositive ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                )}
                <Chip
                  label={`${trend.value > 0 ? '+' : ''}${trend.value.toFixed(1)}%`}
                  size="small"
                  color={trend.isPositive ? 'success' : 'error'}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 24 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  vs {trend.period}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: alpha(getColorValue(), 0.1), 
              color: getColorValue(),
              width: 56, 
              height: 56 
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente para sesiones de hoy
function TodaySessions() {
  const theme = useTheme();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const { sessions, loading, error } = useSessions({
    dateRange: { start: today, end: today },
    status: undefined
  });

  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in-progress': return 'En progreso';
      case 'scheduled': return 'Programada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'in-progress': return <Schedule sx={{ fontSize: 16 }} />;
      case 'scheduled': return <CalendarToday sx={{ fontSize: 16 }} />;
      default: return <AccessTime sx={{ fontSize: 16 }} />;
    }
  };

  if (error) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Alert severity="error">Error al cargar las sesiones de hoy</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Sesiones de Hoy
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        {loading ? (
          <Box>
            {[1, 2, 3].map((item) => (
              <Box key={item} display="flex" alignItems="center" py={2}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box flexGrow={1}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
                <Skeleton variant="rectangular" width={80} height={24} />
              </Box>
            ))}
          </Box>
        ) : sessions.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={4}
          >
            <EventNote sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No hay sesiones programadas para hoy
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {sessions.slice(0, 5).map((session, index) => (
              <ListItem key={session.id} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="medium">
                      {session.patientName || 'Paciente'}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {session.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.time || 'Hora no especificada'}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Chip
                    icon={getStatusIcon(session.status)}
                    label={getStatusLabel(session.status)}
                    size="small"
                    color={getStatusColor(session.status)}
                    variant="outlined"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

// Componente para alertas recientes
function RecentAlerts() {
  const { alerts, loading, error } = useAlerts({
    status: 'activa',
    dateRange: {
      start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    }
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <CalendarToday />;
      case 'medication': return <Psychology />;
      case 'emergency': return <Warning />;
      default: return <Notifications />;
    }
  };

  const getAlertColor = (urgency: string) => {
    switch (urgency) {
      case 'alta': return 'error.main';
      case 'media': return 'warning.main';
      case 'baja': return 'info.main';
      default: return 'text.secondary';
    }
  };

  if (error) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Alert severity="error">Error al cargar las alertas</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Alertas Recientes
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        {loading ? (
          <Box>
            {[1, 2, 3].map((item) => (
              <Box key={item} display="flex" alignItems="start" py={2}>
                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2, mt: 0.5 }} />
                <Box flexGrow={1}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </Box>
        ) : alerts.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={4}
          >
            <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No hay alertas activas
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {alerts.slice(0, 5).map((alert) => (
              <ListItem key={alert.id} sx={{ px: 0, alignItems: 'flex-start' }}>
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(getAlertColor(alert.urgency), 0.1),
                      color: getAlertColor(alert.urgency),
                      width: 32,
                      height: 32
                    }}
                  >
                    {getAlertIcon(alert.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {alert.description}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(alert.createdAt), "dd 'de' MMMM 'a las' HH:mm", { locale: es })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

// Componente para próximas citas
function UpcomingAppointments() {
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  
  const { sessions, loading, error } = useSessions({
    dateRange: { start: tomorrow, end: nextWeek },
    status: 'scheduled'
  });

  if (error) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Alert severity="error">Error al cargar las próximas citas</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Próximas Citas
        </Typography>
        
        {loading ? (
          <Box>
            {[1, 2, 3].map((item) => (
              <Box key={item} display="flex" alignItems="center" py={1.5}>
                <Skeleton variant="circular" width={8} height={8} sx={{ mr: 2 }} />
                <Box flexGrow={1}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="50%" />
                </Box>
                <Skeleton variant="circular" width={16} height={16} />
              </Box>
            ))}
          </Box>
        ) : sessions.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={4}
          >
            <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No hay citas programadas
            </Typography>
          </Box>
        ) : (
          <Box>
            {sessions.slice(0, 5).map((session) => (
              <Box key={session.id} display="flex" alignItems="center" py={1.5}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mr: 2,
                  }}
                />
                <Box flexGrow={1}>
                  <Typography variant="subtitle2">
                    {session.time || 'Hora TBD'} - {session.patientName || 'Paciente'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {session.type}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(session.date), "dd 'de' MMMM", { locale: es })}
                  </Typography>
                </Box>
                <CalendarToday sx={{ color: 'text.secondary', fontSize: 16 }} />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const theme = useTheme();

  // Configurar filtros para métricas (últimos 30 días)
  const metricsFilters = useMemo(() => ({
    dateRange: {
      start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    },
    includeInactive: false
  }), []);

  // Hooks para datos en tiempo real
  const { comparison, loading: metricsLoading, error: metricsError } = useComparativeMetrics(metricsFilters);
  const { patients, loading: patientsLoading } = usePatients({ status: 'active' });

  // Preparar datos para las tarjetas de estadísticas
  const statsCards = useMemo(() => {
    if (!comparison?.current.metrics) return [];

    const current = comparison.current.metrics;
    const comp = comparison.comparison;

    return [
      {
        title: 'Pacientes Activos',
        value: current.totalActivePatients,
        icon: <People />,
        color: 'primary' as const,
        trend: comp ? {
          value: comp.totalActivePatients.change,
          isPositive: comp.totalActivePatients.change >= 0,
          period: 'mes anterior'
        } : undefined
      },
      {
        title: 'Sesiones del Mes',
        value: current.totalSessions,
        icon: <EventNote />,
        color: 'success' as const,
        subtitle: `${current.averageSessionsPerPatient.toFixed(1)} promedio por paciente`,
        trend: comp ? {
          value: comp.totalSessions.change,
          isPositive: comp.totalSessions.change >= 0,
          period: 'mes anterior'
        } : undefined
      },
      {
        title: 'Alertas Activas',
        value: current.activeAlerts,
        icon: <Warning />,
        color: current.activeAlerts > 5 ? 'warning' : 'info',
        subtitle: `${current.resolvedAlerts} resueltas`
      },
      {
        title: 'Tasa de Seguimiento',
        value: `${current.followUpRate}%`,
        icon: <Psychology />,
        color: current.followUpRate >= 70 ? 'success' : 'warning',
        subtitle: 'Pacientes con 2+ sesiones',
        trend: comp ? {
          value: comp.followUpRate.change,
          isPositive: comp.followUpRate.change >= 0,
          period: 'mes anterior'
        } : undefined
      }
    ];
  }, [comparison]);

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Box>
          {/* Encabezado de bienvenida */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ¡Bienvenido, {user?.displayName || 'Doctor'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Resumen de actividad del centro psicológico - {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </Typography>
          </Box>

          {/* Error de métricas */}
          {metricsError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error al cargar las métricas: {metricsError}
            </Alert>
          )}

          {/* Estadísticas principales */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                  trend={card.trend}
                  subtitle={card.subtitle}
                  loading={metricsLoading}
                />
              </Grid>
            ))}
          </Grid>

          {/* Contenido principal */}
          <Grid container spacing={3}>
            {/* Sesiones de hoy */}
            <Grid item xs={12} lg={6}>
              <TodaySessions />
            </Grid>

            {/* Alertas recientes */}
            <Grid item xs={12} lg={6}>
              <RecentAlerts />
            </Grid>

            {/* Gráfico de sesiones en el tiempo */}
            <Grid item xs={12} lg={8}>
              {comparison?.current.metrics ? (
                <SessionsLineChart
                  data={comparison.current.metrics.sessionsOverTime}
                  title="Sesiones en los Últimos 30 Días"
                  loading={metricsLoading}
                  height={300}
                  showArea={true}
                  color={theme.palette.primary.main}
                />
              ) : (
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Skeleton variant="text" width="40%" height={32} />
                    <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Próximas citas */}
            <Grid item xs={12} lg={4}>
              <UpcomingAppointments />
            </Grid>

            {/* Distribución emocional */}
            <Grid item xs={12} lg={6}>
              {comparison?.current.metrics ? (
                <EmotionPieChart
                  data={comparison.current.metrics.emotionalDistribution}
                  title="Distribución de Estados Emocionales"
                  loading={metricsLoading}
                  height={300}
                />
              ) : (
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Skeleton variant="text" width="40%" height={32} />
                    <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', mt: 2 }} />
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Métricas de riesgo */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Evaluación de Riesgo
                  </Typography>
                  
                  {metricsLoading ? (
                    <Box>
                      {[1, 2, 3].map((item) => (
                        <Box key={item} display="flex" alignItems="center" mb={2}>
                          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                          <Box flexGrow={1}>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="40%" />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : comparison?.current.metrics ? (
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', mr: 2 }}>
                          <Warning />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" color="error.main">
                            {comparison.current.metrics.highRiskPatients}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pacientes de alto riesgo
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', mr: 2 }}>
                          <Psychology />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" color="warning.main">
                            {comparison.current.metrics.mediumRiskPatients}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pacientes de riesgo medio
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', mr: 2 }}>
                          <CheckCircle />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" color="success.main">
                            {comparison.current.metrics.lowRiskPatients}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pacientes de bajo riesgo
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay datos de evaluación de riesgo disponibles
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
