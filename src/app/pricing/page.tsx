'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  alpha,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import CalculateIcon from '@mui/icons-material/Calculate';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import Head from 'next/head';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { useRouter } from 'next/navigation';
// Tipos para los planes
interface PlanFeature {
  text: string;
  tooltip?: string;
}

interface Plan {
  id: 'basic' | 'pro' | 'enterprise';
  name: string;
  price: string | number;
  monthlyPrice?: string | number;
  annualPrice?: string | number;
  period: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  popular: boolean;
  color: string;
  darkColor: string;
  badge?: string;
  trialDays?: number;
  paypalPlanId?: string;
}

// Componente de partículas para el fondo
const ParticlesBackground = () => {
  const { palette } = useTheme();
  const isDark = palette.mode === 'dark';
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.6,
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: 50 }).map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            background: isDark
              ? `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)`
              : `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)`,
            borderRadius: '50%',
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
  );
};

// Componente de texto animado para el CTA final
const AnimatedText = ({ text }: { text: string }) => {
  const words = text.split(' ');
  return (
    <Box sx={{ display: 'inline-block' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', marginRight: '8px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          {word}
        </motion.span>
      ))}
    </Box>
  );
};

// Componente de contador regresivo para ofertas limitadas
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  
  useEffect(() => {
    // Simulamos un contador que se reinicia cada día
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reiniciar cuando llega a cero
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          py: 1,
          px: 2,
          borderRadius: 2,
          bgcolor: isDark 
            ? 'rgba(239, 68, 68, 0.2)' 
            : 'rgba(254, 226, 226, 0.8)',
          border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
          mb: 3,
        }}
      >
        <AccessTimeIcon 
          fontSize="small" 
          sx={{ color: 'error.main', mr: 1 }} 
        />
        <Typography variant="body2" fontWeight={600} color="error.main">
          Oferta especial termina en: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </Typography>
      </Box>
    </motion.div>
  );
};

// Componente de testimonio visual
const TestimonialCard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.1) : alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 2,
          mb: 4,
        }}
      >
        <Avatar
          sx={{ 
            width: 64, 
            height: 64,
            border: `2px solid ${theme.palette.primary.main}`,
          }}
          alt="Carlos Rodríguez"
          src="/assets/testimonial-avatar.jpg"
        />
        <Box>
          <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
            &ldquo;Desde que implementamos Assuriva, hemos reducido un 60% el tiempo dedicado a tareas administrativas y aumentado nuestra cartera de clientes en un 25% en solo 6 meses.&rdquo;
          </Typography>
          <Typography variant="subtitle2" fontWeight={600}>
            Carlos Rodríguez
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Director, Seguros Rodríguez & Asociados
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

// Componente de detección de país
const CountryDetection = () => {
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulamos detección de país (en producción usaríamos una API real)
    const detectCountry = async () => {
      try {
        // Simulación de llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCountry('España');
        setLoading(false);
      } catch (error) {
        console.error('Error detectando país:', error);
        setLoading(false);
      }
    };
    
    detectCountry();
  }, []);
  
  if (loading) return null;
  
  if (!country) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Precios mostrados en USD para {country}
        </Typography>
        <Tooltip title="Detectamos automáticamente tu ubicación para mostrarte los precios en tu moneda local">
          <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary', cursor: 'help' }} />
        </Tooltip>
      </Box>
    </motion.div>
  );
};

