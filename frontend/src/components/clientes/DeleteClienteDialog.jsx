import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Servicios
import { eliminarCliente } from '../../services/clienteService';

const DeleteClienteDialog = ({ open, onClose, cliente, onClienteDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!cliente) return;

    try {
      setLoading(true);
      setError('');
      await eliminarCliente(cliente.id);
      onClienteDeleted();
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      setError(error.message || 'Error al eliminar el cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  if (!cliente) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.9, y: 50 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 50 },
            transition: { duration: 0.3, ease: "easeOut" },
            sx: {
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }
          }}
        >
          {/* Header */}
          <DialogTitle sx={{ 
            pb: 2,
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            borderRadius: '16px 16px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Confirmar Eliminación
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Esta acción no se puede deshacer
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          {/* Content */}
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Typography variant="body1" gutterBottom>
                ¿Estás seguro de que deseas eliminar este cliente?
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Toda la información del cliente se perderá permanentemente.
              </Typography>

              {/* Información del cliente */}
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'grey.50', 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PersonIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    {cliente.nombre}
                  </Typography>
                  <Chip 
                    label={`ID: ${cliente.id}`} 
                    size="small" 
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {cliente.correo && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: 'info.main' }} />
                      <Typography variant="body2">
                        {cliente.correo}
                      </Typography>
                    </Box>
                  )}
                  
                  {cliente.telefono && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      <Typography variant="body2">
                        {cliente.telefono}
                      </Typography>
                    </Box>
                  )}

                  {cliente.direccion && (
                    <Typography variant="body2" color="text.secondary">
                      📍 {cliente.direccion}
                    </Typography>
                  )}

                  {cliente.notas && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      💬 {cliente.notas}
                    </Typography>
                  )}
                </Box>
              </Box>
            </motion.div>
          </DialogContent>

          {/* Actions */}
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Eliminando...' : 'Eliminar Cliente'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default DeleteClienteDialog;