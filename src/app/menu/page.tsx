'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import { initialProducts } from '../data/initialProducts';
import { Product, ProductCategory } from '../types';
import ProductCard from '../components/ProductCard';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    // Simulamos la carga de productos
    setProducts(initialProducts);
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" component="h1" align="center" fontWeight="bold">
          Nuestro Menú
        </Typography>
      </Paper>

      {categories.map((category) => {
        const categoryProducts = products.filter(p => p.category === category);
        
        if (categoryProducts.length === 0) return null;
        
        return (
          <Box key={category} sx={{ mb: 5 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ mb: 2, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}
            >
              {category}
            </Typography>
            
            <Stack spacing={2}>
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}