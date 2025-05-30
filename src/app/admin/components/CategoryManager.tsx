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
  Switch
} from '@mui/material';
import { Edit, Delete, Add, DragIndicator } from '@mui/icons-material';
import { useFirebaseCategories } from '../../../hooks/useFirebaseCategories';
import { Category, Menu } from '../../types';

interface CategoryManagerProps {
  menus: Menu[];
  selectedMenuId: string;
  categories: Category[];
}

export default function CategoryManager({ menus, selectedMenuId, categories }: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    menuId: selectedMenuId,
    order: 0,
    isActive: true,
    icon: ''
  });

  const {
    createCategory,
    updateCategory,
    deleteCategory,
    error
  } = useFirebaseCategories(selectedMenuId);

  const handleOpen = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        menuId: category.menuId,
        order: category.order,
        isActive: category.isActive,
        icon: category.icon || ''
      });
    } else {
      setEditingCategory(null);
      const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 1;
      setFormData({
        name: '',
        description: '',
        menuId: selectedMenuId,
        order: nextOrder,
        isActive: true,
        icon: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        menuId: formData.menuId,
        order: formData.order,
        isActive: formData.isActive,
        icon: formData.icon
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }

      handleClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const toggleActive = async (category: Category) => {
    try {
      await updateCategory(category.id, { isActive: !category.isActive });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const getMenuName = (menuId: string) => {
    const menu = menus.find(m => m.id === menuId);
    return menu?.name || 'Menú no encontrado';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Gestión de Categorías ({categories.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          disabled={!selectedMenuId}
        >
          Agregar Categoría
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!selectedMenuId ? (
        <Alert severity="warning">
          Selecciona un menú para gestionar categorías.
        </Alert>
      ) : categories.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay categorías en este menú
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Las categorías ayudan a organizar tus productos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Agregar Primera Categoría
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="50">Orden</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Menú</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DragIndicator color="disabled" />
                      <Typography variant="body2">
                        {category.order}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      {category.icon && (
                        <Typography variant="h6">
                          {category.icon}
                        </Typography>
                      )}
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {category.name}
                        </Typography>
                        {category.description && (
                          <Typography variant="caption" color="text.secondary">
                            {category.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getMenuName(category.menuId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={category.isActive ? 'Activa' : 'Inactiva'}
                        color={category.isActive ? 'success' : 'default'}
                        size="small"
                        onClick={() => toggleActive(category)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpen(category)}
                      size="small"
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(category.id)}
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

      {/* Category Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            <TextField
              fullWidth
              label="Nombre de la Categoría"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ej: Entradas, Platos Principales, Bebidas"
            />
            
            <TextField
              fullWidth
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
              placeholder="Descripción opcional de la categoría"
            />
            
            <Box display="flex" gap={2}>
              <TextField
                label="Icono (Emoji)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🍽️"
                inputProps={{ maxLength: 2 }}
                sx={{ width: 120 }}
              />
              
              <TextField
                label="Orden"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                inputProps={{ min: 0 }}
                sx={{ flex: 1 }}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Categoría activa"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingCategory ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}