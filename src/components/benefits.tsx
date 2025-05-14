'use client';

import { Box, Button, Card, Container, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Clock,
  Shield,
  FileText,
  Users,
  Bell,
  Layout,
  Star,
} from '@phosphor-icons/react';

const ANIMATION_CONFIG = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  },
  itemLeft: {
    hidden: { opacity: 0, x: -20, y: 20, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  itemRight: {
    hidden: { opacity: 0, x: 20, y: 20, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }
};

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

export const BenefitsSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { scrollYProgress } = useScroll();
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
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
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Stack spacing={8}>
            <Stack spacing={3} sx={{ mb: 8, textAlign: 'center' }}>
              <motion.div variants={ANIMATION_CONFIG.itemLeft}>
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
                      fontFamily: 'Work Sans',
                      textTransform: 'uppercase',
                      backgroundColor: alpha(COLORS.primary[isDarkMode ? 'dark' : 'light'], isDarkMode ? 0.15 : 0.1),
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
                    fontSize: { xs: '2rem', md: '2.5rem' },
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
                  variant="subtitle1"
                  sx={{
                    color: isDarkMode ? 'grey.300' : 'grey.800',
                    maxWidth: 800,
                    mx: 'auto',
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontFamily: 'Inter',
                  }}
                >
                  Transformá tu forma de trabajar con herramientas diseñadas
                  <br />
                  específicamente para corredores de seguros.
                </Typography>
              </motion.div>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 3, md: 4 },
                justifyContent: 'center',
                alignItems: 'stretch',
              }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  variants={index % 2 === 0 ? ANIMATION_CONFIG.itemLeft : ANIMATION_CONFIG.itemRight}
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
                      minHeight: 320,
                      p: 3,
                      position: 'relative',
                      borderRadius: 3,
                      backgroundColor: isDarkMode ? 'background.paper' : 'common.white',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${alpha(
                        benefit.color[isDarkMode ? 'dark' : 'light'],
                        isDarkMode ? 0.2 : 0.1
                      )}`,
                      boxShadow: `0 12px 40px ${alpha(
                        benefit.color[isDarkMode ? 'dark' : 'light'],
                        0.04
                      )}`,
                      transition: 'all 0.3s ease-in-out',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `
                          0 20px 40px ${alpha(
                            benefit.color[isDarkMode ? 'dark' : 'light'],
                            0.08
                          )},
                          0 0 0 1px ${alpha(
                            benefit.color[isDarkMode ? 'dark' : 'light'],
                            0.2
                          )}
                        `,
                        '& .benefit-icon': {
                          transform: 'scale(1.1) rotate(5deg)',
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
                      spacing={2.5}
                      sx={{
                        height: '100%',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <Box
                        className="benefit-icon"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha(
                            benefit.color[isDarkMode ? 'dark' : 'light'],
                            isDarkMode ? 0.15 : 0.1
                          ),
                          color: benefit.color[isDarkMode ? 'dark' : 'light'],
                          fontSize: 32,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {benefit.icon}
                      </Box>

                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.4rem',
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
                          lineHeight: 1.7,
                          fontFamily: 'Inter',
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
                                fontSize: '1.5rem',
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
                            size={16}
                            color={benefit.color[isDarkMode ? 'dark' : 'light']}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: benefit.color[isDarkMode ? 'dark' : 'light'],
                            }}
                          >
                            {benefit.rating.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isDarkMode ? 'grey.400' : 'grey.600',
                              ml: 0.5,
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
              variants={ANIMATION_CONFIG.itemLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Stack
                alignItems="center"
                mt={8}
                spacing={3}
                sx={{
                  p: { xs: 3, md: 4 },
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
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    maxWidth: 600,
                    color: isDarkMode ? 'grey.100' : 'grey.900',
                    fontFamily: 'Plus Jakarta Sans',
                  }}
                >
                  ¿Querés todos estos beneficios para tu negocio?
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  href="/pricing"
                  sx={{
                    px: 5,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontFamily: 'Plus Jakarta Sans',
                    backgroundColor: COLORS.primary[isDarkMode ? 'dark' : 'light'],
                    boxShadow: `0 8px 16px ${alpha(
                      COLORS.primary[isDarkMode ? 'dark' : 'light'],
                      0.25
                    )}`,
                    '&:hover': {
                      backgroundColor: alpha(
                        COLORS.primary[isDarkMode ? 'dark' : 'light'],
                        0.9
                      ),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 20px ${alpha(
                        COLORS.primary[isDarkMode ? 'dark' : 'light'],
                        0.35
                      )}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Activá tu cuenta hoy
                </Button>

                <Stack spacing={1.5} alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDarkMode ? 'grey.400' : 'grey.600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontFamily: 'Inter',
                    }}
                  >
                    <Shield weight="fill" size={14} />
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
                    }}
                  >
                    <Star weight="fill" size={14} />
                    7 días de prueba gratis
                  </Typography>
                </Stack>
              </Stack>
            </motion.div>

            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                backgroundColor: isDarkMode ? 'background.paper' : 'background.default',
                borderTop: `1px solid ${alpha(
                  COLORS.primary[isDarkMode ? 'dark' : 'light'],
                  0.1
                )}`,
                zIndex: 1000,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                href="/pricing"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: COLORS.primary[isDarkMode ? 'dark' : 'light'],
                  '&:hover': {
                    backgroundColor: alpha(
                      COLORS.primary[isDarkMode ? 'dark' : 'light'],
                      0.9
                    ),
                  },
                }}
              >
                Empezar gratis
              </Button>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BenefitsSection;