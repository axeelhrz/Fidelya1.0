'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Restaurant, LocalBar } from '@mui/icons-material';

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
      transition={{ duration: 1.2, ease: 'easeOut' }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#0A0A0A',
        overflow: 'hidden',
        px: { xs: 3, sm: 4 },
        py: 4
      }}
    >
      {/* Fondo elegante */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(16, 16, 16, 1) 100%)
          `,
          pointerEvents: 'none'
        }}
      />

      {/* Contenido principal */}
      <Stack 
        spacing={{ xs: 6, sm: 8 }}
        alignItems="center" 
        textAlign="center"
        sx={{ 
          maxWidth: 640,
          zIndex: 1,
          position: 'relative'
        }}
      >
        {/* Logo/Icono */}
        <MotionBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.2
          }}
          sx={{
            p: 3,
            borderRadius: 0,
            border: '2px solid #D4AF37',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LocalBar 
            sx={{ 
              fontSize: { xs: 48, sm: 64 },
              color: '#D4AF37',
              filter: 'drop-shadow(0px 0px 20px rgba(212, 175, 55, 0.3))'
            }} 
          />
        </MotionBox>

        {/* Título principal */}
        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.4
          }}
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: '3rem', sm: '4rem', md: '4.5rem' },
            fontWeight: 700,
            letterSpacing: '0.05em',
            lineHeight: 0.9,
            color: '#F8F8F8',
            mb: 2,
            textTransform: 'uppercase'
          }}
        >
          Xs Reset
        </MotionTypography>

        {/* Subtítulo */}
        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.6
          }}
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 500,
            color: '#D4AF37',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            mb: 3,
            opacity: 0.9
          }}
        >
          Bar & Lounge Experience
        </MotionTypography>

        {/* Descripción */}
        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.7
          }}
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 400,
            color: '#B8B8B8',
            lineHeight: 1.6,
            maxWidth: 480,
            mx: 'auto',
            fontStyle: 'italic'
          }}
        >
          Descubre nuestra carta digital premium.
          <br />
          Cocktails exclusivos, gastronomía de autor y ambiente único.
        </MotionTypography>

        {/* Ornamento */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.8
          }}
          sx={{
            width: 120,
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            mx: 'auto',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#D4AF37',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
            }
          }}
        />

        {/* Botón de acción */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 1
          }}
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <MotionButton
            variant="contained"
            size="large"
            onClick={handleViewMenu}
            startIcon={<Restaurant />}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              fontFamily: "'Inter', sans-serif",
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 600,
              borderRadius: 0,
              background: '#D4AF37',
              color: '#0A0A0A',
              border: '1px solid #D4AF37',
              boxShadow: 'none',
              minWidth: { xs: 200, sm: 220 },
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#F4E4BC',
                borderColor: '#F4E4BC',
                boxShadow: '0px 4px 12px rgba(212, 175, 55, 0.3)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Ver Carta Digital
          </MotionButton>
        </MotionBox>

        {/* Información adicional */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 1.2
          }}
          sx={{ textAlign: 'center' }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 400,
              color: '#B8B8B8',
              opacity: 0.7,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            Experiencia Digital Premium
          </Typography>
        </MotionBox>
      </Stack>
    </MotionBox>
  );
}