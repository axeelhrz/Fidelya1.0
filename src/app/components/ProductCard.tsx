'use client';

import React from 'react';
import { Box, Typography, Chip, Stack, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Product } from '../types';
interface ProductCardProps {
  product: Product;
  index?: number;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: 'easeOut',
        delay: index * 0.05
      } 
    }
  };

  return (
    <MotionPaper
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        backgroundColor: 'rgba(44, 44, 46, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(44, 44, 46, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }
      }}
    >
      <Stack spacing={2}>
        {/* Product header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          gap: 2
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                color: '#F5F5F7',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                mb: 0.5
              }}
            >
              {product.name}
            </Typography>
            
            {product.description && (
              <Typography
                variant="body2"
                sx={{
                  color: '#A1A1AA',
                  fontSize: { xs: '0.875rem', sm: '0.9rem' },
                  lineHeight: 1.5,
                  fontWeight: 400
                }}
              >
                {product.description}
              </Typography>
            )}
          </Box>

          {/* Price */}
          <MotionBox
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.375rem' },
                color: '#3B82F6',
                letterSpacing: '-0.01em',
                textAlign: 'right',
                minWidth: 'fit-content'
              }}
            >
              ${product.price}
            </Typography>
          </MotionBox>
        </Box>

        {/* Tags and additional info */}
        {(product.isRecommended || product.isNew || product.isVegetarian) && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {product.isRecommended && (
              <Chip
                label="Recomendado"
                size="small"
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                  borderRadius: 1.5,
                  border: 'none'
                }}
              />
            )}
            {product.isNew && (
              <Chip
                label="Nuevo"
                size="small"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3B82F6',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                  borderRadius: 1.5,
                  border: 'none'
                }}
              />
            )}
            {product.isVegetarian && (
              <Chip
                label="Vegetariano"
                size="small"
                sx={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#F59E0B',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                  borderRadius: 1.5,
                  border: 'none'
                }}
              />
            )}
          </Stack>
        )}
      </Stack>
    </MotionPaper>
  );
};

export default ProductCard;
