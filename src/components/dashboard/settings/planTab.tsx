'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Stack, 
  Button, 
  useTheme, 
  alpha,
  Divider,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ArrowCircleUp, 
  ClockCounterClockwise, 
  X, 
  Warning, 
  Calendar, 
  Users, 
  ChartBar, 
  Robot,
  Check,
  Star
} from 'phosphor-react';
import { useProfile } from '@/hooks/use-profile';
import { useSubscription } from '@/hooks/use-subscription';
import { useRouter } from 'next/navigation';
import { Plan, PLAN_FEATURES } from '@/lib/subscription';

// Definición de planes para mostrar en la interfaz
const plans = [
  {
    id: 'basic',
    name: "Básico",
    price: "0",
    period: "/mes",
    description: "Para corredores independientes que están comenzando",
    features: [
      { text: `Hasta ${PLAN_FEATURES.basic.maxPolicies} pólizas`, tooltip: "Límite de pólizas activas en el sistema" },
      { text: `Hasta ${PLAN_FEATURES.basic.maxClients} clientes`, tooltip: "Límite de clientes activos en el sistema" },
      { text: "Gestión básica de pólizas", tooltip: "Registro y seguimiento de pólizas con campos esenciales" },
      { text: "Recordatorios de renovación", tooltip: "Notificaciones automáticas para renovaciones próximas" },
      { text: "Soporte por email", tooltip: "Tiempo de respuesta en 24 horas hábiles" }
    ],
    cta: "Activar plan básico",
    popular: false,
    color: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
    darkColor: "linear-gradient(135deg, #0C4A6E 0%, #075985 100%)",
  },
  {
    id: "professional",
    name: "Profesional",
    price: "29",
    period: "/mes",
    description: "Para corredurías en crecimiento que necesitan más herramientas",
    features: [
      { text: `Hasta ${PLAN_FEATURES.professional.maxPolicies} pólizas`, tooltip: "Límite de pólizas activas en el sistema" },
      { text: `Hasta ${PLAN_FEATURES.professional.maxClients} clientes`, tooltip: "Límite de clientes activos en el sistema" },
      { text: "Gestión avanzada de pólizas", tooltip: "Campos personalizados, documentos adjuntos y seguimiento detallado" },
      { text: "Automatización de renovaciones", tooltip: "Flujos de trabajo automatizados para renovaciones" },
      { text: "Soporte prioritario", tooltip: "Asistencia por email y chat con prioridad" },
      { text: "Análisis de rentabilidad", tooltip: "Informes detallados de rendimiento por cliente y póliza" },
      { text: "Exportación de datos", tooltip: "Exportación avanzada de datos en múltiples formatos" }
    ],
    cta: "Actualizar a Profesional",
    popular: true,
    color: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
    darkColor: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
    badge: "Más popular",
    trialDays: 7,
    paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID
  },
  {
    id: "enterprise",
    name: "Empresarial",
    price: "99",
    period: "/mes",
    description: "Para grandes corredurías con necesidades específicas",
    features: [
      { text: "Pólizas ilimitadas", tooltip: "Sin restricciones en el número de pólizas" },
      { text: "Clientes ilimitados", tooltip: "Sin restricciones en el número de clientes" },
      { text: "API personalizada", tooltip: "Acceso a API para integraciones a medida" },
      { text: "Gestor de cuenta dedicado", tooltip: "Un representante exclusivo para tu cuenta" },
      { text: "Formación personalizada", tooltip: "Sesiones de formación adaptadas a tu equipo" },
      { text: "Integraciones a medida", tooltip: "Desarrollo de integraciones específicas para tu negocio" },
      { text: "Cumplimiento normativo avanzado", tooltip: "Herramientas adicionales para cumplimiento regulatorio" }
    ],
    cta: "Actualizar a Empresarial",
    popular: false,
    color: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    darkColor: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
    paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_ENTERPRISE_PLAN_ID,
  }
];

