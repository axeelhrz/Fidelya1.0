'use client';

import React from 'react';
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
  alpha
} from '@mui/material';
import {
  People,
  EventNote,
  Warning,
  Psychology,
  TrendingUp,
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
import { useSimpleDashboard } from '@/hooks/useSimpleDashboard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Componente para tarjetas de estadísticas
function StatCard({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  subtitle,
  loading = false
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
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
function TodaySessions({ sessions, loading }: { sessions: any[], loading: boolean }) {
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
            {sessions.map((session, index) => (
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
                        {session.type || 'Sesión'}
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
function RecentAlerts({ alerts, loading }: { alerts: any[], loading: boolean }) {
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
            {alerts.map((alert) => (
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
function UpcomingAppointments({ sessions, loading }: { sessions: any[], loading: boolean }) {
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
            {sessions.map((session) => (
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
                    {session.type || 'Sesión'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(session.date || session.createdAt), "dd 'de' MMMM", { locale: es })}
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
  const { data, loading, error } = useSimpleDashboard();

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

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
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
            <StatCard
              title="Pacientes Activos"
              value={data.totalPatients}
              icon={<People />}
              color="primary"
              loading={loading}
            />
            <StatCard
              title="Sesiones Registradas"
              value={data.totalSessions}
              icon={<EventNote />}
              color="success"
              loading={loading}
            />
            <StatCard
              title="Alertas Activas"
              value={data.activeAlerts}
              icon={<Warning />}
              color={data.activeAlerts > 5 ? 'warning' : 'info'}
              loading={loading}
            />
            <StatCard
              title="Sesiones de Hoy"
              value={data.todaySessions.length}
              icon={<Psychology />}
              color="secondary"
              loading={loading}
            />
          </Box>

          {/* Contenido principal */}
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
              <TodaySessions sessions={data.todaySessions} loading={loading} />
              <RecentAlerts alerts={data.recentAlerts} loading={loading} />
            </Box>

            {/* Segunda fila: Próximas citas */}
            <Box>
              <UpcomingAppointments sessions={data.upcomingSessions} loading={loading} />
            </Box>
          </Box>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}