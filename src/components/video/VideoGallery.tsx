'use client';

import { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, IconButton, Menu, MenuItem } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for user videos
const mockVideos = [
  { id: 1, title: 'Tips de productividad', thumbnail: '/placeholder-1.jpg', duration: '15s', createdAt: '2023-10-15' },
  { id: 2, title: 'Receta rápida', thumbnail: '/placeholder-2.jpg', duration: '30s', createdAt: '2023-10-14' },
  { id: 3, title: 'Rutina de ejercicios', thumbnail: '/placeholder-3.jpg', duration: '15s', createdAt: '2023-10-12' },
  { id: 4, title: 'Reseña de producto', thumbnail: '/placeholder-4.jpg', duration: '30s', createdAt: '2023-10-10' },
];

const VideoGallery = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, videoId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedVideoId(videoId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVideoId(null);
  };

  const handleDownload = () => {
    console.log(`Downloading video ${selectedVideoId}`);
    handleMenuClose();
  };

  const handleShare = () => {
    console.log(`Sharing video ${selectedVideoId}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log(`Deleting video ${selectedVideoId}`);
    handleMenuClose();
  };

  return (
    <Box>
      {mockVideos.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No has creado ningún video todavía
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {mockVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
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
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}
                  >
                    <IconButton
                      aria-label="more"
                      onClick={(e) => handleMenuOpen(e, video.id)}
                      sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Creado el {video.createdAt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#171717',
            color: 'white',
          },
        }}
      >
        <MenuItem onClick={handleDownload}>
          <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
          Descargar
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <ShareIcon sx={{ mr: 1 }} fontSize="small" />
          Compartir
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#FF3366' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default VideoGallery;