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
        y: -3,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'rgba(44, 44, 46, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(44, 44, 46, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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

      {/* Contenido principal */}
      <Box sx={{ p: { xs: 5, sm: 6 } }}>
        {/* Chips minimalistas */}
        {(isRecommended || isNew || isVegetarian) && (
          <Box sx={{ mb: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {isRecommended && (
              <Chip
                icon={<Star sx={{ fontSize: '12px !important' }} />}
                  label="Recomendado"
                  size="small"
                  sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#10B981',
                  fontWeight: 600,
                    fontSize: '0.7rem',
                  height: 24,
                  borderRadius: 1.5,
                  border: 'none',
                    '& .MuiChip-icon': {
                    color: '#10B981'
                    }
                  }}
                />
            )}
            
            {isNew && (
              <Chip
                icon={<FiberNew sx={{ fontSize: '12px !important' }} />}
                  label="Nuevo"
                  size="small"
                  sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    color: '#3B82F6',
                  fontWeight: 600,
                    fontSize: '0.7rem',
                  height: 24,
                  borderRadius: 1.5,
                  border: 'none',
                    '& .MuiChip-icon': {
                    color: '#3B82F6'
                    }
                  }}
                />
            )}
            
            {isVegetarian && (
              <Chip
                icon={<Eco sx={{ fontSize: '12px !important' }} />}
                  label="Vegano"
                  size="small"
                  sx={{
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    color: '#F59E0B',
                  fontWeight: 600,
                    fontSize: '0.7rem',
                  height: 24,
                  borderRadius: 1.5,
                  border: 'none',
                    '& .MuiChip-icon': {
                    color: '#F59E0B'
                    }
                  }}
                />
            )}
          </Box>
        )}

        {/* Layout principal: nombre y precio en línea */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline',
          mb: 2.5,
          gap: 3
        }}>
          {/* Nombre del producto */}
          <Typography
              variant="h5"
              sx={{
              fontWeight: 500,
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
                color: '#F5F5F7',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
                textAlign: 'left',
              flex: 1
              }}
            >
              {product.name}
            </Typography>
          {/* Precio elegante */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.375rem' },
              color: '#F59E0B',
                letterSpacing: '-0.02em',
              textAlign: 'right',
              minWidth: 'fit-content',
                position: 'relative',
              '&::before': {
                content: '"$"',
                fontSize: '0.9em',
                opacity: 0.8,
                marginRight: '2px'
              }
              }}
            >
            {product.price}
            </Typography>
        </Box>

        {/* Descripción elegante */}
        {product.description && (
          <Typography
              variant="body1"
              sx={{
                color: '#A1A1AA',
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              lineHeight: 1.6,
                fontWeight: 400,
                textAlign: 'left',
              mb: 3,
              opacity: 0.9
              }}
            >
              {product.description}
            </Typography>
        )}

        {/* Footer minimalista */}
        <Box
          sx={{
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
            <Typography
              variant="caption"
              sx={{
                color: '#A1A1AA',
                fontSize: '0.75rem',
              fontWeight: 500,
                textTransform: 'uppercase',
              letterSpacing: '0.05em',
              opacity: 0.7
              }}
            >
              {product.category}
            </Typography>
            
          {/* Indicador visual sutil */}
            {isRecommended && (
            <Box
              sx={{
                width: 6,
                height: 6,
                  borderRadius: '50%',
                backgroundColor: '#10B981',
                opacity: 0.8
              }}
            />
          )}
        </Box>
      </Box>
    </MotionBox>
  );
};

export default ProductCard;