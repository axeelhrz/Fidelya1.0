'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Creamos componentes con motion
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionStack = motion(Stack);

export default function HeroSection() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 3, sm: 4, md: 6 },
        background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 100%)',
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        sx={{
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <MotionTypography
          variant="h1"
          color="primary"
          sx={{ mb: 2, fontWeight: 800 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          MenuQR
        </MotionTypography>

        <MotionTypography
          variant="h4"
          color="text.secondary"
          sx={{ mb: 4, fontWeight: 500 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          Escaneá. Mirá. Pedí. Así de simple.
        </MotionTypography>

        <MotionStack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 6 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<RestaurantMenuIcon />}
              onClick={() => router.push('/menu')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Ver Menú
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => router.push('/admin')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Ingresar como Admin
            </Button>
          </motion.div>
        </MotionStack>
      </MotionBox>
    </Box>
  );
}