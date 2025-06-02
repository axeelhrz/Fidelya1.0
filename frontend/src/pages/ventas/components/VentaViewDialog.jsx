import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

const VentaViewDialog = ({ open, onClose, venta }) => {
  const theme = useTheme();

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
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada':
        return 'success';
      case 'borrador':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getFormaPagoColor = (formaPago) => {
    switch (formaPago) {
      case 'efectivo':
        return '#4CAF50';
      case 'tarjeta':
        return '#2196F3';
      case 'transferencia':
        return '#FF9800';
      case 'mixto':
        return '#9C27B0';
      default:
        return theme.palette.grey[500];
    }
  };

  if (!venta) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
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
          <ReceiptIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Detalle de Venta #{venta.id}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Información general */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Información General
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha y Hora
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formatDate(venta.fecha)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Estado
                </Typography>
                <Chip
                  label={venta.estado?.toUpperCase() || 'COMPLETADA'}
                  color={getEstadoColor(venta.estado)}
                  size="small"
                  sx={{ fontWeight: 500, mt: 0.5 }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Vendedor
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venta.usuario_nombre || 'Usuario desconocido'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.02) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Cliente
                </Typography>
              </Box>
              
              {venta.cliente ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {venta.cliente.nombre}
                    </Typography>
                  </Box>
                  
                  {venta.cliente.correo && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Correo
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {venta.cliente.correo}
                      </Typography>
                    </Box>
                  )}
                  
                  {venta.cliente.telefono && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {venta.cliente.telefono}
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Venta rápida (sin cliente registrado)
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Forma de pago */}
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.02) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoneyIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Forma de Pago
              </Typography>
            </Box>
            
            <Chip
              label={venta.forma_pago?.toUpperCase() || 'EFECTIVO'}
              sx={{
                backgroundColor: alpha(getFormaPagoColor(venta.forma_pago), 0.1),
                color: getFormaPagoColor(venta.forma_pago),
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            />
          </Paper>
        </Box>

        {/* Productos */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ShoppingCartIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Productos Vendidos
            </Typography>
          </Box>
          
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                  <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Cantidad</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Precio Unit.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {venta.productos?.map((producto, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {producto.producto_nombre}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {producto.cantidad}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatCurrency(producto.precio_unitario)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(producto.subtotal)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Totales */}
        <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.02) }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Resumen de Totales
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatCurrency(venta.subtotal)}
                </Typography>
              </Box>
              
              {venta.descuento > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="error">Descuento:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }} color="error">
                    -{formatCurrency(venta.descuento)}
                  </Typography>
                </Box>
              )}
              
              {venta.impuestos > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Impuestos:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    +{formatCurrency(venta.impuestos)}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {formatCurrency(venta.total)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Observaciones */}
        {venta.observaciones && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.grey[500], 0.02) }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Observaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {venta.observaciones}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VentaViewDialog;