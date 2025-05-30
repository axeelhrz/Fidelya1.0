'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
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
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(16, 16, 16, 0.98) 100%)',
        border: isRecommended 
          ? '1px solid rgba(212, 175, 55, 0.4)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 1) 0%, rgba(16, 16, 16, 1) 100%)',
          borderColor: isRecommended 
            ? 'rgba(212, 175, 55, 0.6)' 
            : 'rgba(255, 255, 255, 0.15)',
          boxShadow: isRecommended 
            ? '0 8px 32px rgba(212, 175, 55, 0.15)' 
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
              }}
            >
      {/* Borde dorado sutil para productos destacados */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            zIndex: 2
          }}
      />
              )}

      {/* Contenido principal */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 4, sm: 5 } }}>
        {/* Etiquetas elegantes */}
        {(isRecommended || isNew || isVegetarian) && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5, 
            mb: 3,
            flexWrap: 'wrap'
          }}>
            {isRecommended && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 2,
                  py: 0.75,
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                }}
              >
                <Star sx={{ fontSize: 12, color: '#D4AF37' }} />
                <Typography
                  sx={{
                    color: '#D4AF37',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  Recomendado
                </Typography>
              </Box>
            )}
            
            {isNew && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 2,
                  py: 0.75,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 0,
                }}
              >
                <FiberNew sx={{ fontSize: 12, color: '#F8F8F8' }} />
                <Typography
                  sx={{
                    color: '#F8F8F8',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  Nuevo
                </Typography>
      </Box>
            )}
            
            {isVegetarian && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 2,
                  py: 0.75,
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: 0,
                }}
              >
                <Eco sx={{ fontSize: 12, color: '#22C55E' }} />
                <Typography
                  sx={{
                    color: '#22C55E',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  Vegano
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Layout estilo menú clásico */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2.5,
          gap: 4
        }}>
          {/* Nombre del producto */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="menuItem"
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.375rem' },
                color: '#F8F8F8',
                letterSpacing: '0.01em',
                lineHeight: 1.3,
                textAlign: 'left',
                mb: 0.5
              }}
            >
              {product.name}
            </Typography>
            
            {/* Categoría sutil */}
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#B8B8B8',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: 0.8,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {product.category}
            </Typography>
          </Box>
          
          {/* Precio estilo menú clásico */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              minWidth: 'fit-content'
            }}
          >
            <Typography
              variant="priceDisplay"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.375rem' },
                color: '#D4AF37',
                letterSpacing: '-0.01em',
                    lineHeight: 1,
                textAlign: 'right'
                  }}
                >
              ${product.price.toLocaleString()}
                </Typography>
              </Box>
            </Box>
        {/* Línea separadora elegante */}
        <Box
          sx={{
            width: '100%',
            height: '1px',
            background: isRecommended 
              ? 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 20%, rgba(212, 175, 55, 0.5) 50%, rgba(212, 175, 55, 0.3) 80%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
            mb: 2.5,
            position: 'relative',
          }}
        />

        {/* Descripción estilo menú clásico */}
        {product.description && (
          <Typography
            variant="menuDescription"
            sx={{
              fontFamily: "'Inter', sans-serif",
              color: '#B8B8B8',
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              lineHeight: 1.6,
              fontWeight: 400,
              textAlign: 'left',
              fontStyle: 'italic',
              letterSpacing: '0.01em',
              opacity: 0.9
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
          background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%)',
          transition: 'left 0.6s ease-in-out',
          pointerEvents: 'none',
          zIndex: 0,
          '.MuiBox-root:hover &': {
            left: '100%',
          }
        }}
      />
    </MotionBox>
  );
};

export default ProductCard;