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
  Card,
  CardContent,
  Stack,
  Chip,
  Fade,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
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
        sx: { 
          borderRadius: 4,
          border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`
      }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <ErrorOutlineIcon sx={{ 
            mr: 2, 
            color: theme.palette.error.main,
            fontSize: 32
          }} />
        </motion.div>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
            ⚠️ Confirmar Eliminación
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta acción no se puede deshacer
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ p: 3 }}>
            {error && (
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    fontWeight: 500
                  }}
                  icon={<WarningIcon />}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Advertencia principal */}
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                backgroundColor: alpha(theme.palette.warning.main, 0.1)
              }}
              icon={<WarningIcon sx={{ fontSize: 24 }} />}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                ¡Atención! Esta acción es irreversible
              </Typography>
              <Typography variant="body2">
                Al eliminar la venta, el stock de los productos será restaurado automáticamente.
                Asegúrate de que realmente deseas proceder con esta acción.
              </Typography>
            </Alert>

            {/* Información de la venta */}
            <Card sx={{ 
              border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
              backgroundColor: alpha(theme.palette.error.main, 0.02)
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <DeleteIcon sx={{ color: theme.palette.error.main, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                      Venta a Eliminar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Revisa los detalles antes de confirmar
                    </Typography>
                  </Box>
                </Box>
                
                <Stack spacing={2}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: alpha(theme.palette.grey[500], 0.05),
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      ID de Venta:
                    </Typography>
                    <Chip 
                      label={`#${venta.id}`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: alpha(theme.palette.grey[500], 0.05),
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Cliente:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {venta.cliente_nombre || 'Venta rápida'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: alpha(theme.palette.grey[500], 0.05),
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha y Hora:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatDate(venta.fecha)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Total de la Venta:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                      {formatCurrency(venta.total)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: alpha(theme.palette.info.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Productos:
                    </Typography>
                    <Chip
                      label={`${venta.cantidad_productos} producto${venta.cantidad_productos !== 1 ? 's' : ''}`}
                      size="small"
                      color="info"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Nota adicional */}
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              backgroundColor: alpha(theme.palette.info.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                💡 <strong>Nota:</strong> Solo se pueden eliminar ventas del día actual y que no estén en estado "completada", 
                a menos que tengas permisos de administrador. El stock de los productos se restaurará automáticamente.
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.background.default, 0.5)
      }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            disabled={loading}
            startIcon={<CancelIcon />}
            sx={{ 
              borderRadius: 3,
              minWidth: 120
            }}
          >
            Cancelar
          </Button>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={loading ? null : <DeleteIcon />}
              sx={{ 
                minWidth: 140,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                  boxShadow: theme.shadows[8]
                },
                '&:disabled': {
                  background: theme.palette.grey[300]
                }
              }}
            >
              {loading ? 'Eliminando...' : 'Eliminar Venta'}
            </Button>
          </motion.div>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteVentaDialog;