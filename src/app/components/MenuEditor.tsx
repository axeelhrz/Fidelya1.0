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
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as LocalOfferIcon,
  Eco,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductCategory, MenuData } from '../types';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';

interface MenuEditorProps {
  menuId: string;
  onMenuUpdate?: (menu: MenuData) => void;
}

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  isRecommended: boolean;
  isVegan: boolean;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

const categoryColors = {
  'Entrada': '#3B82F6',
  'Principal': '#F59E0B',
  'Bebida': '#10B981',
  'Postre': '#8B5CF6',
};

export const MenuEditor: React.FC<MenuEditorProps> = ({ menuId, onMenuUpdate }) => {
  const { menuData, loading, error, addProduct, updateProduct, deleteProduct } = useFirebaseMenu(menuId);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    category: 'Principal',
    isRecommended: false,
    isVegan: false,
  });

  // Notificar cambios del menú al componente padre
  useEffect(() => {
    if (menuData && onMenuUpdate) {
      onMenuUpdate(menuData);
    }
  }, [menuData, onMenuUpdate]);

  // Limpiar mensaje de guardado después de 3 segundos
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      category: 'Principal',
      isRecommended: false,
      isVegan: false,
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleAddProduct = () => {
    resetForm();
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      isRecommended: product.isRecommended || false,
      isVegan: product.isVegan || false,
    });
    setEditingProduct(product);
    setShowProductForm(true);
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
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name.trim() || formData.price <= 0) {
      setSaveMessage('Por favor completa todos los campos requeridos');
      return;
    }

    setFormLoading(true);
    try {
      if (editingProduct) {
        // Actualizar producto existente
        const updatedProduct: Product = {
          ...editingProduct,
          ...formData,
        };
        await updateProduct(editingProduct.id, updatedProduct);
        setSaveMessage('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        await addProduct(formData);
        setSaveMessage('Producto agregado exitosamente');
      }
      resetForm();
    } catch (error) {
      console.error('Error guardando producto:', error);
      setSaveMessage('Error al guardar el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const groupedProducts: Record<ProductCategory, Product[]> = menuData?.products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<ProductCategory, Product[]>) || {} as Record<ProductCategory, Product[]>;

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
    <Box>
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

      {/* Información del menú */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ p: 3, mb: 3 }}
      >
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <RestaurantIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600}>
              {menuData.name}
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary">
            {menuData.description}
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip 
              label={`${menuData.products.length} productos`}
              color="primary"
              variant="filled"
            />
            <Chip 
              label={`${Object.keys(groupedProducts).length} categorías`}
              color="secondary"
              variant="filled"
            />
          </Box>
        </Stack>
      </MotionPaper>

      {/* Botón agregar producto */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        sx={{ mb: 3 }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          size="large"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            },
          }}
        >
          Agregar Producto
        </Button>
      </MotionBox>

      {/* Lista de productos por categoría */}
      <Stack spacing={3}>
        {categories.map((category, categoryIndex) => {
          const categoryProducts = groupedProducts[category] || [];
          if (categoryProducts.length === 0) return null;

          return (
            <MotionPaper
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + categoryIndex * 0.1 }}
              sx={{ p: 3 }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    backgroundColor: categoryColors[category],
                    borderRadius: 2,
                  }}
                />
                <Typography variant="h6" fontWeight={600}>
                  {category}
                </Typography>
                <Chip 
                  label={categoryProducts.length}
                  size="small"
                  sx={{ 
                    backgroundColor: `${categoryColors[category]}20`,
                    color: categoryColors[category],
                  }}
                />
              </Box>

              <Stack spacing={2}>
                {categoryProducts.map((product, productIndex) => (
                  <MotionBox
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: productIndex * 0.05 }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {product.name}
                            </Typography>
                            {product.isRecommended && (
                              <Chip
                                icon={<LocalOfferIcon />}
                                label="Recomendado"
                                size="small"
                                color="success"
                                variant="filled"
                              />
                            )}
                            {product.isVegan && (
                              <Chip
                                icon={<Eco />}
                                label="Vegano"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {product.description}
                          </Typography>
                          
                          <Typography variant="h6" color="secondary.main" fontWeight={600}>
                            ${product.price.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box display="flex" gap={1}>
                          <IconButton
                            onClick={() => handleEditProduct(product)}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              },
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
                              '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  </MotionBox>
                ))}
              </Stack>
            </MotionPaper>
          );
        })}
      </Stack>

      {/* Dialog para agregar/editar producto */}
      <Dialog
        open={showProductForm}
        onClose={() => !formLoading && resetForm()}
        maxWidth="md"
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
            {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del producto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Precio"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              fullWidth
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                label="Categoría"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRecommended}
                    onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                  />
                }
                label="Producto recomendado"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVegan}
                    onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                  />
                }
                label="Producto vegano"
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={resetForm}
            disabled={formLoading}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            {editingProduct ? 'Actualizar' : 'Agregar'}
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

export default MenuEditor;