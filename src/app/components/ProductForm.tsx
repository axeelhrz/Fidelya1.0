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
  FormControlLabel,
  Switch,
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
  const [isRecommended, setIsRecommended] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [error, setError] = useState('');

  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setDescription(editingProduct.description);
      setCategory(editingProduct.category);
      setIsRecommended(editingProduct.isRecommended || false);
      setIsVegan(editingProduct.isVegan || false);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setCategory('Entrada');
    setIsRecommended(false);
    setIsVegan(false);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      isRecommended,
      isVegan,
    };

    onSubmit(productData);
    if (!editingProduct) {
      resetForm();
    }
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
      elevation={0}
      sx={{ 
        p: { xs: 4, sm: 5 }, 
        mb: 6, 
        borderRadius: 4,
        backgroundColor: '#2C2C2E',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.02) 49%, rgba(255,255,255,0.02) 51%, transparent 52%),
            radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
          `,
          backgroundSize: '20px 20px, 300px 300px',
          zIndex: 0,
        }
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        sx={{ position: 'relative', zIndex: 1 }}
        >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box
            sx={{ 
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <RestaurantIcon sx={{ color: '#3B82F6', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#F5F5F7' }}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#A1A1AA', mt: 0.5 }}>
              {editingProduct ? 'Modifica los detalles del producto' : 'Agrega un nuevo elemento al menú'}
            </Typography>
      </Box>
        </Stack>

        <Divider sx={{ mb: 5, borderColor: '#3A3A3C' }} />
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
              mb: 4, 
              borderRadius: 3,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              '& .MuiAlert-icon': {
                color: '#ef4444',
}
            }}
          >
            {error}
          </Alert>
        </motion.div>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4}>
          <TextField
            label="Nombre del Producto"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'rgba(28, 28, 30, 0.6)',
                color: '#F5F5F7',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3B82F6',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#A1A1AA',
                '&.Mui-focused': {
                  color: '#3B82F6',
                }
              }
            }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <TextField
              label="Precio (€)"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="outlined"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(28, 28, 30, 0.6)',
                  color: '#F5F5F7',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3B82F6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#A1A1AA',
                  '&.Mui-focused': {
                    color: '#3B82F6',
                  }
                }
              }}
            />

            <FormControl variant="outlined" sx={{ flex: 1 }}>
              <InputLabel 
                id="category-label"
                sx={{ 
                  color: '#A1A1AA',
                  '&.Mui-focused': {
                    color: '#3B82F6',
                  }
                }}
              >
                Categoría
              </InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Categoría"
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                sx={{ 
                  borderRadius: 3,
                  backgroundColor: 'rgba(28, 28, 30, 0.6)',
                  color: '#F5F5F7',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3B82F6',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#2C2C2E',
                      border: '1px solid rgba(255,255,255,0.1)',
                      '& .MuiMenuItem-root': {
                        color: '#F5F5F7',
                        '&:hover': {
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        }
                      }
                    }
                  }
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'rgba(28, 28, 30, 0.6)',
                color: '#F5F5F7',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3B82F6',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#A1A1AA',
                '&.Mui-focused': {
                  color: '#3B82F6',
                }
              }
            }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#10B981',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#10B981',
                    },
                  }}
                />
              }
              label="Producto Recomendado"
              sx={{ 
                color: '#F5F5F7',
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.95rem',
                }
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isVegan}
                  onChange={(e) => setIsVegan(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#22c55e',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#22c55e',
                    },
                  }}
                />
              }
              label="Producto Vegano"
              sx={{ 
                color: '#F5F5F7',
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.95rem',
                }
              }}
            />
          </Stack>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3}
            sx={{ mt: 4 }}
          >
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              style={{ flex: 1 }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={editingProduct ? <SaveIcon /> : <AddIcon />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                  },
                }}
              >
                {editingProduct ? 'Guardar Cambios' : 'Agregar al Menú'}
              </Button>
            </motion.div>

            {editingProduct && (
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                style={{ flex: 1 }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CancelIcon />}
                  onClick={onCancelEdit}
                  sx={{ 
                    py: 2,
                    fontSize: '1.1rem',
                    borderWidth: '1.5px',
                    borderColor: 'rgba(239, 68, 68, 0.5)',
                    color: '#ef4444',
                    '&:hover': {
                      borderColor: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    }
                  }}
                >
                  Cancelar Edición
                </Button>
              </motion.div>
            )}
          </Stack>
        </Stack>
      </Box>
    </MotionPaper>
  );
}