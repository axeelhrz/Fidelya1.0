import React from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { WifiOff, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ConnectionStatus = ({ isConnected, onRetry, lastUpdate }) => {
  if (isConnected) {
    return null; // No mostrar nada si está conectado
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <Alert
          severity="warning"
          icon={<WifiOff />}
          sx={{
            mb: 2,
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<Refresh />}
              sx={{ ml: 1 }}
            >
              Reintentar
            </Button>
          }
        >
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Sin conexión con el servidor
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Verifica que el backend esté ejecutándose en el puerto 5001
            </Typography>
            {lastUpdate && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConnectionStatus;
