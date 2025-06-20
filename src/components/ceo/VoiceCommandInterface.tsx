'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  alpha,
  LinearProgress,
} from '@mui/material';
import {
  Close,
  Mic,
  VolumeUp,
  Search,
  FilterList,
  GetApp,
  Navigation,
  Psychology,
  TrendingUp,
  People,
  Assessment,
} from '@mui/icons-material';

interface VoiceCommandInterfaceProps {
  open: boolean;
  onClose: () => void;
}

interface VoiceCommand {
  command: string;
  description: string;
  example: string;
  icon: React.ReactNode;
  category: 'navigation' | 'search' | 'analysis' | 'export';
}

export default function VoiceCommandInterface({ open, onClose }: VoiceCommandInterfaceProps) {
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const voiceCommands: VoiceCommand[] = [
    {
      command: "Mostrar pacientes",
      description: "Navegar a la lista de pacientes",
      example: "Mostrar pacientes corporativos con más de 5 sesiones",
      icon: <People />,
      category: 'navigation'
    },
    {
      command: "Filtrar por",
      description: "Aplicar filtros a los datos",
      example: "Filtrar pacientes por baja adherencia",
      icon: <FilterList />,
      category: 'search'
    },
    {
      command: "Analizar tendencias",
      description: "Mostrar análisis de tendencias",
      example: "Analizar tendencias de cancelaciones",
      icon: <TrendingUp />,
      category: 'analysis'
    },
    {
      command: "Exportar reporte",
      description: "Generar y descargar reportes",
      example: "Exportar reporte mensual de KPIs",
      icon: <GetApp />,
      category: 'export'
    },
    {
      command: "Buscar",
      description: "Búsqueda global en el sistema",
      example: "Buscar paciente María González",
      icon: <Search />,
      category: 'search'
    },
    {
      command: "Ir a métricas",
      description: "Navegar a diferentes secciones",
      example: "Ir a métricas financieras",
      icon: <Navigation />,
      category: 'navigation'
    }
  ];

  useEffect(() => {
    if (open) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [open]);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence * 100);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processCommand(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      console.warn('Speech recognition not supported');
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
    setConfidence(0);
  };

  const processCommand = (command: string) => {
    setLastCommand(command);
    
    // Simple command processing - in a real app, this would be more sophisticated
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('pacientes')) {
      console.log('Navigating to patients...');
      // Navigate to patients page
    } else if (lowerCommand.includes('métricas') || lowerCommand.includes('kpi')) {
      console.log('Navigating to metrics...');
      // Navigate to metrics page
    } else if (lowerCommand.includes('exportar') || lowerCommand.includes('reporte')) {
      console.log('Exporting report...');
      // Trigger export
    } else if (lowerCommand.includes('buscar')) {
      console.log('Performing search...');
      // Perform search
    }

    // Auto-close after processing
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return theme.palette.primary.main;
      case 'search': return theme.palette.info.main;
      case 'analysis': return theme.palette.secondary.main;
      case 'export': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
          minHeight: 500,
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                animation: isListening ? 'pulse 2s infinite' : 'none',
              }}
            >
              <Mic />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" fontFamily='"Neris", sans-serif'>
                🎤 AI Copilot - Comando de Voz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isListening ? 'Escuchando...' : 'Listo para comandos'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 4 }}>
          {/* Voice Input Status */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              mb: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <VolumeUp sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight="bold">
                {isListening ? 'Transcribiendo...' : 'Último comando'}
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                minHeight: 24,
                fontStyle: transcript || lastCommand ? 'normal' : 'italic',
                color: transcript || lastCommand ? 'text.primary' : 'text.secondary'
              }}
            >
              {transcript || lastCommand || 'Di un comando como "Mostrar pacientes con baja adherencia"'}
            </Typography>
            
            {confidence > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Confianza: {confidence.toFixed(0)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={confidence}
                  sx={{
                    mt: 0.5,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: confidence > 70 ? theme.palette.success.main : 
                               confidence > 40 ? theme.palette.warning.main : 
                               theme.palette.error.main,
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Command Categories */}
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, fontFamily: '"Neris", sans-serif' }}>
            Comandos Disponibles
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 3,
            }}
          >
            {['navigation', 'search', 'analysis', 'export'].map((category) => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                sx={{
                  backgroundColor: alpha(getCategoryColor(category), 0.1),
                  color: getCategoryColor(category),
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>

          {/* Command List */}
          <List>
            {voiceCommands.map((cmd, index) => (
              <ListItem
                key={index}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: alpha(getCategoryColor(cmd.category), 0.05),
                  border: `1px solid ${alpha(getCategoryColor(cmd.category), 0.1)}`,
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      color: getCategoryColor(cmd.category),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cmd.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="bold">
                      "{cmd.command}"
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {cmd.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Ejemplo: "{cmd.example}"
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      {/* Pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(93, 79, 176, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(93, 79, 176, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(93, 79, 176, 0);
          }
        }
      `}</style>
    </Dialog>
  );
}
