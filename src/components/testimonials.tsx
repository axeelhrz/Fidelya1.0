'use client';

import { Work_Sans, Inter } from 'next/font/google';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Stack,
  Avatar,
  Card,
  Button,
  Modal,
  useTheme,
  Rating,
  Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FormatQuote as QuoteIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  KeyboardArrowRight as ArrowIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { useState, useRef } from 'react';

// Font configuration
const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Types
interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  featured?: boolean;
  fullStory?: string;
  location?: string;
  metrics?: {
    value: string;
    label: string;
  };
}

// Colors
const COLORS = {
  primary: '#2196F3',
  secondary: '#9C27B0',
  success: '#4CAF50',
  background: '#F5F7FA',
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  hover: {
    scale: 1.03,
    transition: { type: 'spring', stiffness: 140 }
  },
  tap: {
    scale: 0.98
  }
};

// Sample testimonials data
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    role: 'Corredor de Seguros Senior',
    company: 'Seguros Globales SA',
    avatar: '/avatars/carlos.jpg',
    quote: 'Desde que implementamos esta plataforma, redujimos un 70% el tiempo dedicado a tareas administrativas. La automatización es increíble.',
    rating: 5,
    featured: true,
    location: 'Buenos Aires, Argentina',
    fullStory: 'Llevaba 15 años gestionando mi cartera de clientes de forma tradicional. El cambio a digital me daba miedo, pero el soporte del equipo fue excepcional. Ahora proceso renovaciones en minutos y mis clientes están más satisfechos que nunca.',
    metrics: {
      value: '70%',
      label: 'menos tiempo en admin'
    }
  },
  {
    id: '2',
    name: 'Ana María López',
    role: 'Directora Comercial',
    company: 'Brokers Unidos',
    avatar: '/avatars/ana.jpg',
    quote: 'La organización y seguimiento de pólizas nunca fue tan fácil. Aumentamos nuestra retención de clientes significativamente.',
    rating: 5,
    location: 'Montevideo, Uruguay',
    metrics: {
      value: '+40%',
      label: 'retención'
    }
  },
  {
    id: '3',
    name: 'Miguel Ángel Pérez',
    role: 'Broker Independiente',
    company: 'MAP Seguros',
    avatar: '/avatars/miguel.jpg',
    quote: 'Excelente plataforma. Me permite dar un servicio más profesional y mantener todo bajo control.',
    rating: 5,
    location: 'Santiago, Chile'
  }
];

