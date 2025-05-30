'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Fab,
  InputAdornment,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowBack,
  Add,
  Edit,
  Delete,
  Search,
  AttachMoney,
  Restaurant,
  Star,
  LocalFlorist,
  Save,
  Close
} from '@mui/icons-material';
import { Product, ProductCategory } from '../../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionFab = motion(Fab);

interface ProductManagerProps {
  onBack: () => void;
}

// Datos de ejemplo - en producción vendrían de la API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fernet con Cola',
    price: 2500,
    description: 'Fernet Branca con Coca Cola, hielo y limón',
    category: 'Bebidas',
    isRecommended: true,
    isVegan: true,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Empanadas de Carne',
    price: 1800,
    description: 'Empanadas caseras de carne cortada a cuchillo',
    category: 'Tapas',
    isRecommended: false,
    isVegan: false,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Bife de Chorizo',
    price: 4500,
    description: 'Bife de chorizo a la parrilla con papas fritas',
    category: 'Principales',
    isRecommended: true,
    isVegan: false,
    isAvailable: true
  },
  {
    id: '4',
    name: 'Café Cortado',
    price: 800,
    description: 'Café cortado tradicional argentino',
    category: 'Café',
    isRecommended: false,
    isVegan: true,
    isAvailable: true
  }
];

const categories: ProductCategory[] = [
  'Bebidas', 'Sin Alcohol', 'Tapas', 'Principales', 'Postres', 'Café', 'Promociones'
];

const initialFormData = {
  name: '',
  price: 0,
  description: '',
  category: 'Bebidas' as ProductCategory,
  isRecommended: false,
  isVegan: false,
  isAvailable: true
};

export default function ProductManager({ onBack }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas con conteo
  const categoriesWithCount = [
    { name: 'Todas', count: products.length },
    ...categories.map(cat => ({
      name: cat,
      count: products.filter(p => p.category === cat).length
    }))
  ];

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        isRecommended: product.isRecommended || false,
        isVegan: product.isVegan || false,
        isAvailable: product.isAvailable !== false
      });
    } else {
      setEditingProduct(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData(initialFormData);
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      if (editingProduct) {
        // Editar producto existente
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...formData, updatedAt: new Date().toISOString() }
            : p
        ));
        setAlert({ type: 'success', message: 'Producto actualizado correctamente' });
      } else {
        // Crear nuevo producto
        const newProduct: Product = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProducts(prev => [...prev, newProduct]);
        setAlert({ type: 'success', message: 'Producto creado correctamente' });
      }

      handleCloseDialog();
    } catch {
      setAlert({ type: 'error', message: 'Error al guardar el producto' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(prev => prev.filter(p => p.id !== productId));
      setAlert({ type: 'success', message: 'Producto eliminado correctamente' });
    } catch {
      setAlert({ type: 'error', message: 'Error al eliminar el producto' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, isAvailable: !p.isAvailable }
        : p
    ));
  };

  // Auto-hide alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <IconButton
            onClick={onBack}
            sx={{
              color: '#B8B8B8',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 0,
              '&:hover': {
                color: '#D4AF37',
                borderColor: 'rgba(212, 175, 55, 0.5)',
                backgroundColor: 'rgba(212, 175, 55, 0.1)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>

          <Box>
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 700,
                color: '#F8F8F8',
                letterSpacing: '0.02em'
              }}
            >
              Gestión de Productos
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                color: '#B8B8B8'
              }}
            >
              Administra los productos de tu menú
            </Typography>
          </Box>
        </Stack>

        {/* Barra de búsqueda y filtros */}
        <Stack spacing={3}>
          <TextField
            fullWidth
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#B8B8B8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(212, 175, 55, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#D4AF37',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#F8F8F8',
                fontFamily: "'Inter', sans-serif",
              },
            }}
          />

          {/* Filtros de categoría */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {categoriesWithCount.map((category) => (
              <Chip
                key={category.name}
                label={`${category.name} (${category.count})`}
                onClick={() => setSelectedCategory(category.name)}
                variant={selectedCategory === category.name ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: 0,
                  fontWeight: selectedCategory === category.name ? 600 : 500,
                  fontSize: '0.875rem',
                  fontFamily: "'Inter', sans-serif",
                  backgroundColor: selectedCategory === category.name 
                    ? '#D4AF37' 
                    : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === category.name 
                    ? '#0A0A0A' 
                    : '#B8B8B8',
                  borderColor: selectedCategory === category.name 
                    ? '#D4AF37' 
                    : 'rgba(212, 175, 55, 0.3)',
                  '&:hover': {
                    backgroundColor: selectedCategory === category.name 
                      ? '#E8C547' 
                      : 'rgba(212, 175, 55, 0.1)',
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Alert */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity={alert.type}
              sx={{
                mb: 3,
                borderRadius: 0,
                backgroundColor: alert.type === 'success' 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                border: alert.type === 'success' 
                  ? '1px solid rgba(34, 197, 94, 0.3)' 
                  : '1px solid rgba(239, 68, 68, 0.3)',
                color: alert.type === 'success' ? '#22C55E' : '#F87171',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {alert.message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de productos */}
      <Stack spacing={2}>
        <AnimatePresence>
          {filteredProducts.map((product, index) => (
            <MotionCard
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              sx={{
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(20px)',
                border: product.isRecommended 
                  ? '1px solid rgba(212, 175, 55, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 0,
                opacity: product.isAvailable ? 1 : 0.6,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  {/* Información del producto */}
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          sx={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#F8F8F8',
                            mb: 0.5
                          }}
                        >
                          {product.name}
                        </Typography>
                        
                        <Typography 
                          sx={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.875rem',
                            color: '#B8B8B8',
                            mb: 1
                          }}
                        >
                          {product.description}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip
                            label={product.category}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: '#3B82F6',
                              fontSize: '0.75rem',
                              fontFamily: "'Inter', sans-serif",
                              borderRadius: 0
                            }}
                          />
                          
                          {product.isRecommended && (
                            <Chip
                              icon={<Star sx={{ fontSize: 14 }} />}
                              label="Recomendado"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                color: '#D4AF37',
                                fontSize: '0.75rem',
                                fontFamily: "'Inter', sans-serif",
                                borderRadius: 0
                              }}
                            />
                          )}
                          
                          {product.isVegan && (
                            <Chip
                              icon={<LocalFlorist sx={{ fontSize: 14 }} />}
                              label="Vegano"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                                color: '#22C55E',
                                fontSize: '0.75rem',
                                fontFamily: "'Inter', sans-serif",
                                borderRadius: 0
                              }}
                            />
                          )}
                        </Stack>
                      </Box>

                      {/* Precio */}
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                          sx={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: '#D4AF37'
                          }}
                        >
                          ${product.price.toLocaleString('es-AR')}
                        </Typography>
                        
                        <Typography 
                          sx={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.75rem',
                            color: product.isAvailable ? '#22C55E' : '#F87171',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}
                        >
                          {product.isAvailable ? 'Disponible' : 'No disponible'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Acciones */}
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => handleToggleAvailability(product.id)}
                      sx={{
                        color: product.isAvailable ? '#22C55E' : '#F87171',
                        border: `1px solid ${product.isAvailable ? 'rgba(34, 197, 94, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: product.isAvailable 
                            ? 'rgba(34, 197, 94, 0.1)' 
                            : 'rgba(248, 113, 113, 0.1)',
                        }
                      }}
                    >
                      <Restaurant />
                    </IconButton>

                    <IconButton
                      onClick={() => handleOpenDialog(product)}
                      sx={{
                        color: '#3B82F6',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        }
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDeleteProduct(product.id)}
                      sx={{
                        color: '#F87171',
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </MotionCard>
          ))}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Restaurant sx={{ fontSize: 64, color: '#B8B8B8', mb: 2 }} />
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.125rem',
                color: '#B8B8B8',
                mb: 1
              }}
            >
              No se encontraron productos
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                color: '#B8B8B8',
                opacity: 0.7
              }}
            >
              Intenta cambiar los filtros o agregar un nuevo producto
            </Typography>
          </Box>
        )}
      </Stack>

      {/* FAB para agregar producto */}
      <MotionFab
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleOpenDialog()}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
          color: '#0A0A0A',
          borderRadius: 0,
          width: 64,
          height: 64,
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
            boxShadow: '0 12px 40px rgba(212, 175, 55, 0.4)',
          }
        }}
      >
        <Add sx={{ fontSize: 28 }} />
      </MotionFab>

      {/* Dialog para crear/editar producto */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: 0,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#F8F8F8',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nombre del producto"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(212, 175, 55, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                },
                '& .MuiInputLabel-root': {
                  color: '#B8B8B8',
                  fontFamily: "'Inter', sans-serif",
                  '&.Mui-focused': { color: '#D4AF37' },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#F8F8F8',
                  fontFamily: "'Inter', sans-serif",
                },
              }}
            />

            <TextField
              fullWidth
              label="Precio"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(212, 175, 55, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                },
                '& .MuiInputLabel-root': {
                  color: '#B8B8B8',
                  fontFamily: "'Inter', sans-serif",
                  '&.Mui-focused': { color: '#D4AF37' },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#F8F8F8',
                  fontFamily: "'Inter', sans-serif",
                },
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(212, 175, 55, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                },
                '& .MuiInputLabel-root': {
                  color: '#B8B8B8',
                  fontFamily: "'Inter', sans-serif",
                  '&.Mui-focused': { color: '#D4AF37' },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#F8F8F8',
                  fontFamily: "'Inter', sans-serif",
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ 
                color: '#B8B8B8',
                fontFamily: "'Inter', sans-serif",
                '&.Mui-focused': { color: '#D4AF37' }
              }}>
                Categoría
              </InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                sx={{
                  borderRadius: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.5)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
                  '& .MuiSelect-select': {
                    color: '#F8F8F8',
                    fontFamily: "'Inter', sans-serif",
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRecommended}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRecommended: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#D4AF37' },
                    }}
                  />
                }
                label="Producto recomendado"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: '#F8F8F8',
                    fontFamily: "'Inter', sans-serif",
                  }
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVegan}
                    onChange={(e) => setFormData(prev => ({ ...prev, isVegan: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#22C55E' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22C55E' },
                    }}
                  />
                }
                label="Producto vegano"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: '#F8F8F8',
                    fontFamily: "'Inter', sans-serif",
                  }
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#22C55E' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22C55E' },
                    }}
                  />
                }
                label="Producto disponible"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: '#F8F8F8',
                    fontFamily: "'Inter', sans-serif",
                  }
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <Button
            onClick={handleCloseDialog}
            startIcon={<Close />}
            sx={{
            


              color: '#B8B8B8',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              fontFamily: "'Inter', sans-serif",
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSaveProduct}
            disabled={loading || !formData.name.trim() || formData.price <= 0}
            startIcon={<Save />}
            variant="contained"
            sx={{
              background: loading || !formData.name.trim() || formData.price <= 0
                ? 'rgba(212, 175, 55, 0.3)'
                : 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              color: loading || !formData.name.trim() || formData.price <= 0 ? '#B8B8B8' : '#0A0A0A',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              '&:hover': {
                background: loading || !formData.name.trim() || formData.price <= 0
                  ? 'rgba(212, 175, 55, 0.3)'
                  : 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
              },
              '&:disabled': {
                background: 'rgba(212, 175, 55, 0.3)',
                color: '#B8B8B8'
              }
            }}
          >
            {loading ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
}