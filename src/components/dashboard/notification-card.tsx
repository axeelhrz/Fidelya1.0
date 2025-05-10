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
  Notifications, 
  Warning, 
  Info, 
  Error, 
  AccessTime, 
  Person, 
  Policy 
} from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';
// Tipos para las notificaciones
interface Notification {
  id: string;
  type: 'warning' | 'info' | 'error';
  title: string;
  message: string;
  relatedTo?: {
    type: 'policy' | 'client' | 'task';
    id: string;
  };
  createdAt: Timestamp | Date;
  read: boolean;
}

const NotificationsCard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Suscripción a las notificaciones en tiempo real desde Firestore
    const unsubscribe = onSnapshot(
      query(
        collection(db, `users/${user.uid}/notifications`),
        orderBy('createdAt', 'desc'),
        limit(5)
      ),
      (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[];
        
        setNotifications(notificationsData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Función para formatear la fecha
  const formatDate = (timestamp: Timestamp | Date | number) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  // Función para obtener el icono según el tipo de notificación
  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning':
        return <Warning sx={{ color: theme.palette.warning.main }} />;
      case 'info':
        return <Info sx={{ color: theme.palette.info.main }} />;
      case 'error':
        return <Error sx={{ color: theme.palette.error.main }} />;
      default:
        return <Info sx={{ color: theme.palette.info.main }} />;
    }
  };

  // Función para obtener el icono según el tipo de relación
  const getIconForRelatedType = (type?: string) => {
    switch (type) {
      case 'policy':
        return <Policy sx={{ color: theme.palette.primary.main }} />;
      case 'client':
        return <Person sx={{ color: theme.palette.secondary.main }} />;
      case 'task':
        return <AccessTime sx={{ color: theme.palette.warning.main }} />;
      default:
        return null;
    }
  };

  // Función para obtener la URL según el tipo de relación
  const getLinkForRelatedType = (type?: string, id?: string) => {
    if (!type || !id) return '';
    
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

  // Datos de ejemplo para cuando no hay notificaciones reales
  const demoNotifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Pólizas por vencer',
      message: 'Tienes 3 pólizas que vencen en menos de 15 días',
      relatedTo: {
        type: 'policy',
        id: 'policy1'
      },
      createdAt: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Cliente inactivo',
      message: 'El cliente Juan Pérez está inactivo desde hace 90 días',
      relatedTo: {
        type: 'client',
        id: 'client1'
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'error',
      title: 'Tareas vencidas',
      message: 'Tienes 2 tareas vencidas sin completar',
      relatedTo: {
        type: 'task',
        id: 'task1'
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true
    }
  ];

  const data = notifications.length > 0 ? notifications : demoNotifications;

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
            <Notifications color="primary" />
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Notificaciones
            </Typography>
          </Box>
        }
        action={
          <Button 
            component={Link}
            href="/dashboard/configuracion"
            sx={{ 
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'transparent',
                transform: 'translateY(-2px)',
                transition: 'transform 0.3s'
              }
            }}
          >
            Ver todas
          </Button>
        }
      />
      <CardContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography>Cargando notificaciones...</Typography>
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary">No hay notificaciones</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {data.map((notification, index) => (
              <Box key={notification.id}>
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
                    bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05)
                  }}
                >
                  <ListItemIcon>
                    {getIconForType(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={600}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.message}
                        </Typography>
                        {notification.relatedTo && (
                          <Link 
                            href={getLinkForRelatedType(notification.relatedTo.type, notification.relatedTo.id)}
                            passHref
                          >
                            <Button
                              size="small"
                              variant="text"
                              startIcon={getIconForRelatedType(notification.relatedTo.type)}
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
                        )}
                      </Box>
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(notification.createdAt)}
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

export default NotificationsCard;