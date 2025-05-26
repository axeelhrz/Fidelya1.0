'use client';

import { Box, Typography, Stack } from '@mui/material';
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

export default function MenuSection({ title, products, index }: MenuSectionProps) {
  if (products.length === 0) return null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      sx={{ mb: 6 }}
    >
      <MotionTypography
        variant="h4"
        sx={{
          mb: 3,
          pb: 1,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          fontWeight: 600,
          display: 'inline-block',
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      >
        {title}
      </MotionTypography>

      <Stack spacing={2}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </Stack>
    </MotionBox>
  );
}