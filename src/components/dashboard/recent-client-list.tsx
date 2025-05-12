'use client';

import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  useTheme, 
  alpha,
  Stack,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { 
  ArrowForward, 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Tipos para los clientes
import { Timestamp } from 'firebase/firestore';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  createdAt: Timestamp | Date | number;
}

const RecentClientList = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Suscripción a los clientes recientes en tiempo real desde Firestore
    const unsubscribe = onSnapshot(
      query(
        collection(db, `users/${user.uid}/customers`),
        orderBy('createdAt', 'desc'),
        limit(5)
      ),
      (snapshot) => {
        const clientsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Client[];
        
        setClients(clientsData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para formatear la fecha
  const formatDate = (timestamp: Timestamp | Date | number | null | undefined) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  // Función para generar un color basado en el nombre
  const getAvatarColor = (name: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ];
    
    // Usar la suma de los códigos de caracteres para determinar el color
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
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

  // Animación para las tarjetas de cliente
  const clientCardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }),
    hover: {
      y: -5,
      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
        boxShadow: theme.palette.mode === 'dark' 
          ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
          : `0 8px 32px ${alpha('#000', 0.05)}`,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontFamily="Sora" fontWeight={600}>
            Clientes Recientes
          </Typography>
        }
        action={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Añadir cliente">
              <IconButton
                component={Link}
                href="/dashboard/customers?action=new"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                  }
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button 
              component={Link}
              href="/dashboard/customers"
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
          </Stack>
        }
      />
      <CardContent 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          pt: 0,
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            minHeight: 200
          }}>
            <Typography>Cargando clientes...</Typography>
          </Box>
        ) : clients.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            minHeight: 200,
            gap: 2
          }}>
            <Typography color="text.secondary">No hay clientes recientes</Typography>
            <Button
              component={Link}
              href="/dashboard/customers?action=new"
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
            >
              Añadir cliente
            </Button>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ flex: 1 }}>
            {clients.map((client, index) => (
              <Box
                key={client.id}
                component={motion.div}
                custom={index}
                variants={clientCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                sx={{ 
                  p: 2,
                  borderRadius: 3,
                  background: alpha(theme.palette.background.default, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => window.location.href = `/dashboard/customers?id=${client.id}`}
              >
                <Stack spacing={2}>
                  {/* Información principal del cliente */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      src={client.avatarUrl} 
                      alt={client.name}
                      sx={{ 
                        bgcolor: getAvatarColor(client.name),
                        width: 48,
                        height: 48,
                        fontSize: '1.2rem',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(client.name)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {client.name}
                      </Typography>
                      
                      <Stack 
                        direction="row" 
                        spacing={0.5} 
                        alignItems="center"
                        sx={{ mt: 0.5 }}
                      >
                        <Chip
                          icon={<TimeIcon fontSize="small" />}
                          label={formatDate(client.createdAt)}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            height: 24,
                            fontSize: '0.7rem',
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            '& .MuiChip-icon': {
                              fontSize: '0.85rem',
                              color: theme.palette.text.secondary
                            }
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                  
                  {/* Información de contacto */}
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2}
                    sx={{ 
                      pt: 1,
                      borderTop: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
                    }}
                  >
                    <Tooltip title="Email">
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center"
                        sx={{ flex: 1 }}
                      >
                        <EmailIcon 
                          fontSize="small" 
                          sx={{ color: theme.palette.text.secondary, opacity: 0.7 }} 
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {client.email || 'No disponible'}
                        </Typography>
                      </Stack>
                    </Tooltip>
                    
                    <Tooltip title="Teléfono">
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center"
                        sx={{ flex: 1 }}
                      >
                        <PhoneIcon 
                          fontSize="small" 
                          sx={{ color: theme.palette.text.secondary, opacity: 0.7 }} 
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {client.phone || 'No disponible'}
                        </Typography>
                      </Stack>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentClientList;