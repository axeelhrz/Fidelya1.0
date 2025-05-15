'use client';

import { Box, Button, Card, Container, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion, useScroll, useTransform } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

// Import only the specific icons we need using optimized imports
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { Shield } from '@phosphor-icons/react/dist/ssr/Shield';
import { FileText } from '@phosphor-icons/react/dist/ssr/FileText';
import { Users } from '@phosphor-icons/react/dist/ssr/Users';
import { Bell } from '@phosphor-icons/react/dist/ssr/Bell';
import { Layout } from '@phosphor-icons/react/dist/ssr/Layout';
import { Star } from '@phosphor-icons/react/dist/ssr/Star';

// Simplified animation config with reduced complexity
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

// Predefined colors to avoid recalculations
const COLORS = {
  primary: {
    light: '#2196F3',
    dark: '#90CAF9'
  },
  success: {
    light: '#4CAF50',
    dark: '#81C784'
  },
  warning: {
    light: '#FF9800',
    dark: '#FFB74D'
  },
  error: {
    light: '#F44336',
    dark: '#E57373'
  },
  info: {
    light: '#00BCD4',
    dark: '#4DD0E1'
  },
  secondary: {
    light: '#9C27B0',
    dark: '#BA68C8'
  }
};

// Memoized benefits data to prevent recreations
const benefits = [
  {
    icon: <Clock weight="duotone" />,
    title: 'Automatizá sin perder el control',
    description: 'Recuperá hasta 15 horas mensuales automatizando tareas repetitivas. 98% de nuestros usuarios renuevan sin necesidad de seguimiento.',
    color: COLORS.primary,
    metric: {
      value: '15h',
      label: 'menos admin por mes'
    },
    featured: true,
    rating: {
      value: 4.9,
      count: 128
    }
  },
  {
    icon: <FileText weight="duotone" />,
    title: 'Control total de pólizas',
    description: 'Seguimiento automático de vencimientos y renovaciones. Nunca más te pierdas una oportunidad de venta o renovación.',
    color: COLORS.success,
    metric: {
      value: '100%',
      label: 'de pólizas controladas'
    },
    featured: true
  },
  {
    icon: <Users weight="duotone" />,
    title: 'Clientes satisfechos',
    description: 'Brindá atención profesional y personalizada. Tus clientes sentirán la diferencia de trabajar con un corredor organizado.',
    color: COLORS.warning,
    metric: {
      value: '+40%',
      label: 'retención de clientes'
    }
  },
  {
    icon: <Bell weight="duotone" />,
    title: 'Alertas inteligentes',
    description: 'Sistema proactivo que te avisa antes de cada vencimiento. La tranquilidad de saber que nada se te escapa.',
    color: COLORS.error
  },
  {
    icon: <Shield weight="duotone" />,
    title: 'Máxima seguridad',
    description: 'Tus datos protegidos con encriptación bancaria y respaldos automáticos. La seguridad que tu negocio merece.',
    color: COLORS.info
  },
  {
    icon: <Layout weight="duotone" />,
    title: 'Diseño intuitivo',
    description: 'Interfaz simple y moderna que hace fácil lo complejo. Empezá a usar el sistema en minutos, no en semanas.',
    color: COLORS.secondary
  }
];

