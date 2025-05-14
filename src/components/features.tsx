'use client';

declare global {
  interface Window {
    gtag: (command: string, action: string, params: object) => void;
  }
}

import { Work_Sans, Inter } from 'next/font/google';
import { Box, Container, Typography, Stack, Card, useTheme, Tooltip, Chip, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AutoAwesome as AutoAwesomeIcon,
  RocketLaunch as RocketLaunchIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  NotificationsActive as NotificationsIcon,
  Shield as ShieldIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

// Font configuration
const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Animation configurations
const ANIMATION_CONFIG = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  hover: {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 120 }
  },
  tap: {
    scale: 0.98
  }
};

// Feature interface
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  metric?: {
    value: string;
    label: string;
  };
  highlighted?: boolean;
  color?: string;
  socialProof?: {
    count: number;
    label: string;
  };
}

// Colors configuration
const FEATURE_COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#00BCD4',
  secondary: '#9C27B0'
};

// Features data
const features: Feature[] = [
  {
    icon: <RocketLaunchIcon sx={{ fontSize: 32 }} />,
    title: 'Productividad Total',
    description: 'Automatizá tareas repetitivas y reducí 6+ horas semanales de trabajo administrativo.',
    details: ['Automatización inteligente', 'Flujos de trabajo', 'Tareas programadas', 'Plantillas personalizadas'],
    metric: {
      value: '+6h',
      label: 'ahorradas por semana'
    },
    highlighted: true,
    color: FEATURE_COLORS.primary,
    socialProof: {
      count: 300,
      label: 'corredores activos'
    }
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 32 }} />,
    title: 'Análisis en Tiempo Real',
    description: 'Tomá mejores decisiones con datos actualizados y métricas claras de tu cartera.',
    details: ['Dashboard personalizable', 'KPIs en tiempo real', 'Reportes exportables', 'Tendencias y proyecciones'],
    metric: {
      value: '100%',
      label: 'visibilidad de cartera'
    },
    color: FEATURE_COLORS.success
  },
  {
    icon: <GroupIcon sx={{ fontSize: 32 }} />,
    title: 'Gestión de Clientes',
    description: 'Organizá y segmentá tu cartera de clientes para brindar atención personalizada.',
    details: ['Perfiles detallados', 'Segmentación avanzada', 'Historial completo', 'Documentación digital'],
    metric: {
      value: '+40%',
      label: 'retención de clientes'
    },
    color: FEATURE_COLORS.warning
  },
  {
    icon: <DashboardIcon sx={{ fontSize: 32 }} />,
    title: 'Control de Pólizas',
    description: 'Seguimiento automático de vencimientos y renovaciones en un solo lugar.',
    details: ['Alertas automáticas', 'Renovaciones a tiempo', 'Estado de pólizas', 'Documentos digitales'],
    color: FEATURE_COLORS.error
  },
  {
    icon: <NotificationsIcon sx={{ fontSize: 32 }} />,
    title: 'Alertas Inteligentes',
    description: 'Recibí notificaciones importantes y nunca más te pierdas un vencimiento.',
    details: ['Avisos personalizados', 'Priorización automática', 'Recordatorios', 'Seguimiento'],
    color: FEATURE_COLORS.info
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 32 }} />,
    title: 'Seguridad Avanzada',
    description: 'Trabajá tranquilo con la máxima protección para tus datos y los de tus clientes.',
    details: ['Encriptación bancaria', 'Backups automáticos', 'Control de accesos', 'Auditoría completa'],
    color: FEATURE_COLORS.secondary
  }
];

// Benefits summary data
const benefitsSummary = [
  { icon: <AutoAwesomeIcon />, text: 'Sin curva de aprendizaje' },
  { icon: <RocketLaunchIcon />, text: 'Listo en minutos' },
  { icon: <SecurityIcon />, text: 'Seguridad bancaria' }
];

