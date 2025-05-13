'use client';

import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  RocketLaunch, 
  Play, 
  Shield, 
  Star, 
  Lightning,
  GoogleLogo,
  CloudArrowUp,
  LockKey
} from '@phosphor-icons/react';

interface DashboardPreviewProps {
  ctaAction?: 'signup' | 'demo';
}

// Configuración de animaciones mejoradas
const ANIMATION_CONFIG = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  },
  image: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }
};

// Configuración de CTA mejorada
const CTA_CONFIG = {
  signup: {
    text: 'Crear mi cuenta gratis',
    href: '/pricing',
    icon: <RocketLaunch weight="bold" />,
    description: '7 días de prueba sin cargo'
  },
  demo: {
    text: 'Ver la plataforma en acción',
    href: '/contact',
    icon: <Play weight="bold" />,
    description: 'Demo guiada de 10 minutos'
  }
};

// Badges de confianza
const TRUST_BADGES = [
  {
    icon: <GoogleLogo weight="fill" />,
    label: 'Google Cloud'
  },
  {
    icon: <CloudArrowUp weight="fill" />,
    label: 'AWS Partner'
  },
  {
    icon: <LockKey weight="fill" />,
    label: 'ISO 27001'
  }
];

export const DashboardPreview = ({ ctaAction = 'signup' }: DashboardPreviewProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const selectedCta = CTA_CONFIG[ctaAction];

  // Seleccionar la imagen según el modo de tema
  const dashboardImage = isDarkMode 
    ? "/assets/dashboard-preview-night.png" 
    : "/assets/dashboard-preview.png";

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        backgroundColor: isDarkMode 
          ? 'background.default'
          : alpha(theme.palette.primary.main, 0.02),
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? `radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.main, 0.15)}, transparent 25%)`
            : `radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.main, 0.08)}, transparent 25%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={ANIMATION_CONFIG.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <Stack spacing={6} alignItems="center">
            {/* Header Section */}
            <motion.div variants={ANIMATION_CONFIG.item}>
              <Stack spacing={3} sx={{ maxWidth: 900, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 0.75,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                      color: isDarkMode ? 'primary.light' : 'primary.main',
                      fontSize: '0.75rem',
                      letterSpacing: 1.2,
                    }}
                  >
                    <Lightning weight="fill" />
                    Así se ve tu nuevo panel
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    letterSpacing: '-0.5px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  Tu nueva central de operaciones
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    color: isDarkMode ? 'grey.300' : 'grey.800',
                    lineHeight: 1.6,
                    maxWidth: 800,
                    mx: 'auto',
                  }}
                >
                  Control total de pólizas, clientes, recordatorios y métricas en tiempo real.
                  <br />
                  Todo, desde un lugar intuitivo y diseñado para vos.
                </Typography>
              </Stack>
            </motion.div>

            {/* Dashboard Preview Image */}
            <Box
              component={motion.div}
              variants={ANIMATION_CONFIG.image}
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 1200,
                aspectRatio: '16/9',
                my: { xs: 4, md: 6 },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.12)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, isDarkMode ? 0.1 : 0.05)}`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isDarkMode 
                      ? 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                    zIndex: 1,
                  }
                }}
              >
                <Image
                  src={dashboardImage}
                  alt="Panel de control de Assuriva - Gestión integral para corredores de seguros"
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top center',
                  }}
                  quality={95}
                  priority
                />
              </Box>
            </Box>

            {/* CTA Section */}
            <motion.div variants={ANIMATION_CONFIG.item}>
              <Stack spacing={4} alignItems="center">
                <Link href={selectedCta.href} style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={selectedCta.icon}
                    sx={{
                      py: 2,
                      px: { xs: 4, md: 6 },
                      borderRadius: '16px',
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      backgroundColor: theme.palette.primary.main,
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                      }
                    }}
                  >
                    {selectedCta.text}
                  </Button>
                </Link>

                <Stack spacing={3} alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDarkMode ? 'grey.400' : 'grey.600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Star weight="fill" size={16} />
                    {selectedCta.description}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isDarkMode ? 'grey.300' : 'grey.700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Shield weight="fill" size={18} />
                    Más de 500 corredores ya digitalizaron su gestión con Assuriva
                  </Typography>

                  {/* Trust Badges */}
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    {TRUST_BADGES.map((badge, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: isDarkMode ? 'grey.500' : 'grey.600',
                          fontSize: '0.875rem',
                        }}
                      >
                        {badge.icon}
                        <Typography variant="caption">{badge.label}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DashboardPreview;