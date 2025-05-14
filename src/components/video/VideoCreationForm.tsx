'use client';

import { useState } from 'react';
import { Box, TextField, Typography, MenuItem, FormControl, InputLabel, Select, Slider, Paper } from '@mui/material';
import Button from '@/components/ui/Button';

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
  const [formData, setFormData] = useState({
    prompt: '',
    tone: 'informative',
    duration: 15,
    language: 'es',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Here we would call the API to generate the video
    console.log('Form data submitted:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle success or redirect to results page
    }, 2000);
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
        />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <FormControl fullWidth>
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
          
          <FormControl fullWidth>
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
          
          <FormControl fullWidth>
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
          {loading ? 'Generando...' : 'Generar mi Reel'}
        </Button>
      </Box>
    </Paper>
  );
};

export default VideoCreationForm;