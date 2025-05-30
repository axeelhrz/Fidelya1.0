'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as LocalOfferIcon,
  Spa as SpaIcon, // Cambiado de Eco a Spa
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  QrCode as QrCodeIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductCategory, MenuData, ProductFilters } from '../types';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';
import QRGenerator from './QRGenerator';

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
  isAvailable: boolean;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionCard = motion(Card);

const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

const categoryColors: { [key: string]: string } = {
  'Entrada': '#3B82F6',
  'Principal': '#F59E0B',
  'Bebida': '#10B981',
  'Postre': '#8B5CF6',
  'Bebidas': '#10B981',
  'Sin Alcohol': '#06B6D4',
  'Tapas': '#F97316',
  'Principales': '#F59E0B',
  'Postres': '#8B5CF6',
  'Café': '#92400E',
  'Promociones': '#DC2626',
};

export const MenuEditor: React.FC<MenuEditorProps> = ({ menuId, onMenuUpdate }) => {
  const { menuData, loading, error, addProduct, updateProduct, deleteProduct, updateProductsAvailability } = useFirebaseMenu(menuId);
  
  // Estados del formulario
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Estados de filtros y vista
  const [filters, setFilters] = useState<ProductFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    category: 'Principal',
    isRecommended: false,
    isVegan: false,
    isAvailable: true,
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

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    if (!menuData?.products) return [];

    return menuData.products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.isAvailable !== undefined && product.isAvailable !== filters.isAvailable) return false;
      if (filters.isRecommended !== undefined && product.isRecommended !== filters.isRecommended) return false;
      if (filters.isVegan !== undefined && product.isVegan !== filters.isVegan) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return product.name.toLowerCase().includes(searchLower) ||
               product.description.toLowerCase().includes(searchLower);
      }
      if (filters.priceRange) {
        return product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
      }
      return true;
    });
  }, [menuData?.products, filters]);

  // Productos agrupados por categoría
  const groupedProducts: Record<ProductCategory, Product[]> = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<ProductCategory, Product[]>);
  }, [filteredProducts]);

  // Estadísticas del menú
  const statistics = useMemo(() => {
    if (!menuData?.products) return null;

    const products = menuData.products;
    return {
      total: products.length,
      available: products.filter(p => p.isAvailable).length,
      recommended: products.filter(p => p.isRecommended).length,
      vegan: products.filter(p => p.isVegan).length,
      avgPrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
      byCategory: Object.entries(groupedProducts).map(([category, items]) => ({
        category,
        count: items.length,
        avgPrice: items.reduce((sum, p) => sum + p.price, 0) / items.length
      }))
    };
  }, [menuData?.products, groupedProducts]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      category: 'Principal',
      isRecommended: false,
      isVegan: false,
      isAvailable: true,
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
      isAvailable: product.isAvailable ?? true,
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
      setSaveMessage('Error al eliminar el producto');
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
        await updateProduct(editingProduct.id, formData);
        setSaveMessage('Producto actualizado exitosamente');
      } else {
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

  const handleBulkAvailabilityUpdate = async (isAvailable: boolean) => {
    if (selectedProducts.length === 0) return;

    setFormLoading(true);
    try {
      if (updateProductsAvailability) {
        await updateProductsAvailability(selectedProducts, isAvailable);
      } else {
        // Fallback para actualizaciones individuales
        await Promise.all(
          selectedProducts.map(id => updateProduct(id, { isAvailable }))
        );
      }
      setSaveMessage(`${selectedProducts.length} productos ${isAvailable ? 'habilitados' : 'deshabilitados'} exitosamente`);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error actualizando disponibilidad:', error);
      setSaveMessage('Error al actualizar la disponibilidad');
    } finally {
      setFormLoading(false);
    }
  };

  const handleProductSelection = (productId: string, selected: boolean) => {
    setSelectedProducts(prev => 
      selected 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const clearFilters = () => {
    setFilters({});
  };

  const speedDialActions = [
    {
      icon: <AddIcon />,
      name: 'Agregar Producto',
      onClick: handleAddProduct,
    },
    {
      icon: <QrCodeIcon />,
      name: 'Generar QR',
      onClick: () => setShowQRGenerator(true),
    },
    {
      icon: <AnalyticsIcon />,
      name: 'Estadísticas',
      onClick: () => setShowStatistics(true),
    },
    {
      icon: <RefreshIcon />,
      name: 'Actualizar',
      onClick: () => window.location.reload(),
    },
  ];

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

      {/* Header del menú */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ p: 3, mb: 3 }}
      >
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <RestaurantIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {menuData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {menuData.description}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                size="small"
              >
                Filtros
              </Button>
            </Stack>
          </Box>

          {/* Estadísticas rápidas */}
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
            {statistics && (
              <>
                <Chip 
                  label={`${statistics.available} disponibles`}
                  color="success"
                  variant="outlined"
                />
                <Chip 
                  label={`${statistics.recommended} recomendados`}
                  color="warning"
                  variant="outlined"
                />
                <Chip 
                  label={`${statistics.vegan} veganos`}
                  color="info"
                  variant="outlined"
                />
              </>
            )}
          </Box>
        </Stack>
      </MotionPaper>

      {/* Panel de filtros */}
      <AnimatePresence>
        {showFilters && (
          <MotionPaper
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            sx={{ p: 3, mb: 3 }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filtros y Búsqueda
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buscar productos"
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={filters.category || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as ProductCategory || undefined }))}
                    label="Categoría"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.isAvailable ?? false}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          isAvailable: e.target.checked ? true : undefined 
                        }))}
                      />
                    }
                    label="Solo disponibles"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.isRecommended ?? false}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          isRecommended: e.target.checked ? true : undefined 
                        }))}
                      />
                    }
                    label="Recomendados"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.isVegan ?? false}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          isVegan: e.target.checked ? true : undefined 
                        }))}
                      />
                    }
                    label="Veganos"
                  />
                </Stack>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {filteredProducts.length} de {menuData.products.length} productos
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                onClick={clearFilters}
                disabled={Object.keys(filters).length === 0}
              >
                Limpiar filtros
              </Button>
            </Box>
          </MotionPaper>
        )}
      </AnimatePresence>

      {/* Acciones en lote */}
      {selectedProducts.length > 0 && (
        <MotionPaper
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ p: 2, mb: 3, backgroundColor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">
              {selectedProducts.length} productos seleccionados
            </Typography>
            
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleBulkAvailabilityUpdate(true)}
                disabled={formLoading}
              >
                Habilitar
              </Button>
              
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleBulkAvailabilityUpdate(false)}
                disabled={formLoading}
              >
                Deshabilitar
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSelectedProducts([])}
                sx={{ color: 'inherit', borderColor: 'currentColor' }}
              >
                Cancelar
              </Button>
            </Stack>
          </Box>
        </MotionPaper>
      )}

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
              transition={{ duration: 0.5, delay: 0.1 + categoryIndex * 0.05 }}
              sx={{ p: 3 }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      backgroundColor: categoryColors[category] || '#666',
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
                      backgroundColor: `${categoryColors[category] || '#666'}20`,
                      color: categoryColors[category] || '#666',
                    }}
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    Precio promedio: ${Math.round(categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {viewMode === 'grid' ? (
                <Grid container spacing={2}>
                  {categoryProducts.map((product, productIndex) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <MotionCard
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: productIndex * 0.05 }}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          backgroundColor: product.isAvailable ? 'background.paper' : 'rgba(255, 255, 255, 0.05)',
                          border: selectedProducts.includes(product.id) ? '2px solid' : '1px solid',
                          borderColor: selectedProducts.includes(product.id) ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <CardContent sx={{ flex: 1 }}>
                          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                            <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
                              {product.name}
                            </Typography>
                            
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={selectedProducts.includes(product.id)}
                                  onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                                />
                              }
                              label=""
                              sx={{ m: 0 }}
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {product.description}
                          </Typography>

                          <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
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
                                icon={<SpaIcon />}
                                label="Vegano"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            )}
                            {!product.isAvailable && (
                              <Chip
                                icon={<VisibilityOffIcon />}
                                label="No disponible"
                                size="small"
                                color="error"
                                variant="filled"
                              />
                            )}
                          </Box>

                          <Typography variant="h6" color="secondary.main" fontWeight={600}>
                            ${product.price.toLocaleString()}
                          </Typography>
                        </CardContent>

                        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Editar producto">
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
                            </Tooltip>
                            
                            <Tooltip title="Eliminar producto">
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
                            </Tooltip>
                          </Box>

                          <Tooltip title={product.isAvailable ? "Deshabilitar" : "Habilitar"}>
                            <IconButton
                              onClick={() => updateProduct(product.id, { isAvailable: !product.isAvailable })}
                              size="small"
                              sx={{
                                backgroundColor: product.isAvailable ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                color: product.isAvailable ? '#ef4444' : '#22c55e',
                                '&:hover': {
                                  backgroundColor: product.isAvailable ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                },
                              }}
                            >
                              {product.isAvailable ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </MotionCard>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Stack spacing={1}>
                  {categoryProducts.map((product, productIndex) => (
                    <MotionBox
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: productIndex * 0.03 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: product.isAvailable ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
                          border: selectedProducts.includes(product.id) ? '2px solid' : '1px solid',
                          borderColor: selectedProducts.includes(product.id) ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          },
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={2} flex={1}>
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={selectedProducts.includes(product.id)}
                                  onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                                />
                              }
                              label=""
                              sx={{ m: 0 }}
                            />

                            <Box flex={1}>
                              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
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
                                    icon={<SpaIcon />}
                                    label="Vegano"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                )}
                                {!product.isAvailable && (
                                  <Chip
                                    icon={<VisibilityOffIcon />}
                                    label="No disponible"
                                    size="small"
                                    color="error"
                                    variant="filled"
                                  />

                                )}
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary">
                                {product.description}
                              </Typography>
                            </Box>

                            <Typography variant="h6" color="secondary.main" fontWeight={600} sx={{ minWidth: 100, textAlign: 'right' }}>
                              ${product.price.toLocaleString()}
                            </Typography>
                          </Box>

                          <Box display="flex" gap={1} ml={2}>
                            <Tooltip title={product.isAvailable ? "Deshabilitar" : "Habilitar"}>
                              <IconButton
                                onClick={() => updateProduct(product.id, { isAvailable: !product.isAvailable })}
                                size="small"
                                sx={{
                                  backgroundColor: product.isAvailable ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                  color: product.isAvailable ? '#ef4444' : '#22c55e',
                                  '&:hover': {
                                    backgroundColor: product.isAvailable ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                  },
                                }}
                              >
                                {product.isAvailable ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Editar producto">
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
                            </Tooltip>
                            
                            <Tooltip title="Eliminar producto">
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
                            </Tooltip>
                          </Box>
                        </Box>
                      </Paper>
                    </MotionBox>
                  ))}
                </Stack>
              )}
            </MotionPaper>
          );
        })}
      </Stack>

      {/* SpeedDial para acciones rápidas */}
      <SpeedDial
        ariaLabel="Acciones del menú"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>

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

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                }
                label="Producto disponible"
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

      {/* Dialog para generar QR */}
      <Dialog
        open={showQRGenerator}
        onClose={() => setShowQRGenerator(false)}
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
            Generador de Código QR
          </Typography>
        </DialogTitle>
        <DialogContent>
          <QRGenerator
            menuId={menuData.id}
            menuName={menuData.name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQRGenerator(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de estadísticas */}
      <Dialog
        open={showStatistics}
        onClose={() => setShowStatistics(false)}
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
            Estadísticas del Menú
          </Typography>
        </DialogTitle>
        <DialogContent>
          {statistics && (
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                      {statistics.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total productos
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main" fontWeight={700}>
                      {statistics.available}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Disponibles
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="warning.main" fontWeight={700}>
                      {statistics.recommended}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recomendados
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="info.main" fontWeight={700}>
                      {statistics.vegan}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Veganos
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Precio Promedio General
                </Typography>
                <Typography variant="h4" color="secondary.main" fontWeight={600}>
                  ${Math.round(statistics.avgPrice).toLocaleString()}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Productos por Categoría
                </Typography>
                <Stack spacing={2}>
                  {statistics.byCategory.map((cat) => (
                    <Box key={cat.category} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: categoryColors[cat.category] || '#666',
                          }}
                        />
                        <Typography variant="body1">{cat.category}</Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body1" fontWeight={600}>
                          {cat.count} productos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Promedio: ${Math.round(cat.avgPrice).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatistics(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuEditor;