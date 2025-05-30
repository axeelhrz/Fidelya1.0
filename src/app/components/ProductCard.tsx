'use client';

import React from 'react';
import { Box, Typography, Chip, Stack, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  FiberNew, 
  Eco, 
  LocalFireDepartment,
  Restaurant 
} from '@mui/icons-material';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut',
        delay: index * 0.08
      } 
    }
  };

  const isRecommended = product.isRecommended;
  const isNew = product.isNew;
  const isVegetarian = product.isVegetarian;

  return (
    <MotionPaper
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -4,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        background: isRecommended 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(44, 44, 46, 0.6) 100%)'
          : 'rgba(44, 44, 46, 0.4)',
        backdropFilter: 'blur(24px)',
        border: isRecommended 
          ? '1px solid rgba(16, 185, 129, 0.2)' 
          : '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: isRecommended 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(44, 44, 46, 0.8) 100%)'
            : 'rgba(44, 44, 46, 0.7)',
          borderColor: isRecommended 
            ? 'rgba(16, 185, 129, 0.3)' 
            : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isRecommended 
            ? '0 12px 40px rgba(16, 185, 129, 0.15)' 
            : '0 8px 32px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      {/* Recommended glow effect */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      {/* Content container */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 4, sm: 5 } }}>
        {/* Header with tags */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {isRecommended && (
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<Star sx={{ fontSize: '16px !important' }} />}
                  label="Recomendado"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#10B981',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 28,
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    '& .MuiChip-icon': {
                      color: '#10B981'
                    },
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }}
                />
              </MotionBox>
            )}
            
            {isNew && (
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<FiberNew sx={{ fontSize: '16px !important' }} />}
                  label="Nuevo"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#3B82F6',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 28,
                    borderRadius: 2,
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    '& .MuiChip-icon': {
                      color: '#3B82F6'
                    },
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                  }}
                />
              </MotionBox>
            )}
            
            {isVegetarian && (
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<Eco sx={{ fontSize: '16px !important' }} />}
                  label="Vegetariano"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#F59E0B',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 28,
                    borderRadius: 2,
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    '& .MuiChip-icon': {
                      color: '#F59E0B'
                    },
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                  }}
                />
              </MotionBox>
            )}
          </Stack>

          {/* Special icon for recommended items */}
          {isRecommended && (
            <MotionBox
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.6 + (index * 0.05), duration: 0.6 }}
            >
              <LocalFireDepartment 
                sx={{ 
                  color: '#10B981', 
                  fontSize: 24,
                  filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
                }} 
              />
            </MotionBox>
          )}
        </Stack>

        {/* Product info */}
        <Stack spacing={2.5}>
          <Box>
            <Typography
              variant="h5"
              sx={{


                fontWeight: isRecommended ? 700 : 600,
                fontSize: { xs: '1.25rem', sm: '1.375rem' },
                color: isRecommended ? '#F5F5F7' : '#F5F5F7',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                mb: 1.5,
                textShadow: isRecommended ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none'
              }}
            >
              {product.name}
            </Typography>
            
            {product.description && (
              <Typography
                variant="body1"
                sx={{
                  color: '#A1A1AA',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.6,
                  fontWeight: 400,
                  opacity: 0.9
                }}
              >
                {product.description}
              </Typography>
            )}
          </Box>

          {/* Price section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 2,
            borderTop: `1px solid ${isRecommended ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Restaurant 
                sx={{ 
                  color: isRecommended ? '#10B981' : '#3B82F6', 
                  fontSize: 20,
                  opacity: 0.8
                }} 
              />
              <Typography
                variant="caption"
                sx={{
                  color: '#A1A1AA',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Precio
              </Typography>
            </Box>

            <MotionBox
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  color: isRecommended ? '#10B981' : '#3B82F6',
                  letterSpacing: '-0.02em',
                  textAlign: 'right',
                  textShadow: isRecommended 
                    ? '0 2px 12px rgba(16, 185, 129, 0.3)' 
                    : '0 2px 12px rgba(59, 130, 246, 0.3)',
                  position: 'relative',
                  '&::before': isRecommended ? {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '120%',
                    height: '120%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: -1
                  } : {}
                }}
              >
                ${product.price}
              </Typography>
            </MotionBox>
          </Box>
        </Stack>
      </Box>

      {/* Recommended item special border effect */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #10B981 0%, #34d399 50%, #10B981 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' }
            }
          }}
        />
      )}
    </MotionPaper>
  );
};

export default ProductCard;