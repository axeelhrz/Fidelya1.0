'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Fade,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowBack, 
  Restaurant,
  FilterList,
  Close
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import MenuSection from './MenuSection';

interface MenuViewerProps {
  products: Product[];
  menuName?: string;
  menuDescription?: string;
}

const MotionBox = motion(Box);
const MotionContainer = motion(Container);

const MenuViewer: React.FC<MenuViewerProps> = ({
  products,
  menuName = 'MenuQR',
  menuDescription = 'Experiencia gastronómica premium'
}) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showFilters, setShowFilters] = useState(false);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    products.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });
    
    const cats = [
      { name: 'Todas', count: products.length },
      ...Array.from(new Set(products.map(p => p.category))).map(cat => ({
        name: cat,
        count: categoryCount[cat] || 0
      }))
    ];
    return cats;
  }, [products]);

  // Filtrar productos por categoría
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todas') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Agrupar productos filtrados por categoría
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [filteredProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#1C1C1E',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0),
        radial-gradient(circle at 2px 2px, rgba(255,255,255,0.008) 1px, transparent 0)
      `,
      backgroundSize: '20px 20px, 40px 40px',
      backgroundPosition: '0 0, 10px 10px'
    }}>
      {/* Header Premium */}
      <AppBar 
        position="fixed" 
                elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.88)',
          backdropFilter: 'blur(48px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
          zIndex: 1100,
          '&::before': {
            content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.015) 0%, transparent 100%)',
                pointerEvents: 'none'
          }
              }}
              >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2.5, sm: 4 },
          minHeight: { xs: 68, sm: 76 },
          position: 'relative'
        }}>
          {/* Sección izquierda: Botón de regreso + Branding */}
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            sx={{
              display: 'flex', 
              alignItems: 'center',
              gap: 3
            }}
            >
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton 
                onClick={() => router.push('/')}
                sx={{ 
                    color: '#A1A1AA',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                color: '#F5F5F7',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                  }
              }}
            >
                <ArrowBack fontSize="small" />
              </IconButton>
          </MotionBox>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box
          sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              position: 'relative',
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
                <Restaurant sx={{ 
                  color: '#3B82F6', 
                  fontSize: 20,
                  filter: 'drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4))'
                }} />
              </Box>
              
              <Box>
                <Typography 
                  sx={{ 
                    fontWeight: 700,
                    color: '#F5F5F7',
                    letterSpacing: '-0.03em',
                    fontSize: { xs: '1.25rem', sm: '1.375rem' },
                    lineHeight: 1,
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
                    background: 'linear-gradient(135deg, #F5F5F7 0%, #E5E5E7 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Xs Reset
              </Typography>
              
                <Typography
                sx={{
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: '#A1A1AA',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    opacity: 0.8,
                    lineHeight: 1,
                    mt: 0.25
                  }}
                >
                  Bar & Lounge
                </Typography>
          </Box>
            </Box>
          </MotionBox>

          {/* Sección derecha: Filtros y estado */}
          <MotionBox
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98], delay: 0.2 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            {/* Botón de filtros premium */}
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  color: showFilters ? '#3B82F6' : '#A1A1AA',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: showFilters ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${showFilters ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)'}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                            '&:hover': {
                    color: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    borderColor: 'rgba(59, 130, 246, 0.2)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.15)'
                  }
                }}
              >
                {showFilters ? <Close fontSize="small" /> : <FilterList fontSize="small" />}
              </IconButton>
            </MotionBox>

            {/* Estado */}
            <Box
                sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                backgroundColor: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.12)'
                }}
              >
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                  animation: 'pulse 2s infinite'
                }}
              />
              <Typography
                sx={{
                  color: '#10B981',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                Abierto
              </Typography>
            </Box>
          </MotionBox>
        </Toolbar>

        {/* Línea decorativa inferior */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.2) 20%, rgba(245, 158, 11, 0.3) 50%, rgba(59, 130, 246, 0.2) 80%, transparent 100%)',
            opacity: 0.7
          }}
        />
      </AppBar>

      {/* Contenido principal */}
      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 10, sm: 12 },
          pb: 12,
          px: { xs: 3, sm: 4 },
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero section minimalista */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}
        >
          <Typography 
            sx={{ 
              fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' },
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: '#F5F5F7',
              mb: 2,
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Xs Reset
          </Typography>

          <Typography 
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              fontWeight: 500,
              color: '#A1A1AA',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              mb: 3,
              opacity: 0.8
            }}
          >
            Bar & Lounge Experience
          </Typography>
          
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 400,
              maxWidth: 400,
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4
            }}
          >
            {menuDescription}
          </Typography>

          <Box
            sx={{
              width: 80,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #3B82F6 30%, #F59E0B 70%, transparent 100%)',
              mx: 'auto'
            }}
          />
        </MotionBox>

        {/* Sistema de filtros compacto para móvil */}
        <AnimatePresence>
          {showFilters && (
            <MotionBox
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              sx={{ mb: { xs: 6, sm: 8 } }}
            >
              <Box
                sx={{ 
                  p: { xs: 3, sm: 4 }, 
                  borderRadius: 3,
                  backgroundColor: 'rgba(44, 44, 46, 0.4)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Header compacto */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                    justifyContent: 'space-between',
                  mb: 3
                  }}>
                  <Typography 
                    sx={{ 
                      fontWeight: 600,
                      color: '#F5F5F7',
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                          letterSpacing: '-0.02em'
                        }}
                      >
                    Categorías
                      </Typography>
                  <Typography
                    sx={{
                      color: '#F59E0B',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: 1.5,
                      border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    {filteredProducts.length}
                  </Typography>
                    </Box>
                
                {/* Chips horizontales para móvil */}
                <Stack 
                  direction="row" 
                  spacing={1.5}
                  sx={{ 
                    flexWrap: 'wrap',
                    gap: 1.5,
                  }}
                >
                    {categories.map((category, index) => (
                      <MotionBox
                        key={category.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.05, 
                        duration: 0.3
                        }}
                      whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                      <Chip
                        label={`${category.name} (${category.count})`}
                          onClick={() => setSelectedCategory(category.name)}
                        variant={selectedCategory === category.name ? 'filled' : 'outlined'}
                          sx={{
                          minHeight: { xs: 36, sm: 40 },
                          borderRadius: 2,
                          fontWeight: selectedCategory === category.name ? 600 : 500,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          px: { xs: 1.5, sm: 2 },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          backgroundColor: selectedCategory === category.name 
                            ? '#3B82F6' 
                            : 'rgba(255, 255, 255, 0.02)',
                          color: selectedCategory === category.name 
                            ? '#FFFFFF' 
                            : '#A1A1AA',
                          borderColor: selectedCategory === category.name 
                            ? '#3B82F6' 
                            : 'rgba(161, 161, 170, 0.2)',
                          '&:hover': {
                            backgroundColor: selectedCategory === category.name 
                              ? '#2563eb' 
                              : 'rgba(255,255,255,0.06)',
                            color: selectedCategory === category.name 
                              ? '#FFFFFF' 
                              : '#F5F5F7',
                            borderColor: selectedCategory === category.name 
                              ? '#2563eb' 
                              : 'rgba(161, 161, 170, 0.3)',
                          },
                        }}
                      />
                      </MotionBox>
                    ))}
                </Stack>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Indicador de filtro activo compacto */}
        {selectedCategory !== 'Todas' && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            sx={{ 
              mb: 4,
              textAlign: 'center'
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: 2.5,
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <Typography 
                sx={{ 
                  color: '#3B82F6',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {selectedCategory}
              </Typography>
              <MotionBox
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  size="small"
                  onClick={() => setSelectedCategory('Todas')}
                  sx={{
                    color: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    width: 20,
                    height: 20,
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.2)'
                    }
                  }}
                >
                  <Close sx={{ fontSize: 12 }} />
                </IconButton>
              </MotionBox>
            </Box>
          </MotionBox>
        )}

        {/* Secciones del menú */}
        <AnimatePresence mode="wait">
          <Stack spacing={{ xs: 5, sm: 6 }}>
            {Object.entries(groupedProducts).map(([category, categoryProducts], index) => (
              <MenuSection
                key={`${category}-${selectedCategory}`}
                title={category}
                products={categoryProducts}
                index={index}
              />
            ))}
          </Stack>
        </AnimatePresence>

        {/* Footer premium compacto */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          sx={{ 
            mt: 12,
            pt: 6,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: 3,
              background: 'rgba(44, 44, 46, 0.3)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                sx={{ 
                  color: '#F5F5F7',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  mb: 1,
                  letterSpacing: '-0.01em'
                }}
              >
                Xs Reset
              </Typography>
              <Typography 
                sx={{ 
                  color: '#A1A1AA',
                  fontSize: '0.8rem',
                  fontWeight: 400,
                  mb: 3,
                  lineHeight: 1.6,
                  opacity: 0.8
                }}
              >
                Experiencia Digital Premium • Precios sujetos a cambios
              </Typography>
              
              <Box
                sx={{
                  width: 50,
                  height: 1,
                  background: 'linear-gradient(90deg, transparent 0%, #F59E0B 50%, transparent 100%)',
                  mx: 'auto'
                }}
              />
            </Box>
          </Box>
        </MotionBox>
      </MotionContainer>

      {/* Estilos para animación pulse */}
      <style jsx global>{`
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
    </Box>
  );
};

export default MenuViewer;