'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore,
  AccountCircle,
  Security,
  PhoneAndroid,
  Support,
  Key,
  LiveHelp,
  Payment,
  ContactSupport,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types
interface FaqItem {
  id: number;
  icon: React.ReactNode;
  question: string;
  answer: string;
  featured?: boolean;
  category?: string;
}

// Animation variants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  leftItem: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  rightItem: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  iconRotate: {
    initial: { rotate: 0 },
    hover: { rotate: 90, transition: { duration: 0.3 } }
  }
};

// FAQ Data
const faqItems: FaqItem[] = [
  {
    id: 1,
    icon: <AccountCircle />,
    question: '¿Cómo puedo crear una cuenta?',
    answer: 'Crear una cuenta es muy sencillo. Solo necesitas hacer clic en "Comenzar" y completar el formulario de registro con tu información básica. En menos de 2 minutos podrás empezar a usar la plataforma.',
    featured: true,
    category: 'Cuenta'
  },
  {
    id: 2,
    icon: <Payment />,
    question: '¿Puedo gestionar múltiples pólizas a la vez?',
    answer: 'Sí, nuestra plataforma está diseñada para manejar múltiples pólizas de manera eficiente. Puedes organizar, filtrar y gestionar todas tus pólizas desde un único panel de control intuitivo.',
    featured: true,
    category: 'Funcionalidad'
  },
  {
    id: 3,
    icon: <Security />,
    question: '¿Qué tan segura es la plataforma?',
    answer: 'Implementamos los más altos estándares de seguridad, incluyendo cifrado SSL, autenticación de dos factores y backups automáticos. Toda tu información está protegida con tecnología de nivel bancario.',
    category: 'Seguridad'
  },
  {
    id: 4,
    icon: <PhoneAndroid />,
    question: '¿Puedo acceder desde el celular?',
    answer: 'Sí, nuestra plataforma es 100% responsive y funciona perfectamente en dispositivos móviles. Puedes acceder desde cualquier smartphone o tablet con la misma experiencia que en desktop.',
    category: 'Acceso'
  },
  {
    id: 5,
    icon: <Support />,
    question: '¿Tienen atención personalizada?',
    answer: 'Ofrecemos atención personalizada a través de múltiples canales: chat en vivo, correo electrónico y soporte telefónico. Nuestro equipo está disponible para ayudarte en horario laboral.',
    featured: true,
    category: 'Soporte'
  },
  {
    id: 6,
    icon: <Key />,
    question: '¿Qué pasa si olvido mi contraseña?',
    answer: 'No te preocupes, puedes recuperar tu contraseña fácilmente haciendo clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Te enviaremos un enlace seguro para restablecerla.',
    category: 'Cuenta'
  },
  {
    id: 7,
    icon: <LiveHelp />,
    question: '¿Ofrecen soporte técnico?',
    answer: 'Sí, contamos con un equipo de soporte técnico especializado para resolver cualquier inconveniente que puedas tener. Además, tenemos una base de conocimientos con tutoriales y guías.',
    category: 'Soporte'
  },
  {
    id: 8,
    icon: <Payment />,
    question: '¿Cómo funcionan las suscripciones?',
    answer: 'Ofrecemos planes flexibles que se adaptan a tus necesidades. Puedes elegir entre pagos mensuales o anuales, y cambiar o cancelar tu plan en cualquier momento sin compromisos.',
    category: 'Pagos'
  }
];

export const FaqSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState<number | false>(false);

  // Enhanced tracking
  const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
    
    if (isExpanded && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'faq_open', {
        question_id: panel,
        event_category: 'engagement',
        event_label: 'FAQ Accordion Interaction',
      });
    }
  };

  const handleContactClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_support_click', {
        event_category: 'engagement',
        event_label: 'FAQ Section',
      });
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: isDarkMode 
          ? 'background.default' 
          : alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Header */}
          <Box
            component={motion.div}
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            textAlign="center"
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
                background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Preguntas Frecuentes
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                color: isDarkMode ? 'grey.400' : 'grey.700',
              }}
            >
              Resolvemos tus dudas antes de comenzar
            </Typography>
          </Box>

          {/* FAQ Accordions */}
          <Box
            component={motion.div}
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Stack spacing={2}>
              <AnimatePresence>
                {faqItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.question}`}
                    variants={index % 2 === 0 ? ANIMATION_VARIANTS.leftItem : ANIMATION_VARIANTS.rightItem}
                  >
                    <Accordion
                      expanded={expanded === item.id}
                      onChange={handleAccordionChange(item.id)}
                      TransitionProps={{ timeout: 300 }}
                      sx={{
                        backgroundColor: 'background.paper',
                        '&:before': { display: 'none' },
                        borderRadius: '8px !important',
                        mb: 1,
                        boxShadow: theme.shadows[1],
                        borderLeft: item.featured 
                          ? `4px solid ${theme.palette.primary.main}` 
                          : 'none',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4],
                        },
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <motion.div
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ExpandMore />
                          </motion.div>
                        }
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <motion.div
                            whileHover={ANIMATION_VARIANTS.iconRotate.hover}
                          >
                            <Box
                              sx={{
                                color: theme.palette.primary.main,
                                display: { xs: 'none', sm: 'flex' },
                                opacity: 0.8,
                                '&:hover': {
                                  opacity: 1,
                                },
                              }}
                            >
                              {item.icon}
                            </Box>
                          </motion.div>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontSize: '1.1rem',
                              color: expanded === item.id
                                ? theme.palette.primary.main
                                : theme.palette.text.primary,
                            }}
                          >
                            {item.question}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          variant="body2"
                          sx={{
                            pl: { xs: 0, sm: 6 },
                            color: isDarkMode ? 'grey.400' : 'grey.700',
                            lineHeight: 1.7,
                          }}
                        >
                          {item.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>
          </Box>

          {/* Contact Section */}
          <Box
            component={motion.div}
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            sx={{
              mt: 6,
              textAlign: 'center',
              p: 4,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Stack
              spacing={3}
              alignItems="center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <ContactSupport
                  sx={{
                    fontSize: 48,
                    color: theme.palette.primary.main,
                    opacity: 0.9,
                  }}
                />
              </motion.div>

              <Typography 
                variant="h6"
                sx={{
                  color: isDarkMode ? 'grey.300' : 'grey.800',
                  fontWeight: 600,
                }}
              >
                ¿No encontraste lo que buscabas?
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? 'grey.400' : 'grey.600',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta
              </Typography>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/contact" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleContactClick}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.9),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Contactar Soporte
                  </Button>
                </Link>
              </motion.div>

              <Typography
                variant="caption"
                sx={{
                  color: isDarkMode ? 'grey.500' : 'grey.600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Support fontSize="small" />
                Tiempo promedio de respuesta: 2 horas
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Container>

      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Box>
  );
};

export default FaqSection;