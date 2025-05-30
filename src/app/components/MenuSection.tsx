'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface MenuSectionProps {
  title: string;
  products: Product[];
  index?: number;
}

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const MenuSection: React.FC<MenuSectionProps> = ({ title, products, index = 0 }) => {
  if (!products || products.length === 0) return null;

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.04, 0.62, 0.23, 0.98],
        delay: index * 0.15
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3 + (index * 0.15),
      },
    },
  };

  const recommendedCount = products.filter(p => p.isRecommended).length;
  return (
    <MotionBox
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: { xs: 10, sm: 12 } }}
    >
      {/* Título de categoría destacado */}
      <Box sx={{ mb: { xs: 6, sm: 8 } }}>
            <MotionTypography
          variant="categoryTitle"
              sx={{
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                color: '#F5F5F7',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            mb: 3,
            position: 'relative',
            display: 'inline-block'
          }} 
        >
          {title}
          
          {/* Indicador de productos recomendados */}
          {recommendedCount > 0 && (
            <Box
              component="span"
              sx={{
                ml: 2,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#10B981'
              }}
            >
              {recommendedCount} ★
            </Box>
          )}
        </MotionTypography>

        {/* Divisor horizontal elegante */}
        <Box
          sx={{
            position: 'relative',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, #3B82F6 0%, rgba(59, 130, 246, 0.3) 100%)'
            }
          }}
            />
      </Box>

      {/* Lista de productos */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={{ xs: 5, sm: 6 }}>
          {products.map((product, productIndex) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={productIndex}
            />
          ))}
        </Stack>
    </MotionBox>
    </MotionBox>
  );
};

export default MenuSection;
