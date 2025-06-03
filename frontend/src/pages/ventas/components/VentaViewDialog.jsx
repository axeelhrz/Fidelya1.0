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
  Card,
  CardContent,
  Avatar,
  Stack,
  Fade,
  motion,
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  ShoppingCart as ShoppingCartIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
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
      return {
        date: date.toLocaleDateString('es-UY', {
        year: 'numeric',
        month: 'long',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('es-UY', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        full: date.toLocaleDateString('es-UY', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
  };
    } catch (error) {
      return { date: 'Fecha inválida', time: '', full: 'Fecha inválida' };
    }
  };

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 'completada':
        return { 
          color: 'success', 
          label: 'Completada',
          icon: '✅',
          bgColor: alpha(theme.palette.success.main, 0.1)
  };
      case 'borrador':
        return { 
          color: 'warning', 
          label: 'Borrador',
          icon: '📝',
          bgColor: alpha(theme.palette.warning.main, 0.1)
};
      case 'cancelada':
        return { 
          color: 'error', 
          label: 'Cancelada',
          icon: '❌',
          bgColor: alpha(theme.palette.error.main, 0.1)
        };
      default:
        return { 
          color: 'default', 
          label: 'Completada',
          icon: '✅',
          bgColor: alpha(theme.palette.success.main, 0.1)
        };
    }
  };

  const getFormaPagoConfig = (formaPago) => {
    switch (formaPago) {
      case 'efectivo':
        return { color: '#10B981', icon: '💵', label: 'Efectivo' };
      case 'tarjeta':
        return { color: '#3B82F6', icon: '💳', label: 'Tarjeta' };
      case 'transferencia':
        return { color: '#F59E0B', icon: '🏦', label: 'Transferencia' };
      case 'mixto':
        return { color: '#8B5CF6', icon: '🔄', label: 'Mixto' };
      default:
        return { color: theme.palette.grey[500], icon: '💵', label: 'Efectivo' };
    }
  };

  if (!venta) {
    return null;
  }

  const fechaFormateada = formatDate(venta.fecha);
  const estadoConfig = getEstadoConfig(venta.estado);
  const formaPagoConfig = getFormaPagoConfig(venta.forma_pago);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 4,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 1, color: theme.palette.info.main }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              🧾 Detalle de Venta #{venta.id}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fechaFormateada.full}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ p: 3 }}>
            {/* Header con estado */}
            <Card sx={{ 
              mb: 3, 
              background: `linear-gradient(135deg, ${estadoConfig.bgColor} 0%, ${alpha(estadoConfig.bgColor, 0.5)} 100%)`,
              border: `1px solid ${alpha(theme.palette[estadoConfig.color].main, 0.2)}`
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '2rem', mr: 2 }}>
                    {estadoConfig.icon}
                  </Typography>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Venta {estadoConfig.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: #{venta.id} • {fechaFormateada.date} a las {fechaFormateada.time}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={estadoConfig.label}
                  color={estadoConfig.color}
                  sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                />
              </CardContent>
            </Card>

            {/* Información general */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Cliente */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        👤 Cliente
                      </Typography>
                    </Box>
                    
                    {venta.cliente ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48, 
                          mr: 2,
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          fontSize: '1.2rem',
                          fontWeight: 600
                        }}>
                          {venta.cliente.nombre.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {venta.cliente.nombre}
                          </Typography>
                          {venta.cliente.correo && (
                            <Typography variant="body2" color="text.secondary">
                              📧 {venta.cliente.correo}
                            </Typography>
                          )}
                          {venta.cliente.telefono && (
                            <Typography variant="body2" color="text.secondary">
                              📱 {venta.cliente.telefono}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48, 
                          mr: 2,
                          backgroundColor: alpha(theme.palette.grey[500], 0.1),
                          color: theme.palette.grey[500]
                        }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Venta Rápida
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Sin cliente registrado
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Vendedor y Forma de Pago */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        💳 Información de Pago
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Vendedor:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          👨‍💼 {venta.usuario_nombre || 'Usuario desconocido'}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Forma de Pago:
                        </Typography>
                        <Chip
                          label={`${formaPagoConfig.icon} ${formaPagoConfig.label}`}
                          sx={{
                            backgroundColor: alpha(formaPagoConfig.color, 0.1),
                            color: formaPagoConfig.color,
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Productos */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ShoppingCartIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    🛒 Productos Vendidos
                  </Typography>
                  <Chip 
                    label={`${venta.productos?.length || 0} producto${(venta.productos?.length || 0) !== 1 ? 's' : ''}`}
                    size="small"
                    color="primary"
                    sx={{ ml: 2 }}
                  />
                </Box>
                
                <TableContainer component={Paper} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">Cantidad</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Precio Unit.</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {venta.productos?.map((producto, index) => (
                        <motion.tr
                          key={index}
                          component={TableRow}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {producto.producto_nombre}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={producto.cantidad}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {formatCurrency(producto.precio_unitario)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                              {formatCurrency(producto.subtotal)}
                            </Typography>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Totales */}
            <Card sx={{ 
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: theme.palette.success.main }}>
                  💰 Resumen de Totales
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">Subtotal:</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatCurrency(venta.subtotal)}
                        </Typography>
                      </Box>
                      
                      {venta.descuento > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" color="error">Descuento:</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }} color="error">
                            -{formatCurrency(venta.descuento)}
                          </Typography>
                        </Box>
                      )}
                      
                      {venta.impuestos > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1">Impuestos:</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            +{formatCurrency(venta.impuestos)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ 
                      backgroundColor: theme.palette.success.main,
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <CardContent>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                          {formatCurrency(venta.total)}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          TOTAL FINAL
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Observaciones */}
            {venta.observaciones && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    📝 Observaciones
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    p: 2, 
                    backgroundColor: alpha(theme.palette.grey[500], 0.05),
                    borderRadius: 2,
                    fontStyle: 'italic'
                  }}>
                    "{venta.observaciones}"
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backgroundColor: alpha(theme.palette.background.default, 0.5)
      }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ borderRadius: 3 }}
            onClick={() => {
              // Implementar impresión
              console.log('Imprimir venta:', venta.id);
            }}
          >
            Imprimir
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            sx={{ borderRadius: 3 }}
            onClick={() => {
              // Implementar compartir
              console.log('Compartir venta:', venta.id);
            }}
          >
            Compartir
          </Button>
          
          <Button 
            onClick={onClose} 
            variant="contained"
            sx={{ borderRadius: 3 }}
          >
            Cerrar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default VentaViewDialog;