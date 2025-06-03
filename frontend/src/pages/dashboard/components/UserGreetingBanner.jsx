import React from 'react';
import { Box, Typography, Paper, useTheme, alpha, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  WavingHand, 
  Store, 
  TrendingUp, 
  Schedule,
  Brightness1
} from '@mui/icons-material';
const UserGreetingBanner = ({ user }) => {
  const theme = useTheme();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 18) return '☀️';
    return '🌙';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.primary.dark} 50%,
            ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          mb: 4,
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Elementos decorativos de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#ffffff', 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#ffffff', 0.05)} 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />

        {/* Icono flotante */}
        <motion.div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1,
          }}
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Store sx={{ fontSize: 40, opacity: 0.3 }} />
        </motion.div>
        
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: 2,
            mb: 2 
          }}>
            {/* Avatar del usuario */}
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: alpha('#ffffff', 0.2),
                fontSize: '1.5rem',
                fontWeight: 600,
                border: `2px solid ${alpha('#ffffff', 0.3)}`,
              }}
            >
              {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,0.8) 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}>
                  {getGreeting()}, {user?.nombre}
                </Typography>
                <motion.span
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  style={{ fontSize: '1.5rem' }}
                >
                  {getGreetingIcon()}
                </motion.span>
              </Box>
              
              <Typography variant="h6" sx={{ 
                opacity: 0.9, 
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.125rem' }
              }}>
                Bienvenido al sistema de gestión de Frutería Nina
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: 2,
            mt: 3
          }}>
            <Chip
              icon={<Schedule />}
              label={formatDate()}
              sx={{
                backgroundColor: alpha('#ffffff', 0.15),
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-icon': { color: 'white' },
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
              }}
            />
            
            <Chip
              icon={<TrendingUp />}
              label="Sistema activo"
              sx={{
                backgroundColor: alpha('#ffffff', 0.15),
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-icon': { color: 'white' },
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
              }}
            />

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              ml: 'auto',
              opacity: 0.8
            }}>
              <Brightness1 sx={{ fontSize: 8, color: '#4ade80' }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                En línea
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default UserGreetingBanner;