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
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { purchaseService } from '../../../services/purchaseService';

const DeleteCompraDialog = ({ open, onClose, onSuccess, compra }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (!compra) return;

    setLoading(true);
    setError(null);

    try {
      await purchaseService.eliminarCompra(compra.id);
      onSuccess();
    } catch (error) {
      console.error('Error eliminando compra:', error);
      setError(error.message || 'Error al eliminar la compra');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!compra) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon sx={{ mr: 1, color: theme.palette.error.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirmar Eliminación
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <DeleteIcon 
            sx={{ 
              fontSize: 64, 
              color: theme.palette.error.main,
              mb: 2 
            }} 
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            ¿Estás seguro de que deseas eliminar esta compra?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Esta acción no se puede deshacer. Se eliminará permanentemente la compra y todos sus detalles.
          </Typography>
        </Box>

        {/* Información de la compra */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: alpha(theme.palette.error.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Detalles de la compra a eliminar:
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Compra #:
            </Typography>
            <Typography variant="body2">
              {compra.id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Proveedor:
            </Typography>
            <Typography variant="body2">
              {compra.proveedor}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Fecha:
            </Typography>
            <Typography variant="body2">
              {formatDate(compra.fecha)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Total:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
              {formatCurrency(compra.total)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Productos:
            </Typography>
            <Typography variant="body2">
              {compra.cantidad_productos} productos
            </Typography>
          </Box>
        </Box>

        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Nota:</strong> El stock de los productos no se revertirá automáticamente. 
            Si necesitas ajustar el inventario, hazlo manualmente desde el módulo de inventario.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={loading}
        >
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
          {loading ? 'Eliminando...' : 'Eliminar Compra'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCompraDialog;