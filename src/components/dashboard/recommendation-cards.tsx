'use client';

import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  Divider, 
  useTheme, 
  alpha 
} from '@mui/material';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { 
  Lightbulb, 
  TrendingUp, 
  Person, 
  Policy, 
  Assignment, 
  ArrowForward 
} from '@mui/icons-material';

// Tipos para las recomendaciones
interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  icon: 'trending' | 'person' | 'policy' | 'task';
  priority: 'high' | 'medium' | 'low';
}

const RecommendationCard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Suscripción a las recomendaciones en tiempo real desde Firestore
    const unsubscribe = onSnapshot(
      query(
        collection(db, `users/${user.uid}/dashboard`),
        where('type', '==', 'recommendation'),
        orderBy('priority', 'asc'),
        limit(3)
      ),
      (snapshot) => {
        const recommendationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Recommendation[];
        
        setRecommendations(recommendationsData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Función para obtener el icono según el tipo
  const getIconForType = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp sx={{ color: theme.palette.primary.main }} />;
      case 'person':
        return <Person sx={{ color: theme.palette.secondary.main }} />;
      case 'policy':
        return <Policy sx={{ color: theme.palette.info.main }} />;
      case 'task':
        return <Assignment sx={{ color: theme.palette.warning.main }} />;
      default:
        return <Lightbulb sx={{ color: theme.palette.primary.main }} />;
    }
  };

  // Función para obtener el color según la prioridad
  const getColorForPriority = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Datos de ejemplo para cuando no hay recomendaciones reales
  const demoRecommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Contactar clientes inactivos',
      description: 'Tienes 5 clientes que no has contactado en más de 3 meses',
      actionText: 'Ver clientes',
      actionLink: '/dashboard/customers',
      icon: 'person',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Renovar pólizas',
      description: 'Podrías renovar 3 pólizas esta semana para aumentar tus ingresos',
      actionText: 'Ver pólizas',
      actionLink: '/dashboard/policies',
      icon: 'policy',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Completar tareas pendientes',
      description: 'Tienes 7 tareas pendientes que deberías completar pronto',
      actionText: 'Ver tareas',
      actionLink: '/dashboard/tasks',
      icon: 'task',
      priority: 'low'
    }
  ];

  const data = recommendations.length > 0 ? recommendations : demoRecommendations;

  // Animación para el componente
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Animación para los elementos de la lista
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }),
    hover: {
      scale: 1.02,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <Card
      component={motion.div}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      sx={{
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
          : `0 8px 32px ${alpha('#000', 0.05)}`,
        overflow: 'hidden'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lightbulb color="primary" />
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Recomendaciones
            </Typography>
          </Box>
        }
        action={
          <Button 
            component={Link}
            href="/dashboard/analisis"
            endIcon={<ArrowForward />}
            sx={{ 
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'transparent',
                transform: 'translateX(5px)',
                transition: 'transform 0.3s'
              }
            }}
          >
            Más insights
          </Button>
        }
      />
      <CardContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography>Cargando recomendaciones...</Typography>
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary">No hay recomendaciones disponibles</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {data.map((recommendation, index) => (
              <Box key={recommendation.id}>
                <ListItem
                  component={motion.div}
                  custom={index}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  sx={{ 
                    px: 3, 
                    py: 2,
                    borderLeft: `4px solid ${getColorForPriority(recommendation.priority)}`
                  }}
                >
                  <ListItemIcon>
                    {getIconForType(recommendation.icon)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={600}>
                        {recommendation.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {recommendation.description}
                        </Typography>
                        <Link href={recommendation.actionLink} passHref>
                          <Button
                            size="small"
                            variant="text"
                            endIcon={<ArrowForward fontSize="small" />}
                            sx={{ 
                              p: 0, 
                              minWidth: 'auto',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          >
                            {recommendation.actionText}
                          </Button>
                        </Link>
                      </Box>
                    }
                  />
                </ListItem>
                {index < data.length - 1 && (
                  <Divider sx={{ mx: 3 }} />
                )}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;