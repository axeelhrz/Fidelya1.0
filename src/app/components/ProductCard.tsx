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

  return (
    <MotionBox
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      sx={{
        position: 'relative',
        borderRadius: 2.5,
        background: 'rgba(44, 44, 46, 0.25)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: 'rgba(44, 44, 46, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
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
            height: '1.5px',
            background: 'linear-gradient(90deg, #10B981 0%, rgba(16, 185, 129, 0.4) 100%)',
          }}
        />
      )}

      {/* Contenido principal ultra-compacto */}
      <Box sx={{ p: { xs: 3, sm: 3.5 } }}>
        {/* Header: chips y precio en línea */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2,
          gap: 2
        }}>
          {/* Chips ultra-minimalistas */}
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {isRecommended && (
              <Chip
                icon={<Star sx={{ fontSize: '10px !important' }} />}
                label=""
                size="small"
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  height: 18,
                  minWidth: 18,
                  borderRadius: 1,
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 0,
                    display: 'none'
                  },
                  '& .MuiChip-icon': {
                    margin: 0,
                    color: '#10B981'
                  }
                }}
              />
            )}
            
            {isNew && (
              <Chip
                label="N"
                size="small"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3B82F6',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  height: 18,
                  minWidth: 18,
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
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  height: 18,
                  minWidth: 18,
                  borderRadius: 1,
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 0.5
                  }
            }}
              />
        )}
      </Box>
          
          {/* Precio ultra-compacto */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: '#F59E0B',
              letterSpacing: '-0.01em',
              textAlign: 'right',
              minWidth: 'fit-content',
              lineHeight: 1
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
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            color: '#F5F5F7',
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            textAlign: 'left',
            mb: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </Typography>

        {/* Descripción ultra-compacta */}
        {product.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#A1A1AA',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              lineHeight: 1.4,
              fontWeight: 400,
              textAlign: 'left',
              opacity: 0.85,
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

      {/* Efecto de brillo sutil en hover */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
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