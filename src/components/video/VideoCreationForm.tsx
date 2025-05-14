'use client';

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Paper, 
  Alert, 
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip
} from '@mui/material';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { VideoGenerationParams } from '@/types/video';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MovieIcon from '@mui/icons-material/Movie';

const toneOptions = [
  { value: 'funny', label: 'Divertido' },
  { value: 'informative', label: 'Informativo' },
  { value: 'promotional', label: 'Promocional' },
  { value: 'emotional', label: 'Emocional' },
  { value: 'educational', label: 'Educativo' },
  { value: 'inspirational', label: 'Inspirador' },
];

const durationOptions = [
  { value: 10, label: '10 segundos' },
  { value: 15, label: '15 segundos' },
  { value: 30, label: '30 segundos' },
  { value: 60, label: '60 segundos' },
];

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
];

const VideoCreationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<VideoGenerationParams>({
    prompt: '',
    tone: 'informative',
    duration: 15,
    language: 'es',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState({
    script: false,
    video: false,
    audio: false,
    final: false,
  });

  const steps = [
    'Generando guión',
    'Creando video',
    'Generando audio',
    'Finalizando'
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | 
    { target: { name?: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const simulateProgress = () => {
    // This function simulates the progress of video generation
    // In a real implementation, you would get updates from the backend
    setTimeout(() => {
      setActiveStep(0);
      setGenerationProgress(prev => ({ ...prev, script: true }));
      
      setTimeout(() => {
        setActiveStep(1);
        setGenerationProgress(prev => ({ ...prev, video: true }));
        
        setTimeout(() => {
          setActiveStep(2);
          setGenerationProgress(prev => ({ ...prev, audio: true }));
          
          setTimeout(() => {
            setActiveStep(3);
            setGenerationProgress(prev => ({ ...prev, final: true }));
            
            setTimeout(() => {
              setSuccess(true);
              setTimeout(() => {
        router.push('/dashboard?tab=1'); // Switch to "My Videos" tab
    }, 2000);
            }, 1000);
          }, 3000);
        }, 5000);
      }, 3000);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setGenerationProgress({
      script: false,
      video: false,
      audio: false,
      final: false,
    });
    
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video');
      }
      
      // In a real implementation, you would get the video data from the response
      // and update the UI accordingly
      simulateProgress();
      
    } catch (error: unknown) {
      setLoading(false);
      setError(error instanceof Error ? error.message : 'An error occurred while generating the video');
    }
};

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <AutoAwesomeIcon />;
      case 1:
        return <SmartDisplayIcon />;
      case 2:
        return <RecordVoiceOverIcon />;
      case 3:
        return <MovieIcon />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
        Crea tu video con IA
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ¡Video generado con éxito! Redirigiendo a tu galería...
        </Alert>
      )}
      
      {loading && (
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={
                (index === 0 && generationProgress.script) ||
                (index === 1 && generationProgress.video) ||
                (index === 2 && generationProgress.audio) ||
                (index === 3 && generationProgress.final)
              }>
                <StepLabel StepIconComponent={() => (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: activeStep === index ? 'primary.main' : 
                      ((index === 0 && generationProgress.script) ||
                      (index === 1 && generationProgress.video) ||
                      (index === 2 && generationProgress.audio) ||
                      (index === 3 && generationProgress.final)) ? 'success.main' : 'divider',
                    color: 'white',
                  }}>
                    {getStepIcon(index)}
                  </Box>
                )}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column',
            mt: 4,
            p: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            borderRadius: 2,
          }}>
            <CircularProgress size={48} color="primary" sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {steps[activeStep]}...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {activeStep === 0 && "Nuestra IA está creando un guión perfecto para tu video..."}
              {activeStep === 1 && "Generando imágenes y animaciones para tu video..."}
              {activeStep === 2 && "Creando una narración natural y expresiva..."}
              {activeStep === 3 && "Combinando todo para crear tu video final..."}
            </Typography>
          </Box>
        </Box>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label="Potenciado por IA" 
            color="primary" 
            size="small" 
            icon={<AutoAwesomeIcon />} 
            sx={{ mb: 2 }} 
          />
          <Typography variant="body2" color="text.secondary">
            Describe tu idea y nuestra IA creará un video profesional personalizado. Cuanto más detallada sea tu descripción, mejor será el resultado.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <TextField
          label="Contá de qué trata tu video"
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
          placeholder="Ej: Un tutorial rápido sobre cómo hacer un café latte en casa con ingredientes simples. Mostrar los pasos clave y el resultado final."
          InputLabelProps={{ shrink: true }}
          disabled={loading}
          helperText="Sé específico con los detalles que quieres incluir en el video"
        />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="tone-label">Tono</InputLabel>
            <Select
              labelId="tone-label"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              label="Tono"
            >
              {toneOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="duration-label">Duración</InputLabel>
            <Select
              labelId="duration-label"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              label="Duración"
            >
              {durationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="language-label">Idioma</InputLabel>
            <Select
              labelId="language-label"
              name="language"
              value={formData.language}
              onChange={handleChange}
              label="Idioma"
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          disabled={loading || !formData.prompt}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Generando...
            </Box>
          ) : (
            'Generar mi Reel'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default VideoCreationForm;