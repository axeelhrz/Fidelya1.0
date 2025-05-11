'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { AuthProvider } from '@/context/auth-context';

// Importar el componente de forma dinámica para evitar problemas de SSR
const SettingsPage = dynamic(
  () => import('@/components/dashboard/settings/settingPage'),
  {
    loading: () => (
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '50vh'
        }}>
          <CircularProgress size={40} />
          <Typography variant="h6" sx={{ mt: 2, fontFamily: 'Sora' }}>
            Cargando configuración...
          </Typography>
        </Box>
      </Container>
    ),
    ssr: false // Deshabilitar SSR para este componente
  }
);

export default function ConfiguracionPage() {
  return (
    <AuthProvider>
      <SettingsPage />
    </AuthProvider>
  );
}