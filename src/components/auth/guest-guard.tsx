'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  CircularProgress,
  Box,
  Typography,
  alpha,
  useTheme,
  styled,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { LockOpen } from '@mui/icons-material';

// Componentes estilizados
const LoadingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  gap: theme.spacing(2),
  background: theme.palette.mode === 'dark'
    ? `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha('#0F172A', 0.95)} 100%)`
    : `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
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

const StyledProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
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

// Modificado: Eliminado el tipo de retorno React.ReactNode
export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  
  // Lista de rutas protegidas por GuestGuard
  const guestOnlyRoutes = React.useMemo(() => [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/reset-password'
  ], []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        // Verificar si el usuario está autenticado y está en una ruta solo para invitados
        if (firebaseUser && guestOnlyRoutes.includes(pathname)) {
          // Si el email está verificado, redirigir según el estado de la suscripción
          if (firebaseUser.emailVerified) {
            setRedirecting(true);
            
            // Verificar estado de suscripción
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : null;
            
            // Verificar documento de suscripción
            const subscriptionDoc = await getDoc(doc(db, 'subscriptions', firebaseUser.uid));
            const subscriptionData = subscriptionDoc.exists() ? subscriptionDoc.data() : null;
            
            // Determinar redirección basada en el estado de la suscripción
            if (
              (userData?.subscription?.status === 'active') || 
              (subscriptionData?.status === 'active') ||
              (userData?.subscription?.planId === 'basic' && userData?.subscription?.status !== 'expired')
            ) {
              // Suscripción activa o plan básico no expirado
              router.replace('/dashboard');
            } else {
              // Suscripción pendiente o expirada
              router.replace('/subscribe');
            }
          } else {
            // Email no verificado
            router.replace('/auth/verify-email');
          }
        } else {
          // Usuario no autenticado o en una ruta permitida
          setLoading(false);
        }
      } catch (error) {
        console.error('Error en GuestGuard:', error);
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [router, pathname, guestOnlyRoutes]);
  
  // Pantalla de carga
  if (loading || redirecting) {
    return (
      <LoadingWrapper>
        <ParticlesBackground />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <IconWrapper>
            <LockOpen sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          </IconWrapper>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <StyledProgress size={40} />
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
            {redirecting ? 'Redirigiendo...' : 'Verificando sesión...'}
          </Typography>
        </motion.div>
      </LoadingWrapper>
    );
  }
  
  // Renderizar contenido para invitados
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="guest-content"
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