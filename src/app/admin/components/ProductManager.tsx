'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  Chip,
  FormControlLabel,
  Switch,
  Autocomplete
} from '@mui/material';
import { Edit, Delete, Add, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFirebaseMenu } from '../../../hooks/useFirebaseMenu';
import { Product, Menu, ProductCategory } from '../../types';

interface ProductManagerProps {
  products: Product[];
  menus: Menu[];
  selectedMenuId: string;
}

const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'APPETIZER', label: 'Entrada' },
  { value: 'MAIN_COURSE', label: 'Plato Principal' },
  { value: 'DESSERT', label: 'Postre' },
  { value: 'BEVERAGE', label: 'Bebida' },
  { value: 'COCKTAIL', label: 'Cóctel' },
  { value: 'WINE', label: 'Vino' },
  { value: 'BEER', label: 'Cerveza' },
  { value: 'COFFEE', label: 'Café' },
  { value: 'NON_ALCOHOLIC', label: 'Sin Alcohol' },
  { value: 'SIDE_DISH', label: 'Acompañamiento' },
  { value: 'SNACK', label: 'Snack' }
];

const COMMON_TAGS = [
  'recomendado', 'nuevo', 'popular', 'especial', 'premium', 'clásico',
  'picante', 'dulce', 'refrescante', 'caliente', 'frío', 'casero',
  'artesanal', 'importado', 'nacional', 'temporada', 'compartir'
];

export default function ProductManager({ products, selectedMenuId }: ProductManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '' as ProductCategory,
    menuId: selectedMenuId,
    image: '',
    isAvailable: true,
    allergens: [] as string[],
    tags: [] as string[],
    preparationTime: '',
    calories: '',
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false
  });

  const {
    createProduct,
    updateProduct,
    deleteProduct,
    error
  } = useFirebaseMenu();

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category as ProductCategory,
        menuId: product.menuId || selectedMenuId,
        image: product.image || '',
        isAvailable: product.isAvailable ?? true,
        allergens: product.allergens || [],
        tags: product.tags || [],
        preparationTime: product.preparationTime?.toString() || '',
        calories: product.nutritionalInfo?.calories?.toString() || '',
        isVegan: product.nutritionalInfo?.isVegan || false,
        isVegetarian: product.nutritionalInfo?.isVegetarian || false,
        isGlutenFree: product.nutritionalInfo?.isGlutenFree || false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '' as ProductCategory,
        menuId: selectedMenuId,
        image: '',
        isAvailable: true,
        allergens: [],
        tags: [],
        preparationTime: '',
        calories: '',
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    try {
      // Build nutritionalInfo object, filtering out undefined values
      const nutritionalInfo: {
        isVegan: boolean;
        isVegetarian: boolean;
        isGlutenFree: boolean;
        calories?: number;
      } = {
        isVegan: formData.isVegan,
        isVegetarian: formData.isVegetarian,
        isGlutenFree: formData.isGlutenFree
      };

      // Only add calories if it has a value
      if (formData.calories && formData.calories.trim() !== '') {
        nutritionalInfo.calories = parseInt(formData.calories);
      }

      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        category: formData.category,
        menuId: formData.menuId,
        image: formData.image || undefined,
        isAvailable: formData.isAvailable,
        allergens: formData.allergens.length > 0 ? formData.allergens : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        preparationTime: formData.preparationTime && formData.preparationTime.trim() !== '' 
          ? parseInt(formData.preparationTime) 
          : undefined,
        nutritionalInfo
      };

      // Remove undefined values from the main object
      Object.keys(productData).forEach(key => {
        if (productData[key as keyof typeof productData] === undefined) {
          delete productData[key as keyof typeof productData];
        }
      });

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      await updateProduct(product.id, { isAvailable: !product.isAvailable });
    } catch (error) {
      console.error('Error updating product availability:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = PRODUCT_CATEGORIES.find(c => c.value === category);
    return cat?.label || category;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Gestión de Productos ({products.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          disabled={!selectedMenuId}
        >
          Agregar Producto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!selectedMenuId ? (
        <Alert severity="warning">
          Selecciona un menú para gestionar productos.
        </Alert>
      ) : products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay productos en este menú
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Agrega tu primer producto para comenzar
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Agregar Primer Producto
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {product.name}
                      </Typography>
                      {product.description && (
                        <Typography variant="caption" color="text.secondary">
                          {product.description.length > 60 
                            ? `${product.description.substring(0, 60)}...`
                            : product.description
                          }
                        </Typography>
                      )}
                      {product.preparationTime && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          ⏱️ {product.preparationTime} min
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCategoryLabel(product.category)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      ${product.price.toLocaleString()}
                    </Typography>
                    {product.nutritionalInfo?.calories && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {product.nutritionalInfo.calories} cal
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={product.isAvailable ? 'Disponible' : 'No disponible'}
                        color={product.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => toggleAvailability(product)}
                        color={product.isAvailable ? 'success' : 'error'}
                      >
                        {product.isAvailable ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {product.nutritionalInfo?.isVegan && (
                        <Chip label="Vegano" size="small" color="success" variant="outlined" />
                      )}
                      {product.nutritionalInfo?.isVegetarian && (
                        <Chip label="Vegetariano" size="small" color="info" variant="outlined" />
                      )}
                      {product.tags?.slice(0, 2).map((tag, index) => (
                        <Chip key={`product-${product.id}-tag-${index}`} label={tag} size="small" variant="outlined" />
                      ))}
                      {product.tags && product.tags.length > 2 && (
                        <Chip label={`+${product.tags.length - 2}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpen(product)}
                      size="small"
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(product.id)}
                      size="small"
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
      )}

      {/* Product Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            {/* Información básica */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Información Básica
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                />
                
                <Box display="flex" gap={2}>
                  <TextField
                    label="Precio"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    inputProps={{ step: 0.01, min: 0 }}
                    sx={{ flex: 1 }}
                  />
                  
                  <TextField
                    label="Tiempo de Preparación (min)"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    inputProps={{ min: 0 }}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Categoría y disponibilidad */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Categoría y Disponibilidad
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    label="Categoría"
                  >
                    {PRODUCT_CATEGORIES.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
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
            </Box>

            {/* Tags y alérgenos */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Tags y Alérgenos
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Autocomplete
                  multiple
                  options={COMMON_TAGS}
                  freeSolo
                  value={formData.tags}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, tags: newValue });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip 
                          key={key}
                          variant="outlined" 
                          label={option} 
                          {...tagProps}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Agregar tags..."
                    />
                  )}
                />
                
                <Autocomplete
                  multiple
                  options={['Gluten', 'Lácteos', 'Frutos secos', 'Huevos', 'Soja', 'Mariscos', 'Pescado']}
                  freeSolo
                  value={formData.allergens}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, allergens: newValue });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip 
                          key={key}
                          variant="outlined" 
                          label={option} 
                          color="warning" 
                          {...tagProps}
              />
  );
                    })
}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Alérgenos"
                      placeholder="Agregar alérgenos..."
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Información nutricional */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Información Nutricional
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Calorías"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  inputProps={{ min: 0 }}
                  fullWidth
                />
                
                <Box display="flex" gap={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isVegan}
                        onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                      />
                    }
                    label="Vegano"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isVegetarian}
                        onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                      />
                    }
                    label="Vegetariano"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isGlutenFree}
                        onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                      />
                    }
                    label="Sin Gluten"
                  />
                </Box>
              </Box>
            </Box>

            {/* Imagen */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Imagen
              </Typography>
              <TextField
                fullWidth
                label="URL de Imagen"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || !formData.price || !formData.category}
          >
            {editingProduct ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}