'use client';

import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Typography, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  useTheme, 
  alpha 
} from '@mui/material';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowForward } from '@mui/icons-material';

// Tipos para las pólizas
interface Policy {
  id: string;
  number: string;
  type: string;
  clientName: string;
  clientId: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  premium: number;
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  createdAt: Timestamp | Date;
}

const RecentPoliciesList = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Suscripción a las pólizas recientes en tiempo real desde Firestore
    const unsubscribe = onSnapshot(
      query(
        collection(db, `users/${user.uid}/policies`),
        orderBy('createdAt', 'desc'),
        limit(5)
      ),
      (snapshot) => {
        const policiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Policy[];
        
        setPolicies(policiesData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

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

  // Animación para las filas de la tabla
  const rowVariants = {
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
      scale: 1.01,
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
      <CardContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography>Cargando pólizas...</Typography>
          </Box>
        ) : policies.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary">No hay pólizas recientes</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Prima</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {policies.map((policy, index) => (
                  <TableRow
                    key={policy.id}
                    component={motion.tr}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    sx={{ 
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                    onClick={() => window.location.href = `/dashboard/policies?id=${policy.id}`}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {policy.number}
                      </Typography>
                    </TableCell>
                    <TableCell>{policy.type}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/customers?id=${policy.clientId}`} passHref>
                        <Typography 
                          component="a" 
                          variant="body2" 
                          color="primary"
                          sx={{ 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {policy.clientName}
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell>{formatPrice(policy.premium)}</TableCell>
                    <TableCell>{formatDate(policy.endDate)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={translateStatus(policy.status)}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(policy.status).bg,
                          color: getStatusColor(policy.status).text,
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPoliciesList;