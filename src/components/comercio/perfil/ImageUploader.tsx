'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  IconButton,
  Paper,
  alpha,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  PhotoCamera,
  Store,
  Delete,
  CloudUpload,
  Image as ImageIcon,
  CheckCircle,
} from '@mui/icons-material';
import { useComercios } from '@/hooks/useComercios';
import toast from 'react-hot-toast';

export const ImageUploader: React.FC = () => {
  const { comercio, uploadImage } = useComercios();
  const [uploading, setUploading] = useState<'logo' | 'portada' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const portadaInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'imagen') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validations
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    const uploadType = type === 'logo' ? 'logo' : 'portada';
    setUploading(uploadType);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await uploadImage(file, type);
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(null);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      setUploading(null);
      setUploadProgress(0);
    }

    // Reset input
    event.target.value = '';
  };

  const triggerFileInput = (type: 'logo' | 'portada') => {
    if (type === 'logo') {
      logoInputRef.current?.click();
    } else {
      portadaInputRef.current?.click();
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        border: '1px solid #e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 150,
          height: 150,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '50%',
          opacity: 0.05,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <CardContent sx={{ p: 6, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900, 
              color: '#0f172a',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <ImageIcon sx={{ fontSize: 32, color: '#10b981' }} />
            Imágenes del Comercio
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
            Sube tu logo y una imagen de portada para que los socios reconozcan fácilmente tu comercio.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {/* Logo Upload */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#374151', 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Store sx={{ fontSize: 20, color: '#10b981' }} />
              Logo del Comercio
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: '2px dashed #d1d5db',
                borderRadius: 4,
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: uploading === 'logo' ? 'not-allowed' : 'pointer',
                '&:hover': {
                  borderColor: uploading === 'logo' ? '#d1d5db' : '#10b981',
                  bgcolor: uploading === 'logo' ? 'transparent' : alpha('#10b981', 0.05),
                },
              }}
              onClick={() => !uploading && triggerFileInput('logo')}
            >
              <Stack spacing={3} alignItems="center">
                <motion.div
                  whileHover={{ scale: uploading === 'logo' ? 1 : 1.05 }}
                  whileTap={{ scale: uploading === 'logo' ? 1 : 0.95 }}
                >
                  <Avatar
                    src={comercio?.logoUrl}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: alpha('#10b981', 0.1),
                      border: '4px solid #f1f5f9',
                      position: 'relative',
                    }}
                  >
                    {!comercio?.logoUrl && <Store sx={{ fontSize: 40, color: '#10b981' }} />}
                  </Avatar>
                </motion.div>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 1 }}>
                    {comercio?.logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                    Tamaño recomendado: 300x300px
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    PNG, JPG hasta 5MB
                  </Typography>
                </Box>

                <AnimatePresence>
                  {uploading === 'logo' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{ width: '100%' }}
                    >
                      <Box sx={{ width: '100%', mb: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={uploadProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: alpha('#10b981', 0.2),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#10b981',
                              borderRadius: 4,
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                        {uploadProgress === 100 ? 'Completado!' : `Subiendo... ${uploadProgress}%`}
                      </Typography>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            boxShadow: '0 6px 25px rgba(16, 185, 129, 0.4)',
                          }
                        }}
                      >
                        {comercio?.logoUrl ? 'Cambiar' : 'Subir'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>

              <input
                ref={logoInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'logo')}
                disabled={!!uploading}
              />
            </Paper>
          </Box>

          {/* Portada Upload */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#374151', 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <ImageIcon sx={{ fontSize: 20, color: '#6366f1' }} />
              Imagen de Portada
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: '2px dashed #d1d5db',
                borderRadius: 4,
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: uploading === 'portada' ? 'not-allowed' : 'pointer',
                '&:hover': {
                  borderColor: uploading === 'portada' ? '#d1d5db' : '#6366f1',
                  bgcolor: uploading === 'portada' ? 'transparent' : alpha('#6366f1', 0.05),
                },
              }}
              onClick={() => !uploading && triggerFileInput('portada')}
            >
              <Stack spacing={3} alignItems="center">
                <motion.div
                  whileHover={{ scale: uploading === 'portada' ? 1 : 1.02 }}
                  whileTap={{ scale: uploading === 'portada' ? 1 : 0.98 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      width: 240,
                      height: 140,
                      bgcolor: alpha('#6366f1', 0.1),
                      border: '4px solid #f1f5f9',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: comercio?.imagenPrincipalUrl ? `url(${comercio.imagenPrincipalUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {!comercio?.imagenPrincipalUrl && (
                      <ImageIcon sx={{ fontSize: 50, color: '#6366f1' }} />
                    )}
                    
                    {comercio?.imagenPrincipalUrl && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          bgcolor: alpha('#000', 0.4),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <PhotoCamera sx={{ fontSize: 30, color: 'white' }} />
                      </Box>
                    )}
                  </Paper>
                </motion.div>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 1 }}>
                    {comercio?.imagenPrincipalUrl ? 'Cambiar Portada' : 'Subir Portada'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                    Tamaño recomendado: 1200x600px
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    PNG, JPG hasta 5MB
                  </Typography>
                </Box>

                <AnimatePresence>
                  {uploading === 'portada' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{ width: '100%' }}
                    >
                      <Box sx={{ width: '100%', mb: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={uploadProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: alpha('#6366f1', 0.2),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#6366f1',
                              borderRadius: 4,
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                        {uploadProgress === 100 ? 'Completado!' : `Subiendo... ${uploadProgress}%`}
                      </Typography>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        sx={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                            boxShadow: '0 6px 25px rgba(99, 102, 241, 0.4)',
                          }
                        }}
                      >
                        {comercio?.imagenPrincipalUrl ? 'Cambiar' : 'Subir'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>

              <input
                ref={portadaInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'imagen')}
                disabled={!!uploading}
              />
            </Paper>
          </Box>
        </Box>

        {/* Tips */}
        <Box sx={{ mt: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: alpha('#06b6d4', 0.05),
              border: '1px solid',
              borderColor: alpha('#06b6d4', 0.2),
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0891b2', mb: 2 }}>
              💡 Consejos para mejores imágenes
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: '#0f766e' }}>
                • <strong>Logo:</strong> Usa un fondo transparente o blanco, con buena resolución
              </Typography>
              <Typography variant="body2" sx={{ color: '#0f766e' }}>
                • <strong>Portada:</strong> Muestra tu local, productos o ambiente para atraer socios
              </Typography>
              <Typography variant="body2" sx={{ color: '#0f766e' }}>
                • <strong>Calidad:</strong> Imágenes nítidas y bien iluminadas generan más confianza
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};
