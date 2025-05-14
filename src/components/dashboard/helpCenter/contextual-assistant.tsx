import * as React from 'react';
import { useState, ReactElement } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Avatar, 
  Chip,
  Stack,
  useTheme,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close, 
  Send, 
  SmartToy, 
  Article, 
  VideoLibrary, 
  Link as LinkIcon,
  ArrowForward,
  Policy,
  People,
  CreditCard,
} from '@mui/icons-material';

interface ContextualAssistantProps {
  onClose: () => void;
}

interface Suggestion {
  title: string;
  type: 'article' | 'video' | string;
  link: string;
}

interface ResponseData {
  title: string;
  icon: ReactElement;
  color: string;
  suggestions: Suggestion[];
}

// Respuestas predefinidas para demostración
const predefinedResponses: Record<string, ResponseData> = {
  'póliza': {
    title: 'Ayuda con pólizas',
    icon: <Policy />,
    color: '#1976d2',
    suggestions: [
      { 
        title: 'Cómo crear una nueva póliza', 
        type: 'article',
        link: '/ayuda/articulo/1'
      },
      { 
        title: 'Renovación automática de pólizas', 
        type: 'article',
        link: '/ayuda/articulo/2'
      },
      { 
        title: 'Tutorial: Gestión de pólizas', 
        type: 'video',
        link: '/ayuda/video/1'
      }
    ]
  },
  'cliente': {
    title: 'Ayuda con clientes',
    icon: <People />,
    color: '#0288d1',
    suggestions: [
      { 
        title: 'Cómo añadir un nuevo cliente', 
        type: 'article',
        link: '/ayuda/articulo/3'
      },
      { 
        title: 'Importar clientes desde Excel', 
        type: 'article',
        link: '/ayuda/articulo/4'
      },
      { 
        title: 'Tutorial: Gestión de clientes', 
        type: 'video',
        link: '/ayuda/video/2'
      }
    ]
  },
  'pago': {
    title: 'Ayuda con pagos',
    icon: <CreditCard />,
    color: '#ed6c02',
    suggestions: [
      { 
        title: 'Métodos de pago aceptados', 
        type: 'article',
        link: '/ayuda/articulo/5'
      },
      { 
        title: 'Configurar recordatorios de pago', 
        type: 'article',
        link: '/ayuda/articulo/6'
      },
      { 
        title: 'Tutorial: Procesamiento de pagos', 
        type: 'video',
        link: '/ayuda/video/3'
      }
    ]
  },
  'default': {
    title: 'Asistente de Ayuda',
    icon: <SmartToy />,
    color: '#9c27b0',
    suggestions: [
      { 
        title: 'Guía de inicio rápido', 
        type: 'article',
        link: '/ayuda/articulo/7'
      },
      { 
        title: 'Funciones más utilizadas', 
        type: 'article',
        link: '/ayuda/articulo/8'
      },
      { 
        title: 'Tour por el dashboard', 
        type: 'video',
        link: '/ayuda/video/4'
      }
    ]
  }
};

export default function ContextualAssistant({ onClose }: ContextualAssistantProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    
    setIsTyping(true);
    setShowInitialMessage(false);
    
    // Simular tiempo de respuesta
    setTimeout(() => {
      // Buscar coincidencias en las respuestas predefinidas
      const matchedKey = Object.keys(predefinedResponses).find(key => 
        query.toLowerCase().includes(key)
      ) || 'default';
      
      setResponse(predefinedResponses[matchedKey]);
      setIsTyping(false);
      setQuery('');
    }, 1000);
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'article':
        return <Article fontSize="small" />;
      case 'video':
        return <VideoLibrary fontSize="small" />;
      default:
        return <LinkIcon fontSize="small" />;
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          width: 350,
          maxWidth: 'calc(100vw - 40px)',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            background: isDark ? 'rgba(25, 25, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: isDark 
              ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
              : '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
              bgcolor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
            }}
          >
            <Avatar
              sx={{ 
                bgcolor: theme.palette.primary.main,
                mr: 2
              }}
            >
              <SmartToy />
            </Avatar>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                fontFamily: "'Sora', sans-serif",
                flexGrow: 1
              }}
            >
              Asistente de Ayuda
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Content */}
          <Box sx={{ height: 300, overflowY: 'auto', p: 2 }}>
            {showInitialMessage && (
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 500,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mb: 2,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Puedes preguntarme sobre pólizas, clientes, pagos o cualquier otra función de Assuriva.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {['Pólizas', 'Clientes', 'Pagos', 'Configuración'].map((suggestion) => (
                    <Chip
                      key={suggestion}
                      label={suggestion}
                      size="small"
                      onClick={() => setQuery(suggestion)}
                      sx={{ 
                        my: 0.5,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 32,
                    height: 32,
                    mr: 1.5
                  }}
                >
                  <SmartToy sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: 'text.secondary'
                  }}
                >
                  Escribiendo...
                </Typography>
              </Box>
            )}
            
            {response && (
              <Fade in={!!response}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{ 
                        bgcolor: response.color,
                        width: 32,
                        height: 32,
                        mr: 1.5
                      }}
                    >
                      {response.icon}
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 500,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {response.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        He encontrado estos recursos que podrían ayudarte:
                      </Typography>
                    </Box>
                  </Box>
                  
                  <List sx={{ py: 0 }}>
                    {response.suggestions.map((suggestion: Suggestion, index: number) => (
                      <ListItem 
                        key={index}
                        component="button"
                        sx={{ 
                          borderRadius: 2,
                          mb: 1,
                          p: 1.5,
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                          '&:hover': {
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {getIconForType(suggestion.type)}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 500,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              {suggestion.title}
                            </Typography>
                          }
                          secondary={
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                textTransform: 'capitalize'
                              }}
                            >
                              {suggestion.type}
                            </Typography>
                          }
                        />
                        <ArrowForward fontSize="small" sx={{ color: 'text.secondary', ml: 1 }} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button
                      size="small"
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Ver más resultados
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* Input */}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              p: 2, 
              borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
              bgcolor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              placeholder="¿En qué estás trabajando?"
              value={query}
              onChange={handleQueryChange}
              variant="outlined"
              size="small"
              InputProps={{
                sx: { 
                  borderRadius: 3,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  bgcolor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.9)',
                }
              }}
              sx={{ mr: 1 }}
            />
            <IconButton 
              type="submit" 
              color="primary"
              disabled={!query.trim()}
              sx={{ 
                bgcolor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                '&.Mui-disabled': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                }
              }}
            >
              <Send fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
}