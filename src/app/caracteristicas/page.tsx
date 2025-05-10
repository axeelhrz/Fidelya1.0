'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Button, useTheme, Paper, Chip, Stack } from '@mui/material';
import {
  Rocket,
  Shield,
  Clock,
  ChartLine,
  Users,
  Check,
  Star,
  ArrowRight,
  ShieldCheck,
  Lightning,
  ChartPieSlice,
  Brain,
  CircleWavyCheck,
} from '@phosphor-icons/react';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: 30 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const scaleUp = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Types
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  benefits: string[];
  integrations?: string[];
  metrics?: {
    value: string;
    label: string;
  };
}

interface MetricCardProps {
  icon: React.ReactNode;
  metric: string;
  description: string;
  trend?: string;
}

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

interface TimelineStepProps {
  period: string;
  title: string;
  description: string;
  achievements: string[];
  color: string;
}

interface ComparisonItemProps {
  traditional: string;
  assuriva: string;
}

// Components
const FeatureCard = ({ icon, title, description, color, benefits, integrations, metrics }: FeatureCardProps) => {
  const theme = useTheme();
  const [showIntegrations, setShowIntegrations] = useState(false);
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -8,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 17
        }
      }}
      onMouseEnter={() => setShowIntegrations(true)}
      onMouseLeave={() => setShowIntegrations(false)}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          height: '100%',
          borderRadius: '24px',
          background: theme.palette.mode === 'light'
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 10px 40px -10px rgba(0,0,0,0.05)'
            : '0 10px 40px -10px rgba(0,0,0,0.25)',
          transition: 'all 0.4s ease',
          border: '1px solid',
          borderColor: theme.palette.mode === 'light'
            ? 'rgba(0,0,0,0.05)'
            : 'rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: `0 20px 40px -10px ${color}20`,
            borderColor: `${color}40`,
            transform: 'translateY(-8px)',
          }
        }}
      >
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            color: color,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
            }
          }}
        >
          {icon}
        </Box>
        
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: '1.25rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.7,
            mb: 3,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          {benefits.map((benefit, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 1,
              }}
            >
              <Check size={18} weight="bold" style={{ color: color }} />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                {benefit}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* Integrations Overlay */}
        {integrations && showIntegrations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              background: `linear-gradient(to top, ${color}10, transparent)`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 1,
                color: color,
                fontWeight: 600,
              }}
            >
              Integraciones disponibles
            </Typography>
            
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              gap={1}
            >
              {integrations.map((integration, index) => (
                <Chip
                  key={index}
                  label={integration}
                  size="small"
                  sx={{
                    backgroundColor: `${color}15`,
                    color: color,
                    fontFamily: '"Inter", sans-serif',
                  }}
                />
              ))}
            </Stack>
          </motion.div>
        )}
        
        {/* Metrics */}
        {metrics && (
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: `1px solid ${color}20`,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="baseline"
              sx={{
                color: color,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                }}
              >
                {metrics.value}
              </Typography>
              
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 500,
                }}
              >
                {metrics.label}
              </Typography>
            </Stack>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

const MetricCard = ({ icon, metric, description, trend }: MetricCardProps) => {
  const theme = useTheme();
  
  return (
    <motion.div
      variants={scaleUp}
      whileHover={{
        scale: 1.05,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 17
        }
      }}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={0}
        sx={{
          textAlign: 'center',
          p: 4,
          borderRadius: '24px',
          background: theme.palette.mode === 'light'
            ? 'rgba(255,255,255,0.8)'
            : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'light'
            ? 'rgba(255,255,255,0.5)'
            : 'rgba(255,255,255,0.1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            gap: 1,
          }}
        >
          {icon}
          {trend && (
            <Typography
              component="span"
              sx={{
                color: theme.palette.success.main,
                fontSize: '1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <ArrowRight size={16} weight="bold" />
              {trend}
            </Typography>
          )}
        </Box>
        
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 800,
            mb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          {metric}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: '1.1rem',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Paper>
    </motion.div>
  );
};

// Testimonial Component
const Testimonial = ({ quote, author, role, company, image }: TestimonialProps) => {
  const theme = useTheme();
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '24px',
          background: theme.palette.mode === 'light'
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'light'
            ? 'rgba(0,0,0,0.05)'
            : 'rgba(255,255,255,0.05)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mb: 3 }}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              weight="fill"
              style={{
                color: theme.palette.primary.main,
                marginRight: '4px'
              }}
            />
          ))}
        </Box>
        
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            fontSize: '1.1rem',
            lineHeight: 1.7,
            fontStyle: 'italic',
            color: theme.palette.text.primary,
            flexGrow: 1,
          }}
        >
          &ldquo;{quote}&rdquo;
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={image || "https://randomuser.me/api/portraits/men/1.jpg"} // Fallback image
            alt={author}
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              // Fallback if image fails to load
              e.currentTarget.src = "https://randomuser.me/api/portraits/men/1.jpg";
            }}
          />
          
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              {author}
            </Typography>
            
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {role} en {company}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

