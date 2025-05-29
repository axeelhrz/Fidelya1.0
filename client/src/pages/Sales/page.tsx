import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Visibility,
  Print,
  Delete,
  Search,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import SaleForm from '../../components/Sales/SaleForm';
import SaleDetails from '../../components/Sales/SaleDetails';

interface Sale {
  id: string;
  saleNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
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

interface Client {
  id: string;
  name: string;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [saleFormOpen, setSaleFormOpen] = useState(false);
  const [saleDetailsOpen, setSaleDetailsOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    fetchSales();
    fetchClients();
  }, [page, searchTerm, selectedClient, selectedPaymentMethod, startDate, endDate]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedClient && { clientId: selectedClient }),
        ...(selectedPaymentMethod && { paymentMethod: selectedPaymentMethod }),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      });

      const response = await axios.get(`/sales?${params}`);
      setSales(response.data.sales);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta venta? Esta acción restaurará el stock.')) {
      try {
        await axios.delete(`/sales/${id}`);
        fetchSales();
      } catch (error) {
        console.error('Error cancelling sale:', error);
      }
    }
  };

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setSaleDetailsOpen(true);
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClient('');
    setSelectedPaymentMethod('');
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Ventas
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setSaleFormOpen(true)}
            >
              Nueva Venta
            </Button>
          </Box>

          {/* Filtros */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <TextField
                  placeholder="Buscar ventas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ minWidth: 300 }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    label="Cliente"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    label="Método de Pago"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="CASH">Efectivo</MenuItem>
                    <MenuItem value="CARD">Tarjeta</MenuItem>
                    <MenuItem value="TRANSFER">Transferencia</MenuItem>
                    <MenuItem value="CREDIT">Crédito</MenuItem>
                  </Select>
                </FormControl>

                <DatePicker
                  label="Fecha Inicio"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
                />

                <DatePicker
                  label="Fecha Fin"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
                />

                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={clearFilters}
                >
                  Limpiar
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Tabla de ventas */}
          <Card>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Número de Venta</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Vendedor</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="right">Descuento</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Método de Pago</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        Cargando ventas...
                      </TableCell>
                    </TableRow>
                  ) : sales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No se encontraron ventas
                      </TableCell>
                    </TableRow>
                  ) : (
                    sales.map((sale, index) => (
                      <motion.tr
                        key={sale.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        component={TableRow}
                      >
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {sale.saleNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {sale.client?.name || 'Cliente general'}
                        </TableCell>
                        <TableCell>{sale.user.name}</TableCell>
                        <TableCell align="right">
                          ${sale.subtotal.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ${sale.discount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            ${sale.total.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getPaymentMethodLabel(sale.paymentMethod)}
                            color={getPaymentMethodColor(sale.paymentMethod) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(sale.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewSale(sale)}
                              title="Ver Detalles"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {/* Implementar impresión */}}
                              title="Imprimir"
                            >
                              <Print />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteSale(sale.id)}
                              title="Cancelar Venta"
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            )}
          </Card>

          {/* Dialogs */}
          <SaleForm
            open={saleFormOpen}
            onClose={() => setSaleFormOpen(false)}
            onSuccess={() => {
              fetchSales();
              setSaleFormOpen(false);
            }}
          />

          <SaleDetails
            open={saleDetailsOpen}
            onClose={() => {
              setSaleDetailsOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
          />
        </motion.div>
      </Box>
    </LocalizationProvider>
  );
};

export default Sales;