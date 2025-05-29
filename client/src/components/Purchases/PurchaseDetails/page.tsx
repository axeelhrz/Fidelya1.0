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
  Divider,
  Stack,
} from '@mui/material';
import { Receipt } from '@mui/icons-material';

interface Purchase {
  id: string;
  purchaseNumber: string;
  total: number;
  notes?: string;
  createdAt: string;
  supplier: { name: string };
  user: { name: string };
  purchaseItems: Array<{
    quantity: number;
    cost: number;
    subtotal: number;
    product: { name: string; unit: string };
  }>;
}

interface PurchaseDetailsProps {
  open: boolean;
  onClose: () => void;
  purchase: Purchase | null;
}

const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({ open, onClose, purchase }) => {
  if (!purchase) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt />
          Detalles de Compra - {purchase.purchaseNumber}
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
                  Proveedor
                </Typography>
                <Typography variant="body1">
                  {purchase.supplier.name}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Usuario
                </Typography>
                <Typography variant="body1">
                  {purchase.user.name}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha
                </Typography>
                <Typography variant="body1">
                  {new Date(purchase.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Productos */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Productos Comprados
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Costo Unitario</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchase.purchaseItems.map((item, index) => (
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
                        {item.quantity} {item.product.unit}
                      </TableCell>
                      <TableCell align="right">
                        ${item.cost.toLocaleString()}
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

          {/* Total */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Total de la Compra
            </Typography>
            <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${purchase.total.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Notas */}
          {purchase.notes && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Notas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {purchase.notes}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseDetails;