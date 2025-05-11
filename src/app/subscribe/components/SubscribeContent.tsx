'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  alpha,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
// Define Auth result interface
interface AuthResult {
  user: User | null;
  loading: boolean;
}
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowBack,
  CreditCard,
  Lock,
  Security,
  AccessTime,
  Info
} from '@mui/icons-material';
import Logo from '@/components/ui/logo';
import { SelectedPlan } from '@/types/subscription';

// Declaración para PayPal
interface PayPalButtonsConfig {
  style: {
    shape: string;
    color: string;
    layout: string;
    label: string;
    [key: string]: unknown;
  };
  createSubscription: () => Promise<string>;
  onApprove: (data: { subscriptionID: string; [key: string]: unknown }) => Promise<void>;
  onError: (err: Error) => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonsConfig) => {
        render: (element: HTMLElement | null) => void;
      };
    };
  }
}

// Componente de partículas animadas
const ParticlesBackground = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const particleColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)';
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
      }}
    >
      {[...Array(50)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            backgroundColor: particleColor,
            borderRadius: '50%',
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
          }}
          animate={{
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </Box>
  );
};

export default function SubscribeContent() {
  const router = useRouter();
  const authResult = useAuth() as unknown as AuthResult;
  const user = authResult?.user;
  const authLoading = authResult?.loading;
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [creatingSubscription, setCreatingSubscription] = useState(false);

  // Cargar script de PayPal
  useEffect(() => {
    const loadPayPalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      script.onerror = () => setError('Error al cargar PayPal. Por favor, recarga la página.');
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };
    
    loadPayPalScript();
  }, []);

  // Verificar autenticación y estado del usuario
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    
    const checkUserStatus = async () => {
      try {
        setLoading(true);
        
        // Verificar si el email está verificado
        if (!user.emailVerified) {
          router.push('/auth/verify-email');
          return;
        }
        
        // Obtener datos del usuario
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          setError('No se encontró información del usuario');
          return;
        }
        
        const userData = userDoc.data();
        // Check plan status without storing it as state
        const currentPlanStatus = userData.planStatus || 'pending';
        
        // Si el plan ya está activo, redirigir al dashboard
        if (currentPlanStatus === 'active') {
          router.push('/dashboard');
          return;
        }
        
        // Obtener plan seleccionado del localStorage
        const storedPlan = localStorage.getItem('selectedPlan');
        
        if (storedPlan) {
          const plan = JSON.parse(storedPlan) as SelectedPlan;
          setSelectedPlan(plan);
        } else {
          // Si no hay plan seleccionado, redirigir a pricing
          router.push('/pricing');
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al verificar estado del usuario:', err);
        setError('Error al cargar la información del usuario');
        setLoading(false);
      }
    };
    
    checkUserStatus();
  }, [user, authLoading, router]);

  // Renderizar botón de PayPal cuando esté cargado
  useEffect(() => {
    if (!paypalLoaded || !selectedPlan || !paypalButtonRef.current || !user) return;
    
    // Limpiar contenedor
    paypalButtonRef.current.innerHTML = '';
    
    // Renderizar botón de PayPal
    window.paypal?.Buttons({
      style: {
        shape: 'rect',
        color: 'blue',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: async () => {
        try {
          setCreatingSubscription(true);
    
          const token = await user.getIdToken();
    
          const response = await fetch('/api/create-paypal-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              paypalPlanId: selectedPlan.paypalPlanId
            })
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear suscripción');
          }
    
          const data = await response.json();
    
          if (data.approvalUrl) {
            window.location.href = data.approvalUrl;
          } else {
            throw new Error('No se recibió una URL de aprobación');
          }
    
          return ''; // Necesario para que PayPal no arroje error
        } catch (err) {
          console.error('Error al crear suscripción:', err);
          setError('Error al crear la suscripción. Por favor, inténtalo de nuevo.');
          setCreatingSubscription(false);
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          // Handle successful approval
          console.log('Subscription approved:', data.subscriptionID);
          return Promise.resolve();
        } catch (err) {
          console.error('Error in onApprove:', err);
          return Promise.reject(err);
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        setError('Error con PayPal. Por favor, inténtalo de nuevo.');
        setCreatingSubscription(false);
      }
    }).render(paypalButtonRef.current);
    
  }, [paypalLoaded, selectedPlan, user, router]);

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Formatear precio
  const formatPrice = (price: number, period: string) => {
    return `${price}€/${period === 'month' ? 'mes' : 'año'}`;
  };

  // Volver a la página de pricing
  const handleBackToPricing = () => {
    router.push('/pricing');
  };

  if (loading || authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, #0F172A 0%, #1E293B 100%)'
            : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #EFF6FF 100%)',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        background: isDark
          ? 'radial-gradient(circle at 50% 50%, #0F172A 0%, #1E293B 100%)'
          : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #EFF6FF 100%)',
        overflow: 'hidden',
      }}
    >
      <ParticlesBackground />
      
      {/* Logo */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.div>
      </Box>
      
      <Container maxWidth="md" sx={{ py: 4, zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90vh',
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <Card
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: isDark
                  ? alpha(theme.palette.background.paper, 0.7)
                  : alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(16px)',
                border: isDark
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(59, 130, 246, 0.1)',
                boxShadow: isDark
                  ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                  : '0 10px 30px rgba(59, 130, 246, 0.1)',
              }}
            >
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: isDark
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <CreditCard
                      sx={{
                        fontSize: 40,
                        color: theme.palette.primary.main,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    Completa tu suscripción
                  </Typography>
                </Box>
              </motion.div>
              
              {/* Mensaje de error */}
              {error && (
                <motion.div variants={itemVariants}>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}
              
              {/* Detalles del plan */}
              {selectedPlan && (
                <motion.div variants={itemVariants}>
                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={4} 
                    sx={{ mb: 4 }}
                  >
                    {/* Columna izquierda - Detalles del plan */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: isDark
                          ? 'rgba(30, 41, 59, 0.5)'
                          : 'rgba(241, 245, 249, 0.7)',
                        flex: 1,
                        width: { xs: '100%', md: '50%' },
                      }}
                    >
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              fontWeight: 700,
                            }}
                          >
                            {selectedPlan.name}
                          </Typography>
                          <Chip
                            label={selectedPlan.id === 'pro' ? 'Profesional' : 'Enterprise'}
                            color="primary"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        
                        <Typography
                          variant="h4"
                          sx={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 800,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {formatPrice(selectedPlan.price, selectedPlan.period)}
                        </Typography>
                        
                        {selectedPlan.trialDays && selectedPlan.trialDays > 0 && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1.5,
                              borderRadius: 1.5,
                              bgcolor: isDark
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.2)',
                            }}
                          >
                            <AccessTime sx={{ color: 'success.main' }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 600,
                                color: 'success.main',
                              }}
                            >
                              {selectedPlan.trialDays} días de prueba gratuita
                            </Typography>
                          </Box>
                        )}
                        
                        <Divider />
                        
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 700,
                          }}
                        >
                          Incluye:
                        </Typography>
                        
                        <List disablePadding dense>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircle fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Clientes ilimitados"
                              primaryTypographyProps={{
                                fontFamily: '"Inter", sans-serif',
                                variant: 'body2',
                              }}
                            />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircle fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Gestión avanzada de pólizas"
                              primaryTypographyProps={{
                                fontFamily: '"Inter", sans-serif',
                                variant: 'body2',
                              }}
                            />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircle fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Soporte prioritario 24/7"
                              primaryTypographyProps={{
                                fontFamily: '"Inter", sans-serif',
                                variant: 'body2',
                              }}
                            />
                          </ListItem>
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckCircle fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Análisis de rentabilidad"
                              primaryTypographyProps={{
                                fontFamily: '"Inter", sans-serif',
                                variant: 'body2',
                              }}
                            />
                          </ListItem>
                        </List>
                      </Stack>
                    </Box>
                    
                    {/* Columna derecha - Método de pago */}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: isDark
                          ? 'rgba(30, 41, 59, 0.5)'
                          : 'rgba(241, 245, 249, 0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        width: { xs: '100%', md: '50%' },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 700,
                          mb: 2,
                        }}
                      >
                        Método de pago
                      </Typography>
                      
                      {/* Información de seguridad */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: isDark
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          mb: 3,
                        }}
                      >
                        <Lock sx={{ color: 'primary.main' }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                          }}
                        >
                          Pago seguro procesado por PayPal
                        </Typography>
                      </Box>
                      
                      {/* Botón de PayPal */}
                      <Box
                        sx={{
                          mb: 3,
                          minHeight: 150,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {creatingSubscription ? (
                          <CircularProgress />
                        ) : (
                          <div ref={paypalButtonRef} style={{ width: '100%' }}></div>
                        )}
                      </Box>
                      
                      {/* Información adicional */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: isDark
                            ? 'rgba(30, 41, 59, 0.7)'
                            : 'rgba(255, 255, 255, 0.7)',
                          mt: 'auto',
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <Info fontSize="small" color="info" sx={{ mt: 0.3 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              fontSize: '0.875rem',
                              color: 'text.secondary',
                            }}
                          >
                            Al completar la suscripción, aceptas los términos y condiciones del servicio. Puedes cancelar tu suscripción en cualquier momento desde tu panel de control.
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                </motion.div>
              )}
              
              {/* Botón para volver */}
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBackToPricing}
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderWidth: '2px',
                    }}
                  >
                    Volver a planes
                  </Button>
                </Box>
              </motion.div>
              
              {/* Información de seguridad */}
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mt: 4,
                    flexWrap: 'wrap',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Lock fontSize="small" color="action" />
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        color: 'text.secondary',
                      }}
                    >
                      Pago seguro
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Security fontSize="small" color="action" />
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        color: 'text.secondary',
                      }}
                    >
                      Datos encriptados
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}