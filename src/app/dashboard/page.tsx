'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
} from '@mui/material';
import {
  People,
  EventNote,
  Warning,
  TrendingUp,
  MoreVert,
  CalendarToday,
  Psychology,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Componente para tarjetas de estadísticas
function StatCard({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  subtitle 
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: string;
  subtitle?: string;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente para sesiones recientes
function RecentSessions() {
  const sessions = [
    {
      id: 1,
      patient: 'María González',
      time: '10:00 AM',
      status: 'completed',
      type: 'Terapia Individual',
    },
    {
      id: 2,
      patient: 'Carlos Rodríguez',
      time: '11:30 AM',
      status: 'in-progress',
      type: 'Evaluación Inicial',
    },
    {
      id: 3,
      patient: 'Ana López',
      time: '2:00 PM',
      status: 'scheduled',
      type: 'Terapia Familiar',
    },
  ];

  const getStatusColor = (status: string) => {
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
      default: return status;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Sesiones de Hoy
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        <Box>
          {sessions.map((session, index) => (
            <Box key={session.id}>
              <Box display="flex" alignItems="center" py={2}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {session.patient.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {session.patient}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {session.type}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" fontWeight="medium">
                    {session.time}
                  </Typography>
                  <Chip
                    label={getStatusLabel(session.status)}
                    size="small"
                    color={getStatusColor(session.status) as any}
                    variant="outlined"
                  />
                </Box>
              </Box>
              {index < sessions.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente para alertas recientes
function RecentAlerts() {
  const alerts = [
    {
      id: 1,
      message: 'Paciente María G. faltó a su cita',
      time: '2 horas',
      severity: 'warning',
    },
    {
      id: 2,
      message: 'Nueva solicitud de cita pendiente',
      time: '4 horas',
      severity: 'info',
    },
    {
      id: 3,
      message: 'Recordatorio: Renovar licencia profesional',
      time: '1 día',
      severity: 'error',
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Alertas Recientes
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        <Box>
          {alerts.map((alert, index) => (
            <Box key={alert.id}>
              <Box display="flex" alignItems="start" py={2}>
                <Warning 
                  sx={{ 
                    mr: 2, 
                    mt: 0.5,
                    color: alert.severity === 'error' ? 'error.main' : 
                           alert.severity === 'warning' ? 'warning.main' : 'info.main'
                  }} 
                />
                <Box flexGrow={1}>
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hace {alert.time}
                  </Typography>
                </Box>
              </Box>
              {index < alerts.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { role, isPsychologist, isAdmin } = useRole();

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Box>
          {/* Encabezado de bienvenida */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ¡Bienvenido, {user?.displayName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Aquí tienes un resumen de tu actividad de hoy
            </Typography>
          </Box>

          {/* Estadísticas principales */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pacientes Activos"
                value={24}
                icon={<People />}
                color="primary"
                trend="+12% este mes"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Sesiones Hoy"
                value={8}
                icon={<EventNote />}
                color="success"
                subtitle="3 completadas"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Alertas Pendientes"
                value={3}
                icon={<Warning />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Progreso Mensual"
                value="87%"
                icon={<Psychology />}
                color="info"
                trend="+5% vs mes anterior"
              />
            </Grid>
          </Grid>

          {/* Contenido principal */}
          <Grid container spacing={3}>
            {/* Sesiones de hoy */}
            <Grid item xs={12} lg={8}>
              <RecentSessions />
            </Grid>

            {/* Alertas recientes */}
            <Grid item xs={12} lg={4}>
              <RecentAlerts />
            </Grid>

            {/* Gráfico de progreso semanal */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Progreso Semanal
                  </Typography>
                  <Box mt={2}>
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
                      <Box key={day} display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ minWidth: 40 }}>
                          {day}
                        </Typography>
                        <Box flexGrow={1} mx={2}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.random() * 100}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {Math.floor(Math.random() * 10) + 1}/10
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Próximas citas */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Próximas Citas
                  </Typography>
                  <Box mt={2}>
                    {[
                      { time: '14:00', patient: 'Ana López', type: 'Terapia Familiar' },
                      { time: '15:30', patient: 'Pedro Martín', type: 'Evaluación' },
                      { time: '17:00', patient: 'Laura Sánchez', type: 'Seguimiento' },
                    ].map((appointment, index) => (
                      <Box key={index} display="flex" alignItems="center" py={1.5}>
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
                            {appointment.time} - {appointment.patient}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.type}
                          </Typography>
                        </Box>
                        <CalendarToday sx={{ color: 'text.secondary', fontSize: 16 }} />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
