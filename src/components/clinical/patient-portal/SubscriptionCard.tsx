import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Alert
} from '@mui/material';
import {
  Calendar,
  CreditCard,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings
} from 'lucide-react';
import { Subscription, PaymentMethod } from '../../../types/payments';

interface SubscriptionCardProps {
  subscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  onManageSubscription: (action: 'change_plan' | 'cancel' | 'update_payment') => void;
  loading?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  paymentMethods,
  onManageSubscription,
  loading = false
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: 'change_plan' | 'cancel' | 'update_payment') => {
    onManageSubscription(action);
    handleMenuClose();
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'trialing': return 'info';
      case 'past_due': return 'warning';
      case 'cancelled': return 'error';
      case 'unpaid': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: Subscription['status']) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'trialing': return 'Período de prueba';
      case 'past_due': return 'Pago atrasado';
      case 'cancelled': return 'Cancelado';
      case 'unpaid': return 'Sin pagar';
      case 'incomplete': return 'Incompleto';
      default: return status;
    }
  };

  const getStatusIcon = (status: Subscription['status']) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'trialing': return <Clock size={16} />;
      case 'past_due': return <AlertCircle size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      case 'unpaid': return <AlertCircle size={16} />;
      default: return <Settings size={16} />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getIntervalText = (interval: Subscription['interval']) => {
    switch (interval) {
      case 'monthly': return 'mensual';
      case 'quarterly': return 'trimestral';
      case 'yearly': return 'anual';
      default: return interval;
    }
  };

  const getCurrentPaymentMethod = () => {
    return paymentMethods.find(pm => pm.id === subscription?.paymentMethodId);
  };

  const formatPaymentMethod = (method?: PaymentMethod) => {
    if (!method) return 'No configurado';
    
    switch (method.type) {
      case 'card':
        return `${method.brand?.toUpperCase()} •••• ${method.lastFour}`;
      case 'paypal':
        return 'PayPal';
      case 'mercadopago':
        return 'MercadoPago';
      default:
        return method.displayName || method.type;
    }
  };

  if (!subscription) {
    return (
      <Card elevation={1}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Sin suscripción activa
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Actualmente no tienes ninguna suscripción activa
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CreditCard size={18} />}
            onClick={() => onManageSubscription('change_plan')}
          >
            Ver planes disponibles
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPaymentMethod = getCurrentPaymentMethod();
  const daysUntilRenewal = Math.ceil(
    (subscription.nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

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
              {subscription.planName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subscription.planDescription}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={getStatusIcon(subscription.status)}
              label={getStatusText(subscription.status)}
              color={getStatusColor(subscription.status)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertical size={16} />
            </IconButton>
          </Box>
        </Box>

        {/* Alertas de estado */}
        {subscription.status === 'past_due' && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body2">
              Tu suscripción tiene pagos pendientes. Actualiza tu método de pago para evitar la suspensión.
            </Typography>
          </Alert>
        )}

        {subscription.cancelAtPeriodEnd && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body2">
              Tu suscripción se cancelará el {formatDate(subscription.currentPeriodEnd)}
            </Typography>
          </Alert>
        )}

        {/* Información de facturación */}
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Precio
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {formatCurrency(subscription.amount, subscription.currency)}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                /{getIntervalText(subscription.interval)}
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Próxima facturación
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2">
                {formatDate(subscription.nextBillingDate)}
              </Typography>
              {daysUntilRenewal <= 7 && (
                <Chip
                  label={`${daysUntilRenewal} días`}
                  size="small"
                  color="warning"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Método de pago
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2">
                {formatPaymentMethod(currentPaymentMethod)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Período actual
            </Typography>
            <Typography variant="body2">
              {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
            </Typography>
          </Box>
        </Stack>

        {/* Acciones rápidas */}
        {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAction('update_payment')}
              startIcon={<CreditCard size={16} />}
              sx={{ flex: 1 }}
            >
              Cambiar método
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAction('change_plan')}
              startIcon={<Settings size={16} />}
              sx={{ flex: 1 }}
            >
              Cambiar plan
            </Button>
          </Box>
        )}
      </CardContent>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleAction('change_plan')}>
          <Settings size={16} style={{ marginRight: 8 }} />
          Cambiar plan
        </MenuItem>
        <MenuItem onClick={() => handleAction('update_payment')}>
          <CreditCard size={16} style={{ marginRight: 8 }} />
          Actualizar método de pago
        </MenuItem>
        {!subscription.cancelAtPeriodEnd && (
          <MenuItem onClick={() => handleAction('cancel')}>
            <AlertCircle size={16} style={{ marginRight: 8 }} />
            Cancelar suscripción
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};
