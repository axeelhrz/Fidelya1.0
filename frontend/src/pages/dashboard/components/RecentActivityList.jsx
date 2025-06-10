import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  Grid,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ReceiptLong, 
  PointOfSale, 
  ShoppingCart, 
  Settings,
  Timeline,
  TrendingUp
} from '@mui/icons-material';

const RecentActivityList = ({ data, loading }) => {
  const theme = useTheme();

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'venta':
        return <PointOfSale />;
      case 'compra':
        return <ShoppingCart />;
      case 'ajuste':
        return <Settings />;
      default:
        return <ReceiptLong />;
    }
  };

  const getActivityColor = (tipo) => {
    switch (tipo) {
      case 'venta':
        return theme.palette.success.main;
      case 'compra':
        return theme.palette.info.main;
      case 'ajuste':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getActivityBgColor = (tipo) => {
    switch (tipo) {
      case 'venta':
        return alpha(theme.palette.success.main, 0.1);
      case 'compra':
        return alpha(theme.palette.info.main, 0.1);
      case 'ajuste':
        return alpha(theme.palette.warning.main, 0.1);
      default:
        return alpha(theme.palette.grey[500], 0.1);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ActivityCard = ({ movimiento, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card
        sx={{
          height: '100%',
          background: getActivityBgColor(movimiento.tipo),
          border: `1px solid ${alpha(getActivityColor(movimiento.tipo), 0.2)}`,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${alpha(getActivityColor(movimiento.tipo), 0.15)}`,
          }
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: getActivityColor(movimiento.tipo),
                fontSize: 18
              }}
            >
              {getActivityIcon(movimiento.tipo)}
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {movimiento.detalle}
              </Typography>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  display: 'block',
                  mb: 1
                }}
              >
                {formatDateTime(movimiento.fecha)}
              </Typography>
              
              <Chip
                label={movimiento.tipo}
                size="small"
                sx={{
                  backgroundColor: getActivityColor(movimiento.tipo),
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 22,
                  textTransform: 'capitalize',
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      style={{ height: '100%' }}
    >
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.8)} 0%, 
            ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
                }}
              >
                <Timeline sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  Actividad Reciente
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                  Últimos movimientos del sistema
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <TrendingUp sx={{ fontSize: 16, color: theme.palette.primary.main }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }}
              >
                En tiempo real
              </Typography>
            </Box>
          </Box>
          
          {/* Content */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            {loading ? (
              <Grid container spacing={2}>
                {[...Array(6)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                    <Card sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="80%" height={20} />
                          <Skeleton variant="text" width="60%" height={16} />
                          <Skeleton variant="rectangular" width={60} height={22} sx={{ mt: 1, borderRadius: 1 }} />
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <>
                {data && data.length > 0 ? (
                  <Grid container spacing={2}>
                    {data.slice(0, 6).map((movimiento, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                        <ActivityCard movimiento={movimiento} index={index} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center'
                  }}>
                    <Timeline sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No hay actividad reciente
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Los movimientos del sistema aparecerán aquí
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivityList;