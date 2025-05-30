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
        y: -2,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.6) 0%, rgba(28, 28, 30, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.8) 0%, rgba(28, 28, 30, 0.95) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        },
        // Esquinas cortadas elegantes
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            >
      {/* Marco dorado para productos destacados */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(116, 172, 223, 0.15), transparent, rgba(116, 172, 223, 0.15))',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s ease-in-out infinite',
            clipPath: 'inherit',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '1px',
              left: '1px',
              right: '1px',
              bottom: '1px',
              background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.6) 0%, rgba(28, 28, 30, 0.8) 100%)',
              clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))'
            },
            '@keyframes shimmer': {
              '0%, 100%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' }
            }
          }}
      />
              )}

      {/* Patrón de fondo elegante */}
      <Box
              sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '30%',
          height: '100%',
          background: `
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 60%),
            linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.01) 100%)
          `,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Contenido principal */}
      <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 3.5, sm: 4 } }}>
        {/* Header con etiquetas elegantes */}
        {(isRecommended || isNew || isVegetarian) && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 2.5,
            flexWrap: 'wrap'
          }}>
            {isRecommended && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.5,
                  background: 'linear-gradient(135deg, rgba(116, 172, 223, 0.2) 0%, rgba(116, 172, 223, 0.1) 100%)',
                  border: '1px solid rgba(116, 172, 223, 0.3)',
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                    clipPath: 'inherit'
                  }
                }}
              >
                <Star sx={{ fontSize: 11, color: '#74ACDF' }} />
                <Typography
                  sx={{
                    color: '#74ACDF',
                  fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  Destacado
                </Typography>
              </Box>
            )}
            
            {isNew && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.5,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                }}
              >
                <FiberNew sx={{ fontSize: 11, color: '#3B82F6' }} />
                <Typography
                  sx={{
                    color: '#3B82F6',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
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
                  px: 1.5,
                  py: 0.5,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                }}
              >
                <Eco sx={{ fontSize: 11, color: '#22C55E' }} />
                <Typography
                  sx={{
                    color: '#22C55E',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  Vegano
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Layout principal estilo carta premium */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2,
          gap: 3
        }}>
          {/* Nombre del plato */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                color: '#F5F5F7',
                letterSpacing: '-0.02em',
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
                fontWeight: 500,
                color: '#A1A1AA',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0.7
              }}
            >
              {product.category}
            </Typography>
          </Box>
          
          {/* Precio estilo medallón de bar */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 'fit-content'
            }}
          >
            {/* Contenedor del precio */}
            <Box
              sx={{
                position: 'relative',
                px: 2.5,
                py: 1.5,
                background: isRecommended 
                  ? 'linear-gradient(135deg, rgba(116, 172, 223, 0.2) 0%, rgba(116, 172, 223, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
                border: `1px solid ${isRecommended ? 'rgba(116, 172, 223, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                backdropFilter: 'blur(12px)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                  clipPath: 'inherit',
                  pointerEvents: 'none'
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                {/* Icono temático */}
                <Box sx={{ mb: 0.5 }}>
                  {product.category.toLowerCase().includes('bebida') || product.category.toLowerCase().includes('cocktail') ? (
                    <LocalBar sx={{ 
                      fontSize: 16, 
                      color: isRecommended ? '#74ACDF' : '#F59E0B',
                      opacity: 0.8
                    }} />
                  ) : (
                    <Restaurant sx={{ 
                      fontSize: 16, 
                      color: isRecommended ? '#74ACDF' : '#F59E0B',
                      opacity: 0.8
                    }} />
                  )}
                </Box>
                
                {/* Precio */}
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.125rem', sm: '1.25rem' },
                    color: isRecommended ? '#74ACDF' : '#F59E0B',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    fontFamily: 'monospace'
                  }}
                >
                  ${product.price}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Separador elegante */}
        <Box
          sx={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
            mb: 2,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -1,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: isRecommended ? '#74ACDF' : '#F59E0B',
              opacity: 0.6
            }
          }}
        />

        {/* Descripción estilo carta francesa */}
        {product.description && (
          <Typography
            sx={{
              color: '#A1A1AA',
              fontSize: { xs: '0.8rem', sm: '0.85rem' },
              lineHeight: 1.6,
              fontWeight: 400,
              textAlign: 'left',
              opacity: 0.9,
              fontStyle: 'italic',
              letterSpacing: '0.01em'
            }}
          >
            {product.description}
          </Typography>
        )}
      </Box>

      {/* Esquinas decorativas */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 16,
          height: 16,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          zIndex: 3
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 16,
          height: 16,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          zIndex: 3
        }}
      />
    </MotionBox>
  );
};

export default ProductCard;