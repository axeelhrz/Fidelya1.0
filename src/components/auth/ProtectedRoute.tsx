'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireEmailVerification?: boolean;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [],
  requireEmailVerification = false,
  fallbackPath = '/auth/sign-in'
}: ProtectedRouteProps) {
  const { user, loading, authStatus } = useAuth();
  const { hasAnyRole } = useRole();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    // No autenticado
    if (authStatus === 'unauthenticated') {
      router.push(fallbackPath);
      return;
    }

    // Usuario autenticado pero sin datos completos
    if (authStatus === 'authenticated' && !user) {
      router.push('/auth/complete-profile');
      return;
    }

    // Verificar email si es requerido
    if (requireEmailVerification && user && !user.emailVerified) {
      router.push('/auth/verify-email');
      return;
    }

    // Verificar roles si son requeridos
    if (requiredRoles.length > 0 && user && !hasAnyRole(requiredRoles)) {
      router.push('/unauthorized');
      return;
    }

    // Usuario inactivo
    if (user && !user.isActive) {
      router.push('/account-suspended');
      return;
    }

  }, [mounted, authStatus, user, loading, router, hasAnyRole, requiredRoles, requireEmailVerification, fallbackPath]);

  // No renderizar nada hasta que el componente esté montado
  if (!mounted) {
    return null;
  }

  // Mostrar loading mientras se verifica la autenticación
  if (loading || authStatus === 'loading') {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        gap={2}
        sx={{
          background: 'linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%)',
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // No mostrar contenido hasta que la autenticación esté completa
  if (authStatus !== 'authenticated' || !user) {
    return null;
  }

  return <>{children}</>;
}