'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  FiberNew, 
  LocalFlorist
} from '@mui/icons-material';
import { Product } from '../../data/menu';

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
        duration: 0.4, 
        ease: [0.04, 0.62, 0.23, 0.98],
        delay: index * 0.05
      } 
    }
  };

  const isRecommended = product.isRecommended || false;
  const isNew = product.isNew || false;
  const isVegetarian = product.isVegetarian || false;

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
        background: 'rgba(26, 26, 26, 0.4)',
        border: isRecommended 
          ? '1px solid rgba(212, 175, 55, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          background: 'rgba(26, 26, 26, 0.6)',
          borderColor: isRecommended 
            ? 'rgba(212, 175, 55, 0.5)' 
            : 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      {/* Línea dorada para productos destacados */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '1px',
            background: '#D4AF37',
            zIndex: 2
          }}
        />
      )}

      {/* Contenido principal */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 2.5, sm: 3 } }}>
        {/* Etiquetas minimalistas */}
        {(isRecommended || isNew || isVegetarian) && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 2,
            flexWrap: 'wrap'
          }}>
            {isRecommended && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                }}
              >
                <Star sx={{ fontSize: 10, color: '#D4AF37' }} />
                <Typography
                  sx={{
                    color: '#D4AF37',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
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
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <FiberNew sx={{ fontSize: 10, color: '#F8F8F8' }} />
                <Typography
                  sx={{
                    color: '#F8F8F8',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
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
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <LocalFlorist sx={{ fontSize: 10, color: '#22C55E' }} />
                <Typography
                  sx={{
                    color: '#22C55E',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  Veggie
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Layout estilo menú argentino */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 1.5,
          gap: 2
        }}>
          {/* Nombre del producto */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="menuItem"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                color: '#F8F8F8',
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
                fontSize: '0.7rem',
                fontWeight: 400,
                color: '#B8B8B8',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                opacity: 0.7,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {product.category}
            </Typography>
          </Box>
          
          {/* Precio estilo argentino */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              minWidth: 'fit-content'
            }}
          >
            <Typography
              variant="priceDisplay"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                color: '#D4AF37',
                lineHeight: 1,
                textAlign: 'right'
                  }}
                >
              ${product.price.toLocaleString('es-AR')}
                </Typography>
              </Box>
            </Box>

        {/* Línea separadora minimalista */}
        <Box
          sx={{
            width: '100%',
            height: '1px',
            background: isRecommended 
              ? 'rgba(212, 175, 55, 0.2)'
              : 'rgba(255, 255, 255, 0.08)',
            mb: 1.5,
          }}
        />

        {/* Descripción compacta */}
        {product.description && (
          <Typography
            variant="menuDescription"
            sx={{
              fontFamily: "'Inter', sans-serif",
              color: '#B8B8B8',
              fontSize: { xs: '0.8rem', sm: '0.85rem' },
              lineHeight: 1.4,
              fontWeight: 400,
              textAlign: 'left',
              opacity: 0.9
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