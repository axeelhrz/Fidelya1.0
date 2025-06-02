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
  Paper,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { proveedorService } from '../../../services/proveedorService';

const DeleteProveedorDialog = ({ open, onClose, onSuccess, proveedor }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!proveedor) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await proveedorService.eliminarProveedor(proveedor.id);
      onSuccess('Proveedor eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      setError(error.message || 'Error al eliminar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon sx={{ mr: 2, color: 'error.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Eliminar Proveedor
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              ¿Estás seguro de que deseas eliminar este proveedor?
            </Typography>
            <Typography variant="body2">
              Esta acción no se puede deshacer. El proveedor no se podrá eliminar si tiene compras asociadas.

            </Typography>
          </Alert>

          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Detalles del proveedor a eliminar:
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ID:
                </Typography>
                <Chip label={`#${proveedor.id}`} size="small" variant="outlined" />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Nombre:
                </Typography>
                <Typography variant="body2">
                  {proveedor.nombre}
                </Typography>
              </Box>
              
              {proveedor.rut && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    RUT:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {proveedor.rut}
                  </Typography>
                </Box>
              )}
              
              {proveedor.telefono && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Teléfono:
                  </Typography>
                  <Typography variant="body2">
                    {proveedor.telefono}
                  </Typography>
                </Box>
              )}
              
              {proveedor.direccion && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Dirección:
                  </Typography>
                  <Typography variant="body2" sx={{ maxWidth: 200, textAlign: 'right' }}>
                    {proveedor.direccion}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={<DeleteIcon />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProveedorDialog;