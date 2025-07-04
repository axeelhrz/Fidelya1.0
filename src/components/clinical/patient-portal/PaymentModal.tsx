import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod, PaymentProcessRequest, PaymentProcessResponse } from '../../../types/payments';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPayment: (request: PaymentProcessRequest) => Promise<PaymentProcessResponse>;
  paymentMethods: PaymentMethod[];
  defaultAmount?: number;
  defaultDescription?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onPayment,
  paymentMethods,
  defaultAmount = 0,
  defaultDescription = ''
}) => {
  const theme = useTheme();
  const [amount, setAmount] = useState(defaultAmount);
  const [description, setDescription] = useState(defaultDescription);
  const [selectedMethodId, setSelectedMethodId] = useState(paymentMethods[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentProcessResponse | null>(null);

  const handleSubmit = async () => {
    if (!selectedMethodId || amount <= 0) return;

    setLoading(true);
    setResult(null);

    try {
      const request: PaymentProcessRequest = {
        amount,
        currency: 'EUR',
        description: description || 'Pago de servicios',
        paymentMethodId: selectedMethodId,
        metadata: {
          source: 'patient_portal'
        }
      };

      const response = await onPayment(request);
      setResult(response);

      if (response.success) {
        setTimeout(() => {
          onClose();
          handleReset();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        status: 'failed',
        message: 'Error inesperado al procesar el pago'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAmount(defaultAmount);
    setDescription(defaultDescription);
    setSelectedMethodId(paymentMethods[0]?.id || '');
    setResult(null);
    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      handleReset();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `${method.brand?.toUpperCase()} •••• ${method.lastFour}`;
      case 'paypal':
        return 'PayPal';
      case 'mercadopago':
        return 'MercadoPago';
      default:
        return method.displayName;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CreditCard size={24} color={theme.palette.primary.main} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Realizar Pago
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {result ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            {result.success ? (
              <>
                <CheckCircle 
                  size={64} 
                  color={theme.palette.success.main}
                  style={{ marginBottom: 16 }}
                />
                <Typography variant="h6" sx={{ mb: 1, color: 'success.main' }}>
                  ¡Pago Exitoso!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.message}
                </Typography>
                {result.transactionId && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    ID de transacción: {result.transactionId}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <AlertCircle 
                  size={64} 
                  color={theme.palette.error.main}
                  style={{ marginBottom: 16 }}
                />
                <Typography variant="h6" sx={{ mb: 1, color: 'error.main' }}>
                  Error en el Pago
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.message}
                </Typography>
              </>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Información de seguridad */}
            <Alert 
              severity="info" 
              icon={<Shield size={20} />}
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body2">
                Tu información de pago está protegida con cifrado de nivel bancario
              </Typography>
            </Alert>

            {/* Monto */}
            <TextField
              label="Monto a pagar"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
              }}
              inputProps={{
                min: 0,
                step: 0.01
              }}
              disabled={loading}
            />

            {/* Descripción */}
            <TextField
              label="Descripción del pago"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Ej: Sesión individual, Mensualidad..."
              disabled={loading}
            />

            {/* Método de pago */}
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Método de pago</InputLabel>
              <Select
                value={selectedMethodId}
                onChange={(e) => setSelectedMethodId(e.target.value)}
                label="Método de pago"
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCard size={16} />
                      <Typography>
                        {getPaymentMethodDisplay(method)}
                      </Typography>
                      {method.isDefault && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            ml: 1, 
                            px: 1, 
                            py: 0.25, 
                            bgcolor: 'primary.main', 
                            color: 'white', 
                            borderRadius: 1,
                            fontSize: '0.7rem'
                          }}
                        >
                          Por defecto
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Resumen */}
            {amount > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Resumen del pago
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal:
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(amount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Impuestos:
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">
                      Total:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(amount)}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {result ? (
          <Button
            onClick={handleClose}
            variant="contained"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Cerrar
          </Button>
        ) : (
          <>
            <Button 
              onClick={handleClose}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || amount <= 0 || !selectedMethodId}
              startIcon={loading ? <CircularProgress size={16} /> : <CreditCard size={16} />}
              sx={{ minWidth: 120, py: 1.5 }}
            >
              {loading ? 'Procesando...' : `Pagar ${formatCurrency(amount)}`}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
