import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { WarningAmber, Inventory2 } from '@mui/icons-material';

const LowStockAlertCard = ({ data, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WarningAmber sx={{ mr: 1, fontSize: 24, color: '#FF9800' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Stock Bajo
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <>
              {data && data.length > 0 ? (
                <>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {data.length} producto{data.length > 1 ? 's' : ''} con stock bajo
                  </Alert>
                  <List dense>
                    {data.slice(0, 3).map((producto, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={producto.nombre}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                icon={<Inventory2 />}
                                label={`${producto.stock} unidades`}
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary">
                                Mín: {producto.stockMinimo}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  {data.length > 3 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      +{data.length - 3} productos más
                    </Typography>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Inventory2 sx={{ fontSize: 48, color: '#4CAF50', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Todos los productos tienen stock suficiente
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

export default LowStockAlertCard;