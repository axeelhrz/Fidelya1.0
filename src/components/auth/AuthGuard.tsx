'use client';

import { useEffect, useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [mounted, setMounted] = useState(false);
  const auth = useSafeAuth();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const LoadingComponent = () => (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        Cargando...
      </Typography>
    </Box>
  );

  // Mostrar loading mientras el componente no esté montado
  if (!mounted) {
    return fallback || <LoadingComponent />;
  }

  // Si el contexto de auth no está disponible, mostrar loading
  if (!auth) {
    return fallback || <LoadingComponent />;
  }

  // Si auth está cargando, mostrar loading
  if (auth.loading) {
    return fallback || <LoadingComponent />;
  }

  return <>{children}</>;
}