export default function TestimonialsSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const quoteRotation = useTransform(scrollYProgress, [0, 1], [0, 10]);

  const handleTestimonialClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'testimonial_story_view', {
        testimonial_id: testimonial.id,
        testimonial_author: testimonial.name
      });
    }
  };

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'testimonial_cta_click', {
        event_category: 'conversion',
        event_label: 'testimonials_section'
      });
    }
  };

  return (
    <Box
      component="section"
      ref={containerRef}
      className={`${workSans.variable} ${inter.variable}`}
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
        background: isDarkMode
          ? `linear-gradient(45deg, ${alpha(theme.palette.background.default, 0.94)}, ${alpha(theme.palette.background.default, 0.98)})`
          : `linear-gradient(45deg, ${alpha(COLORS.primary, 0.02)}, ${alpha(theme.palette.background.default, 0.98)})`,
      }}
    >
      {/* Decorative Background */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          zIndex: 0,
          background: `radial-gradient(circle at 50% 50%, ${COLORS.primary} 0%, transparent 50%)`,
          opacity: backgroundOpacity
        }}
      />

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
                    fontFamily: 'var(--font-work-sans)',
                    textTransform: 'uppercase',
                    backgroundColor: alpha(COLORS.primary, isDarkMode ? 0.15 : 0.1),
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <StarIcon fontSize="small" />
                  Historias de éxito
                </Typography>
              </Box>

              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontFamily: 'var(--font-work-sans)',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Lo que dicen nuestros usuarios
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: isDarkMode ? 'grey.300' : 'grey.800',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Descubrí cómo corredores de toda Latinoamérica transformaron su gestión
              </Typography>

              {/* Social Proof */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mt: 3 }}
              >
                <Chip
                  icon={<StarIcon sx={{ color: COLORS.primary }} />}
                  label="4.9 de 5 basado en 123 valoraciones"
                  sx={{
                    backgroundColor: alpha(COLORS.primary, 0.1),
                    color: COLORS.primary,
                    fontFamily: 'var(--font-inter)',
                  }}
                />
                <Chip
                  icon={<ShieldIcon sx={{ color: COLORS.success }} />}
                  label="Testimonios verificados"
                  sx={{
                    backgroundColor: alpha(COLORS.success, 0.1),
                    color: COLORS.success,
                    fontFamily: 'var(--font-inter)',
                  }}
                />
              </Stack>
            </motion.div>
          </Stack>

          {/* Testimonials Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 4,
              mb: 8,
            }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={ANIMATION_VARIANTS.item}
                whileHover={ANIMATION_VARIANTS.hover}
                whileTap={ANIMATION_VARIANTS.tap}
              >
                <Card
                  sx={{
                    height: '100%',
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'visible',
                    backgroundColor: isDarkMode ? 'background.paper' : 'common.white',
                    transition: 'all 0.3s ease-in-out',
                    borderTop: `4px solid ${testimonial.featured ? COLORS.primary : 'transparent'}`,
                    ...(testimonial.featured && {
                      boxShadow: `0 8px 32px ${alpha(COLORS.primary, 0.15)}`,
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 4,
                        border: `2px solid transparent`,
                        background: `linear-gradient(45deg, ${alpha(COLORS.primary, 0.2)}, ${alpha(COLORS.secondary, 0.2)})`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }
                    }),
                  }}
                >
                  {/* Quote Icon */}
                  <Box
                    component={motion.div}
                    style={{ rotate: quoteRotation }}
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: 24,
                      color: alpha(COLORS.primary, 0.2),
                      transform: 'rotate(10deg)',
                    }}
                  >
                    <QuoteIcon sx={{ fontSize: 40 }} />
                  </Box>

                  <Stack spacing={3}>
                    {/* Avatar and Info */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56 }}
                      />
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontFamily: 'var(--font-work-sans)',
                              fontWeight: 600,
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <VerifiedIcon
                            sx={{
                              fontSize: 16,
                              color: COLORS.primary,
                            }}
                          />
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDarkMode ? 'grey.400' : 'grey.600',
                            fontFamily: 'var(--font-inter)',
                          }}
                        >
                          {testimonial.role} · {testimonial.company}
                        </Typography>
                        {testimonial.location && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: isDarkMode ? 'grey.500' : 'grey.500',
                              fontFamily: 'var(--font-inter)',
                            }}
                          >
                            {testimonial.location}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    {/* Rating */}
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      sx={{
                        color: COLORS.primary,
                      }}
                    />

                    {/* Quote */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: isDarkMode ? 'grey.300' : 'grey.800',
                        fontFamily: 'var(--font-inter)',
                        lineHeight: 1.7,
                      }}
                    >
                      &ldquo;{testimonial.quote}&rdquo;
                    </Typography>

                    {/* Metrics */}
                    {testimonial.metrics && (
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="baseline"
                          sx={{
                            color: COLORS.primary,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: 'var(--font-work-sans)',
                              fontWeight: 700,
                            }}
                          >
                            {testimonial.metrics.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              opacity: 0.9,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {testimonial.metrics.label}
                          </Typography>
                        </Stack>
                      </Box>
                    )}

                    {/* Read More Button */}
                    {testimonial.fullStory && (
                      <Button
                        onClick={() => handleTestimonialClick(testimonial)}
                        endIcon={<ArrowIcon />}
                        sx={{
                          alignSelf: 'flex-start',
                          mt: 2,
                          color: COLORS.primary,
                          fontFamily: 'var(--font-work-sans)',
                          '&:hover': {
                            backgroundColor: alpha(COLORS.primary, 0.1),
                          },
                        }}
                      >
                        Leer historia completa
                      </Button>
                    )}
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </Box>

          {/* CTA Section */}
          <motion.div variants={ANIMATION_VARIANTS.item}>
            <Stack
              alignItems="center"
              spacing={3}
              sx={{
                p: { xs: 3, md: 4 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'var(--font-work-sans)',
                  fontWeight: 700,
                  textAlign: 'center',
                  maxWidth: 600,
                }}
              >
                Unite a +500 corredores que ya transformaron su gestión
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  href="/pricing"
                  onClick={handleCtaClick}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontFamily: 'var(--font-work-sans)',
                    backgroundColor: COLORS.primary,
                    '&:hover': {
                      backgroundColor: alpha(COLORS.primary, 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 16px ${alpha(COLORS.primary, 0.25)}`,
                    },
                  }}
                >
                  Automatizá como ellos
                </Button>
              </motion.div>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: isDarkMode ? 'grey.400' : 'grey.600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <ShieldIcon fontSize="small" />
                7 días de prueba gratis · Cancelá cuando quieras
              </Typography>
            </Stack>
          </motion.div>
        </motion.div>
      </Container>

      {/* Full Story Modal */}
      <Modal
        open={!!selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
        aria-labelledby="testimonial-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedTestimonial && (
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={selectedTestimonial.avatar}
                  alt={selectedTestimonial.name}
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'var(--font-work-sans)',
                      fontWeight: 600,
                    }}
                  >
                    {selectedTestimonial.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontFamily: 'var(--font-inter)',
                    }}
                  >
                    {selectedTestimonial.role} · {selectedTestimonial.company}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  lineHeight: 1.8,
                }}
              >
                {selectedTestimonial.fullStory}
              </Typography>
              {selectedTestimonial.metrics && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: alpha(COLORS.primary, 0.1),
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography
                      variant="h6"
                      sx={{
                        color: COLORS.primary,
                        fontFamily: 'var(--font-work-sans)',
                        fontWeight: 700,
                      }}
                    >
                      {selectedTestimonial.metrics.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: COLORS.primary,
                        fontFamily: 'var(--font-inter)',
                      }}
                    >
                      {selectedTestimonial.metrics.label}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Modal>
    </Box>
  );
}