'use client';

import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Componentes con motion
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionStack = motion(Stack);

export default function HeroSection() {
  const router = useRouter();

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)',
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '15%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            textAlign: 'center',
            px: { xs: 2, sm: 4 },
          }}
        >
          <MotionTypography
            variant="titleLarge"
            variants={itemVariants}
            sx={{
              mb: 2,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #3B82F6 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 10px 30px rgba(59, 130, 246, 0.15)',
            }}
          >
            MenuQR
          </MotionTypography>

          <MotionTypography
            variant="h4"
            color="text.secondary"
            variants={itemVariants}
            sx={{ 
              mb: 6, 
              fontWeight: 500,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.4,
            }}
          >
            Una experiencia gastronómica digital de alto nivel
          </MotionTypography>

          <MotionStack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            variants={itemVariants}
            sx={{ mt: 4 }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<RestaurantMenuIcon />}
                onClick={() => router.push('/menu')}
                sx={{
                  py: 1.8,
                  px: 4,
                  fontSize: '1rem',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  },
                }}
              >
                Ver Menú
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outlined"
                size="large"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => router.push('/admin')}
                sx={{
                  py: 1.8,
                  px: 4,
                  fontSize: '1rem',
                  borderWidth: '1.5px',
                  borderColor: 'primary.main',
                }}
              >
                Administración
              </Button>
            </motion.div>
          </MotionStack>

          <MotionBox
            variants={itemVariants}
            sx={{ 
              mt: 12,
              opacity: 0.6,
              fontSize: '0.75rem',
              color: 'text.secondary',
            }}
          >
            <Typography variant="caption">
              Potenciado por Assuriva
            </Typography>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
}