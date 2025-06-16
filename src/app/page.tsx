'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, loading, authStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (authStatus === 'authenticated' && user) {
        // Redirigir al dashboard si está autenticado
        router.push('/dashboard');
      } else {
        // Redirigir al login si no está autenticado
        router.push('/auth/sign-in');
      }
    }
  }, [authStatus, user, loading, router]);

  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        Cargando aplicación...
      </Typography>
    </Box>
  );
}