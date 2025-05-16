'use client';
import React, { memo } from 'react';
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
import Link from 'next/link';
import Image from 'next/image';

// Import only the specific icons we need
import { RocketLaunch } from '@phosphor-icons/react/dist/ssr/RocketLaunch';
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck';
import { Lock } from '@phosphor-icons/react/dist/ssr/Lock';
import { Database } from '@phosphor-icons/react/dist/ssr/Database';
import { Users } from '@phosphor-icons/react/dist/ssr/Users';
import { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';

// Constantes - Movidas fuera del componente para evitar recreaciones
const FONT_SIZES = {
  h1: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }, // Reduced for mobile
  subtitle: { xs: '0.875rem', sm: '1rem', md: '1.1rem' }, // Reduced for mobile
};

const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

// Static data - Memoized
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

// Styled components - Simplified and optimized
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
  padding: theme.spacing(1, 2),
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const BenefitChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1.5),
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.dark,
  fontSize: '0.875rem',
  fontWeight: FONT_WEIGHTS.medium,
  '& svg': {
    color: theme.palette.success.main,
  },
}));

// Memoized components to avoid re-renders
const HeroTitle = memo(({ theme }: { theme: import('@mui/material').Theme }) => (
  <Typography
    variant="h1"
    component="h1"
    sx={{
      fontSize: FONT_SIZES.h1,
      fontWeight: FONT_WEIGHTS.extrabold,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: theme.palette.primary.main,
      mb: { xs: 1.5, md: 2 },
    }}
  >
    Tu nueva oficina digital como corredor de seguros
  </Typography>
));

HeroTitle.displayName = 'HeroTitle';

const HeroSubtitle = memo(({ theme }: { theme: import('@mui/material').Theme }) => (
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

// Main optimized component
const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <Box
        component="section"
              sx={{
                position: 'relative',
        minHeight: { xs: '70vh', md: '90vh' }, // Reduced for mobile
                display: 'flex',
          alignItems: 'center',
          background: isDarkMode
            ? theme.palette.background.default
            : alpha(theme.palette.primary.light, 0.05),
                  overflow: 'hidden',
        pt: { xs: 6, md: 10 }, // Reduced for mobile
        pb: { xs: 3, md: 8 }, // Reduced for mobile
                }}
              >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={3}> {/* Reduced spacing */}
          {/* Top badge - Static */}
          <Stack alignItems="center">
              <StyledBadge
                icon={<RocketLaunch weight="duotone" />}
                label="Nuevo en Latinoamérica • Más de 500 corredores activos"
                  />
            </Stack>

          {/* Main content */}
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
            spacing={{ xs: 3, lg: 5 }} // Reduced spacing
              alignItems="center"
              justifyContent="space-between"
            >
            {/* Left column */}
              <Stack
              spacing={1.5} // Reduced spacing
              sx={{
                  maxWidth: { xs: '100%', lg: '50%' },
                  textAlign: { xs: 'center', lg: 'left' },
                }}
              >
              {/* Memoized title and subtitle */}
                <HeroTitle theme={theme} />
                <HeroSubtitle theme={theme} />

              {/* Benefits */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                spacing={1} // Reduced spacing
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                sx={{ mb: 1.5 }} // Reduced margin
                >
                  {benefits.map((benefit, index) => (
                    <BenefitChip key={index}>
                      {benefit.icon}
                      {benefit.text}
                    </BenefitChip>
                  ))}
                </Stack>

              {/* Action buttons */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                spacing={1} // Reduced spacing
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                >
                  <Link href="/pricing" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowRight weight="bold" />}
                      sx={{
                      px: 2.5, // Reduced padding
                      py: 1.25, // Reduced padding
                      borderRadius: '12px',
                      fontSize: '0.95rem', // Reduced font size
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
                      px: 2.5, // Reduced padding
                      py: 1.25, // Reduced padding
                      borderRadius: '12px',
                      fontSize: '0.95rem', // Reduced font size
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
                  mt: 0.5,
                    color: 'text.secondary',
                    textAlign: { xs: 'center', lg: 'left' },
                  fontSize: '0.75rem', // Reduced font size
                  }}
                >
                  Sin compromiso. Cancelá cuando quieras.
                </Typography>

                {/* Trust badges */}
                <Stack
                  direction="row"
                spacing={1} // Reduced spacing
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                sx={{ mt: 1.5 }} // Reduced margin
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
                          fontSize: '0.7rem', // Reduced font size
                          }}
                        >
                          {badge.label}
                        </Typography>
                      </TrustBadge>
                    </Tooltip>
                  ))}
                </Stack>
              </Stack>

            {/* Right column - Optimized image */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: '100%', lg: '50%' },
                height: { xs: '220px', sm: '300px', md: 'auto' }, // Fixed height for mobile
                aspectRatio: { md: '4/3' },
                borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/assets/LandingLogo.svg"
                  alt="Dashboard de la plataforma"
                priority={true}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  filter: isDarkMode ? 'invert(1) brightness(1.2)' : 'none', // Añadido invert(1) para modo oscuro
                  transition: 'filter 0.3s ease', // Añadido transición suave
                  }}
                />
    </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
  );
};

export default memo(HeroSection);