import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  Alert,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { purchaseService } from '../../../services/purchaseService';

const DeleteCompraDialog = ({ open, onClose, onSuccess, compra }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  if (!compra) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await purchaseService.eliminarCompra(compra.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error eliminando compra:', error);
    } finally {
      setLoading(false);
    }
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: motion.div,
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            sx: {
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              boxShadow: `0 24px 48px ${alpha(theme.palette.error.main, 0.15)}`,
            }
          }}
          BackdropProps={{
            sx: {
              backgroundColor: alpha(theme.palette.common.black, 0.7),
              backdropFilter: 'blur(8px)',
            }
          }}
        >
          {/* Header del diálogo */}
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
              color: 'white',
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3,
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    color: 'white',
                    width: 48,
                    height: 48,
                  }}
                >
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Eliminar Compra
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Esta acción no se puede deshacer
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={onClose}
                sx={{
                  color: 'white',
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            {/* Alerta de advertencia */}
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                ¿Estás seguro de que deseas eliminar esta compra?
              </Typography>
              <Typography variant="body2">
                Esta acción eliminará permanentemente la compra y todos sus detalles. 
                Los productos no serán devueltos al inventario automáticamente.
              </Typography>
            </Alert>

            {/* Información de la compra a eliminar */}
            <Box 
              sx={{ 
                p: 3,
                borderRadius: 3,
                border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`,
                bgcolor: alpha(theme.palette.error.main, 0.02),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    bgcolor: 'error.main',
                    color: 'white',
                  }}
                >
                  <ShoppingCartIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Compra #{compra.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(compra.fecha)}
                  </Typography>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'error.main',
                  }}
                >
                  {formatCurrency(compra.total)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  label={`Proveedor: ${compra.proveedor_nombre || 'Sin proveedor'}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: 'primary.main',
                  }}
                />
                {compra.numero_comprobante && (
                  <Chip
                    label={`Comprobante: ${compra.numero_comprobante}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: alpha(theme.palette.info.main, 0.3),
                      color: 'info.main',
                    }}
                  />
                )}
                <Chip
                  label={`${compra.detalles?.length || 0} productos`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.secondary.main, 0.3),
                    color: 'secondary.main',
                  }}
                />
              </Box>

              {compra.metodo_pago && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Método de pago:</strong> {compra.metodo_pago.charAt(0).toUpperCase() + compra.metodo_pago.slice(1)}
                </Typography>
              )}
            </Box>

            {/* Lista de productos que se eliminarán */}
            {compra.detalles && compra.detalles.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                  Productos que se eliminarán:
                </Typography>
                <Box 
                  sx={{ 
                    maxHeight: 150, 
                    overflow: 'auto',
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    borderRadius: 2,
                    p: 2,
                    bgcolor: alpha(theme.palette.grey[50], 0.5),
                  }}
                >
                  {compra.detalles.map((detalle, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < compra.detalles.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {detalle.producto_nombre || 'Producto sin nombre'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`${detalle.cantidad} unidades`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem', height: 20 }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main' }}>
                          {formatCurrency(detalle.subtotal || (detalle.cantidad * detalle.precio_unitario))}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              startIcon={<CancelIcon />}
              disabled={loading}
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: alpha(theme.palette.grey[400], 0.5),
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'grey.400',
                  bgcolor: alpha(theme.palette.grey[400], 0.05),
                },
              }}
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleDelete}
              variant="contained"
              disabled={loading}
              startIcon={loading ? null : <DeleteIcon />}
              sx={{
                borderRadius: 3,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.4)}`,
                },
                '&:disabled': {
                  background: alpha(theme.palette.grey[400], 0.3),
                  color: 'text.disabled',
                },
              }}
            >
              {loading ? 'Eliminando...' : 'Eliminar Compra'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default DeleteCompraDialog;