// Timeline Step Component
const TimelineStep = ({ period, title, description, achievements, color }: TimelineStepProps) => {
  const theme = useTheme();
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15
        }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          background: theme.palette.mode === 'light'
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: `${color}30`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: color,
          }
        }}
      >
        <Box sx={{ pl: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: color,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            {period}
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            {description}
          </Typography>
          
          <Stack spacing={1}>
            {achievements.map((achievement, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CircleWavyCheck size={16} weight="fill" style={{ color: color }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  {achievement}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
};

// Comparison Item Component
const ComparisonItem = ({ traditional, assuriva }: ComparisonItemProps) => {
  const theme = useTheme();
  
  return (
    <motion.div variants={fadeInUp}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          background: theme.palette.mode === 'light'
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'light'
            ? 'rgba(0,0,0,0.05)'
            : 'rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: '12px',
            background: theme.palette.mode === 'light'
              ? 'rgba(0,0,0,0.03)'
              : 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.palette.mode === 'light'
                ? 'rgba(0,0,0,0.1)'
                : 'rgba(255,255,255,0.1)',
              color: theme.palette.error.main,
            }}
          >
            <Lightning size={20} weight="bold" />
          </Box>
          
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {traditional}
          </Typography>
        </Box>
        
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.palette.primary.main,
              color: '#fff',
            }}
          >
            <Check size={20} weight="bold" />
          </Box>
          
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {assuriva}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default function Features() {
  const theme = useTheme();
  
  // Features data
  const features = [
    {
      icon: <Rocket size={36} weight="duotone" />,
      title: 'Automatización Inteligente',
      description: 'Revoluciona tu gestión con IA y automatización avanzada.',
      color: theme.palette.primary.main,
      benefits: [
        'Reduce 80% tareas manuales',
        'Automatización de renovaciones',
        'Gestión inteligente de documentos'
      ],
      integrations: ['WhatsApp', 'Gmail', 'Outlook', 'CRM'],
      metrics: {
        value: '-80%',
        label: 'tareas manuales'
      }
    },
    {
      icon: <Brain size={36} weight="duotone" />,
      title: 'Alertas Predictivas',
      description: 'Anticípate a las necesidades de tus clientes con alertas inteligentes.',
      color: theme.palette.secondary.main,
      benefits: [
        'Predicción de renovaciones',
        'Alertas personalizadas',
        'Seguimiento automático'
      ],
      integrations: ['SMS', 'Email', 'Push', 'Calendar'],
      metrics: {
        value: '+40%',
        label: 'retención'
      }
    },
    {
      icon: <Users size={36} weight="duotone" />,
      title: 'Gestión de Clientes 360°',
      description: 'Visión completa de tus clientes y sus necesidades.',
      color: '#00BFA5',
      benefits: [
        'Perfiles completos',
        'Historial detallado',
        'Oportunidades de cross-selling'
      ],
      integrations: ['CRM', 'Redes Sociales', 'WhatsApp'],
      metrics: {
        value: '100%',
        label: 'visibilidad'
      }
    },
    {
      icon: <ChartLine size={36} weight="duotone" />,
      title: 'Analytics Avanzados',
      description: 'Datos y métricas en tiempo real para mejores decisiones.',
      color: '#FF4081',
      benefits: [
        'Dashboards personalizables',
        'Reportes automatizados',
        'Predicciones de mercado'
      ],
      integrations: ['Excel', 'Power BI', 'Google Analytics'],
      metrics: {
        value: '+25%',
        label: 'precisión'
      }
    },
    {
      icon: <Shield size={36} weight="duotone" />,
      title: 'Seguridad Empresarial',
      description: 'Protección de nivel bancario para tus datos y operaciones.',
      color: '#7C4DFF',
      benefits: [
        'Cifrado de extremo a extremo',
        'Cumplimiento GDPR',
        'Backups automáticos'
      ],
      integrations: ['2FA', 'SSO', 'Biometría'],
      metrics: {
        value: '99.9%',
        label: 'uptime'
      }
    },
    {
      icon: <Lightning size={36} weight="duotone" />,
      title: 'Velocidad y Eficiencia',
      description: 'Optimiza tus procesos y mejora la productividad.',
      color: '#FF6E40',
      benefits: [
        'Respuesta inmediata',
        'Procesos optimizados',
        'Integración con APIs'
      ],
      integrations: ['REST API', 'Webhooks', 'Zapier'],
      metrics: {
        value: '5x',
        label: 'más rápido'
      }
    }
  ];
  
  // Metrics data
  const metrics = [
    {
      icon: <Clock size={32} weight="duotone" style={{ color: theme.palette.primary.main }} />,
      metric: '+6h',
      description: 'ahorro semanal por usuario',
      trend: '+25% vs 2022'
    },
    {
      icon: <ChartPieSlice size={32} weight="duotone" style={{ color: theme.palette.secondary.main }} />,
      metric: '+40%',
      description: 'aumento en renovaciones',
      trend: '+15% mensual'
    },
    {
      icon: <ShieldCheck size={32} weight="duotone" style={{ color: '#00BFA5' }} />,
      metric: '100%',
      description: 'control de pólizas',
      trend: 'Garantizado'
    },
    {
      icon: <Lightning size={32} weight="duotone" style={{ color: '#FF4081' }} />,
      metric: '99.9%',
      description: 'disponibilidad del sistema',
      trend: 'SLA Enterprise'
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      quote: "Assuriva transformó completamente nuestra correduría. Ahorramos horas de trabajo y aumentamos nuestras ventas en un 40%.",
      author: "María González",
      role: "Directora",
      company: "Seguros MG",
      image: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      quote: "La mejor inversión que hemos hecho. El ROI fue visible desde el primer mes de uso.",
      author: "Carlos Rodríguez",
      role: "CEO",
      company: "Grupo Asegurador CR",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];
  
  // Timeline data
  const timeline = [
    {
      period: '1 mes',
      title: 'Automatización Básica',
      description: 'Primeros pasos hacia la transformación digital',
      achievements: [
        'Reducción del 30% en tareas administrativas',
        'Configuración de alertas automáticas',
        'Digitalización de documentos clave'
      ],
      color: theme.palette.primary.main
    },
    {
      period: '3 meses',
      title: 'Optimización Completa',
      description: 'Consolidación de procesos automatizados',
      achievements: [
        'Reducción del 60% en tareas administrativas',
        'Predicciones de renovación con 85% de precisión',
        'Integración completa con sistemas existentes'
      ],
      color: theme.palette.secondary.main
    },
    {
      period: '6 meses',
      title: 'Transformación Total',
      description: 'Máxima eficiencia y crecimiento',
      achievements: [
        'Reducción del 80% en tareas administrativas',
        'Aumento del 40% en retención de clientes',
        'Incremento del 25% en ventas cruzadas'
      ],
      color: '#00BFA5'
    }
  ];
  
  // Comparison data
  const comparison = [
    {
      traditional: 'Procesos manuales y repetitivos',
      assuriva: 'Automatización inteligente con IA'
    },
    {
      traditional: 'Seguimiento manual de vencimientos',
      assuriva: 'Predicción y alertas automáticas'
    },
    {
      traditional: 'Documentación física o desordenada',
      assuriva: 'Gestión digital centralizada'
    }
  ];
  
  return (
    <>
      <Header />
      <Box component="main" sx={{ overflow: 'hidden' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10 10%, ${theme.palette.secondary.main}10 90%)`,
            pt: { xs: 12, md: 16 },
            pb: { xs: 8, md: 12 },
            position: 'relative',
          }}
        >
          {/* Background Elements */}
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
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Gradient Orbs */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '10%',
                  left: '5%',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
                  filter: 'blur(60px)',
                  animation: 'pulse 15s infinite',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '5%',
                  width: '250px',
                  height: '250px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.palette.secondary.main}20 0%, transparent 70%)`,
                  filter: 'blur(60px)',
                  animation: 'pulse 20s infinite reverse',
                }}
              />
            </motion.div>
          </Box>
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.75rem', md: '4rem' },
                  fontWeight: 800,
                  textAlign: 'center',
                  mb: 3,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Revoluciona tu Correduría{' '}
                <Box component="span" sx={{ display: { xs: 'block', md: 'inline' } }}>
                  con Inteligencia Artificial
                </Box>
              </Typography>
              
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  textAlign: 'center',
                  mb: 5,
                  color: theme.palette.mode === 'light'
                    ? 'rgba(0,0,0,0.7)'
                    : 'rgba(255,255,255,0.7)',
                  maxWidth: '800px',
                  mx: 'auto',
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                Automatiza tus procesos, multiplica tus ventas y ofrece una experiencia
                excepcional a tus clientes con la plataforma más avanzada del mercado.
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'center',
                  gap: { xs: 2, sm: 3 },
                  mb: 5,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    href='/contact'
                    sx={{
                      borderRadius: '14px',
                      px: { xs: 4, md: 6 },
                      py: { xs: 1.5, md: 2 },
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      textTransform: 'none',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 25px -5px ${theme.palette.primary.main}40`,
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        boxShadow: `0 12px 30px -5px ${theme.palette.primary.main}60`,
                      },
                    }}
                  >
                    Solicitar Demo
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    href='#features'
                    sx={{
                      borderRadius: '14px',
                      px: { xs: 4, md: 6 },
                      py: { xs: 1.5, md: 2 },
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      textTransform: 'none',
                      fontWeight: 600,
                      borderWidth: '2px',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        borderWidth: '2px',
                        background: theme.palette.mode === 'light'
                          ? 'rgba(0,0,0,0.02)'
                          : 'rgba(255,255,255,0.02)',
                      },
                    }}
                  >
                    Explorar Funcionalidades
                  </Button>
                </motion.div>
              </Box>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 2, sm: 4 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: theme.palette.success.main,
                  }}
                >
                  <ShieldCheck size={24} weight="fill" />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    +500 Corredores Confían en Nosotros
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: theme.palette.primary.main,
                  }}
                >
                  <Star size={24} weight="fill" />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    4.9/5 Valoración Media
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Container>
        </Box>
        
        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              Todo lo que Necesitas en Una Plataforma
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mb: 8,
                color: theme.palette.text.secondary,
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.125rem',
              }}
            >
              Diseñada específicamente para corredores de seguros, nuestra plataforma
              integra todas las herramientas que necesitas para hacer crecer tu negocio.
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                justifyContent: 'center',
              }}
            >
              {features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    width: {
                      xs: '100%',
                      md: 'calc(50% - 2rem)',
                      lg: 'calc(33.333% - 2.67rem)',
                    },
                  }}
                >
                  <FeatureCard {...feature} />
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
        
        {/* Timeline Section */}
        <Box
          sx={{
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #f8f9fa, #f1f3f5)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 2,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              >
                Tu Evolución con Assuriva
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  mb: 8,
                  color: theme.palette.text.secondary,
                  maxWidth: '700px',
                  mx: 'auto',
                  fontSize: '1.125rem',
                }}
              >
                Descubre cómo Assuriva transforma tu negocio desde el primer día
              </Typography>
              
              {/* Timeline */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 4,
                  position: 'relative',
                  mb: 6,
                }}
              >
                {/* Timeline Line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: 0, md: '50%' },
                    left: { xs: '24px', md: 0 },
                    width: { xs: '2px', md: '100%' },
                    height: { xs: '100%', md: '2px' },
                    background: `linear-gradient(${theme.palette.mode === 'light' ? '90deg' : '90deg'}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transform: { xs: 'none', md: 'translateY(-50%)' },
                    display: { xs: 'block', md: 'block' },
                    zIndex: 0,
                  }}
                />
                
                {timeline.map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <TimelineStep {...step} />
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Container>
        </Box>
        
        {/* Metrics Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.5,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '20%',
                  right: '10%',
                  width: '200px',
                  height: '200px',
                  background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
                  filter: 'blur(50px)',
                  animation: 'pulse 15s infinite',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '10%',
                  width: '250px',
                  height: '250px',
                  background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
                  filter: 'blur(50px)',
                  animation: 'pulse 20s infinite reverse',
                }}
              />
            </motion.div>
          </Box>
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 2,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              >
                Resultados Comprobados
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  mb: 8,
                  color: theme.palette.text.secondary,
                  maxWidth: '700px',
                  mx: 'auto',
                  fontSize: '1.125rem',
                }}
              >
                Nuestros usuarios experimentan mejoras significativas en su productividad
                y resultados desde el primer mes de uso.
              </Typography>
              
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 4,
                }}
              >
                {metrics.map((metric, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: '100%',
                    }}
                  >
                    <MetricCard {...metric} />
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Container>
        </Box>
        
        {/* Comparison Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              ¿Por qué Assuriva?
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mb: 8,
                color: theme.palette.text.secondary,
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.125rem',
              }}
            >
              Descubre cómo nos diferenciamos del software tradicional
            </Typography>
            
            <Stack spacing={3} sx={{ mb: 8 }}>
              {comparison.map((item, index) => (
                <ComparisonItem key={index} {...item} />
              ))}
            </Stack>
          </motion.div>
        </Container>
        
        {/* Testimonials Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              Lo que Dicen Nuestros Usuarios
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mb: 8,
                color: theme.palette.text.secondary,
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.125rem',
              }}
            >
              Únete a cientos de corredores que ya han transformado su negocio con Assuriva.
            </Typography>
            
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: 4,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Box
                  key={index}
                  sx={{
                    height: '100%',
                  }}
                >
                  <Testimonial {...testimonial} />
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
        
        {/* Final CTA Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 5%, ${theme.palette.secondary.main}15 95%)`,
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              zIndex: 0,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Gradient Orbs */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '30%',
                  left: '10%',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
                  filter: 'blur(60px)',
                  animation: 'pulse 15s infinite',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '20%',
                  right: '10%',
                  width: '250px',
                  height: '250px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${theme.palette.secondary.main}20 0%, transparent 70%)`,
                  filter: 'blur(60px)',
                  animation: 'pulse 20s infinite reverse',
                }}
              />
            </motion.div>
          </Box>
          
          <Container maxWidth="md">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 800,
                    mb: 2,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Potencia tu correduría con Assuriva
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 4,
                    fontWeight: 'normal',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.6,
                  }}
                >
                  Automatización. Predicción. Resultados.
                </Typography>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    href='/contact'
                    sx={{
                      borderRadius: '14px',
                      px: { xs: 6, md: 8 },
                      py: { xs: 2, md: 2.5 },
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      textTransform: 'none',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 25px -5px ${theme.palette.primary.main}40`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        boxShadow: `0 12px 30px -5px ${theme.palette.primary.main}60`,
                      },
                    }}
                  >
                    Solicitar una Demo Gratuita
                  </Button>
                </motion.div>
                
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: { xs: 2, sm: 4 },
                    mt: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Check size={20} weight="bold" color={theme.palette.success.main} />
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      100% satisfacción garantizada
                    </Typography>
                  </Box>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Check size={20} weight="bold" color={theme.palette.success.main} />
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      Soporte 24/7
                    </Typography>
                  </Box>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Check size={20} weight="bold" color={theme.palette.success.main} />
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      Integración con WhatsApp y CRM
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Container>
        </Box>
      </Box>
      
      <Footer />
      
      {/* Animation Keyframes */}
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
    </>
  );
}