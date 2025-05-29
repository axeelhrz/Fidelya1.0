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
import { Product } from '../types';

// Mock hook for Firestore - replace with your actual implementation
const useFirestore = <T,>(collection: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = async (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Adding item:', item);
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    console.log('Updating item:', id, updates);
  };

  const deleteItem = async (id: string) => {
    console.log('Deleting item:', id);
  };

  return { data, loading, addItem, updateItem, deleteItem };
};

// Mock ProductCard component
const ProductCard: React.FC<{
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  index: number;
}> = ({ product, onEdit, onDelete, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {product.category}
          </Typography>
          <Typography variant="h6" color="primary">
            ${product.price.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Stock: {product.stock} unidades
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button size="small" onClick={() => onEdit(product)}>
              Editar
            </Button>
            <Button size="small" color="error" onClick={() => onDelete(product.id)}>
              Eliminar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Mock ProductDialog component
const ProductDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ open, onClose, product, onSave }) => {
  if (!open) return null;
  
  return (
    <div>
      <p>Product Dialog - Replace with your actual implementation</p>
    </div>
  );
};

export const Inventory: React.FC = () => {
  const { data: products, loading, addItem, updateItem, deleteItem } = useFirestore<Product>('products');
  
  // State management
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

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteItem(id);
        console.log('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingProduct) {
        await updateItem(editingProduct.id, productData);
        console.log('Producto actualizado exitosamente');
      } else {
        await addItem(productData);
        console.log('Producto agregado exitosamente');
      }
      setDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

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
