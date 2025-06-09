import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  Inventory as InventoryIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const CompraViewDialog = ({ open, onClose, compra, onEdit }) => {
  const theme = useTheme();

  if (!compra) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getMetodoPagoColor = (metodo) => {
    const colores = {
      efectivo: '#10B981',
      transferencia: '#3B82F6',
      cheque: '#F59E0B',
      credito: '#8B5CF6'
    };
    return colores[metodo] || '#6B7280';
  };

  const getMetodoPagoIcon = (metodo) => {
    switch (metodo) {
      case 'efectivo':
        return '💵';
      case 'transferencia':
        return '🏦';
      case 'cheque':
        return '📝';
      case 'credito':
        return '💳';
      default:
        return '💰';
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
          maxWidth="md"
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
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.15)}`,
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
              background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
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
                  <ShoppingCartIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Detalle de Compra
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Compra #{compra.id} - {formatDate(compra.fecha)}
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

          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: 3 }}>
              {/* Información general */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BusinessIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Información del Proveedor
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor: 'primary.main',
                            fontSize: '1rem',
                            fontWeight: 600,
                          }}
                        >
                          {compra.proveedor_nombre?.charAt(0).toUpperCase() || 'P'}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {compra.proveedor_nombre || 'Sin proveedor'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {compra.proveedor_id || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Fecha de compra
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                        {formatDate(compra.fecha)}
                      </Typography>

                      {compra.numero_comprobante && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ReceiptIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              Número de comprobante
                            </Typography>
                          </Box>
                          <Chip
                            label={compra.numero_comprobante}
                            variant="outlined"
                            sx={{
                              bgcolor: alpha(getMetodoPagoColor(compra.metodo_pago), 0.1),
                              color: getMetodoPagoColor(compra.metodo_pago),
                              border: `1px solid ${alpha(getMetodoPagoColor(compra.metodo_pago), 0.3)}`,
                              fontWeight: 600,
                            }}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AttachMoneyIcon sx={{ color: 'success.main', mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Información de Pago
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Método de pago
                        </Typography>
                        <Chip
                          label={`${getMetodoPagoIcon(compra.metodo_pago)} ${compra.metodo_pago?.charAt(0).toUpperCase() + compra.metodo_pago?.slice(1) || 'No especificado'}`}
                          sx={{
                            bgcolor: alpha(getMetodoPagoColor(compra.metodo_pago), 0.1),
                            color: getMetodoPagoColor(compra.metodo_pago),
                            border: `1px solid ${alpha(getMetodoPagoColor(compra.metodo_pago), 0.3)}`,
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Total de la compra
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {formatCurrency(compra.total)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={<InventoryIcon />}
                          label={`${compra.detalles?.length || 0} productos`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Observaciones */}
              {compra.observaciones && (
                <Card 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Observaciones
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      {compra.observaciones}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Detalle de productos */}
              {compra.detalles && compra.detalles.length > 0 && (
                <Card 
                  sx={{ 
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Detalle de Productos
                      </Typography>
                    </Box>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                            <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Precio Unit.</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {compra.detalles.map((detalle, index) => (
                            <motion.tr
                              key={index}
                              component={TableRow}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              sx={{
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                                }
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      mr: 2,
                                      bgcolor: 'secondary.main',
                                      fontSize: '0.875rem',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {detalle.producto_nombre?.charAt(0).toUpperCase() || 'P'}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {detalle.producto_nombre || 'Producto sin nombre'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      ID: {detalle.producto_id}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={detalle.cantidad}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {formatCurrency(detalle.precio_unitario)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                                  {formatCurrency(detalle.subtotal || (detalle.cantidad * detalle.precio_unitario))}
                                </Typography>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Total final */}
                    <Box 
                      sx={{ 
                        p: 3, 
                        borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        bgcolor: alpha(theme.palette.success.main, 0.02),
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Total de la compra:
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {formatCurrency(compra.total)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: alpha(theme.palette.info.main, 0.5),
                color: 'info.main',
                '&:hover': {
                  borderColor: 'info.main',
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                },
              }}
            >
              Imprimir
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: alpha(theme.palette.secondary.main, 0.5),
                color: 'secondary.main',
                '&:hover': {
                  borderColor: 'secondary.main',
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                },
              }}
            >
              Exportar
            </Button>

            {onEdit && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {
                  onEdit(compra);
                  onClose();
                }}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.warning.main, 0.4)}`,
                  },
                }}
              >
                Editar Compra
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                borderRadius: 3,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CompraViewDialog;