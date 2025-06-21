'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Psychology,
  People,
  EventNote,
  TrendingUp,
  LocalHospital,
  Assessment,
  Schedule,
  CheckCircle,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ModernCard from '@/components/common/ModernCard';
import MetricCard from '@/components/common/MetricCard';
import ModernButton from '@/components/common/ModernButton';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const theme = useTheme();
  const { role } = useRole();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'admin':
        return 'CEO Ejecutivo';
      case 'psychologist':
        return 'Psicólogo Profesional';
      case 'patient':
        return 'Paciente';
      default:
        return 'Usuario';
    }
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0F0F1A 0%, #1A1B2E 100%)'
            : 'linear-gradient(135deg, #F2EDEA 0%, #F8F6F4 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header de bienvenida */}
          <Fade in timeout={600}>
            <Box sx={{ mb: 6 }}>
              <Stack direction="row" alignItems="center" spacing={3} mb={3}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(93, 79, 176, 0.3)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -3,
                      left: -3,
                      right: -3,
                      bottom: -3,
                      background: 'linear-gradient(135deg, #5D4FB0, #A593F3, #A5CAE6)',
                      borderRadius: 5,
                      zIndex: -1,
                      opacity: 0.3,
                    },
                  }}
                >
                  <Psychology sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 1,
                    }}
                  >
                    {getGreeting()}, {user?.displayName?.split(' ')[0]}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {getRoleTitle()} • Centro Psicológico
                  </Typography>
                </Box>
              </Stack>
              
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: 'text.secondary',
                  fontSize: '1.1rem',
                  maxWidth: 600,
                }}
              >
                Bienvenido a tu plataforma de gestión profesional. 
                Aquí encontrarás todas las herramientas necesarias para optimizar 
                la atención y el seguimiento de tus pacientes.
              </Typography>
            </Box>
          </Fade>

          {/* Métricas principales */}
          <Fade in timeout={800}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              sx={{ mb: 6 }}
              flexWrap="wrap"
            >
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
                <MetricCard
                  title="Pacientes Activos"
                  value="127"
                  subtitle="Total registrados"
                  trend="up"
                  trendValue="+12%"
                  icon={<People />}
                  color="primary"
                  progress={85}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
                <MetricCard
                  title="Sesiones del Mes"
                  value="89"
                  subtitle="Completadas"
                  trend="up"
                  trendValue="+8%"
                  icon={<EventNote />}
                  color="secondary"
                  progress={92}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
                <MetricCard
                  title="Tasa de Adherencia"
                  value="94%"
                  subtitle="Promedio mensual"
                  trend="up"
                  trendValue="+3%"
                  icon={<TrendingUp />}
                  color="success"
                  progress={94}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
                <MetricCard
                  title="Satisfacción"
                  value="4.8"
                  subtitle="De 5.0 estrellas"
                  trend="flat"
                  trendValue="Estable"
                  icon={<CheckCircle />}
                  color="info"
                  progress={96}
                />
              </Box>
            </Stack>
          </Fade>

          {/* Sección principal */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4}
            alignItems="flex-start"
          >
            {/* Panel de acceso rápido */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66.666%' } }}>
              <Fade in timeout={1000}>
                <ModernCard
                  title="Acceso Rápido"
                  subtitle="Herramientas más utilizadas"
                  variant="gradient"
                >
                  <Stack spacing={3}>
                    {/* Primera fila de herramientas */}
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={3}
                    >
                      <Box sx={{ flex: '1 1 50%' }}>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, rgba(93, 79, 176, 0.08) 0%, rgba(165, 147, 243, 0.04) 100%)',
                            border: `1px solid ${alpha('#5D4FB0', 0.12)}`,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(93, 79, 176, 0.15)',
                            },
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2} mb={2} flex={1}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #5D4FB0 0%, #A593F3 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <People sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Box flex={1}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: '"Outfit", sans-serif',
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  fontSize: '1rem',
                                }}
                              >
                                Gestión de Pacientes
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: '"Inter", sans-serif',
                                  color: 'text.secondary',
                                }}
                              >
                                Administrar expedientes
                              </Typography>
                            </Box>
                          </Stack>
                          <ModernButton
                            variant="outlined"
                            size="small"
                            fullWidth
                          >
                            Acceder
                          </ModernButton>
                        </Box>
                      </Box>
                      
                      <Box sx={{ flex: '1 1 50%' }}>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, rgba(165, 147, 243, 0.08) 0%, rgba(165, 202, 230, 0.04) 100%)',
                            border: `1px solid ${alpha('#A593F3', 0.12)}`,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(165, 147, 243, 0.15)',
                            },
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2} mb={2} flex={1}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #A593F3 0%, #A5CAE6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Schedule sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Box flex={1}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: '"Outfit", sans-serif',
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  fontSize: '1rem',
                                }}
                              >
                                Programar Sesiones
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: '"Inter", sans-serif',
                                  color: 'text.secondary',
                                }}
                              >
                                Calendario y citas
                              </Typography>
                            </Box>
                          </Stack>
                          <ModernButton
                            variant="outlined"
                            size="small"
                            fullWidth
                          >
                            Programar
                          </ModernButton>
                        </Box>
                      </Box>
                    </Stack>
                    
                    {/* Segunda fila de herramientas */}
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={3}
                    >
                      <Box sx={{ flex: '1 1 50%' }}>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, rgba(165, 202, 230, 0.08) 0%, rgba(217, 125, 183, 0.04) 100%)',
                            border: `1px solid ${alpha('#A5CAE6', 0.12)}`,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(165, 202, 230, 0.15)',
                            },
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2} mb={2} flex={1}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #A5CAE6 0%, #D97DB7 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Assessment sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Box flex={1}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: '"Outfit", sans-serif',
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  fontSize: '1rem',
                                }}
                              >
                                Análisis y Reportes
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: '"Inter", sans-serif',
                                  color: 'text.secondary',
                                }}
                              >
                                Métricas y estadísticas
                              </Typography>
                            </Box>
                          </Stack>
                          <ModernButton
                            variant="outlined"
                            size="small"
                            fullWidth
                          >
                            Ver Reportes
                          </ModernButton>
                        </Box>
                      </Box>
                      
                      <Box sx={{ flex: '1 1 50%' }}>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, rgba(217, 125, 183, 0.08) 0%, rgba(93, 79, 176, 0.04) 100%)',
                            border: `1px solid ${alpha('#D97DB7', 0.12)}`,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(217, 125, 183, 0.15)',
                            },
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2} mb={2} flex={1}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #D97DB7 0%, #5D4FB0 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <LocalHospital sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Box flex={1}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: '"Outfit", sans-serif',
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  fontSize: '1rem',
                                }}
                              >
                                Centro de Salud
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: '"Inter", sans-serif',
                                  color: 'text.secondary',
                                }}
                              >
                                Monitoreo integral
                              </Typography>
                            </Box>
                          </Stack>
                          <ModernButton
                            variant="outlined"
                            size="small"
                            fullWidth
                          >
                            Monitorear
                          </ModernButton>
                        </Box>
                      </Box>
                    </Stack>
                  </Stack>
                </ModernCard>
              </Fade>
            </Box>

            {/* Panel lateral */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
              <Stack spacing={3}>
                {/* Actividad reciente */}
                <Fade in timeout={1200}>
                  <ModernCard
                    title="Actividad Reciente"
                    subtitle="Últimas acciones"
                    variant="glass"
                  >
                    <Stack spacing={2}>
                      {[
                        {
                          action: 'Nueva sesión programada',
                          patient: 'María González',
                          time: 'Hace 15 min',
                          color: '#5D4FB0',
                        },
                        {
                          action: 'Expediente actualizado',
                          patient: 'Carlos Ruiz',
                          time: 'Hace 1 hora',
                          color: '#A593F3',
                        },
                        {
                          action: 'Reporte generado',
                          patient: 'Ana López',
                          time: 'Hace 2 horas',
                          color: '#A5CAE6',
                        },
                      ].map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: alpha(item.color, 0.05),
                            border: `1px solid ${alpha(item.color, 0.1)}`,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 600,
                              color: 'text.primary',
                              mb: 0.5,
                            }}
                          >
                            {item.action}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              color: 'text.secondary',
                              mb: 0.5,
                            }}
                          >
                            {item.patient}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              color: item.color,
                              fontWeight: 500,
                            }}
                          >
                            {item.time}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </ModernCard>
                </Fade>

                {/* Próximas citas */}
                <Fade in timeout={1400}>
                  <ModernCard
                    title="Próximas Citas"
                    subtitle="Agenda de hoy"
                    variant="gradient"
                  >
                    <Stack spacing={2}>
                      {[
                        {
                          time: '10:00 AM',
                          patient: 'Laura Martín',
                          type: 'Terapia Individual',
                          status: 'confirmada',
                        },
                        {
                          time: '2:00 PM',
                          patient: 'Roberto Silva',
                          type: 'Seguimiento',
                          status: 'pendiente',
                        },
                        {
                          time: '4:30 PM',
                          patient: 'Elena Vega',
                          type: 'Primera Consulta',
                          status: 'nueva',
                        },
                      ].map((appointment, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(255, 255, 255, 0.8)',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 700,
                                color: 'primary.main',
                              }}
                            >
                              {appointment.time}
                            </Typography>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: appointment.status === 'confirmada' 
                                  ? '#10b981' 
                                  : appointment.status === 'pendiente' 
                                  ? '#f59e0b' 
                                  : '#5D4FB0',
                              }}
                            />
                          </Stack>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              fontWeight: 600,
                              color: 'text.primary',
                              mb: 0.5,
                            }}
                          >
                            {appointment.patient}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              color: 'text.secondary',
                            }}
                          >
                            {appointment.type}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Box sx={{ mt: 2 }}>
                      <ModernButton
                        variant="gradient"
                        size="small"
                        fullWidth
                      >
                        Ver Agenda Completa
                      </ModernButton>
                    </Box>
                  </ModernCard>
                </Fade>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
  );
}