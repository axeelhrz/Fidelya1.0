import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CompraViewDialog = ({ open, onClose, compra }) => {
  if (!compra) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
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

  const handlePrint = () => {
    window.print();
  };

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
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Detalle de Compra #{compra.id}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handlePrint} sx={{ mr: 1 }}>
              <PrintIcon />
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Información del Proveedor */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {compra.proveedor?.nombre || 'Proveedor no disponible'}
                </Typography>
                {compra.proveedor?.rut && (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    RUT: {compra.proveedor.rut}
                  </Typography>
                )}
                {compra.proveedor?.telefono && (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Teléfono: {compra.proveedor.telefono}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Información de la Compra */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Compra
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatDate(compra.fecha)}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ReceiptIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Nº Comprobante
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {compra.nro_comprobante || 'Sin comprobante'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Productos */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Productos Comprados
                </Typography>
                <Chip
                  label={`${compra.productos?.length || 0} items`}
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Unidad</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Precio Unit.</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compra.productos?.map((producto, index) => (
                    <motion.tr
                      key={index}
                      component={TableRow}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                        '&:last-child td': { border: 0 }
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
                          variant="outlined"
                          color="info"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {producto.unidad}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatCurrency(producto.precio_unitario)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: 'success.main'
                          }}
                        >
                          {formatCurrency(producto.subtotal)}
                        </Typography>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Total y Observaciones */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {compra.observaciones && (
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Observaciones
                  </Typography>
                  <Typography variant="body2">
                    {compra.observaciones}
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                  textAlign: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <MoneyIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    Total de la Compra
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {formatCurrency(compra.total)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Información adicional */}
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Compra registrada el: {formatDate(compra.creado)}
            </Typography>
            
            {compra.comprobante_pdf && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ReceiptIcon />}
                onClick={() => window.open(compra.comprobante_pdf, '_blank')}
              >
                Ver Comprobante PDF
              </Button>
            )}
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompraViewDialog;