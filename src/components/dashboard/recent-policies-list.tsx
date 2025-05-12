'use client';

import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Typography, 
  Chip, 
  Button, 
  useTheme, 
  alpha,
  Stack,
  Avatar,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { Timestamp } from 'firebase/firestore';
import { usePolicies } from '@/hooks/use-policies';
import { format } from 'date-fns';
import Link from 'next/link';
import { 
  ArrowForward, 
  DirectionsCar as CarIcon, 
  Favorite as LifeIcon, 
  Home as HomeIcon, 
  HealthAndSafety as HealthIcon, 
  Business as BusinessIcon, 
  Public as OtherIcon,
  CalendarMonth,
  Euro,
  Person
} from '@mui/icons-material';
import { Policy } from '@/types/policy';

const RecentPoliciesList = () => {
  const theme = useTheme();
  const { policies, loading: policiesLoading } = usePolicies();
  const [isLoading, setIsLoading] = useState(true);
  const [recentPolicies, setRecentPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    if (policies.length > 0) {
      // Filtrar solo las pólizas no archivadas
      const nonArchivedPolicies = policies.filter(p => !p.isArchived);
      
      // Ordenar por fecha de creación (más reciente primero)
      const sortedPolicies = [...nonArchivedPolicies].sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      // Tomar las 5 más recientes
      const latest = sortedPolicies.slice(0, 5);
      
      setRecentPolicies(latest);
      setIsLoading(false);
    } else if (!policiesLoading) {
      // Si no hay pólizas y ya terminó de cargar
      setIsLoading(false);
    }
  }, [policies, policiesLoading]);

  // Función para formatear la fecha
  const formatDate = (timestamp: Timestamp | Date | undefined) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'dd/MM/yyyy');
  };

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: theme.palette.success.main,
          text: theme.palette.success.contrastText
        };
      case 'pending':
        return {
          bg: theme.palette.warning.main,
          text: theme.palette.warning.contrastText
        };
      case 'expired':
        return {
          bg: theme.palette.error.main,
          text: theme.palette.error.contrastText
        };
      case 'cancelled':
        return {
          bg: theme.palette.grey[500],
          text: theme.palette.getContrastText(theme.palette.grey[500])
        };
      default:
        return {
          bg: theme.palette.primary.main,
          text: theme.palette.primary.contrastText
        };
    }
  };

  // Función para traducir el estado
  const translateStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'pending':
        return 'Pendiente';
      case 'expired':
        return 'Vencida';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Función para obtener el icono del tipo de póliza
  const getPolicyTypeIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    
    if (lowerType.includes('auto') || lowerType.includes('coche') || lowerType.includes('vehiculo')) {
      return <CarIcon />;
    } else if (lowerType.includes('vida') || lowerType.includes('life')) {
      return <LifeIcon />;
    } else if (lowerType.includes('hogar') || lowerType.includes('casa') || lowerType.includes('home')) {
      return <HomeIcon />;
    } else if (lowerType.includes('salud') || lowerType.includes('health')) {
      return <HealthIcon />;
    } else if (lowerType.includes('empresa') || lowerType.includes('negocio') || lowerType.includes('business')) {
      return <BusinessIcon />;
    } else {
      return <OtherIcon />;
    }
  };

  // Función para obtener el color del tipo de póliza
  const getPolicyTypeColor = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    
    if (lowerType.includes('auto') || lowerType.includes('coche') || lowerType.includes('vehiculo')) {
      return theme.palette.mode === 'dark' ? '#1E40AF' : '#3B82F6';
    } else if (lowerType.includes('vida') || lowerType.includes('life')) {
      return theme.palette.mode === 'dark' ? '#B91C1C' : '#EF4444';
    } else if (lowerType.includes('hogar') || lowerType.includes('casa') || lowerType.includes('home')) {
      return theme.palette.mode === 'dark' ? '#B45309' : '#F59E0B';
    } else if (lowerType.includes('salud') || lowerType.includes('health')) {
      return theme.palette.mode === 'dark' ? '#065F46' : '#10B981';
    } else if (lowerType.includes('empresa') || lowerType.includes('negocio') || lowerType.includes('business')) {
      return theme.palette.mode === 'dark' ? '#4338CA' : '#6366F1';
    } else {
      return theme.palette.mode === 'dark' ? '#5B21B6' : '#8B5CF6';
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

  // Animación para las tarjetas de póliza
  const policyCardVariants = {
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
            Pólizas Recientes
          </Typography>
        }
        action={
          <Button 
            component={Link}
            href="/dashboard/policies"
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
            Ver todas
          </Button>
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
            <Typography>Cargando pólizas...</Typography>
          </Box>
        ) : recentPolicies.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            minHeight: 200
          }}>
            <Typography color="text.secondary">No hay pólizas recientes</Typography>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ flex: 1 }}>
            {recentPolicies.map((policy, index) => (
              <Box
                key={policy.id}
                component={motion.div}
                custom={index}
                variants={policyCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                sx={{ 
                  p: 2,
                  borderRadius: 3,
                  background: alpha(getPolicyTypeColor(policy.type), 0.05),
                  border: `1px solid ${alpha(getPolicyTypeColor(policy.type), 0.1)}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => window.location.href = `/dashboard/policies?id=${policy.id}`}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Tipo de póliza con icono */}
                  <Avatar
                    sx={{
                      bgcolor: alpha(getPolicyTypeColor(policy.type), 0.2),
                      color: getPolicyTypeColor(policy.type),
                      width: 48,
                      height: 48
                    }}
                  >
                    {getPolicyTypeIcon(policy.type)}
                  </Avatar>
                  
                  {/* Información principal */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {policy.policyNumber}
                      </Typography>
                      <Chip 
                        label={translateStatus(policy.status)}
                        size="small"
                        sx={{ 
                          height: 22,
                          backgroundColor: getStatusColor(policy.status).bg,
                          color: getStatusColor(policy.status).text,
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {policy.type}
                    </Typography>
                  </Box>
                  
                  {/* Información del cliente */}
                  <Tooltip title="Cliente">
                    <Stack 
                      direction="row" 
                      alignItems="center" 
                      spacing={1}
                      sx={{ 
                        minWidth: { xs: '30%', md: '20%' },
                        display: { xs: 'none', sm: 'flex' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/dashboard/customers?id=${policy.customerId}`;
                      }}
                    >
                      <Person fontSize="small" color="action" />
                      <Typography 
                        variant="body2" 
                        color="primary"
                        sx={{ 
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {policy.customerName}
                      </Typography>
                    </Stack>
                  </Tooltip>
                  
                  {/* Prima */}
                  <Tooltip title="Prima anual">
                    <Stack 
                      direction="row" 
                      alignItems="center" 
                      spacing={1}
                      sx={{ 
                        minWidth: { xs: '25%', md: '15%' },
                        justifyContent: 'flex-end'
                      }}
                    >
                      <Euro fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>
                        {formatPrice(policy.premium)}
                      </Typography>
                    </Stack>
                  </Tooltip>
                  
                  {/* Fecha de vencimiento */}
                  <Tooltip title="Fecha de vencimiento">
                    <Stack 
                      direction="row" 
                      alignItems="center" 
                      spacing={1}
                      sx={{ 
                        minWidth: { xs: '25%', md: '15%' },
                        justifyContent: 'flex-end'
                      }}
                    >
                      <CalendarMonth fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatDate(policy.endDate)}
                      </Typography>
                    </Stack>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPoliciesList;