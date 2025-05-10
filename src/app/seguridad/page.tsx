'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  Alert,
  useTheme,
  alpha,
  styled,
  Chip,
} from '@mui/material';
import {
  Shield,
  LockKey,
  Database,
  Eye,
  LockSimple,
  Fingerprint,
  CheckCircle,
  Warning,
  Lightning,
  Clock,
  User,
  Lock,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

// Componentes estilizados
const StyledCard = styled(motion(Card))(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const TechChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

// Datos de seguridad
const securityFeatures = [
  {
    icon: <LockKey size={28} weight="duotone" />,
    title: 'Autenticación Segura',
    description: 'Sistema de autenticación robusto con Firebase Auth, verificación en dos pasos y validación de correo electrónico.',
  },
  {
    icon: <Database size={28} weight="duotone" />,
    title: 'Datos Segmentados',
    description: 'Cada corredor accede únicamente a su información, garantizando la privacidad y separación de datos entre usuarios.',
  },
  {
    icon: <LockSimple size={28} weight="duotone" />,
    title: 'Cifrado Avanzado',
    description: 'Todos los datos son cifrados en tránsito y en reposo utilizando algoritmos de encriptación AES-256.',
  },
  {
    icon: <Eye size={28} weight="duotone" />,
    title: 'Monitoreo Continuo',
    description: 'Sistema de monitoreo 24/7 para detectar y prevenir accesos no autorizados y comportamientos sospechosos.',
  },
  {
    icon: <Clock size={28} weight="duotone" />,
    title: 'Backups Automáticos',
    description: 'Copias de seguridad automáticas y redundantes para garantizar la disponibilidad de tu información.',
  },
  {
    icon: <Shield size={28} weight="duotone" />,
    title: 'Protección contra Ataques',
    description: 'Implementación de medidas de seguridad contra XSS, CSRF y otros tipos de ataques web.',
  },
];

const technologies = [
  { name: 'Firebase Auth', icon: <LockKey size={20} /> },
  { name: 'Cloud Firestore', icon: <Database size={20} /> },
  { name: 'SSL/TLS', icon: <Lock size={20} /> },
  { name: 'AES-256', icon: <Shield size={20} /> },
  { name: 'OAuth 2.0', icon: <User size={20} /> },
  { name: 'HTTPS', icon: <Lightning size={20} /> },
];

export default function SecurityPage() {
  const theme = useTheme();

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

      {/* Hero Section */}
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <IconBox sx={{ mx: 'auto', mb: 3 }}>
                <Shield size={32} weight="duotone" />
              </IconBox>
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Seguridad y Protección de Datos
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                Tu información es nuestra prioridad. Implementamos los más altos estándares
                de seguridad para proteger tus datos y los de tus clientes.
              </Typography>
            </motion.div>

            <Alert 
              severity="info" 
              icon={<Fingerprint size={24} />}
              sx={{ 
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                maxWidth: 800,
              }}
            >
              Assuriva cumple con todas las normativas de protección de datos y
              estándares de seguridad de la industria aseguradora.
            </Alert>
          </Stack>
        </Container>
      </Box>

      {/* Contenido Principal */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={8}>
          {/* Nuestro Compromiso */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Nuestro Compromiso
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
            }}>
              <StyledCard sx={{ flex: 1 }}>
                <Box sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <IconBox>
                      <Shield size={28} weight="duotone" />
                    </IconBox>
                    <Typography variant="h5" fontWeight={600}>
                      Seguridad desde el Diseño
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      La seguridad está en el núcleo de nuestra plataforma. Cada característica
                      y funcionalidad se desarrolla teniendo en cuenta la protección de datos
                      como prioridad absoluta.
                    </Typography>
                  </Stack>
                </Box>
              </StyledCard>

              <StyledCard sx={{ flex: 1 }}>
                <Box sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <IconBox>
                      <Lock size={28} weight="duotone" />
                    </IconBox>
                    <Typography variant="h5" fontWeight={600}>
                      Privacidad Garantizada
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Implementamos las mejores prácticas y tecnologías más avanzadas para
                      garantizar la confidencialidad y privacidad de toda la información
                      almacenada en nuestra plataforma.
                    </Typography>
                  </Stack>
                </Box>
              </StyledCard>
            </Box>
          </Stack>

          {/* Características de Seguridad */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              ¿Cómo Protegemos tu Información?
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}>
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StyledCard>
                    <Box sx={{ p: 3 }}>
                      <Stack direction="row" spacing={3} alignItems="center">
                        <IconBox>
                          {feature.icon}
                        </IconBox>
                        <Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {feature.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </StyledCard>
                </motion.div>
              ))}
            </Box>
          </Stack>


          {/* Tecnologías */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Tecnologías de Seguridad
            </Typography>
            <StyledCard>
              <Box sx={{ p: 4 }}>
                <Stack spacing={4}>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    Utilizamos las tecnologías más avanzadas y confiables del mercado para
                    garantizar la seguridad de tu información:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}>
                    {technologies.map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TechChip
                          icon={tech.icon}
                          label={tech.name}
                          sx={{ px: 2, py: 2.5 }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Stack>
              </Box>
            </StyledCard>
          </Stack>

          {/* Certificaciones y Cumplimiento */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Certificaciones y Cumplimiento
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
            }}>
              {[
                {
                  icon: <CheckCircle size={28} weight="duotone" />,
                  title: 'ISO 27001',
                  description: 'Certificación en gestión de seguridad de la información',
                },
                {
                  icon: <Shield size={28} weight="duotone" />,
                  title: 'GDPR Compliant',
                  description: 'Cumplimiento con regulaciones de protección de datos',
                },
                {
                  icon: <Warning size={28} weight="duotone" />,
                  title: 'Auditorías Regulares',
                  description: 'Evaluaciones periódicas de seguridad',
                },
              ].map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ flex: 1 }}
                >
                  <StyledCard sx={{ height: '100%' }}>
                    <Box sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <IconBox>
                          {cert.icon}
                        </IconBox>
                        <Typography variant="h6" fontWeight={600}>
                          {cert.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cert.description}
                        </Typography>
                      </Stack>
                    </Box>
                  </StyledCard>
                </motion.div>
              ))}
            </Box>
          </Stack>

          {/* Compromiso de Confianza */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Nuestro Compromiso de Confianza
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
            }}>
              <StyledCard sx={{ flex: 1 }}>
                <Box sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <IconBox>
                      <Lightning size={28} weight="duotone" />
                    </IconBox>
                    <Typography variant="h5" fontWeight={600}>
                      Monitoreo 24/7
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Nuestro equipo de seguridad monitorea constantemente la plataforma
                      para detectar y prevenir cualquier actividad sospechosa.
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CheckCircle size={20} color={theme.palette.success.main} />
                        <Typography variant="body2" color="success.main">
                          Sistema actualmente seguro y monitoreado
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </StyledCard>

              <StyledCard sx={{ flex: 1 }}>
                <Box sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <IconBox>
                      <Clock size={28} weight="duotone" />
                    </IconBox>
                    <Typography variant="h5" fontWeight={600}>
                      Respuesta Inmediata
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Contamos con protocolos de respuesta inmediata ante cualquier
                      incidente de seguridad, garantizando la protección continua de tus datos.
                    </Typography>
                    <Alert 
                      severity="info"
                      sx={{ 
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                      }}
                    >
                      Tiempo medio de respuesta: &lt; 15 minutos
                    </Alert>
                  </Stack>
                </Box>
              </StyledCard>
            </Box>
          </Stack>

          {/* Mensaje Final */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Tu Seguridad es Nuestra Prioridad
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 800,
                  mx: 'auto',
                  mb: 4,
                  lineHeight: 1.8,
                }}
              >
                En Assuriva, construimos cada característica pensando primero en la seguridad.
                Tu confianza es nuestro activo más valioso.
              </Typography>
              <Alert 
                severity="success"
                sx={{ 
                  maxWidth: 600,
                  mx: 'auto',
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                }}
              >
                Todos los datos están protegidos con los más altos estándares de seguridad
              </Alert>
            </motion.div>
          </Box>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
}