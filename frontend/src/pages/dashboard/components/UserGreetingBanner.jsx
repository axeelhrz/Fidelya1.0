import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { WavingHand, Store } from '@mui/icons-material';

const UserGreetingBanner = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
          color: 'white',
          p: 4,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          mb: 3
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            opacity: 0.1,
            transform: 'rotate(15deg)'
          }}
        >
          <Store sx={{ fontSize: 120 }} />
        </Box>
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WavingHand sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {getGreeting()}, {user?.nombre}
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Bienvenido al sistema de gestión de Frutería Nina
          </Typography>
          
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
            Hoy es {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default UserGreetingBanner;