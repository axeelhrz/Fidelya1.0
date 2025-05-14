import { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
  Stack,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  VideoLibrary,
  PlayArrow,
  Close,
  Policy,
  People,
  CreditCard,
  Settings,
  Description
} from '@mui/icons-material';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  tags: string[];
}

// Datos de tutoriales para demostración
const tutorialsData: Tutorial[] = [
  {
    id: '1',
    title: 'Cómo crear y gestionar pólizas',
    description: 'Aprende a crear, editar y gestionar pólizas de forma eficiente.',
    thumbnailUrl: 'https://via.placeholder.com/300x169',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 420, // 7 minutos
    tags: ['polizas', 'basico']
  },
  {
    id: '2',
    title: 'Gestión avanzada de clientes',
    description: 'Descubre todas las funcionalidades para gestionar tu cartera de clientes.',
    thumbnailUrl: 'https://via.placeholder.com/300x169',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 540, // 9 minutos
    tags: ['clientes', 'avanzado']
  },
  {
    id: '3',
    title: 'Configuración de pagos y facturación',
    description: 'Aprende a configurar los pagos y la facturación de manera efectiva.',
    thumbnailUrl: 'https://via.placeholder.com/300x169',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 360, // 6 minutos
    tags: ['pagos', 'facturacion', 'intermedio']
  }
];

export default function TutorialsSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  
  const handleOpenTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
  };
  
  const handleCloseTutorial = () => {
    setSelectedTutorial(null);
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'polizas':
        return <Policy fontSize="small" />;
      case 'clientes':
        return <People fontSize="small" />;
      case 'pagos':
      case 'facturacion':
        return <CreditCard fontSize="small" />;
      case 'configuracion':
        return <Settings fontSize="small" />;
      default:
        return <Description fontSize="small" />;
    }
  };
  
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'polizas':
        return theme.palette.primary.main;
      case 'clientes':
        return theme.palette.info.main;
      case 'pagos':
      case 'facturacion':
        return theme.palette.warning.main;
      case 'configuracion':
        return theme.palette.success.main;
      case 'basico':
        return theme.palette.success.light;
      case 'intermedio':
        return theme.palette.warning.light;
      case 'avanzado':
        return theme.palette.error.light;
      default:
        return theme.palette.secondary.main;
    }
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <VideoLibrary sx={{ mr: 1.5, color: theme.palette.warning.main }} />
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            fontFamily: "'Sora', sans-serif",
            flexGrow: 1
          }}
        >
          Tutoriales en video
        </Typography>
        
        <Button
          variant="text"
          size="small"
          sx={{ 
            color: theme.palette.warning.main,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Ver todos
        </Button>
      </Box>
      
      {/* Reemplazamos Grid por Box con display flex y flexWrap */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          '& > *': {
            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }
          }
        }}
      >
        {tutorialsData.map((tutorial) => (
          <Box key={tutorial.id} sx={{ flex: '1 1 auto', minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card
                elevation={0}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                  background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: isDark 
                      ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                      : '0 8px 24px rgba(0, 0, 0, 0.1)',
                    borderColor: theme.palette.warning.main,
                  }
                }}
                onClick={() => handleOpenTutorial(tutorial)}
              >
                  <Box sx={{ position: 'relative', width: '100%', height: '169px' }}>
                    <Image 
                      src={tutorial.thumbnailUrl} 
                      alt={tutorial.title}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                      style={{ 
                        objectFit: 'cover',
                        display: 'block'
                      }} 
                    />
                    <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.3)',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      '&:hover': {
                        opacity: 1
                      }
                    }}
                  >
                    <IconButton
                      sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: theme.palette.warning.main,
                        }
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 40 }} />
                    </IconButton>
                  </Box>
                  <Chip
                    label={formatDuration(tutorial.duration)}
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      mb: 1,
                      fontWeight: 600,
                      fontFamily: "'Sora', sans-serif",
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {tutorial.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {tutorial.description}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {tutorial.tags.map((tag: string) => (
                      <Chip
                        key={tag}
                        icon={getTagIcon(tag)}
                        label={tag}
                        size="small"
                        sx={{ 
                          my: 0.5,
                          bgcolor: `${getTagColor(tag)}10`,
                          color: getTagColor(tag),
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        ))}
      </Box>
      
      <Dialog
        open={!!selectedTutorial}
        onClose={handleCloseTutorial}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: isDark ? 'rgba(25, 25, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        {selectedTutorial && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
              p: 2
            }}>
              {selectedTutorial.title}
              <IconButton onClick={handleCloseTutorial} size="small">
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src={selectedTutorial.videoUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedTutorial.title}
                />
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 2,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {selectedTutorial.description}
                </Typography>
                
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedTutorial.tags.map((tag: string) => (
                    <Chip
                      key={tag}
                      icon={getTagIcon(tag)}
                      label={tag}
                      size="small"
                      sx={{ 
                        my: 0.5,
                        bgcolor: `${getTagColor(tag)}10`,
                        color: getTagColor(tag),
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}