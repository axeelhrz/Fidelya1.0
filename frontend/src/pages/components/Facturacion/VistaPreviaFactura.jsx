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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const VistaPreviaFactura = ({ 
  open, 
  datosFactura, 
  onClose, 
  onConfirmar, 
  loading 
}) => {
  
  const formatearFechaActual = () => {
    return new Date().toLocaleDateString('es-UY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!datosFactura) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>


        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="primary" />
          <Typography variant="h6">
            Vista Previa de Factura
          </Typography>
        </Box>
        
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Simulación de factura profesional */}
        <Box sx={{ 
          bgcolor: 'white', 
          p: 4, 
          border: 1, 
          borderColor: 'grey.300',
          borderRadius: 1
        }}>
          {/* Encabezado de la empresa */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200' }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <BusinessIcon color="primary" sx={{ fontSize: 48 }} />
              </Grid>
              <Grid item xs>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  Frutería Nina
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  RUT: 12.345.678-9
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Av. Principal 123, Montevideo, Uruguay
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tel: (02) 1234-5678 • Email: info@fruteria-nina.com
                </Typography>
              </Grid>
              <Grid item>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    FACTURA
                  </Typography>
                  <Typography variant="h6" color="primary">
                    FCT-000001
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatearFechaActual()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Datos del cliente */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'grey.200' }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.main'
                }}>
                  <PersonIcon />
                  Facturar a:
                </Typography>
                
                <Box sx={{ pl: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {datosFactura.cliente_nombre}
                  </Typography>
                  
                  {datosFactura.cliente_documento && (
                    <Typography variant="body2" color="text.secondary">
                      Documento: {datosFactura.cliente_documento}
                    </Typography>
                  )}
                  
                  {datosFactura.cliente_direccion && (
                    <Typography variant="body2" color="text.secondary">
                      Dirección: {datosFactura.cliente_direccion}
                    </Typography>
                  )}
                  
                  {datosFactura.cliente_telefono && (
                    <Typography variant="body2" color="text.secondary">
                      Teléfono: {datosFactura.cliente_telefono}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'grey.200' }}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Condiciones de Pago
                </Typography>
                
                <Box sx={{ pl: 1 }}>
                  <Typography variant="body2">
                    • Pago al contado
                  </Typography>
                  <Typography variant="body2">
                    • Moneda: Pesos Uruguayos (UYU)
                  </Typography>
                  <Typography variant="body2">
                    • IVA incluido
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Detalle de productos */}
          <Paper sx={{ mb: 4, border: 1, borderColor: 'grey.200' }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.50', 
              borderBottom: 1, 
              borderColor: 'primary.200' 
            }}>
              <Typography variant="h6" color="primary.main">
                Detalle de Productos
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio Unit.</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datosFactura.productos.map((producto, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {producto.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {producto.cantidad}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ${producto.precio_unitario.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          ${producto.total.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Totales y observaciones */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {datosFactura.observaciones && (
                <Paper sx={{ p: 2, border: 1, borderColor: 'grey.200' }}>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    Observaciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {datosFactura.observaciones}
                  </Typography>
                </Paper>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                border: 2, 
                borderColor: 'primary.200',
                bgcolor: 'primary.50'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${datosFactura.subtotal.toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">IVA (22%):</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${datosFactura.iva.toFixed(2)}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2, borderColor: 'primary.300' }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    TOTAL:
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    ${datosFactura.total.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Pie de factura */}
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'grey.300' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Firma del Cajero:</strong>
                </Typography>
                <Box sx={{ 
                  height: 40, 
                  borderBottom: 1, 
                  borderColor: 'grey.400',
                  mt: 2,
                  mb: 1
                }} />
                <Typography variant="caption" color="text.secondary">
                  Nombre y firma
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
                  Esta factura es válida como comprobante fiscal
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
                  Gracias por su compra
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onClose}
          disabled={loading}
        >
          Editar
        </Button>
        
        <Button
          variant="contained"
          startIcon={<CheckIcon />}
          onClick={() => onConfirmar(datosFactura)}
          disabled={loading}
          size="large"
          sx={{ minWidth: 150 }}
        >
          {loading ? 'Generando...' : 'Confirmar y Emitir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VistaPreviaFactura;
