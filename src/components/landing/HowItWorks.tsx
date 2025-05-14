'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MovieIcon from '@mui/icons-material/Movie';
import ShareIcon from '@mui/icons-material/Share';

const steps = [
  {
    icon: <EditIcon fontSize="large" />,
    title: 'Describe tu idea',
    description: 'Escribe brevemente de qué trata tu video y selecciona el tono y duración.',
    color: '#1ED760',
    delay: 0,
  },
  {
    icon: <AutoFixHighIcon fontSize="large" />,
    title: 'La IA trabaja su magia',
    description: 'Nuestros algoritmos crean el guion, voz, subtítulos y seleccionan la música perfecta.',
    color: '#4A7DFF',
    delay: 0.1,
  },
  {
    icon: <MovieIcon fontSize="large" />,
    title: 'Genera tu video',
    description: 'En segundos, obtendrás un Reel o TikTok profesional listo para impresionar.',
    color: '#FF3366',
    delay: 0.2,
  },
  {
    icon: <ShareIcon fontSize="large" />,
    title: 'Comparte y viraliza',
    description: 'Descarga tu video y publícalo directamente en tus redes sociales favoritas.',
    color: '#FFB800',
    delay: 0.3,
  },
];

const HowItWorks = () => {
  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{
        py: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'rgba(16, 16, 16, 0.5)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
                    height: '100%',
          background: 'linear-gradient(180deg, rgba(16, 16, 16, 0) 0%, rgba(16, 16, 16, 0.8) 100%)',
          zIndex: 0,
                    },
                  }}
                >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
                    >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(90deg, #1ED760 0%, #FF3366 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              Cómo Funciona
                    </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Crear videos virales nunca fue tan fácil. Con ReelGenius, solo necesitas seguir estos simples pasos.
            </Typography>
          </motion.div>
    </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: { xs: 4, md: 2 },
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'stretch' },
            position: 'relative',
            zIndex: 1,
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + step.delay }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <Box
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(23, 23, 23, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    '& .step-number': {
                      opacity: 0.2,
                    },
                    '& .step-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: `linear-gradient(90deg, ${step.color} 0%, rgba(23, 23, 23, 0) 100%)`,
                  },
                }}
              >
                <Typography
                  className="step-number"
                  sx={{
                    position: 'absolute',
                    bottom: '-20px',
                    right: '-10px',
                    fontSize: '120px',
                    fontWeight: 800,
                    opacity: 0.05,
                    color: step.color,
                    transition: 'opacity 0.3s ease',
                    lineHeight: 1,
                  }}
                >
                  {index + 1}
                </Typography>
                
                <Box
                  className="step-icon"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    backgroundColor: `rgba(${step.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.1)`,
                    color: step.color,
                    mb: 3,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {React.cloneElement(step.icon, { style: { fontSize: 40 } })}
                </Box>
                
                <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                  {step.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {step.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
        
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '-5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(30, 215, 96, 0.1) 0%, rgba(16, 16, 16, 0) 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255, 51, 102, 0.1) 0%, rgba(16, 16, 16, 0) 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
      </Container>
    </Box>
  );
};

export default HowItWorks;