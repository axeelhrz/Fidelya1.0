'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import { pricingColors } from '@/styles/theme/pricing-colors';
import { useRouter } from 'next/navigation';

// Tipos
interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'outlined' | 'contained';
  highlight: boolean;
  stripeProductId: string;
  trialDays?: number;
}

interface PriceCardProps {
  plan: Plan;
  index: number;
  onSubscribe: (plan: Plan) => Promise<void>;
  isLoading: boolean;
  loadingPlanId: string | null;
  isSelected?: boolean;
}

// Animaciones
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Datos de planes
const plans: Plan[] = [
  {
    id: 'pro',
    name: 'Profesional',
    price: '29',
    period: 'mes',
    description: 'Para corredores en crecimiento',
    features: [
      'Pólizas ilimitadas',
      'Dashboard avanzado',
      'Automatizaciones personalizadas',
      'Soporte 24/5',
      'Análisis detallado',
      'Chat con corredores',
    ],
    buttonText: 'Comenzar Prueba 7 días',
    buttonVariant: 'contained',
    highlight: true,
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    trialDays: 7
  },
  {
    id: 'enterprise',
    name: 'Empresa',
    price: '79',
    period: 'mes',
    description: 'Para agencias y equipos',
    features: [
      'Todo lo de Profesional',
      'Multi-usuario',
      'API personalizada',
      'Soporte 24/7 prioritario',
      'Reportes personalizados',
      'Capacitación dedicada',
      'Gestor de cuenta personal',
      'Backup avanzado',
    ],
    buttonText: 'Comenzar Prueba 7 días',
    buttonVariant: 'outlined',
    highlight: false,
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    trialDays: 7
  },
];

// Componente de tarjeta de precio
function PriceCard({ plan, index, onSubscribe, isLoading, loadingPlanId, isSelected }: PriceCardProps) {
  const theme = useTheme();
  const isCurrentPlanLoading = isLoading && loadingPlanId === plan.id;

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={{
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <Card
        component={motion.div}
        whileHover={{ y: -8 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          p: 3.5,
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '380px',
          width: '100%',
          mx: 'auto',
          background: plan.highlight
            ? `linear-gradient(145deg, ${pricingColors.background.paper}, ${pricingColors.background.default})`
            : pricingColors.background.paper,
          border: '1px solid',
          borderColor: isSelected
            ? theme.palette.primary.main
            : plan.highlight
            ? pricingColors.primary.main
            : pricingColors.border.light,
          borderRadius: 3,
          boxShadow: isSelected
            ? `0 0 0 2px ${theme.palette.primary.main}`
            : plan.highlight
            ? `0 12px 32px ${pricingColors.primary.main}20`
            : '0 6px 20px rgba(0,0,0,0.05)',
        }}
      >
        {plan.highlight && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              backgroundColor: `${pricingColors.primary.main}10`,
              color: pricingColors.primary.main,
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <StarIcon sx={{ fontSize: 16 }} />
            Más popular
          </Box>
        )}

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: plan.highlight
                ? pricingColors.primary.main
                : pricingColors.text.primary,
              mb: 1,
              fontSize: '1.25rem',
            }}
          >
            {plan.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: pricingColors.text.secondary,
              mb: 2.5,
              minHeight: 42,
              fontSize: '0.875rem',
            }}
          >
            {plan.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: plan.highlight
                  ? pricingColors.primary.main
                  : pricingColors.text.primary,
                fontSize: '2.5rem',
              }}
            >
              {plan.price === '0' ? 'Gratis' : `$${plan.price}`}
            </Typography>
            {plan.price !== '0' && (
              <Typography
                variant="subtitle1"
                sx={{
                  ml: 1,
                  mb: 0.5,
                  color: pricingColors.text.light,
                  fontSize: '1rem',
                }}
              >
                /{plan.period}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              mb: 3,
              p: 1,
              borderRadius: 2,
              backgroundColor: alpha(pricingColors.accent.main, 0.1),
              color: pricingColors.accent.dark,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" fontWeight={600} fontSize="0.875rem">
              {plan.trialDays} días de prueba gratis
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            {plan.features.map((feature, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: 18,
                    color: plan.highlight
                      ? pricingColors.primary.main
                      : pricingColors.success.main,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: pricingColors.text.primary,
                    fontSize: '0.875rem',
                  }}
                >
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Button
          variant={plan.buttonVariant}
          fullWidth
          onClick={() => onSubscribe(plan)}
          disabled={isLoading}
          sx={{
            py: 1.25,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: 2,
            ...(plan.highlight && {
              background: pricingColors.primary.gradient,
              boxShadow: `0 4px 14px ${pricingColors.primary.main}40`,
              '&:hover': {
                background: pricingColors.primary.gradient,
                boxShadow: `0 6px 20px ${pricingColors.primary.main}60`,
              },
            }),
          }}
        >
          {isCurrentPlanLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            plan.buttonText
          )}
        </Button>
      </Card>
    </motion.div>
  );
}

