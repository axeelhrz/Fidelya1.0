'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LocalBar } from '@mui/icons-material';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

export default function HomePage() {
  const router = useRouter();

  const handleViewMenu = () => {
    router.push('/menu?id=xs-reset-menu');
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#0A0A0A',
        overflow: 'hidden',
        px: { xs: 2, sm: 3 },
        py: 3
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
        spacing={{ xs: 3, sm: 4 }}
        alignItems="center" 
        textAlign="center"
        sx={{ 
          maxWidth: 480,
          zIndex: 1,
          position: 'relative'
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
            p: 2,
            border: '1px solid rgba(212, 175, 55, 0.3)',
            background: 'rgba(212, 175, 55, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LocalBar 
            sx={{ 
              fontSize: { xs: 28, sm: 32 },
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
            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontWeight: 700,
            letterSpacing: '0.02em',
            lineHeight: 1,
            color: '#F8F8F8',
            mb: 1
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
            fontSize: { xs: '0.8rem', sm: '0.85rem' },
            fontWeight: 500,
            color: '#D4AF37',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            mb: 2
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
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 400,
            color: '#B8B8B8',
            lineHeight: 1.5,
            maxWidth: 360,
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
            width: 60,
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
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.25 },
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              fontWeight: 500,
              background: 'transparent',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              minWidth: { xs: 140, sm: 160 },
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
              fontSize: '0.7rem',
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