'use client';

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  FiberNew, 
  Eco,
  LocalBar,
  Restaurant
} from '@mui/icons-material';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const MotionBox = motion(Box);

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.04, 0.62, 0.23, 0.98],
        delay: index * 0.06
      } 
    }
  };

  const isRecommended = product.isRecommended;
  const isNew = product.isNew;
  const isVegetarian = product.isVegetarian;

  // Determinar el icono según la categoría
  const getCategoryIcon = () => {
    const category = product.category.toLowerCase();
    if (category.includes('bebida') || category.includes('cocktail') || category.includes('drink')) {
      return <LocalBar sx={{ fontSize: 12, color: 'inherit' }} />;
    }
    return <Restaurant sx={{ fontSize: 12, color: 'inherit' }} />;
  };

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
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.4) 0%, rgba(28, 28, 30, 0.6) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.6) 0%, rgba(28, 28, 30, 0.8) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-3px)'
        }
      }}
    >
      {/* Patrón de fondo sutil */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: `
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.01) 100%)
          `,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Contenido principal */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3.5, sm: 4 } }}>
        {/* Header con etiquetas modernas */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2.5,
          gap: 2
        }}>
          {/* Etiquetas modernas con iconos */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Etiqueta de categoría siempre visible */}
            <Chip
              icon={getCategoryIcon()}
              label={product.category}
              size="small"
              sx={{
                backgroundColor: 'rgba(161, 161, 170, 0.12)',
                color: '#A1A1AA',
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 22,
                borderRadius: 1.5,
                border: 'none',
                '& .MuiChip-label': {
                  px: 1
                },
                '& .MuiChip-icon': {
                  color: '#A1A1AA'
                }
              }}
            />

            {isRecommended && (
              <MotionBox
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<Star sx={{ fontSize: '11px !important' }} />}
                  label="Chef's Choice"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    color: '#10B981',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 22,
                    borderRadius: 1.5,
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                    '& .MuiChip-label': {
                      px: 1
                    },
                    '& .MuiChip-icon': {
                      color: '#10B981'
                    }
                  }}
                />
              </MotionBox>
            )}
            
            {isNew && (
              <MotionBox
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<FiberNew sx={{ fontSize: '11px !important' }} />}
                  label="Nuevo"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    color: '#3B82F6',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 22,
                    borderRadius: 1.5,
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
                    '& .MuiChip-label': {
                      px: 1
                    },
                    '& .MuiChip-icon': {
                      color: '#3B82F6'
                    }
                  }}
                />
              </MotionBox>
            )}
            
            {isVegetarian && (
              <MotionBox
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.05), type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<Eco sx={{ fontSize: '11px !important' }} />}
                  label="Plant-Based"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
                    color: '#F59E0B',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 22,
                    borderRadius: 1.5,
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)',
                    '& .MuiChip-label': {
                      px: 1
                    },
                    '& .MuiChip-icon': {
                      color: '#F59E0B'
                    }
                  }}
                />
              </MotionBox>
            )}
          </Box>
          
          {/* Precio como nube/burbuja de bar */}
          <MotionBox
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + (index * 0.05), duration: 0.5 }}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -1, 1, 0],
              transition: { duration: 0.3 }
            }}
            sx={{
              position: 'relative',
              minWidth: 'fit-content'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                px: 2.5,
                py: 1.5,
                borderRadius: '20px 20px 20px 4px', // Forma de burbuja de diálogo
                background: isRecommended 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
                border: `1.5px solid ${isRecommended ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                backdropFilter: 'blur(16px)',
                boxShadow: isRecommended 
                  ? '0 4px 16px rgba(16, 185, 129, 0.15)' 
                  : '0 4px 16px rgba(245, 158, 11, 0.15)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 'inherit',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                  pointerEvents: 'none'
                },
                '&::after': {
                  content: '"$"',
                  position: 'absolute',
                  top: -8,
                  left: 8,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: isRecommended ? '#10B981' : '#F59E0B',
                  opacity: 0.7
                }
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                  color: isRecommended ? '#10B981' : '#F59E0B',
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                  lineHeight: 1,
                  textShadow: `0 2px 8px ${isRecommended ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {product.price}
              </Typography>
            </Box>
          </MotionBox>
        </Box>

        {/* Nombre del producto */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            color: '#F5F5F7',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            textAlign: 'left',
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </Typography>

        {/* Descripción elegante */}
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
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -12,
                top: 6,
                width: 2,
                height: 2,
                borderRadius: '50%',
                backgroundColor: isRecommended ? '#10B981' : '#3B82F6',
                opacity: 0.6
              }
            }}
          >
            {product.description}
          </Typography>
        )}
      </Box>

      {/* Indicador de borde para productos especiales */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #10B981 0%, rgba(16, 185, 129, 0.5) 50%, #10B981 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' }
            }
          }}
        />
      )}

      {/* Efecto de brillo en hover */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent)',
          transition: 'left 0.6s ease',
          pointerEvents: 'none',
          '.MuiBox-root:hover &': {
            left: '100%'
          }
        }}
      />
    </MotionBox>
  );
};

export default ProductCard;