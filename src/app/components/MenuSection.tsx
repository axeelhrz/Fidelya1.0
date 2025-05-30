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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.04, 0.62, 0.23, 0.98],
        delay: index * 0.1
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2 + (index * 0.1),
      },
    },
  };

  const recommendedCount = products.filter(p => p.isRecommended).length;
  // Determinar el icono y color según la categoría
  const getCategoryData = () => {
    const category = title.toLowerCase();
    if (category.includes('bebida') || category.includes('cocktail') || category.includes('drink')) {
      return { 
        icon: <LocalBar sx={{ fontSize: 20 }} />, 
                        color: '#74ACDF', 
        bgColor: 'rgba(116, 172, 223, 0.12)',
        borderColor: 'rgba(116, 172, 223, 0.25)'
};
    }
    if (category.includes('postre') || category.includes('dulce')) {
      return { 
        icon: <Cake sx={{ fontSize: 20 }} />, 
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.12)',
        borderColor: 'rgba(245, 158, 11, 0.25)'
      };
    }
    if (category.includes('entrada') || category.includes('aperitivo')) {
      return { 
        icon: <Fastfood sx={{ fontSize: 20 }} />, 
        color: '#22C55E',
        bgColor: 'rgba(34, 197, 94, 0.12)',
        borderColor: 'rgba(34, 197, 94, 0.25)'
      };
    }
    return { 
      icon: <Restaurant sx={{ fontSize: 20 }} />, 
      color: '#74ACDF',
      bgColor: 'rgba(116, 172, 223, 0.12)',
      borderColor: 'rgba(116, 172, 223, 0.25)'
    };
  };

  const categoryData = getCategoryData();

  return (
    <MotionBox
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: { xs: 8, sm: 10 } }}
    >
      {/* Título compacto y diferenciado */}
      <Box sx={{ mb: { xs: 4, sm: 5 } }}>
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: { xs: 2.5, sm: 3 },
            background: `linear-gradient(135deg, ${categoryData.bgColor} 0%, rgba(44, 44, 46, 0.4) 100%)`,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${categoryData.borderColor}`,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: `linear-gradient(180deg, ${categoryData.color} 0%, rgba(255, 255, 255, 0.2) 100%)`,
            }
          }}
        >
          {/* Sección izquierda: Icono y título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Icono compacto */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: categoryData.bgColor,
                border: `1px solid ${categoryData.borderColor}`,
                color: categoryData.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {categoryData.icon}
            </Box>

            {/* Título y contador */}
            <Box>
              <MotionTypography
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: '#F5F5F7',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  mb: 0.25
                }}
              >
                {title}
              </MotionTypography>
              
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#A1A1AA',
                  letterSpacing: '0.05em',
                  opacity: 0.8
                }}
              >
                {products.length} {products.length === 1 ? 'opción' : 'opciones'}
              </Typography>
            </Box>
          </Box>

          {/* Sección derecha: Indicador de destacados */}
          {recommendedCount > 0 && (
            <MotionBox
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2, 
                py: 1, 
                backgroundColor: 'rgba(116, 172, 223, 0.15)',
                border: '1px solid rgba(116, 172, 223, 0.3)',
                borderRadius: 1.5
              }}>
                <Whatshot sx={{ fontSize: 14, color: '#74ACDF' }} />
                <Typography sx={{ 
                  color: '#74ACDF', 
                  fontSize: '0.7rem', 
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }}>
                  {recommendedCount}
                </Typography>
              </Box>
            </MotionBox>
          )}
        </MotionBox>

        {/* Divisor minimalista */}
        <Box
          sx={{
            mt: 3,
            height: '1px',
            background: `linear-gradient(90deg, ${categoryData.color} 0%, rgba(255, 255, 255, 0.1) 30%, transparent 100%)`,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: -1,
              width: '60px',
              height: '3px',
              background: categoryData.color,
              borderRadius: '1px',
              opacity: 0.6
            }
          }}
        />
      </Box>

      {/* Lista de productos */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={{ xs: 4, sm: 5 }}>
          {products.map((product, productIndex) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={productIndex}
            />
          ))}
        </Stack>
      </MotionBox>
    </MotionBox>
  );
};

export default MenuSection;
