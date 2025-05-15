'use client';

import { memo, useState, useEffect } from 'react';
import { Box, Container, Typography, Stack, Card, useTheme, Tooltip, Chip, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Import only the specific icons we need
import { RocketLaunch } from '@phosphor-icons/react/dist/ssr/RocketLaunch';
import { Lock } from '@phosphor-icons/react/dist/ssr/Lock';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Star } from '@phosphor-icons/react/dist/ssr/Star';
import { ChartLine } from '@phosphor-icons/react/dist/ssr/ChartLine';
import { Users } from '@phosphor-icons/react/dist/ssr/Users';
import { Bell } from '@phosphor-icons/react/dist/ssr/Bell';
import { Shield } from '@phosphor-icons/react/dist/ssr/Shield';
import { DesktopTower } from '@phosphor-icons/react/dist/ssr/DesktopTower';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';

// Simplified animation configuration
const ANIMATION_CONFIG = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }
};

// Colors configuration
const FEATURE_COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#00BCD4',
  secondary: '#9C27B0'
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

// Features data - memoized to prevent recreations
const features: Feature[] = [
  {
    icon: <RocketLaunch weight="duotone" />,
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
    icon: <ChartLine weight="duotone" />,
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
    icon: <Users weight="duotone" />,
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
    icon: <DesktopTower weight="duotone" />,
    title: 'Control de Pólizas',
    description: 'Seguimiento automático de vencimientos y renovaciones en un solo lugar.',
    details: ['Alertas automáticas', 'Renovaciones a tiempo', 'Estado de pólizas', 'Documentos digitales'],
    color: FEATURE_COLORS.error
  },
  {
    icon: <Bell weight="duotone" />,
    title: 'Alertas Inteligentes',
    description: 'Recibí notificaciones importantes y nunca más te pierdas un vencimiento.',
    details: ['Avisos personalizados', 'Priorización automática', 'Recordatorios', 'Seguimiento'],
    color: FEATURE_COLORS.info
  },
  {
    icon: <Shield weight="duotone" />,
    title: 'Seguridad Avanzada',
    description: 'Trabajá tranquilo con la máxima protección para tus datos y los de tus clientes.',
    details: ['Encriptación bancaria', 'Backups automáticos', 'Control de accesos', 'Auditoría completa'],
    color: FEATURE_COLORS.secondary
  }
];

// Benefits summary data
const benefitsSummary = [
  { icon: <Star weight="duotone" />, text: 'Sin curva de aprendizaje' },
  { icon: <RocketLaunch weight="duotone" />, text: 'Listo en minutos' },
  { icon: <Lock weight="duotone" />, text: 'Seguridad bancaria' }
];

const FeaturesSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Use intersection observer for more efficient animations
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('features-section');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  // Simplified analytics tracking
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
      id="features-section"
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        background: isDarkMode
          ? `linear-gradient(45deg, ${alpha(theme.palette.background.default, 0.94)}, ${alpha(theme.palette.background.default, 0.98)})`
          : `linear-gradient(45deg, ${alpha(FEATURE_COLORS.primary, 0.02)}, ${alpha(theme.palette.background.default, 0.98)})`,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={ANIMATION_CONFIG.container}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Header Section */}
          <Stack spacing={2} sx={{ mb: 8, textAlign: 'center' }}>
            <motion.div variants={ANIMATION_CONFIG.item}>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    backgroundColor: alpha(FEATURE_COLORS.primary, isDarkMode ? 0.15 : 0.1),
                    color: FEATURE_COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Shield weight="duotone" size={16} />
                  +500 corredores confían
                </Typography>
              </Box>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  background: `linear-gradient(120deg, ${FEATURE_COLORS.primary}, ${FEATURE_COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Todo lo que necesitás para transformar tu gestión diaria
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: isDarkMode ? 'grey.300' : 'grey.800',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                }}
              >
                Usado por más de 500 corredores para gestionar pólizas, tareas y clientes
                de forma inteligente y segura.
              </Typography>
            </motion.div>
          </Stack>

          {/* Features Grid - Optimized layout */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 3, md: 3 },
              mb: 8,
              '& > div': {
                display: 'flex',
                height: '100%',
              }
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={ANIMATION_CONFIG.item}
                style={{ height: '100%' }}
              >
                <Card
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: isDarkMode ? 'background.paper' : 'common.white',
                    transition: 'all 0.3s ease-in-out',
                    mb: 2,
                    ...(feature.highlighted && {
                      border: `2px solid ${alpha(feature.color || FEATURE_COLORS.primary, 0.35)}`,
                      boxShadow: `0 6px 20px ${alpha(feature.color || FEATURE_COLORS.primary, 0.25)}`,
                    })
                  }}
                >
                  <Stack spacing={2} sx={{ height: '100%' }}>
                    {/* Feature Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha(feature.color || FEATURE_COLORS.primary, isDarkMode ? 0.15 : 0.1),
                          color: feature.color || FEATURE_COLORS.primary,
                          fontSize: 28,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          }
                        }}
                      >
                        {feature.icon}
                      </Box>
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
                            <Star weight="fill" size={16} />
                          </Box>
                        </Tooltip>
                      )}
                    </Box>

                    {/* Feature Content */}
                    <Stack spacing={1.5} sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: '1.2rem',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDarkMode ? 'grey.400' : 'grey.700',
                          lineHeight: 1.6,
                          fontSize: '0.875rem',
                        }}
                      >
                        {feature.description}
                      </Typography>

                      {/* Feature Details */}
                      <Stack spacing={0.75}>
                        {feature.details.map((detail, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <CheckCircle
                              weight="fill"
                              size={14}
                              color={feature.color || FEATURE_COLORS.primary}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: isDarkMode ? 'grey.400' : 'grey.700',
                                fontSize: '0.8rem',
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
                            mb: 1,
                            height: '24px',
                            '& .MuiChip-label': {
                              fontSize: '0.7rem',
                              px: 1,
                            }
                          }}
                        />
                      )}

                      {/* Metric */}
                      {feature.metric && (
                        <Box
                          sx={{
                            mt: 'auto',
                            pt: 1.5,
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
                                fontSize: '1.4rem',
                                fontWeight: 700,
                              }}
                            >
                              {feature.metric.value}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                opacity: 0.9,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: 500,
                                fontSize: '0.7rem',
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
          </Box>

          {/* Benefits Summary - Simplified */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
            justifyContent="center"
            sx={{
              mt: 4,
              mb: 6,
              px: { xs: 2, sm: 3 },
              py: 2,
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
                  py: { xs: 0.5, sm: 0 },
                }}
              >
                <Box sx={{ color: FEATURE_COLORS.primary, display: 'flex' }}>
                  {benefit.icon}
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  {benefit.text}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* CTA Section - Simplified */}
          <motion.div
            variants={ANIMATION_CONFIG.item}
          >
            <Stack
              alignItems="center"
              spacing={2}
              sx={{
                p: { xs: 2, md: 3 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  maxWidth: 600,
                  color: isDarkMode ? 'grey.100' : 'grey.900',
                  fontSize: { xs: '1.4rem', md: '1.5rem' },
                }}
              >
                ¿Querés todas estas herramientas trabajando para vos?
              </Typography>
              
              <Button
                variant="contained"
                href="/pricing"
                onClick={handleCtaClick}
                endIcon={<ArrowRight weight="bold" />}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: FEATURE_COLORS.primary,
                  '&:hover': {
                    backgroundColor: alpha(FEATURE_COLORS.primary, 0.9),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 12px ${alpha(FEATURE_COLORS.primary, 0.25)}`,
                  },
                }}
              >
                Descubrí cómo empezar
              </Button>
              
              <Stack spacing={1} alignItems="center">
                <Typography
                  variant="caption"
                  sx={{
                    color: isDarkMode ? 'grey.400' : 'grey.600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '0.75rem',
                  }}
                >
                  <Lock weight="fill" size={12} />
                  Sin compromiso. Cancelá cuando quieras.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: FEATURE_COLORS.success,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                >
                  <Star weight="fill" size={12} />
                  7 días de prueba gratis
                </Typography>
              </Stack>
            </Stack>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default memo(FeaturesSection);