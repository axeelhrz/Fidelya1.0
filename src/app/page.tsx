'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LocalBar } from '@mui/icons-material';
import { useEffect } from 'react';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

export default function HomePage() {
  const router = useRouter();

  // Prevenir scroll en móviles
  useEffect(() => {
    // Prevenir scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Prevenir zoom en iOS
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  const handleViewMenu = () => {
    // Restaurar scroll antes de navegar
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    router.push('/menu?id=xs-reset-menu');
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      sx={{
        height: '100dvh', // Dynamic viewport height para móviles
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed', // Fijo para evitar scroll
        top: 0,
        left: 0,
          right: 0,
          bottom: 0,
        background: '#0A0A0A',
        overflow: 'hidden',
        px: { xs: 2, sm: 3 },
        zIndex: 1000
        }}
    >
      {/* Fondo minimalista */}
      <Box
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.02) 0%, transparent 60%)
          `,
          pointerEvents: 'none'
        }}
          />

      {/* Contenido principal compacto */}
      <Stack 
        spacing={{ xs: 2, sm: 2.5 }} // Más compacto en móviles
        alignItems="center" 
        textAlign="center"
        sx={{ 
          maxWidth: { xs: 280, sm: 420 }, // Más estrecho en móviles
          zIndex: 1,
          position: 'relative',
          width: '100%'
          }}
        >
        {/* Logo minimalista */}
        <MotionBox
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.1
          }}
          sx={{
            p: { xs: 1.2, sm: 1.5 }, // Más pequeño en móviles
            border: '1px solid rgba(212, 175, 55, 0.3)',
            background: 'rgba(212, 175, 55, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LocalBar 
            sx={{ 
              fontSize: { xs: 20, sm: 28 }, // Más pequeño en móviles
              color: '#D4AF37'
            }} 
          />
        </MotionBox>

        {/* Título compacto */}
        <MotionTypography
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.2
          }}
          sx={{
              fontFamily: "'Inter', sans-serif",
            fontSize: { xs: '1.5rem', sm: '2rem' }, // Más pequeño en móviles
            fontWeight: 700,
            letterSpacing: '0.02em',
            lineHeight: 1,
            color: '#F8F8F8',
            mb: { xs: 0.25, sm: 0.5 } // Menos margen en móviles
            }}
          >
          Xs Reset
        </MotionTypography>

        {/* Subtítulo argentino */}
        <MotionTypography
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.3
          }}
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: { xs: '0.7rem', sm: '0.8rem' }, // Más pequeño en móviles
            fontWeight: 500,
            color: '#D4AF37',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            mb: { xs: 1, sm: 1.5 } // Menos margen en móviles
          }}
        >
          Bar & Resto
        </MotionTypography>

        {/* Descripción argentina minimalista */}
        <MotionTypography
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.4
          }}
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: { xs: '0.8rem', sm: '0.9rem' }, // Más pequeño en móviles
            fontWeight: 400,
            color: '#B8B8B8',
            lineHeight: 1.3, // Más compacto
            maxWidth: { xs: 260, sm: 320 }, // Más estrecho en móviles
            mx: 'auto'
          }}
        >
          Carta digital. Tragos de autor, picadas y buena onda.
        </MotionTypography>

        {/* Línea decorativa minimalista */}
        <MotionBox
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.5
          }}
          sx={{
            width: { xs: 40, sm: 50 }, // Más pequeño en móviles
            height: '1px',
            background: '#D4AF37',
            mx: 'auto'
          }}
        />

        {/* Botón compacto argentino */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.6
          }}
        >
          <MotionButton
            variant="outlined"
            size="medium"
            onClick={handleViewMenu}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              fontFamily: "'Inter', sans-serif",
              px: { xs: 2, sm: 3.5 }, // Más compacto en móviles
              py: { xs: 0.6, sm: 1 }, // Más compacto en móviles
              fontSize: { xs: '0.75rem', sm: '0.85rem' }, // Más pequeño en móviles
              fontWeight: 500,
              background: 'transparent',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              minWidth: { xs: 100, sm: 140 }, // Más pequeño en móviles
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(212, 175, 55, 0.1)',
                borderColor: '#D4AF37',
                transform: 'translateY(-1px)'
}
            }}
          >
            Ver Carta
          </MotionButton>
        </MotionBox>

        {/* Info minimalista */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.8
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: '0.6rem', sm: '0.65rem' }, // Más pequeño en móviles
              fontWeight: 400,
              color: '#B8B8B8',
              opacity: 0.6,
              letterSpacing: '0.05em'
            }}
          >
            Menú Digital
          </Typography>
        </MotionBox>
      </Stack>
    </MotionBox>
  );
}