export default function FeaturesSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_features_section_clicked', {
        event_category: 'engagement',
        event_label: 'features_section'
      });
    }
  };

  return (
    <Box
      component="section"
      className={`${workSans.variable} ${inter.variable}`}
      sx={{
        py: { xs: 8, md: 12 },
        background: isDarkMode
          ? `linear-gradient(45deg, ${alpha(theme.palette.background.default, 0.94)}, ${alpha(theme.palette.background.default, 0.98)})`
          : `linear-gradient(45deg, ${alpha(FEATURE_COLORS.primary, 0.02)}, ${alpha(theme.palette.background.default, 0.98)})`,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={ANIMATION_CONFIG.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Header Section */}
          <Stack spacing={3} sx={{ mb: 12, textAlign: 'center' }}>
            <motion.div variants={ANIMATION_CONFIG.item}>
              <Box
                sx={{
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    px: 2.5,
                    py: 0.75,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    letterSpacing: 1.2,
                    fontFamily: 'var(--font-work-sans)',
                    textTransform: 'uppercase',
                    backgroundColor: alpha(FEATURE_COLORS.primary, isDarkMode ? 0.15 : 0.1),
                    color: FEATURE_COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ShieldIcon fontSize="small" />
                  +500 corredores confían
                </Typography>
              </Box>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontFamily: 'var(--font-work-sans)',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: `linear-gradient(120deg, ${FEATURE_COLORS.primary}, ${FEATURE_COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: isDarkMode ? '0px 1px 4px rgba(0,0,0,0.6)' : 'none',
                }}
              >
                Todo lo que necesitás para transformar tu gestión diaria
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: isDarkMode ? 'grey.300' : 'grey.800',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                Usado por más de 500 corredores para gestionar pólizas, tareas y clientes
                de forma inteligente y segura.
              </Typography>
            </motion.div>
          </Stack>

          {/* Features Grid - Updated spacing */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 4, md: 4 },
              mb: 16,
              '& > div': {
                display: 'flex',
                height: '100%',
              }
            }}
          >
            <AnimatePresence>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={ANIMATION_CONFIG.item}
                  whileHover={ANIMATION_CONFIG.hover}
                  whileTap={ANIMATION_CONFIG.tap}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 4,
                      borderRadius: 4,
                      backgroundColor: isDarkMode ? 'background.paper' : 'common.white',
                      transition: 'all 0.3s ease-in-out',
                      mb: 2, // Added bottom margin
                      ...(feature.highlighted && {
                       border: `2px solid ${alpha(feature.color || FEATURE_COLORS.primary, 0.35)}`,
                        boxShadow: `0 6px 28px ${alpha(feature.color || FEATURE_COLORS.primary, 0.25)}`,
                      })
                    }}
                  >
                    <Stack spacing={3} sx={{ height: '100%' }}>
                      {/* Feature Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: alpha(feature.color || FEATURE_COLORS.primary, isDarkMode ? 0.15 : 0.1),
                              color: feature.color || FEATURE_COLORS.primary,
                            }}
                          >
                            {feature.icon}
                          </Box>
                        </motion.div>
                        {feature.highlighted && (
                          <Tooltip title="Más popular">
                            <Box
                              sx={{
                                color: feature.color || FEATURE_COLORS.primary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <StarIcon fontSize="small" />
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      {/* Feature Content */}
                      <Stack spacing={2} sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: 'var(--font-work-sans)',
                            fontWeight: 600,
                            fontSize: '1.25rem',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            color: isDarkMode ? 'grey.400' : 'grey.700',
                            lineHeight: 1.7,
                          }}
                        >
                          {feature.description}
                        </Typography>

                        {/* Feature Details */}
                        <Stack spacing={1}>
                          {feature.details.map((detail, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <CheckCircleIcon
                                sx={{
                                  fontSize: 14,
                                  color: feature.color || FEATURE_COLORS.primary,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'var(--font-inter)',
                                  color: isDarkMode ? 'grey.400' : 'grey.700',
                                }}
                              >
                                {detail}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>

                        {/* Social Proof */}
                        {feature.socialProof && (
                          <Chip
                            size="small"
                            color="success"
                            label={`Usado por +${feature.socialProof.count} ${feature.socialProof.label}`}
                            sx={{
                              alignSelf: 'flex-start',
                              mt: 'auto',
                              mb: 2,
                            }}
                          />
                        )}

                        {/* Metric */}
                        {feature.metric && (
                          <Box
                            sx={{
                              mt: 'auto',
                              pt: 2,
                              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="baseline"
                              sx={{
                                color: feature.color || FEATURE_COLORS.primary,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: 'var(--font-work-sans)',
                                  fontSize: '1.5rem',
                                  fontWeight: 700,
                                }}
                              >
                                {feature.metric.value}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: 'var(--font-inter)',
                                  opacity: 0.9,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  fontWeight: 500,
                                }}
                              >
                                {feature.metric.label}
                              </Typography>
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    </Stack>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>

          {/* Benefits Summary */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 4 }}
            justifyContent="center"
            sx={{
              mt: 8,
              mb: 8,
              px: { xs: 2, sm: 4 },
              py: 3,
              backgroundColor: isDarkMode ? alpha(FEATURE_COLORS.primary, 0.1) : alpha(FEATURE_COLORS.primary, 0.05),
              borderRadius: 2,
            }}
          >
            {benefitsSummary.map((benefit, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: isDarkMode ? 'grey.300' : 'grey.700',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                <Box sx={{ color: FEATURE_COLORS.primary }}>
                  {benefit.icon}
                </Box>
                <Typography variant="body2">{benefit.text}</Typography>
              </Box>
            ))}
          </Stack>

          {/* CTA Section */}
          <motion.div
            variants={ANIMATION_CONFIG.item}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Stack
              alignItems="center"
              spacing={3}
              sx={{
                p: { xs: 3, md: 4 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'var(--font-work-sans)',
                  fontWeight: 700,
                  textAlign: 'center',
                  maxWidth: 600,
                  color: isDarkMode ? 'grey.100' : 'grey.900',
                }}
              >
                ¿Querés todas estas herramientas trabajando para vos?
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  href="/pricing"
                  onClick={handleCtaClick}
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontFamily: 'var(--font-work-sans)',
                    backgroundColor: FEATURE_COLORS.primary,
                    '&:hover': {
                      backgroundColor: alpha(FEATURE_COLORS.primary, 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 16px ${alpha(FEATURE_COLORS.primary, 0.25)}`,
                    },
                  }}
                >
                  Descubrí cómo empezar
                </Button>
              </motion.div>
              <Stack spacing={1} alignItems="center">
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    color: isDarkMode ? 'grey.400' : 'grey.600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <SecurityIcon fontSize="small" />
                  Sin compromiso. Cancelá cuando quieras.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    color: FEATURE_COLORS.success,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 500,
                  }}
                >
                  <StarIcon fontSize="small" />
                  7 días de prueba gratis
                </Typography>
              </Stack>
            </Stack>
          </motion.div>

          {/* Mobile Sticky CTA */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              backgroundColor: isDarkMode ? 'background.paper' : 'background.default',
              borderTop: `1px solid ${alpha(FEATURE_COLORS.primary, 0.1)}`,
              zIndex: 1000,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%' }}
            >
              <Button
                fullWidth
                variant="contained"
                href="/pricing"
                onClick={handleCtaClick}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: 'var(--font-work-sans)',
                  backgroundColor: FEATURE_COLORS.primary,
                  '&:hover': {
                    backgroundColor: alpha(FEATURE_COLORS.primary, 0.9),
                  },
                }}
              >
                Empezar gratis
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}