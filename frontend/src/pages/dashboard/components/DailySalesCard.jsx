import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { PointOfSale, TrendingUp } from '@mui/icons-material';

const DailySalesCard = ({ data, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU'
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              right: -10,
              opacity: 0.2
            }}
          >
            <PointOfSale sx={{ fontSize: 80 }} />
          </Box>
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PointOfSale sx={{ mr: 1, fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ventas de Hoy
              </Typography>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress color="inherit" size={40} />
              </Box>
            ) : (
              <>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatCurrency(data?.ventasDelDia || 0)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<TrendingUp />}
                    label={`${data?.cantidadVentas || 0} ventas`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailySalesCard;