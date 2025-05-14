'use client';

import { Container, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, rgba(255, 51, 102, 0.05) 0%, rgba(16, 16, 16, 0) 100%)',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              backgroundColor: 'background.paper',
              boxShadow: '0 20px 80px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Convertí tus ideas en Reels virales ahora
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
              }}
            >
              Únete a miles de creadores que ya están generando contenido viral con ReelGenius. Prueba gratis y comienza a crear videos impactantes hoy mismo.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ minWidth: { xs: '100%', sm: 200 } }}
              >
                Comenzar Gratis
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ minWidth: { xs: '100%', sm: 200 } }}
              >
                Ver Demostración
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;