import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { PaymentSummary, SubscriptionStatus } from '../../../types/payments';

interface PaymentCardProps {
  summary: PaymentSummary;
  onPayNow: () => void;
  loading?: boolean;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  summary,
  onPayNow,
  loading = false
}) => {
  const theme = useTheme();

  const getStatusColor = (status?: SubscriptionStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'trialing': return 'info';
      case 'past_due': return 'warning';
      case 'cancelled': return 'error';
      case 'unpaid': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status?: SubscriptionStatus) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'trialing': return 'Período de prueba';
      case 'past_due': return 'Pago atrasado';
      case 'cancelled': return 'Cancelado';
      case 'unpaid': return 'Sin pagar';
      case 'incomplete': return 'Incompleto';
      default: return 'Sin suscripción';
    }
  };

  const getStatusIcon = (status?: SubscriptionStatus) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'trialing': return <TrendingUp size={16} />;
      case 'past_due': return <AlertCircle size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      case 'unpaid': return <AlertCircle size={16} />;
      default: return <CreditCard size={16} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'No definido';
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card 
      elevation={2}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Estado de Cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resumen de tus pagos y suscripción
            </Typography>
          </Box>
          
          {summary.subscriptionStatus && (
            <Chip
              icon={getStatusIcon(summary.subscriptionStatus)}
              label={getStatusText(summary.subscriptionStatus)}
              color={getStatusColor(summary.subscriptionStatus)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>

        {/* Balance actual */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Saldo actual
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: summary.currentBalance > 0 
                ? theme.palette.error.main 
                : theme.palette.success.main
            }}
          >
            {formatCurrency(summary.currentBalance)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Métricas */}
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total pagado
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(summary.totalPaid)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Pagos pendientes
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: summary.totalPending > 0 ? theme.palette.warning.main : 'inherit'
              }}
            >
              {formatCurrency(summary.totalPending)}
            </Typography>
          </Box>

          {summary.totalOverdue > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="error">
                Pagos vencidos
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                {formatCurrency(summary.totalOverdue)}
              </Typography>
            </Box>
          )}

          {summary.nextPaymentDate && summary.nextPaymentAmount > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Próximo pago
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} color={theme.palette.text.secondary} />
                    <Typography variant="body2">
                      {formatDate(summary.nextPaymentDate)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(summary.nextPaymentAmount)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Stack>

        {/* Botón de acción */}
        {summary.currentBalance > 0 && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={onPayNow}
              disabled={loading}
              startIcon={<CreditCard size={18} />}
              sx={{
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              {loading ? 'Procesando...' : 'Pagar ahora'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