// Componente principal
export default function PricingSection() {
  const theme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'success' | 'error' | 'info';
  } | null>(null);

  useEffect(() => {
    checkSavedPlan();
  }, []);

  const checkSavedPlan = () => {
    try {
      const savedPlan = localStorage.getItem('selectedPlan');
      if (savedPlan) {
        const planData = JSON.parse(savedPlan);
        const selectedAt = new Date(planData.selectedAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - selectedAt.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
          localStorage.removeItem('selectedPlan');
        }
      }
    } catch (error) {
      console.error('Error al procesar plan guardado:', error);
      localStorage.removeItem('selectedPlan');
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    try {
      setIsLoading(true);
      setLoadingPlanId(plan.id);

      const planData = {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        period: plan.period,
        stripeProductId: plan.stripeProductId,
        trialDays: plan.trialDays,
        features: plan.features,
        selectedAt: new Date().toISOString()
      };

      localStorage.setItem('selectedPlan', JSON.stringify(planData));

      const searchParams = new URLSearchParams({
        plan: plan.id,
        priceId: plan.stripeProductId,
        trial: plan.trialDays?.toString() || '7'
      });

      router.push(`/auth/sign-up?${searchParams.toString()}`);

    } catch (error) {
      console.error('Error al iniciar suscripción:', error);
      setNotification({
        message: 'Error al procesar la solicitud. Por favor, intenta de nuevo.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
      setLoadingPlanId(null);
    }
  };

  const isPlanSelected = (planId: string) => {
    try {
      const savedPlan = localStorage.getItem('selectedPlan');
      if (!savedPlan) return false;
      const planData = JSON.parse(savedPlan);
      return planData.id === planId;
    } catch {
      return false;
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: pricingColors.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 0% 0%, ${pricingColors.primary.main}08 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, ${pricingColors.secondary.main}08 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <motion.div {...fadeInUp}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: pricingColors.primary.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.25rem', md: '2.75rem' },
            }}
          >
            Planes diseñados para tu crecimiento
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: pricingColors.text.secondary,
              mb: 6,
              maxWidth: '700px',
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            Selecciona tu plan y comienza tu prueba gratuita de 7 días.
            Sin compromisos - cancela en cualquier momento.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 3, md: 4 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            mb: 8,
          }}
        >
          {plans.map((plan, index) => (
            <Box
              key={plan.id}
              sx={{
                width: '100%',
                maxWidth: '380px',
                ...(plan.highlight && {
                  transform: { md: 'translateY(-16px)' },
                }),
              }}
            >
              <PriceCard
                plan={plan}
                index={index}
                onSubscribe={handleSubscribe}
                isLoading={isLoading}
                loadingPlanId={loadingPlanId}
                isSelected={isPlanSelected(plan.id)}
              />
            </Box>
          ))}
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              mt: 8,
              p: { xs: 3, md: 4 },
              textAlign: 'center',
              borderRadius: 3,
              background: `${pricingColors.primary.main}08`,
              border: `1px solid ${pricingColors.primary.main}20`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            <ShieldIcon sx={{ fontSize: { xs: 32, md: 40 }, color: pricingColors.primary.main }} />
            <Typography
              variant="h6"
              sx={{
                color: pricingColors.text.primary,
                fontWeight: 700,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Garantía de satisfacción de 7 días
            </Typography>
            <Typography
              sx={{
                color: pricingColors.text.secondary,
                maxWidth: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Prueba cualquier plan sin riesgo. Si no estás completamente satisfecho,
              te devolvemos tu dinero sin hacer preguntas durante los primeros 7 días.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box
            sx={{
              mt: 10,
              textAlign: 'center',
              maxWidth: '900px',
              mx: 'auto',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: pricingColors.text.primary,
                fontSize: { xs: '1.5rem', md: '1.75rem' },
              }}
            >
              Preguntas Frecuentes
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: { xs: 3, md: 4 },
              }}
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: pricingColors.text.primary,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                  }}
                >
                  ¿Necesito tarjeta de crédito para comenzar?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: pricingColors.text.secondary,
                    fontSize: { xs: '0.875rem', md: '0.9rem' },
                  }}
                >
                  No, puedes comenzar tu prueba gratuita sin proporcionar datos de pago.
                  Solo necesitarás añadir tu método de pago cuando decidas continuar después
                  del período de prueba.
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: pricingColors.text.primary,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                  }}
                >
                  ¿Puedo cambiar de plan en cualquier momento?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: pricingColors.text.secondary,
                    fontSize: { xs: '0.875rem', md: '0.9rem' },
                  }}
                >
                  Sí, puedes actualizar o cambiar tu plan en cualquier momento desde
                  tu panel de control. Los cambios se aplicarán inmediatamente y se
                  ajustará el cobro de manera proporcional.
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Snackbar
          open={Boolean(notification)}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setNotification(null)}
            severity={notification?.severity}
            sx={{
              width: '100%',
              borderRadius: 2,
              bgcolor: notification?.severity === 'success'
                ? alpha(theme.palette.success.main, 0.9)
                : alpha(theme.palette.error.main, 0.9),
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white',
              },
            }}
          >
            {notification?.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}