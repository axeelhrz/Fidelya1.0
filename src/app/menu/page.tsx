'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { initialProducts } from '../data/initialProducts';
import { Product, ProductCategory } from '../types';
import MenuSection from '../components/MenuSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);

export default function MenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    // Simulamos la carga de productos
    setProducts(initialProducts);
  }, []);

  // Agrupamos los productos por categoría
  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category === category)
  }));

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3, md: 4 }, pb: 8 }}>
      <MotionPaper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
          }}
        />
            
        <MotionTypography
          variant="h3"
          align="center"
          fontWeight="bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Nuestro Menú
        </MotionTypography>
      </MotionPaper>

      <Stack spacing={1} direction="row" sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/')}
            sx={{ mb: 2 }}
          >
            Volver al Inicio
          </Button>
        </motion.div>
      </Stack>

      {productsByCategory.map((group, index) => (
        <MenuSection
          key={group.category}
          title={group.category}
          products={group.products}
          index={index}
        />
      ))}
    </Box>
  );
}