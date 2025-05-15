'use client';

import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  Button,
  useTheme,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Shield as ShieldIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
  CloudDone as CloudIcon,
  Speed as SpeedIcon,
  Fingerprint as FingerprintIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckCircleIcon,
  Bolt as BoltIcon,
  Info as InfoIcon,
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
interface SecurityFeature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  badge?: string;
}

interface IntegrationLogo {
  name: string;
  icon: string;
  alt: string;
  description: string;
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  hover: {
    scale: 1.03,
    y: -5,
    transition: { type: 'spring', stiffness: 200 }
  },
  tap: {
    scale: 0.98
  },
  icon: {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: 'spring', stiffness: 300 }
    }
  },
  badge: {
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400 }
    }
  }
};

// Integration logos data
const integrationLogos: IntegrationLogo[] = [
  {
    name: 'Firebase',
    icon: '/logos/firebase.svg',
    alt: 'Autenticación y base de datos segura con Firebase',
    description: 'Autenticación de múltiples factores'
  },
  {
    name: 'AWS',
    icon: '/logos/aws.svg',
    alt: 'Infraestructura segura en Amazon Web Services',
    description: 'Servidores con certificación ISO 27001'
  },
  {
    name: 'PayPal',
    icon: '/logos/paypal.svg',
    alt: 'Procesamiento de pagos seguro con PayPal',
    description: 'Transacciones encriptadas end-to-end'
  },
];

// Security features data
const securityFeatures: SecurityFeature[] = [
  {
    id: 1,
    icon: <LockIcon sx={{ fontSize: 32 }} />,
    title: 'Encriptación Avanzada',
    description: 'Tus datos protegidos con encriptación AES-256 de grado militar.',
    color: COLORS.primary,
    badge: 'Militar Grade',
  },
  {
    id: 2,
    icon: <FingerprintIcon sx={{ fontSize: 32 }} />,
    title: 'Autenticación Biométrica',
    description: 'Acceso seguro con reconocimiento facial y huella digital.',
    color: COLORS.success,
    badge: 'Biometric',
  },
  {
    id: 3,
    icon: <CloudIcon sx={{ fontSize: 32 }} />,
    title: 'Backups Automáticos',
    description: 'Copias de seguridad diarias en múltiples ubicaciones.',
    color: COLORS.info,
  },
  {
    id: 4,
    icon: <SpeedIcon sx={{ fontSize: 32 }} />,
    title: 'Monitoreo 24/7',
    description: 'Sistema de detección y prevención de intrusiones en tiempo real.',
    color: COLORS.warning,
  },
];

// Trust badges data
const trustBadges = [
  { icon: <ShieldIcon />, label: 'ISO 27001' },
  { icon: <BoltIcon />, label: '99.99% uptime' },
  { icon: <LockIcon />, label: 'SSL/TLS' },
  { icon: <VerifiedUserIcon />, label: 'SOC 2 Type II' },
];

// Background Pattern Component
const BackgroundPattern = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 0,
      opacity: 0.04,
      pointerEvents: 'none',
    }}
  >
    <Box
      component="img"
      src="/patterns/shield-pattern.svg"
      alt=""
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.5,
      }}
    />
  </Box>
);

// SecurityCard Component
const SecurityCard = motion(Card);

export default function SecuritySection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  // Define gtag function type
  interface GTagFunction {
    (command: 'event', action: string, params: {
      event_category?: string;
      event_label?: string;
      [key: string]: string | number | boolean | null | undefined | Record<string, string | number | boolean | null | undefined>;
    }): void;
  }

  // Enhanced tracking
  const trackEvent = (eventName: string, properties = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      (window.gtag as GTagFunction)('event', eventName, {
        event_category: 'security_section',
        event_label: 'security_interaction',
        ...properties
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
      {/* Animated Background */}
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
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ opacity: backgroundOpacity }}
          >
            {/* Primary Gradient */}
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '40%',
                height: '40%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(COLORS.primary, 0.2)} 0%, transparent 70%)`,
                filter: 'blur(64px)',
                animation: 'pulse 15s infinite',
              }}
            />
            {/* Secondary Gradient */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '35%',
                height: '35%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(COLORS.secondary, 0.2)} 0%, transparent 70%)`,
                filter: 'blur(64px)',
                animation: 'pulse 20s infinite reverse',
              }}
            />
          </motion.div>
        </AnimatePresence>
        <BackgroundPattern />
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
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon fontSize="small" />
                  Seguridad Enterprise
                </Box>
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
                Tu información siempre protegida
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: isDarkMode ? 'grey.300' : 'grey.800',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Implementamos los más altos estándares de seguridad para proteger tus datos y los de tus clientes
              </Typography>

              {/* Trust Badges */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{
                  mt: 3,
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={index}
                    variants={ANIMATION_VARIANTS.badge}
                    whileHover="hover"
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 0.75,
                        borderRadius: 2,
                        backgroundColor: alpha(COLORS.primary, isDarkMode ? 0.15 : 0.1),
                        color: isDarkMode ? 'grey.300' : 'grey.700',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Box sx={{ color: COLORS.primary }}>
                        {badge.icon}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontWeight: 500,
                        }}
                      >
                        {badge.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Stack>

          {/* Integration Logos */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="subtitle2"
              align="center"
              sx={{
                mb: 3,
                color: isDarkMode ? 'grey.400' : 'grey.600',
                fontFamily: 'var(--font-inter)',
              }}
            >
              Respaldado por líderes en seguridad
            </Typography>

            <Stack
  direction="row"
  spacing={4}
  justifyContent="center"
  alignItems="center"
  sx={{
    flexWrap: 'wrap',
    gap: { xs: 4, md: 6 },
  }}
>
  {integrationLogos.map((logo, index) => (
    <motion.div
      key={index}
      variants={ANIMATION_VARIANTS.item}
      whileHover={ANIMATION_VARIANTS.hover}
    >
      <Tooltip title={logo.description} arrow>
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 40,
            // SOLO AWS cambia en modo oscuro
            filter: isDarkMode
              ? logo.name === 'AWS'
                ? 'invert(1) brightness(1.2)' // 🧠 Solo AWS se invierte en modo oscuro
                : 'brightness(0.8) contrast(1.2)' // Los demás
              : 'none',
            opacity: isDarkMode ? 0.9 : 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              filter: 'none',
              opacity: 1,
            },
          }}
        >
          <Image
            src={logo.icon}
            alt={logo.alt}
            fill
            style={{ objectFit: 'contain' }}
            loading="lazy"
          />
        </Box>
      </Tooltip>
    </motion.div>
  ))}
