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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { ventasService } from '../../../services/ventasService';

const DeleteVentaDialog = ({ open, onClose, onSuccess, venta }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-UY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const handleDelete = async () => {
    if (!venta) return;

    setLoading(true);
    setError(null);

    try {
      await ventasService.eliminarVenta(venta.id);
      onSuccess();
    } catch (error) {
      console.error('Error eliminando venta:', error);
      setError(error.message || 'Error al eliminar la venta');
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

  if (!venta) {
    return null;
  }

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
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}>
        <WarningIcon sx={{ mr: 1, color: theme.palette.error.main }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Confirmar Eliminación
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>¡Atención!</strong> Esta acción no se puede deshacer. 
            Al eliminar la venta, el stock de los productos será restaurado automáticamente.
          </Typography>
        </Alert>

        <Box sx={{ 
          p: 2, 
          bgcolor: alpha(theme.palette.error.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.error.main }}>
            Venta a Eliminar:
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ID de Venta:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              #{venta.id}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Cliente:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {venta.cliente_nombre || 'Venta rápida'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Fecha:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formatDate(venta.fecha)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
              {formatCurrency(venta.total)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Productos:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {venta.cantidad_productos} producto{venta.cantidad_productos !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
          Nota: Solo se pueden eliminar ventas del día actual y que no estén en estado "completada", 
          a menos que seas administrador.
        </Typography>
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
          {loading ? 'Eliminando...' : 'Eliminar Venta'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteVentaDialog;