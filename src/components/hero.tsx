'use client';
import React, { useEffect, useState } from 'react';
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
  useMediaQuery,
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
  h1: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
  h2: { xs: '1.75rem', sm: '2rem', md: '2.75rem' },
  subtitle: { xs: '1rem', sm: '1.1rem', md: '1.35rem' },
};

const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

// Animaciones - Optimizadas para móvil
const containerVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION,
      delayChildren: 0.2, // Reducido para móvil
      staggerChildren: STAGGER_DELAY,
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 15 // Reducido para móvil
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION * 0.8, // Más rápido en móvil
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.98 // Menos escala en móvil
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION,
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

// Componentes estilizados optimizados para móvil
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
    whiteSpace: 'normal', // Permitir múltiples líneas en móvil
    textAlign: 'center',
  },
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
}));

const TrustBadge = styled(Paper)(({ theme, isMobile }) => ({
  padding: isMobile ? theme.spacing(1, 1.5) : theme.spacing(1.5, 2.5),
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: isMobile ? 'none' : 'blur(8px)', // Eliminar blur en móvil
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  transition: isMobile ? 'none' : 'all 0.2s ease-in-out', // Eliminar transición en móvil
  cursor: 'help',
  '&:hover': isMobile ? {} : {
    transform: 'translateY(-2px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
  },
}));

const BenefitChip = styled(Box)(({ theme, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: isMobile ? theme.spacing(0.75, 1.5) : theme.spacing(1, 2),
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.dark,
  fontSize: isMobile ? '0.8rem' : '0.875rem',
  fontWeight: FONT_WEIGHTS.medium,
  '& svg': {
    color: theme.palette.success.main,
    fontSize: isMobile ? '0.9rem' : '1rem',
  },
}));

export const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Estado para controlar la carga de imágenes
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Optimización: Cargar imagen solo cuando sea visible
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: isMobile ? 'auto' : '100vh',
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
        pt: { xs: 8, sm: 10, md: 16 },
        pb: { xs: 6, sm: 8, md: 12 },
      }}
    >
      {/* Efectos de fondo - Simplificados para móvil */}
      {!isMobile && (
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

          {/* Patrón de fondo - Omitido en móvil */}
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
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack spacing={isMobile ? 4 : 8}>
            {/* Etiqueta superior - Simplificada para móvil */}
            <motion.div variants={itemVariants}>
              <Stack alignItems="center">
                <StyledBadge
                  icon={<RocketLaunch weight="duotone" size={isMobile ? 16 : 20} />}
                  label={isMobile ? "Nuevo • +500 corredores activos" : "Nuevo en Latinoamérica • Más de 500 corredores activos"}
                />
              </Stack>
            </motion.div>

            {/* Contenido principal - Reorganizado para móvil */}
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={{ xs: 4, sm: 6, lg: 12 }}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Columna izquierda */}
              <Stack
                spacing={isMobile ? 3 : 4}
                sx={{
                  maxWidth: { xs: '100%', lg: '50%' },
                  textAlign: { xs: 'center', lg: 'left' },
                }}
              >
                {/* Título principal - Optimizado para móvil */}
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
                      mb: isMobile ? 1 : 2,
                    }}
                  >
                    Tu nueva oficina digital como corredor de seguros
                  </Typography>

                  {/* Subtítulo - Optimizado para móvil */}
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

                {/* Beneficios - Optimizados para móvil */}
                <motion.div variants={itemVariants}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={isMobile ? 1 : 2}
                    justifyContent={{ xs: 'center', lg: 'flex-start' }}
                    sx={{ mb: isMobile ? 2 : 4 }}
                  >
                    {benefits.map((benefit, index) => (
                      <BenefitChip key={index} isMobile={isMobile}>
                        {benefit.icon}
                        {benefit.text}
                      </BenefitChip>
                    ))}
                  </Stack>
                </motion.div>

                {/* Botones de acción - Optimizados para móvil */}
                <motion.div variants={itemVariants}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={isMobile ? 1.5 : 2}
                    justifyContent={{ xs: 'center', lg: 'flex-start' }}
                  >
                    <Link href="/pricing" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                      <Button
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        fullWidth={isMobile}
                        endIcon={<ArrowRight weight="bold" />}
                        sx={{
                          px: isMobile ? 3 : 4,
                          py: isMobile ? 1.5 : 2,
                          borderRadius: '12px',
                          fontSize: isMobile ? '1rem' : '1.1rem',
                          fontWeight: FONT_WEIGHTS.semibold,
                          textTransform: 'none',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          boxShadow: isMobile ? 
                            `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}` : 
                            `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
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

                    {!isMobile && (
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
                    )}
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      color: 'text.secondary',
                      textAlign: { xs: 'center', lg: 'left' },
                      fontSize: isMobile ? '0.75rem' : 'inherit',
                            }}
                          >
                    Sin compromiso. Cancelá cuando quieras.
                          </Typography>
                </motion.div>

                {/* Trust badges - Optimizados para móvil */}
                <motion.div variants={itemVariants}>
                  <Stack
                    direction="row"
                    spacing={isMobile ? 1 : 2}
                    justifyContent={{ xs: 'center', lg: 'flex-start' }}
                    sx={{ mt: isMobile ? 2 : 4 }}
                    flexWrap={isMobile ? "wrap" : "nowrap"}
                  >
                    {trustBadges.map((badge, index) => (
                      <Tooltip key={index} title={badge.tooltip} arrow>
                        <TrustBadge elevation={0} isMobile={isMobile}>
                          {badge.icon}
                          <Typography
                            variant="caption"
                sx={{
                              fontWeight: FONT_WEIGHTS.medium,
                              color: 'text.primary',
                              fontSize: isMobile ? '0.7rem' : '0.75rem',
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

              {/* Columna derecha - Imagen - Optimizada para móvil */}
              {(imageLoaded || !isMobile) && (
                <Box
                  component={motion.div}
                  variants={imageVariants}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: { xs: '100%', lg: '50%' },
                    aspectRatio: isMobile ? '16/9' : '4/3',
                    mt: isMobile ? 2 : 0,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: isMobile ? '16px' : '24px',
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
                      priority={!isMobile}
                      loading={isMobile ? "lazy" : "eager"}
                      quality={isMobile ? 80 : 90}
                    />
    </Box>
                </Box>
              )}
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;