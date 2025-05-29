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
  ShoppingCart,
} from '@mui/icons-material';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  salePrice: number;
  stock: number;
  unit: string;
}

interface Client {
  id: string;
  name: string;
}

interface SaleItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

interface SaleFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ open, onClose, onSuccess }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [discount, setDiscount] = useState<string>('0');
  const [tax, setTax] = useState<string>('0');
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchProducts();
      fetchClients();
      resetForm();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products?limit=1000');
      setProducts(response.data.products.filter((p: Product) => p.stock > 0));
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const resetForm = () => {
    setSelectedClient('');
    setPaymentMethod('CASH');
    setDiscount('0');
    setTax('0');
    setNotes('');
    setItems([]);
    setSelectedProduct(null);
    setQuantity('1');
    setError('');
  };

  const addItem = () => {
    if (!selectedProduct) return;

    const qty = parseFloat(quantity);
    if (qty <= 0 || qty > selectedProduct.stock) {
      setError('Cantidad inválida o insuficiente stock');
      return;
    }

    const existingItemIndex = items.findIndex(item => item.productId === selectedProduct.id);
    
    if (existingItemIndex >= 0) {
      const newItems = [...items];
      const newQuantity = newItems[existingItemIndex].quantity + qty;
      
      if (newQuantity > selectedProduct.stock) {
        setError('Stock insuficiente');
        return;
      }
      
      newItems[existingItemIndex].quantity = newQuantity;
      newItems[existingItemIndex].subtotal = newQuantity * selectedProduct.salePrice;
      setItems(newItems);
    } else {
      const newItem: SaleItem = {
        productId: selectedProduct.id,
        product: selectedProduct,
        quantity: qty,
        price: selectedProduct.salePrice,
        subtotal: qty * selectedProduct.salePrice,
      };
      setItems([...items, newItem]);
    }

    setSelectedProduct(null);
    setQuantity('1');
    setError('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (newQuantity <= 0 || (item.product && newQuantity > item.product.stock)) {
      return;
    }
    
    newItems[index].quantity = newQuantity;
    newItems[index].subtotal = newQuantity * item.price;
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = parseFloat(discount) || 0;
    const taxAmount = parseFloat(tax) || 0;
    const total = subtotal - discountAmount + taxAmount;
    
    return { subtotal, discountAmount, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { subtotal, discountAmount, taxAmount, total } = calculateTotals();
      
      const saleData = {
        clientId: selectedClient || null,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod,
        discount: discountAmount,
        tax: taxAmount,
        notes,
      };

      await axios.post('/sales', saleData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la venta');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart />
          Nueva Venta
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
            {/* Cliente y método de pago */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Cliente (Opcional)</InputLabel>
                <Select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  label="Cliente (Opcional)"
                >
                  <MenuItem value="">Cliente general</MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Método de Pago"
                >
                  <MenuItem value="CASH">Efectivo</MenuItem>
                  <MenuItem value="CARD">Tarjeta</MenuItem>
                  <MenuItem value="TRANSFER">Transferencia</MenuItem>
                  <MenuItem value="CREDIT">Crédito</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Agregar productos */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Agregar Productos
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="end">
                <Autocomplete
                  fullWidth
                  options={products}
                  getOptionLabel={(option) => `${option.name} - Stock: ${option.stock} ${option.unit}`}
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
                  Productos en la Venta
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Precio</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product?.name}</TableCell>
                          <TableCell align="right">
                            ${item.price.toLocaleString()}
                          </TableCell>
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

            {/* Totales */}
            {items.length > 0 && (
              <Box>
                <Divider sx={{ my: 2 }} />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Descuento"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
                    }}
                  />
                  <TextField
                    label="Impuestos"
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
                    }}
                  />
                </Stack>

                <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Subtotal:</Typography>
                      <Typography>${subtotal.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Descuento:</Typography>
                      <Typography>-${discountAmount.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Impuestos:</Typography>
                      <Typography>+${taxAmount.toLocaleString()}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" color="primary">
                        ${total.toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
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
            disabled={loading || items.length === 0}
          >
            {loading ? 'Procesando...' : `Crear Venta - $${total.toLocaleString()}`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SaleForm;