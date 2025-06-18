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
  alpha,
  Container,
  Stack,
  Fade,
  Grow,
  Slide,
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
  Person,
  ArrowUpward,
  ArrowDownward,
  Insights,
  AutoAwesome,
  Timeline,
  LocalHospital,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSimpleDashboard } from '@/hooks/useSimpleDashboard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Componente para tarjetas de estadísticas mejoradas
function ModernStatCard({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  subtitle,
  trend,
  trendValue,
  loading = false,
  delay = 0
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  loading?: boolean;
  delay?: number;
}) {
  const theme = useTheme();

  if (loading) {
    return (
      <Card 
        sx={{ 
          height: '100%', 
          minHeight: 180,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="circular" width={48} height={48} />
            </Box>
            <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} />
            <Box mt="auto" pt={2}>
              <Skeleton variant="text" width="50%" height={16} />
            </Box>
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

  const getGradient = () => {
    const baseColor = getColorValue();
    const lightColor = alpha(baseColor, 0.8);
    return `linear-gradient(135deg, ${baseColor} 0%, ${lightColor} 100%)`;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpward sx={{ fontSize: 16, color: theme.palette.success.main }} />;
    if (trend === 'down') return <ArrowDownward sx={{ fontSize: 16, color: theme.palette.error.main }} />;
    return <Timeline sx={{ fontSize: 16, color: theme.palette.text.secondary }} />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return (
    <Grow in timeout={600 + delay * 100}>
      <Card 
        sx={{ 
          height: '100%', 
          minHeight: 180,
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: getGradient(),
          },
          '&:hover': {
            transform: 'translateY(-8px)',
            '& .stat-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            },
            '& .stat-value': {
              transform: 'scale(1.05)',
            }
          }
        }}
        className="hover-lift"
      >
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box display="flex" flexDirection="column" height="100%">
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography 
                variant="overline" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  fontSize: '0.75rem'
                }}
              >
                {title}
              </Typography>
              <Box
                className="stat-icon"
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
                {icon}
              </Box>
            </Box>

            {/* Value */}
            <Typography 
              variant="h3" 
              component="div" 
              className="stat-value"
              sx={{ 
                fontWeight: 700,
                background: getGradient(),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>

            {/* Subtitle */}
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 2, lineHeight: 1.4 }}
              >
                {subtitle}
              </Typography>
            )}

            {/* Trend */}
            {trendValue && (
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
                  }}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
}

