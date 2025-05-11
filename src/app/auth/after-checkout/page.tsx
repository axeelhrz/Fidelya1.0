'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
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
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Dashboard,
  CalendarToday,
  AccessTime,
  CreditCard
} from '@mui/icons-material';
import Logo from '@/components/ui/logo';
import { AfterCheckoutContent } from './AfterCheckoutContent';
import { AuthProvider } from '@/context/auth-context';


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

export default function AfterCheckoutPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading: subscriptionLoading, isActive, isInTrialPeriod, getRemainingTrialDays, getFormattedRenewalDate } = useSubscription();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string>('');
  
  // Verificar autenticación y estado del usuario
  useEffect(() => {
    if (authLoading || subscriptionLoading) return;
    
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    
    const getUserData = async () => {
      try {
        // Obtener datos del usuario
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPlanName(userData.planName || 'Plan');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        setError('Error al cargar la información del usuario');
        setLoading(false);
      }
    };
    
    getUserData();
  }, [user, authLoading, subscriptionLoading, router]);
  
  // Redirigir al dashboard
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };
  
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
  
  if (loading || authLoading || subscriptionLoading) {
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
    <AuthProvider>
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
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(16, 185, 129, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 40,
                        color: 'success.main',
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
                      background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    ¡Suscripción completada!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      mb: 3,
                    }}
                  >
                    Tu cuenta ha sido activada correctamente
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
              
              {/* Detalles de la suscripción */}
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: isDark
                      ? 'rgba(30, 41, 59, 0.5)'
                      : 'rgba(241, 245, 249, 0.7)',
                    mb: 4,
                  }}
                >
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 700,
                        }}
                      >
                        {planName}
                      </Typography>
                      <Chip
                        label={isActive ? 'Activo' : 'Pendiente'}
                        color={isActive ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    
                    <Divider />
                    
                    {/* Información de período de prueba */}
                    {isInTrialPeriod() && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: isDark
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        <AccessTime sx={{ color: 'success.main' }} />
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              fontWeight: 600,
                              color: 'success.main',
                            }}
                          >
                            Período de prueba activo
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              display: 'block',
                              color: 'text.secondary',
                            }}
                          >
                            Te quedan {getRemainingTrialDays()} días de prueba gratuita
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {/* Información de renovación */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CalendarToday sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600,
                          }}
                        >
                          Próxima renovación
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            display: 'block',
                            color: 'text.secondary',
                          }}
                        >
                          {getFormattedRenewalDate()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Información de pago */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CreditCard sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600,
                          }}
                        >
                          Método de pago
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            display: 'block',
                            color: 'text.secondary',
                          }}
                        >
                          PayPal
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </motion.div>
              
              {/* Contenido adicional */}
              <motion.div variants={itemVariants}>
                <AfterCheckoutContent />
              </motion.div>
              
              {/* Botón para ir al dashboard */}
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<Dashboard />}
                    onClick={handleGoToDashboard}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                      boxShadow: isDark
                        ? '0 4px 12px rgba(37, 99, 235, 0.5)'
                        : '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    Ir al Dashboard
                  </Button>
                </Box>
              </motion.div>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
    </AuthProvider>
  );
}