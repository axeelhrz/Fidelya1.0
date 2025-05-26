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
} from '@mui/material';
import { motion } from 'framer-motion';
import { Product, ProductCategory } from '../types';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const MotionPaper = motion(Paper);

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
      elevation={3}
      sx={{ p: 3, mb: 4, borderRadius: 3 }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
      </Typography>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        </motion.div>
      )}

      <Box component="form" onSubmit={handleSubmit}>
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

          <Stack direction="row" spacing={2}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%' }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={editingProduct ? <SaveIcon /> : <AddIcon />}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                }}
              >
                {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
              </Button>
            </motion.div>

            {editingProduct && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<CancelIcon />}
                  onClick={onCancelEdit}
                  sx={{ py: 1.5 }}
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