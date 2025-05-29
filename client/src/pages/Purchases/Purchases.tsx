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
  IconButton,
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
  Search,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import PurchaseForm from '../../components/Purchases/PurchaseForm';
import PurchaseDetails from '../../components/Purchases/PurchaseDetails';

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

interface Supplier {
  id: string;
  name: string;
}

const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [purchaseFormOpen, setPurchaseFormOpen] = useState(false);
  const [purchaseDetailsOpen, setPurchaseDetailsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
  }, [page, searchTerm, selectedSupplier, startDate, endDate]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedSupplier && { supplierId: selectedSupplier }),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      });

      const response = await axios.get(`/purchases?${params}`);
      setPurchases(response.data.purchases);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleViewPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setPurchaseDetailsOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSupplier('');
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
              Compras
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setPurchaseFormOpen(true)}
            >
              Nueva Compra
            </Button>
          </Box>

          {/* Filtros */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <TextField
                  placeholder="Buscar compras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ minWidth: 300 }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Proveedor</InputLabel>
                  <Select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    label="Proveedor"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
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

          {/* Tabla de compras */}
          <Card>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Número de Compra</TableCell>
                    <TableCell>Proveedor</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Notas</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Cargando compras...
                      </TableCell>
                    </TableRow>
                  ) : purchases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No se encontraron compras
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchases.map((purchase, index) => (
                      <motion.tr
                        key={purchase.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        component={TableRow}
                      >
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {purchase.purchaseNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{purchase.supplier.name}</TableCell>
                        <TableCell>{purchase.user.name}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            ${purchase.total.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(purchase.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {purchase.notes ? (
                            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                              {purchase.notes}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Sin notas
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleViewPurchase(purchase)}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
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
          <PurchaseForm
            open={purchaseFormOpen}
            onClose={() => setPurchaseFormOpen(false)}
            onSuccess={() => {
              fetchPurchases();
              setPurchaseFormOpen(false);
            }}
          />

          <PurchaseDetails
            open={purchaseDetailsOpen}
            onClose={() => {
              setPurchaseDetailsOpen(false);
              setSelectedPurchase(null);
            }}
            purchase={selectedPurchase}
          />
        </motion.div>
      </Box>
    </LocalizationProvider>
  );
};

export default Purchases;