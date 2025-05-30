'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  AdminPanelSettings as AdminIcon,
  LocalBar as BarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MotionContainer = motion(Container);
const MotionBox = motion(Box);
const HomePage: React.FC = () => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
      {/* Elemento decorativo sutil */}
                    <Box
                      sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
                      }}
              />

      <MotionContainer
        maxWidth="sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
            textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          }}
        >
        {/* Logo/Icono */}
        <MotionBox variants={itemVariants}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 200 }}
          >
            <Box
            sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 3rem',
                boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
              }}
            >
              <BarIcon sx={{ fontSize: 60, color: 'white' }} />
            </Box>
          </motion.div>
        </MotionBox>

        {/* Título */}
        <MotionBox variants={itemVariants} sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            fontWeight={800}
          sx={{
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.1,
          }}
        >
            MenuQR
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: 400,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Menú digital para tu bar
          </Typography>
        </MotionBox>

        {/* Botones principales */}
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
                onClick={() => router.push('/menu?id=menu-bar')}
                sx={{
                  py: 2.5,
                  px: 6,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  minWidth: 280,
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                  },
                  transition: 'all 0.3s ease',
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
                startIcon={<AdminIcon />}
                onClick={() => router.push('/admin')}
                sx={{
                  py: 2.5,
                  px: 6,
                  borderRadius: 3,
                  borderWidth: 2,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  minWidth: 280,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'text.primary',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Administración
              </Button>
            </motion.div>
          </Stack>
        </MotionBox>

        {/* Footer minimalista */}
        <MotionBox 
          variants={itemVariants}
          sx={{ 
            mt: 8,
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: '0.9rem' }}
          >
            Digitaliza tu bar con códigos QR
          </Typography>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
};

export default HomePage;