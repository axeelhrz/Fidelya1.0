import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Chip, 
  IconButton, 
  Tooltip,
  useTheme,
  Divider,
  Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExpandMore, 
  ThumbUp, 
  ThumbDown, 
  QuestionAnswer,
  Search
} from '@mui/icons-material';
import { useHelpCenter } from '@/hooks/use-help-center';
import { useRouter } from 'next/navigation';

export default function FAQ() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const router = useRouter();
  const { faq, handleFaqVote } = useHelpCenter();
  const [expanded, setExpanded] = useState<string | false>(false);
  
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const handleGoToHelpCenter = () => {
    router.push('/dashboard/ayuda');
  };
  
  // Mostrar solo las 3 preguntas más populares
  const topFaq = [...faq]
    .sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes))
    .slice(0, 3);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Pólizas':
        return theme.palette.primary.main;
      case 'Clientes':
        return theme.palette.info.main;
      case 'Suscripción':
        return theme.palette.warning.main;
      case 'Configuración':
        return theme.palette.success.main;
      case 'Soporte':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <QuestionAnswer sx={{ mr: 1.5, color: theme.palette.primary.main }} />
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            fontFamily: "'Sora', sans-serif",
            flexGrow: 1
          }}
        >
          Preguntas frecuentes
        </Typography>
        
        <Button
          variant="text"
          size="small"
          startIcon={<Search />}
          onClick={handleGoToHelpCenter}
          sx={{ 
            color: theme.palette.primary.main,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Ver más
        </Button>
      </Box>
      
      <AnimatePresence>
        {topFaq.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Accordion
              expanded={expanded === item.id}
              onChange={handleChange(item.id)}
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: '8px !important',
                overflow: 'hidden',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:before': {
                  display: 'none',
                },
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: getCategoryColor(item.category),
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography 
                    sx={{ 
                      flexGrow: 1,
                      fontWeight: 500,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {item.question}
                  </Typography>
                  
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{ 
                      ml: 2,
                      bgcolor: `${getCategoryColor(item.category)}20`,
                      color: getCategoryColor(item.category),
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  />
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Typography 
                  sx={{ 
                    mb: 2,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: 'text.secondary'
                  }}
                >
                  {item.answer}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    ¿Te ha resultado útil esta respuesta?
                  </Typography>
                  
                  <Box>
                    <Tooltip title="Me gusta">
                      <IconButton 
                        size="small" 
                        onClick={() => handleFaqVote(item.id, true)}
                        sx={{ 
                          color: theme.palette.success.main,
                          '&:hover': {
                            bgcolor: `${theme.palette.success.main}20`
                          }
                        }}
                      >
                        <ThumbUp fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="No me gusta">
                      <IconButton 
                        size="small" 
                        onClick={() => handleFaqVote(item.id, false)}
                        sx={{ 
                          color: theme.palette.error.main,
                          '&:hover': {
                            bgcolor: `${theme.palette.error.main}20`
                          }
                        }}
                      >
                        <ThumbDown fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGoToHelpCenter}
          sx={{ 
            borderRadius: 2,
            py: 1,
            px: 3,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Ver todas las preguntas frecuentes
        </Button>
      </Box>
    </Box>
  );
}