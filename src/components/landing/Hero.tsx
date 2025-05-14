'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import Button from '@/components/ui/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Hero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }
    });
  }, [controls]);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    // Logic to play video would go here
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        pt: { xs: '120px', md: '160px' },
        pb: { xs: '80px', md: '120px' },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(180deg, rgba(30, 215, 96, 0.08) 0%, rgba(16, 16, 16, 0) 100%)',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(30, 215, 96, 0.15) 0%, rgba(16, 16, 16, 0) 70%)',
          zIndex: -1,
          borderRadius: '50%',
        }
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 51, 102, 0.15) 0%, rgba(16, 16, 16, 0) 70%)',
          zIndex: -1,
          borderRadius: '50%',
        }}
      />
      
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 6, md: 4 },
          }}
        >
          <Box 
            sx={{ 
              flex: '1', 
              maxWidth: { xs: '100%', md: '50%' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  mb: 2,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Tu idea en un video{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #1ED760 0%, #FF3366 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'linear-gradient(90deg, #1ED760 0%, #FF3366 100%)',
                      borderRadius: '2px',
                    }
                  }}
                >
                  viral
                </Box>
                , en menos de 60 segundos.
              </Typography>

              <Typography
                variant="h2"
                component="p"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem', lg: '1.5rem' },
                  fontWeight: 400,
                  mb: 4,
                  maxWidth: { xs: '100%', md: '90%' },
                  lineHeight: 1.5,
                }}
              >
                Sin editores. Sin excusas. Genera Reels y TikToks automáticamente con IA.
              </Typography>

              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  href="/signup"
                  sx={{ 
                    minWidth: { xs: '100%', sm: 'auto' },
                    py: 1.5,
                    px: 3,
                  }}
                  icon={<ArrowForwardIcon />}
                  iconPosition="end"
                >
                  Probar Gratis
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  href="/#examples"
                  sx={{ 
                    minWidth: { xs: '100%', sm: 'auto' },
                    py: 1.5,
                    px: 3,
                  }}
                >
                  Ver Ejemplos
                </Button>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4,
                  mt: 4,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    color: 'primary.main',
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: 'primary.main',
                      display: 'inline-block',
                    }} 
                  />
                  <Typography variant="body2" fontWeight={500}>
                    Sin tarjeta de crédito
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    color: 'primary.main',
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: 'primary.main',
                      display: 'inline-block',
                    }} 
                  />
                  <Typography variant="body2" fontWeight={500}>
                    Cancelación en cualquier momento
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>

          <Box 
            sx={{ 
              flex: '1', 
              maxWidth: { xs: '100%', md: '50%' },
              position: 'relative',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.6, 0.05, -0.01, 0.9] }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '400px', sm: '450px', md: '500px', lg: '550px' },
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 80px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)',
                    zIndex: 1,
                    opacity: isVideoPlaying ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                  },
                }}
              >
                {/* Video placeholder with play button */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0A0A0A',
                    backgroundImage: 'url(/video-placeholder.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {!isVideoPlaying && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        zIndex: 2,
                        cursor: 'pointer',
                      }}
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Box
                        sx={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 51, 102, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 10px 30px rgba(255, 51, 102, 0.4)',
                        }}
                      >
                        <PlayArrowIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Box>
                    </motion.div>
                  )}
                  
                  {isVideoPlaying && (
                    <Box
                      component="video"
                      autoPlay
                      controls
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onEnded={() => setIsVideoPlaying(false)}
                    >
                      <source src="/demo-video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </Box>
                  )}
                </Box>
                
                {/* Video info overlay */}
                {!isVideoPlaying && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '24px',
                      zIndex: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Ejemplo: "5 consejos para aumentar tu productividad"
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Generado en 45 segundos • 15s de duración
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '140px',
                  height: '140px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(30, 215, 96, 0.2) 0%, rgba(30, 215, 96, 0) 60%)',
                  zIndex: -1,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.2) 0%, rgba(255, 51, 102, 0) 60%)',
                  zIndex: -1,
                }}
              />
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;