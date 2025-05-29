import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  expiryDate?: string;
  categoryId: string;
  supplierId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
  suppliers: Supplier[];
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  product,
  categories,
  suppliers,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode: '',
    unit: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    minStock: '',
    expiryDate: null as Date | null,
    categoryId: '',
    supplierId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        barcode: product.barcode || '',
        unit: product.unit,
        costPrice: product.costPrice.toString(),
        salePrice: product.salePrice.toString(),
        stock: product.stock.toString(),
        minStock: product.minStock.toString(),
        expiryDate: product.expiryDate ? new Date(product.expiryDate) : null,
        categoryId: product.categoryId,
        supplierId: product.supplierId,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        barcode: '',
        unit: '',
        costPrice: '',
        salePrice: '',
        stock: '',
        minStock: '',
        expiryDate: null,
        categoryId: '',
        supplierId: '',
      });
    }
    setError('');
  }, [product, open]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        costPrice: parseFloat(formData.costPrice),
        salePrice: parseFloat(formData.salePrice),
        stock: parseFloat(formData.stock),
        minStock: parseFloat(formData.minStock),
        expiryDate: formData.expiryDate?.toISOString(),
      };

      if (product) {
        await axios.put(`/products/${product.id}`, submitData);
      } else {
        await axios.post('/products', submitData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Código de Barras"
                  value={formData.barcode}
                  onChange={(e) => handleChange('barcode', e.target.value)}
                />
              </Stack>

              <TextField
                fullWidth
                label="Descripción"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={2}
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.categoryId}
                    onChange={(e) => handleChange('categoryId', e.target.value)}
                    label="Categoría"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel>Proveedor</InputLabel>
                  <Select
                    value={formData.supplierId}
                    onChange={(e) => handleChange('supplierId', e.target.value)}
                    label="Proveedor"
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Unidad de Medida"
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  required
                  placeholder="kg, unidad, litro, etc."
                />
                <TextField
                  fullWidth
                  label="Stock Actual"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  fullWidth
                  label="Stock Mínimo"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleChange('minStock', e.target.value)}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Precio de Costo"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => handleChange('costPrice', e.target.value)}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
                  }}
                />
                <TextField
                  fullWidth
                  label="Precio de Venta"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => handleChange('salePrice', e.target.value)}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
                  }}
                />
              </Stack>

              <DatePicker
                label="Fecha de Vencimiento (Opcional)"
                value={formData.expiryDate}
                onChange={(date) => handleChange('expiryDate', date)}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ProductForm;