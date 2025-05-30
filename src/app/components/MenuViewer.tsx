'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  Chip,
  Fab,
} from '@mui/material';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
const MotionFab = motion(Fab);

const MenuViewer: React.FC<MenuViewerProps> = ({
  products,
  menuName = 'MenuQR',
  menuDescription = 'Experiencia gastronómica premium'
}) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showFilters, setShowFilters] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerY = useTransform(scrollY, [0, 100], [0, -100]);

  // Controlar visibilidad del header
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setHeaderVisible(latest < 100);
    });
    return unsubscribe;
  }, [scrollY]);

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
      position: 'relative'
    }}>
      {/* Capa de efectos de fondo - Completamente detrás */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -10,
          pointerEvents: 'none'
        }}
      >
        {/* Gradiente base con textura */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(116, 172, 223, 0.04) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)
            `
          }}
        />

        {/* Patrón de puntos animado */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0),
              radial-gradient(circle at 2px 2px, rgba(255,255,255,0.008) 1px, transparent 0)
            `,
            backgroundSize: '80px 80px, 160px 160px',
            backgroundPosition: '0 0, 40px 40px',
            animation: 'float 25s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { 
                transform: 'translate(0, 0)',
                opacity: 0.3
              },
              '33%': { 
                transform: 'translate(15px, -10px)',
                opacity: 0.5
              },
              '66%': { 
                transform: 'translate(-8px, 8px)',
                opacity: 0.4
              }
            }
          }}
        />

        {/* Orbes flotantes */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(116, 172, 223, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'orbit1 30s linear infinite',
            '@keyframes orbit1': {
              '0%': { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.3
              },
              '25%': { 
                transform: 'translate(100px, -50px) scale(1.2)',
                opacity: 0.5
              },
              '50%': { 
                transform: 'translate(50px, 80px) scale(0.8)',
                opacity: 0.4
              },
              '75%': { 
                transform: 'translate(-60px, 20px) scale(1.1)',
                opacity: 0.6
              },
              '100%': { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.3
              }
            }
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'orbit2 35s linear infinite reverse',
            '@keyframes orbit2': {
              '0%': { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.25
              },
              '33%': { 
                transform: 'translate(-80px, 40px) scale(1.3)',
                opacity: 0.4
              },
              '66%': { 
                transform: 'translate(60px, -50px) scale(0.7)',
                opacity: 0.3
              },
              '100%': { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.25
              }
            }
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '15%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'orbit3 40s ease-in-out infinite',
            '@keyframes orbit3': {
              '0%, 100%': { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.2
              },
              '50%': { 
                transform: 'translate(120px, -80px) scale(1.4)',
                opacity: 0.4
              }
            }
          }}
        />

        {/* Líneas geométricas sutiles */}
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '0%',
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(116, 172, 223, 0.08) 50%, transparent 100%)',
            animation: 'slide 20s ease-in-out infinite',
            '@keyframes slide': {
              '0%, 100%': { 
                transform: 'translateX(-100%)',
                opacity: 0
              },
              '50%': { 
                transform: 'translateX(0%)',
                opacity: 1
              }
            }
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '75%',
            right: '0%',
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.06) 50%, transparent 100%)',
            animation: 'slide2 25s ease-in-out infinite reverse',
            '@keyframes slide2': {
              '0%, 100%': { 
                transform: 'translateX(100%)',
                opacity: 0
              },
              '50%': { 
                transform: 'translateX(0%)',
                opacity: 1
              }
            }
          }}
        />
      </Box>

      {/* Header integrado con fondo - Sin barra inferior */}
      <MotionBox
        style={{
          opacity: headerOpacity,
          y: headerY,
        }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(180deg, rgba(28, 28, 30, 0.8) 0%, rgba(28, 28, 30, 0.4) 70%, transparent 100%)',
          backdropFilter: 'blur(20px)',
          pt: 2,
          pb: 4,
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            {/* Sección izquierda */}
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
              {/* Botón de regreso */}
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
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      color: '#F5F5F7',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <ArrowBack fontSize="small" />
                </IconButton>
              </MotionBox>

              {/* Branding */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, rgba(116, 172, 223, 0.2) 0%, rgba(116, 172, 223, 0.1) 100%)',
                    border: '1px solid rgba(116, 172, 223, 0.3)',
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

            {/* Sección derecha */}
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
              {/* Hora actual */}
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

              {/* Estado abierto */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
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
          </Box>
        </Container>
      </MotionBox>

      {/* Botón flotante de filtros */}
      <AnimatePresence>
        {!headerVisible && (
          <MotionFab
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 1100,
              width: 56,
              height: 56,
              background: showFilters 
                ? 'linear-gradient(135deg, rgba(116, 172, 223, 0.9) 0%, rgba(116, 172, 223, 0.7) 100%)'
                : 'linear-gradient(135deg, rgba(44, 44, 46, 0.9) 0%, rgba(28, 28, 30, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: `2px solid ${showFilters ? 'rgba(116, 172, 223, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
              boxShadow: showFilters 
                ? '0 8px 32px rgba(116, 172, 223, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                background: showFilters 
                  ? 'linear-gradient(135deg, rgba(116, 172, 223, 1) 0%, rgba(116, 172, 223, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(44, 44, 46, 1) 0%, rgba(28, 28, 30, 0.9) 100%)',
                boxShadow: showFilters 
                  ? '0 12px 40px rgba(116, 172, 223, 0.4)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.4)',
              }
            }}
          >
            <MotionBox
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showFilters ? (
                <Close sx={{ color: '#FFFFFF', fontSize: 24 }} />
              ) : (
                <FilterList sx={{ color: '#74ACDF', fontSize: 24 }} />
              )}
            </MotionBox>
          </MotionFab>
        )}
      </AnimatePresence>

      {/* Panel de filtros desplegable desde la burbuja */}
      <AnimatePresence>
        {showFilters && !headerVisible && (
          <MotionBox
            initial={{ opacity: 0, scale: 0, x: 300, y: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0, x: 300, y: -50 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            sx={{
              position: 'fixed',
              top: 90,
              right: 20,
              zIndex: 1050,
              width: { xs: 'calc(100vw - 40px)', sm: 400 },
              maxWidth: 400,
              background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.95) 0%, rgba(28, 28, 30, 0.9) 100%)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(116, 172, 223, 0.2)',
              borderRadius: 3,
              p: 3,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              transformOrigin: 'top right'
            }}
          >
            {/* Header del panel */}
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
                  fontSize: '1rem',
                  letterSpacing: '-0.01em'
                }}
              >
                Filtrar Menú
              </Typography>
              
              <Typography
                sx={{
                  color: '#74ACDF',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  backgroundColor: 'rgba(116, 172, 223, 0.15)',
                  borderRadius: 2,
                  border: '1px solid rgba(116, 172, 223, 0.3)'
                }}
              >
                {filteredProducts.length} productos
              </Typography>
            </Box>
            
            {/* Chips de categorías */}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      minHeight: 36,
                      borderRadius: 2.5,
                      fontWeight: selectedCategory === category.name ? 600 : 500,
                      fontSize: '0.8rem',
                      px: 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      backgroundColor: selectedCategory === category.name 
                        ? '#74ACDF' 
                        : 'rgba(255, 255, 255, 0.03)',
                      color: selectedCategory === category.name 
                        ? '#FFFFFF' 
                        : '#A1A1AA',
                      borderColor: selectedCategory === category.name 
                        ? '#74ACDF' 
                        : 'rgba(161, 161, 170, 0.2)',
                      '&:hover': {
                        backgroundColor: selectedCategory === category.name 
                          ? '#5a9bd4' 
                          : 'rgba(255,255,255,0.08)',
                        color: selectedCategory === category.name 
                          ? '#FFFFFF' 
                          : '#F5F5F7',
                        borderColor: selectedCategory === category.name 
                          ? '#5a9bd4' 
                          : 'rgba(161, 161, 170, 0.4)',
                      },
                    }}
                  />
                </MotionBox>
              ))}
            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Contenido principal con espaciado corregido */}
      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 16, sm: 18 }, // Aumentado significativamente para móviles
          pb: 8,
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero section con espaciado mejorado */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 6, sm: 7 } }}
        >
          <Typography 
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              color: '#F5F5F7',
              mb: 1.5,
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
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              fontWeight: 500,
              color: '#A1A1AA',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 2,
              opacity: 0.8
            }}
          >
            Bar & Lounge Experience
          </Typography>
          
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              fontWeight: 400,
              maxWidth: 350,
              mx: 'auto',
              lineHeight: 1.5,
              mb: 3
            }}
          >
            {menuDescription}
          </Typography>

          <Box
            sx={{
              width: 60,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #74ACDF 50%, transparent 100%)',
              mx: 'auto'
            }}
          />
        </MotionBox>

        {/* Sistema de filtros cuando el header está visible */}
        <AnimatePresence>
          {showFilters && headerVisible && (
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
                          minHeight: 32,
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

        {/* Indicador de filtro activo */}
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

      {/* Estilos para animaciones */}
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