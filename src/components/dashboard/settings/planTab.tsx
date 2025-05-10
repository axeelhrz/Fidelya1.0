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
  Alert
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
  Robot 
} from 'phosphor-react';
import { useProfile } from '@/hooks/use-profile';

export default function PlanTab() {
  const theme = useTheme();
  const { profile, isLoading: profileLoading } = useProfile();
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  
  // Abrir diálogo de cancelación
  const handleCancelDialogOpen = () => {
    setCancelDialogOpen(true);
  };
  
  // Cerrar diálogo de cancelación
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
  };
  
  // Cancelar suscripción
  const handleCancelSubscription = async () => {
    setCancelling(true);
    setSubscriptionLoading(true);
    try {
      // Implement your subscription cancellation logic here
      // Example: await api.cancelSubscription(profile?.subscriptionId);
      handleCancelDialogClose();
      setSnackbarMessage('Suscripción cancelada correctamente');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setSnackbarMessage('Error al cancelar la suscripción');
      setSnackbarSeverity('error');
    } finally {
      setCancelling(false);
      setSubscriptionLoading(false);
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
  
  if (profileLoading || subscriptionLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando información del plan...</Typography>
      </Box>
    );
  }
  
  // Datos del plan (simulados)
  const planData = {
    name: profile?.plan?.name || 'Free',
    price: profile?.plan?.price ? Number(profile?.plan?.price) : 0,
    billingCycle: profile?.plan?.billingCycle || 'monthly',
    status: profile?.plan?.status || 'active',
    startDate: profile?.plan?.startDate || '2023-01-01',
    endDate: profile?.plan?.endDate || '2023-12-31',
    features: {
      clients: profile?.plan?.name === 'Free' ? 10 : profile?.plan?.name === 'Pro' ? 100 : 'Ilimitados',
      policies: profile?.plan?.name === 'Free' ? 20 : profile?.plan?.name === 'Pro' ? 200 : 'Ilimitadas',
      analytics: profile?.plan?.name !== 'Free',
      ai: profile?.plan?.name === 'Enterprise'
    },
    usage: {
      clients: {
        used: 8,
        total: profile?.plan?.name === 'Free' ? 10 : profile?.plan?.name === 'Pro' ? 100 : 1000
      },
      policies: {
        used: 15,
        total: profile?.plan?.name === 'Free' ? 20 : profile?.plan?.name === 'Pro' ? 200 : 1000
      }
    }
  };
  
  // Calcular porcentaje de uso
  const calculateUsagePercentage = (used: number, total: number) => {
    if (typeof total === 'string') return 0;
    return Math.min(Math.round((used / total) * 100), 100);
  };
  
  // Obtener color según porcentaje
  const getColorByPercentage = (percentage: number) => {
    if (percentage < 60) return theme.palette.success.main;
    if (percentage < 80) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
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
                    href="/pricing"
                  >
                    {planData.name === 'Free' ? 'Actualizar plan' : 'Cambiar plan'}
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
                    {planData.features.clients}
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
                    {planData.features.policies}
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