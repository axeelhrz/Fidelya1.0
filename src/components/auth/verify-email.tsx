'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Paper,
  Stack,
  alpha,
  styled,
  useTheme,
  Container,
  Tooltip,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  CheckCircle,
  Refresh,
  MailOutline,
  ErrorOutline,
  ContentCopy,
  AccessTime,
  Security,
  Visibility,
  VisibilityOff,
  OpenInNew
} from '@mui/icons-material';

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



// Componentes estilizados
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  maxWidth: 480,
  width: '100%',
  margin: 'auto',
  backgroundColor: alpha(
    theme.palette.mode === 'dark' ? '#0F172A' : theme.palette.background.paper, 
    theme.palette.mode === 'dark' ? 0.7 : 0.8
  ),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider, 
    0.1
  )}`,
  boxShadow: `0 8px 32px ${alpha(
    theme.palette.common.black, 
    theme.palette.mode === 'dark' ? 0.3 : 0.1
  )}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px ${alpha(
      theme.palette.common.black, 
      theme.palette.mode === 'dark' ? 0.4 : 0.15
    )}`,
  },
}));

const EmailIconWrapper = styled(Box)(({ theme }) => ({
  width: 88,
  height: 88,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: '50%',
    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.1)', opacity: 0.5 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontFamily: '"Inter", sans-serif',
  fontWeight: 600,
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  '&.Mui-disabled': {
    backgroundColor: alpha(theme.palette.action.disabled, 0.1),
  },
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(
    theme.palette.mode === 'dark' ? '#0F172A' : theme.palette.background.paper, 
    0.8
  ),
  backdropFilter: 'blur(8px)',
  zIndex: theme.zIndex.modal + 1,
  gap: theme.spacing(2),
}));

// Componente de simulación de bandeja de entrada
const EmailPreview = ({ onOpenEmail }: { onOpenEmail: () => void }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box
      sx={{
        width: '100%',
        mt: 3,
        mb: 2,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{
          p: 1,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(59, 130, 246, 0.05)',
          borderBottom: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
          Bandeja de entrada
        </Typography>
        <Chip 
          size="small" 
          label="1 nuevo" 
          color="primary" 
          sx={{ 
            height: 20, 
            fontSize: '0.65rem',
            fontWeight: 600,
            '& .MuiChip-label': { px: 1 }
          }} 
        />
      </Box>
      
      <Box
        sx={{
          p: 2,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)',
          },
        }}
        onClick={onOpenEmail}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            A
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                Assuriva
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: 'text.secondary' }}>
                Ahora
              </Typography>
            </Stack>
            
            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
              Verificación de correo electrónico
            </Typography>
            
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Inter", sans-serif', 
                color: 'text.secondary',
                display: 'block',
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Haz clic en el enlace para verificar tu cuenta en Assuriva y comenzar a...
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

// Componente de visualización de email
const EmailViewer = ({ userEmail, onClose }: { userEmail: string | null, onClose: () => void }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box
      sx={{
        width: '100%',
        mt: 3,
        mb: 2,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(59, 130, 246, 0.05)',
          borderBottom: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
          Verificación de correo electrónico
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <VisibilityOff fontSize="small" />
        </IconButton>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              A
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                Assuriva <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>{'<noreply@assuriva.com>'}</Typography>
              </Typography>
              
              <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: 'text.secondary' }}>
                Para: {userEmail}
              </Typography>
            </Box>
          </Stack>
          
          <Divider />
          
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', mb: 2 }}>
              Hola,
            </Typography>
            
            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', mb: 2 }}>
              Gracias por registrarte en Assuriva. Para verificar tu dirección de correo electrónico, haz clic en el siguiente botón:
            </Typography>
            
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  textTransform: 'none',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                }}
                endIcon={<OpenInNew fontSize="small" />}
              >
                Verificar mi correo electrónico
              </Button>
            </Box>
            
            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', mb: 2 }}>
              Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:
            </Typography>
            
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: '"Inter", sans-serif', 
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                https://assuriva.com/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </Typography>
              
              <Tooltip title="Copiar enlace">
                <IconButton size="small">
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', mb: 1 }}>
              Este enlace expirará en 24 horas.
            </Typography>
            
            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', mb: 2 }}>
              Si no has solicitado esta verificación, puedes ignorar este correo.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
              El equipo de Assuriva
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

// Componente de verificación en tiempo real
const VerificationStatus = ({ verificationChecks, onCheck }: { 
  verificationChecks: number, 
  onCheck: () => void 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box
      sx={{
        width: '100%',
        mt: 2,
        mb: 3,
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(255, 255, 255, 0.3)',
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
            Estado de verificación
          </Typography>
          
          <Chip 
            size="small" 
            label={`${verificationChecks} verificaciones`} 
            color="primary" 
            variant="outlined"
            sx={{ 
              height: 24, 
              fontSize: '0.7rem',
              fontWeight: 500,
              '& .MuiChip-label': { px: 1 }
            }} 
          />
        </Stack>
        
        <LinearProgress 
          variant="determinate" 
          value={Math.min(verificationChecks * 20, 100)} 
          sx={{ 
            height: 6, 
            borderRadius: 3,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }} 
        />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: '"Inter", sans-serif', 
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <AccessTime fontSize="inherit" />
            Verificación automática en curso
          </Typography>
          
          <Button
            size="small"
            onClick={onCheck}
            startIcon={<Refresh fontSize="small" />}
            sx={{ 
              fontFamily: '"Inter", sans-serif',
              textTransform: 'none',
              fontSize: '0.75rem',
            }}
          >
            Verificar ahora
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

// Función para activar el plan gratuito
const activateFreePlan = async (): Promise<boolean> => {
    try {
              const user = auth.currentUser;
    if (!user) return false;
                const token = await user.getIdToken();
    const response = await fetch('/api/activate-free-plan', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                });
                
    if (!response.ok) {
      console.error('Error al activar plan gratuito:', await response.text());
      return false;
              }
    
    return true;
            } catch (err) {
              console.error('Error al activar plan gratuito:', err);
    return false;
            }
    };

// Este bloque ha sido movido dentro del componente VerifyEmail

export default function VerifyEmail() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationTimer, setVerificationTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showEmailViewer, setShowEmailViewer] = useState(false);
  const [verificationChecks, setVerificationChecks] = useState(0);
  const [autoCheckActive, setAutoCheckActive] = useState(false);

  // Handlers for email preview and viewer
  const handleOpenEmailPreview = () => {
    setShowEmailPreview(true);
  };

  const handleOpenEmailViewer = () => {
    setShowEmailViewer(true);
    setShowEmailPreview(false);
  };

// Función para verificar el estado de la suscripción
const checkSubscriptionAndRedirect = useCallback(async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    // Verificar si el usuario tiene un plan básico activo
    if (userData?.planStatus === 'active' && userData?.plan === 'basic') {
      setSuccess('¡Verificado! Redirigiendo al dashboard...');
      setTimeout(() => router.replace('/dashboard'), 1500);
      return;
    }
    
    // Si no tiene plan básico activo, activarlo automáticamente
    const activated = await activateFreePlan();
    
    if (activated) {
      setSuccess('¡Plan básico activado! Redirigiendo al dashboard...');
      setTimeout(() => router.replace('/dashboard'), 1500);
      return;
    }
    
    // Si hay un error al activar el plan básico, verificar si hay un plan seleccionado
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      
      // Si el plan guardado es básico, intentar activarlo nuevamente
      if (plan.id === 'basic') {
        const retryActivation = await activateFreePlan();
        
        if (retryActivation) {
          setSuccess('¡Plan básico activado! Redirigiendo al dashboard...');
          setTimeout(() => router.replace('/dashboard'), 1500);
          return;
        }
      }
      
      // Si no es plan básico o no se pudo activar, continuar con la suscripción
      setSuccess('¡Verificado! Continuando con la suscripción...');
      setTimeout(() => router.replace('/subscribe'), 1500);
    } else {
      // Si no hay plan seleccionado, activar plan básico por defecto
      const defaultActivation = await activateFreePlan();
      
      if (defaultActivation) {
        setSuccess('¡Plan básico activado! Redirigiendo al dashboard...');
        setTimeout(() => router.replace('/dashboard'), 1500);
      } else {
        setSuccess('¡Verificado! Selecciona un plan para continuar...');
        setTimeout(() => router.replace('/pricing'), 1500);
      }
    }
  } catch (err) {
    console.error('Error al verificar suscripción:', err);
    setError('Error al verificar el estado de la suscripción');
  }
}, [router]);

// Function to check verification status
const checkVerification = useCallback(async (manual: boolean = false) => {
  try {
    if (manual) setLoading(true);
    
    const user = auth.currentUser;
    await user?.reload();
    
    if (user?.emailVerified) {
      await checkSubscriptionAndRedirect(user.uid);
    } else if (manual) {
      setError('Tu correo aún no ha sido verificado. Por favor, revisa tu bandeja de entrada.');
      setLoading(false);
    }
  } catch (err) {
    console.error('Error al verificar email:', err);
    if (manual) {
      setError('Error al verificar el estado del correo');
      setLoading(false);
    }
  }
}, [checkSubscriptionAndRedirect, setError, setLoading]);

// Define handleSendVerification
const handleSendVerification = async () => {
  setError(null);
  setLoading(true);
  
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    
    await sendEmailVerification(user);
    setEmailSent(true);
    setVerificationTimer(60);
    setCanResend(false);
    setAutoCheckActive(true);
    setSuccess('Correo de verificación enviado con éxito');
  } catch (err) {
    console.error('Error al enviar correo:', err);
    setError('Error al enviar el correo de verificación');
  } finally {
    setLoading(false);
  }
};

// Efecto para manejar la autenticación inicial
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.replace('/auth/sign-in');
      return;
    }
    
    setUserEmail(user.email);
    
    if (user.emailVerified) {
      await checkSubscriptionAndRedirect(user.uid);
      return;
    }
    
    setLoading(false);
    
    if (!emailSent) {
      await handleSendVerification();
    }
  });
  
  return () => unsubscribe();
}, [router, emailSent, checkSubscriptionAndRedirect]);

  // Efecto para verificación automática
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoCheckActive) {
      interval = setInterval(() => {
        checkVerification(false);
        setVerificationChecks(prev => prev + 1);
      }, 10000); // Verificar cada 10 segundos
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoCheckActive, checkVerification]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('selectedPlan');
      router.push('/auth/sign-up');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleCloseEmailViewer = () => {
    setShowEmailViewer(false);
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
    }}
  >
    <ParticlesBackground />
    
    <Container maxWidth="sm" sx={{ py: 6, zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
  <StyledPaper elevation={0}>
    {/* The rest of the content is being handled in the next Stack component */}

    <Stack spacing={3} alignItems="center">
              {/* Icono de Email Animado */}
              <EmailIconWrapper>
                <MailOutline
                  sx={{
                    fontSize: 44,
                    color: theme.palette.primary.main,
                  }}
                />
              </EmailIconWrapper>
              
              {/* Título y Mensaje Principal */}
              <Stack spacing={2} textAlign="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Verifica tu correo electrónico
                </Typography>
   
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: 'text.secondary'
                  }}
                >
                  Hemos enviado un correo de verificación a
                  <Box 
                    component="span" 
                    sx={{
                      color: 'primary.main',
                      fontWeight: 500,
                      display: 'block',
                      mt: 1
                    }}
                  >
                    {userEmail}
                  </Box>
                </Typography>
              </Stack>
              
              {/* Mensajes de error/éxito */}
              <AnimatePresence mode="wait">
                {(error || success) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ width: '100%' }}
                  >
                    <Alert
                      severity={error ? 'error' : 'success'}
                      sx={{
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          fontSize: '1.25rem',
                        },
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {error || success}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Simulador de bandeja de entrada (característica única) */}
              {!showEmailViewer && showEmailPreview && (
                <EmailPreview 
                  onOpenEmail={handleOpenEmailViewer} 
                />
              )}
              
              {/* Visualizador de email (característica única) */}
              {showEmailViewer && (
                <EmailViewer 
                  userEmail={userEmail} 
                  onClose={handleCloseEmailViewer} 
                />
              )}
              
              {/* Verificación en tiempo real (característica única) */}
              {autoCheckActive && !showEmailViewer && !showEmailPreview && (
                <VerificationStatus 
                  verificationChecks={verificationChecks} 
                  onCheck={() => checkVerification(true)} 
                />
              )}
              
              {/* Botones de acción */}
              <Stack spacing={2} width="100%" sx={{ mt: 2 }}>
                <ActionButton
                  fullWidth
                  variant="contained"
                  onClick={() => checkVerification(true)}
                  startIcon={<CheckCircle />}
                  disabled={loading}
                  sx={{
                    height: 48,
                    fontSize: '1rem',
                    background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                  }}
                >
                  Ya verifiqué mi correo
                </ActionButton>
                
                <ActionButton
                  fullWidth
                  variant="outlined"
                  onClick={handleSendVerification}
                  disabled={(!canResend && emailSent) || loading}
                  startIcon={<Refresh />}
                >
                  {canResend ? 'Reenviar correo' : `Reenviar en ${verificationTimer}s`}
                </ActionButton>
                
                {!showEmailPreview && !showEmailViewer && (
                  <Button
                    fullWidth
                    variant="text"
                    onClick={handleOpenEmailPreview}
                    startIcon={<Visibility />}
                    sx={{
                      textTransform: 'none',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Ver ejemplo del correo
                  </Button>
                )}
              </Stack>
              
              {/* Consejos importantes */}
              <Box
                sx={{
                  width: '100%',
                  p: 2,
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                  border: '1px solid',
                  borderColor: (theme) => alpha(theme.palette.warning.main, 0.2),
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ErrorOutline
                      sx={{
                        color: 'warning.main',
                        fontSize: 20,
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      color="warning.main"
                      fontWeight={600}
                      sx={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      Consejos importantes
                    </Typography>
                  </Stack>
                  
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    • Revisa tu carpeta de spam o correo no deseado
                    <br />
                    • El enlace de verificación expira en 24 horas
                    <br />
                    • Si no recibes el correo, puedes solicitar uno nuevo
                    <br />
                    • Asegúrate de que tu proveedor de correo no esté bloqueando nuestros mensajes
                  </Typography>
                </Stack>
              </Box>
              
              {/* Opción para cambiar correo */}
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                sx={{ mt: 2, fontFamily: '"Inter", sans-serif' }}
              >
                ¿Correo incorrecto?{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={handleSignOut}
                  sx={{
                    fontSize: 'inherit',
                    textTransform: 'none',
                    fontWeight: 500,
                    p: 0,
                    minWidth: 'auto',
                    verticalAlign: 'baseline',
                    color: 'primary.main',
                    fontFamily: '"Inter", sans-serif',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Regístrate con otro correo
                </Button>
              </Typography>
              
              {/* Indicador de seguridad */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  mt: 1,
                }}
              >
                <Security 
                  fontSize="small" 
                  sx={{ 
                    color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    fontSize: '0.875rem',
                  }} 
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  Conexión segura y encriptada
                </Typography>
              </Box>
            </Stack>
          </StyledPaper>
        </motion.div>
      </Container>
      
      {/* Overlay de carga */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingOverlay>
              <CircularProgress 
                size={40} 
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontFamily: '"Inter", sans-serif' }}
              >
                {success ? 'Redirigiendo...' : 'Verificando...'}
              </Typography>
            </LoadingOverlay>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}