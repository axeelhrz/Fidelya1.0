'use client';

import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
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
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'rgba(44, 44, 46, 0.4)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: 'rgba(44, 44, 46, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      {/* Contenido principal */}
      <Box sx={{ p: { xs: 4, sm: 5 } }}>
        {/* Chips para productos especiales - sutiles pero destacados */}
        {(isRecommended || isNew || isVegetarian) && (
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
      {isRecommended && (
              <MotionBox
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<Star sx={{ fontSize: '14px !important' }} />}
                  label="Recomendado"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    '& .MuiChip-icon': {
                      color: '#10B981'
                    }
                  }}
                />
              </MotionBox>
            )}
            
            {isNew && (
              <MotionBox
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<FiberNew sx={{ fontSize: '14px !important' }} />}
                  label="Nuevo"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#3B82F6',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    borderRadius: 2,
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    '& .MuiChip-icon': {
                      color: '#3B82F6'
                    }
                  }}
                />
              </MotionBox>
            )}
            
            {isVegetarian && (
              <MotionBox
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<Eco sx={{ fontSize: '14px !important' }} />}
                  label="Vegano"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#F59E0B',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    borderRadius: 2,
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    '& .MuiChip-icon': {
                      color: '#F59E0B'
                    }
                  }}
                />
              </MotionBox>
            )}
          </Stack>
          )}

        {/* Layout principal: nombre izquierda, precio derecha */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2.5
          }}>
          {/* Nombre del producto - alineado a la izquierda */}
              <Typography
            variant="h5"
                sx={{
                  fontWeight: 500,
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              color: '#F5F5F7',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              textAlign: 'left',
              flex: 1,
              pr: 3
            }}
          >
            {product.name}
              </Typography>
          
          {/* Precio - destacado en mostaza, alineado a la derecha */}
          <MotionBox
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              variant="priceDisplay"
          sx={{
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.375rem' },
                color: '#F59E0B',
                letterSpacing: '-0.02em',
                textAlign: 'right',
                minWidth: 'fit-content'
              }}
            >
              ${product.price}
            </Typography>
          </MotionBox>
        </Box>

        {/* Descripción - debajo en gris claro */}
        {product.description && (
          <Typography
            variant="body1"
            sx={{
              color: '#A1A1AA',
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              lineHeight: 1.6,
              fontWeight: 400,
              opacity: 0.9,
              textAlign: 'left'
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Divisor horizontal elegante */}
        <Box
          sx={{
            mt: 3,
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
          
          {/* Indicador visual sutil para productos especiales */}
          {isRecommended && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
              }}
            />
          )}
        </Box>
      </Box>
    </MotionBox>
  );
};

export default ProductCard;