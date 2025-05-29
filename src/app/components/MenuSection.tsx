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
        staggerChildren: 0.15,
        delayChildren: index * 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
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
      sx={{ mb: 10 }}
    >
      <MotionBox
        variants={itemVariants}
        sx={{ mb: 6 }}
      >
        <MotionTypography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem' },
            color: '#F5F5F7',
            display: 'inline-block',
            position: 'relative',
            mb: 1,
          }}
        >
          {title}
          <Box
            component="span"
            sx={{
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: '50%',
              height: 4,
              background: 'linear-gradient(90deg, #F59E0B 0%, rgba(245, 158, 11, 0.3) 100%)',
              borderRadius: 4,
            }}
          />
        </MotionTypography>
      </MotionBox>

      <MotionDivider 
        variants={itemVariants}
        sx={{ 
          mb: 6,
          borderColor: '#3A3A3C',
          opacity: 0.3,
        }} 
      />

      <Stack spacing={2.5}>
        {products.map((product, productIndex) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            custom={productIndex}
          >
            <ProductCard
              product={product}
            />
          </motion.div>
        ))}
      </Stack>
    </MotionBox>
  );
}