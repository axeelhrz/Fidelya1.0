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
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { 
  History, 
  Add, 
  Edit, 
  Delete, 
  CheckCircle, 
  Person, 
  Policy, 
  Assignment 
} from '@mui/icons-material';

// Tipos para las actividades
interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'complete';
  entityType: 'policy' | 'client' | 'task';
  entityId: string;
  entityName: string;
  createdAt: Date | { toDate: () => Date };
  userId: string;
  userName: string;
}

const RecentActivityList = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Suscripción a las actividades recientes en tiempo real desde Firestore
    const unsubscribe = onSnapshot(
      query(
        collection(db, `users/${user.uid}/activities`),
        orderBy('createdAt', 'desc'),
        limit(5)
      ),
      (snapshot) => {
        const activitiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Activity[];
        
        setActivities(activitiesData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Función para formatear la fecha
  const formatDate = (timestamp: Date | { toDate: () => Date } | number | string | null) => {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'object' && 'toDate' in timestamp ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  // Función para obtener el icono según el tipo de actividad
  const getIconForActivityType = (type: string) => {
    switch (type) {
      case 'create':
        return <Add sx={{ color: theme.palette.success.main }} />;
      case 'update':
        return <Edit sx={{ color: theme.palette.info.main }} />;
      case 'delete':
        return <Delete sx={{ color: theme.palette.error.main }} />;
      case 'complete':
        return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      default:
        return <Edit sx={{ color: theme.palette.info.main }} />;
    }
  };

  // Función para obtener el icono según el tipo de entidad
  const getIconForEntityType = (type: string) => {
    switch (type) {
      case 'policy':
        return <Policy sx={{ color: theme.palette.primary.main }} />;
      case 'client':
        return <Person sx={{ color: theme.palette.secondary.main }} />;
      case 'task':
        return <Assignment sx={{ color: theme.palette.warning.main }} />;
      default:
        return <Policy sx={{ color: theme.palette.primary.main }} />;
    }
  };

  // Función para obtener la URL según el tipo de entidad
  const getLinkForEntityType = (type: string, id: string) => {
    switch (type) {
      case 'policy':
        return `/dashboard/policies?id=${id}`;
      case 'client':
        return `/dashboard/customers?id=${id}`;
      case 'task':
        return `/dashboard/tasks?id=${id}`;
      default:
        return '';
    }
  };

  // Función para obtener el texto según el tipo de actividad y entidad
  const getActivityText = (activity: Activity) => {
    const entityTypeText = {
      policy: 'póliza',
      client: 'cliente',
      task: 'tarea'
    }[activity.entityType] || 'elemento';

    const actionText = {
      create: 'creó',
      update: 'actualizó',
      delete: 'eliminó',
      complete: 'completó'
    }[activity.type] || 'modificó';

    return `${actionText} ${entityTypeText} "${activity.entityName}"`;
  };

  // Datos de ejemplo para cuando no hay actividades reales
  const demoActivities: Activity[] = [
    {
      id: '1',
      type: 'create',
      entityType: 'policy',
      entityId: 'policy1',
      entityName: 'Póliza Auto #12345',
      createdAt: new Date(),
      userId: 'user1',
      userName: 'Juan Pérez'
    },
    {
      id: '2',
      type: 'update',
      entityType: 'client',
      entityId: 'client1',
      entityName: 'María López',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      userId: 'user1',
      userName: 'Juan Pérez'
    },
    {
      id: '3',
      type: 'complete',
      entityType: 'task',
      entityId: 'task1',
      entityName: 'Llamar a cliente',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      userId: 'user1',
      userName: 'Juan Pérez'
    },
    {
      id: '4',
      type: 'create',
      entityType: 'client',
      entityId: 'client2',
      entityName: 'Carlos Rodríguez',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      userId: 'user1',
      userName: 'Juan Pérez'
    },
    {
      id: '5',
      type: 'delete',
      entityType: 'policy',
      entityId: 'policy2',
      entityName: 'Póliza Hogar #67890',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      userId: 'user1',
      userName: 'Juan Pérez'
    }
  ];

  const data = activities.length > 0 ? activities : demoActivities;

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
            <History color="primary" />
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Actividad Reciente
            </Typography>
          </Box>
        }
      />
      <CardContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography>Cargando actividades...</Typography>
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary">No hay actividades recientes</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {data.map((activity, index) => (
              <Box key={activity.id}>
                <ListItem
                  component={motion.div}
                  custom={index}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  sx={{ px: 3, py: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getIconForActivityType(activity.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {getActivityText(activity)}
                        </Typography>
                        {getIconForEntityType(activity.entityType)}
                      </Box>
                    }
                    secondary={
                      <Link 
                        href={getLinkForEntityType(activity.entityType, activity.entityId)}
                        passHref
                      >
                        <Button
                          size="small"
                          variant="text"
                          sx={{ 
                            p: 0, 
                            minWidth: 'auto',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        >
                          Ver detalles
                        </Button>
                      </Link>
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(activity.createdAt)}
                  </Typography>
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

export default RecentActivityList;