// Componente para sesiones de hoy mejorado
function ModernTodaySessions({ sessions, loading }: { sessions: any[], loading: boolean }) {
  const theme = useTheme();

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
    <Slide direction="up" in timeout={800}>
      <Card 
        sx={{ 
          height: '100%',
          minHeight: 400,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <EventNote sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Sesiones de Hoy
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(), "dd 'de' MMMM", { locale: es })}
                </Typography>
              </Box>
            </Box>
            <IconButton 
              size="small"
              sx={{
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>

          {loading ? (
            <Stack spacing={2}>
              {[1, 2, 3].map((item) => (
                <Box key={item} display="flex" alignItems="center" p={2}>
                  <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                  <Box flexGrow={1}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Box>
                  <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 2 }} />
                </Box>
              ))}
            </Stack>
          ) : sessions.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={6}
              sx={{
                background: alpha(theme.palette.primary.main, 0.02),
                borderRadius: 3,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
                className="animate-float"
              >
                <EventNote sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h6" color="text.primary" fontWeight="600" gutterBottom>
                Sin sesiones programadas
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No hay sesiones programadas para hoy
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {sessions.map((session, index) => (
                <Fade in timeout={600 + index * 100} key={session.id}>
                  <ListItem 
                    sx={{ 
                      px: 0, 
                      py: 2,
                      borderRadius: 3,
                      mb: 1,
                      background: alpha(theme.palette.background.paper, 0.5),
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateX(8px)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                          {session.patientName || 'Paciente'}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            {session.type || 'Sesión'}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <AccessTime sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {session.time || 'Hora no especificada'}
                            </Typography>
                          </Box>
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        icon={getStatusIcon(session.status)}
                        label={getStatusLabel(session.status)}
                        size="small"
                        color={getStatusColor(session.status)}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </Fade>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Slide>
  );
}

// Componente para alertas recientes mejorado
function ModernRecentAlerts({ alerts, loading }: { alerts: any[], loading: boolean }) {
  const theme = useTheme();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <CalendarToday />;
      case 'medication': return <LocalHospital />;
      case 'emergency': return <Warning />;
      default: return <Notifications />;
    }
  };

  const getAlertColor = (urgency: string) => {
    switch (urgency) {
      case 'alta': return theme.palette.error.main;
      case 'media': return theme.palette.warning.main;
      case 'baja': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getAlertBackground = (urgency: string) => {
    switch (urgency) {
      case 'alta': return alpha(theme.palette.error.main, 0.1);
      case 'media': return alpha(theme.palette.warning.main, 0.1);
      case 'baja': return alpha(theme.palette.info.main, 0.1);
      default: return alpha(theme.palette.text.secondary, 0.1);
    }
  };

  return (
    <Slide direction="up" in timeout={1000}>
      <Card 
        sx={{ 
          height: '100%',
          minHeight: 400,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <Warning sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Alertas Recientes
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Últimas notificaciones
                </Typography>
              </Box>
            </Box>
            <IconButton 
              size="small"
              sx={{
                background: alpha(theme.palette.warning.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.warning.main, 0.2),
                }
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>

          {loading ? (
            <Stack spacing={2}>
              {[1, 2, 3].map((item) => (
                <Box key={item} display="flex" alignItems="start" p={2}>
                  <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2, mt: 0.5 }} />
                  <Box flexGrow={1}>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : alerts.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={6}
              sx={{
                background: alpha(theme.palette.success.main, 0.02),
                borderRadius: 3,
                border: `2px dashed ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
                className="animate-float"
              >
                <CheckCircle sx={{ fontSize: 40, color: theme.palette.success.main }} />
              </Box>
              <Typography variant="h6" color="text.primary" fontWeight="600" gutterBottom>
                Todo bajo control
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No hay alertas activas en este momento
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {alerts.map((alert, index) => (
                <Fade in timeout={600 + index * 100} key={alert.id}>
                  <ListItem 
                    sx={{ 
                      px: 0, 
                      py: 2, 
                      alignItems: 'flex-start',
                      borderRadius: 3,
                      mb: 1,
                      background: getAlertBackground(alert.urgency),
                      border: `1px solid ${alpha(getAlertColor(alert.urgency), 0.2)}`,
                      '&:hover': {
                        background: alpha(getAlertColor(alert.urgency), 0.15),
                        transform: 'translateX(8px)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: getAlertColor(alert.urgency),
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getAlertIcon(alert.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5 }}>
                          {alert.description}
                        </Typography>
                      }
                      secondary={
                        <Box display="flex" alignItems="center">
                          <AccessTime sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(alert.createdAt), "dd 'de' MMMM 'a las' HH:mm", { locale: es })}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </Fade>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Slide>
  );
}

// Componente para próximas citas mejorado
function ModernUpcomingAppointments({ sessions, loading }: { sessions: any[], loading: boolean }) {
  const theme = useTheme();

  return (
    <Slide direction="up" in timeout={1200}>
      <Card 
        sx={{ 
          height: '100%',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <CalendarToday sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Próximas Citas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Agenda de los próximos días
              </Typography>
            </Box>
          </Box>
          
          {loading ? (
            <Stack spacing={2}>
              {[1, 2, 3].map((item) => (
                <Box key={item} display="flex" alignItems="center" py={1.5}>
                  <Skeleton variant="circular" width={12} height={12} sx={{ mr: 2 }} />
                  <Box flexGrow={1}>
                    <Skeleton variant="text" width="70%" height={20} />
                    <Skeleton variant="text" width="50%" height={16} />
                  </Box>
                  <Skeleton variant="circular" width={20} height={20} />
                </Box>
              ))}
            </Stack>
          ) : sessions.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={6}
              sx={{
                background: alpha(theme.palette.info.main, 0.02),
                borderRadius: 3,
                border: `2px dashed ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: alpha(theme.palette.info.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
                className="animate-float"
              >
                <CalendarToday sx={{ fontSize: 40, color: theme.palette.info.main }} />
              </Box>
              <Typography variant="h6" color="text.primary" fontWeight="600" gutterBottom>
                Agenda libre
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No hay citas programadas próximamente
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {sessions.map((session, index) => (
                <Fade in timeout={600 + index * 100} key={session.id}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    py={2}
                    px={2}
                    sx={{
                      borderRadius: 3,
                      background: alpha(theme.palette.background.paper, 0.5),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateX(8px)',
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
                        mr: 3,
                        flexShrink: 0,
                      }}
                    />
                    <Box flexGrow={1}>
                      <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }}>
                        {session.time || 'Hora TBD'} - {session.patientName || 'Paciente'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {session.type || 'Sesión'}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <CalendarToday sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(session.date || session.createdAt), "dd 'de' MMMM", { locale: es })}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton 
                      size="small"
                      sx={{
                        background: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.2),
                        }
                      }}
                    >
                      <CalendarToday sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Fade>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Slide>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error } = useSimpleDashboard();
  const theme = useTheme();

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Hero Section */}
          <Fade in timeout={400}>
            <Box 
              sx={{ 
                mb: 6,
                p: 4,
                borderRadius: 4,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '50%',
                  height: '100%',
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3,
                }
              }}
            >
              <Box position="relative" zIndex={1}>
                <Box display="flex" alignItems="center" mb={2}>
                  <AutoAwesome sx={{ fontSize: 32, mr: 2 }} />
                  <Typography variant="h3" fontWeight="bold">
                    ¡Bienvenido, {user?.displayName || 'Doctor'}!
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Centro Psicológico Digital - Dashboard Inteligente
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: '60%' }}>
                  Gestiona tu práctica profesional con herramientas avanzadas de análisis y seguimiento. 
                  Hoy es {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </Typography>
              </Box>
            </Box>
          </Fade>

          {/* Error Alert */}
          {error && (
            <Fade in timeout={600}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4, 
                  borderRadius: 3,
                  '& .MuiAlert-icon': {
                    fontSize: 24,
                  }
                }}
              >
                <Typography variant="body1" fontWeight="500">
                  {error}
                </Typography>
              </Alert>
            </Fade>
          )}

          {/* Estadísticas principales */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              mb: 6,
              '& > *': {
                flex: '1 1 280px',
                minWidth: '280px',
              }
            }}
          >
            <ModernStatCard
              title="Pacientes Activos"
              value={data.totalPatients}
              icon={<People sx={{ fontSize: 24 }} />}
              color="primary"
              subtitle="Pacientes en seguimiento activo"
              trend="up"
              trendValue="+12% este mes"
              loading={loading}
              delay={0}
            />
            <ModernStatCard
              title="Sesiones Registradas"
              value={data.totalSessions}
              icon={<EventNote sx={{ fontSize: 24 }} />}
              color="success"
              subtitle="Total de sesiones completadas"
              trend="up"
              trendValue="+8% esta semana"
              loading={loading}
              delay={1}
            />
            <ModernStatCard
              title="Alertas Activas"
              value={data.activeAlerts}
              icon={<Warning sx={{ fontSize: 24 }} />}
              color={data.activeAlerts > 5 ? 'warning' : 'info'}
              subtitle="Notificaciones pendientes"
              trend={data.activeAlerts > 5 ? 'up' : 'neutral'}
              trendValue={data.activeAlerts > 5 ? 'Requiere atención' : 'Bajo control'}
              loading={loading}
              delay={2}
            />
            <ModernStatCard
              title="Sesiones Hoy"
              value={data.todaySessions.length}
              icon={<Psychology sx={{ fontSize: 24 }} />}
              color="secondary"
              subtitle="Citas programadas para hoy"
              trend="neutral"
              trendValue="Agenda del día"
              loading={loading}
              delay={3}
            />
          </Box>

          {/* Contenido principal */}
          <Box>
            {/* Primera fila: Sesiones de hoy y Alertas recientes */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 4, 
                mb: 4,
                '& > *': {
                  flex: '1 1 500px',
                  minWidth: '500px',
                  '@media (max-width: 1200px)': {
                    minWidth: '100%',
                  }
                }
              }}
            >
              <ModernTodaySessions sessions={data.todaySessions} loading={loading} />
              <ModernRecentAlerts alerts={data.recentAlerts} loading={loading} />
            </Box>

            {/* Segunda fila: Próximas citas */}
            <ModernUpcomingAppointments sessions={data.upcomingSessions} loading={loading} />
          </Box>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}