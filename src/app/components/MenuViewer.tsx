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
  Close,
  AccessTime
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
      {/* Header Premium Compacto */}
      <AppBar 
        position="fixed" 
                elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.92)',
          backdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          zIndex: 1100,
              }}
              >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 60, sm: 64 }, // Más compacto
          position: 'relative'
        }}>
          {/* Sección izquierda compacta */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
            sx={{
              display: 'flex', 
              alignItems: 'center',
              gap: 2
            }}
            >
            {/* Botón de regreso minimalista */}
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton 
                onClick={() => router.push('/')}
                sx={{ 
                    color: '#A1A1AA',
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                color: '#F5F5F7',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.12)'
                  }
              }}
            >
                <ArrowBack fontSize="small" />
              </IconButton>
          </MotionBox>

            {/* Branding compacto */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Logo minimalista */}
        <Box
          sx={{
                  p: 1,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, rgba(116, 172, 223, 0.15) 0%, rgba(116, 172, 223, 0.08) 100%)',
                  border: '1px solid rgba(116, 172, 223, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
              }}
              >
                <Restaurant sx={{ 
                  color: '#74ACDF', 
                  fontSize: 18
                }} />
              </Box>
              
              {/* Información del bar */}
              <Box>
                <Typography 
                  sx={{ 
                    fontWeight: 700,
                    color: '#F5F5F7',
                    letterSpacing: '-0.02em',
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    lineHeight: 1
                  }}
                >
                  Xs Reset
              </Typography>
              
                <Typography
                sx={{
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    color: '#A1A1AA',
                    letterSpacing: '0.08em',
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

          {/* Sección derecha compacta */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98], delay: 0.1 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            {/* Hora actual compacta */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <AccessTime sx={{ fontSize: 14, color: '#A1A1AA' }} />
              <Typography
                sx={{ 
                  color: '#A1A1AA',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  fontFamily: 'monospace'
                }}
              >
                {new Date().toLocaleTimeString('es-AR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </Typography>
            </Box>

            {/* Botón de filtros compacto */}
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  color: showFilters ? '#74ACDF' : '#A1A1AA',
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: showFilters ? 'rgba(116, 172, 223, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${showFilters ? 'rgba(116, 172, 223, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                    color: '#74ACDF',
                    backgroundColor: 'rgba(116, 172, 223, 0.12)',
                    borderColor: 'rgba(116, 172, 223, 0.2)'
                  }
                        }}
              >
                {showFilters ? <Close fontSize="small" /> : <FilterList fontSize="small" />}
              </IconButton>
            </MotionBox>

            {/* Estado abierto compacto */}
            <Box
            sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.15)'
              }}
            >
              <Box
                sx={{ 
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)',
                  animation: 'pulse 2s infinite'
                }}
              />
              <Typography
                sx={{
                  color: '#10B981',
                  fontSize: '0.65rem',
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

        {/* Línea decorativa minimalista */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(116, 172, 223, 0.2) 50%, transparent 100%)',
            opacity: 0.6
          }}
        />
      </AppBar>

      {/* Contenido principal */}
      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 8, sm: 9 }, // Reducido para header más compacto
          pb: 8,
          px: { xs: 2, sm: 3 },
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero section ultra-compacto */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }} // Muy reducido
        >
          <Typography 
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.25rem' }, // Más pequeño
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              color: '#F5F5F7',
              mb: 1.5, // Reducido
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
              fontSize: { xs: '0.75rem', sm: '0.8rem' }, // Más pequeño
              fontWeight: 500,
              color: '#A1A1AA',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 2, // Reducido
              opacity: 0.8
            }}
          >
            Bar & Lounge Experience
          </Typography>
          
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: { xs: '0.85rem', sm: '0.9rem' }, // Más pequeño
              fontWeight: 400,
              maxWidth: 350, // Más estrecho
              mx: 'auto',
              lineHeight: 1.5,
              mb: 3 // Reducido
            }}
          >
            {menuDescription}
          </Typography>

          {/* Divisor minimalista */}
          <Box
            sx={{
              width: 60, // Más pequeño
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #74ACDF 50%, transparent 100%)',
              mx: 'auto'
            }}
          />
        </MotionBox>

        {/* Sistema de filtros compacto */}
        <AnimatePresence>
          {showFilters && (
            <MotionBox
              initial={{ opacity: 0, height: 0, y: -15 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              sx={{ mb: { xs: 4, sm: 5 } }}
            >
              <Box
                sx={{ 
                  p: { xs: 2.5, sm: 3 }, 
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(44, 44, 46, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Header ultra-compacto */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2.5
                }}>
                  <Typography 
                    sx={{ 
                      fontWeight: 600,
                      color: '#F5F5F7',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Filtrar
                  </Typography>
                  
                  <Typography
                    sx={{
                      color: '#74ACDF',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: 'rgba(116, 172, 223, 0.1)',
                      borderRadius: 1.5,
                      border: '1px solid rgba(116, 172, 223, 0.2)'
                    }}
                  >
                    {filteredProducts.length}
                  </Typography>
    </Box>
                
                {/* Chips horizontales compactos */}
                <Stack 
                  direction="row" 
                  spacing={1}
                  sx={{ 
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  {categories.map((category, index) => (
                    <MotionBox
                      key={category.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.03, 
                        duration: 0.2
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Chip
                        label={`${category.name} (${category.count})`}
                        onClick={() => setSelectedCategory(category.name)}
                        variant={selectedCategory === category.name ? 'filled' : 'outlined'}
                        sx={{
                          minHeight: 32, // Más compacto
                          borderRadius: 2,
                          fontWeight: selectedCategory === category.name ? 600 : 500,
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          px: 1.5,
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          backgroundColor: selectedCategory === category.name 
                            ? '#74ACDF' 
                            : 'rgba(255, 255, 255, 0.02)',
                          color: selectedCategory === category.name 
                            ? '#FFFFFF' 
                            : '#A1A1AA',
                          borderColor: selectedCategory === category.name 
                            ? '#74ACDF' 
                            : 'rgba(161, 161, 170, 0.2)',
                          '&:hover': {
                            backgroundColor: selectedCategory === category.name 
                              ? '#5a9bd4' 
                              : 'rgba(255,255,255,0.06)',
                            color: selectedCategory === category.name 
                              ? '#FFFFFF' 
                              : '#F5F5F7',
                            borderColor: selectedCategory === category.name 
                              ? '#5a9bd4' 
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

        {/* Indicador de filtro activo ultra-compacto */}
        {selectedCategory !== 'Todas' && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            sx={{ 
              mb: 3,
              textAlign: 'center'
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                backgroundColor: 'rgba(116, 172, 223, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(116, 172, 223, 0.2)'
              }}
            >
              <Typography 
                sx={{ 
                  color: '#74ACDF',
                  fontSize: '0.75rem',
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
                    color: '#74ACDF',
                    backgroundColor: 'rgba(116, 172, 223, 0.1)',
                    width: 18,
                    height: 18,
                    '&:hover': {
                      backgroundColor: 'rgba(116, 172, 223, 0.2)'
                    }
                  }}
                >
                  <Close sx={{ fontSize: 10 }} />
                </IconButton>
              </MotionBox>
            </Box>
          </MotionBox>
        )}

        {/* Secciones del menú */}
        <AnimatePresence mode="wait">
          <Stack spacing={{ xs: 4, sm: 5 }}>
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

        {/* Footer compacto */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          sx={{ 
            mt: 10,
            pt: 4,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 2.5,
              background: 'rgba(44, 44, 46, 0.3)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Typography 
              sx={{ 
                color: '#F5F5F7',
                fontSize: '0.85rem',
                fontWeight: 600,
                mb: 0.5,
                letterSpacing: '-0.01em'
              }}
            >
              Xs Reset
            </Typography>
            <Typography 
              sx={{ 
                color: '#A1A1AA',
                fontSize: '0.75rem',
                fontWeight: 400,
                mb: 2,
                lineHeight: 1.5,
                opacity: 0.8
              }}
            >
              Experiencia Digital Premium • Precios sujetos a cambios
            </Typography>
            
            <Box
              sx={{
                width: 40,
                height: 1,
                background: 'linear-gradient(90deg, transparent 0%, #74ACDF 50%, transparent 100%)',
                mx: 'auto'
              }}
            />
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