'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CreditCard,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { usePatientPayments } from '../../../../hooks/usePatientPayments';
import { PaymentCard } from '../../../../components/clinical/patient-portal/PaymentCard';
import { PaymentTable } from '../../../../components/clinical/patient-portal/PaymentTable';
import { PaymentModal } from '../../../../components/clinical/patient-portal/PaymentModal';
import { SubscriptionCard } from '../../../../components/clinical/patient-portal/SubscriptionCard';
import { Payment, PaymentFilters } from '../../../../types/payments';

export default function PatientPaymentsPage() {
  const theme = useTheme();
  const {
    payments,
    paymentMethods,
    subscription,
    paymentSummary,
    loading,
    error,
    filters,
    processPayment,
    updateFilters,
    clearFilters,
    refreshData,
    getStatusColor,
    getStatusText,
    formatAmount,
    formatPaymentMethod
  } = usePatientPayments();

  // Estados locales
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<PaymentFilters>({});

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handlePayNow = () => {
    setPaymentModalOpen(true);
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsModalOpen(true);
  };

  const handleDownloadInvoice = (payment: Payment) => {
    if (payment.invoiceUrl) {
      // En producción, descargar el archivo real
      window.open(payment.invoiceUrl, '_blank');
    } else {
      // Simular descarga
      const link = document.createElement('a');
      link.href = '#';
      link.download = `factura-${payment.invoiceNumber || payment.id}.pdf`;
      link.click();
    }
  };

  const handleManageSubscription = (action: 'change_plan' | 'cancel' | 'update_payment') => {
    // Implementar según la acción
    console.log('Manage subscription:', action);
  };

  const handleApplyFilters = () => {
    updateFilters(tempFilters);
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    clearFilters();
    setTempFilters({});
    setFiltersOpen(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'No definido';
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // ============================================================================
  // RENDER LOADING
  // ============================================================================
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // ============================================================================
  // RENDER ERROR
  // ============================================================================
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={refreshData}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Pagos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona tus pagos y suscripciones
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Actualizar datos">
              <IconButton onClick={refreshData} disabled={loading}>
                <RefreshCw size={20} />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<Filter size={18} />}
              onClick={() => setFiltersOpen(true)}
            >
              Filtros
            </Button>
            {paymentSummary && paymentSummary.currentBalance > 0 && (
              <Button
                variant="contained"
                startIcon={<CreditCard size={18} />}
                onClick={handlePayNow}
              >
                Pagar ahora
              </Button>
            )}
          </Stack>
        </Box>

        {/* Filtros activos */}
        {(filters.status?.length || filters.paymentMethod?.length) && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.status?.map(status => (
              <Chip
                key={status}
                label={`Estado: ${getStatusText(status)}`}
                size="small"
                onDelete={() => updateFilters({
                  status: filters.status?.filter(s => s !== status)
                })}
              />
            ))}
            {filters.paymentMethod?.map(method => (
              <Chip
                key={method}
                label={`Método: ${method}`}
                size="small"
                onDelete={() => updateFilters({
                  paymentMethod: filters.paymentMethod?.filter(m => m !== method)
                })}
              />
            ))}
            <Button
              size="small"
              onClick={clearFilters}
              sx={{ ml: 1 }}
            >
              Limpiar filtros
            </Button>
          </Box>
        )}
      </Box>

      {/* Contenido principal */}
      <Grid container spacing={3}>
        {/* Resumen de cuenta */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {paymentSummary && (
              <PaymentCard
                summary={paymentSummary}
                onPayNow={handlePayNow}
                loading={loading}
              />
            )}
            
            <SubscriptionCard
              subscription={subscription}
              paymentMethods={paymentMethods}
              onManageSubscription={handleManageSubscription}
              loading={loading}
            />
          </Stack>
        </Grid>

        {/* Historial de pagos */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Historial de Pagos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Todos tus pagos y transacciones
              </Typography>
            </Box>
            
            <PaymentTable
              payments={payments}
              onViewDetails={handleViewDetails}
              onDownloadInvoice={handleDownloadInvoice}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatAmount={formatAmount}
              loading={loading}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de pago */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPayment={processPayment}
        paymentMethods={paymentMethods}
        defaultAmount={paymentSummary?.currentBalance || 0}
        defaultDescription="Pago de servicios pendientes"
      />

      {/* Modal de detalles de pago */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Eye size={24} color={theme.palette.primary.main} />
            <Typography variant="h6">
              Detalles del Pago
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedPayment && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Estado
                </Typography>
                <Chip
                  label={getStatusText(selectedPayment.status)}
                  color={getStatusColor(selectedPayment.status) as any}
                  icon={selectedPayment.status === 'paid' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Descripción
                </Typography>
                <Typography variant="body1">
                  {selectedPayment.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Monto
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatAmount(selectedPayment.amount, selectedPayment.currency)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Fecha
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedPayment.paidDate || selectedPayment.createdAt)}
                </Typography>
              </Box>

              {selectedPayment.transactionId && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    ID de Transacción
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedPayment.transactionId}
                  </Typography>
                </Box>
              )}

              {selectedPayment.invoiceNumber && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Número de Factura
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.invoiceNumber}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          {selectedPayment?.invoiceUrl && (
            <Button
              startIcon={<Download size={16} />}
              onClick={() => selectedPayment && handleDownloadInvoice(selectedPayment)}
            >
              Descargar Factura
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => setDetailsModalOpen(false)}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de filtros */}
      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filtrar Pagos</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                multiple
                value={tempFilters.status || []}
                onChange={(e) => setTempFilters({
                  ...tempFilters,
                  status: e.target.value as Payment['status'][]
                })}
                label="Estado"
              >
                <MenuItem value="paid">Pagado</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="overdue">Vencido</MenuItem>
                <MenuItem value="failed">Fallido</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Método de pago</InputLabel>
              <Select
                multiple
                value={tempFilters.paymentMethod || []}
                onChange={(e) => setTempFilters({
                  ...tempFilters,
                  paymentMethod: e.target.value as Payment['paymentMethod'][]
                })}
                label="Método de pago"
              >
                <MenuItem value="card">Tarjeta</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="mercadopago">MercadoPago</MenuItem>
                <MenuItem value="bank_transfer">Transferencia</MenuItem>
                <MenuItem value="cash">Efectivo</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters}>
            Limpiar
          </Button>
          <Button onClick={() => setFiltersOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
