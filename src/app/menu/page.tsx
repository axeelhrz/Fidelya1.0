'use client';

import { Suspense } from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';
import MenuContent from './MenuContent';

// Componente de loading para Suspense
function MenuLoading() {
  return (
    <Box sx={{ 
        minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
            Cargando menú...
            </Typography>
        </Stack>
            </Box>
  );
}

export default function MenuPage() {
    return (
    <Suspense fallback={<MenuLoading />}>
      <MenuContent />
    </Suspense>
    );
  }
