import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Search,
  Add,
  Inventory as InventoryIcon,
  FilterList,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../types';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Manzanas Rojas',
    category: 'Frutas',
    price: 2500,
    cost: 1500,
    stock: 50,
    minStock: 10,
    supplier: 'Frutería Central',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Bananos',
    category: 'Frutas',
    price: 1800,
    cost: 1000,
    stock: 30,
    minStock: 5,
    supplier: 'Distribuidora Tropical',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Naranjas',
    category: 'Frutas',
    price: 2000,
    cost: 1200,
    stock: 25,
    minStock: 8,
    supplier: 'Frutería Central',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Lechuga',
    category: 'Verduras',
    price: 1500,
    cost: 800,
    stock: 20,
    minStock: 5,
    supplier: 'Verduras Frescas',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Tomates',
    category: 'Verduras',
    price: 3000,
    cost: 2000,
    stock: 15,
    minStock: 10,
    supplier: 'Verduras Frescas',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];


// ProductCard component
const ProductCard: React.FC<{
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  index: number;
}> = ({ product, onEdit, onDelete, index }) => {
  const isLowStock = product.stock <= product.minStock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: isLowStock ? '2px solid #ff9800' : 'none',
        position: 'relative'
      }}>
        {isLowStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#ff9800',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            Stock Bajo
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {product.category}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${product.price.toLocaleString()}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Stock: {product.stock} unidades
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Proveedor: {product.supplier}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Costo: ${product.cost.toLocaleString()}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={() => onEdit(product)}>
              Editar
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={() => onDelete(product.id)}>
              Eliminar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Simple ProductDialog component
const ProductDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    cost: product?.cost || 0,
    stock: product?.stock || 0,
    minStock: product?.minStock || 0,
    supplier: product?.supplier || '',
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        minStock: product.minStock,
        supplier: product.supplier,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 0,
        supplier: '',
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
      onClick={onClose}
    >
      <Card
        sx={{ 
          p: 3, 
          minWidth: 400, 
          maxWidth: 500,
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" gutterBottom>
          {product ? 'Editar Producto' : 'Agregar Producto'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Categoría"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Precio"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
            fullWidth
          />
          <TextField
            label="Costo"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
            required
            fullWidth
          />
          <TextField
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            required
            fullWidth
          />
          <TextField
            label="Stock Mínimo"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
            required
            fullWidth
          />
          <TextField
            label="Proveedor"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            required
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              {product ? 'Actualizar' : 'Agregar'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export const Inventory: React.FC = () => {
  // State management
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.filter(Boolean);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Event handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== id));
      console.log('Producto eliminado exitosamente');
    }
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...productData, updatedAt: new Date() }
          : product
      ));
      console.log('Producto actualizado exitosamente');
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts([...products, newProduct]);
      console.log('Producto agregado exitosamente');
    }
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  // Get low stock count
  const lowStockCount = products.filter(product => product.stock <= product.minStock).length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 }
        }}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Inventario
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona tus productos y controla el stock
            </Typography>
            {lowStockCount > 0 && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                ⚠️ {lowStockCount} producto{lowStockCount > 1 ? 's' : ''} con stock bajo
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddProduct}
            size="large"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            Agregar Producto
          </Button>
        </Box>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              alignItems: { xs: 'stretch', md: 'center' }
            }}>
              {/* Search Field */}
              <Box sx={{ flex: { xs: '1', md: '2' } }}>
                <TextField
                  fullWidth
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Category Filter */}
              <Box sx={{ flex: { xs: '1', md: '1.5' } }}>
                <FormControl fullWidth>
                  <InputLabel>Filtrar por Categoría</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Filtrar por Categoría"
                  >
                    <MenuItem value="">Todas las Categorías</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Clear Filters Button */}
              <Box sx={{ flex: { xs: '1', md: '1' } }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={clearFilters}
                  fullWidth
                >
                  Limpiar Filtros
                </Button>
              </Box>

              {/* Product Count */}
              <Box sx={{ 
                flex: { xs: '1', md: 'auto' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-end' }
              }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredProducts.length} productos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Product List */}
      <AnimatePresence>
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}
        >
          {filteredProducts.map((product, index) => (
            <Box 
              key={product.id}
              sx={{ 
                flex: { 
                  xs: '1 1 280px',
                  sm: '1 1 300px',
                  md: '1 1 320px',
                  lg: '1 1 300px'
                },
                minWidth: { xs: '280px', sm: '300px' },
                maxWidth: { xs: '100%', sm: '400px' }
              }}
            >
              <ProductCard
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                index={index}
              />
            </Box>
          ))}
        </Box>
      </AnimatePresence>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron productos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || categoryFilter
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer producto al inventario'}
            </Typography>
            {!searchTerm && !categoryFilter && (
              <Button variant="contained" startIcon={<Add />} onClick={handleAddProduct}>
                Agregar Primer Producto
              </Button>
            )}
          </Box>
        </motion.div>
      )}

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddProduct}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <Add />
      </Fab>

      {/* Product Dialog */}
      <ProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </Box>
  );
};