</Stack>
          </Box>

          {/* Security Features */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
              },
              gap: { xs: 3, md: 4 },
              mb: 8,
              width: '100%',
            }}
          >
            {securityFeatures.map((feature) => (
              <motion.div
                key={feature.id}
                variants={ANIMATION_VARIANTS.item}
                whileHover={ANIMATION_VARIANTS.hover}
                whileTap={ANIMATION_VARIANTS.tap}
                style={{
                  display: 'flex',
                  height: '100%',
                }}
              >
                <SecurityCard
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    backgroundColor: isDarkMode
                      ? alpha(theme.palette.background.paper, 0.8)
                      : alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.3s ease-in-out',
                    minWidth: { xs: '280px', sm: '320px' },
                    boxShadow: theme.shadows[1],
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 24px ${alpha(feature.color, 0.2)}`,
                    },
                  }}
                >
                  <Stack spacing={3}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <motion.div whileHover={ANIMATION_VARIANTS.icon.hover}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(feature.color, isDarkMode ? 0.15 : 0.1),
                            color: feature.color,
                          }}
                        >
                          {feature.icon}
                        </Box>
                      </motion.div>

                      {feature.badge && (
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: alpha(feature.color, 0.1),
                            color: feature.color,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontWeight: 600,
                            }}
                          >
                            {feature.badge}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    <Stack spacing={1} sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'var(--font-plus-jakarta)',
                          fontWeight: 600,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDarkMode ? 'grey.400' : 'grey.700',
                          fontFamily: 'var(--font-inter)',
                          lineHeight: 1.7,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </SecurityCard>
              </motion.div>
            ))}
          </Box>

          {/* CTA Section */}
          <motion.div variants={ANIMATION_VARIANTS.item}>
            <Stack
              alignItems="center"
              spacing={3}
              sx={{
                backgroundColor: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.8)
                  : alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(12px)',
                p: { xs: 3, md: 4 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'var(--font-plus-jakarta)',
                  fontWeight: 700,
                  textAlign: 'center',
                  maxWidth: 600,
                }}
              >
                ¿Querés conocer más sobre cómo protegemos tus datos?
              </Typography>

              <Stack spacing={1} alignItems="center">
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.success,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 500,
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                  Certificaciones de seguridad internacionales
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isDarkMode ? 'grey.400' : 'grey.600',
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  Elegido por empresas líderes de seguros en Latinoamérica
                </Typography>
              </Stack>

              {/* Botones alineados y del mismo tamaño */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ 
                  width: '100%', 
                  maxWidth: 500,
                  '& > div': {
                    flex: 1, // Hace que ambos contenedores ocupen el mismo espacio
                  }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    href="/seguridad"
                    endIcon={<ArrowIcon />}
                    onClick={() => trackEvent('cta_security_main_click')}
                    sx={{
                      height: 56, // Altura fija para ambos botones
                      borderRadius: 3,
                      fontSize: '1rem', // Mismo tamaño de fuente para ambos
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
                    Conocé nuestras medidas de seguridad
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    href="/privacidad"
                    size="large"
                    onClick={() => trackEvent('cta_security_secondary_click')}
                    sx={{
                      height: 56, // Altura fija para ambos botones
                      borderRadius: 3,
                      fontSize: '1rem', // Mismo tamaño de fuente para ambos
                      fontWeight: 600, // Mismo peso de fuente para ambos
                      textTransform: 'none',
                      fontFamily: 'var(--font-plus-jakarta)',
                      borderColor: alpha(COLORS.primary, 0.3),
                      color: COLORS.primary,
                      '&:hover': {
                        borderColor: COLORS.primary,
                        backgroundColor: alpha(COLORS.primary, 0.05),
                      },
                    }}
                  >
                    Ver política de privacidad
                  </Button>
                </motion.div>
              </Stack>

              {/* Additional Trust Indicator */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 2,
                }}
              >
                <InfoIcon
                  fontSize="small"
                  sx={{ color: isDarkMode ? 'grey.400' : 'grey.600' }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    color: isDarkMode ? 'grey.400' : 'grey.600',
                  }}
                >
                  +500 corredores confían en Assuriva para proteger sus datos
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        </motion.div>
      </Container>

      {/* Add keyframes for background animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  );
}