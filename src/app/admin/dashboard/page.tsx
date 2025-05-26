'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Stack, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { initialProducts } from '../../data/initialProducts';
import { Product, ProductCategory } from '../../types';
import ProductCard from '../../components/ProductCard';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Entrada');

  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    // Simulamos la carga de productos
    setProducts(initialProducts);
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setCategory('Entrada');
    setEditingProduct(null);
    setFormError('');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.category);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!name.trim() || !description.trim() || !price.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError('El precio debe ser un número positivo');
      return;
    }

    if (editingProduct) {
      // Actualizar producto existente
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name, price: priceValue, description, category } 
          : p
      ));
    } else {
      // Agregar nuevo producto
      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        price: priceValue,
        description,
        category
      };
      setProducts([...products, newProduct]);
    }
    
    resetForm();
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gestión de Menú
        </Typography>
        <Button variant="outlined" onClick={() => router.push('/')}>
          Volver al Inicio
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </Typography>
        
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre del Producto"
              fullWidth
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            
            <TextField
              label="Precio"
              fullWidth
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={category}
                label="Categoría"
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Stack direction="row" spacing={2}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
              >
                {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
              </Button>
              
              {editingProduct && (
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  fullWidth
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        Productos Actuales
      </Typography>
      
      {products.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No hay productos disponibles. Agrega algunos usando el formulario.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isAdmin={true}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}