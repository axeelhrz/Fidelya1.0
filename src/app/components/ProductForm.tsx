'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Product, ProductCategory } from '../types';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'> & { id?: string }) => void;
  editingProduct: Product | null;
  onCancelEdit: () => void;
}

export default function ProductForm({ onSubmit, editingProduct, onCancelEdit }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Entrada');
  const [error, setError] = useState('');

  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setDescription(editingProduct.description);
      setCategory(editingProduct.category);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setCategory('Entrada');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!name.trim() || !description.trim() || !price.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('El precio debe ser un número positivo');
      return;
    }

    const productData = {
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: name.trim(),
      price: priceValue,
      description: description.trim(),
      category,
    };

    onSubmit(productData);
    if (!editingProduct) {
      resetForm();
    }
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      elevation={0}
      sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elemento decorativo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, rgba(59, 130, 246, 0) 70%)',
          borderRadius: '0 0 0 100%',
          zIndex: 0,
        }}
      />

      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <RestaurantIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 4 }} />
      </MotionBox>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: 'error.main',
              }
            }}
          >
            {error}
          </Alert>
        </motion.div>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={3}>
          <TextField
            label="Nombre del Producto"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />

          <TextField
            label="Precio"
            fullWidth
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />

          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-label">Categoría</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Categoría"
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              sx={{ borderRadius: 2 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            sx={{ mt: 2 }}
          >
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              style={{ width: '100%' }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={editingProduct ? <SaveIcon /> : <AddIcon />}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.15)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  },
                }}
              >
                {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
              </Button>
            </motion.div>

            {editingProduct && (
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                style={{ width: '100%' }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<CancelIcon />}
                  onClick={onCancelEdit}
                  sx={{ 
                    py: 1.5,
                    borderWidth: '1.5px',
                  }}
                >
                  Cancelar
                </Button>
              </motion.div>
            )}
          </Stack>
        </Stack>
      </Box>
    </MotionPaper>
  );
}