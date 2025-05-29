'use client';

import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionStack = motion(Stack);

export default function HeroSection() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
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
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      }}
    >
      {/* Elementos decorativos de fondo con blur */}
      <MotionBox
        variants={floatingVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <MotionBox
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <MotionBox
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '4s' }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '20%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
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
            px: { xs: 3, sm: 4 },
          }}
        >
          <MotionTypography
            variant="titleLarge"
            variants={itemVariants}
            sx={{
              mb: 3,
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              background: 'linear-gradient(135deg, #3B82F6 0%, #60a5fa 50%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
            }}
          >
            MenuQR
          </MotionTypography>

          <MotionTypography
            variant="h5"
            color="text.secondary"
            variants={itemVariants}
            sx={{ 
              mb: 8, 
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            Experiencia gastronómica digital de alto nivel. 
            Diseño premium, navegación intuitiva, sabores excepcionales.
          </MotionTypography>

          <MotionStack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={4}
            justifyContent="center"
            alignItems="center"
            variants={itemVariants}
            sx={{ mt: 6 }}
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
                  py: 2,
                  px: 5,
                  fontSize: '1.1rem',
                  minWidth: { xs: '280px', sm: 'auto' },
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                  },
                }}
              >
                Explorar Menú
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
                  py: 2,
                  px: 5,
                  fontSize: '1.1rem',
                  minWidth: { xs: '280px', sm: 'auto' },
                  borderColor: '#3B82F6',
                  color: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#2563eb',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
                  },
                }}
              >
                Panel Admin
              </Button>
            </motion.div>
          </MotionStack>

          <MotionBox
            variants={itemVariants}
            sx={{ 
              mt: 16,
              opacity: 0.4,
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.8rem',
                color: 'text.secondary',
                letterSpacing: '0.1em',
              }}
            >
              POWERED BY ASSURIVA
            </Typography>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
}