export default function PlanTab() {
  const theme = useTheme();
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useProfile();
  const { 
    subscription, 
    loading: subscriptionLoading, 
    cancelSubscription,
    activateFreePlan
  } = useSubscription();
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [changePlanDialogOpen, setChangePlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Abrir diálogo de cancelación
  const handleCancelDialogOpen = () => {
    setCancelDialogOpen(true);
  };
  
  // Cerrar diálogo de cancelación
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
  };
  
  // Abrir diálogo de cambio de plan
  const handleChangePlanDialogOpen = () => {
    setChangePlanDialogOpen(true);
  };
  
  // Cerrar diálogo de cambio de plan
  const handleChangePlanDialogClose = () => {
    setChangePlanDialogOpen(false);
    setSelectedPlan(null);
  };
  
  // Seleccionar plan
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  // Cancelar suscripción
  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const success = await cancelSubscription();
      
      if (success) {
        handleCancelDialogClose();
        setSnackbarMessage('Suscripción cancelada correctamente');
        setSnackbarSeverity('success');
      } else {
        throw new Error('Error al cancelar la suscripción');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setSnackbarMessage('Error al cancelar la suscripción');
      setSnackbarSeverity('error');
    } finally {
      setCancelling(false);
      setSnackbarOpen(true);
    }
  };
  
  // Cambiar plan
  const handleChangePlan = async () => {
    if (!selectedPlan) return;
    
    setChangingPlan(true);
    
    try {
      if (selectedPlan === 'basic') {
        // Activar plan básico
        const success = await activateFreePlan();
        
        if (success) {
          handleChangePlanDialogClose();
          setSnackbarMessage('Plan básico activado correctamente');
          setSnackbarSeverity('success');
        } else {
          throw new Error('Error al activar el plan básico');
        }
      } else {
        // Para planes de pago, redirigir a la página de precios
        // Guardar el plan seleccionado en localStorage para recuperarlo después
        localStorage.setItem('selectedPlan', selectedPlan);
        handleChangePlanDialogClose();
        router.push('/pricing');
      }
    } catch (error) {
      console.error('Error changing plan:', error);
      setSnackbarMessage('Error al cambiar de plan');
      setSnackbarSeverity('error');
    } finally {
      setChangingPlan(false);
      setSnackbarOpen(true);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string | unknown) => {
    if (!dateString || typeof dateString !== 'string') {
      return 'Fecha no disponible';
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Obtener datos del plan actual
  const getCurrentPlanData = () => {
    if (!subscription) {
      return {
        name: 'Básico',
        price: 0,
        billingCycle: 'monthly',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        features: {
          clients: PLAN_FEATURES.basic.maxClients,
          policies: PLAN_FEATURES.basic.maxPolicies,
          analytics: PLAN_FEATURES.basic.analytics,
          ai: false
        },
        usage: {
          clients: {
            used: 0,
            total: PLAN_FEATURES.basic.maxClients
          },
          policies: {
            used: 0,
            total: PLAN_FEATURES.basic.maxPolicies
          }
        }
      };
    }
    
    // Mapear el planId a un plan de la lista
    const planId = subscription.planId as Plan || 'basic';
    
    return {
      name: subscription.plan || 'Básico',
      price: planId === 'professional' ? 29 : planId === 'enterprise' ? 99 : 0,
      billingCycle: 'monthly',
      status: subscription.status || 'active',
      startDate: subscription.currentPeriodStart 
        ? new Date(subscription.currentPeriodStart instanceof Date 
            ? subscription.currentPeriodStart 
            : subscription.currentPeriodStart.toDate()).toISOString() 
        : new Date().toISOString(),
      endDate: subscription.currentPeriodEnd 
        ? new Date(subscription.currentPeriodEnd instanceof Date 
            ? subscription.currentPeriodEnd 
            : subscription.currentPeriodEnd.toDate()).toISOString() 
        : new Date().toISOString(),
      features: {
        clients: PLAN_FEATURES[planId]?.maxClients || PLAN_FEATURES.basic.maxClients,
        policies: PLAN_FEATURES[planId]?.maxPolicies || PLAN_FEATURES.basic.maxPolicies,
        analytics: PLAN_FEATURES[planId]?.analytics || false,
        ai: planId === 'enterprise'
      },
      usage: {
        clients: {
          used: profile?.clientsCount || 0,
          total: PLAN_FEATURES[planId]?.maxClients || PLAN_FEATURES.basic.maxClients
        },
        policies: {
          used: profile?.policiesCount || 0,
          total: PLAN_FEATURES[planId]?.maxPolicies || PLAN_FEATURES.basic.maxPolicies
        }
      }
    };
  };
  
  const planData = getCurrentPlanData();
  
  // Calcular porcentaje de uso
  const calculateUsagePercentage = (used: number, total: number | string) => {
    if (typeof total === 'string') return 0;
    return Math.min(Math.round((used / total) * 100), 100);
  };
  
  // Obtener color según porcentaje
  const getColorByPercentage = (percentage: number) => {
    if (percentage < 60) return theme.palette.success.main;
    if (percentage < 80) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  if (profileLoading || subscriptionLoading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando información del plan...</Typography>
      </Box>
    );
  }
  
  return (
    <Stack spacing={4}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontFamily: 'Sora', 
          fontWeight: 600,
          mb: 2 
        }}
      >
        Plan y suscripción
      </Typography>
      
      <Card 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.6) 
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Stack spacing={4}>
          {/* Información del plan */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 1, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  borderRadius: '10px', 
                  color: theme.palette.primary.main 
                }}
              >
                <CreditCard weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Plan {planData.name}
                  </Typography>
                  <Chip 
                    label={planData.status === 'active' ? 'Activo' : 'Inactivo'} 
                    size="small"
                    color={planData.status === 'active' ? 'success' : 'error'}
                    sx={{ 
                      borderRadius: '6px',
                      height: 24
                    }}
                  />
                </Stack>
                
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {planData.price > 0 ? (
                    <>
                      ${planData.price}/{planData.billingCycle === 'monthly' ? 'mes' : 'año'} • Renovación: {formatDate(planData.endDate)}
                    </>
                  ) : (
                    'Plan gratuito'
                  )}
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowCircleUp weight="bold" />}
                    sx={{ 
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePlanDialogOpen}
                  >
                    Cambiar plan
                  </Button>
                  
                  {planData.price > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<X weight="bold" />}
                      onClick={handleCancelDialogOpen}
                      sx={{ 
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar suscripción
                    </Button>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Detalles del plan */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Detalles del plan
            </Typography>
            
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '8px', 
                    color: theme.palette.primary.main 
                  }}
                >
                  <Calendar weight="duotone" size={20} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Período de facturación
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {planData.billingCycle === 'monthly' ? 'Mensual' : 'Anual'}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '8px', 
                    color: theme.palette.primary.main 
                  }}
                >
                  <ClockCounterClockwise weight="duotone" size={20} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Próxima renovación
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(planData.endDate)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Características del plan */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Características incluidas
            </Typography>
            
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '8px', 
                    color: theme.palette.primary.main 
                  }}
                >
                  <Users weight="duotone" size={20} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Clientes
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {typeof planData.features.clients === 'string' ? 'Ilimitados' : planData.features.clients}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '8px', 
                    color: theme.palette.primary.main 
                  }}
                >
                  <CreditCard weight="duotone" size={20} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pólizas
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {typeof planData.features.policies === 'string' ? 'Ilimitadas' : planData.features.policies}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(
                      planData.features.analytics ? theme.palette.primary.main : theme.palette.action.disabled, 
                      0.1
                    ), 
                    borderRadius: '8px', 
                    color: planData.features.analytics ? theme.palette.primary.main : theme.palette.action.disabled
                  }}
                >
                  <ChartBar weight="duotone" size={20} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Análisis avanzado
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {planData.features.analytics ? 'Incluido' : 'No incluido'}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 1, 
                    bgcolor: alpha(
                      planData.features.ai ? theme.palette.primary.main : theme.palette.action.disabled, 
                      0.1
                    ), 
                    borderRadius: '8px', 
                    color: planData.features.ai ? theme.palette.primary.main : theme.palette.action.disabled
                  }}
                >
                  <Robot weight="duotone" size={20} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Asistente IA
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {planData.features.ai ? 'Incluido' : 'No incluido'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Uso actual */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Uso actual
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Clientes ({planData.usage.clients.used}/{typeof planData.usage.clients.total === 'string' ? '∞' : planData.usage.clients.total})
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {typeof planData.usage.clients.total === 'string' ? '0%' : `${calculateUsagePercentage(planData.usage.clients.used, planData.usage.clients.total)}%`}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateUsagePercentage(planData.usage.clients.used, planData.usage.clients.total)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getColorByPercentage(calculateUsagePercentage(planData.usage.clients.used, planData.usage.clients.total))
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pólizas ({planData.usage.policies.used}/{typeof planData.usage.policies.total === 'string' ? '∞' : planData.usage.policies.total})
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {typeof planData.usage.policies.total === 'string' ? '0%' : `${calculateUsagePercentage(planData.usage.policies.used, planData.usage.policies.total)}%`}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateUsagePercentage(planData.usage.policies.used, planData.usage.policies.total)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getColorByPercentage(calculateUsagePercentage(planData.usage.policies.used, planData.usage.policies.total))
                    }
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Card>
      
      {/* Diálogo para cancelar suscripción */}
      <Dialog 
        open={cancelDialogOpen} 
        onClose={handleCancelDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Sora', fontWeight: 600 }}>
          Cancelar suscripción
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 2, 
                  bgcolor: alpha(theme.palette.warning.main, 0.1), 
                  borderRadius: '50%', 
                  color: theme.palette.warning.main 
                }}
              >
                <Warning weight="duotone" size={48} />
              </Box>
            </Box>
            
            <Typography variant="body1" fontWeight={500}>
              ¿Estás seguro de que quieres cancelar tu suscripción?
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Al cancelar tu suscripción:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2, mt: -2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Seguirás teniendo acceso a tu plan actual hasta el final del período de facturación ({formatDate(planData.endDate)}).
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Después de esa fecha, tu cuenta pasará automáticamente al plan gratuito.
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Perderás acceso a las funciones premium y tendrás límites en clientes y pólizas.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCancelDialogClose}
            color="inherit"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Volver
          </Button>
          <Button 
            onClick={handleCancelSubscription}
            variant="contained"
            color="error"
            disabled={cancelling}
            startIcon={cancelling ? <CircularProgress size={20} color="inherit" /> : <X weight="bold" />}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {cancelling ? 'Cancelando...' : 'Confirmar cancelación'}
          </Button>
        </DialogActions>
      </Dialog>

  {/* Diálogo para cambiar de plan */}
      <Dialog 
        open={changePlanDialogOpen} 
    onClose={handleChangePlanDialogClose}
    PaperProps={{
      sx: {
        borderRadius: '16px',
        width: '100%',
        maxWidth: '800px'
      }
    }}
  >
    <DialogTitle sx={{ fontFamily: 'Sora', fontWeight: 600 }}>
      Cambiar plan
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Selecciona el plan que mejor se adapte a tus necesidades
      </Typography>
      
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={3} 
        sx={{ width: '100%' }}
      >
        {plans.map((plan) => (
          <Paper
            key={plan.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
                  border: `2px solid ${selectedPlan === plan.id 
                    ? theme.palette.primary.main 
                : alpha(theme.palette.divider, 0.1)}`,
              background: theme.palette.mode === 'dark' ? plan.darkColor : plan.color,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
            component={motion.div}
            whileHover={{ y: -5 }}
            onClick={() => handleSelectPlan(plan.id)}
          >
            {plan.badge && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: 10,
                  px: 2,
                  py: 0.5,
                  borderRadius: '50px',
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  zIndex: 1,
                }}
              >
                {plan.badge}
              </Box>
            )}
            
            {selectedPlan === plan.id && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check weight="bold" size={16} />
              </Box>
            )}
            
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {plan.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 0 }}>
              {plan.description}
            </Typography>
            
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'baseline' }}>
              {plan.price === '0' ? 'Gratis' : `$${plan.price}`}
              {plan.price !== '0' && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {plan.period}
                </Typography>
              )}
            </Typography>
            
            <Box sx={{ mb: 3, flexGrow: 1 }}>
              {plan.features.map((feature, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                  <Check size={18} weight="bold" style={{ color: theme.palette.success.main, marginTop: 2 }} />
                  <Typography variant="body2">
                    {feature.text}
                  </Typography>
                </Stack>
              ))}
            </Box>
            
            {plan.trialDays && (
                  <Typography variant="body2" sx={{ 
                    mb: 2, 
                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Star weight="fill" size={16} style={{ marginRight: 4 }} />
                Incluye {plan.trialDays} días de prueba
              </Typography>
            )}
          </Paper>
        ))}
      </Stack>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
          <Button 
        onClick={handleChangePlanDialogClose}
        color="inherit"
            sx={{ 
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        Cancelar
      </Button>
          <Button 
        onClick={handleChangePlan}
        variant="contained"
        color="primary"
            disabled={!selectedPlan || changingPlan}
            startIcon={
              changingPlan ? 
                <CircularProgress size={20} color="inherit" /> : 
                <ArrowCircleUp weight="bold" />
            }
            sx={{
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 500
        }}
      >
            {changingPlan ? 'Procesando...' : 'Cambiar a este plan'}
      </Button>
    </DialogActions>
  </Dialog>
  
  {/* Snackbar de notificaciones */}
  <Snackbar
    open={snackbarOpen}
    autoHideDuration={4000}
    onClose={() => setSnackbarOpen(false)}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
      variant="filled"
      sx={{ width: '100%', borderRadius: '10px' }}
    >
      {snackbarMessage}
    </Alert>
  </Snackbar>
</Stack>
);
}