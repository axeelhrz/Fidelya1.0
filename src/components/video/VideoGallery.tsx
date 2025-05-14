'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, Skeleton, Dialog, DialogContent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Button from '@/components/ui/Button';
import { useVideo } from '@/context/VideoContext';

// Mock data was removed as it's not being used

const VideoGallery = () => {
  const { videos, deleteVideo, isGenerating } = useVideo();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, videoId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedVideoId(videoId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVideoId(null);
  };

  const handleDownload = () => {
    console.log(`Descargando video ${selectedVideoId}`);
    // Aquí iría la lógica para descargar el video
    handleMenuClose();
  };

  const handleShare = () => {
    console.log(`Compartiendo video ${selectedVideoId}`);
    // Aquí iría la lógica para compartir el video
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedVideoId) {
      deleteVideo(selectedVideoId);
    }
    handleMenuClose();
  };

  const handleVideoHover = (videoId: string | null) => {
    setHoveredVideoId(videoId);
  };

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  // Encontrar el video que se está reproduciendo
  const currentPlayingVideo = videos.find(video => video.id === playingVideo);

  // Renderizar esqueletos de carga
  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, index) => (
      <Box 
        key={`skeleton-${index}`}
        sx={{
          flex: '1 1 300px',
          maxWidth: '350px',
          minWidth: '280px',
        }}
      >
        <Box
          sx={{
            height: '100%',
            backgroundColor: 'rgba(23, 23, 23, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Skeleton 
            variant="rectangular" 
            height={500} 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: 'none',
            }} 
          />
          <Box sx={{ p: 3 }}>
            <Skeleton 
              variant="text" 
              width="70%" 
              height={32} 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transform: 'none',
              }} 
            />
            <Skeleton 
              variant="text" 
              width="100%" 
              height={20} 
              sx={{ 
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transform: 'none',
              }} 
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Skeleton 
                variant="text" 
                width="40%" 
                height={16} 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  transform: 'none',
                }} 
              />
              <Skeleton 
                variant="text" 
                width="30%" 
                height={16} 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  transform: 'none',
                }} 
              />
            </Box>
          </Box>
        </Box>
      </Box>
    ));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Mis Videos
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          href="/dashboard?tab=0"
          icon={<AddIcon />}
        >
          Crear Nuevo
        </Button>
      </Box>

      {isGenerating && (
        <Box 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3, 
            backgroundColor: 'rgba(30, 215, 96, 0.1)', 
            border: '1px solid rgba(30, 215, 96, 0.3)'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <AutoAwesomeIcon sx={{ mr: 1 }} /> 
            Generando nuevo video...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tu video se está generando y aparecerá automáticamente en esta galería cuando esté listo.
          </Typography>
        </Box>
      )}

      {isGenerating ? (
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          {renderSkeletons()}
        </Box>
      ) : videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: 'rgba(23, 23, 23, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              No has creado ningún video todavía
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              href="/dashboard?tab=0"
              icon={<AddIcon />}
            >
              Crear Mi Primer Video
            </Button>
          </Box>
        </motion.div>
      ) : (
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <AnimatePresence>
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                style={{
                  flex: '1 1 300px',
                  maxWidth: '350px',
                  minWidth: '280px',
                }}
                onMouseEnter={() => handleVideoHover(video.id)}
                onMouseLeave={() => handleVideoHover(null)}
              >
                <Box
                  sx={{
                    height: '100%',
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
                  <Box 
                    sx={{ 
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                    onClick={() => handlePlayVideo(video.id)}
                  >
                    <Box
                      sx={{
                        height: 0,
                        paddingTop: '177.77%', // Relación de aspecto 9:16 para videos verticales
                        backgroundColor: '#0A0A0A',
                        backgroundImage: `url(${video.thumbnailUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                      }}
                    />
                    
                    {/* Superposición del botón de reproducción */}
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
                        opacity: hoveredVideoId === video.id ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
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
                    
                    {/* Etiqueta de duración */}
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
                      {video.duration}s
                    </Box>
                    
                    {/* Botón de menú */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        opacity: hoveredVideoId === video.id ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      <IconButton
                        aria-label="more"
                        onClick={(e) => handleMenuOpen(e, video.id)}
                        sx={{ 
                          color: 'white', 
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          backdropFilter: 'blur(4px)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          },
                        }}
                        size="small"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {video.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Creado el {video.createdAt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {video.views} visualizaciones
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* Diálogo para reproducir el video */}
      <Dialog
        open={playingVideo !== null}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#0A0A0A',
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleCloseVideo}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ p: 0 }}>
            {currentPlayingVideo && (
              <Box>
                <video
                  src={currentPlayingVideo.videoUrl}
                  controls
                  autoPlay
                  style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {currentPlayingVideo.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {currentPlayingVideo.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Creado el {currentPlayingVideo.createdAt} • {currentPlayingVideo.views} visualizaciones
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Box>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#171717',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: '#171717',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={handleDownload}
          sx={{ 
            gap: 1.5,
            py: 1.5,
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
          }}
        >
          <DownloadIcon fontSize="small" />
          Descargar
        </MenuItem>
        <MenuItem 
          onClick={handleShare}
          sx={{ 
            gap: 1.5,
            py: 1.5,
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
          }}
        >
          <ShareIcon fontSize="small" />
          Compartir
        </MenuItem>
        <MenuItem 
          onClick={handleDelete} 
          sx={{ 
            color: '#FF3366',
            gap: 1.5,
            py: 1.5,
            '&:hover': { bgcolor: 'rgba(255, 51, 102, 0.05)' },
          }}
        >
          <DeleteIcon fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default VideoGallery;