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

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        duration: 0.6, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    }
  };

  // Determinar productos recomendados (simulado - en una app real esto vendría de la base de datos)
  // Aquí simplemente marcamos el primer producto de cada categoría como recomendado
  const recommendedProductIds = products.length > 0 ? [products[0].id] : [];

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: 8 }}
    >
      <MotionBox
        variants={itemVariants}
        sx={{ mb: 4 }}
      >
        <MotionTypography
          variant="h4"
          sx={{
            fontWeight: 700,
            display: 'inline-block',
            position: 'relative',
          }}
        >
          {title}
          <Box
            component="span"
            sx={{
              position: 'absolute',
              bottom: -2,
              left: 0,
              width: '40%',
              height: 3,
              backgroundColor: 'secondary.main',
              borderRadius: 4,
            }}
          />
        </MotionTypography>
      </MotionBox>

      <MotionDivider 
        variants={itemVariants}
        sx={{ 
          mb: 4,
          opacity: 0.1,
        }} 
      />

      <Stack spacing={3}>
        {products.map((product, productIndex) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            custom={productIndex}
          >
            <ProductCard
              product={product}
              isRecommended={recommendedProductIds.includes(product.id)}
            />
          </motion.div>
        ))}
      </Stack>
    </MotionBox>
  );
}