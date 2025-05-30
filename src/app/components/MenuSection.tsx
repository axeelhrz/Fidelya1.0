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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut',
        delay: index * 0.1
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2 + (index * 0.1),
      },
    },
  };

  return (
    <MotionBox
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: { xs: 6, sm: 8 } }}
    >
      {/* Section title */}
      <MotionTypography
        variant="h4"
        sx={{
          mb: { xs: 4, sm: 5 },
          fontWeight: 600,
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          color: '#F5F5F7',
          letterSpacing: '-0.02em',
          textAlign: 'left'
        }}
      >
        {title}
      </MotionTypography>

      {/* Products grid */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={{ xs: 3, sm: 4 }}>
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
