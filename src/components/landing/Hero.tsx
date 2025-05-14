'use client';

import { Container, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const Hero = () => {
  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 12, md: 16 },
        pb: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, rgba(30, 215, 96, 0.05) 0%, rgba(16, 16, 16, 0) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 2,
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
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 400,
                  mb: 4,
                  maxWidth: '90%',
                }}
              >
                Sin editores. Sin excusas. Genera Reels y TikToks automáticamente con IA.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ minWidth: { xs: '100%', sm: 200 } }}
                >
                  Probar Gratis
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ minWidth: { xs: '100%', sm: 200 } }}
                >
                  Ver Ejemplos
                </Button>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '300px', sm: '400px', md: '500px' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 80px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Placeholder for video preview */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#171717',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="h6" component="div">
                    Video Preview
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;