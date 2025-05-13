'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { CircularProgress, Box } from '@mui/material';

export default function AuthGuard({ 
  children, 
  fallback,
  requiredRoles,
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: string[];
}) {
  const { userData, loading, isAuthenticated, isEmailVerified, activateFreePlan } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAuth = async () => {
    // Si está cargando, esperar
    if (loading) return;

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      router.push('/auth/sign-in');
      return;
    }

    // Si el email no está verificado, redirigir a verificación
    if (!isEmailVerified) {
      router.push('/auth/verify-email');
      return;
    }

    // Verificar si tiene un plan activo
    const hasPlan = userData?.planStatus === 'active';
    
    // Si no tiene un plan activo y no está en la página de suscripción
    if (!hasPlan && !pathname.startsWith('/subscribe') && !pathname.startsWith('/pricing')) {
      // Si el plan es básico, activarlo automáticamente
      if (userData?.plan === 'basic') {
          try {
            const result = await activateFreePlan();
            if (result.success) {
              setIsAuthorized(true);
            setIsChecking(false);
            } else {
      router.push('/pricing');
    }
          } catch (error) {
            console.error('Error al activar plan básico:', error);
            router.push('/pricing');
          }
        return;
      }
        
        // Si no es plan básico, redirigir a suscripción
        router.push('/pricing');
        return;
    }

      // Verificar roles si se requieren
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(userData?.role || '');
        
        if (!hasRequiredRole) {
          router.push('/dashboard');
          return;
        }
      }

    // Si pasa todas las verificaciones, está autorizado
    setIsAuthorized(true);
    setIsChecking(false);
    };

    checkAuth();
  }, [loading, isAuthenticated, isEmailVerified, userData, router, pathname, activateFreePlan, requiredRoles]);

  // Mostrar fallback mientras se verifica la autorización
  if (loading || isChecking) {
    return fallback || (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si está autorizado, mostrar el contenido
  if (isAuthorized) {
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

  // Si no está autorizado y no se está verificando, mostrar fallback
  return fallback || null;
}