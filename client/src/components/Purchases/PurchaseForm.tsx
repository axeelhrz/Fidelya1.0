import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  Receipt,
} from '@mui/icons-material';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  costPrice: number;
  unit: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface PurchaseItem {
  productId: string;
  product?: Product;
  quantity: number;
  cost: number;
  subtotal: number;
}

interface PurchaseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ open, onClose, onSuccess }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [cost, setCost] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchProducts();
      fetchSuppliers();
      resetForm();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products?limit=1000');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const resetForm = () => {
    setSelectedSupplier('');
    setNotes('');
    setItems([]);
    setSelectedProduct(null);
    setQuantity('1');
    setCost('');
    setError('');
  };

  useEffect(() => {
    if (selectedProduct) {
      setCost(selectedProduct.costPrice.toString());
    }
  }, [selectedProduct]);

  const addItem = () => {
    if (!selectedProduct || !cost || !quantity) {
      setError('Complete todos los campos del producto');
      return;
    }

    const qty = parseFloat(quantity);
    const unitCost = parseFloat(cost);

    if (qty <= 0 || unitCost <= 0) {
      setError('Cantidad y costo deben ser mayores a 0');
      return;
    }

    const existingItemIndex = items.findIndex(item => item.productId === selectedProduct.id);
    
    if (existingItemIndex >= 0) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += qty;
      newItems[existingItemIndex].subtotal = newItems[existingItemIndex].quantity * unitCost;
      setItems(newItems);
    } else {
      const newItem: PurchaseItem = {
        productId: selectedProduct.id,
        product: selectedProduct,
        quantity: qty,
        cost: unitCost,
        subtotal: qty * unitCost,
      };
      setItems([...items, newItem]);
    }

    setSelectedProduct(null);
    setQuantity('1');
    setCost('');
    setError('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    newItems[index].subtotal = newQuantity * newItems[index].cost;
    setItems(newItems);
  };

  const updateItemCost = (index: number, newCost: number) => {
    if (newCost <= 0) return;
    
    const newItems = [...items];
    newItems[index].cost = newCost;
    newItems[index].subtotal = newItems[index].quantity * newCost;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplier) {
      setError('Debe seleccionar un proveedor');
      return;
    }

    if (items.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const purchaseData = {
        supplierId: selectedSupplier,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          cost: item.cost,
        })),
        notes,
      };

      await axios.post('/purchases', purchaseData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la compra');
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt />
          Nueva Compra
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Proveedor */}
            <FormControl fullWidth required>
              <InputLabel>Proveedor</InputLabel>
              <Select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                label="Proveedor"
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Agregar productos */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Agregar Productos
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="end">
                <Autocomplete
                  fullWidth
                  options={products}
                  getOptionLabel={(option) => option.name}
                  value={selectedProduct}
                  onChange={(_, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Seleccionar Producto" />
                  )}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  inputProps={{ min: 0.01, step: 0.01 }}
                  sx={{ minWidth: 120 }}
                />
                <TextField
                  label="Costo Unitario"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  inputProps={{ min: 0.01, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
                  }}
                  sx={{ minWidth: 140 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addItem}
                  disabled={!selectedProduct}
                >
                  Agregar
                </Button>
              </Stack>
            </Box>

            {/* Lista de productos */}
            {items.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Productos en la Compra
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Costo Unitario</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product?.name}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(index, parseFloat(e.target.value))}
                              inputProps={{ min: 0.01, step: 0.01 }}
                              size="small"
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.cost}
                              onChange={(e) => updateItemCost(index, parseFloat(e.target.value))}
                              inputProps={{ min: 0.01, step: 0.01 }}
                              size="small"
                              sx={{ width: 100 }}
                              InputProps={{
                                startAdornment: <Box sx={{ mr: 0.5, fontSize: '0.8rem' }}>$</Box>,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            ${item.subtotal.toLocaleString()}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => removeItem(index)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Total */}
            {items.length > 0 && (
              <Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total de la Compra:</Typography>
                    <Typography variant="h6" color="primary">
                      ${total.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Notas */}
            <TextField
              fullWidth
              label="Notas (Opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={2}
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
            disabled={loading || items.length === 0 || !selectedSupplier}
          >
            {loading ? 'Procesando...' : `Crear Compra - $${total.toLocaleString()}`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PurchaseForm;