'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Restaurant, 
  LocalBar, 
  Cake,
  Fastfood,
  Whatshot
} from '@mui/icons-material';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface MenuSectionProps {
  title: string;
  products: Product[];
  index?: number;
}

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const MenuSection: React.FC<MenuSectionProps> = ({ title, products, index = 0 }) => {
  if (!products || products.length === 0) return null;

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.04, 0.62, 0.23, 0.98],
        delay: index * 0.15
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3 + (index * 0.15),
      },
    },
  };

  const recommendedCount = products.filter(p => p.isRecommended).length;
  const newCount = products.filter(p => p.isNew).length;

  // Determinar el icono según la categoría
  const getCategoryIcon = () => {
    const category = title.toLowerCase();
    if (category.includes('bebida') || category.includes('cocktail') || category.includes('drink')) {
      return <LocalBar sx={{ fontSize: 28, color: '#74ACDF' }} />;
    }
    if (category.includes('postre') || category.includes('dulce')) {
      return <Cake sx={{ fontSize: 28, color: '#F59E0B' }} />;
    }
    if (category.includes('entrada') || category.includes('aperitivo')) {
      return <Fastfood sx={{ fontSize: 28, color: '#22C55E' }} />;
    }
    return <Restaurant sx={{ fontSize: 28, color: '#74ACDF' }} />;
  };

  return (
    <MotionBox
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: { xs: 10, sm: 12 } }}
    >
      {/* Título de categoría premium argentino */}
      <Box sx={{ mb: { xs: 6, sm: 8 } }}>
        <MotionBox
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98], delay: 0.2 }}
          sx={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.6) 0%, rgba(28, 28, 30, 0.8) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            p: { xs: 4, sm: 5 },
            mb: 4,
            overflow: 'hidden'
          }}
        >
          {/* Patrón de fondo sutil */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 20%, rgba(116, 172, 223, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.02) 0%, transparent 50%),
                linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.01) 100%)
              `,
              pointerEvents: 'none'
            }}
          />

          {/* Contenido del header */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3
            }}>
              {/* Sección izquierda: Icono y título */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Contenedor del icono premium */}
                <Box
                  sx={{
                    position: 'relative',
                    p: 2,
                    background: 'linear-gradient(135deg, rgba(116, 172, 223, 0.15) 0%, rgba(116, 172, 223, 0.08) 100%)',
                    border: '1px solid rgba(116, 172, 223, 0.2)',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
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
                  {getCategoryIcon()}
                </Box>

                {/* Título y subtítulo */}
                <Box>
                  <MotionTypography
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.75rem', sm: '2.25rem' },
                      color: '#F5F5F7',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                      mb: 0.5,
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {title}
                  </MotionTypography>
                  
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: '#A1A1AA',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      opacity: 0.8
                    }}
                  >
                    {products.length} {products.length === 1 ? 'opción' : 'opciones'}
                  </Typography>
                </Box>
              </Box>

              {/* Sección derecha: Indicadores */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {recommendedCount > 0 && (
                  <MotionBox
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2, 
                      py: 1, 
                      background: 'linear-gradient(135deg, rgba(116, 172, 223, 0.2) 0%, rgba(116, 172, 223, 0.1) 100%)',
                      border: '1px solid rgba(116, 172, 223, 0.3)',
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                    }}>
                      <Whatshot sx={{ fontSize: 16, color: '#74ACDF' }} />
                      <Typography sx={{ 
                        color: '#74ACDF', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        letterSpacing: '0.05em'
                      }}>
                        {recommendedCount} Destacado{recommendedCount > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </MotionBox>
                )}
                
                {newCount > 0 && (
                  <MotionBox
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2, 
                      py: 1, 
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                    }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#3B82F6',
                          animation: 'pulse 2s infinite'
                        }}
                      />
                      <Typography sx={{ 
                        color: '#3B82F6', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        letterSpacing: '0.05em'
                      }}>
                        {newCount} Nuevo{newCount > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </MotionBox>
                )}
              </Box>
            </Box>

            {/* Divisor premium con gradiente argentino */}
            <Box
              sx={{
                position: 'relative',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(116, 172, 223, 0.3) 20%, rgba(255, 255, 255, 0.4) 50%, rgba(245, 158, 11, 0.3) 80%, transparent 100%)',
                borderRadius: '1px',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '120px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #74ACDF 0%, rgba(116, 172, 223, 0.5) 100%)',
                  borderRadius: '1px'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: '50%',
                  top: -3,
                  transform: 'translateX(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #F5F5F7 0%, rgba(245, 245, 247, 0.5) 100%)',
                  border: '1px solid rgba(116, 172, 223, 0.3)'
                }
              }}
            />
          </Box>

          {/* Esquinas decorativas */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 30,
              height: 30,
              background: 'linear-gradient(135deg, rgba(116, 172, 223, 0.1) 0%, transparent 100%)',
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              zIndex: 2
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 30,
              height: 30,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              zIndex: 2
            }}
          />
        </MotionBox>
      </Box>

      {/* Lista de productos */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={{ xs: 5, sm: 6 }}>
          {products.map((product, productIndex) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={productIndex}
            />
          ))}
        </Stack>
      </MotionBox>

      {/* Estilos para animación pulse */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </MotionBox>
  );
};

export default MenuSection;
