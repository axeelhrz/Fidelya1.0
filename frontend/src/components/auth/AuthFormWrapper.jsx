import React from 'react';
import { Box, Paper, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const AuthFormWrapper = ({ children, title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.95) 50%, 
            rgba(51, 65, 85, 0.95) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ParticleBackground />
      
      {/* Efectos de luz ambiental */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              position: 'relative',
            }}
          >
            {/* Header con logo y branding */}
            <Box
              sx={{
                textAlign: 'center',
                pt: 6,
                pb: 4,
                px: 4,
                background: `
                  linear-gradient(135deg, 
                    rgba(99, 102, 241, 0.05) 0%, 
                    rgba(16, 185, 129, 0.05) 100%
                  )
                `,
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
              }}
            >
              <motion.div variants={logoVariants}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: `
                      linear-gradient(135deg, 
                        rgba(99, 102, 241, 0.1) 0%, 
                        rgba(16, 185, 129, 0.1) 100%
                      )
                    `,
                    border: '2px solid rgba(99, 102, 241, 0.2)',
                    mb: 3,
                    fontSize: '2.5rem',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                  }}
                >
                  🍎
                </Box>
              </motion.div>
              
              <motion.div variants={contentVariants}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, #6366f1)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Frutería Nina
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                >
                  Sistema de Gestión Inteligente
                </Typography>
              </motion.div>
            </Box>

            {/* Contenido del formulario */}
            <Box sx={{ p: 4 }}>
              <motion.div variants={contentVariants}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: 'text.primary',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 400,
                        lineHeight: 1.5,
                      }}
                    >
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {children}
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AuthFormWrapper;