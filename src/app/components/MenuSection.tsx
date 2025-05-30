'use client';

import { Box, Typography, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface MenuSectionProps {
  title: string;
  products: Product[];
  index: number;
}

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionDivider = motion(Divider);

export default function MenuSection({ title, products, index }: MenuSectionProps) {
  if (products.length === 0) return null;

  // Variantes de animación fadeIn + slideUp
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.04, 0.62, 0.23, 0.98],
        staggerChildren: 0.1,
        delayChildren: index * 0.2,
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    }
  };

  // Determinar productos recomendados (simulado - en una app real esto vendría de la base de datos)
  // Aquí simplemente marcamos el primer producto de cada categoría como recomendado

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: 6 }}
    >
      {/* Título de categoría con Typography h5 */}
      <MotionBox
        variants={itemVariants}
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#F5F5F7',
            letterSpacing: '-0.01em',
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>
      </MotionBox>

      {/* Divider personalizado */}
      <MotionDivider 
        variants={itemVariants}
        sx={{ 
          borderColor: '#3A3A3C',
          my: 3,
          opacity: 0.6,
        }} 
      />

      {/* Lista de productos usando Stack */}
      <Stack spacing={2.5}>
        {products.map((product, productIndex) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            custom={productIndex}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </Stack>
    </MotionBox>
  );
}