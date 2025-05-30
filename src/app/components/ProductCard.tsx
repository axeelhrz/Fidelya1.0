'use client';

import React from 'react';
import { 
  Box,
  Typography,
  Chip
} from '@mui/material';
import { 
  Star,
  NoMeals
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Product } from '../types';

const MotionBox = motion(Box);

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <MotionBox
      whileHover={{ 
        backgroundColor: 'rgba(26, 26, 26, 0.4)',
        transition: { duration: 0.2 }
      }}
      sx={{
        position: 'relative',
        borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 3 },
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderBottomColor: 'rgba(212, 175, 55, 0.3)'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        gap: 3
      }}>
        {/* Contenido principal */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Nombre del producto */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: '#F8F8F8',
                lineHeight: 1.3,
                letterSpacing: '0.01em'
              }}
            >
              {product.name}
            </Typography>
            
            {/* Indicadores especiales */}
            {product.isRecommended && (
              <Star sx={{ 
                fontSize: 16, 
                color: '#D4AF37',
                ml: 0.5
              }} />
              )}
            
            {product.nutritionalInfo?.isVegan && (
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: '#4CAF50',
                  fontWeight: 600,
                  ml: 1
            }}
          >
                🌱
          </Typography>
            )}

            {!product.isAvailable && (
              <NoMeals sx={{ 
                fontSize: 16, 
                color: '#F44336',
                ml: 0.5
              }} />
            )}
          </Box>

          {/* Descripción */}
          {product.description && (
            <Typography
              variant="body2"
                sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '0.85rem', md: '0.9rem' },
                color: '#B8B8B8',
                lineHeight: 1.5,
                mb: 1.5,
                letterSpacing: '0.01em'
              }}
            >
              {product.description}
                </Typography>
            )}

          {/* Tags y características */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {/* Categoría */}
                    <Chip
              label={product.category}
                      size="small"
                      sx={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                        color: '#D4AF37',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderRadius: 0,
                height: 24
              }}
            />

            {/* Características nutricionales */}
            {product.nutritionalInfo?.isVegetarian && !product.nutritionalInfo?.isVegan && (
              <Chip
                label="Vegetariano"
                size="small"
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  color: '#4CAF50',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  borderRadius: 0,
                  height: 24
                }}
              />
            )}

            {product.nutritionalInfo?.isGlutenFree && (
              <Chip
                label="Sin Gluten"
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  color: '#FF9800',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  borderRadius: 0,
                  height: 24
                }}
              />
            )}

            {/* Tiempo de preparación */}
            {product.preparationTime && (
              <Chip
                label={`${product.preparationTime} min`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(158, 158, 158, 0.1)',
                  border: '1px solid rgba(158, 158, 158, 0.3)',
                  color: '#9E9E9E',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  borderRadius: 0,
                  height: 24
                }}
              />
            )}
          </Box>
        </Box>

        {/* Precio */}
        <Box sx={{ 
          textAlign: 'right',
          minWidth: 'fit-content'
        }}>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: '#D4AF37',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {/* Información adicional del precio */}
          {product.nutritionalInfo?.calories && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                color: '#B8B8B8',
                mt: 0.5,
                opacity: 0.8
              }}
            >
              {product.nutritionalInfo.calories} cal
            </Typography>
          )}

          {/* Estado de disponibilidad */}
          {!product.isAvailable && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                color: '#F44336',
                mt: 0.5,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              No disponible
            </Typography>
          )}
        </Box>
      </Box>

      {/* Línea decorativa para productos recomendados */}
      {product.isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: 'linear-gradient(180deg, #D4AF37 0%, rgba(212, 175, 55, 0.3) 100%)'
          }}
        />
      )}
    </MotionBox>
  );
}
