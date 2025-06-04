import React from 'react';
import { Box, Paper, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const AuthFormWrapper = ({ children, title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const leftPanelVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const rightPanelVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.5
      }
    }
  };

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.3, 0.7, 0.3],
        y: [0, -20, 0],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 4 + i,
        repeat: Infinity,
        delay: i * 0.5
      }}
      style={{
        position: 'absolute',
        width: 20 + i * 5,
        height: 20 + i * 5,
        borderRadius: '50%',
        background: `linear-gradient(45deg, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40)`,
        top: `${10 + i * 15}%`,
        right: `${5 + i * 10}%`,
        zIndex: 0,
        filter: 'blur(1px)'
      }}
    />
  ));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)
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
      
      {/* Efectos de fondo adicionales */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(600px circle at 50% 50%, rgba(16, 185, 129, 0.1), transparent 40%),
            conic-gradient(from 180deg at 50% 50%, rgba(139, 92, 246, 0.1) 0deg, transparent 60deg, rgba(16, 185, 129, 0.1) 120deg, transparent 180deg)
          `,
          animation: 'rotate 20s linear infinite',
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: '1200px', zIndex: 1 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            minHeight: isMobile ? 'auto' : '700px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            position: 'relative',
          }}
        >
          <Grid container sx={{ minHeight: isMobile ? 'auto' : '700px' }}>
            {/* Panel izquierdo - Branding futurista */}
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <motion.div
                  variants={leftPanelVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Box
                    sx={{
                      height: '100%',
                      background: `
                        linear-gradient(135deg, 
                          rgba(16, 185, 129, 0.9) 0%, 
                          rgba(139, 92, 246, 0.8) 50%,
                          rgba(16, 185, 129, 0.9) 100%
                        )
                      `,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Elementos flotantes */}
                    {floatingElements}

                    {/* Patrón de fondo */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                          radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
                        `,
                        opacity: 0.6,
                      }}
                    />
                    
                    {/* Contenido principal */}
                    <Box sx={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: 0.8, 
                          duration: 0.8, 
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: '4rem',
                            mb: 2,
                            background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                          }}
                        >
                          🍎
                        </Box>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                      >
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            mb: 2, 
                            fontWeight: 800,
                            background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          }}
                        >
                          Frutería Nina
                        </Typography>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 4, 
                            opacity: 0.95,
                            fontWeight: 500,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          }}
                        >
                          Sistema de Gestión Inteligente
                        </Typography>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.6 }}
                      >
                        <Box
                          sx={{
                            maxWidth: 350,
                            mx: 'auto',
                            p: 3,
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              opacity: 0.9,
                              lineHeight: 1.6,
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                          >
                            Revoluciona la gestión de tu frutería con tecnología de vanguardia. 
                            Control total, análisis inteligente y crecimiento sostenible.
                          </Typography>
                        </Box>
                      </motion.div>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            )}

            {/* Panel derecho - Formulario */}
            <Grid item xs={12} md={6}>
              <motion.div
                variants={rightPanelVariants}
                initial="hidden"
                animate="visible"
              >
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: { xs: 4, sm: 5, md: 6 },
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                  }}
                >
                  {/* Header móvil */}
                  {isMobile && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ fontSize: '3rem', mb: 1 }}>🍎</Box>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 1, 
                            color: 'primary.main',
                            fontWeight: 700,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          Frutería Nina
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sistema de Gestión Inteligente
                        </Typography>
                      </Box>
                    </motion.div>
                  )}

                  {/* Título del formulario */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Box sx={{ mb: 4 }}>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          mb: 1, 
                          fontWeight: 700, 
                          color: 'text.primary',
                          background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {title}
                      </Typography>
                      {subtitle && (
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ fontWeight: 400 }}
                        >
                          {subtitle}
                        </Typography>
                      )}
                    </Box>
                  </motion.div>

                  {/* Contenido del formulario */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    {children}
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AuthFormWrapper;