// Componente de modal para Enterprise
const EnterpriseContactModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulamos envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setSubmitted(true);
    
    // Reiniciar después de 3 segundos
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={!submitting ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Solicitar información sobre plan Enterprise
      </DialogTitle>
      
      <DialogContent>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Completa el formulario y un asesor especializado te contactará en menos de 24 horas para diseñar una solución personalizada para tu correduría.
              </Typography>
              
              <TextField
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
              
              <TextField
                label="Email profesional"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
              
              <TextField
                label="Empresa"
                name="company"
                value={formData.company}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
              
              <TextField
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
              
              <TextField
                label="Mensaje (opcional)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Cuéntanos sobre tu correduría y necesidades específicas"
              />
            </Stack>
          </form>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <VerifiedIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              ¡Solicitud enviada con éxito!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nos pondremos en contacto contigo en menos de 24 horas.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      {!submitted && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose} 
            disabled={submitting}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
          >
            {submitting ? 'Enviando...' : 'Enviar solicitud'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

// Componente principal de la página
export default function PricingPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const router = useRouter();
  
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [calculatorMode, setCalculatorMode] = useState(0);
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false);
  
  // Estados para la calculadora
  const [numClients, setNumClients] = useState(50);
  const [avgPremium, setAvgPremium] = useState(500);
  const [hoursPerClient, setHoursPerClient] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(25);
  
  // Referencia para el scroll al calculador
  const calculatorRef = useRef<HTMLDivElement>(null);
  
  // Guardar selección de plan en localStorage y redirigir a sign-up
  const selectPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    
    if (plan) {
      // Si es Enterprise, mostrar modal en lugar de redirigir
      if (plan.id === 'enterprise') {
        setEnterpriseModalOpen(true);
        return;
      }
      
      // Guardar plan completo con timestamp
      const selectedPlan = {
        ...plan,
        selectedAt: Date.now(),
        price: isAnnual ? plan.annualPrice : plan.monthlyPrice,
        billingPeriod: isAnnual ? 'year' : 'month'
      };
      
      localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
            router.push('/auth/sign-up');
    }
  };
  
  // Calcular ROI basado en los inputs
  const calculateROI = () => {
    const timeBeforeHours = numClients * hoursPerClient;
    const timeAfterHours = numClients * (hoursPerClient * 0.4); // Asumimos 60% de ahorro de tiempo
    const timeSavedHours = timeBeforeHours - timeAfterHours;
    const moneySaved = timeSavedHours * hourlyRate;
    const annualRevenue = numClients * avgPremium * 0.1; // Asumimos 10% de comisión
    const potentialIncrease = annualRevenue * 0.2; // Asumimos 20% de aumento
    
    // Costo anual del plan Pro
    const annualCost = isAnnual ? 29 * 12 * 0.8 : 29 * 12; // 20% descuento si es anual
    
    return {
      timeSaved: Math.round(timeSavedHours),
      moneySaved: Math.round(moneySaved),
      potentialIncrease: Math.round(potentialIncrease),
      totalBenefit: Math.round(moneySaved + potentialIncrease),
      roi: Math.round(((moneySaved + potentialIncrease) / annualCost) * 100)
    };
  };
  
  const roiData = calculateROI();
  
  // Planes de precios con IDs de PayPal
  const plans: Plan[] = [
    {
      id: 'basic',
      name: "Básico",
      price: isAnnual ? "0" : "0",
      monthlyPrice: "0",
      annualPrice: "0",
      period: "/mes",
      description: "Para corredores independientes que están comenzando",
      features: [
        { text: "Hasta 10 clientes", tooltip: "Límite de 10 clientes activos en el sistema" },
        { text: "Gestión básica de pólizas", tooltip: "Registro y seguimiento de pólizas con campos esenciales" },
        { text: "Recordatorios de renovación", tooltip: "Notificaciones automáticas para renovaciones próximas" },
        { text: "Soporte por email", tooltip: "Tiempo de respuesta en 24 horas hábiles" },
        { text: "1 usuario", tooltip: "Una única cuenta de acceso al sistema" }
      ],
      cta: "Comenzar gratis",
      popular: false,
      color: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
      darkColor: "linear-gradient(135deg, #0C4A6E 0%, #075985 100%)",
      paypalPlanId: undefined,
    },
    {
      id: "pro",
      name: "Profesional",
      price: isAnnual ? "29" : "39",
      monthlyPrice: "39",
      annualPrice: "29",
      period: isAnnual ? "/mes" : "/mes",
      description: "Para corredurías en crecimiento que necesitan más herramientas",
      features: [
        { text: "Clientes ilimitados", tooltip: "Sin restricciones en el número de clientes" },
        { text: "Gestión avanzada de pólizas", tooltip: "Campos personalizados, documentos adjuntos y seguimiento detallado" },
        { text: "Automatización de renovaciones", tooltip: "Flujos de trabajo automatizados para renovaciones" },
        { text: "Soporte prioritario 24/7", tooltip: "Asistencia por email, chat y teléfono con prioridad" },
        { text: "Hasta 5 usuarios", tooltip: "Cinco cuentas con diferentes niveles de permisos" },
        { text: "Análisis de rentabilidad", tooltip: "Informes detallados de rendimiento por cliente y póliza" },
        { text: "Integración con CRM", tooltip: "Conexión con sistemas CRM populares" },
        { text: "Personalización de documentos", tooltip: "Plantillas personalizables para comunicaciones" }
      ],
      cta: "Suscribirme ahora",
      popular: true,
      color: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
      darkColor: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
      badge: "Más popular",
      trialDays: 7,
      paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Personalizado",
      period: "",
      description: "Para grandes corredurías con necesidades específicas",
      features: [
        { text: "Todo lo de Profesional", tooltip: "Incluye todas las características del plan Profesional" },
        { text: "Usuarios ilimitados", tooltip: "Sin restricciones en el número de usuarios" },
        { text: "API personalizada", tooltip: "Acceso a API para integraciones a medida" },
        { text: "Gestor de cuenta dedicado", tooltip: "Un representante exclusivo para tu cuenta" },
        { text: "Formación personalizada", tooltip: "Sesiones de formación adaptadas a tu equipo" },
        { text: "Integraciones a medida", tooltip: "Desarrollo de integraciones específicas para tu negocio" },
        { text: "Cumplimiento normativo avanzado", tooltip: "Herramientas adicionales para cumplimiento regulatorio" },
        { text: "Copias de seguridad dedicadas", tooltip: "Sistema de respaldo exclusivo para tus datos" }
      ],
      cta: "Contactar ventas",
      popular: false,
      color: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
      darkColor: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
      paypalPlanId: "undefinded",
    }
  ];
  
  // Características para la tabla comparativa
  const features = [
    { 
      name: "Clientes", 
      basic: "Hasta 10", 
      pro: "Ilimitados", 
      enterprise: "Ilimitados",
      tooltip: "Número máximo de clientes que puedes gestionar en la plataforma"
    },
    { 
      name: "Usuarios", 
      basic: "1", 
      pro: "Hasta 5", 
      enterprise: "Ilimitados",
      tooltip: "Número de cuentas de usuario con acceso al sistema"
    },
    { 
      name: "Gestión de pólizas", 
      basic: true, 
      pro: true, 
      enterprise: true,
      tooltip: "Registro y seguimiento de pólizas de seguros"
    },
    { 
      name: "Recordatorios automáticos", 
      basic: true, 
      pro: true, 
      enterprise: true,
      tooltip: "Notificaciones para vencimientos y renovaciones"
    },
    { 
      name: "Automatización de renovaciones", 
      basic: false, 
      pro: true, 
      enterprise: true,
      tooltip: "Flujos de trabajo automatizados para el proceso de renovación"
    },
    { 
      name: "Análisis de rentabilidad", 
      basic: false, 
      pro: true, 
      enterprise: true,
      tooltip: "Informes y métricas de rendimiento financiero"
    },
    { 
      name: "Integración con CRM", 
      basic: false, 
      pro: true, 
      enterprise: true,
      tooltip: "Conexión con sistemas de gestión de relaciones con clientes"
    },
    { 
      name: "Personalización de documentos", 
      basic: false, 
      pro: true, 
      enterprise: true,
      tooltip: "Plantillas personalizables para comunicaciones y documentos"
    },
    { 
      name: "API personalizada", 
      basic: false, 
      pro: false, 
      enterprise: true,
      tooltip: "Acceso a API para desarrollar integraciones propias"
    },
    { 
      name: "Gestor de cuenta dedicado", 
      basic: false, 
      pro: false, 
      enterprise: true,
      tooltip: "Un representante exclusivo para atender tus necesidades"
    },
    { 
      name: "Formación personalizada", 
      basic: false, 
      pro: false, 
      enterprise: true,
      tooltip: "Sesiones de formación adaptadas a tu equipo y procesos"
    },
    { 
      name: "Integraciones a medida", 
      basic: false, 
      pro: false, 
      enterprise: true,
      tooltip: "Desarrollo de integraciones específicas para tu negocio"
    },
  ];
  
  // Preguntas frecuentes
  const faqs = [
    {
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer: "Sí, puedes cancelar tu suscripción en cualquier momento sin penalización. Si cancelas, mantendrás el acceso hasta el final del período facturado."
    },
    {
      question: "¿Cómo funciona el período de prueba?",
      answer: "Ofrecemos un período de prueba gratuito de 7 días para el plan Profesional. No necesitas introducir datos de pago para comenzar. Te enviaremos un recordatorio antes de que finalice tu prueba."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todas las principales tarjetas de crédito (Visa, Mastercard, American Express), PayPal y transferencia bancaria para planes anuales."
    },
    {
      question: "¿Ofrecen soporte técnico?",
      answer: "Sí, todos los planes incluyen soporte técnico. El plan Básico incluye soporte por email con respuesta en 24h. Los planes Profesional y Enterprise incluyen soporte prioritario 24/7 por email, chat y teléfono."
    },
    {
      question: "¿Cómo puedo cambiar de plan?",
      answer: "Puedes actualizar tu plan en cualquier momento desde el panel de control. La diferencia se prorrateará automáticamente. Para bajar de plan, el cambio se aplicará al final del período de facturación actual."
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "Absolutamente. Utilizamos encriptación de nivel bancario, cumplimos con GDPR y LOPD, y realizamos copias de seguridad diarias. Nunca compartimos tus datos con terceros sin tu consentimiento explícito."
    },
    {
      question: "¿Necesito instalar algún software?",
      answer: "No, Assuriva es una solución 100% en la nube. Solo necesitas un navegador web moderno y conexión a internet para acceder desde cualquier dispositivo."
    },
    {
      question: "¿Puedo importar mis datos actuales?",
      answer: "Sí, ofrecemos herramientas de importación para datos desde Excel, CSV y otros sistemas de gestión comunes. Para migraciones más complejas, nuestro equipo de soporte te asistirá en el proceso."
    }
  ];

  // Generar URL de WhatsApp con mensaje personalizado según el plan
  const getWhatsAppUrl = (planName?: string) => {
    const baseUrl = "https://wa.me/59892388748";
    const defaultMessage = "Hola, me interesa obtener más información sobre los planes de Assuriva.";
    
    if (!planName) {
      return `${baseUrl}?text=${encodeURIComponent(defaultMessage)}`;
    }
    
    const customMessage = `Hola, estoy interesado en el plan ${planName} de Assuriva. ¿Podrían darme más información?`;
    return `${baseUrl}?text=${encodeURIComponent(customMessage)}`;
  };

  return (
    <>
      <Head>
        <title>Planes y Precios | Assuriva - Software para Corredores de Seguros</title>
        <meta name="description" content="Descubre nuestros planes flexibles diseñados específicamente para corredores de seguros. Desde freelancers hasta grandes corredurías, tenemos la solución perfecta para ti." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Planes y Precios | Assuriva" />
        <meta property="og:description" content="Software profesional para corredores de seguros con planes adaptados a cada etapa de tu negocio." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://assuriva.com/pricing" />
      </Head>
      
      <Header />
      
      <Box
        sx={{
          position: 'relative',
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, #0F172A 0%, #1E293B 100%)'
            : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #EFF6FF 100%)',
          color: isDark ? '#F8FAFC' : '#0F172A',
          minHeight: '100vh',
          pt: { xs: 12, sm: 14, md: 16 },
          pb: 10,
          transition: 'all 0.4s ease',
          overflow: 'hidden',
        }}
      >
        <ParticlesBackground />
        
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  background: isDark
                    ? 'linear-gradient(90deg, #93C5FD 0%, #60A5FA 100%)'
                    : 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                <AnimatedText text="Planes para cada etapa de tu crecimiento" />
              </Typography>
              
              <Typography
                variant="h2"
                component="p"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 400,
                  maxWidth: '800px',
                  mb: 2,
                  color: isDark ? '#CBD5E1' : '#334155'
                }}
              >
                Escoge el plan perfecto para tu correduría de seguros y empieza a optimizar tu negocio hoy mismo
              </Typography>
              
              {/* Contador de oferta limitada */}
              <CountdownTimer />
              
              {/* Detección de país */}
              <CountryDetection />
              
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                      boxShadow: isDark
                        ? '0 4px 20px rgba(59, 130, 246, 0.5)'
                        : '0 4px 20px rgba(59, 130, 246, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1D4ED8 0%, #2563EB 100%)',
                      },
                      transition: 'all 0.4s ease'
                    }}
                    onClick={() => {
                      if (calculatorRef.current) {
                        calculatorRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Calcular mi ahorro <CalculateIcon sx={{ ml: 1 }} />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outlined"
                    href='/contact'
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      borderWidth: '2px',
                      borderColor: isDark ? '#3B82F6' : '#2563EB',
                      color: isDark ? '#3B82F6' : '#2563EB',
                      '&:hover': {
                        borderWidth: '2px',
                        borderColor: isDark ? '#60A5FA' : '#3B82F6',
                        background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                      },
                      transition: 'all 0.4s ease'
                    }}
                  >
                    Solicitar demo <ArrowForwardIcon sx={{ ml: 1 }} />
                  </Button>
                </motion.div>
              </Stack>
              
              <Stack
                direction="row"
                spacing={{ xs: 2, md: 4 }}
                alignItems="center"
                justifyContent="center"
                sx={{
                  py: 2,
                  px: { xs: 2, md: 3 },
                  borderRadius: '16px',
                  background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckIcon sx={{ color: '#10B981', mr: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Confiado por +500 corredores
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', color: '#F59E0B' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} fontSize="small" />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, ml: 1 }}>
                    Valoración 4.9/5
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ color: '#10B981', mr: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Seguridad certificada
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </motion.div>
          
          {/* Testimonio destacado */}
          <TestimonialCard />
          
          {/* Pricing Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isAnnual}
                    onChange={() => setIsAnnual(!isAnnual)}
                    color="primary"
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: !isAnnual ? 600 : 400,
                        color: !isAnnual ? (isDark ? '#60A5FA' : '#2563EB') : 'inherit',
                        transition: 'all 0.4s ease',
                      }}
                    >
                      Mensual
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isAnnual ? 600 : 400,
                        color: isAnnual ? (isDark ? '#60A5FA' : '#2563EB') : 'inherit',
                        transition: 'all 0.4s ease',
                      }}
                    >
                      Anual
                    </Typography>
                    {isAnnual && (
                      <Box
                        component={motion.div}
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: 'loop',
                        }}
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: '4px',
                          bgcolor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                          color: '#22C55E',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        Ahorra 20%
                      </Box>
                    )}
                  </Stack>
                }
                labelPlacement="end"
              />
            </motion.div>
          </Box>
          
          {/* Pricing Cards */}
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={4}
            alignItems="stretch"
            sx={{ mb: 10 }}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Card
                  component={motion.div}
                  whileHover={{
                    y: -10,
                    boxShadow: isDark
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                      : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '24px',
                    overflow: 'visible',
                    position: 'relative',
                    background: isDark ? plan.darkColor : plan.color,
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                    boxShadow: isDark
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                      : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.4s ease',
                  }}
                >
                  {plan.badge && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -15,
                        right: 20,
                        px: 2,
                        py: 1,
                        borderRadius: '50px',
                        bgcolor: isDark ? '#2563EB' : '#3B82F6',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)',
                        zIndex: 1,
                      }}
                      component={motion.div}
                      animate={{
                        y: [0, -5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                      }}
                    >
                      {plan.badge}
                    </Box>
                  )}
                  
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                        {plan.name}
                      </Typography>
                      
                      {plan.trialDays && (
                        <Chip
                          size="small"
                          label={`${plan.trialDays} días gratis`}
                          color="success"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '40px' }}>
                      {plan.description}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      {plan.id !== "enterprise" ? (
                        <>
                          <Typography
                            variant="h3"
                            component="p"
                            sx={{
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'baseline',
                            }}
                          >
                            {isAnnual ? plan.annualPrice : plan.monthlyPrice}€
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 400,
                                color: 'text.secondary',
                                ml: 0.5,
                              }}
                            >
                              {plan.period}
                            </Typography>
                          </Typography>
                          
                          {isAnnual && plan.id === 'pro' && (
                            <Typography variant="body2" color="success.main" sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}>
                              <LocalOfferIcon fontSize="small" sx={{ mr: 0.5 }} />
                              Ahorro de {Math.round((1 - (Number(plan.annualPrice) / Number(plan.monthlyPrice))) * 100)}% con facturación anual
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography
                          variant="h3"
                          component="p"
                          sx={{ fontWeight: 800 }}
                        >
                          {plan.price}
                        </Typography>
                      )}
                    </Box>
                    
                    <Stack spacing={2} sx={{ mb: 4, flexGrow: 1 }}>
                      {plan.features.map((feature, i) => (
                        <Tooltip
                          key={i}
                          title={feature.tooltip || ""}
                          placement="top"
                          arrow
                        >
                          <Box
                            component={motion.div}
                            whileHover={{ x: 5 }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: feature.tooltip ? 'help' : 'default',
                            }}
                          >
                            <CheckIcon
                              sx={{
                                color: isDark ? '#60A5FA' : '#2563EB',
                                mr: 1.5,
                              }}
                            />
                            <Typography variant="body2">
                              {feature.text}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ))}
                    </Stack>
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant={plan.popular ? "contained" : "outlined"}
                        fullWidth
                        size="large"
                        onClick={() => selectPlan(plan.id)}
                        sx={{
                          borderRadius: '50px',
                          py: 1.5,
                          fontWeight: 600,
                          transition: 'all 0.4s ease',
                          ...(plan.popular && {
                            background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)',
                          })
                        }}
                      >
                        {plan.cta}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
          
          {/* ROI Calculator */}
          <Box
            ref={calculatorRef}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{
              mb: 10,
              p: { xs: 3, md: 5 },
              borderRadius: '24px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(30, 64, 175, 0.7) 100%)'
                : 'linear-gradient(135deg, rgba(219, 234, 254, 0.7) 0%, rgba(191, 219, 254, 0.7) 100%)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
              boxShadow: isDark
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.4" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '30px 30px',
                zIndex: 0,
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  mb: 3,
                  textAlign: 'center',
                  fontWeight: 700,
                  background: isDark
                    ? 'linear-gradient(90deg, #93C5FD 0%, #60A5FA 100%)'
                    : 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Calculadora de Ahorro y ROI
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  maxWidth: '800px',
                  mx: 'auto',
                  color: isDark ? '#CBD5E1' : '#334155',
                }}
              >
                Descubre cuánto tiempo y dinero puedes ahorrar con Assuriva. Personaliza los valores según tu correduría.
              </Typography>
              
              <Tabs
                value={calculatorMode}
                onChange={(_, newValue) => setCalculatorMode(newValue)}
                centered
                sx={{
                  mb: 4,
                  '& .MuiTabs-indicator': {
                    backgroundColor: isDark ? '#60A5FA' : '#3B82F6',
                  },
                  '& .MuiTab-root': {
                    color: isDark ? '#CBD5E1' : '#334155',
                    '&.Mui-selected': {
                      color: isDark ? '#60A5FA' : '#3B82F6',
                    },
                  },
                }}
              >
                <Tab label="Modo Básico" />
                <Tab label="Modo Avanzado" />
              </Tabs>
              
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={4}
                sx={{ mb: 4 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Datos de tu correduría
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          Número de clientes
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {numClients}
                        </Typography>
                      </Stack>
                      
                      <Slider
                        value={numClients}
                        onChange={(_, value) => setNumClients(value as number)}
                        min={10}
                        max={500}
                        step={10}
                        sx={{
                          color: isDark ? '#60A5FA' : '#3B82F6',
                          '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                              boxShadow: `0px 0px 0px 8px ${isDark ? 'rgba(96, 165, 250, 0.16)' : 'rgba(59, 130, 246, 0.16)'}`,
                            },
                          },
                        }}
                      />
                    </Box>
                    
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          Prima media anual ($)
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {avgPremium}$
                        </Typography>
                      </Stack>
                      
                      <Slider
                        value={avgPremium}
                        onChange={(_, value) => setAvgPremium(value as number)}
                        min={100}
                        max={2000}
                        step={50}
                        sx={{
                          color: isDark ? '#60A5FA' : '#3B82F6',
                        }}
                      />
                    </Box>
                    
                    {calculatorMode === 1 && (
                      <>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Typography variant="body2">
                                Horas por cliente al año
                              </Typography>
                              <Tooltip title="Incluye gestión de pólizas, renovaciones, incidencias y atención al cliente">
                                <InfoOutlinedIcon sx={{ fontSize: '1rem', color: 'text.secondary', cursor: 'help' }} />
                              </Tooltip>
                            </Stack>
                            <Typography variant="body2" fontWeight="600">
                              {hoursPerClient}h
                            </Typography>
                          </Stack>
                          
                          <Slider
                            value={hoursPerClient}
                            onChange={(_, value) => setHoursPerClient(value as number)}
                            min={1}
                            max={10}
                            step={0.5}
                            sx={{
                              color: isDark ? '#60A5FA' : '#3B82F6',
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              Coste por hora ($)
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {hourlyRate}$
                            </Typography>
                          </Stack>
                          
                          <Slider
                            value={hourlyRate}
                            onChange={(_, value) => setHourlyRate(value as number)}
                            min={10}
                            max={50}
                            step={1}
                            sx={{
                              color: isDark ? '#60A5FA' : '#3B82F6',
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </Stack>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Resultados estimados
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Card sx={{
                      p: 2,
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.7) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 250, 252, 0.7) 100%)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      borderRadius: '12px',
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Ahorro de tiempo anual
                      </Typography>
                      <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
                        {roiData.timeSaved} horas
                      </Typography>
                    </Card>
                    
                    <Card sx={{
                      p: 2,
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.7) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 250, 252, 0.7) 100%)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      borderRadius: '12px',
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Ahorro económico anual
                      </Typography>
                      <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
                        {roiData.moneySaved.toLocaleString()}$
                      </Typography>
                    </Card>
                    
                    <Card sx={{
                      p: 2,
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.7) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 250, 252, 0.7) 100%)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      borderRadius: '12px',
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Potencial aumento de ingresos
                      </Typography>
                      <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
                        {roiData.potentialIncrease.toLocaleString()}€
                      </Typography>
                    </Card>
                    
                    <Card sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                      border: `1px solid ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                      borderRadius: '12px',
                    }}>
                      <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#93C5FD' : '#1E40AF' }}>
                        ROI estimado
                      </Typography>
                      <Typography variant="h4" component="p" sx={{
                        fontWeight: 800,
                        color: isDark ? '#60A5FA' : '#2563EB',
                      }}>
                        {roiData.roi}%
                      </Typography>
                    </Card>
                  </Stack>
                </Box>
              </Stack>
              
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={getWhatsAppUrl('Profesional')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<WhatsAppIcon />}
                      sx={{
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
                          boxShadow: '0 15px 20px -3px rgba(16, 185, 129, 0.4)',
                        },
                        transition: 'all 0.4s ease',
                      }}
                    >
                      Consulta personalizada
                    </Button>
                  </a>
                </motion.div>
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Recibe un análisis detallado para tu correduría
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Comparison Table */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            sx={{ mb: 10 }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontWeight: 700,
              }}
            >
              Comparativa de planes
            </Typography>
            
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: '24px',
                background: isDark
                  ? 'rgba(15, 23, 42, 0.6)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                boxShadow: isDark
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      Características
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      Básico
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        background: isDark
                          ? 'rgba(30, 58, 138, 0.3)'
                          : 'rgba(219, 234, 254, 0.5)',
                      }}
                    >
                      Profesional
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      Enterprise
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {features.map((feature, index) => (
                    <TableRow
                      key={feature.name}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      sx={{
                        '&:nth-of-type(odd)': {
                          background: isDark
                            ? 'rgba(30, 41, 59, 0.3)'
                            : 'rgba(248, 250, 252, 0.5)',
                        },
                        '&:hover': {
                          background: isDark
                            ? 'rgba(30, 41, 59, 0.5)'
                            : 'rgba(219, 234, 254, 0.3)',
                        },
                        transition: 'background 0.3s ease',
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                        }}
                      >
                        <Tooltip title={feature.tooltip || ""} placement="top" arrow>
                          <Box sx={{ display: 'flex', alignItems: 'center', cursor: feature.tooltip ? 'help' : 'default' }}>
                            {feature.name}
                            {feature.tooltip && (
                              <InfoOutlinedIcon sx={{ fontSize: '1rem', ml: 0.5, color: 'text.secondary' }} />
                            )}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell
                        align="center"
                        sx={{
                          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                        }}
                      >
                        {typeof feature.basic === 'boolean' ? (
                          feature.basic ? (
                            <CheckIcon sx={{ color: '#10B981' }} />
                          ) : (
                            <CloseIcon sx={{ color: '#EF4444' }} />
                          )
                        ) : (
                          feature.basic
                        )}
                      </TableCell>
                      
                      <TableCell
                        align="center"
                        sx={{
                          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                          background: isDark
                            ? 'rgba(30, 58, 138, 0.3)'
                            : 'rgba(219, 234, 254, 0.5)',
                        }}
                      >
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <CheckIcon sx={{ color: '#10B981' }} />
                          ) : (
                            <CloseIcon sx={{ color: '#EF4444' }} />
                          )
                        ) : (
                          feature.pro
                        )}
                      </TableCell>
                      
                      <TableCell
                        align="center"
                        sx={{
                          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                        }}
                      >
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? (
                            <CheckIcon sx={{ color: '#10B981' }} />
                          ) : (
                            <CloseIcon sx={{ color: '#EF4444' }} />
                          )
                        ) : (
                          feature.enterprise
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
          {/* FAQ Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{ mb: 10 }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontWeight: 700,
              }}
            >
              Preguntas frecuentes
            </Typography>
            
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={activeAccordion === index}
                  onChange={() => setActiveAccordion(activeAccordion === index ? null : index)}
                  component={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  sx={{
                    mb: 2,
                    background: isDark
                      ? 'rgba(15, 23, 42, 0.6)'
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                    borderRadius: '12px',
                    boxShadow: 'none',
                    '&:before': {
                      display: 'none',
                    },
                    '&.Mui-expanded': {
                      boxShadow: isDark
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    },
                    transition: 'all 0.4s ease',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: isDark ? '#60A5FA' : '#3B82F6' }} />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        margin: '12px 0',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ color: isDark ? '#CBD5E1' : '#334155' }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
          
          {/* Final CTA */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            sx={{
              mb: 10,
              p: { xs: 3, md: 6 },
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.2,
                background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23FFFFFF" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
                zIndex: 0,
              }}
            />
            
            <motion.div
              animate={{
                background: [
                  'linear-gradient(45deg, rgba(59, 130, 246, 0) 0%, rgba(37, 99, 235, 0.3) 50%, rgba(59, 130, 246, 0) 100%)',
                  'linear-gradient(45deg, rgba(59, 130, 246, 0) 100%, rgba(37, 99, 235, 0.3) 50%, rgba(59, 130, 246, 0) 0%)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                <AnimatedText text="¡Da el salto hacia el futuro de tu correduría!" />
              </Typography>
              
              <Typography
                variant="h6"
                component="p"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                Únete a cientos de corredores que ya han transformado su negocio con Assuriva
              </Typography>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: '50px',
                    px: 5,
                    py: 2,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    background: 'white',
                    color: '#2563EB',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      background: 'white',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    },
                    transition: 'all 0.4s ease',
                  }}
                  onClick={() => selectPlan('pro')}
                >
                  Comenzar ahora
                </Button>
              </motion.div>
              
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mt: 2,
                }}
              >
                7 días de prueba gratis. Sin compromiso.
              </Typography>
            </Box>
          </Box>
          
          {/* Trust Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            sx={{ mb: 10 }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontWeight: 600,
                color: isDark ? '#CBD5E1' : '#334155',
              }}
            >
              Confían en nosotros
            </Typography>
            
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Box
                component={motion.div}
                whileHover={{ y: -5 }}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.6)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  textAlign: 'center',
                  width: { xs: '100%', md: '200px' },
                  transition: 'all 0.4s ease',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, color: isDark ? '#60A5FA' : '#3B82F6' }}>
                  99%
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#CBD5E1' : '#334155' }}>
                  Satisfacción de clientes
                </Typography>
              </Box>
              
              <Box
                component={motion.div}
                whileHover={{ y: -5 }}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.6)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  textAlign: 'center',
                  width: { xs: '100%', md: '200px' },
                  transition: 'all 0.4s ease',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, color: isDark ? '#60A5FA' : '#3B82F6' }}>
                  +500
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#CBD5E1' : '#334155' }}>
                  Corredores activos
                </Typography>
              </Box>
              
              <Box
                component={motion.div}
                whileHover={{ y: -5 }}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.6)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  textAlign: 'center',
                  width: { xs: '100%', md: '200px' },
                  transition: 'all 0.4s ease',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, color: isDark ? '#60A5FA' : '#3B82F6' }}>
                  4.9/5
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#CBD5E1' : '#334155' }}>
                  Valoración media
                </Typography>
              </Box>
              
              <Box
                component={motion.div}
                whileHover={{ y: -5 }}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.6)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  textAlign: 'center',
                  width: { xs: '100%', md: '200px' },
                  transition: 'all 0.4s ease',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, color: isDark ? '#60A5FA' : '#3B82F6' }}>
                  24/7
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#CBD5E1' : '#334155' }}>
                  Soporte técnico
                </Typography>
              </Box>
            </Stack>
            
            {/* Certificaciones de seguridad */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                mt: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Certificaciones de seguridad:
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={3} 
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon fontSize="small" sx={{ color: isDark ? '#60A5FA' : '#3B82F6' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    GDPR
                  </Typography>
                </Box>
                
                <Divider orientation="vertical" flexItem />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon fontSize="small" sx={{ color: isDark ? '#60A5FA' : '#3B82F6' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ISO 27001
                  </Typography>
                </Box>
                
                <Divider orientation="vertical" flexItem />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedIcon fontSize="small" sx={{ color: isDark ? '#60A5FA' : '#3B82F6' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    LOPD
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Footer />
      
      {/* Modal para plan Enterprise */}
      <EnterpriseContactModal 
        open={enterpriseModalOpen} 
        onClose={() => setEnterpriseModalOpen(false)} 
      />
    </>
  );
}
