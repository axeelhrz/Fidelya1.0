'use client';

import { Box, Button, Container, Stack, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  RocketLaunch,
  Presentation,
  Star,
  Check,
  Clock,
  ShieldCheck,
  Users,
} from '@phosphor-icons/react';

// Animation variants
const ANIMATION_VARIANTS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  },
  button: {
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400 }
    },
    tap: { scale: 0.98 }
  }
};

// Trust indicators data
const trustIndicators = [
  { icon: <Check weight="bold" />, text: '7 días de prueba gratis' },
  { icon: <ShieldCheck weight="bold" />, text: 'Sin tarjeta de crédito' },
  { icon: <Clock weight="bold" />, text: 'Soporte 24/7' },
];

export const CtaSection = () => {
  const theme = useTheme();

  // Enhanced tracking
  const handleMainCtaClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_principal_click', {
        event_category: 'CTA',
        event_label: 'Empezar Gratis - Assuriva'
      });
    }
  };

  const handleDemoClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_demo_click', {
        event_category: 'CTA',
        event_label: 'Ver Demo en Acción - Assuriva'
      });
    }
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Animated background effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%),
            radial-gradient(circle at 80% -50%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)
          `,
          animation: 'pulse 15s infinite',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Stack
            spacing={4}
            alignItems="center"
            sx={{
              position: 'relative',
              zIndex: 2,
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: { xs: 3, md: 6 },
              backgroundColor: alpha(theme.palette.background.paper, 0.05),
            }}
          >
            {/* Main Title */}
            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
              <Typography
                variant="h3"
                align="center"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  lineHeight: 1.2,
                }}
              >
                Transformá tu gestión.
                <br />
                Multiplicá tus resultados.
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
              <Typography
                variant="subtitle1"
                component="p"
                align="center"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: 720,
                  mx: 'auto',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                Automatizá tu trabajo, ganá más tiempo y hacé crecer tu cartera de clientes.
              </Typography>
            </motion.div>

            {/* Social Proof Badge */}
            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: alpha('#fff', 0.1),
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <Star weight="fill" style={{ color: '#FFD700' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                  }}
                >
                  4.9/5 basado en +500 corredores de seguros satisfechos
                </Typography>
              </Box>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                sx={{ mt: 2 }}
              >
                <motion.div
                  variants={ANIMATION_VARIANTS.button}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link href="/pricing" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<RocketLaunch weight="bold" />}
                      onClick={handleMainCtaClick}
                      sx={{
                        px: 4,
                        py: 2,
                        bgcolor: 'white',
                        color: theme.palette.primary.main,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                          boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
                        },
                        minWidth: { xs: '100%', sm: '200px' },
                      }}
                    >
                      Empezar gratis
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  variants={ANIMATION_VARIANTS.button}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link href="/contact" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Presentation weight="bold" />}
                      onClick={handleDemoClick}
                      sx={{
                        px: 4,
                        py: 2,
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: '12px',
                        textTransform: 'none',
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: 'white',
                          borderWidth: 2,
                          bgcolor: 'rgba(255,255,255,0.1)',
                        },
                        minWidth: { xs: '100%', sm: '200px' },
                      }}
                    >
                      Ver una demo en acción
                    </Button>
                  </Link>
                </motion.div>
              </Stack>
            </motion.div>

            {/* Risk Remover */}
            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                }}
              >
                Sin riesgos. Sin tarjeta de crédito.
              </Typography>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 4 }}
                sx={{
                  mt: 4,
                  pt: 4,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {trustIndicators.map((indicator, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    {indicator.icon}
                    <Typography variant="body2">
                      {indicator.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </motion.div>

            {/* Users Count */}
            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'rgba(255,255,255,0.7)',
                  mt: 2,
                }}
              >
                <Users weight="bold" />
                <Typography variant="body2">
                  +500 corredores ya confían en nuestra plataforma
                </Typography>
              </Box>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>

      {/* Add keyframes for background animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
        }
      `}</style>
    </Box>
  );
};

export default CtaSection;