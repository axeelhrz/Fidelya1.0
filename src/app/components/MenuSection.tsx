'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  LocalBar, 
  Restaurant,
  Coffee,
  Cake,
  Star,
  Fastfood,
  LocalPizza,
  Icecream,
  EmojiFoodBeverage
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
    hidden: { opacity: 0, y: 20 },
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
        staggerChildren: 0.05,
        delayChildren: 0.2 + (index * 0.1),
      },
    },
  };

  // Contar productos recomendados (usando tags o nutritionalInfo)
  const recommendedCount = products.filter(p => 
    p.tags?.includes('recomendado') || 
    p.tags?.includes('destacado') ||
    p.tags?.includes('especial')
  ).length;

  // Determinar el icono según la categoría
  const getCategoryIcon = () => {
    const category = title.toLowerCase();
    
    // Mapeo de categorías Firebase a iconos
    if (category.includes('cocktail') || category.includes('beverage') || category.includes('wine') || category.includes('beer')) {
      return <LocalBar sx={{ fontSize: 18, color: '#D4AF37' }} />;
    }
    if (category.includes('coffee') || category.includes('café')) {
      return <Coffee sx={{ fontSize: 18, color: '#D4AF37' }} />;
    }
    if (category.includes('dessert') || category.includes('postre')) {
      return <Cake sx={{ fontSize: 18, color: '#D4AF37' }} />;
    }
    if (category.includes('appetizer') || category.includes('entrada')) {
      return <Fastfood sx={{ fontSize: 18, color: '#D4AF37' }} />;
    }
    if (category.includes('main_course') || category.includes('principal')) {
      return <LocalPizza sx={{ fontSize: 18, color: '#D4AF37' }} />;
    }
    if (category.includes('snack') || category.includes('side_dish')) {
      return <Icecream sx={{ fontSize: 18, color: '#D4AF37' }} />;
    }
    if (category.includes('non_alcoholic')) {
      return <EmojiFoodBeverage sx={{ fontSize: 18, color: '#D4AF37' }} />;
    }
    
    return <Restaurant sx={{ fontSize: 18, color: '#D4AF37' }} />;
  };

  // Función para formatear el nombre de la categoría
  const formatCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'APPETIZER': 'Entradas',
      'MAIN_COURSE': 'Platos Principales',
      'DESSERT': 'Postres',
      'BEVERAGE': 'Bebidas',
      'SIDE_DISH': 'Acompañamientos',
      'COCKTAIL': 'Cócteles',
      'WINE': 'Vinos',
      'BEER': 'Cervezas',
      'COFFEE': 'Cafetería',
      'NON_ALCOHOLIC': 'Sin Alcohol',
      'SNACK': 'Snacks'
    };

    return categoryMap[category.toUpperCase()] || category;
  };

  return (
    <MotionBox
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: { xs: 6, sm: 8 } }}
    >
      {/* Título de sección minimalista */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
          }}
        >
          {/* Sección izquierda: Icono y título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Icono minimalista */}
            <Box
              sx={{
                p: 1,
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getCategoryIcon()}
            </Box>
            {/* Título y contador */}
            <Box>
              <MotionTypography
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                variant="categoryTitle"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: '#D4AF37',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                  mb: 0.25
                }}
              >
                {formatCategoryName(title)}
              </MotionTypography>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 400,
                  color: '#B8B8B8',
                  letterSpacing: '0.02em',
                  opacity: 0.8,
                  fontFamily: "'Inter', sans-serif"
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
                gap: 0.5,
                px: 1.5, 
                py: 0.5, 
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <Star sx={{ fontSize: 12, color: '#D4AF37' }} />
                <Typography sx={{ 
                  color: '#D4AF37', 
                  fontSize: '0.65rem', 
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {recommendedCount}
                </Typography>
              </Box>
            </MotionBox>
          )}
        </MotionBox>
      </Box>

      {/* Lista de productos */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
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
