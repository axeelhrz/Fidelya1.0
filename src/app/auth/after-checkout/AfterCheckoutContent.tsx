'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  AccessTime,
  CalendarMonth,
  CreditCard,
  Dashboard,
  ArrowForward,
  ErrorOutline
} from '@mui/icons-material';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import Logo from '@/components/ui/logo';

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

export default function AfterCheckoutContent() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';
  
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading, getFormattedRenewalDate } = useSubscription();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Verificar estado de autenticación y suscripción
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Esperar a que carguen los datos
        if (authLoading || subscriptionLoading) {
          return;
        }
        
        // Si no hay usuario, redirigir a login
        if (!user) {
          router.replace('/auth/sign-in');
          return;
        }
        
        // Si no hay suscripción, redirigir a pricing
        if (!subscription) {
          router.replace('/pricing');
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al verificar estado:', err);
        setError('Error al verificar el estado de tu suscripción');
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [user, subscription, authLoading, subscriptionLoading, router]);
  
  // Obtener información de la suscripción
  const planName = subscription?.plan || 'Básico';
  const planId = subscription?.planId || 'basic';
  const status = subscription?.status || 'pending';
  const renewalDate = getFormattedRenewalDate?.() || '';
  
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
  
  // Pantalla de carga
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, #0F172A 0%, #1E293B 100%)'
            : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #EFF6FF 100%)',
        }}
      >
        <ParticlesBackground />
        
        <CircularProgress 
          size={50} 
          sx={{ 
            color: theme.palette.primary.main,
            mb: 3
          }} 
        />
        
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 600,
            textAlign: 'center',
            maxWidth: 300,
          }}
        >
          Verificando tu suscripción...
        </Typography>
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
            style={{ width: '100%', maxWidth: 600 }}
          >
            <Paper
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
              {/* Icono de éxito */}
              <motion.div
                variants={itemVariants}
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle
                    sx={{
                      fontSize: 40,
                      color: theme.palette.success.main,
                    }}
                  />
                </Box>
              </motion.div>
              
              {/* Título y mensaje */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  component="h1"
                  textAlign="center"
                  gutterBottom
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  ¡Suscripción completada!
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  textAlign="center"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    mb: 4,
                    opacity: 0.8,
                  }}
                >
                  Gracias por suscribirte a Assuriva. Tu cuenta ha sido activada correctamente.
                </Typography>
              </motion.div>
              
              {/* Mensaje de error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginBottom: '16px' }}
                  >
                    <Alert 
                      severity="error" 
                      sx={{ 
                        borderRadius: 2,
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          alignItems: 'center',
                          mr: 1
                        }
                      }}
                      icon={<ErrorOutline />}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Detalles de la suscripción */}
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: isDark
                      ? alpha(theme.palette.primary.main, 0.05)
                      : alpha(theme.palette.primary.main, 0.03),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
                        Detalles del plan
                      </Typography>
                      
                      <Chip
                        label={status === 'active' ? 'Activo' : 'Pendiente'}
                        color={status === 'active' ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    
                    <Divider />
                    
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <CreditCard fontSize="small" color="primary" />
                          Plan
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ fontFamily: '"Inter", sans-serif' }}
                        >
                          {planName}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <AccessTime fontSize="small" color="primary" />
                          Periodo
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ fontFamily: '"Inter", sans-serif' }}
                        >
                          {planId === 'basic' ? 'Ilimitado' : 'Mensual'}
                        </Typography>
                      </Box>
                      
                      {renewalDate && planId !== 'basic' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <CalendarMonth fontSize="small" color="primary" />
                            Próxima renovación
                          </Typography>
                          
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ fontFamily: '"Inter", sans-serif' }}
                          >
                            {renewalDate}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              </motion.div>
              
              {/* Botones de acción */}
              <motion.div variants={itemVariants}>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<Dashboard />}
                    onClick={() => router.push('/dashboard')}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                      boxShadow: isDark
                        ? '0 4px 12px rgba(37, 99, 235, 0.5)'
                        : '0 4px 12px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Ir al dashboard
                  </Button>
                  
                  <Link href="/dashboard/configuracion" passHref>
                    <Button
                      variant="outlined"
                      size="large"
                      endIcon={<ArrowForward />}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderWidth: '2px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Configurar mi cuenta
                    </Button>
                  </Link>
                </Stack>
              </motion.div>
              
              {/* Mensaje de soporte */}
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: isDark
                      ? alpha(theme.palette.info.main, 0.05)
                      : alpha(theme.palette.info.main, 0.03),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      textAlign: 'center',
                    }}
                  >
                    ¿Necesitas ayuda? Contacta con nuestro{' '}
                    <Link href="/dashboard/soporte" passHref>
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          color: 'primary.main',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        equipo de soporte
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </motion.div>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}