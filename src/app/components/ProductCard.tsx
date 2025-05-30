'use client';

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  FiberNew, 
  Eco
} from '@mui/icons-material';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const MotionBox = motion(Box);

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.04, 0.62, 0.23, 0.98],
        delay: index * 0.08
      } 
    }
  };

  const isRecommended = product.isRecommended;
  const isNew = product.isNew;
  const isVegetarian = product.isVegetarian;

  return (
    <MotionBox
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -2,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      sx={{
        position: 'relative',
        borderRadius: 2,
        background: 'rgba(44, 44, 46, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(44, 44, 46, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      {/* Indicador sutil para productos recomendados */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #10B981 0%, rgba(16, 185, 129, 0.3) 100%)',
          }}
        />
      )}

      {/* Contenido principal compacto */}
      <Box sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Header con chips y precio */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2,
          gap: 2
        }}>
          {/* Chips minimalistas */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {isRecommended && (
              <Chip
                icon={<Star sx={{ fontSize: '10px !important' }} />}
                label="★"
                size="small"
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  height: 20,
                  minWidth: 20,
                  borderRadius: 1,
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 0.5
                  }
                }}
              />
            )}
            
            {isNew && (
              <Chip
                label="N"
                size="small"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#3B82F6',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  height: 20,
                  minWidth: 20,
                  borderRadius: 1,
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 0.5
                  }
                }}
              />
            )}
            
            {isVegetarian && (
              <Chip
                label="V"
                size="small"
                sx={{
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: '#F59E0B',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  height: 20,
                  minWidth: 20,
                  borderRadius: 1,
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 0.5
                  }
                }}
              />
            )}
          </Box>
          
          {/* Precio compacto */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              color: '#F59E0B',
              letterSpacing: '-0.02em',
              textAlign: 'right',
              minWidth: 'fit-content'
            }}
          >
            ${product.price}
          </Typography>
        </Box>

        {/* Nombre del producto */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            color: '#F5F5F7',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            textAlign: 'left',
            mb: 1.5
          }}
        >
          {product.name}
        </Typography>

        {/* Descripción compacta */}
        {product.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#A1A1AA',
              fontSize: { xs: '0.8rem', sm: '0.85rem' },
              lineHeight: 1.5,
              fontWeight: 400,
              textAlign: 'left',
              opacity: 0.9,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description}
          </Typography>
        )}
      </Box>
    </MotionBox>
  );
};

export default ProductCard;