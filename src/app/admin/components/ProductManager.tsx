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
  Chip
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useFirebaseMenu } from '../../../hooks/useFirebaseMenu';
import { Product, Menu, ProductCategory } from '../../types';
interface ProductManagerProps {
  products: Product[];
  menus: Menu[];
}

export default function ProductManager({ products, menus }: ProductManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    menuId: '',
    image: '',
    isAvailable: true
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
        category: product.category,
        menuId: product.menuId || '',
        image: (product as Product & { image?: string }).image || '',
        isAvailable: product.isAvailable ?? true
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        menuId: menus[0]?.id || '',
        image: '',
        isAvailable: true
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
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category as ProductCategory,
        menuId: formData.menuId,
        image: formData.image,
        isAvailable: formData.isAvailable
      };

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

  const getMenuName = (menuId: string) => {
    const menu = menus.find(m => m.id === menuId);
    return menu?.name || 'Menú no encontrado';
  };

  const getAvailableCategories = () => {
    return ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'SIDE_DISH'];
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
          disabled={menus.length === 0}
          >
          Agregar Producto
          </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {menus.length === 0 ? (
        <Alert severity="warning">
          Necesitas crear al menos un menú antes de agregar productos.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Menú</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {product.name}
                      </Typography>
                      {product.description && (
                        <Typography variant="caption" color="text.secondary">
                          {product.description.substring(0, 50)}...
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{getMenuName(product.menuId || '')}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.isAvailable ? 'Disponible' : 'No disponible'}
                      color={product.isAvailable ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpen(product)}
                      size="small"
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
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
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
            
            <TextField
              fullWidth
              label="Precio"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              inputProps={{ step: 0.01, min: 0 }}
            />
            
            <FormControl fullWidth required>
              <InputLabel>Menú</InputLabel>
              <Select
                value={formData.menuId}
                onChange={(e) => setFormData({ ...formData, menuId: e.target.value, category: '' })}
                label="Menú"
              >
                {menus.map((menu) => (
                  <MenuItem key={menu.id} value={menu.id}>
                    {menu.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth required disabled={!formData.menuId}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Categoría"
              >
                {getAvailableCategories().map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="URL de Imagen"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.isAvailable ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                label="Estado"
              >
                <MenuItem value="true">Disponible</MenuItem>
                <MenuItem value="false">No disponible</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || !formData.price || !formData.menuId || !formData.category}
          >
            {editingProduct ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}