'use client';

import { useState, useRef } from 'react';
import { Container, Typography, Box, Tabs, Tab, Button as MuiButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@/components/ui/Button';

// Example video data
const videoCategories = [
  {
    category: 'Todos',
    videos: [
      { id: 1, title: 'Tips de productividad', description: 'Consejos para maximizar tu tiempo diario', thumbnail: '/placeholder-1.jpg', duration: '15s' },
      { id: 2, title: 'Receta rápida', description: 'Pasta al pesto en menos de 10 minutos', thumbnail: '/placeholder-2.jpg', duration: '30s' },
      { id: 3, title: 'Rutina de ejercicios', description: 'Entrenamiento completo en 15 minutos', thumbnail: '/placeholder-3.jpg', duration: '15s' },
      { id: 4, title: 'Reseña de producto', description: 'Lo bueno y lo malo del nuevo iPhone', thumbnail: '/placeholder-4.jpg', duration: '30s' },
      { id: 5, title: 'Tutorial de maquillaje', description: 'Look natural para el día a día', thumbnail: '/placeholder-5.jpg', duration: '30s' },
      { id: 6, title: 'Consejos financieros', description: 'Cómo ahorrar dinero sin esfuerzo', thumbnail: '/placeholder-6.jpg', duration: '15s' },
    ],
  },
  {
    category: 'Informativos',
    videos: [
      { id: 1, title: 'Tips de productividad', description: 'Consejos para maximizar tu tiempo diario', thumbnail: '/placeholder-1.jpg', duration: '15s' },
      { id: 4, title: 'Reseña de producto', description: 'Lo bueno y lo malo del nuevo iPhone', thumbnail: '/placeholder-4.jpg', duration: '30s' },
      { id: 6, title: 'Consejos financieros', description: 'Cómo ahorrar dinero sin esfuerzo', thumbnail: '/placeholder-6.jpg', duration: '15s' },
    ],
  },
  {
    category: 'Entretenimiento',
    videos: [
      { id: 2, title: 'Receta rápida', description: 'Pasta al pesto en menos de 10 minutos', thumbnail: '/placeholder-2.jpg', duration: '30s' },
      { id: 3, title: 'Rutina de ejercicios', description: 'Entrenamiento completo en 15 minutos', thumbnail: '/placeholder-3.jpg', duration: '15s' },
      { id: 5, title: 'Tutorial de maquillaje', description: 'Look natural para el día a día', thumbnail: '/placeholder-5.jpg', duration: '30s' },
    ],
  },
  {
    category: 'Promocionales',
    videos: [
      { id: 4, title: 'Reseña de producto', description: 'Lo bueno y lo malo del nuevo iPhone', thumbnail: '/placeholder-4.jpg', duration: '30s' },
      { id: 6, title: 'Consejos financieros', description: 'Cómo ahorrar dinero sin esfuerzo', thumbnail: '/placeholder-6.jpg', duration: '15s' },
    ],
  },
];

const ExamplesGallery = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handlePlayVideo = (videoId: number) => {
    setActiveVideoId(videoId === activeVideoId ? null : videoId);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="section"
      id="examples"
      sx={{
        py: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0A0A0A',
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
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
                background: 'linear-gradient(90deg, #FF3366 0%, #FFB800 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              Videos Generados por IA
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
              Mira lo que otros usuarios han creado con ReelGenius. Desde tutoriales hasta promociones, la IA puede generar cualquier tipo de contenido.
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
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
                py: 2,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            {videoCategories.map((category, index) => (
              <Tab 
                key={index} 
                label={category.category} 
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {/* Navigation arrows */}
          <MuiButton
            onClick={scrollLeft}
            sx={{
              position: 'absolute',
              left: { xs: -20, md: -30 },
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: 'auto',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              borderRadius: '50%',
              backgroundColor: 'rgba(23, 23, 23, 0.8)',
              color: 'white',
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(30, 215, 96, 0.8)',
              },
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </MuiButton>
          
          <MuiButton
            onClick={scrollRight}
            sx={{
              position: 'absolute',
              right: { xs: -20, md: -30 },
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: 'auto',
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              borderRadius: '50%',
              backgroundColor: 'rgba(23, 23, 23, 0.8)',
              color: 'white',
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(30, 215, 96, 0.8)',
              },
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </MuiButton>

          {/* Videos container */}
          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              pb: 4,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollSnapType: 'x mandatory',
            }}
          >
            <AnimatePresence mode="wait">
              {videoCategories[selectedTab].videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    flex: '0 0 auto',
                    width: '280px',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(23, 23, 23, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          height: 0,
                          paddingTop: '177.77%', // 9:16 aspect ratio for vertical videos
                          backgroundColor: '#0A0A0A',
                          backgroundImage: `url(${video.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                        }}
                      >
                        {/* Play button overlay */}
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
                            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            '&:hover': {
                              opacity: 1,
                              cursor: 'pointer',
                            },
                          }}
                          onClick={() => handlePlayVideo(video.id)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
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
                                boxShadow: '0 10px 30px rgba(255, 51, 102, 0.4)',
                              }}
                            >
                              <PlayArrowIcon sx={{ fontSize: 36, color: 'white' }} />
                            </Box>
                          </motion.div>
                        </Box>
                        
                        {/* Duration badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {video.duration}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {video.description}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: '#1ED760',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                        >
                          AI
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Generado con ReelGenius
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </Box>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            color="primary"
            href="/signup"
            size="large"
          >
            Crear tu propio video
          </Button>
        </Box>
        
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 51, 102, 0.1) 0%, rgba(16, 16, 16, 0) 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(30, 215, 96, 0.1) 0%, rgba(16, 16, 16, 0) 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
      </Container>
    </Box>
  );
};

export default ExamplesGallery;