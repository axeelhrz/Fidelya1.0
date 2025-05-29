import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  stock: number;
  unit: string;
}

interface StockAdjustmentDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
  open,
  onClose,
  product,
  onSuccess,
}) => {
  const [newStock, setNewStock] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setNewStock(product.stock.toString());
      setReason('');
    }
    setError('');
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    setError('');

    try {
      await axios.post('/inventory/adjust', {
        productId: product.id,
        newStock: parseFloat(newStock),
        reason: reason || 'Ajuste manual',
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al ajustar el stock');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const stockDifference = parseFloat(newStock || '0') - product.stock;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ajustar Stock</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {product.name}
              </Typography>
              <Chip
                label={`Stock actual: ${product.stock} ${product.unit}`}
                color="info"
                variant="outlined"
              />
            </Box>

            <TextField
              fullWidth
              label="Nuevo Stock"
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              required
              inputProps={{ min: 0, step: 0.01 }}
              helperText={`Unidad: ${product.unit}`}
            />

            {stockDifference !== 0 && (
              <Alert
                severity={stockDifference > 0 ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  {stockDifference > 0 ? 'Incremento' : 'Reducción'} de stock:{' '}
                  <strong>
                    {Math.abs(stockDifference)} {product.unit}
                  </strong>
                </Typography>
              </Alert>
            )}

            <TextField
              fullWidth
              label="Motivo del Ajuste"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={2}
              placeholder="Describe el motivo del ajuste de stock..."
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || stockDifference === 0}
          >
            {loading ? 'Ajustando...' : 'Ajustar Stock'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockAdjustmentDialog;