'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  Chip,
  Alert,
  useTheme,
  alpha,
  styled,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  X,
  Clock,
  Database,
  Key,
  Cloud,
  Bell,
  CreditCard,
  ArrowClockwise,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

// Tipos
type ServiceStatus = 'operational' | 'maintenance' | 'error';

interface SystemService {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  lastUpdated: string;
  uptime: number;
}

interface IncidentEvent {
  id: string;
  service: string;
  type: 'error' | 'maintenance' | 'resolved';
  description: string;
  date: string;
}

// Componentes estilizados
const StyledCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  padding: theme.spacing(0.5, 1),
  '&.operational': {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
  },
  '&.maintenance': {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.main,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
  },
  '&.error': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
  },
}));

// Datos de ejemplo
const services: SystemService[] = [
  {
    id: '1',
    name: 'Autenticación',
    description: 'Sistema de inicio de sesión y gestión de usuarios',
    status: 'operational',
    lastUpdated: '2024-01-20T10:30:00Z',
    uptime: 99.99,
  },
  {
    id: '2',
    name: 'Base de Datos (Firestore)',
    description: 'Almacenamiento y gestión de datos',
    status: 'operational',
    lastUpdated: '2024-01-20T10:30:00Z',
    uptime: 99.95,
  },
  {
    id: '3',
    name: 'Almacenamiento',
    description: 'Sistema de archivos y documentos',
    status: 'maintenance',
    lastUpdated: '2024-01-20T09:15:00Z',
    uptime: 99.90,
  },
  {
    id: '4',
    name: 'Notificaciones',
    description: 'Sistema de alertas y mensajes',
    status: 'operational',
    lastUpdated: '2024-01-20T10:30:00Z',
    uptime: 99.98,
  },
  {
    id: '5',
    name: 'Procesamiento de Pagos',
    description: 'Integración con Stripe y PayPal',
    status: 'error',
    lastUpdated: '2024-01-20T08:45:00Z',
    uptime: 98.50,
  },
];

const recentEvents: IncidentEvent[] = [
  {
    id: '1',
    service: 'Procesamiento de Pagos',
    type: 'error',
    description: 'Interrupciones intermitentes en el procesamiento de pagos',
    date: '2024-01-20T08:45:00Z',
  },
  {
    id: '2',
    service: 'Almacenamiento',
    type: 'maintenance',
    description: 'Mantenimiento programado para optimización',
    date: '2024-01-20T09:15:00Z',
  },
  {
    id: '3',
    service: 'Base de Datos',
    type: 'resolved',
    description: 'Latencia elevada - Resuelto',
    date: '2024-01-19T15:30:00Z',
  },
];

const getStatusIcon = (status: ServiceStatus) => {
  switch (status) {
    case 'operational':
      return <CheckCircle size={20} weight="fill" />;
    case 'maintenance':
      return <Warning size={20} weight="fill" />;
    case 'error':
      return <X size={20} weight="fill" />;
  }
};

const getServiceIcon = (serviceName: string) => {
  switch (serviceName) {
    case 'Autenticación':
      return <Key size={24} weight="duotone" />;
    case 'Base de Datos (Firestore)':
      return <Database size={24} weight="duotone" />;
    case 'Almacenamiento':
      return <Cloud size={24} weight="duotone" />;
    case 'Notificaciones':
      return <Bell size={24} weight="duotone" />;
    case 'Procesamiento de Pagos':
      return <CreditCard size={24} weight="duotone" />;
    default:
      return <ArrowClockwise size={24} weight="duotone" />;
  }
};

export default function SystemStatusPage() {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hasIssues = services.some(service => service.status === 'error');
  const hasMaintenance = services.some(service => service.status === 'maintenance');

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.mode === 'dark' 
        ? `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.8)}, ${alpha(theme.palette.background.default, 0.95)})`
        : `linear-gradient(to bottom, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.background.default, 0.95)})`
    }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, flex: 1 }}>
        <Stack spacing={6}>
          {/* Encabezado */}
          <Stack spacing={2} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h3" fontWeight={700}>
              Estado del Sistema
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Monitoreo en tiempo real de todos los servicios de Assuriva
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última actualización: {currentTime.toLocaleTimeString()}
            </Typography>
          </Stack>

          {/* Alertas */}
          <Stack spacing={2}>
            {hasIssues && (
              <Alert 
                severity="error"
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                }}
              >
                Algunos servicios están experimentando problemas
              </Alert>
            )}
            {hasMaintenance && (
              <Alert 
                severity="warning"
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                }}
              >
                Mantenimiento programado en curso
              </Alert>
            )}
          </Stack>

          {/* Estado de Servicios */}
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              Servicios
            </Typography>
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <StyledCard>
                  <Box sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                      }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: '12px',
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          >
                            {getServiceIcon(service.name)}
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {service.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {service.description}
                            </Typography>
                          </Box>
                        </Stack>
                        <StatusChip
                          icon={getStatusIcon(service.status)}
                          label={
                            service.status === 'operational' ? 'Operativo' :
                            service.status === 'maintenance' ? 'Mantenimiento' :
                            'Error'
                          }
                          className={service.status}
                        />
                      </Box>
                      <Box sx={{ pt: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Rendimiento
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={service.uptime}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: 
                                service.status === 'operational' ? theme.palette.success.main :
                                service.status === 'maintenance' ? theme.palette.warning.main :
                                theme.palette.error.main,
                            },
                          }}
                        />
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          mt: 1,
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            Uptime: {service.uptime}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Última actualización: {new Date(service.lastUpdated).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </StyledCard>
              </motion.div>
            ))}
          </Stack>

          {/* Historial de Eventos */}
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              Historial de Eventos
            </Typography>
            <StyledCard>
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {recentEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        pb: index !== recentEvents.length - 1 ? 3 : 0,
                        borderBottom: index !== recentEvents.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                      }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: alpha(
                              event.type === 'error' ? theme.palette.error.main :
                              event.type === 'maintenance' ? theme.palette.warning.main :
                              theme.palette.success.main,
                              0.1
                            ),
                            color: 
                              event.type === 'error' ? theme.palette.error.main :
                              event.type === 'maintenance' ? theme.palette.warning.main :
                              theme.palette.success.main,
                          }}
                        >
                          {event.type === 'error' ? <X size={20} weight="bold" /> :
                           event.type === 'maintenance' ? <Warning size={20} weight="bold" /> :
                           <CheckCircle size={20} weight="bold" />}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {event.service}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(event.date).toLocaleString()}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {event.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </StyledCard>
          </Stack>

          {/* Resumen del Sistema */}
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              Resumen del Sistema
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
            }}>
              {[
                {
                  title: 'Disponibilidad General',
                  value: '99.95%',
                  icon: <ArrowClockwise size={24} weight="duotone" />,
                  color: theme.palette.success.main,
                },
                {
                  title: 'Servicios Operativos',
                  value: `${services.filter(s => s.status === 'operational').length}/${services.length}`,
                  icon: <CheckCircle size={24} weight="duotone" />,
                  color: theme.palette.primary.main,
                },
                {
                  title: 'Tiempo de Respuesta',
                  value: '120ms',
                  icon: <Clock size={24} weight="duotone" />,
                  color: theme.palette.info.main,
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ flex: 1 }}
                >
                  <StyledCard>
                    <Box sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            bgcolor: alpha(stat.color, 0.1),
                            color: stat.color,
                            width: 'fit-content',
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography variant="h4" fontWeight={700}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.title}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </StyledCard>
                </motion.div>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
}