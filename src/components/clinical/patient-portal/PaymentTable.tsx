import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  TablePagination
} from '@mui/material';
import {
  MoreVertical,
  Download,
  Eye,
  CreditCard,
  Calendar
} from 'lucide-react';
import { Payment } from '../../../types/payments';

interface PaymentTableProps {
  payments: Payment[];
  onViewDetails: (payment: Payment) => void;
  onDownloadInvoice: (payment: Payment) => void;
  getStatusColor: (status: Payment['status']) => string;
  getStatusText: (status: Payment['status']) => string;
  formatAmount: (amount: number, currency?: string) => string;
  loading?: boolean;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  onViewDetails,
  onDownloadInvoice,
  getStatusColor,
  getStatusText,
  formatAmount,
  loading = false
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, payment: Payment) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const handleViewDetails = () => {
    if (selectedPayment) {
      onViewDetails(selectedPayment);
    }
    handleMenuClose();
  };

  const handleDownloadInvoice = () => {
    if (selectedPayment) {
      onDownloadInvoice(selectedPayment);
    }
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getPaymentMethodIcon = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'card': return <CreditCard size={16} />;
      case 'paypal': return <span style={{ fontSize: '12px', fontWeight: 'bold' }}>PP</span>;
      case 'mercadopago': return <span style={{ fontSize: '12px', fontWeight: 'bold' }}>MP</span>;
      default: return <CreditCard size={16} />;
    }
  };

  const getPaymentMethodText = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'card': return 'Tarjeta';
      case 'paypal': return 'PayPal';
      case 'mercadopago': return 'MercadoPago';
      case 'bank_transfer': return 'Transferencia';
      case 'cash': return 'Efectivo';
      default: return method;
    }
  };

  const paginatedPayments = payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando historial de pagos...</Typography>
      </Paper>
    );
  }

  if (payments.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No hay pagos registrados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cuando realices tu primer pago, aparecerá aquí
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Monto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Método</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vencimiento</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 50 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.map((payment) => (
              <TableRow 
                key={payment.id}
                hover
                sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.action.hover 
                  }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} color={theme.palette.text.secondary} />
                    <Typography variant="body2">
                      {formatDate(payment.paidDate || payment.createdAt)}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {payment.description}
                  </Typography>
                  {payment.invoiceNumber && (
                    <Typography variant="caption" color="text.secondary">
                      {payment.invoiceNumber}
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatAmount(payment.amount, payment.currency)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={getStatusText(payment.status)}
                    color={getStatusColor(payment.status) as any}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPaymentMethodIcon(payment.paymentMethod)}
                    <Typography variant="body2">
                      {getPaymentMethodText(payment.paymentMethod)}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography 
                    variant="body2"
                    color={payment.status === 'overdue' ? 'error' : 'text.primary'}
                  >
                    {formatDate(payment.dueDate)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Tooltip title="Más opciones">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, payment)}
                    >
                      <MoreVertical size={16} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={payments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleViewDetails}>
          <Eye size={16} style={{ marginRight: 8 }} />
          Ver detalles
        </MenuItem>
        {selectedPayment?.invoiceUrl && (
          <MenuItem onClick={handleDownloadInvoice}>
            <Download size={16} style={{ marginRight: 8 }} />
            Descargar factura
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};
