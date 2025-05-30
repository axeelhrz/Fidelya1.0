'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import MenuViewer from '../components/MenuViewer';

const MenuPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const menuId = searchParams.get('id');

  if (!menuId) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ px: 2 }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          ID de menú no proporcionado
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Por favor, escanea un código QR válido o proporciona un ID de menú en la URL.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Ejemplo: /menu?id=menu-principal
        </Typography>
      </Box>
    );
  }

  return <MenuViewer menuId={menuId} />;
};

const MenuPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Cargando menú...
          </Typography>
        </Box>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
};

export default MenuPage;
