'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sendEmailVerification, User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Refresh, CheckCircle, ArrowForward } from '@mui/icons-material';
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

export default function VerifyEmailPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const router = useRouter();
  const authData = useAuth();
  const { user = null as User | null, loading: authLoading = false } = authData ?? {};
  
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  
  // Función para activar plan básico
  const activateBasicPlan = useCallback(async (userId: string) => {
    try {
      const token = await user?.getIdToken();
      
      const response = await fetch('/api/activate-free-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error('Error al activar plan básico');
      }
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error al activar plan básico:', err);
      setError('Error al activar el plan básico. Por favor, inténtalo de nuevo.');
      setRedirecting(false);
    }
  }, [user, router, setError]);
  
  // Verificar estado del email
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    
    // Obtener información del plan del usuario
    const getUserPlan = async () => {
      try {
        if (!user) return;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserPlan(userData.plan || 'basic');
        }
      } catch (err) {
        console.error('Error al obtener información del usuario:', err);
      }
    };
    
    getUserPlan();
    
    // Verificar email periódicamente
    const checkEmailVerification = async () => {
      if (!user) return;
      
      setVerifying(true);
      try {
        // Recargar usuario para obtener estado actualizado
        await user.reload();
        const updatedUser = auth.currentUser;
        
        if (updatedUser?.emailVerified) {
          setVerified(true);
          
          // Actualizar estado en Firestore
          await updateDoc(doc(db, 'users', updatedUser.uid), {
            emailVerified: true,
            verified: true
          });
          
          // Redirigir según el plan
          setRedirecting(true);
          setTimeout(() => {
            if (userPlan === 'basic') {
              // Activar plan básico
              activateBasicPlan(updatedUser.uid);
            } else {
              // Redirigir a la página de suscripción para planes pagos
              router.push('/subscribe');
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Error al verificar email:', err);
        setError('Error al verificar el estado del email');
      } finally {
        setVerifying(false);
      }
    };
    
    const interval = setInterval(checkEmailVerification, 5000);
    checkEmailVerification(); // Verificar inmediatamente al cargar
    
    return () => clearInterval(interval);
  }, [user, router, userPlan, activateBasicPlan, authLoading]);
  
  // Función para reenviar email de verificación
  const handleResendEmail = async () => {
    if (!user || resendCooldown > 0) return;
    
    try {
      await sendEmailVerification(user);
      setResendCooldown(60); // 60 segundos de espera
    } catch (err) {
      console.error('Error al reenviar email:', err);
      setError('Error al reenviar el email de verificación');
    }
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
      
      <Container maxWidth="sm" sx={{ py: 4, zIndex: 1 }}>
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
                    <Email
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
                    Verifica tu email
                  </Typography>
                </Box>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  Hemos enviado un correo de verificación a{' '}
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Typography>
              </motion.div>
              
              {/* Estado de verificación */}
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 3 }}>
                  {verified ? (
                    <Alert
                      icon={<CheckCircle fontSize="inherit" />}
                      severity="success"
                      sx={{ mb: 2 }}
                    >
                      ¡Email verificado correctamente!
                    </Alert>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                </Box>
              </motion.div>
              
              {/* Instrucciones */}
              {!verified && (
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: isDark
                        ? 'rgba(30, 41, 59, 0.5)'
                        : 'rgba(241, 245, 249, 0.7)',
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      No encuentras el correo?
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        color: 'text.secondary',
                        mb: 1,
                      }}
                    >
                      1. Revisa la carpeta de spam o correo no deseado
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        color: 'text.secondary',
                        mb: 1,
                      }}
                    >
                      2. Asegúrate de que la dirección de correo sea correcta
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        color: 'text.secondary',
                      }}
                    >
                      3. Si aún no lo recibes, puedes solicitar un nuevo correo
                    </Typography>
                  </Box>
                </motion.div>
              )}
              
              {/* Acciones */}
              <motion.div variants={itemVariants}>
                <Stack spacing={2}>
                  {verified ? (
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={redirecting ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                      disabled={redirecting}
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
                      }}
                    >
                      {redirecting ? 'Redirigiendo...' : userPlan === 'basic' ? 'Ir al Dashboard' : 'Continuar con la suscripción'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={verifying ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                        disabled={verifying}
                        onClick={() => user?.reload()}
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
                        }}
                      >
                        {verifying ? 'Verificando...' : 'Verificar estado'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="large"
                        disabled={resendCooldown > 0}
                        onClick={handleResendEmail}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderWidth: '2px',
                        }}
                      >
                        {resendCooldown > 0
                          ? `Reenviar en ${resendCooldown}s`
                          : 'Reenviar email de verificación'}
                      </Button>
                    </>
                  )}
                </Stack>
              </motion.div>
              
              {/* Información adicional */}
              <motion.div variants={itemVariants}>
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  Si continúas teniendo problemas, contacta con nuestro{' '}
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    soporte técnico
                  </Typography>
                </Typography>
              </motion.div>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}