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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useFirebaseMenu } from '../../../hooks/useFirebaseMenu';
import { Menu } from '../../types';

interface MenuWithCategories extends Menu {
  categories: string[];
}

interface CategoryManagerProps {
  menus: MenuWithCategories[];
}

export default function CategoryManager({ menus }: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const {
    updateMenu,
    error
  } = useFirebaseMenu();

  const selectedMenu = menus.find(menu => menu.id === selectedMenuId) as MenuWithCategories | undefined;

  const handleOpen = (category?: string) => {
    if (category) {
      setEditingCategory(category);
      setNewCategory(category);
    } else {
      setEditingCategory(null);
      setNewCategory('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setNewCategory('');
  };

  const handleSubmit = async () => {
    if (!selectedMenu || !newCategory.trim()) return;

    try {
      const updatedCategories = [...selectedMenu.categories];
      if (editingCategory) {
        // Update existing category
        const index = updatedCategories.indexOf(editingCategory);
        if (index !== -1) {
          updatedCategories[index] = newCategory.trim();
        }
      } else {
        // Add new category
        if (!updatedCategories.includes(newCategory.trim())) {
          updatedCategories.push(newCategory.trim());
        }
      }

      await updateMenu(selectedMenu.id, {
        categories: updatedCategories
      });

      handleClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (category: string) => {
    if (!selectedMenu) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${category}"?`)) {
      try {
        const updatedCategories = selectedMenu.categories.filter(cat => cat !== category);
        await updateMenu(selectedMenu.id, {
          categories: updatedCategories
        });
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
              Gestión de Categorías
            </Typography>
          </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
            </Alert>
          )}

      {menus.length === 0 ? (
        <Alert severity="warning">
          Necesitas crear al menos un menú antes de gestionar categorías.
        </Alert>
      ) : (
        <>
          <Box mb={3}>
            <FormControl fullWidth>
              <InputLabel>Seleccionar Menú</InputLabel>
              <Select
                value={selectedMenuId}
                onChange={(e) => setSelectedMenuId(e.target.value)}
                label="Seleccionar Menú"
              >
                {menus.map((menu) => (
                  <MenuItem key={menu.id} value={menu.id}>
                    {menu.name}
                  </MenuItem>
            ))}
              </Select>
            </FormControl>
            </Box>

          {selectedMenu && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                  Categorías de &quot;{selectedMenu.name}&quot; ({selectedMenu.categories.length})
                </Typography>
          <Button
            variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpen()}
                >
                  Agregar Categoría
          </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre de Categoría</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedMenu.categories.map((category, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {category}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Activa"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpen(category)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(category)}
                            size="small"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedMenu.categories.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No hay categorías definidas para este menú
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}

      {/* Category Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
        </DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <TextField
              fullWidth
              label="Nombre de la Categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!newCategory.trim() || !selectedMenu}
          >
            {editingCategory ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}