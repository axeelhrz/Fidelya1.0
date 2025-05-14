import React from 'react';
import { Paper, Typography, Box, useTheme, alpha, Chip, Button } from '@mui/material';
import { Lightbulb, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPriorityColor } from '@/lib/formatters';

interface RecommendationData {
  text: string;
  priority: 'high' | 'medium' | 'low';
  actionable?: boolean;
  actionLink?: string;
  actionText?: string;
}

interface RecommendationCardProps {
  recommendation: RecommendationData;
}

const priorityConfig = {
  high: { 
    icon: <AlertTriangle size={20} />, 
    label: 'Alta Prioridad' 
  },
  medium: { 
    icon: <Lightbulb size={20} />, 
    label: 'Recomendación' 
  },
  low: { 
    icon: <CheckCircle size={20} />, 
    label: 'Sugerencia' 
  },
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const theme = useTheme();
  const config = priorityConfig[recommendation.priority];
  const color = getPriorityColor(recommendation.priority, theme);
  
  // Animaciones
  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -4,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <Paper
      component={motion.div}
      variants={cardVariants}
      whileHover="hover"
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        '&:hover': {
          borderColor: color,
          boxShadow: `0 4px 16px ${alpha(color, 0.15)}`,
        }
      }}
    >
      <Box sx={{ color, mt: '2px' }}>
        {config.icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 500, 
            fontFamily: 'Inter, sans-serif',
            color: theme.palette.text.primary
          }}
        >
          {recommendation.text}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Chip
            label={config.label}
            size="small"
            sx={{
              backgroundColor: alpha(color, 0.1),
              color: color,
              fontWeight: 500,
              fontSize: '0.7rem',
              height: '20px',
              fontFamily: 'Inter, sans-serif'
            }}
          />
          {recommendation.actionable && (
            <Button
              variant="text"
              size="small"
              endIcon={<ArrowRight size={16} />}
              sx={{
                color,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: alpha(color, 0.05)
                }
              }}
              href={recommendation.actionLink}
            >
              {recommendation.actionText || 'Ver detalles'}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};