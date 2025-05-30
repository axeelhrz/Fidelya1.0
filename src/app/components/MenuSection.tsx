'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  LocalBar, 
  Restaurant,
  Coffee,
  Cake,
  Star
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
  // Determinar el icono según la categoría
  const getCategoryIcon = () => {
    const category = title.toLowerCase();
    if (category.includes('cocktail') || category.includes('gin') || category.includes('whisky') || category.includes('destilado')) {
      return <LocalBar sx={{ fontSize: 24, color: '#D4AF37' }} />;
    }
    if (category.includes('café') || category.includes('cafetería')) {
      return <Coffee sx={{ fontSize: 24, color: '#D4AF37' }} />;
    }
    if (category.includes('postre')) {
      return <Cake sx={{ fontSize: 24, color: '#D4AF37' }} />;
    }
    return <Restaurant sx={{ fontSize: 24, color: '#D4AF37' }} />;
  };
  return (
    <MotionBox
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: { xs: 10, sm: 12 } }}
    >
      {/* Título de sección estilo menú clásico */}
      <Box sx={{ mb: { xs: 6, sm: 8 } }}>
        <MotionBox
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          sx={{
            textAlign: 'center',
            position: 'relative',
            py: 4
          }}
        >
          {/* Líneas decorativas superiores */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            }}
          />

          {/* Icono de categoría */}
          <Box sx={{ mb: 2 }}>
            {getCategoryIcon()}
          </Box>

          {/* Título principal */}
          <MotionTypography
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variant="categoryTitle"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              color: '#D4AF37',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              mb: 1,
              textAlign: 'center'
            }}
          >
            {title}
          </MotionTypography>

          {/* Contador de productos */}
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#B8B8B8',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.8,
              mb: 2
            }}
          >
            {products.length} {products.length === 1 ? 'Opción' : 'Opciones'}
            {recommendedCount > 0 && (
              <Box component="span" sx={{ ml: 2, color: '#D4AF37' }}>
                <Star sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                {recommendedCount} Recomendado{recommendedCount > 1 ? 's' : ''}
              </Box>
            )}
          </Typography>

          {/* Líneas decorativas inferiores */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            }}
          />

          {/* Ornamento central */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#D4AF37',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
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
        <Stack spacing={{ xs: 3, sm: 4 }}>
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
