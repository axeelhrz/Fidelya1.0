'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import MenuViewer from '../components/MenuViewer';
const MotionBox = motion(Box);

const MenuPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  // Obtener el ID del menú desde los parámetros de la URL
  const menuId = searchParams.get('id') || searchParams.get('menuId') || 'default-menu';

  return <MenuViewer menuId={menuId} />;
};
const MenuPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
            px: 3
          }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#D4AF37',
              mb: 3,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              color: '#F8F8F8',
              textAlign: 'center',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              mb: 1,
              fontWeight: 600
            }}
          >
            Cargando Carta Digital...
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              color: '#B8B8B8',
              textAlign: 'center',
              opacity: 0.8,
              fontStyle: 'italic'
            }}
          >
            Conectando con Firebase
          </Typography>
          
          {/* Indicador de carga animado */}
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              gap: 1,
              alignItems: 'center'
            }}
          >
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#D4AF37',
                  animation: `pulse 1.5s infinite ${index * 0.2}s`,
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 0.3,
                      transform: 'scale(1)'
                    },
                    '50%': {
                      opacity: 1,
                      transform: 'scale(1.2)'
                    }
                  }
                }}
              />
            ))}
          </Box>
        </MotionBox>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
};

export default MenuPage;
