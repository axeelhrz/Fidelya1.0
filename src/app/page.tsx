'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import NoSSR from '@/components/common/NoSSR';

function HomePageContent() {
  const { user, loading, authStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (authStatus === 'authenticated' && user) {
        // Redirigir al dashboard si está autenticado
        router.push('/dashboard');
      } else if (authStatus === 'unauthenticated') {
        // Redirigir al login si no está autenticado
        router.push('/auth/sign-in');
      }
    }
  }, [authStatus, user, loading, router]);

  return (
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
        Cargando aplicación...
      </Typography>
    </Box>
  );
}

export default function HomePage() {
  return (
    <NoSSR
      fallback={
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: '16px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 2s linear infinite',
          }} />
          <p style={{ color: '#666', margin: 0 }}>Cargando aplicación...</p>
        </div>
      }
    >
      <HomePageContent />
    </NoSSR>
  );
}