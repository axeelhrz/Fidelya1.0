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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  ArrowBack,
  Add,
  Edit,
  Delete,
  Category,
  Save,
  Close,
  DragIndicator,
  SwapVert,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material';
import { ProductCategory } from '../../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface CategoryManagerProps {
  onBack: () => void;
}

interface CategoryItem {
  id: string;
  name: ProductCategory;
  productCount: number;
  order: number;
}

// Datos de ejemplo con conteo de productos
const mockCategories: CategoryItem[] = [
  { id: '1', name: 'Bebidas' as ProductCategory, productCount: 8, order: 1 },
  { id: '2', name: 'Sin Alcohol' as ProductCategory, productCount: 4, order: 2 },
  { id: '3', name: 'Tapas' as ProductCategory, productCount: 12, order: 3 },
  { id: '4', name: 'Principales' as ProductCategory, productCount: 6, order: 4 },
  { id: '5', name: 'Postres' as ProductCategory, productCount: 5, order: 5 },
  { id: '6', name: 'Café' as ProductCategory, productCount: 3, order: 6 },
];

export default function CategoryManager({ onBack }: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(mockCategories);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [dragMode, setDragMode] = useState(false);

  // Ordenar categorías por orden
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const handleOpenDialog = (category?: CategoryItem) => {
    if (category) {
      setEditingCategory(category);
      setNewCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setNewCategoryName('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      if (editingCategory) {
        // Editar categoría existente
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, name: newCategoryName as ProductCategory }
            : cat
        ));
        setAlert({ type: 'success', message: 'Categoría actualizada correctamente' });
      } else {
        // Crear nueva categoría
        const newCategory: CategoryItem = {
          id: Date.now().toString(),
          name: newCategoryName as ProductCategory,
          productCount: 0,
          order: Math.max(...categories.map(c => c.order), 0) + 1
        };
        setCategories(prev => [...prev, newCategory]);
        setAlert({ type: 'success', message: 'Categoría creada correctamente' });
      }

      handleCloseDialog();
    } catch {
      setAlert({ type: 'error', message: 'Error al guardar la categoría' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category && category.productCount > 0) {
      setAlert({ 
        type: 'error', 
        message: 'No se puede eliminar una categoría que tiene productos asignados' 
      });
      return;
    }

    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setAlert({ type: 'success', message: 'Categoría eliminada correctamente' });
    } catch {
      setAlert({ type: 'error', message: 'Error al eliminar la categoría' });
    } finally {
      setLoading(false);
    }
  };

  // Mover categoría hacia arriba
  const moveUp = (categoryId: string) => {
    const categoryIndex = sortedCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex <= 0) return;

    const newCategories = [...categories];
    const currentCategory = newCategories.find(cat => cat.id === categoryId);
    const previousCategory = newCategories.find(cat => cat.order === sortedCategories[categoryIndex - 1].order);

    if (currentCategory && previousCategory) {
      const tempOrder = currentCategory.order;
      currentCategory.order = previousCategory.order;
      previousCategory.order = tempOrder;
      
      setCategories(newCategories);
      setAlert({ type: 'success', message: 'Orden actualizado correctamente' });
    }
  };

  // Mover categoría hacia abajo
  const moveDown = (categoryId: string) => {
    const categoryIndex = sortedCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex >= sortedCategories.length - 1) return;

    const newCategories = [...categories];
    const currentCategory = newCategories.find(cat => cat.id === categoryId);
    const nextCategory = newCategories.find(cat => cat.order === sortedCategories[categoryIndex + 1].order);

    if (currentCategory && nextCategory) {
      const tempOrder = currentCategory.order;
      currentCategory.order = nextCategory.order;
      nextCategory.order = tempOrder;
      
      setCategories(newCategories);
      setAlert({ type: 'success', message: 'Orden actualizado correctamente' });
    }
  };

  // Manejar reordenamiento con drag and drop
  const handleReorder = (newOrder: CategoryItem[]) => {
    const updatedCategories = newOrder.map((category, index) => ({
      ...category,
      order: index + 1
    }));
    setCategories(updatedCategories);
  };

  // Auto-hide alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, string> = {
      'Bebidas': '🍺',
      'Sin Alcohol': '🥤',
      'Tapas': '🍤',
      'Principales': '🥩',
      'Postres': '🍰',
      'Café': '☕',
      'Promociones': '🎉'
    };
    return icons[categoryName] || '📋';
  };

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

          <Box sx={{ flex: 1 }}>
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 700,
                color: '#F8F8F8',
                letterSpacing: '0.02em'
              }}
            >
              Gestión de Categorías
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                color: '#B8B8B8'
              }}
            >
              Organiza las categorías de tu menú
            </Typography>
          </Box>

          {/* Toggle para modo drag */}
          <Button
            variant={dragMode ? "contained" : "outlined"}
            startIcon={<SwapVert />}
            onClick={() => setDragMode(!dragMode)}
            sx={{
              borderColor: '#D4AF37',
              color: dragMode ? '#0A0A0A' : '#D4AF37',
              background: dragMode ? 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)' : 'transparent',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              borderRadius: 0,
              px: 2,
              py: 1,
              '&:hover': {
                borderColor: '#D4AF37',
                backgroundColor: dragMode ? 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)' : 'rgba(212, 175, 55, 0.1)',
              }
            }}
          >
            {dragMode ? 'Finalizar' : 'Reordenar'}
          </Button>
        </Stack>

        {/* Botones de acción */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              color: '#0A0A0A',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              borderRadius: 0,
              px: 3,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
              }
            }}
          >
            Nueva Categoría
          </Button>

          {dragMode && (
            <Alert 
              severity="info"
              sx={{
                borderRadius: 0,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3B82F6',
                fontFamily: "'Inter', sans-serif",
                py: 0,
                '& .MuiAlert-message': {
                  py: 1
                }
              }}
            >
              Arrastra las categorías para cambiar su orden
            </Alert>
          )}
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

      {/* Lista de categorías */}
      {dragMode ? (
        // Modo drag and drop
        <Reorder.Group 
          axis="y" 
          values={sortedCategories} 
          onReorder={handleReorder}
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          <Stack spacing={2}>
            {sortedCategories.map((category) => (
              <Reorder.Item 
                key={category.id} 
                value={category}
                style={{ listStyle: 'none' }}
                whileDrag={{ 
                  scale: 1.02,
                  boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
                  zIndex: 1000
                }}
              >
                <Card
                  sx={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: 0,
                    cursor: 'grab',
                    '&:active': {
                      cursor: 'grabbing'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      {/* Icono de arrastrar más prominente */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                          backgroundColor: 'rgba(212, 175, 55, 0.2)',
                          border: '1px solid rgba(212, 175, 55, 0.4)'
                        }}
                      >
                        <DragIndicator sx={{ color: '#D4AF37', fontSize: 24 }} />
                      </Box>

                      {/* Icono de categoría */}
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                        }}
                      >
                        {getCategoryIcon(category.name)}
                      </Box>

                      {/* Información de la categoría */}
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          sx={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: '#F8F8F8',
                            mb: 0.5
                          }}
                        >
                          {category.name}
                        </Typography>
                        
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Chip
                            label={`${category.productCount} productos`}
                            size="small"
                            sx={{
                              backgroundColor: category.productCount > 0 
                                ? 'rgba(34, 197, 94, 0.15)' 
                                : 'rgba(156, 163, 175, 0.15)',
                              color: category.productCount > 0 ? '#22C55E' : '#9CA3AF',
                              fontSize: '0.75rem',
                              fontFamily: "'Inter', sans-serif",
                              borderRadius: 0
                            }}
                          />
                          
                          <Chip
                            label={`Orden: ${category.order}`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(212, 175, 55, 0.15)',
                              color: '#D4AF37',
                              fontSize: '0.75rem',
                              fontFamily: "'Inter', sans-serif",
                              borderRadius: 0,
                              fontWeight: 600
                            }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Reorder.Item>
            ))}
          </Stack>
        </Reorder.Group>
      ) : (
        // Modo normal con botones de orden
        <Stack spacing={2}>
          <AnimatePresence>
            {sortedCategories.map((category, index) => (
              <MotionCard
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                sx={{
                  background: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: 0,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    {/* Controles de orden */}
                    <Stack spacing={0.5}>
                      <IconButton
                        onClick={() => moveUp(category.id)}
                        disabled={index === 0}
                        size="small"
                        sx={{
                          color: index === 0 ? '#6B7280' : '#D4AF37',
                          border: `1px solid ${index === 0 ? 'rgba(107, 114, 128, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
                          borderRadius: 0,
                          width: 28,
                          height: 28,
                          '&:hover': {
                            backgroundColor: index === 0 
                              ? 'rgba(107, 114, 128, 0.1)' 
                              : 'rgba(212, 175, 55, 0.1)',
                          },
                          '&:disabled': {
                            color: '#6B7280',
                            borderColor: 'rgba(107, 114, 128, 0.3)',
                          }
                        }}
                      >
                        <KeyboardArrowUp sx={{ fontSize: 16 }} />
                      </IconButton>
                      
                      <IconButton
                        onClick={() => moveDown(category.id)}
                        disabled={index === sortedCategories.length - 1}
                        size="small"
                        sx={{
                          color: index === sortedCategories.length - 1 ? '#6B7280' : '#D4AF37',
                          border: `1px solid ${index === sortedCategories.length - 1 ? 'rgba(107, 114, 128, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
                          borderRadius: 0,
                          width: 28,
                          height: 28,
                          '&:hover': {
                            backgroundColor: index === sortedCategories.length - 1 
                              ? 'rgba(107, 114, 128, 0.1)' 
                              : 'rgba(212, 175, 55, 0.1)',
                          },
                          '&:disabled': {
                            color: '#6B7280',
                            borderColor: 'rgba(107, 114, 128, 0.3)',
                          }
                        }}
                      >
                        <KeyboardArrowDown sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>

                    {/* Icono de categoría */}
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                      }}
                    >
                      {getCategoryIcon(category.name)}
                    </Box>

                    {/* Información de la categoría */}
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        sx={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: '#F8F8F8',
                          mb: 0.5
                        }}
                      >
                        {category.name}
                      </Typography>
                      
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          label={`${category.productCount} productos`}
                          size="small"
                          sx={{
                            backgroundColor: category.productCount > 0 
                              ? 'rgba(34, 197, 94, 0.15)' 
                              : 'rgba(156, 163, 175, 0.15)',
                            color: category.productCount > 0 ? '#22C55E' : '#9CA3AF',
                            fontSize: '0.75rem',
                            fontFamily: "'Inter', sans-serif",
                            borderRadius: 0
                          }}
                        />
                        
                        <Chip
                          label={`Orden: ${category.order}`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            color: '#3B82F6',
                            fontSize: '0.75rem',
                            fontFamily: "'Inter', sans-serif",
                            borderRadius: 0
                          }}
                        />
                      </Stack>
                    </Box>

                    {/* Acciones */}
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleOpenDialog(category)}
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
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.productCount > 0}
                        sx={{
                          color: category.productCount > 0 ? '#6B7280' : '#F87171',
                          border: `1px solid ${category.productCount > 0 ? 'rgba(107, 114, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
                          borderRadius: 0,
                          '&:hover': {
                            backgroundColor: category.productCount > 0 
                              ? 'rgba(107, 114, 128, 0.1)' 
                              : 'rgba(248, 113, 113, 0.1)',
                          },
                          '&:disabled': {
                            color: '#6B7280',
                            borderColor: 'rgba(107, 114, 128, 0.3)',
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

          {categories.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Category sx={{ fontSize: 64, color: '#B8B8B8', mb: 2 }} />
              <Typography 
                sx={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.125rem',
                  color: '#B8B8B8',
                  mb: 1
                }}
              >
                No hay categorías creadas
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  color: '#B8B8B8',
                  opacity: 0.7
                }}
              >
                Crea tu primera categoría para organizar el menú
              </Typography>
            </Box>
          )}
        </Stack>
      )}

      {/* Dialog para crear/editar categoría */}
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
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Nombre de la categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Ej: Bebidas, Tapas, Principales..."
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

          {editingCategory && editingCategory.productCount > 0 && (
            <Alert 
              severity="info"
              sx={{
                mt: 2,
                borderRadius: 0,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3B82F6',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Esta categoría tiene {editingCategory.productCount} productos asignados. 
              Al cambiar el nombre, se actualizará en todos los productos.
            </Alert>
          )}
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
            onClick={handleSaveCategory}
            disabled={loading || !newCategoryName.trim()}
            startIcon={<Save />}
            variant="contained"
            sx={{
              background: loading || !newCategoryName.trim()
                ? 'rgba(212, 175, 55, 0.3)'
                : 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              color: loading || !newCategoryName.trim() ? '#B8B8B8' : '#0A0A0A',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              '&:hover': {
                background: loading || !newCategoryName.trim()
                  ? 'rgba(212, 175, 55, 0.3)'
                  : 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
              },
              '&:disabled': {
                background: 'rgba(212, 175, 55, 0.3)',
                color: '#B8B8B8'
              }
            }}
          >
            {loading ? 'Guardando...' : editingCategory ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
}