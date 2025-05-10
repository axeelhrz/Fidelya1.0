'use client';
import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  SupportAgent,
  MenuBook,
  VideoLibrary
} from '@mui/icons-material';

export const AfterCheckoutContent = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const resources = [
    {
      icon: <Lightbulb sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Primeros pasos',
      description: 'Aprende a configurar tu cuenta y comenzar a usar Assuriva',
      link: '#'
    },
    {
      icon: <SupportAgent sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Soporte 24/7',
      description: 'Nuestro equipo está disponible para ayudarte en cualquier momento',
      link: '#'
    },
    {
      icon: <MenuBook sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Documentación',
      description: 'Consulta nuestra guía completa de uso de la plataforma',
      link: '#'
    },
    {
      icon: <VideoLibrary sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Tutoriales',
      description: 'Videos explicativos sobre todas las funcionalidades',
      link: '#'
    }
  ];
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          mb: 3,
          textAlign: 'center'
        }}
      >
        Recursos para comenzar
      </Typography>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ mx: -1 }} // Negative margin to compensate for item padding
        >
          {resources.map((resource, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: '100%', sm: '50%' },
                p: 1 // Padding to create spacing between items
              }}
            >
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isDark
                      ? 'rgba(30, 41, 59, 0.5)'
                      : 'rgba(241, 245, 249, 0.7)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDark
                        ? '0 10px 20px rgba(0, 0, 0, 0.3)'
                        : '0 10px 20px rgba(59, 130, 246, 0.1)',
                    },
                    cursor: 'pointer',
                  }}
                  component="a"
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Stack spacing={1}>
                    <Box>{resource.icon}</Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      {resource.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      {resource.description}
                    </Typography>
                  </Stack>
                </Box>
              </motion.div>
            </Box>
          ))}
        </Stack>
      </motion.div>
    </Box>
  );
};