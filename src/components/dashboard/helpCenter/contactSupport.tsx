import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  SelectChangeEvent,
  Stack,
  useTheme,
  Avatar,
  IconButton,
  Collapse,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  SupportAgent, 
  CloudUpload, 
  Delete,
  CheckCircle,
  Close,
  Email,
  Phone,
  Chat
} from '@mui/icons-material';
import { useHelpCenter } from '@/hooks/use-help-center';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ContactSupport() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const router = useRouter();
  const { createRequest } = useHelpCenter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
  
  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setScreenshot(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!title.trim() || !description.trim() || !category) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await createRequest(title, description, category, screenshot || undefined);
      
      setSuccess(true);
      setTitle('');
      setDescription('');
      setCategory('');
      setScreenshot(null);
      setScreenshotPreview(null);
      
      // Resetear el estado de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.');
      console.error('Error creating support request:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoToHelpCenter = () => {
    router.push('/dashboard/ayuda');
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
            }}
          >
            <Avatar
              sx={{ 
                bgcolor: theme.palette.secondary.main + '20', 
                color: theme.palette.secondary.main,
                mr: 2
              }}
            >
              <SupportAgent />
            </Avatar>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Contactar soporte
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 2 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 3,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ¿Necesitas ayuda? Nuestro equipo de soporte está listo para asistirte. Completa el formulario a continuación o consulta nuestro Centro de Ayuda para soluciones rápidas.
            </Typography>
            
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleGoToHelpCenter}
              sx={{ 
                mb: 3,
                borderRadius: 2,
                py: 1.5,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Visitar Centro de Ayuda
            </Button>
            
            <Divider sx={{ mb: 3 }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  px: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                O contáctanos directamente
              </Typography>
            </Divider>
            
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Email />}
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Email
              </Button>
              <Button
                variant="outlined"
                startIcon={<Phone />}
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Teléfono
              </Button>
              <Button
                variant="outlined"
                startIcon={<Chat />}
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Chat
              </Button>
            </Stack>
            
            <Divider sx={{ mb: 3 }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  px: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Enviar solicitud
              </Typography>
            </Divider>
            
            <Collapse in={!!error}>
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setError(null)}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            </Collapse>
            
            <Collapse in={success}>
              <Alert 
                severity="success" 
                sx={{ mb: 2 }}
                icon={<CheckCircle fontSize="inherit" />}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setSuccess(false)}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>¡Solicitud enviada!</AlertTitle>
                Tu solicitud ha sido enviada correctamente. Te responderemos lo antes posible.
              </Alert>
            </Collapse>
            
            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  onChange={handleCategoryChange}
                  label="Categoría"
                  required
                  sx={{ 
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <MenuItem value="polizas">Pólizas</MenuItem>
                  <MenuItem value="clientes">Clientes</MenuItem>
                  <MenuItem value="suscripcion">Suscripción</MenuItem>
                  <MenuItem value="pagos">Pagos</MenuItem>
                  <MenuItem value="errores">Errores técnicos</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Título del problema"
                value={title}
                onChange={handleTitleChange}
                required
                sx={{ 
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Descripción"
                value={description}
                onChange={handleDescriptionChange}
                required
                multiline
                rows={4}
                sx={{ 
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }
                }}
              />
              {screenshotPreview ? (
                <Box sx={{ mb: 2, position: 'relative', width: '100%', height: 'auto', minHeight: 200 }}>
                  <Image 
                    src={screenshotPreview} 
                    alt="Vista previa"
                    fill
                    style={{ 
                      objectFit: 'contain',
                      borderRadius: 8,
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                    unoptimized // Since we're using a local blob URL
                  />
                  <IconButton
                    onClick={handleRemoveScreenshot}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ 
                    mb: 3,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    textTransform: 'none',
                    borderStyle: 'dashed'
                  }}
                >
                  Adjuntar captura (opcional)
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleScreenshotChange}
                  />
                </Button>
              )}
              
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}