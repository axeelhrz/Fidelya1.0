'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Stack,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Product, ProductCategory, AdminFormData } from '../types';
interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null;
  menuId: string;
}

  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

export default function ProductForm({ 
  open, 
  onClose, 
  onSave, 
  product, 
  menuId 
}: ProductFormProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    price: 0,
    description: '',
    category: 'Entrada',
    isRecommended: false,
    isVegan: false,
  });

  const [errors, setErrors] = useState<Partial<AdminFormData>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        isRecommended: product.isRecommended || false,
        isVegan: product.isVegan || false,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
        category: 'Entrada',
        isRecommended: false,
        isVegan: false,
      });
    }
    setErrors({});
  }, [product, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<AdminFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newProduct: Product = {
      id: product?.id || `${menuId}-${Date.now()}`,
      name: formData.name.trim(),
      price: formData.price,
      description: formData.description.trim(),
      category: formData.category,
      isRecommended: formData.isRecommended,
      isVegan: formData.isVegan,
    };

    onSave(newProduct);
    onClose();
  };

  const handleChange = (field: keyof AdminFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: field === 'price' ? Number(value) : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
            fullWidth
      PaperProps={{
                    sx: {
                borderRadius: 3,
          background: 'linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)',
        }
            }}
          >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {product ? 'Editar Producto' : 'Agregar Producto'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
      </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Nombre del Producto"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Precio"
            type="number"
            value={formData.price}
            onChange={handleChange('price')}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.category}
              onChange={handleChange('category')}
              label="Categoría"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Descripción"
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isRecommended}
                  onChange={handleChange('isRecommended')}
                  color="primary"
                />
}
              label="Producto Recomendado"
            />
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isVegan}
                  onChange={handleChange('isVegan')}
                  color="success"
                />
              }
              label="Producto Vegano"
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Cancelar
        </Button>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }
            }}
          >
            {product ? 'Actualizar' : 'Agregar'}
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
}