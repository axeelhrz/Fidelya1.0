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
  Chip,
  Divider,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Store as StoreIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';

const CompraViewDialog = ({ open, onClose, compra }) => {
  const theme = useTheme();

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
      month: 'long',
      day: 'numeric'
    });
  };

  if (!compra) return null;

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
          <VisibilityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Detalle de Compra #{compra.id}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Información general */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StoreIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Proveedor
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {compra.proveedor}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha de Compra
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatDate(compra.fecha)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Total de la Compra
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                {formatCurrency(compra.total)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cantidad de Productos
                </Typography>
              </Box>
              <Chip
                label={`${compra.productos?.length || 0} productos`}
                color="primary"
                variant="outlined"
                size="medium"
              />
            </Grid>
          </Grid>

          {compra.notas && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotesIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Notas
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {compra.notas}
                </Typography>
              </Box>
            </>
          )}
        </Paper>

        {/* Detalle de productos */}
        {compra.productos && compra.productos.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Productos Comprados
            </Typography>
            
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Cantidad</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Unidad</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Precio Unitario</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compra.productos.map((producto, index) => (
                    <TableRow 
                      key={index}
                      sx={{
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {producto.producto}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {producto.cantidad}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={producto.unidad}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
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
                  
                  {/* Fila de total */}
                  <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                    <TableCell colSpan={4} sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      TOTAL GENERAL
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.2rem', color: theme.palette.success.main }}>
                      {formatCurrency(compra.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Información adicional */}
        <Paper sx={{ p: 2, mt: 3, bgcolor: alpha(theme.palette.info.main, 0.02) }}>
          <Typography variant="caption" color="text.secondary">
            Compra registrada el {new Date(compra.creado).toLocaleString('es-UY')}
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompraViewDialog;