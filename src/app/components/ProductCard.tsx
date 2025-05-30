'use client';

import React, { useState } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  Star, 
  FiberNew, 
  Eco,
  TrendingUp,
  LocalFireDepartment,
  Favorite,
  AutoAwesome
} from '@mui/icons-material';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const MotionBox = motion(Box);

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transformaciones para efectos de paralaje
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.7, 
        ease: [0.04, 0.62, 0.23, 0.98],
        delay: index * 0.1
      } 
    }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0, 0.6, 0],
      scale: [0.8, 1.2, 0.8],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const isRecommended = product.isRecommended;
  const isNew = product.isNew;
  const isVegetarian = product.isVegetarian;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  return (
    <MotionBox
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.4, ease: 'easeOut' }
      }}
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        background: isRecommended 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(44, 44, 46, 0.95) 30%, rgba(28, 28, 30, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(44, 44, 46, 0.95) 30%, rgba(28, 28, 30, 0.98) 100%)',
        backdropFilter: 'blur(32px)',
        border: isRecommended 
          ? '1px solid rgba(16, 185, 129, 0.2)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'center center',
        '&:hover': {
          backgroundColor: isRecommended 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(44, 44, 46, 0.98) 30%, rgba(28, 28, 30, 1) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(44, 44, 46, 0.98) 30%, rgba(28, 28, 30, 1) 100%)',
          borderColor: isRecommended 
            ? 'rgba(16, 185, 129, 0.4)' 
            : 'rgba(255, 255, 255, 0.15)',
          boxShadow: isRecommended 
            ? '0 20px 60px rgba(16, 185, 129, 0.15), 0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 20px 60px rgba(59, 130, 246, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3)',
        }
      }}
    >
      {/* Efecto de brillo animado para productos recomendados */}
      {isRecommended && (
        <MotionBox
          variants={glowVariants}
          initial="initial"
          animate="animate"
          sx={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: 4,
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.3))',
            zIndex: -1,
            filter: 'blur(8px)'
          }}
        />
      )}

      {/* Patrón de fondo geométrico sutil */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60%',
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
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 5, sm: 6 } }}>
        {/* Header con chips premium */}
        {(isRecommended || isNew || isVegetarian) && (
          <Stack direction="row" spacing={1.5} sx={{ mb: 4, flexWrap: 'wrap', gap: 1.5 }}>
            {isRecommended && (
              <MotionBox
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.3 + (index * 0.05), 
                  type: 'spring', 
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Chip
                  icon={<Star sx={{ fontSize: '14px !important' }} />}
                  label="Recomendado"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    color: '#10B981',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 28,
                    borderRadius: 2.5,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                    '& .MuiChip-icon': {
                      color: '#10B981',
                      filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))'
                    },
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)'
                    }
                  }}
                />
              </MotionBox>
            )}
            
            {isNew && (
              <MotionBox
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.4 + (index * 0.05), 
                  type: 'spring', 
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Chip
                  icon={<FiberNew sx={{ fontSize: '14px !important' }} />}
                  label="Nuevo"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    color: '#3B82F6',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 28,
                    borderRadius: 2.5,
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                    '& .MuiChip-icon': {
                      color: '#3B82F6',
                      filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))'
                    }
                  }}
                />
              </MotionBox>
            )}
            
            {isVegetarian && (
              <MotionBox
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.5 + (index * 0.05), 
                  type: 'spring', 
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Chip
                  icon={<Eco sx={{ fontSize: '14px !important' }} />}
                  label="Vegano"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
                    color: '#F59E0B',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 28,
                    borderRadius: 2.5,
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                    '& .MuiChip-icon': {
                      color: '#F59E0B',
                      filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))'
                    }
                  }}
                />
              </MotionBox>
            )}
          </Stack>
        )}

        {/* Layout principal revolucionario */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 3,
          position: 'relative'
        }}>
          {/* Nombre del producto con efecto de escritura */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (index * 0.05), duration: 0.6 }}
            sx={{ flex: 1, pr: 4 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.375rem' },
                color: '#F5F5F7',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                textAlign: 'left',
                position: 'relative',
                '&::after': isRecommended ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #10B981 0%, transparent 100%)',
                  borderRadius: '1px'
                } : {}
              }}
            >
              {product.name}
            </Typography>
          </MotionBox>
          
          {/* Precio con efecto magnético */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + (index * 0.05), duration: 0.5 }}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -2, 2, 0],
              transition: { duration: 0.3 }
            }}
            sx={{
              position: 'relative',
              p: 2,
              borderRadius: 3,
              background: isRecommended 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
              border: `1px solid ${isRecommended ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
              backdropFilter: 'blur(16px)',
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
              }
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.375rem', sm: '1.5rem' },
                color: isRecommended ? '#10B981' : '#F59E0B',
                letterSpacing: '-0.02em',
                textAlign: 'center',
                textShadow: `0 2px 12px ${isRecommended ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                position: 'relative',
                zIndex: 1
              }}
            >
              ${product.price}
            </Typography>
          </MotionBox>
        </Box>

        {/* Descripción con efecto de aparición gradual */}
        {product.description && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + (index * 0.05), duration: 0.5 }}
            sx={{ mb: 4 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#A1A1AA',
                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                lineHeight: 1.7,
                fontWeight: 400,
                textAlign: 'left',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: -16,
                  top: 8,
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  backgroundColor: isRecommended ? '#10B981' : '#3B82F6',
                  opacity: 0.6
                }
              }}
            >
              {product.description}
            </Typography>
          </MotionBox>
        )}

        {/* Footer con divisor futurista */}
        <MotionBox
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.8 + (index * 0.05), duration: 0.6 }}
          sx={{
            pt: 4,
            borderTop: `1px solid ${isRecommended ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40%',
              height: '1px',
              background: `linear-gradient(90deg, ${isRecommended ? '#10B981' : '#3B82F6'} 0%, transparent 100%)`,
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#A1A1AA',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.8
              }}
            >
              {product.category}
            </Typography>
            
            {/* Indicadores visuales premium */}
            {isRecommended && (
              <MotionBox
                animate={{ 
                  rotate: 360,
                  transition: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
              >
                <AutoAwesome 
                  sx={{ 
                    color: '#10B981', 
                    fontSize: 16,
                    filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))'
                  }} 
                />
              </MotionBox>
            )}
          </Box>
          
          {/* Medidor de popularidad visual */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {[...Array(isRecommended ? 5 : isNew ? 4 : 3)].map((_, i) => (
              <MotionBox
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 1 + (index * 0.05) + (i * 0.1), 
                  duration: 0.3 
                }}
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: isRecommended ? '#10B981' : isNew ? '#3B82F6' : '#F59E0B',
                  opacity: 0.6 + (i * 0.1),
                  boxShadow: `0 0 8px ${isRecommended ? 'rgba(16, 185, 129, 0.4)' : isNew ? 'rgba(59, 130, 246, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                }}
              />
            ))}
          </Box>
        </MotionBox>
      </Box>

      {/* Efecto de partículas flotantes para productos especiales */}
      {isRecommended && (
        <>
          {[...Array(3)].map((_, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20, x: Math.random() * 100 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                y: [20, -20, 20],
                x: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
              sx={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                width: 3,
                height: 3,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                filter: 'blur(1px)',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
          ))}
        </>
      )}
    </MotionBox>
  );
};

export default ProductCard;