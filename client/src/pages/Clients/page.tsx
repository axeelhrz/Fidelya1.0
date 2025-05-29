import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  People,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { sales: number };
  sales?: any[];
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  notes: string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    notes: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, [page, searchTerm]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axios.get(`/clients?${params}`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (selectedClient) {
        await axios.put(`/clients/${selectedClient.id}`, formData);
      } else {
        await axios.post('/clients', formData);
      }
      
      fetchClients();
      handleCloseForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el cliente');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      taxId: client.taxId || '',
      notes: client.notes || '',
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await axios.delete(`/clients/${id}`);
        fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleViewDetails = async (client: Client) => {
    try {
      const response = await axios.get(`/clients/${client.id}`);
      setSelectedClient(response.data);
      setDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      notes: '',
    });
    setError('');
  };

  const handleFormChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Clientes
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            Nuevo Cliente
          </Button>
        </Box>

        {/* Búsqueda */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Buscar clientes por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </CardContent>
        </Card>

        {/* Tabla de clientes */}
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>ID Fiscal</TableCell>
                  <TableCell align="center">Ventas</TableCell>
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Cargando clientes...
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client, index) => (
                    <TableRow
                      key={client.id}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People color="primary" />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                              {client.name}
                            </Typography>
                            {client.notes && (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {client.notes}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          {client.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{client.email}</Typography>
                            </Box>
                          )}
                          {client.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{client.phone}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {client.address ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                              {client.address}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No especificada
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.taxId || (
                          <Typography variant="body2" color="text.secondary">
                            No especificado
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={client._count?.sales || 0}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(client.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(client)}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(client)}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(client.id)}
                            title="Eliminar"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
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

        {/* Formulario de Cliente */}
        <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nombre Completo"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  multiline
                  rows={2}
                />
                <TextField
                  fullWidth
                  label="ID Fiscal (DNI, CUIT, etc.)"
                  value={formData.taxId}
                  onChange={(e) => handleFormChange('taxId', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Notas"
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Información adicional sobre el cliente..."
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm} disabled={formLoading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formLoading}
              >
                {formLoading ? 'Guardando...' : selectedClient ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Detalles del Cliente */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Detalles del Cliente</DialogTitle>
          <DialogContent>
            {selectedClient && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Información Personal
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nombre Completo
                      </Typography>
                      <Typography variant="body1">{selectedClient.name}</Typography>
                    </Box>
                    {selectedClient.email && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Correo Electrónico
                        </Typography>
                        <Typography variant="body1">{selectedClient.email}</Typography>
                      </Box>
                    )}
                    {selectedClient.phone && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Teléfono
                        </Typography>
                        <Typography variant="body1">{selectedClient.phone}</Typography>
                      </Box>
                    )}
                    {selectedClient.address && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Dirección
                        </Typography>
                        <Typography variant="body1">{selectedClient.address}</Typography>
                      </Box>
                    )}
                    {selectedClient.taxId && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          ID Fiscal
                        </Typography>
                        <Typography variant="body1">{selectedClient.taxId}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {selectedClient.notes && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Notas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedClient.notes}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Historial de Ventas
                  </Typography>
                  {selectedClient.sales && selectedClient.sales.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Número de Venta</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>Método de Pago</TableCell>
                            <TableCell>Fecha</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedClient.sales.map((sale: any) => (
                            <TableRow key={sale.id}>
                              <TableCell>{sale.saleNumber}</TableCell>
                              <TableCell align="right">
                                ${sale.total.toLocaleString()}
                              </TableCell>
                              <TableCell>{sale.paymentMethod}</TableCell>
                              <TableCell>
                                {new Date(sale.createdAt).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary">
                      No hay ventas registradas para este cliente
                    </Typography>
                  )}
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default Clients;