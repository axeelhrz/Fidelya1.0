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
        delay: index * 0.05
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
        y: -1,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      sx={{
        position: 'relative',
        background: 'rgba(44, 44, 46, 0.2)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: 'rgba(44, 44, 46, 0.35)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }
              }}
            >
      {/* Línea lateral para productos destacados */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: 'linear-gradient(180deg, #74ACDF 0%, rgba(116, 172, 223, 0.5) 100%)',
          }}
      />
      )}

      {/* Contenido estilo carta de restaurante */}
      <Box sx={{ p: { xs: 3, sm: 3.5 } }}>
        {/* Header: nombre y precio en línea clásica */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline',
          mb: 1.5,
          gap: 2
        }}>
          {/* Nombre del plato */}
              <Typography
                sx={{
                  fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.125rem' },
            color: '#F5F5F7',
            letterSpacing: '-0.01em',
              lineHeight: 1.3,
              textAlign: 'left',
              flex: 1
          }}
        >
          {product.name}
        </Typography>

          {/* Línea punteada clásica */}
      <Box
        sx={{
              flex: 1,
              height: '1px',
              backgroundImage: 'radial-gradient(circle, rgba(161, 161, 170, 0.4) 1px, transparent 1px)',
              backgroundSize: '6px 1px',
              backgroundRepeat: 'repeat-x',
              alignSelf: 'center',
              mx: 2
        }}
      />
          
          {/* Precio estilo bar/copa */}
      <Box
        sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {/* Icono de copa/plato según categoría */}
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1,
                backgroundColor: isRecommended ? 'rgba(116, 172, 223, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                border: `1px solid ${isRecommended ? 'rgba(116, 172, 223, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {product.category.toLowerCase().includes('bebida') || product.category.toLowerCase().includes('cocktail') ? (
                <LocalBar sx={{ 
                  fontSize: 14, 
                  color: isRecommended ? '#74ACDF' : '#F59E0B' 
                }} />
              ) : (
                <Restaurant sx={{ 
                  fontSize: 14, 
                  color: isRecommended ? '#74ACDF' : '#F59E0B' 
                }} />
              )}
            </Box>
            
            {/* Precio en formato clásico */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                color: isRecommended ? '#74ACDF' : '#F59E0B',
                letterSpacing: '-0.01em',
                fontFamily: 'monospace'
        }}
            >
              ${product.price}
            </Typography>
          </Box>
        </Box>

        {/* Descripción estilo carta */}
        {product.description && (
          <Typography
            sx={{
              color: '#A1A1AA',
              fontSize: { xs: '0.8rem', sm: '0.85rem' },
              lineHeight: 1.5,
              fontWeight: 400,
              textAlign: 'left',
              opacity: 0.9,
              mb: 2,
              fontStyle: 'italic'
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Etiquetas minimalistas en footer */}
        {(isRecommended || isNew || isVegetarian) && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexWrap: 'wrap',
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.04)'
          }}>
            {isRecommended && (
              <Chip
                icon={<Star sx={{ fontSize: '10px !important' }} />}
                label="Destacado"
                size="small"
                sx={{
                  backgroundColor: 'rgba(116, 172, 223, 0.12)',
                  color: '#74ACDF',
                  fontWeight: 500,
                  fontSize: '0.65rem',
                  height: 20,
                  borderRadius: 1,
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 0.75
                  },
                  '& .MuiChip-icon': {
                    color: '#74ACDF'
                  }
                }}
              />
            )}
            
            {isNew && (
              <Chip
                icon={<FiberNew sx={{ fontSize: '10px !important' }} />}
                label="Nuevo"
                size="small"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#3B82F6',
                  fontWeight: 500,
                  fontSize: '0.65rem',
                  height: 20,
                  borderRadius: 1,
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 0.75
                  },
                  '& .MuiChip-icon': {
                    color: '#3B82F6'
                  }
                }}
              />
            )}
            
            {isVegetarian && (
              <Chip
                icon={<Eco sx={{ fontSize: '10px !important' }} />}
                label="Vegano"
                size="small"
                sx={{
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  color: '#22C55E',
                  fontWeight: 500,
                  fontSize: '0.65rem',
                  height: 20,
                  borderRadius: 1,
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 0.75
                  },
                  '& .MuiChip-icon': {
                    color: '#22C55E'
                  }
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </MotionBox>
  );
};

export default ProductCard;