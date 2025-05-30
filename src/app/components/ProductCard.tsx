'use client';

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  FiberNew, 
  Eco,
  LocalBar,
  Restaurant,
  Whatshot
} from '@mui/icons-material';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const MotionBox = motion(Box);

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
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

  // Determinar el icono según la categoría
  const getCategoryIcon = () => {
    const category = product.category.toLowerCase();
    if (category.includes('bebida') || category.includes('cocktail') || category.includes('drink')) {
      return <LocalBar sx={{ fontSize: 14, color: 'inherit' }} />;
    }
    return <Restaurant sx={{ fontSize: 14, color: 'inherit' }} />;
  };

  return (
    <MotionBox
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -4,
        transition: { duration: 0.4, ease: 'easeOut' }
      }}
      sx={{
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(44, 44, 46, 0.8) 0%, rgba(28, 28, 30, 0.95) 100%)',
        backdropFilter: 'blur(32px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 0,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          background: 'linear-gradient(145deg, rgba(44, 44, 46, 0.95) 0%, rgba(28, 28, 30, 1) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                },
        // Esquinas cortadas estilo premium
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
              }}
            >
      {/* Marco celeste y blanco para productos recomendados */}
      {isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
          right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, #74ACDF, #FFFFFF, #74ACDF)',
            backgroundSize: '200% 200%',
            animation: 'argentineShimmer 4s ease-in-out infinite',
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '2px',
              left: '2px',
              right: '2px',
              bottom: '2px',
              background: 'linear-gradient(145deg, rgba(44, 44, 46, 0.8) 0%, rgba(28, 28, 30, 0.95) 100%)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
            },
            '@keyframes argentineShimmer': {
              '0%, 100%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' }
            }
          }}
      />
      )}

      {/* Patrón de fondo tipo cuero premium */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.01) 0%, transparent 50%),
            linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.005) 50%, transparent 100%)
          `,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Contenido principal */}
      <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 4, sm: 5 } }}>
        {/* Header estilo parrilla premium */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 3,
          gap: 3
        }}>
          {/* Sección izquierda: Etiquetas argentinas */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
            {/* Categoría principal */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  p: 0.75,
                  borderRadius: 0,
                  background: 'linear-gradient(135deg, rgba(161, 161, 170, 0.15) 0%, rgba(161, 161, 170, 0.08) 100%)',
                  border: '1px solid rgba(161, 161, 170, 0.2)',
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                }}
              >
                {getCategoryIcon()}
              </Box>
              <Typography
                sx={{
                  color: '#A1A1AA',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                {product.category}
              </Typography>
            </Box>

            {/* Etiquetas especiales argentinas */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {isRecommended && (
                <MotionBox
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.05), duration: 0.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      background: 'linear-gradient(135deg, rgba(116, 172, 223, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      border: '1px solid rgba(116, 172, 223, 0.3)',
                      clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))',
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
                    <Whatshot sx={{ fontSize: 12, color: '#74ACDF' }} />
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
    </MotionBox>
              )}
              
              {isNew && (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (index * 0.05), duration: 0.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'
                    }}
                  >
                    <FiberNew sx={{ fontSize: 12, color: '#3B82F6' }} />
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
                </MotionBox>
              )}
              
              {isVegetarian && (
                <MotionBox
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.05), duration: 0.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'
                    }}
                  >
                    <Eco sx={{ fontSize: 12, color: '#22C55E' }} />
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
                </MotionBox>
              )}
            </Box>
          </Box>

          {/* Precio estilo medallón argentino */}
          <MotionBox
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 + (index * 0.05), duration: 0.7, type: 'spring', stiffness: 200 }}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -2, 2, 0],
              transition: { duration: 0.4 }
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: isRecommended 
                  ? 'radial-gradient(circle, rgba(116, 172, 223, 0.2) 0%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)'
                  : 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 70%, transparent 100%)',
                border: `2px solid ${isRecommended ? '#74ACDF' : '#F59E0B'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(16px)',
                boxShadow: isRecommended 
                  ? '0 8px 32px rgba(116, 172, 223, 0.2)' 
                  : '0 8px 32px rgba(245, 158, 11, 0.2)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -1,
                  left: -1,
                  right: -1,
                  bottom: -1,
                  borderRadius: '50%',
                  background: `conic-gradient(from 0deg, ${isRecommended ? '#74ACDF' : '#F59E0B'}, transparent, ${isRecommended ? '#74ACDF' : '#F59E0B'})`,
                  zIndex: -1,
                  animation: 'rotate 4s linear infinite'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 6,
                  left: 6,
                  right: 6,
                  bottom: 6,
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, rgba(44, 44, 46, 0.9) 0%, rgba(28, 28, 30, 0.95) 100%)',
                  zIndex: 0
                },
                '@keyframes rotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    color: isRecommended ? '#74ACDF' : '#F59E0B',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    mb: 0.25
                  }}
                >
                  Precio
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: isRecommended ? '#74ACDF' : '#F59E0B',
                    letterSpacing: '-0.02em',
                    lineHeight: 1
                  }}
                >
                  ${product.price}
                </Typography>
              </Box>
            </Box>
          </MotionBox>
        </Box>

        {/* Separador elegante */}
        <Box
          sx={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
            mb: 3,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: isRecommended ? '#74ACDF' : '#F59E0B',
              opacity: 0.6
            }
          }}
        />

        {/* Nombre del plato estilo argentino */}
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            color: '#F5F5F7',
            letterSpacing: '-0.01em',
            lineHeight: 1.4,
            textAlign: 'center',
            mb: 2
          }}
        >
          {product.name}
        </Typography>

        {/* Descripción estilo carta argentina */}
        {product.description && (
          <Typography
            sx={{
              color: '#A1A1AA',
              fontSize: { xs: '0.8rem', sm: '0.85rem' },
              lineHeight: 1.6,
              fontWeight: 400,
              textAlign: 'center',
              opacity: 0.9,
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
          width: 20,
          height: 20,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          zIndex: 3
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 20,
          height: 20,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          zIndex: 3
        }}
      />
    </MotionBox>
  );
};

export default ProductCard;