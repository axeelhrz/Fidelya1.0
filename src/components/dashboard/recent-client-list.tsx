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
  IconButton,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
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
  Add as AddIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { Customer } from '@/types/customer';
import { Timestamp } from 'firebase/firestore';


const RecentClientList = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [clients, setClients] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Suscripción a los clientes recientes en tiempo real desde Firestore
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'customers'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      ),
      (snapshot) => {
        const clientsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Customer[];
        
        setClients(clientsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching recent clients:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para formatear la fecha
  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return '';
    
    try {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Función para generar un color basado en el nombre
  const getAvatarColor = (name: string) => {
    if (!name) return theme.palette.primary.main;
    
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

  // Función para obtener el icono del tipo de cliente
  const getClientTypeIcon = (type: string | undefined) => {
    if (!type) return <PersonIcon />;
    
    switch (type.toLowerCase()) {
      case 'business':
        return <BusinessIcon />;
      case 'family':
        return <PeopleIcon />;
      case 'individual':
      default:
        return <PersonIcon />;
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string | undefined) => {
    if (!status) return theme.palette.info.main;
    
    switch (status.toLowerCase()) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.error.main;
      case 'lead':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
};

  // Función para traducir el estado
  const translateStatus = (status: string | undefined) => {
    if (!status) return 'Desconocido';
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'lead':
        return 'Potencial';
      default:
        return status;
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
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={30} thickness={4} />
              <Typography variant="body2" color="text.secondary">
                Cargando clientes...
              </Typography>
            </Stack>
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
                      src={client.photoURL} 
                      alt={client.name || client.fullName}
                      sx={{ 
                        bgcolor: getAvatarColor(client.name || client.fullName || ''),
                        width: 48,
                        height: 48,
                        fontSize: '1.2rem',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(client.name || client.fullName || '')}
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {client.name || client.fullName || 'Sin nombre'}
                        </Typography>
                        
                        {client.isStarred && (
                          <StarIcon 
                            fontSize="small" 
                            sx={{ color: theme.palette.warning.main }}
                          />
                        )}
                      </Stack>
                      
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center"
                        sx={{ mt: 0.5 }}
                      >
                        <Chip
                          label={translateStatus(client.status)}
                          size="small"
                          sx={{ 
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: alpha(getStatusColor(client.status), 0.1),
                            color: getStatusColor(client.status),
                            fontWeight: 600,
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                        
                        <Tooltip title="Fecha de registro">
                          <Chip
                            icon={<TimeIcon fontSize="small" />}
                            label={formatDate(client.createdAt || client.registeredAt)}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                              '& .MuiChip-icon': {
                                fontSize: '0.75rem',
                                color: theme.palette.text.secondary
                              },
                              '& .MuiChip-label': { px: 1 }
                            }}
                          />
                        </Tooltip>
                      </Stack>
                    </Box>
                    
                    <Tooltip title={client.type ? `Tipo: ${client.type}` : 'Tipo no especificado'}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main
                        }}
                      >
                        {getClientTypeIcon(client.type)}
                      </Avatar>
                    </Tooltip>
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
                  
                  {/* Pólizas (si existen) */}
                  {client.policies && client.policies.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`${client.policies.length} ${client.policies.length === 1 ? 'póliza' : 'pólizas'}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  )}
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