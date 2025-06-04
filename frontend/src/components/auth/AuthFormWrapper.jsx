import React from 'react';
import { Box, Paper, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const AuthFormWrapper = ({ children, title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // Gradiente específico del diseño
        background: 'linear-gradient(135deg, #c1fba4 0%, #ffe5b4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: '1200px' }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: '18px', // Especificado en el diseño
            overflow: 'hidden',
            minHeight: isMobile ? 'auto' : '600px',
            boxShadow: 'rgba(0,0,0,0.1) 0px 4px 20px', // Especificado en el diseño
          }}
        >
          <Grid container sx={{ minHeight: isMobile ? 'auto' : '600px' }}>
            {/* Lado izquierdo - Imagen decorativa */}
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <motion.div
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Box
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(45deg, #62a83d 0%, #8bc34a 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decoración de fondo */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
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
                        background: 'rgba(255, 255, 255, 0.1)',
                      }}
                    />
                    
                    {/* Contenido principal */}
                    <Box sx={{ textAlign: 'center', zIndex: 1 }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                      >
                        <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
                          🍎 Frutería Nina
                      </Typography>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                      Sistema de Gestión Contable
                    </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 300 }}>
                          Gestiona tu negocio de manera eficiente con nuestro sistema 
                          diseñado especialmente para fruterías
                        </Typography>
      </motion.div>
    </Box>
                  </Box>
                </motion.div>
              </Grid>
            )}

            {/* Lado derecho - Formulario */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: { xs: 3, sm: 4, md: 6 },
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Header móvil */}
                {isMobile && (
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ mb: 1, color: 'primary.main' }}>
                      🍎 Frutería Nina
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sistema de Gestión Contable
                    </Typography>
                  </Box>
                )}

                {/* Título del formulario */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="body1" color="text.secondary">
                      {subtitle}
                    </Typography>
                  )}
                </Box>

                {/* Contenido del formulario */}
                {children}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AuthFormWrapper;