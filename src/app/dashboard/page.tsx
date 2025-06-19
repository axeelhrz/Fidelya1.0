'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Fade,
  Grow,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  People,
  EventNote,
  Warning,
  Psychology,
  AutoAwesome,
  Insights,
  TrendingUp,
  LocalHospital,
  WavingHand,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSimpleDashboard } from '@/hooks/useSimpleDashboard';
import DashboardCard from '@/components/metrics/DashboardCard';
import EmotionPieChart from '@/components/metrics/EmotionPieChart';
import MotivesBarChart from '@/components/metrics/MotivesBarChart';
import RecentPatients from '@/components/dashboard/RecentPatients';
import RecentSessions from '@/components/dashboard/RecentSessions';
import AlertCard from '@/components/dashboard/AlertCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error } = useSimpleDashboard();
  const theme = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getMotivationalMessage = () => {
    const messages = [
      'Que tu día sea liviano y significativo',
      'Cada sesión es una oportunidad de transformación',
      'Tu dedicación marca la diferencia en cada vida',
      'Hoy es un buen día para sanar corazones',
      'La empatía es tu superpoder profesional'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'psychologist']}>
      <DashboardLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Hero Section - Header Emocional */}
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
                  <WavingHand sx={{ fontSize: 32, mr: 2, color: '#fbbf24' }} />
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Doctor'}!
                  </Typography>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9, 
                    mb: 2,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500
                  }}
                >
                  Centro Psicológico Digital - Dashboard Inteligente
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.8, 
                    maxWidth: '60%',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                  }}
                >
                  {getMotivationalMessage()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.7, 
                    mt: 2,
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
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
                  fontFamily: '"Inter", sans-serif',
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

          {/* Tarjetas Analíticas Principales */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 3, 
              mb: 6,
            }}
          >
            <DashboardCard
              title="Pacientes Activos"
              value={data.totalPatients}
              icon={<People sx={{ fontSize: 24 }} />}
              color="primary"
              subtitle="Pacientes en seguimiento activo"
              trend={{
                value: 12,
                isPositive: true,
                label: "+12% este mes"
              }}
              loading={loading}
              delay={0}
            />
            <DashboardCard
              title="Sesiones Registradas"
              value={data.totalSessions}
              icon={<EventNote sx={{ fontSize: 24 }} />}
              color="success"
              subtitle="Total de sesiones completadas"
              trend={{
                value: data.completedSessionsThisWeek,
                isPositive: data.completedSessionsThisWeek > 0,
                label: `${data.completedSessionsThisWeek} esta semana`
              }}
              loading={loading}
              delay={1}
            />
            <DashboardCard
              title="Alertas Activas"
              value={data.activeAlerts}
              icon={<Warning sx={{ fontSize: 24 }} />}
              color={data.activeAlerts > 5 ? 'warning' : 'info'}
              subtitle="Notificaciones pendientes"
              trend={{
                value: data.activeAlerts > 5 ? 15 : -5,
                isPositive: data.activeAlerts <= 5,
                label: data.activeAlerts > 5 ? 'Requiere atención' : 'Bajo control'
              }}
              loading={loading}
              delay={2}
            />
            <DashboardCard
              title="Sesiones con IA"
              value={data.aiAnalysisCount}
              icon={<AutoAwesome sx={{ fontSize: 24 }} />}
              color="secondary"
              subtitle="Análisis inteligente aplicado"
              trend={{
                value: data.totalSessions > 0 ? Math.round((data.aiAnalysisCount / data.totalSessions) * 100) : 0,
                isPositive: true,
                label: `${data.totalSessions > 0 ? Math.round((data.aiAnalysisCount / data.totalSessions) * 100) : 0}% con IA`
              }}
              loading={loading}
              delay={3}
            />
          </Box>

          {/* Sección de Evolución Emocional y Motivos */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'repeat(2, 1fr)'
              },
              gap: 4, 
              mb: 6,
            }}
          >
            <Grow in timeout={800}>
              <Box>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  sx={{ 
                    mb: 3,
                    fontFamily: '"Poppins", sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Psychology sx={{ color: theme.palette.primary.main }} />
                  Evolución Emocional
                </Typography>
                <EmotionPieChart 
                  data={data.emotionalData}
                  title="Estados Emocionales Predominantes"
                  loading={loading}
                  height={350}
                />
              </Box>
            </Grow>

            <Grow in timeout={1000}>
              <Box>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  sx={{ 
                    mb: 3,
                    fontFamily: '"Poppins", sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Insights sx={{ color: theme.palette.secondary.main }} />
                  Tipos de Sesión
                </Typography>
                <MotivesBarChart 
                  data={data.motivesData}
                  title="Distribución por Tipo de Sesión"
                  loading={loading}
                  height={350}
                  maxItems={8}
                />
              </Box>
            </Grow>
          </Box>

          {/* Sección de Listados Recientes */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'repeat(2, 1fr)'
              },
              gap: 4, 
              mb: 6,
            }}
          >
            <RecentPatients patients={data.recentPatients} loading={loading} />
            <RecentSessions sessions={data.todaySessions.length > 0 ? data.todaySessions : data.upcomingSessions} loading={loading} />
          </Box>

          {/* Sección de Notificaciones Importantes */}
          <Fade in timeout={1400}>
            <Box>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                sx={{ 
                  mb: 3,
                  fontFamily: '"Poppins", sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <LocalHospital sx={{ color: theme.palette.warning.main }} />
                Notificaciones Importantes
              </Typography>
              
              {data.recentAlerts.length === 0 ? (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  py={8}
                  sx={{
                    background: alpha(theme.palette.success.main, 0.02),
                    borderRadius: 4,
                    border: `2px dashed ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: alpha(theme.palette.success.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                    className="animate-float"
                  >
                    <TrendingUp sx={{ fontSize: 50, color: theme.palette.success.main }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    color="text.primary" 
                    fontWeight="600" 
                    gutterBottom
                    sx={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    Excelente trabajo!
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    textAlign="center"
                    sx={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    No hay alertas activas en este momento
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    textAlign="center"
                    sx={{ mt: 1, fontFamily: '"Inter", sans-serif' }}
                  >
                    Tu gestión profesional mantiene todo bajo control
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {data.recentAlerts.map((alert, index) => (
                    <AlertCard 
                      key={alert.id} 
                      alert={alert} 
                      delay={index}
                      onDismiss={(alertId) => {
                        console.log('Dismissing alert:', alertId);
                        // Aquí implementarías la lógica para descartar la alerta
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Fade>

          {/* Accesos Rápidos */}
          <Fade in timeout={1600}>
            <Box 
              sx={{ 
                mt: 6,
                p: 4,
                borderRadius: 4,
                background: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.background.paper, 0.5)
                  : alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  mb: 3,
                  fontFamily: '"Poppins", sans-serif',
                  color: theme.palette.primary.main
                }}
              >
                Accesos Rápidos
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
              >
                <Box 
                  component="button"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    py: 1.5,
                    px: 3,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }
                  }}
                >
                  <People sx={{ fontSize: 20 }} />
                  Nuevo Paciente
                </Box>
                <Box 
                  component="button"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    py: 1.5,
                    px: 3,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.3)}`,
                    }
                  }}
                >
                  <EventNote sx={{ fontSize: 20 }} />
                  Programar Sesión
                </Box>
                <Box 
                  component="button"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    py: 1.5,
                    px: 3,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.3)}`,
                    }
                  }}
                >
                  <Insights sx={{ fontSize: 20 }} />
                  Ver Métricas
                </Box>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}