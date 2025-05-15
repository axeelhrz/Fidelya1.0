'use client';
import React, { useState, useEffect, memo } from 'react';
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
  Skeleton,
} from '@mui/material';
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

// Importación dinámica de Framer Motion para reducir el tamaño del bundle inicial


// Constantes - Movidas fuera del componente para evitar recreaciones

// Estilos - Simplificados
const FONT_SIZES = {
  h1: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }, // Ligeramente reducido
  subtitle: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' }, // Ligeramente reducido
};

const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

// Animaciones - Simplificadas



// Datos estáticos - Memoizados
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

// Componentes estilizados - Simplificados
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
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  // Eliminadas transiciones complejas
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

// Componentes memoizados para evitar re-renderizados
const HeroTitle = memo<{ theme: import('@mui/material/styles').Theme }>(({ theme }) => (
                  <Typography
                    variant="h1"
                      component="h1"
                    sx={{
                        fontSize: FONT_SIZES.h1,
                        fontWeight: FONT_WEIGHTS.extrabold,
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
      color: theme.palette.primary.main, // Simplificado en lugar de gradiente
                        mb: 2,
                      }}
                    >
                      Tu nueva oficina digital como corredor de seguros
                    </Typography>
));

HeroTitle.displayName = 'HeroTitle';

const HeroSubtitle = memo<{ theme: import('@mui/material/styles').Theme }>(({ theme }) => (
                    <Typography
                      variant="h2"
                      component="p"
                      sx={{
                        fontSize: FONT_SIZES.subtitle,
                        color: alpha(theme.palette.text.primary, 0.8),
                        lineHeight: 1.6,
                        fontWeight: FONT_WEIGHTS.regular,
                      }}
                    >
                      Gestioná pólizas, clientes y recordatorios con la única plataforma pensada 100% para corredores. Más eficiencia, menos estrés.
                    </Typography>
));

HeroSubtitle.displayName = 'HeroSubtitle';

// Componente principal optimizado
export const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [imageLoaded, setImageLoaded] = useState(false);

  // Optimización: Usar un efecto más ligero
  useEffect(() => {
    
    // Precargar imagen con menor prioridad
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = '/assets/LandingLogo.svg';
      img.onload = () => setImageLoaded(true);
    }
  }, []);

  // Renderizado estático para el contenido principal
  const renderStaticContent = () => (
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      <Stack spacing={6}>
        {/* Etiqueta superior - Estática */}
        <Stack alignItems="center">
          <StyledBadge
            icon={<RocketLaunch weight="duotone" />}
            label="Nuevo en Latinoamérica • Más de 500 corredores activos"
                      />
              </Stack>

        {/* Contenido principal */}
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={{ xs: 6, lg: 8 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Columna izquierda */}
          <Stack
            spacing={3}
            sx={{
              maxWidth: { xs: '100%', lg: '50%' },
              textAlign: { xs: 'center', lg: 'left' },
            }}
          >
            {/* Título y subtítulo memoizados */}
            <HeroTitle theme={theme} />
            <HeroSubtitle theme={theme} />

            {/* Beneficios */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent={{ xs: 'center', lg: 'flex-start' }}
              sx={{ mb: 3 }}
            >
              {benefits.map((benefit, index) => (
                <BenefitChip key={index}>
                  {benefit.icon}
                  {benefit.text}
                </BenefitChip>
              ))}
            </Stack>

            {/* Botones de acción */}
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
                    backgroundColor: theme.palette.primary.main,
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
                  }}
                >
                  Ver funcionalidades
                </Button>
              </Link>
            </Stack>
            
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: 'text.secondary',
                textAlign: { xs: 'center', lg: 'left' },
              }}
            >
              Sin compromiso. Cancelá cuando quieras.
            </Typography>

            {/* Trust badges */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: 'center', lg: 'flex-start' }}
              sx={{ mt: 3 }}
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
          </Stack>

          {/* Columna derecha - Imagen optimizada */}
          <Box
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
              {!imageLoaded ? (
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height="100%" 
                  animation="wave"
                  sx={{ 
                    borderRadius: '24px',
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }}
                />
              ) : (
                <Image
                  src="/assets/LandingLogo.svg"
                  alt="Dashboard de la plataforma"
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: isDarkMode ? 'brightness(0.9)' : 'none',
                  }}
                  priority
                  quality={70}
                  loading="eager"
                  sizes="(max-width: 1200px) 100vw, 50vw"
                />
              )}
    </Box>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: '90vh', // Reducido para mejorar el rendimiento
        display: 'flex',
        alignItems: 'center',
        background: isDarkMode
          ? theme.palette.background.default
          : alpha(theme.palette.primary.light, 0.05),
        overflow: 'hidden',
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 10 },
      }}
    >
      {/* Fondo simplificado */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* Renderizado condicional optimizado */}
      {renderStaticContent()}
    </Box>
  );
};

export default memo(HeroSection);
