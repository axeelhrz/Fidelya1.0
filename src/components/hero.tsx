'use client';
import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Stack, 
  Typography, 
  useTheme,
  alpha,
  Chip,
  Paper,
  Tooltip,
  styled,
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  RocketLaunch,
  ShieldCheck,
  Lock,
  Database,
  Users,
  Lightning,
  ArrowRight,
} from '@phosphor-icons/react';




// Constantes
const ANIMATION_DURATION = 0.6;
const STAGGER_DELAY = 0.1;

// Estilos
const FONT_SIZES = {
  h1: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
  h2: { xs: '2rem', sm: '2.5rem', md: '3rem' },
  subtitle: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
};

const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

// Animaciones
const containerVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION,
      delayChildren: 0.3,
      staggerChildren: STAGGER_DELAY,
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION * 1.5,
      ease: "easeOut"
    }
  }
};

const trustBadges = [
  {
    icon: <ShieldCheck weight="duotone" />,
    label: 'Datos Protegidos',
    tooltip: 'Encriptación de nivel bancario',
  },
  {
    icon: <Lock weight="duotone" />,
    label: 'Pagos Seguros',
    tooltip: 'Procesamiento seguro con PayPal',
  },
  {
    icon: <Database weight="duotone" />,
    label: 'Google Cloud',
    tooltip: 'Infraestructura de clase mundial',
  },
];

const benefits = [
  {
    icon: <Lightning weight="duotone" />,
    text: 'Automatización inteligente',
  },
  {
    icon: <Users weight="duotone" />,
    text: 'Gestión de clientes',
  },
  {
    icon: <Database weight="duotone" />,
    text: 'Control total de pólizas',
  },
];
const StyledBadge = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  height: 32,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '& .MuiChip-label': {
    padding: '0 12px',
    fontSize: '0.875rem',
    fontWeight: FONT_WEIGHTS.medium,
  },
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
}));

const TrustBadge = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5, 2.5),
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  cursor: 'help',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
  },
}));

const BenefitChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.dark,
  fontSize: '0.875rem',
  fontWeight: FONT_WEIGHTS.medium,
  '& svg': {
    color: theme.palette.success.main,
  },
}));

export const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: isDarkMode
          ? `linear-gradient(135deg, 
              ${alpha(theme.palette.background.default, 0.95)}, 
              ${alpha(theme.palette.primary.dark, 0.1)})`
          : `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.light, 0.05)}, 
              ${alpha(theme.palette.background.default, 0.95)})`,
        overflow: 'hidden',
        pt: { xs: 12, md: 16 },
        pb: { xs: 8, md: 12 },
      }}
    >
      {/* Efectos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        {/* Gradiente superior */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '50%',
            height: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />

        {/* Gradiente inferior */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '50%',
            height: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />

        {/* Patrón de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
            background: `linear-gradient(${alpha(theme.palette.primary.main, 0.03)} 1px, transparent 1px),
                        linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.03)} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack spacing={8}>
            {/* Etiqueta superior */}
            <motion.div variants={itemVariants}>
              <Stack alignItems="center">
                <StyledBadge
                  icon={<RocketLaunch weight="duotone" />}
                  label="Nuevo en Latinoamérica • Más de 500 corredores activos"
                />
              </Stack>
            </motion.div>

            {/* Contenido principal */}
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={{ xs: 8, lg: 12 }}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Columna izquierda */}
              <Stack
                spacing={4}
                sx={{
                  maxWidth: { xs: '100%', lg: '50%' },
                  textAlign: { xs: 'center', lg: 'left' },
                }}
              >
                {/* Título principal */}
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: FONT_SIZES.h1,
                      fontWeight: FONT_WEIGHTS.extrabold,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                    }}
                  >
                    Tu nueva oficina digital como corredor de seguros
                  </Typography>

                  {/* Subtítulo */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: FONT_SIZES.subtitle,
                      color: alpha(theme.palette.text.primary, 0.8),
                      lineHeight: 1.6,
                      fontWeight: FONT_WEIGHTS.regular,
                    }}
                  >
                    Gestioná pólizas, clientes y recordatorios con la única plataforma pensada 100% para corredores. Más eficiencia, menos estrés.
                  </Typography>
                </motion.div>

                {/* Beneficios */}
                <motion.div variants={itemVariants}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent={{ xs: 'center', lg: 'flex-start' }}
                    sx={{ mb: 4 }}
                  >
                    {benefits.map((benefit, index) => (
                      <BenefitChip key={index}>
                        {benefit.icon}
                        {benefit.text}
                      </BenefitChip>
                    ))}
                  </Stack>
                </motion.div>

                {/* Botones de acción */}
                <motion.div variants={itemVariants}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent={{ xs: 'center', lg: 'flex-start' }}
                  >
                    <Link href="/pricing" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight weight="bold" />}
                        sx={{
                          px: 4,
                          py: 2,
                          borderRadius: '12px',
                          fontSize: '1.1rem',
                          fontWeight: FONT_WEIGHTS.semibold,
                          textTransform: 'none',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.35)}`,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Crear cuenta gratis
                      </Button>
                    </Link>

                    <Link href="/caracteristicas" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          px: 4,
                          py: 2,
                          borderRadius: '12px',
                          fontSize: '1.1rem',
                          fontWeight: FONT_WEIGHTS.semibold,
                          textTransform: 'none',
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Ver funcionalidades
                      </Button>
                    </Link>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      color: 'text.secondary',
                      textAlign: { xs: 'center', lg: 'left' },
                    }}
                  >
                    Sin compromiso. Cancelá cuando quieras.
                  </Typography>
                </motion.div>

                {/* Trust badges */}
                <motion.div variants={itemVariants}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent={{ xs: 'center', lg: 'flex-start' }}
                    sx={{ mt: 4 }}
                  >
                    {trustBadges.map((badge, index) => (
                      <Tooltip key={index} title={badge.tooltip} arrow>
                        <TrustBadge elevation={0}>
                          {badge.icon}
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: FONT_WEIGHTS.medium,
                              color: 'text.primary',
                            }}
                          >
                            {badge.label}
                          </Typography>
                        </TrustBadge>
                      </Tooltip>
                    ))}
                  </Stack>
                </motion.div>
              </Stack>

              {/* Columna derecha - Imagen */}
              <Box
                component={motion.div}
                variants={imageVariants}
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: '100%', lg: '50%' },
                  aspectRatio: '4/3',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: '24px',
                  }}
                >
                  <Image
                    src="/assets/LandingLogo.svg"
                    alt="Dashboard de la plataforma"
                    fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      filter: isDarkMode ? 'invert(1)' : 'none',
                      transition: 'filter 0.3s ease',
                    }}
                    priority
                    quality={90}
                  />
                </Box>
              </Box>
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;