'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
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
  alpha,
  Tabs,
  Tab
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
  Person,
  Dashboard,
  Analytics,
  Assessment
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardCard from '@/components/metrics/DashboardCard';
import SessionsLineChart from '@/components/metrics/SessionsLineChart';
import EmotionPieChart from '@/components/metrics/EmotionPieChart';
import ExecutiveSummary from '@/components/dashboard/ExecutiveSummary';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';
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
      <Card sx={{ height: '100%', minHeight: 140, flex: '1 1 250px' }}>
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
        flex: '1 1 250px',
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
  const [tabValue, setTabValue] = useState(0);

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

  // Preparar datos para las tarjetas de estadísticas con validación defensiva
  const statsCards = useMemo(() => {
    // Validación defensiva: verificar que comparison y current.metrics existan
    if (!comparison?.current?.metrics) {
      return [];
    }

    const current = comparison.current.metrics;
    const comp = comparison.comparison;

    return [
      {
        title: 'Pacientes Activos',
        value: current.totalActivePatients || 0,
        icon: <People />,
        color: 'primary' as const,
        trend: comp?.totalActivePatients ? {
          value: comp.totalActivePatients.change,
          isPositive: comp.totalActivePatients.change >= 0,
          period: 'mes anterior'
        } : undefined
      },
      {
        title: 'Sesiones del Mes',
        value: current.totalSessions || 0,
        icon: <EventNote />,
        color: 'success' as const,
        subtitle: `${(current.averageSessionsPerPatient || 0).toFixed(1)} promedio por paciente`,
        trend: comp?.totalSessions ? {
          value: comp.totalSessions.change,
          isPositive: comp.totalSessions.change >= 0,
          period: 'mes anterior'
        } : undefined
      },
      {
        title: 'Alertas Activas',
        value: current.activeAlerts || 0,
        icon: <Warning />,
        color: (current.activeAlerts || 0) > 5 ? 'warning' : 'info',
        subtitle: `${current.resolvedAlerts || 0} resueltas`
      },
      {
        title: 'Tasa de Seguimiento',
        value: `${(current.followUpRate || 0).toFixed(1)}%`,
        icon: <Psychology />,
        color: (current.followUpRate || 0) >= 70 ? 'success' : 'warning',
        subtitle: 'Pacientes con 2+ sesiones',
        trend: comp?.followUpRate ? {
          value: comp.followUpRate.change,
          isPositive: comp.followUpRate.change >= 0,
          period: 'mes anterior'
        } : undefined
      }
    ];
  }, [comparison]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mostrar estado de carga inicial
  if (metricsLoading && !comparison) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
        <DashboardLayout>
          <Box>
            <Box mb={4}>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="60%" height={24} />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              {[1, 2, 3, 4].map((item) => (
                <StatCard
                  key={item}
                  title=""
                  value=""
                  icon={<People />}
                  loading={true}
                />
              ))}
            </Box>
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

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
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              mb: 4 
            }}
          >
            {statsCards.length > 0 ? (
              statsCards.map((card, index) => (
                <StatCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                  trend={card.trend}
                  subtitle={card.subtitle}
                  loading={metricsLoading}
                />
              ))
            ) : (
              // Mostrar skeletons si no hay datos
              [1, 2, 3, 4].map((item) => (
                <StatCard
                  key={item}
                  title=""
                  value=""
                  icon={<People />}
                  loading={true}
                />
              ))
            )}
          </Box>

          {/* Tabs para diferentes vistas */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
              <Tab icon={<Dashboard />} label="Resumen" />
              <Tab icon={<Analytics />} label="Análisis" />
              <Tab icon={<Assessment />} label="Rendimiento" />
            </Tabs>
          </Box>

          {/* Contenido según la tab seleccionada */}
          {tabValue === 0 && (
            <Box>
              {/* Primera fila: Sesiones de hoy y Alertas recientes */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3, 
                  mb: 3,
                  '& > *': {
                    flex: '1 1 400px',
                    minWidth: '400px'
                  }
                }}
              >
                <TodaySessions />
                <RecentAlerts />
              </Box>

              {/* Segunda fila: Gráfico de sesiones y Próximas citas */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3,
                  alignItems: 'stretch'
                }}
              >
                <Box sx={{ flex: '2 1 600px', minWidth: '600px' }}>
                  {comparison?.current?.metrics ? (
                    <SessionsLineChart
                      data={comparison.current.metrics.sessionsOverTime || []}
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
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <UpcomingAppointments />
                </Box>
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              {/* Primera fila: Resumen ejecutivo y Distribución emocional */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3, 
                  mb: 3,
                  alignItems: 'stretch'
                }}
              >
                <Box sx={{ flex: '2 1 600px', minWidth: '600px' }}>
                  {comparison?.current?.metrics ? (
                    <ExecutiveSummary
                      metrics={comparison.current.metrics}
                      comparison={comparison.comparison}
                      loading={metricsLoading}
                    />
                  ) : (
                    <Card sx={{ height: 400 }}>
                      <CardContent>
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
                      </CardContent>
                    </Card>
                  )}
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  {comparison?.current?.metrics ? (
                    <EmotionPieChart
                      data={comparison.current.metrics.emotionalDistribution || {}}
                      title="Estados Emocionales"
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
                </Box>
              </Box>

              {/* Segunda fila: Gráfico de pacientes nuevos */}
              <Box>
                {comparison?.current?.metrics ? (
                  <SessionsLineChart
                    data={comparison.current.metrics.patientsOverTime || []}
                    title="Pacientes Nuevos en los Últimos 30 Días"
                    loading={metricsLoading}
                    height={250}
                    showArea={false}
                    color={theme.palette.secondary.main}
                  />
                ) : (
                  <Card sx={{ height: 350 }}>
                    <CardContent>
                      <Skeleton variant="text" width="40%" height={32} />
                      <Skeleton variant="rectangular" width="100%" height={250} sx={{ mt: 2 }} />
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              {comparison?.current?.metrics ? (
                <PerformanceMetrics
                  metrics={comparison.current.metrics}
                  loading={metricsLoading}
                />
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3,
                    '& > *': {
                      flex: '1 1 300px',
                      minWidth: '300px'
                    }
                  }}
                >
                  {[1, 2, 3].map((item) => (
                    <Card key={item}>
                      <CardContent>
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}