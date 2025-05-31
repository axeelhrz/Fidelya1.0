import React from 'react';
import { Box, Grid, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const AuthFormWrapper = ({ children, title, subtitle, showImage = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
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
            borderRadius: 4,
            overflow: 'hidden',
            minHeight: isMobile ? 'auto' : '600px',
          }}
        >
          <Grid container sx={{ minHeight: isMobile ? 'auto' : '600px' }}>
            {/* Lado izquierdo - Imagen decorativa */}
            {showImage && !isMobile && (
              <Grid item xs={12} md={6}>
                <motion.div
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ height: '100%' }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decoración de frutas */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />
                    
                    {/* Contenido principal */}
                    <Box sx={{ textAlign: 'center', zIndex: 1, px: 4 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          fontSize: { xs: '2rem', md: '3rem' },
                        }}
                      >
                        🍎 Frutería Nina
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 400,
                          lineHeight: 1.6,
                        }}
                      >
                        Sistema de gestión contable
                        <br />
                        Fresco, natural y organizado
                      </Typography>
                    </Box>

                    {/* Elementos decorativos */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -30,
                        left: -30,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            )}

            {/* Lado derecho - Formulario */}
            <Grid item xs={12} md={showImage && !isMobile ? 6 : 12}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: { xs: 3, md: 6 },
                  maxWidth: 480,
                  mx: 'auto',
                }}
              >
                {/* Header del formulario */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  {isMobile && (
                    <Typography
                      variant="h4"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      🍎 Frutería Nina
                    </Typography>
                  )}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
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