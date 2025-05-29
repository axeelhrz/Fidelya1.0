import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Receipt,
  Search,
  AttachMoney,
  Person,
  Phone,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirestore } from '../hooks/useFirestore';
import { Product, Sale, SaleItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

const QuickSaleForm: React.FC<{
  products: Product[];
  onSaleComplete: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
}> = ({ products, onSaleComplete }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [discount, setDiscount] = useState(0);

  const addToCart = () => {
    if (!selectedProduct) return;

    const existingItem = cart.find(item => item.productId === selectedProduct.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        price: selectedProduct.price,
        total: quantity * selectedProduct.price,
      };
      setCart([...cart, newItem]);
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const sale: Omit<Sale, 'id' | 'createdAt'> = {
      products: cart,
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      userId: currentUser?.id || '',
    };

    onSaleComplete(sale);
    
    // Limpiar formulario
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
    setPaymentMethod('cash');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Nueva Venta
        </Typography>

        {/* Agregar productos */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} - $${option.price}`}
                value={selectedProduct}
                onChange={(_, newValue) => setSelectedProduct(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar producto"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${option.price} - Stock: {option.stock}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={addToCart}
                disabled={!selectedProduct}
                startIcon={<Add />}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Carrito */}
        {cart.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Productos en el carrito
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">${item.total}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeFromCart(item.productId)}
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

        {/* Información del cliente y pago */}
        {cart.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Nombre del cliente (opcional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Teléfono (opcional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    label="Método de Pago"
                  >
                    <MenuItem value="cash">Efectivo</MenuItem>
                    <MenuItem value="card">Tarjeta</MenuItem>
                    <MenuItem value="transfer">Transferencia</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Resumen de la venta */}
        {cart.length > 0 && (
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Descuento (%)"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal: ${subtotal.toLocaleString()}
                  </Typography>
                  {discount > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Descuento ({discount}%): -${discountAmount.toLocaleString()}
                    </Typography>
                  )}
                  <Typography variant="h6" color="primary.main">
                    Total: ${total.toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCompleteSale}
                    startIcon={<Receipt />}
                    sx={{ mt: 2 }}
                  >
                    Completar Venta
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export const Sales: React.FC = () => {
  const { data: products, updateItem: updateProduct } = useFirestore<Product>('products');
  const { data: sales, addItem: addSale } = useFirestore<Sale>('sales');
  const [showHistory, setShowHistory] = useState(false);

  const handleSaleComplete = async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    try {
      // Agregar la venta
      await addSale(saleData);

      // Actualizar el stock de los productos
      for (const item of saleData.products) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          await updateProduct(product.id, {
            stock: product.stock - item.quantity,
          });
        }
      }

      alert('Venta registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      alert('Error al registrar la venta');
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
    };
    return labels[method as keyof typeof labels] || method;
  };

  const todaySales = sales.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.createdAt);
    return saleDate.toDateString() === today.toDateString();
  });

  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ventas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Registra nuevas ventas y consulta el historial
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setShowHistory(!showHistory)}
            startIcon={<ShoppingCart />}
          >
            {showHistory ? 'Nueva Venta' : 'Ver Historial'}
          </Button>
        </Box>
      </motion.div>

      {/* Estadísticas del día */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      ${todayTotal.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ventas de hoy
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Receipt sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="secondary.main">
                      {todaySales.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transacciones hoy
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {!showHistory ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <QuickSaleForm products={products} onSaleComplete={handleSaleComplete} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historial de Ventas
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Productos</TableCell>
                      <TableCell>Método de Pago</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sales.slice(0, 20).map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          {new Date(sale.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          {sale.customerName || 'Cliente anónimo'}
                        </TableCell>
                        <TableCell>
                          <Box>
                            {sale.products.map((item, index) => (
                              <Typography key={index} variant="body2">
                                {item.productName} x{item.quantity}
                              </Typography>
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getPaymentMethodLabel(sale.paymentMethod)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="bold">
                            ${sale.total.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};