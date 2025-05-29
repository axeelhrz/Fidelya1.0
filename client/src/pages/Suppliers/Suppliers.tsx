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
  Business,
  Email,
  Phone,
  LocationOn,
  Receipt,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { products: number; purchases: number };
  products?: Array<{
    id: string;
    name: string;
    stock: number;
    salePrice: number;
  }>;
  purchases?: Array<{
    id: string;
    purchaseNumber: string;
    total: number;
    createdAt: string;
  }>;
}

interface SupplierFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, [page, searchTerm]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axios.get(`/suppliers?${params}`);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (selectedSupplier) {
        await axios.put(`/suppliers/${selectedSupplier.id}`, formData);
      } else {
        await axios.post('/suppliers', formData);
      }
      
      fetchSuppliers();
      handleCloseForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el proveedor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      taxId: supplier.taxId || '',
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        await axios.delete(`/suppliers/${id}`);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const handleViewDetails = async (supplier: Supplier) => {
    try {
      const response = await axios.get(`/suppliers/${supplier.id}`);
      setSelectedSupplier(response.data);
      setDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching supplier details:', error);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedSupplier(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
    });
    setError('');
  };

  const handleFormChange = (field: keyof SupplierFormData, value: string) => {
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
            Proveedores
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            Nuevo Proveedor
          </Button>
        </Box>

        {/* Búsqueda */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Buscar proveedores por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </CardContent>
        </Card>

        {/* Tabla de proveedores */}
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>ID Fiscal</TableCell>
                  <TableCell align="center">Productos</TableCell>
                  <TableCell align="center">Compras</TableCell>
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Cargando proveedores...
                    </TableCell>
                  </TableRow>
                ) : suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No se encontraron proveedores
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((supplier, index) => (
                    <motion.tr
                      key={supplier.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      component={TableRow}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business color="primary" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {supplier.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          {supplier.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{supplier.email}</Typography>
                            </Box>
                          )}
                          {supplier.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{supplier.phone}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {supplier.address ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                              {supplier.address}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No especificada
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.taxId || (
                          <Typography variant="body2" color="text.secondary">
                            No especificado
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={supplier._count?.products || 0}
                          color="info"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={supplier._count?.purchases || 0}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(supplier.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(supplier)}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(supplier)}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(supplier.id)}
                            title="Eliminar"
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

        {/* Formulario de Proveedor */}
        <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
                  label="Nombre de la Empresa"
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
                  label="ID Fiscal (RUC, CUIT, etc.)"
                  value={formData.taxId}
                  onChange={(e) => handleFormChange('taxId', e.target.value)}
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
                {formLoading ? 'Guardando...' : selectedSupplier ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Detalles del Proveedor */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Detalles del Proveedor</DialogTitle>
          <DialogContent>
            {selectedSupplier && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Información de la Empresa
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nombre de la Empresa
                      </Typography>
                      <Typography variant="body1">{selectedSupplier.name}</Typography>
                    </Box>
                    {selectedSupplier.email && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Correo Electrónico
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.email}</Typography>
                      </Box>
                    )}
                    {selectedSupplier.phone && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Teléfono
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.phone}</Typography>
                      </Box>
                    )}
                    {selectedSupplier.address && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Dirección
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.address}</Typography>
                      </Box>
                    )}
                    {selectedSupplier.taxId && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          ID Fiscal
                        </Typography>
                        <Typography variant="body1">{selectedSupplier.taxId}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Productos Suministrados
                  </Typography>
                  {selectedSupplier.products && selectedSupplier.products.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell align="right">Stock Actual</TableCell>
                            <TableCell align="right">Precio de Venta</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedSupplier.products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell align="right">{product.stock}</TableCell>
                              <TableCell align="right">
                                ${product.salePrice.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary">
                      No hay productos registrados para este proveedor
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Historial de Compras
                  </Typography>
                  {selectedSupplier.purchases && selectedSupplier.purchases.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Número de Compra</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>Fecha</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedSupplier.purchases.map((purchase) => (
                            <TableRow key={purchase.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Receipt sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  {purchase.purchaseNumber}
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                ${purchase.total.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {new Date(purchase.createdAt).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary">
                      No hay compras registradas para este proveedor
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

export default Suppliers;