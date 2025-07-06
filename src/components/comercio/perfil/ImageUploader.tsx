'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  Paper,
  alpha,
  LinearProgress,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  PhotoCamera,
  Store,
  CloudUpload,
  Image as ImageIcon,
  Delete,
  Edit,
  Visibility,
  DragIndicator,
  CheckCircle,
  ErrorOutline,
} from '@mui/icons-material';
import { useComercios } from '@/hooks/useComercios';
import toast from 'react-hot-toast';

interface ImageUploadState {
  uploading: boolean;
  progress: number;
  preview: string | null;
  error: string | null;
}

export const ImageUploader: React.FC = () => {
  const { comercio, uploadImage } = useComercios();
  const [logoState, setLogoState] = useState<ImageUploadState>({
    uploading: false,
    progress: 0,
    preview: null,
    error: null
  });
  const [portadaState, setPortadaState] = useState<ImageUploadState>({
    uploading: false,
    progress: 0,
    preview: null,
    error: null
  });
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const portadaInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<'logo' | 'portada' | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Por favor selecciona un archivo de imagen válido';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'La imagen debe ser menor a 5MB';
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Solo se permiten archivos JPG, PNG o WebP';
    }
    return null;
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const simulateProgress = (setState: React.Dispatch<React.SetStateAction<ImageUploadState>>) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 90) {
        clearInterval(interval);
        progress = 90;
      }
      setState(prev => ({ ...prev, progress }));
    }, 200);
    return interval;
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'imagen') => {
    const setState = type === 'logo' ? setLogoState : setPortadaState;
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      toast.error(validationError);
      return;
    }

    // Create preview
    const preview = await createPreview(file);
    
    setState(prev => ({ 
      ...prev, 
      uploading: true, 
      progress: 0, 
      preview, 
      error: null 
    }));

    // Simulate progress
    const progressInterval = simulateProgress(setState);

    try {
      const downloadURL = await uploadImage(file, type);
      
      if (downloadURL) {
        clearInterval(progressInterval);
        setState(prev => ({ 
          ...prev, 
          progress: 100, 
          uploading: false,
          preview: null 
        }));
        
        // Reset after success animation
        setTimeout(() => {
          setState(prev => ({ ...prev, progress: 0 }));
        }, 2000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      const errorMessage = error instanceof Error ? error.message : 'Error al subir la imagen';
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        progress: 0, 
        error: errorMessage,
        preview: null 
      }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'imagen') => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
    event.target.value = '';
  };

  const handleDrop = useCallback((event: React.DragEvent, type: 'logo' | 'imagen') => {
    event.preventDefault();
    setDragOver(null);
    
    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile, type);
    } else {
      toast.error('Por favor arrastra un archivo de imagen');
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent, type: 'logo' | 'portada') => {
    event.preventDefault();
    setDragOver(type);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(null);
  }, []);

  const triggerFileInput = (type: 'logo' | 'portada') => {
    if (type === 'logo' && !logoState.uploading) {
      logoInputRef.current?.click();
    } else if (type === 'portada' && !portadaState.uploading) {
      portadaInputRef.current?.click();
    }
  };

  const ImageUploadCard: React.FC<{
    type: 'logo' | 'portada';
    state: ImageUploadState;
    currentImage?: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    aspectRatio: string;
    size: { width: number; height: number };
  }> = ({ type, state, currentImage, title, subtitle, icon, color, aspectRatio, size }) => {
    const isDragging = dragOver === type;
    const hasImage = currentImage || state.preview;
    const isUploading = state.uploading;

    return (
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
          {icon}
          {title}
        </Typography>
        
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: `2px dashed ${isDragging ? color : '#d1d5db'}`,
            borderRadius: 4,
            textAlign: 'center',
            position: 'relative',
            transition: 'all 0.3s ease',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            bgcolor: isDragging ? alpha(color, 0.05) : 'transparent',
            '&:hover': {
              borderColor: isUploading ? '#d1d5db' : color,
              bgcolor: isUploading ? 'transparent' : alpha(color, 0.05),
            },
          }}
          onClick={() => !isUploading && triggerFileInput(type)}
          onDrop={(e) => handleDrop(e, type === 'logo' ? 'logo' : 'imagen')}
          onDragOver={(e) => handleDragOver(e, type)}
          onDragLeave={handleDragLeave}
        >
          <Stack spacing={3} alignItems="center">
            {/* Image Preview */}
            <motion.div
              whileHover={{ scale: isUploading ? 1 : 1.02 }}
              whileTap={{ scale: isUploading ? 1 : 0.98 }}
            >
              {type === 'logo' ? (
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={state.preview || currentImage}
                    sx={{
                      width: size.width,
                      height: size.height,
                      bgcolor: alpha(color, 0.1),
                      border: '4px solid #f1f5f9',
                      position: 'relative',
                    }}
                  >
                    {!hasImage && <Store sx={{ fontSize: 40, color }} />}
                  </Avatar>
                  
                  {hasImage && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: alpha('#000', 0.4),
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <Edit sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                  )}
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    width: size.width,
                    height: size.height,
                    bgcolor: alpha(color, 0.1),
                    border: '4px solid #f1f5f9',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: hasImage ? `url(${state.preview || currentImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {!hasImage && <ImageIcon sx={{ fontSize: 50, color }} />}
                  
                  {hasImage && (
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
                      <Edit sx={{ fontSize: 30, color: 'white' }} />
                    </Box>
                  )}
                </Paper>
              )}
            </motion.div>

            {/* Upload Info */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 1 }}>
                {hasImage ? `Cambiar ${title}` : `Subir ${title}`}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                {subtitle}
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip
                  label="PNG, JPG, WebP"
                  size="small"
                  sx={{ bgcolor: alpha(color, 0.1), color }}
                />
                <Chip
                  label="Máx. 5MB"
                  size="small"
                  sx={{ bgcolor: alpha(color, 0.1), color }}
                />
              </Stack>
            </Box>

            {/* Upload State */}
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ width: '100%' }}
                >
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={state.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(color, 0.2),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: color,
                          borderRadius: 4,
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
                    {state.progress === 100 ? 'Completado!' : `Subiendo... ${Math.round(state.progress)}%`}
                  </Typography>
                </motion.div>
              ) : state.error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ color: '#ef4444' }}>
                    <ErrorOutline fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Error al subir
                    </Typography>
                  </Stack>
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    {isDragging ? (
                      <Chip
                        icon={<DragIndicator />}
                        label="Suelta aquí"
                        sx={{
                          bgcolor: alpha(color, 0.2),
                          color,
                          fontWeight: 600,
                        }}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        sx={{
                          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                          boxShadow: `0 4px 20px ${alpha(color, 0.3)}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${color}dd 0%, ${color}bb 100%)`,
                            boxShadow: `0 6px 25px ${alpha(color, 0.4)}`,
                          }
                        }}
                      >
                        {hasImage ? 'Cambiar' : 'Subir'}
                      </Button>
                    )}
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag & Drop Hint */}
            {!isUploading && (
              <Typography variant="caption" sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                O arrastra y suelta una imagen aquí
              </Typography>
            )}
          </Stack>

          {/* Hidden file inputs */}
          <input
            ref={type === 'logo' ? logoInputRef : portadaInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleFileSelect(e, type === 'logo' ? 'logo' : 'imagen')}
            disabled={isUploading}
          />
        </Paper>

        {/* Image Actions */}
        {hasImage && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
              <Tooltip title="Ver imagen completa">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(currentImage || state.preview || '', '_blank');
                  }}
                  sx={{
                    bgcolor: alpha('#06b6d4', 0.1),
                    color: '#06b6d4',
                    '&:hover': { bgcolor: alpha('#06b6d4', 0.2) }
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </motion.div>
        )}
      </Box>
    );
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
          <ImageUploadCard
            type="logo"
            state={logoState}
            currentImage={comercio?.logoUrl}
            title="Logo del Comercio"
            subtitle="Tamaño recomendado: 300x300px"
            icon={<Store sx={{ fontSize: 20, color: '#10b981' }} />}
            color="#10b981"
            aspectRatio="1:1"
            size={{ width: 120, height: 120 }}
          />

          {/* Portada Upload */}
          <ImageUploadCard
            type="portada"
            state={portadaState}
            currentImage={comercio?.imagenPrincipalUrl}
            title="Imagen de Portada"
            subtitle="Tamaño recomendado: 1200x600px"
            icon={<ImageIcon sx={{ fontSize: 20, color: '#6366f1' }} />}
            color="#6366f1"
            aspectRatio="2:1"
            size={{ width: 240, height: 140 }}
          />
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
              <Typography variant="body2" sx={{ color: '#0f766e' }}>
                • <strong>Formatos:</strong> PNG para logos con transparencia, JPG para fotos
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};