'use client';

import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  Button,
  useTheme,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Rocket as RocketIcon,
  AutoAwesome as AutoAwesomeIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Support as SupportIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useRef } from 'react';

// Font configuration
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Types
interface Step {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
  color: string;
  metrics?: {
    value: string;
    label: string;
  };
}

// Colors configuration
const COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#00BCD4',
  secondary: '#9C27B0',
};

// Animation variants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  },
  item: {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  hover: {
    scale: 1.03,
    transition: { type: 'spring', stiffness: 140 }
  },
  tap: {
    scale: 0.98
  }
};

// Steps data
const steps: Step[] = [
  {
    id: 1,
    icon: <RocketIcon sx={{ fontSize: 32 }} />,
    title: 'Empezá en minutos',
    description: 'Registrate y configurá tu perfil profesional con unos pocos clicks.',
    benefit: 'Sin instalaciones ni configuraciones complejas.',
    color: COLORS.primary,
    metrics: {
      value: '2min',
      label: 'setup inicial'
    }
  },
  {
    id: 2,
    icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
    title: 'Importá tu cartera',
    description: 'Cargá tus clientes y pólizas actuales de forma masiva o individual.',
    benefit: 'Olvidate de cargar datos manualmente.',
    color: COLORS.success,
    metrics: {
      value: '+1000',
      label: 'pólizas importadas'
    }
  },
  {
    id: 3,
    icon: <AnalyticsIcon sx={{ fontSize: 32 }} />,
    title: 'Automatizá seguimientos',
    description: 'Configurá alertas y recordatorios para vencimientos y renovaciones.',
    benefit: 'Nunca más perdés una venta por vencimiento.',
    color: COLORS.warning
  },
  {
    id: 4,
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: 'Gestioná con seguridad',
    description: 'Accedé a toda tu información desde cualquier dispositivo.',
    benefit: 'Tus datos protegidos con seguridad bancaria.',
    color: COLORS.error
  },
  {
    id: 5,
    icon: <SupportIcon sx={{ fontSize: 32 }} />,
    title: 'Crecé con nosotros',
    description: 'Recibí soporte personalizado y capacitación continua.',
    benefit: 'Te acompañamos en cada paso.',
    color: COLORS.secondary
  }
];

// StepCard Component
const StepCard = motion(Card);

