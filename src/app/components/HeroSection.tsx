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
      transition={{ duration: 1.2, ease: 'easeOut' }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#1C1C1E',
        overflow: 'hidden',
        px: { xs: 3, sm: 4 },
        py: 4
      }}
    >
      {/* Subtle background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main content */}
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
        {/* Logo/Icon */}
        <MotionBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.2
          }}
        >
          <QrCode2 
            sx={{ 
              fontSize: { xs: 64, sm: 80 },
              color: '#3B82F6',
              filter: 'drop-shadow(0px 0px 20px rgba(59, 130, 246, 0.2))'
            }} 
          />
          </MotionBox>

        {/* Main title */}
        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.4
          }}
          sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '4.5rem' },
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            color: '#F5F5F7',
            mb: 2
          }}
        >
          MenuQR
        </MotionTypography>

        {/* Subtitle */}
        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.6
          }}
          sx={{
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            fontWeight: 400,
            color: '#A1A1AA',
            lineHeight: 1.5,
            maxWidth: 480,
            mx: 'auto'
          }}
        >
          Escanea, explora y ordena con un simple toque.
          <br />
          Navegación sin límites, sabores sin fronteras.
        </MotionTypography>

        {/* Action button */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: 'easeOut',
            delay: 0.8
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
            startIcon={<RestaurantMenu />}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 600,
              borderRadius: 2,
              background: '#3B82F6',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: 'none',
              minWidth: { xs: 200, sm: 180 },
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#2563eb',
                boxShadow: 'none',
                transform: 'translateY(-1px)'
}
            }}
          >
            Explorar Menú
          </MotionButton>
        </MotionBox>
      </Stack>
    </MotionBox>
  );
}