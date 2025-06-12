import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  GetApp as DownloadIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

// Importar servicios
import { facturacionService } from '../../../services/facturacionService';

const DetalleFactura = ({ open, factura, onClose }) => {
  const [detalleCompleto, setDetalleCompleto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar detalle completo cuando se abre el diálogo
  useEffect(() => {
    if (open && factura) {
      cargarDetalleCompleto();
    }
  }, [open, factura]);

  const cargarDetalleCompleto = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const detalle = await facturacionService.obtenerDetalleFactura(factura.id);
      setDetalleCompleto(detalle);
      
    } catch (error) {
      console.error('Error cargando detalle:', error);
      setError('Error cargando el detalle de la factura');
    } finally {
      setLoading(false);
    }
  };

  const handleExportarPDF = async () => {
    try {
      const resultado = await facturacionService.exportarFacturaPDF(factura.id);
      
      // Simular descarga
      console.log('PDF generado:', resultado.nombre_archivo);
      alert(`PDF generado: ${resultado.nombre_archivo}`);
      
    } catch (error) {
      console.error('Error exportando PDF:', error);
      alert('Error generando el PDF');
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-UY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'emitida':
        return 'success';
      case 'anulada':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
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
            Detalle de Factura
          </Typography>
          {factura && (
            <Chip
              label={factura.nro_factura}
              color="primary"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : detalleCompleto ? (
          <Box>
            {/* Información de la empresa (simulada) */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <BusinessIcon color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    Frutería Nina
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    RUT: 12.345.678-9 • Tel: (02) 1234-5678
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Av. Principal 123, Montevideo, Uruguay
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Información de la factura */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    Datos del Cliente
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Nombre:</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {detalleCompleto.cliente_nombre}
                      </Typography>
                    </Box>
                    
                    {detalleCompleto.cliente_documento && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Documento:</Typography>
                        <Typography variant="body1">
                          {detalleCompleto.cliente_documento}
                        </Typography>
                      </Box>
                    )}
                    
                    {detalleCompleto.cliente_direccion && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Dirección:</Typography>
                        <Typography variant="body1">
                          {detalleCompleto.cliente_direccion}
                        </Typography>
                      </Box>
                    )}
                    
                    {detalleCompleto.cliente_telefono && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Teléfono:</Typography>
                        <Typography variant="body1">
                          {detalleCompleto.cliente_telefono}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon color="primary" />
                    Información de la Factura
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Número:</Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {detalleCompleto.nro_factura}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Fecha:</Typography>
                      <Typography variant="body1">
                        {formatearFecha(detalleCompleto.fecha)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Estado:</Typography>
                      <Chip
                        label={detalleCompleto.estado}
                        color={getEstadoColor(detalleCompleto.estado)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Generado por:</Typography>
                      <Typography variant="body1">
                        {detalleCompleto.generado_por_nombre}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Detalle de productos */}
            <Paper sx={{ mb: 3 }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  Detalle de Productos
                </Typography>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Precio Unit.</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detalleCompleto.productos?.map((producto, index) => (
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

            {/* Totales */}
            <Paper sx={{ p: 3 }}>
              <Grid container>
                <Grid item xs={12} md={8}>
                  {detalleCompleto.observaciones && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Observaciones
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {detalleCompleto.observaciones}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Subtotal:</Typography>
                      <Typography fontWeight="bold">
                        ${detalleCompleto.subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>IVA (22%):</Typography>
                      <Typography fontWeight="bold">
                        ${detalleCompleto.iva.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" color="primary">
                        Total:
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${detalleCompleto.total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExportarPDF}
          disabled={loading || !detalleCompleto}
        >
          Exportar PDF
        </Button>
        
        <Button
          variant="contained"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetalleFactura;