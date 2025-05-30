'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fade,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductCategory, MenuData } from '../types';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';

interface SimpleMenuEditorProps {
  menuId: string;
}

interface EditingProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
}

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

const categoryColors = {
  'Entrada': '#3B82F6',
  'Principal': '#F59E0B',
  'Bebida': '#10B981',
  'Postre': '#8B5CF6',
};

export const SimpleMenuEditor: React.FC<SimpleMenuEditorProps> = ({ menuId }) => {
  const { menuData, loading, error, addProduct, updateProduct, deleteProduct } = useFirebaseMenu(menuId);
  
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    category: 'Principal' as ProductCategory,
  });

  // Limpiar mensaje después de 3 segundos
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // Agrupar productos por categoría
  const groupedProducts = menuData?.products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<ProductCategory, Product[]>) || {};

  const handleEditProduct = (product: Product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    setFormLoading(true);
    try {
      await updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        category: editingProduct.category,
      });
      setEditingProduct(null);
      setSaveMessage('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando producto:', error);
      setSaveMessage('Error al actualizar el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setFormLoading(true);
    try {
      await deleteProduct(productToDelete.id);
      setSaveMessage('Producto eliminado exitosamente');
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setSaveMessage('Error al eliminar el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || newProduct.price <= 0) {
      setSaveMessage('Por favor completa todos los campos requeridos');
      return;
    }

    setFormLoading(true);
    try {
      await addProduct({
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        category: newProduct.category,
        isRecommended: false,
        isVegan: false,
        isAvailable: true,
      });
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        category: 'Principal',
      });
      setShowAddForm(false);
      setSaveMessage('Producto agregado exitosamente');
    } catch (error) {
      console.error('Error agregando producto:', error);
      setSaveMessage('Error al agregar el producto');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!menuData) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Menú no encontrado
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Mensaje de guardado */}
      <AnimatePresence>
        {saveMessage && (
          <Fade in={!!saveMessage}>
            <Alert 
              severity={saveMessage.includes('Error') ? 'error' : 'success'} 
              sx={{ mb: 3 }}
              onClose={() => setSaveMessage(null)}
            >
              {saveMessage}
            </Alert>
          </Fade>
        )}
      </AnimatePresence>

      {/* Header */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ p: 4, mb: 4, textAlign: 'center' }}
      >
        <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
          {menuData.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          {menuData.description}
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          size="large"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
          }}
        >
          Agregar Producto
        </Button>
      </MotionPaper>

      {/* Productos por categoría */}
      <Stack spacing={4}>
        {categories.map((category, categoryIndex) => {
          const categoryProducts = groupedProducts[category] || [];
          if (categoryProducts.length === 0) return null;

          return (
            <MotionPaper
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              sx={{ p: 4 }}
            >
              {/* Header de categoría */}
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 6,
                    height: 30,
                    backgroundColor: categoryColors[category],
                    borderRadius: 3,
                  }}
                />
                <Typography variant="h5" fontWeight={600}>
                  {category}
                </Typography>
                <Chip 
                  label={`${categoryProducts.length} productos`}
                  sx={{ 
                    backgroundColor: `${categoryColors[category]}20`,
                    color: categoryColors[category],
                  }}
                />
              </Box>

              {/* Lista de productos */}
              <Grid container spacing={3}>
                {categoryProducts.map((product, productIndex) => (
                  <Grid item xs={12} md={6} key={product.id}>
                    <MotionCard
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: productIndex * 0.05 }}
                      sx={{
                        height: '100%',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        {editingProduct?.id === product.id ? (
                          // Modo edición
                          <Stack spacing={2}>
                            <TextField
                              label="Nombre"
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({
                                ...editingProduct,
                                name: e.target.value
                              })}
                              fullWidth
                              size="small"
                            />
                            
                            <TextField
                              label="Precio"
                              type="number"
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({
                                ...editingProduct,
                                price: Number(e.target.value)
                              })}
                              fullWidth
                              size="small"
                              InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                              }}
                            />
                            
                            <TextField
                              label="Descripción"
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({
                                ...editingProduct,
                                description: e.target.value
                              })}
                              fullWidth
                              multiline
                              rows={2}
                              size="small"
                            />
                            
                            <FormControl fullWidth size="small">
                              <InputLabel>Categoría</InputLabel>
                              <Select
                                value={editingProduct.category}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  category: e.target.value as ProductCategory
                                })}
                                label="Categoría"
                              >
                                {categories.map((cat) => (
                                  <MenuItem key={cat} value={cat}>
                                    {cat}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            
                            <Box display="flex" gap={1} justifyContent="flex-end">
                              <IconButton
                                onClick={handleSaveEdit}
                                disabled={formLoading}
                                sx={{
                                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                  color: '#22c55e',
                                  '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
                                }}
                              >
                                {formLoading ? <CircularProgress size={20} /> : <CheckIcon />}
                              </IconButton>
                              
                              <IconButton
                                onClick={handleCancelEdit}
                                disabled={formLoading}
                                sx={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  color: '#ef4444',
                                  '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Box>
                          </Stack>
                        ) : (
                          // Modo vista
                          <>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Typography variant="h6" fontWeight={600}>
                                {product.name}
                              </Typography>
                              
                              <Box display="flex" gap={1}>
                                <IconButton
                                  onClick={() => handleEditProduct(product)}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    color: 'primary.main',
                                    '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                
                                <IconButton
                                  onClick={() => handleDeleteProduct(product)}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {product.description}
                            </Typography>
                            
                            <Typography variant="h5" color="secondary.main" fontWeight={600}>
                              ${product.price.toLocaleString()}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            </MotionPaper>
          );
        })}
      </Stack>

      {/* Dialog para agregar producto */}
      <Dialog
        open={showAddForm}
        onClose={() => !formLoading && setShowAddForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: '#2C2C2E',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Agregar Nuevo Producto
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del producto"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Precio"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              fullWidth
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              label="Descripción"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })}
                label="Categoría"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowAddForm(false)}
            disabled={formLoading}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleAddProduct}
            variant="contained"
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !formLoading && setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: '#2C2C2E',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Confirmar eliminación
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar &quot;{productToDelete?.name}&quot;?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={formLoading}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimpleMenuEditor;