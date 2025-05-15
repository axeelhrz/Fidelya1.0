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
import Head from 'next/head';

// Importar solo los iconos necesarios para reducir el bundle inicial
import { RocketLaunch } from '@phosphor-icons/react/dist/ssr/RocketLaunch';
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck';
import { Lock } from '@phosphor-icons/react/dist/ssr/Lock';
import { Database } from '@phosphor-icons/react/dist/ssr/Database';
import { Users } from '@phosphor-icons/react/dist/ssr/Users';
import { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';

// Constantes - Movidas fuera del componente para evitar recreaciones
const FONT_SIZES = {
  h1: { xs: '2rem', sm: '2.5rem', md: '3rem' },
  subtitle: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
};

const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

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

// Componentes estilizados - Simplificados y optimizados
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
      color: theme.palette.primary.main,
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
const HeroSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  // Renderizado estático para el contenido principal
  return (
    <>
      {/* Precargar la imagen crítica para LCP */}
      <Head>
        <link 
          rel="preload" 
          href="/assets/LandingLogo.svg" 
          as="image" 
          type="image/svg+xml"
        />
      </Head>

            <Box
        id="hero-section"
        component="section"
              sx={{
                position: 'relative',
          minHeight: { xs: '80vh', md: '90vh' },
                display: 'flex',
          alignItems: 'center',
          background: isDarkMode
            ? theme.palette.background.default
            : alpha(theme.palette.primary.light, 0.05),
                  overflow: 'hidden',
          pt: { xs: 8, md: 10 },
          pb: { xs: 4, md: 8 },
                }}
              >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={4}>
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
              spacing={{ xs: 4, lg: 6 }}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Columna izquierda */}
              <Stack
                spacing={2}
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
                  spacing={1.5}
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                  sx={{ mb: 2 }}
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
                  spacing={1.5}
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                >
                  <Link href="/pricing" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowRight weight="bold" />}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: '12px',
                        fontSize: '1rem',
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
                        px: 3,
                        py: 1.5,
                        borderRadius: '12px',
                        fontSize: '1rem',
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
                  spacing={1.5}
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                  sx={{ mt: 2 }}
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

              {/* Columna derecha - Imagen optimizada para LCP */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: '100%', lg: '50%' },
                  height: 'auto',
                  aspectRatio: '4/3',
                  borderRadius: '24px',
                  overflow: 'hidden',
                }}
              >
                {/* Imagen optimizada para LCP */}
                <Image
                  src="/assets/LandingLogo.svg"
                  alt="Dashboard de la plataforma"
                  width={600}
                  height={450}
                  priority={true}
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '24px',
                    filter: isDarkMode ? 'brightness(0.9)' : 'none',
                  }}
                />
    </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default memo(HeroSection);