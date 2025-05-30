'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { RestaurantMenu, QrCode2 } from '@mui/icons-material';
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

export default function HeroSection() {
  const router = useRouter();

  const handleViewMenu = () => {
    router.push('/menu');
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
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #1C1C1E 100%)',
        overflow: 'hidden',
        px: 3,
        py: 4
      }}
    >
      {/* Efecto de fondo sutil */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Contenido principal */}
      <Stack 
        spacing={4} 
        alignItems="center" 
        textAlign="center"
        sx={{ 
          maxWidth: 600, 
          zIndex: 1,
          position: 'relative'
        }}
      >
        {/* Icono principal */}
        <MotionBox
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.2
          }}
        >
          <QrCode2 
            sx={{ 
              fontSize: 80, 
              color: '#3B82F6',
              filter: 'drop-shadow(0px 4px 12px rgba(59, 130, 246, 0.3))'
            }} 
          />
          </MotionBox>

        {/* Título principal */}
        <MotionTypography
          variant="titleLarge"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.4
          }}
          sx={{
            background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            maxWidth: '100%'
          }}
        >
          Experiencia Nocturna Premium
        </MotionTypography>

        {/* Subtítulo */}
        <MotionTypography
          variant="body1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: 0.6
          }}
          sx={{
            color: '#A1A1AA',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            maxWidth: 480,
            textAlign: 'center'
          }}
        >
          Descubre nuestra selección exclusiva de cócteles artesanales y experiencias gastronómicas únicas
        </MotionTypography>

        {/* Botón principal */}
        <MotionButton
          variant="contained"
          size="large"
          onClick={handleViewMenu}
          startIcon={<RestaurantMenu />}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            ease: 'easeOut',
            delay: 0.8
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0px 12px 32px rgba(59, 130, 246, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
            boxShadow: '0px 8px 24px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
}
          }}
        >
          Ver Menú
        </MotionButton>
      </Stack>
    </MotionBox>
  );
}