// Memoized component to prevent unnecessary re-renders
const BenefitsSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { scrollYProgress } = useScroll();
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);
  
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
    
    const element = document.getElementById('benefits-section');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      id="benefits-section"
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: isDarkMode ? 'background.default' : 'grey.50',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: `
            radial-gradient(circle at 20% 20%, ${alpha(COLORS.primary[isDarkMode ? 'dark' : 'light'], 0.4)}, transparent 40%),
            radial-gradient(circle at 80% 80%, ${alpha(COLORS.success[isDarkMode ? 'dark' : 'light'], 0.4)}, transparent 40%)
          `,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={ANIMATION_CONFIG.container}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <Stack spacing={6}>
            <Stack spacing={2} sx={{ mb: 6, textAlign: 'center' }}>
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
                      fontFamily: 'Work Sans',
                      textTransform: 'uppercase',
                      backgroundColor: alpha(COLORS.primary[isDarkMode ? 'dark' : 'light'], 0.15),
                      color: COLORS.primary[isDarkMode ? 'dark' : 'light'],
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Shield weight="fill" />
                    +500 corredores confían
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontFamily: 'Plus Jakarta Sans',
                    background: `linear-gradient(135deg, 
                      ${COLORS.primary[isDarkMode ? 'dark' : 'light']}, 
                      ${COLORS.secondary[isDarkMode ? 'dark' : 'light']}
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Todo lo que necesitás para crecer
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? 'grey.300' : 'grey.800',
                    maxWidth: 800,
                    mx: 'auto',
                    lineHeight: 1.6,
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    fontFamily: 'Inter',
                  }}
                >
                  Transformá tu forma de trabajar con herramientas diseñadas
                  específicamente para corredores de seguros.
                </Typography>
              </motion.div>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 2, md: 3 },
                justifyContent: 'center',
                alignItems: 'stretch',
              }}
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  variants={ANIMATION_CONFIG.item}
                  style={{
                    flex: '1 1 300px',
                    minWidth: '280px',
                    maxWidth: '380px',
                    display: 'flex',
                    scale: cardScale,
                  }}
                >
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      minHeight: 300,
                      p: 3,
                      position: 'relative',
                      borderRadius: 3,
                      backgroundColor: isDarkMode ? 'background.paper' : 'common.white',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${alpha(
                        benefit.color[isDarkMode ? 'dark' : 'light'],
                        isDarkMode ? 0.2 : 0.1
                      )}`,
                      boxShadow: `0 8px 20px ${alpha(
                        benefit.color[isDarkMode ? 'dark' : 'light'],
                        0.04
                      )}`,
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `
                          0 12px 24px ${alpha(
                            benefit.color[isDarkMode ? 'dark' : 'light'],
                            0.08
                          )},
                          0 0 0 1px ${alpha(
                            benefit.color[isDarkMode ? 'dark' : 'light'],
                            0.2
                          )}
                        `,
                        '& .benefit-icon': {
                          transform: 'scale(1.05)',
                        }
                      },
                      '&::before': benefit.featured ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        background: `linear-gradient(180deg, 
                          ${alpha(benefit.color[isDarkMode ? 'dark' : 'light'], 0.05)} 0%, 
                          transparent 100%
                        )`,
                        borderRadius: 3,
                        zIndex: 0,
                      } : {},
                    }}
                  >
                    <Stack
                      spacing={2}
                      sx={{
                        height: '100%',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <Box
                        className="benefit-icon"
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha(
                            benefit.color[isDarkMode ? 'dark' : 'light'],
                            isDarkMode ? 0.15 : 0.1
                          ),
                          color: benefit.color[isDarkMode ? 'dark' : 'light'],
                          fontSize: 28,
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        {benefit.icon}
                      </Box>

                      <Typography
                        variant="body1"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          color: isDarkMode ? 'grey.100' : 'grey.900',
                          fontFamily: 'Plus Jakarta Sans',
                        }}
                      >
                        {benefit.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: isDarkMode ? 'grey.400' : 'grey.700',
                          lineHeight: 1.6,
                          fontFamily: 'Inter',
                          fontSize: '0.875rem',
                        }}
                      >
                        {benefit.description}
                      </Typography>

                      {benefit.metric && (
                        <Box
                          sx={{
                            pt: 2,
                            mt: 'auto',
                            borderTop: `1px solid ${alpha(
                              benefit.color[isDarkMode ? 'dark' : 'light'],
                              0.1
                            )}`,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="baseline"
                            sx={{
                              color: benefit.color[isDarkMode ? 'dark' : 'light'],
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: '1.4rem',
                                fontWeight: 700,
                                fontFamily: 'Plus Jakarta Sans',
                              }}
                            >
                              {benefit.metric.value}
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
                              {benefit.metric.label}
                            </Typography>
                          </Stack>
                        </Box>
                      )}

                      {benefit.rating && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor: alpha(
                              benefit.color[isDarkMode ? 'dark' : 'light'],
                              0.1
                            ),
                          }}
                        >
                          <Star
                            weight="fill"
                            size={14}
                            color={benefit.color[isDarkMode ? 'dark' : 'light']}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: benefit.color[isDarkMode ? 'dark' : 'light'],
                              fontSize: '0.7rem',
                            }}
                          >
                            {benefit.rating.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isDarkMode ? 'grey.400' : 'grey.600',
                              ml: 0.5,
                              fontSize: '0.7rem',
                            }}
                          >
                            ({benefit.rating.count})
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Card>
                </motion.div>
              ))}
            </Box>

            <motion.div
              variants={ANIMATION_CONFIG.item}
            >
              <Stack
                alignItems="center"
                mt={6}
                spacing={2}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  backgroundColor: isDarkMode
                    ? alpha(COLORS.primary.dark, 0.1)
                    : alpha(COLORS.primary.light, 0.05),
                  border: `1px solid ${alpha(
                    COLORS.primary[isDarkMode ? 'dark' : 'light'],
                    0.1
                  )}`,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    maxWidth: 600,
                    color: isDarkMode ? 'grey.100' : 'grey.900',
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                  }}
                >
                  ¿Querés todos estos beneficios para tu negocio?
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  href="/pricing"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontFamily: 'Plus Jakarta Sans',
                    backgroundColor: COLORS.primary[isDarkMode ? 'dark' : 'light'],
                    boxShadow: `0 6px 12px ${alpha(
                      COLORS.primary[isDarkMode ? 'dark' : 'light'],
                      0.25
                    )}`,
                    '&:hover': {
                      backgroundColor: alpha(
                        COLORS.primary[isDarkMode ? 'dark' : 'light'],
                        0.9
                      ),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 16px ${alpha(
                        COLORS.primary[isDarkMode ? 'dark' : 'light'],
                        0.35
                      )}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Activá tu cuenta hoy
                </Button>

                <Stack spacing={1} alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDarkMode ? 'grey.400' : 'grey.600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontFamily: 'Inter',
                      fontSize: '0.75rem',
                    }}
                  >
                    <Shield weight="fill" size={12} />
                    Sin compromiso. Cancelá cuando quieras.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS.success[isDarkMode ? 'dark' : 'light'],
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
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default memo(BenefitsSection);