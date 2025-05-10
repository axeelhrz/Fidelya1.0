import React from 'react';
import { Stack, Alert, AlertTitle } from '@mui/material';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { RecommendationCard } from '@/components/dashboard/analytics/recomendation-card';

interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  text: string;
  // Add other properties your recommendation object has
  actionable?: boolean;
  actionLink?: string;
  actionText?: string;
}

interface ActionableIntelligenceProps {
  recommendations: Recommendation[];
}



export const ActionableIntelligence: React.FC<ActionableIntelligenceProps> = ({ recommendations }) => {
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <Alert 
        severity="info" 
        icon={<Lightbulb size={20} />} 
        sx={{ 
          borderRadius: '16px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <AlertTitle sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>
          Todo en orden
        </AlertTitle>
        No hay recomendaciones automáticas por ahora. ¡Buen trabajo!
      </Alert>
    );
  }

  // Ordenar por prioridad
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Stack 
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      spacing={2}
    >
      {sortedRecommendations.map((rec) => (
        <RecommendationCard key={rec.id} recommendation={rec} />
      ))}
    </Stack>
  );
};