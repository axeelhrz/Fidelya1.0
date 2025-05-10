import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Stack, 
    Chip, 
    Button,
    useTheme,
    Avatar
  } from '@mui/material';
  import { motion } from 'framer-motion';
  import { 
    ArrowForward,
    Policy,
    People,
    CreditCard,
    Settings,
    Description,
    Lock
  } from '@mui/icons-material';
  import { useHelpCenter } from '@/hooks/use-help-center';
  
  interface SmartSuggestionsProps {
    isPremium: boolean;
  }
  
  export default function SmartSuggestions({ isPremium }: SmartSuggestionsProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { suggestions, currentSection, incrementArticleView } = useHelpCenter();
    
    const getSectionName = (section: string) => {
      switch (section) {
        case 'policies':
          return 'Pólizas';
        case 'customers':
          return 'Clientes';
        case 'tasks':
          return 'Tareas';
        case 'analytics':
          return 'Análisis';
        case 'contacts':
          return 'Contactos';
        default:
          return 'Dashboard';
      }
    };
    
    const getSectionIcon = (section: string) => {
      switch (section) {
        case 'policies':
          return <Policy />;
        case 'customers':
          return <People />;
        case 'analytics':
          return <CreditCard />;
        case 'settings':
          return <Settings />;
        default:
          return <Description />;
      }
    };
    
    const getSectionColor = (section: string) => {
      switch (section) {
        case 'policies':
          return theme.palette.primary.main;
        case 'customers':
          return theme.palette.info.main;
        case 'analytics':
          return theme.palette.warning.main;
        case 'settings':
          return theme.palette.success.main;
        default:
          return theme.palette.secondary.main;
      }
    };
    
    if (!currentSection || suggestions.length === 0) {
      return null;
    }
    
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
              background: `linear-gradient(135deg, ${getSectionColor(currentSection)}20 0%, ${isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)'} 100%)`,
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
                  bgcolor: `${getSectionColor(currentSection)}20`, 
                  color: getSectionColor(currentSection),
                  mr: 2
                }}
              >
                {getSectionIcon(currentSection)}
              </Avatar>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Sugerencias para {getSectionName(currentSection)}
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 2 }}>
              {!isPremium ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Lock sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 500,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Sugerencias personalizadas
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Actualiza a un plan Pro o Enterprise para recibir sugerencias inteligentes basadas en tu uso de la plataforma.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    sx={{ 
                      borderRadius: 8,
                      textTransform: 'none',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    Actualizar plan
                  </Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Basado en tu actividad reciente, estos artículos podrían interesarte:
                  </Typography>
                  
                  {suggestions.map((suggestion) => (
                    <Box 
                      key={suggestion.id}
                      onClick={() => incrementArticleView(suggestion.id)}
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                        background: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                          borderColor: getSectionColor(currentSection),
                        }
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1,
                          fontWeight: 500,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {suggestion.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 1.5,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {suggestion.summary}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={1}>
                          {suggestion.tags.slice(0, 2).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ 
                                bgcolor: `${getSectionColor(currentSection)}10`,
                                color: getSectionColor(currentSection),
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '0.75rem'
                              }}
                            />
                          ))}
                        </Stack>
                        
                        <Button
                          endIcon={<ArrowForward />}
                          size="small"
                          sx={{ 
                            color: getSectionColor(currentSection),
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600,
                            '&:hover': {
                              bgcolor: `${getSectionColor(currentSection)}10`,
                            }
                          }}
                        >
                          Leer
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }