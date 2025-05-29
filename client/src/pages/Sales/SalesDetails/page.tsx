import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import { Print, Receipt } from '@mui/icons-material';

interface Sale {
  id: string;
  saleNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  client?: { name: string };
  user: { name: string };
  saleItems: Array<{
    quantity: number;
    price: number;
    subtotal: number;
    product: { name: string; unit: string };
  }>;
}

interface SaleDetailsProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
}

const SaleDetails: React.FC<SaleDetailsProps> = ({ open, onClose, sale }) => {
  if (!sale) return null;

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Efectivo';
      case 'CARD':
        return 'Tarjeta';
      case 'TRANSFER':
        return 'Transferencia';
      case 'CREDIT':
        return 'Crédito';
      default:
        return method;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'success';
      case 'CARD':
        return 'primary';
      case 'TRANSFER':
        return 'info';
      case 'CREDIT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handlePrint = () => {
    // Implementar lógica de impresión
    window.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt />
          Detalles de Venta - {sale.saleNumber}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Información general */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Información General
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Cliente
                </Typography>
                <Typography variant="body1">
                  {sale.client?.name || 'Cliente general'}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Vendedor
                </Typography>
                <Typography variant="body1">
                  {sale.user.name}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha
                </Typography>
                <Typography variant="body1">
                  {new Date(sale.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Método de Pago
                </Typography>
                <Chip
                  label={getPaymentMethodLabel(sale.paymentMethod)}
                  color={getPaymentMethodColor(sale.paymentMethod) as any}
                  size="small"
                />
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Productos */}
          <Box>
            

            <Typography variant="h6" sx={{ mb: 2 }}>
              Productos Vendidos
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sale.saleItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {item.product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Unidad: {item.product.unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        ${item.price.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {item.quantity} {item.product.unit}
                      </TableCell>
                      <TableCell align="right">
                        ${item.subtotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider />

          {/* Totales */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Resumen de Totales
            </Typography>
            <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>${sale.subtotal.toLocaleString()}</Typography>
                </Box>
                {sale.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Descuento:</Typography>
                    <Typography color="error.main">
                      -${sale.discount.toLocaleString()}
                    </Typography>
                  </Box>
                )}
                {sale.tax > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Impuestos:</Typography>
                    <Typography>+${sale.tax.toLocaleString()}</Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${sale.total.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Notas */}
          {sale.notes && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Notas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sale.notes}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={handlePrint}
        >
          Imprimir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleDetails;