import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const DeleteProductDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  producto = null,
  loading = false 
}) => {
  const [confirmText, setConfirmText] = useState('');
  
  if (!producto) return null;

  const isConfirmValid = confirmText.toLowerCase() === producto.nombre.toLowerCase();

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm(producto.id);
      setConfirmText('');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'error.main',
                color: 'white',
              }}
            >
              <WarningIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600} color="error.main">
                Eliminar Producto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esta acción no se puede deshacer
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>¡Atención!</strong> Estás a punto de eliminar permanentemente este producto.
              Todos los datos asociados se perderán.
            </Typography>
          </Alert>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
              mb: 3,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Producto a eliminar:
            </Typography>
            <Typography variant="h6" color="error.main" gutterBottom>
              {producto.nombre}
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                Categoría: <strong>{producto.categoria}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stock: <strong>{producto.stock_actual} {producto.unidad}</strong>
              </Typography>
              {producto.proveedor && (

                <Typography variant="body2" color="text.secondary">
                  Proveedor: <strong>{producto.proveedor}</strong>
                </Typography>
              )}
            </Box>
          </Box>

          <Typography variant="body2" fontWeight={600} gutterBottom>
            Para confirmar, escribe el nombre del producto:
          </Typography>
          
          <TextField
            fullWidth
            placeholder={`Escribe "${producto.nombre}" para confirmar`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            error={confirmText.length > 0 && !isConfirmValid}
            helperText={
              confirmText.length > 0 && !isConfirmValid
                ? 'El nombre no coincide'
                : 'Escribe el nombre exacto del producto'
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            size="large"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            size="large"
            startIcon={<DeleteIcon />}
            disabled={!isConfirmValid || loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default DeleteProductDialog;