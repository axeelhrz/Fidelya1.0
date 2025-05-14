'use client';

import { useState } from 'react';
import { Box, TextField, Typography, MenuItem, FormControl, InputLabel, Select, Paper, Alert, CircularProgress } from '@mui/material';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

const toneOptions = [
  { value: 'funny', label: 'Divertido' },
  { value: 'informative', label: 'Informativo' },
  { value: 'promotional', label: 'Promocional' },
  { value: 'emotional', label: 'Emocional' },
];

const durationOptions = [
  { value: 10, label: '10 segundos' },
  { value: 15, label: '15 segundos' },
  { value: 30, label: '30 segundos' },
];

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
];

const VideoCreationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    prompt: '',
    tone: 'informative',
    duration: 15,
    language: 'es',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
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
      
      setSuccess(true);
      
      // Redirect to the video page or refresh the gallery
    setTimeout(() => {
        router.push('/dashboard?tab=1'); // Switch to "My Videos" tab
    }, 2000);
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred while generating the video');
    } finally {
      setLoading(false);
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
        Crea tu video
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
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Contá de qué trata tu video"
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
          placeholder="Ej: Un tutorial rápido sobre cómo hacer un café latte en casa con ingredientes simples."
          InputLabelProps={{ shrink: true }}
          disabled={loading}
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