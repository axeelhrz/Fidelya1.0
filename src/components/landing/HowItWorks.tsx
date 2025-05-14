'use client';

import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
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
  },
  {
    icon: <AutoFixHighIcon fontSize="large" />,
    title: 'La IA trabaja su magia',
    description: 'Nuestros algoritmos crean el guion, voz, subtítulos y seleccionan la música perfecta.',
  },
  {
    icon: <MovieIcon fontSize="large" />,
    title: 'Genera tu video',
    description: 'En segundos, obtendrás un Reel o TikTok profesional listo para impresionar.',
  },
  {
    icon: <ShareIcon fontSize="large" />,
    title: 'Comparte y viraliza',
    description: 'Descarga tu video y publícalo directamente en tus redes sociales favoritas.',
  },
];

const HowItWorks = () => {
  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Cómo Funciona
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            Crear videos virales nunca fue tan fácil. Con ReelGenius, solo necesitas seguir estos simples pasos.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: 'background.paper',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(30, 215, 96, 0.1)',
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="h5" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;