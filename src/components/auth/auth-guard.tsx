'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Typography, alpha, useTheme, styled, Button, Alert, Stack, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CreditCard, ErrorOutline, VerifiedUser, AccountCircle } from '@mui/icons-material';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { useSubscription } from '@/hooks/use-subscription';

// Tipos
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: string[];
}

// Componentes estilizados
const LoadingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  gap: theme.spacing(2),
  background: theme.palette.mode === 'dark'
    ? `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha('#0F172A', 0.95)} 100%)`
    : `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
}));

const IconWrapper = styled(motion.div)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
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
}));

// Componente de partículas animadas para el fondo
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
      {[...Array(30)].map((_, index) => (
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

// Componente principal AuthGuard
export default function AuthGuard({ 
  children, 
  fallback,
  requiredRoles = [] 
}: AuthGuardProps): React.ReactNode {
  const { user, userData, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectReason, setRedirectReason] = useState<{
    type: 'auth' | 'email' | 'subscription' | 'profile' | 'plan' | 'role' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = useMemo(() => [
    '/',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/reset-password',
    '/auth/verify-email',
    '/pricing',
    '/subscribe',
    '/contact',
    '/terminos',
    '/privacidad',
    '/sobre-nosotros',
    '/caracteristicas',
    '/seguridad',
    '/ayuda',
    '/blog',
    '/cookies',
    '/licencias',
    '/estado',
    '/actualizaciones'
  ], []);
  
  // Verificar acceso del usuario
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Si la ruta es pública, permitir acceso
        if (publicRoutes.includes(pathname)) {
          setLoading(false);
          return;
        }
        
        // Verificar autenticación
        if (authLoading || profileLoading || subscriptionLoading) {
          return; // Esperar a que carguen todos los datos
        }
        
        // Si no está autenticado, redirigir a login
        if (!user) {
          setRedirectReason({
            type: 'auth',
            message: 'Debes iniciar sesión para acceder a esta página'
          });
          setTimeout(() => router.push('/auth/sign-in'), 1500);
          return;
        }
        
        // Verificar email
        if (!user.emailVerified) {
          setRedirectReason({
            type: 'email',
            message: 'Debes verificar tu correo electrónico para continuar'
          });
          setTimeout(() => router.push('/auth/verify-email'), 1500);
          return;
        }
        
        // Verificar suscripción
        if (!subscription) {
          setRedirectReason({
            type: 'plan',
            message: 'Debes seleccionar un plan para acceder a esta página'
          });
          setTimeout(() => router.push('/pricing'), 1500);
          return;
        }
        
        // Verificar estado de la suscripción
        if (subscription.status !== 'active' && !subscription.trialEnd) {
          // Si es plan pro o enterprise y no está activo
          if (subscription.planId === 'pro' || subscription.planId === 'enterprise') {
            setRedirectReason({
              type: 'subscription',
              message: 'Tu suscripción está pendiente de activación o ha expirado'
            });
            setTimeout(() => router.push('/subscribe'), 1500);
            return;
          }
          
          // Si es plan básico pero no está activo
          if (subscription.planId === 'basic') {
            setRedirectReason({
              type: 'subscription',
              message: 'Tu plan básico no está activo'
            });
            setTimeout(() => router.push('/pricing'), 1500);
            return;
          }
        }
        
        // Verificar perfil
        if (!profile && !profileLoading) {
          setRedirectReason({
            type: 'profile',
            message: 'Tu perfil no está configurado correctamente'
          });
          setTimeout(() => router.push('/dashboard/profile'), 1500);
          return;
        }
        
        // Verificar roles si se requieren
        if (requiredRoles.length > 0) {
          const userRole = userData?.role || '';
          if (!requiredRoles.includes(userRole)) {
            setRedirectReason({
              type: 'role',
              message: 'No tienes permisos para acceder a esta página'
            });
            setTimeout(() => router.push('/dashboard'), 1500);
            return;
          }
        }
        
        // Si todo está bien, permitir acceso
        setLoading(false);
      } catch (err) {
        console.error('Error al verificar acceso:', err);
        setError('Error al verificar tu acceso. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };
    
    checkAccess();
  }, [
    authLoading, 
    profileLoading, 
    subscriptionLoading, 
    user, 
    userData, 
    profile, 
    subscription, 
    pathname, 
    publicRoutes, 
    router,
    requiredRoles
  ]);
  
  // Renderizar componente de carga personalizado si se proporciona
  if ((authLoading || loading) && fallback) {
    return fallback;
  }
  
  // Pantalla de carga predeterminada
  if (authLoading || loading) {
    return (
      <LoadingWrapper>
        <ParticlesBackground />
        
        <IconWrapper
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Shield sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        </IconWrapper>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderTop: `3px solid ${theme.palette.primary.main}`,
                }}
              />
            </motion.div>
          </Box>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 2,
              textAlign: 'center',
              maxWidth: 300,
              mx: 'auto',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Verificando acceso...
          </Typography>
        </motion.div>
      </LoadingWrapper>
    );
  }
  
  // Pantalla de error
  if (error) {
    return (
      <LoadingWrapper>
        <ParticlesBackground />
        
        <StyledPaper>
          <Stack spacing={3} alignItems="center">
            <IconWrapper
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ErrorOutline sx={{ fontSize: 32, color: theme.palette.error.main }} />
            </IconWrapper>
            
            <Typography
              variant="h5"
              component="h1"
              textAlign="center"
              sx={{
                fontWeight: 700,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
              }}
            >
              Error de verificación
            </Typography>
            
            <Alert
              severity="error"
              sx={{
                width: '100%',
                borderRadius: 2,
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              {error}
            </Alert>
            
            <ActionButton
              variant="contained"
              fullWidth
              onClick={() => window.location.reload()}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
              }}
            >
              Intentar de nuevo
            </ActionButton>
          </Stack>
        </StyledPaper>
      </LoadingWrapper>
    );
  }
  
  // Pantalla de redirección
  if (redirectReason.type) {
    const getRedirectContent = () => {
      switch (redirectReason.type) {
        case 'auth':
          return {
            icon: <Shield sx={{ fontSize: 32, color: theme.palette.warning.main }} />,
            title: 'Autenticación requerida',
            buttonText: 'Iniciar sesión',
            buttonAction: () => router.push('/auth/sign-in')
          };
        case 'email':
          return {
            icon: <VerifiedUser sx={{ fontSize: 32, color: theme.palette.info.main }} />,
            title: 'Verificación de email pendiente',
            buttonText: 'Verificar email',
            buttonAction: () => router.push('/auth/verify-email')
          };
        case 'subscription':
          return {
            icon: <CreditCard sx={{ fontSize: 32, color: theme.palette.warning.main }} />,
            title: 'Suscripción requerida',
            buttonText: 'Completar suscripción',
            buttonAction: () => router.push('/subscribe')
          };
        case 'plan':
          return {
            icon: <CreditCard sx={{ fontSize: 32, color: theme.palette.info.main }} />,
            title: 'Plan no seleccionado',
            buttonText: 'Ver planes disponibles',
            buttonAction: () => router.push('/pricing')
          };
        case 'profile':
          return {
            icon: <AccountCircle sx={{ fontSize: 32, color: theme.palette.info.main }} />,
            title: 'Perfil incompleto',
            buttonText: 'Completar perfil',
            buttonAction: () => router.push('/dashboard/profile')
          };
        case 'role':
          return {
            icon: <Shield sx={{ fontSize: 32, color: theme.palette.error.main }} />,
            title: 'Acceso restringido',
            buttonText: 'Volver al dashboard',
            buttonAction: () => router.push('/dashboard')
          };
        default:
          return {
            icon: <ErrorOutline sx={{ fontSize: 32, color: theme.palette.error.main }} />,
            title: 'Error de acceso',
            buttonText: 'Volver al inicio',
            buttonAction: () => router.push('/')
          };
      }
    };
    
    const content = getRedirectContent();
    
    return (
      <LoadingWrapper>
        <ParticlesBackground />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper>
            <Stack spacing={3} alignItems="center">
              <IconWrapper
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {content.icon}
              </IconWrapper>
              
              <Typography
                variant="h5"
                component="h1"
                textAlign="center"
                sx={{
                  fontWeight: 700,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {content.title}
              </Typography>
              
              <Alert
                severity={redirectReason.type === 'role' ? 'error' : 'info'}
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {redirectReason.message}
                </Typography>
                
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ fontFamily: '"Inter", sans-serif', mt: 0.5 }}
                >
                  Serás redirigido automáticamente en unos segundos...
                </Typography>
              </Alert>
              
              <ActionButton
                variant="contained"
                fullWidth
                onClick={content.buttonAction}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                }}
              >
                {content.buttonText}
              </ActionButton>
            </Stack>
          </StyledPaper>
        </motion.div>
      </LoadingWrapper>
    );
  }
  
  // Renderizar contenido para usuario autenticado con suscripción activa o rutas públicas
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}