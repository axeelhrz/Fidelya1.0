'use client';

import { Box, Typography, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface MenuSectionProps {
  title: string;
  products: Product[];
  index?: number;
}

const MotionBox = motion(Box);
export default function MenuSection({ title, products, index = 0 }: MenuSectionProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: 'easeOut',
        delay: index * 0.1 // Animación escalonada para cada sección
      }}
      sx={{ mb: 5 }}
    >
      {/* Título de la sección */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: '#F5F5F7',
            fontSize: '1.5rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            mb: 1.5
          }}
        >
          {title}
        </Typography>

        {/* Divider elegante */}
        <Divider 
          sx={{ 
            borderColor: '#3A3A3C',
            borderWidth: '1px',
            background: 'linear-gradient(90deg, #3A3A3C 0%, rgba(58, 58, 60, 0.3) 50%, transparent 100%)'
          }} 
        />
      </Box>

      {/* Lista de productos usando Stack */}
      <Stack spacing={2.5}>
        {products.map((product, productIndex) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: 'easeOut',
              delay: (index * 0.1) + (productIndex * 0.05) // Animación escalonada para productos
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </Stack>
    </MotionBox>
  );
}