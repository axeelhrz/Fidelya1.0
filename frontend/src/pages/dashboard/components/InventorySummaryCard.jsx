import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Inventory } from '@mui/icons-material';

const InventorySummaryCard = ({ data, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
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
            <Inventory sx={{ fontSize: 80 }} />
          </Box>
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Inventory sx={{ mr: 1, fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total Productos
              </Typography>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress color="inherit" size={40} />
              </Box>
            ) : (
              <>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {data?.totalProductos || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Productos en inventario
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InventorySummaryCard;