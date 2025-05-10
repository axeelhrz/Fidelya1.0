import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Chip, 
  Stack, 
  IconButton, 
  Tooltip,
  useTheme,
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExpandMore, 
  ThumbUp, 
  ThumbDown, 
  QuestionAnswer
} from '@mui/icons-material';
import { useHelpCenter } from '@/hooks/use-help-center';

export default function DynamicFAQ() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { faq, handleFaqVote } = useHelpCenter();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [filter, setFilter] = useState<string | null>(null);
  
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const handleFilterChange = (category: string | null) => {
    setFilter(category === filter ? null : category);
  };
  
  const categories = Array.from(new Set(faq.map(item => item.category)));
  
  const filteredFaq = filter 
    ? faq.filter(item => item.category === filter)
    : faq;
  
  // Ordenar por popularidad (likes - dislikes)
  const sortedFaq = [...filteredFaq].sort((a, b) => 
    (b.likes - b.dislikes) - (a.likes - a.dislikes)
  );
  
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
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            fontFamily: "'Sora', sans-serif",
            flexGrow: 1
          }}
        >
          Preguntas frecuentes
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mr: 1,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Filtrar por:
          </Typography>
          
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              size="small"
              onClick={() => handleFilterChange(category)}
              color={filter === category ? 'primary' : 'default'}
              variant={filter === category ? 'filled' : 'outlined'}
              sx={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                borderColor: filter === category ? 'transparent' : getCategoryColor(category),
                color: filter === category ? 'white' : getCategoryColor(category),
                bgcolor: filter === category ? getCategoryColor(category) : 'transparent',
                '&:hover': {
                  bgcolor: filter === category 
                    ? `${getCategoryColor(category)}CC` 
                    : `${getCategoryColor(category)}20`,
                }
              }}
            />
          ))}
        </Stack>
      </Box>
      
      <AnimatePresence>
        {sortedFaq.map((item) => (
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
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      ml: { xs: 1, sm: 2 },
                      color: 'text.secondary',
                      '& svg': {
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    <ThumbUp fontSize="small" />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        mx: 0.5,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {item.likes}
                    </Typography>
                  </Box>
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
    </Box>
  );
}