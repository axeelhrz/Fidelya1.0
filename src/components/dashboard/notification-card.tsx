'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { collection, query, orderBy, limit, onSnapshot, updateDoc, doc, where, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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

  // Función para generar notificaciones reales basadas en datos del usuario
  const generateRealNotifications = useCallback(async () => {
    if (!user?.uid) return;

    try {
      // Verificar si ya existen notificaciones para el usuario
      const notificationsRef = collection(db, `users/${user.uid}/notifications`);
      const notificationsSnapshot = await getDocs(notificationsRef);
      
      // Si ya hay notificaciones, no generamos nuevas
      if (!notificationsSnapshot.empty) return;

      // 1. Buscar pólizas próximas a vencer (en los próximos 30 días)
      const policiesRef = collection(db, 'policies');
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      const policiesQuery = query(
        policiesRef,
        where('userId', '==', user.uid),
        where('expirationDate', '>=', today),
        where('expirationDate', '<=', thirtyDaysLater)
      );
      
      const policiesSnapshot = await getDocs(policiesQuery);
      
      if (!policiesSnapshot.empty) {
        const count = policiesSnapshot.size;
        const firstPolicy = policiesSnapshot.docs[0];
        
        await addDoc(notificationsRef, {
      type: 'warning',
      title: 'Pólizas por vencer',
          message: `Tienes ${count} póliza${count > 1 ? 's' : ''} que vence${count > 1 ? 'n' : ''} en menos de 30 días`,
      relatedTo: {
        type: 'policy',
            id: firstPolicy.id
      },
          createdAt: serverTimestamp(),
      read: false
        });
      }

      // 2. Buscar clientes inactivos (sin actividad en los últimos 90 días)
      const clientsRef = collection(db, 'clients');
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(today.getDate() - 90);
      
      const clientsQuery = query(
        clientsRef,
        where('userId', '==', user.uid),
        where('lastActivity', '<=', ninetyDaysAgo)
  );
      
      const clientsSnapshot = await getDocs(clientsQuery);
      
      if (!clientsSnapshot.empty) {
        const count = clientsSnapshot.size;
        const firstClient = clientsSnapshot.docs[0];
        
        await addDoc(notificationsRef, {
          type: 'info',
          title: 'Clientes inactivos',
          message: `Tienes ${count} cliente${count > 1 ? 's' : ''} inactivo${count > 1 ? 's' : ''} desde hace más de 90 días`,
          relatedTo: {
            type: 'client',
            id: firstClient.id
          },
          createdAt: serverTimestamp(),
          read: false
        });
      }

      // 3. Buscar tareas vencidas
      const tasksRef = collection(db, 'tasks');
      
      const tasksQuery = query(
        tasksRef,
        where('userId', '==', user.uid),
        where('status', '!=', 'completed'),
        where('dueDate', '<=', today)
      );
      
      const tasksSnapshot = await getDocs(tasksQuery);
      
      if (!tasksSnapshot.empty) {
        const count = tasksSnapshot.size;
        const firstTask = tasksSnapshot.docs[0];
        
        await addDoc(notificationsRef, {
          type: 'error',
          title: 'Tareas vencidas',
          message: `Tienes ${count} tarea${count > 1 ? 's' : ''} vencida${count > 1 ? 's' : ''} sin completar`,
          relatedTo: {
            type: 'task',
            id: firstTask.id
          },
          createdAt: serverTimestamp(),
          read: false
        });
      }

      // Si no se encontraron datos para generar notificaciones, crear una notificación de bienvenida
      if (policiesSnapshot.empty && clientsSnapshot.empty && tasksSnapshot.empty) {
        await addDoc(notificationsRef, {
          type: 'info',
          title: 'Bienvenido a Assuriva',
          message: 'Comienza a gestionar tus pólizas, clientes y tareas para recibir notificaciones personalizadas.',
          createdAt: serverTimestamp(),
          read: false
        });
      }
    } catch (error) {
    console.error('Error al generar notificaciones reales:', error);
  }
}, [user]);

  useEffect(() => {
    if (!user?.uid) return;

    // Generar notificaciones reales basadas en datos del usuario
    generateRealNotifications();

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
  }, [user, generateRealNotifications]);

  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId: string) => {
    if (!user?.uid) return;
    
    try {
      const notificationRef = doc(db, `users/${user.uid}/notifications`, notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

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
                  onClick={() => markAsRead(notification.id)}
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