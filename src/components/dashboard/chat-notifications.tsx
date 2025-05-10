'use client';

import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Button, 
  Badge, 
  Divider, 
  useTheme, 
  alpha 
} from '@mui/material';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Chat, ArrowForward } from '@mui/icons-material';

// Tipos para los mensajes
interface Message {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  text: string;
  createdAt: Timestamp | Date;
  read: boolean;
}

const ChatNotifications = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Suscripción a los mensajes recientes en tiempo real desde Firestore
    const unsubscribe = onSnapshot(
      query(
        collection(db, `users/${user.uid}/messages`),
        where('read', '==', false),
        orderBy('createdAt', 'desc'),
        limit(3)
      ),
      (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        
        setMessages(messagesData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Función para formatear la fecha
  const formatDate = (timestamp: Timestamp | Date | null | undefined) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Datos de ejemplo para cuando no hay mensajes reales
  const demoMessages: Message[] = [
    {
      id: '1',
      contactId: 'contact1',
      contactName: 'María López',
      text: 'Hola, ¿podrías enviarme información sobre el seguro de auto?',
      createdAt: new Date(),
      read: false
    },
    {
      id: '2',
      contactId: 'contact2',
      contactName: 'Carlos Rodríguez',
      text: 'Necesito renovar mi póliza de hogar, ¿cuándo podemos hablar?',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      contactId: 'contact3',
      contactName: 'Ana Martínez',
      text: 'Gracias por la información, me gustaría programar una cita.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    }
  ];

  const data = messages.length > 0 ? messages : demoMessages;

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
            <Badge 
              badgeContent={data.length} 
              color="error"
              sx={{ 
                '& .MuiBadge-badge': {
                  right: -3,
                  top: 3
                }
              }}
            >
              <Chat color="primary" />
            </Badge>
            <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
              Mensajes Recientes
            </Typography>
          </Box>
        }
        action={
          <Button 
            component={Link}
            href="/dashboard/contactos"
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
            Ver todos
          </Button>
        }
      />
      <CardContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography>Cargando mensajes...</Typography>
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary">No hay mensajes nuevos</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {data.map((message, index) => (
              <Box key={message.id}>
                <motion.div
                  custom={index}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <ListItem
                    component={Link}
                    href={`/dashboard/chat/${message.contactId}`}
                    sx={{ px: 3, py: 2, cursor: 'pointer' }}
                  >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      color="success"
                    >
                      <Avatar 
                        src={message.contactAvatar} 
                        alt={message.contactName}
                        sx={{ 
                          bgcolor: theme.palette.primary.main,
                          width: 40,
                          height: 40
                        }}
                      >
                        {getInitials(message.contactName)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={600}>
                        {message.contactName}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {message.text}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(message.createdAt)}
                    </Typography>
                    <Badge 
                      color="error" 
                      variant="dot"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  </ListItem>
                </motion.div>
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

export default ChatNotifications;