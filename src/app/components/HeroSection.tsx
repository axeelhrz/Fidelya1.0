'use client';

import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import QrCodeIcon from '@mui/icons-material/QrCode';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
      <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 200 }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
                }}
              >
                <LocalBarIcon sx={{ fontSize: 50, color: 'white' }} />
              </Box>
            </motion.div>
          </MotionBox>
            
          {/* Título */}
          <MotionTypography
            variant="h2"
            variants={itemVariants}
            sx={{
              mb: 2,
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
              background: 'linear-gradient(135deg, #3B82F6 0%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
                }}
              >
            MenuQR
          </MotionTypography>

          {/* Subtítulo */}
          <MotionTypography
            variant="h6"
            color="text.secondary"
            variants={itemVariants}
            sx={{ 
              mb: 6, 
              fontWeight: 400,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              lineHeight: 1.5,
            }}
          >
            Menú digital para tu bar
          </MotionTypography>
          {/* Botones */}
          <MotionBox variants={itemVariants}>
            <Stack spacing={3} alignItems="center">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<QrCodeIcon />}
                  onClick={() => router.push('/menu')}
                  sx={{
                    py: 2.5,
                    px: 6,
                    fontSize: '1.2rem',
                    minWidth: 280,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
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
                    py: 2.5,
                    px: 6,
                    fontSize: '1.1rem',
                    minWidth: 280,
                    borderRadius: 3,
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'text.primary',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 600,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Administración
                </Button>
              </motion.div>
            </Stack>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
}