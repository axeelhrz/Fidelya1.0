import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Warning,
  CheckCircle,
  Error,
  GetApp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductForm from '../../components/Inventory/ProductForm';
import StockAdjustmentDialog from '../../components/Inventory/StockAdjustmentDialog';

interface Product {
  id: string;
  name: string;
  barcode?: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  expiryDate?: string;
  category: { name: string };
  supplier: { name: string };
  categoryId: string;
  supplierId: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [stockAdjustmentOpen, setStockAdjustmentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { categoryId: selectedCategory }),
        ...(selectedSupplier && { supplierId: selectedSupplier }),
        ...(stockFilter && { lowStock: stockFilter }),
      });

      const response = await axios.get(`/products?${params}`);
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedCategory, selectedSupplier, stockFilter]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, [fetchProducts]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductFormOpen(true);
  };

  const handleStockAdjustment = (product: Product) => {
    setSelectedProduct(product);
    setStockAdjustmentOpen(true);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: 'Sin Stock', color: 'error' as const, icon: <Error /> };
    } else if (product.stock <= product.minStock) {
      return { label: 'Stock Bajo', color: 'warning' as const, icon: <Warning /> };
    } else {
      return { label: 'En Stock', color: 'success' as const, icon: <CheckCircle /> };
    }
  };

  const isNearExpiry = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSupplier('');
    setStockFilter('');
    setPage(1);
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
            Inventario
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={() => {/* Implementar exportación */}}
            >
              Exportar
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedProduct(null);
                setProductFormOpen(true);
              }}
            >
              Nuevo Producto
            </Button>
          </Stack>
        </Box>

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ minWidth: 300 }}
              />

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Stock</InputLabel>
                <Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  label="Stock"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Stock Bajo</MenuItem>
                </Select>
              </FormControl>

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

        {/* Tabla de productos */}
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Precio Costo</TableCell>
                  <TableCell align="right">Precio Venta</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      Cargando productos...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product, index) => {
                    const stockStatus = getStockStatus(product);
                    const nearExpiry = isNearExpiry(product.expiryDate);

                    return (
                      <TableRow
                        key={product.id}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                              {product.name}
                            </Typography>
                            {product.barcode && (
                              <Typography variant="caption" color="text.secondary">
                                {product.barcode}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>{product.supplier.name}</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: stockStatus.color === 'error' ? 'error.main' : 
                                     stockStatus.color === 'warning' ? 'warning.main' : 'text.primary'
                            }}
                          >
                            {product.stock} {product.unit}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          ${product.costPrice.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ${product.salePrice.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={stockStatus.label}
                            color={stockStatus.color}
                            size="small"
                            icon={stockStatus.icon}
                          />
                        </TableCell>
                        <TableCell>
                          {product.expiryDate ? (
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: nearExpiry ? 'error.main' : 'text.primary'
                                }}
                              >
                                {new Date(product.expiryDate).toLocaleDateString()}
                              </Typography>
                              {nearExpiry && (
                                <Chip
                                  label="Próximo a vencer"
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleStockAdjustment(product)}
                              title="Ajustar Stock"
                            >
                              <Warning />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEditProduct(product)}
                              title="Editar"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Eliminar"
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
        <ProductForm
          open={productFormOpen}
          onClose={() => {
            setProductFormOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          categories={categories}
          suppliers={suppliers}
          onSuccess={() => {
            fetchProducts();
            setProductFormOpen(false);
            setSelectedProduct(null);
          }}
        />

        <StockAdjustmentDialog
          open={stockAdjustmentOpen}
          onClose={() => {
            setStockAdjustmentOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSuccess={() => {
            fetchProducts();
            setStockAdjustmentOpen(false);
            setSelectedProduct(null);
          }}
        />
      </motion.div>
    </Box>
  );
};

export default Inventory;