export default function HowItWorksSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'how_it_works_cta_click', {
        event_category: 'conversion',
        event_label: 'how_it_works_section'
      });
    }
  };

  return (
    <Box
      component="section"
      ref={containerRef}
      className={`${plusJakartaSans.variable} ${inter.variable}`}
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
        background: isDarkMode
          ? `linear-gradient(45deg, ${alpha(theme.palette.background.default, 0.94)}, ${alpha(theme.palette.background.default, 0.98)})`
          : `linear-gradient(45deg, ${alpha(COLORS.primary, 0.02)}, ${alpha(theme.palette.background.default, 0.98)})`,
      }}
    >
      {/* Decorative Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          zIndex: 0,
        }}
      >
        {/* Blurred Shapes */}
        <motion.div style={{ opacity: backgroundOpacity }}>
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '30%',
              height: '30%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(COLORS.primary, 0.2)} 0%, transparent 70%)`,
              filter: 'blur(64px)',
            }}
          />
        </motion.div>
        <motion.div style={{ opacity: backgroundOpacity }}>
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: '25%',
              height: '25%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(COLORS.secondary, 0.2)} 0%, transparent 70%)`,
              filter: 'blur(64px)',
            }}
          />
        </motion.div>
      </Box>

      <Container maxWidth="lg">
        <motion.div
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Header Section */}
          <Stack spacing={3} sx={{ mb: 8, textAlign: 'center', position: 'relative' }}>
            <motion.div variants={ANIMATION_VARIANTS.item}>
              <Typography
                variant="overline"
                sx={{
                  mb: 2,
                  display: 'inline-block',
                  px: 2.5,
                  py: 0.75,
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  letterSpacing: 1.2,
                  fontFamily: 'var(--font-plus-jakarta)',
                  textTransform: 'uppercase',
                  backgroundColor: alpha(COLORS.primary, isDarkMode ? 0.15 : 0.1),
                  color: COLORS.primary,
                }}
              >
                Proceso simple
              </Typography>

              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontFamily: 'var(--font-plus-jakarta)',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ¿Cómo funciona Assuriva?
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: isDarkMode ? 'grey.300' : 'grey.800',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                En 5 simples pasos automatizás tu gestión y recuperás tiempo valioso
              </Typography>
            </motion.div>
          </Stack>

          {/* Steps Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 4, md: 5 },
              mb: { xs: 6, md: 8 },
              '& > div': {
                display: 'flex',
                height: '100%',
              }
            }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.id}
                variants={ANIMATION_VARIANTS.item}
                whileHover={ANIMATION_VARIANTS.hover}
                whileTap={ANIMATION_VARIANTS.tap}
                style={{
                  display: 'flex',
                  height: '100%',
                  marginBottom: '24px'
                }}
              >
                <StepCard
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    backgroundColor: isDarkMode ? 'background.paper' : 'common.white',
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: theme.shadows[1],
                    mb: 3,
                    '&:hover': {
                      boxShadow: `0 8px 24px ${alpha(step.color, 0.15)}`,
                    },
                  }}
                >
                  <Stack spacing={3} sx={{ height: '100%' }}>
                    {/* Step Number and Icon */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ flexShrink: 0 }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha(step.color, isDarkMode ? 0.15 : 0.1),
                          color: step.color,
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'var(--font-plus-jakarta)',
                          color: step.color,
                          fontSize: '1.5rem',
                          fontWeight: 700,
                        }}
                      >
                        {step.id.toString().padStart(2, '0')}
                      </Typography>
                    </Stack>

                    {/* Content */}
                    <Stack spacing={2} sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'var(--font-plus-jakarta)',
                          fontWeight: 600,
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDarkMode ? 'grey.400' : 'grey.700',
                          fontFamily: 'var(--font-inter)',
                          lineHeight: 1.7,
                        }}
                      >
                        {step.description}
                      </Typography>

                      {/* Benefit */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 'auto',
                          pt: 2,
                        }}
                      >
                        <CheckCircleIcon
                          sx={{
                            fontSize: 16,
                            color: step.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDarkMode ? 'grey.400' : 'grey.700',
                            fontFamily: 'var(--font-inter)',
                            fontStyle: 'italic',
                          }}
                        >
                          {step.benefit}
                        </Typography>
                      </Box>

                      {/* Metrics */}
                      {step.metrics && (
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
                              color: step.color,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: 'var(--font-plus-jakarta)',
                                fontWeight: 700,
                              }}
                            >
                              {step.metrics.value}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: 'var(--font-inter)',
                                opacity: 0.9,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {step.metrics.label}
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </Stack>
                </StepCard>
              </motion.div>
            ))}
          </Box>

          {/* CTA Section */}
          <motion.div variants={ANIMATION_VARIANTS.item}>
            <Stack
              alignItems="center"
              spacing={3}
              sx={{
                p: { xs: 3, md: 4 },
              }}
            >
              {/* Trust Indicators */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AvatarGroup max={3}>
                    {[...Array(3)].map((_, i) => (
                      <Avatar
                        key={i}
                        alt={`User ${i + 1}`}
                        src={`/avatars/user-${i + 1}.jpg`}
                        sx={{ width: 32, height: 32 }}
                      />
                    ))}
                  </AvatarGroup>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: isDarkMode ? 'grey.400' : 'grey.600',
                    }}
                  >
                    +500 usuarios activos
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: COLORS.warning }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: isDarkMode ? 'grey.400' : 'grey.600',
                    }}
                  >
                    4.9/5 en satisfacción
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'var(--font-plus-jakarta)',
                  fontWeight: 700,
                  textAlign: 'center',
                  maxWidth: 600,
                }}
              >
                ¿Listo para automatizar tu gestión?
              </Typography>

              {/* Free Trial Badge */}
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.success,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontFamily: 'var(--font-inter)',
                }}
              >
                7 días gratis · Cancelá cuando quieras
              </Typography>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  href="/pricing"
                  endIcon={<ArrowIcon />}
                  onClick={handleCtaClick}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontFamily: 'var(--font-plus-jakarta)',
                    backgroundColor: COLORS.primary,
                    '&:hover': {
                      backgroundColor: alpha(COLORS.primary, 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 16px ${alpha(COLORS.primary, 0.25)}`,
                    },
                  }}
                >
                  Gestioná como +500 corredores
                </Button>
              </motion.div>

              {/* Support Badge */}
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
                <SupportIcon fontSize="small" />
                Soporte personalizado 24/7
              </Typography>
            </Stack>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}