import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ReceiptLong, 
  PointOfSale, 
  ShoppingCart, 
  Settings,
  Timeline
} from '@mui/icons-material';

const RecentActivityList = ({ data, loading }) => {
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
        return '#4CAF50';
      case 'compra':
        return '#2196F3';
      case 'ajuste':
        return '#FF9800';
      default:
        return '#9E9E9E';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Timeline sx={{ mr: 1, fontSize: 24, color: '#9C27B0' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Actividad Reciente
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <>
              {data && data.length > 0 ? (
                <List dense>
                  {data.map((movimiento, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: getActivityColor(movimiento.tipo),
                            fontSize: 16
                          }}
                        >
                          {getActivityIcon(movimiento.tipo)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {movimiento.detalle}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(movimiento.fecha)}
                            </Typography>
                            <Chip
                              label={movimiento.tipo}
                              size="small"
                              sx={{
                                backgroundColor: getActivityColor(movimiento.tipo),
                                color: 'white',
                                fontSize: '0.7rem',
                                height: 20,
                                textTransform: 'capitalize'
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Timeline sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay actividad reciente
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivityList;