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
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowBack,
  Add,
  Edit,
  Delete,
  Category,
  Save,
  Close,
  DragIndicator
} from '@mui/icons-material';
import { ProductCategory } from '../../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface CategoryManagerProps {
  onBack: () => void;
}

// Datos de ejemplo con conteo de productos
const mockCategories = [
  { name: 'Bebidas' as ProductCategory, productCount: 8, order: 1 },
  { name: 'Sin Alcohol' as ProductCategory, productCount: 4, order: 2 },
  { name: 'Tapas' as ProductCategory, productCount: 12, order: 3 },
  { name: 'Principales' as ProductCategory, productCount: 6, order: 4 },
  { name: 'Postres' as ProductCategory, productCount: 5, order: 5 },
  { name: 'Café' as ProductCategory, productCount: 3, order: 6 },
];

export default function CategoryManager({ onBack }: CategoryManagerProps) {
  const [categories, setCategories] = useState(mockCategories);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ name: ProductCategory; productCount: number; order: number } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleOpenDialog = (category?: { name: ProductCategory; productCount: number; order: number }) => {
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
          cat.name === editingCategory.name 
            ? { ...cat, name: newCategoryName as ProductCategory }
            : cat
        ));
        setAlert({ type: 'success', message: 'Categoría actualizada correctamente' });
      } else {
        // Crear nueva categoría
        const newCategory = {
          name: newCategoryName as ProductCategory,
          productCount: 0,
          order: categories.length + 1
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

  const handleDeleteCategory = async (categoryName: ProductCategory) => {
    const category = categories.find(cat => cat.name === categoryName);
    
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
      setCategories(prev => prev.filter(cat => cat.name !== categoryName));
      setAlert({ type: 'success', message: 'Categoría eliminada correctamente' });
    } catch {
      setAlert({ type: 'error', message: 'Error al eliminar la categoría' });
    } finally {
      setLoading(false);
    }
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
        </Stack>

        {/* Botón para agregar categoría */}
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
      <Stack spacing={2}>
        <AnimatePresence>
          {categories.map((category, index) => (
            <MotionCard
              key={category.name}
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
                  {/* Icono de arrastrar */}
                  <DragIndicator sx={{ color: '#B8B8B8', cursor: 'grab' }} />

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
                      onClick={() => handleDeleteCategory(category.name)}
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