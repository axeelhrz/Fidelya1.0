'use client';

import { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Example video data
const videoCategories = [
  {
    category: 'Todos',
    videos: [
      { id: 1, title: 'Tips de productividad', thumbnail: '/placeholder-1.jpg', duration: '15s' },
      { id: 2, title: 'Receta rápida', thumbnail: '/placeholder-2.jpg', duration: '30s' },
      { id: 3, title: 'Rutina de ejercicios', thumbnail: '/placeholder-3.jpg', duration: '15s' },
      { id: 4, title: 'Reseña de producto', thumbnail: '/placeholder-4.jpg', duration: '30s' },
      { id: 5, title: 'Tutorial de maquillaje', thumbnail: '/placeholder-5.jpg', duration: '30s' },
      { id: 6, title: 'Consejos financieros', thumbnail: '/placeholder-6.jpg', duration: '15s' },
    ],
  },
  {
    category: 'Informativos',
    videos: [
      { id: 1, title: 'Tips de productividad', thumbnail: '/placeholder-1.jpg', duration: '15s' },
      { id: 4, title: 'Reseña de producto', thumbnail: '/placeholder-4.jpg', duration: '30s' },
      { id: 6, title: 'Consejos financieros', thumbnail: '/placeholder-6.jpg', duration: '15s' },
    ],
  },
  {
    category: 'Entretenimiento',
    videos: [
      { id: 2, title: 'Receta rápida', thumbnail: '/placeholder-2.jpg', duration: '30s' },
      { id: 3, title: 'Rutina de ejercicios', thumbnail: '/placeholder-3.jpg', duration: '15s' },
      { id: 5, title: 'Tutorial de maquillaje', thumbnail: '/placeholder-5.jpg', duration: '30s' },
    ],
  },
  {
    category: 'Promocionales',
    videos: [
      { id: 4, title: 'Reseña de producto', thumbnail: '/placeholder-4.jpg', duration: '30s' },
      { id: 6, title: 'Consejos financieros', thumbnail: '/placeholder-6.jpg', duration: '15s' },
    ],
  },
];

const ExamplesGallery = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      component="section"
      id="examples"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Videos Generados por IA
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
            Mira lo que otros usuarios han creado con ReelGenius. Desde tutoriales hasta promociones, la IA puede generar cualquier tipo de contenido.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                minWidth: 'auto',
                px: 3,
              },
            }}
          >
            {videoCategories.map((category, index) => (
              <Tab key={index} label={category.category} />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {videoCategories[selectedTab].videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: '#171717',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 0,
                        paddingTop: '177.77%', // 9:16 aspect ratio for vertical videos
                        backgroundColor: '#0A0A0A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Video Thumbnail
                      </Typography>
                    </CardMedia>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        '&:hover': {
                          opacity: 1,
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 51, 102, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PlayArrowIcon sx={{ fontSize: 36, color: 'white' }} />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      {video.duration}
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      {video.title}
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

export default ExamplesGallery;