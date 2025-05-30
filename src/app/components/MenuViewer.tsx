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
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowBack, 
  Restaurant,
  FilterList,
  Close,
  AccessTime,
  Refresh,
  Home,
  Warning,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useFirebaseMenuById } from '../../hooks/useFirebaseMenu';
import { useFirebaseCategories } from '../../hooks/useFirebaseCategories';
import { Product, Category } from '../types';
import MenuSection from './MenuSection';

interface MenuViewerProps {
  menuId: string;
}

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionFab = motion(Fab);

const MenuViewer: React.FC<MenuViewerProps> = ({ menuId }) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showFilters, setShowFilters] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], [0, -100]);

  // Firebase hooks
  const { 
    menu, 
    products, 
    loading: menuLoading, 
    error: menuError, 
    connected: menuConnected 
  } = useFirebaseMenuById(menuId);

  const { 
    categories: firebaseCategories, 
    loading: categoriesLoading, 
    error: categoriesError,
    connected: categoriesConnected
  } = useFirebaseCategories(menuId);

  const loading = menuLoading || categoriesLoading;
  const error = menuError || categoriesError;
  const connected = menuConnected && categoriesConnected;

  // Habilitar scroll cuando se monta el componente
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.width = 'auto';
    document.body.style.height = 'auto';

    return () => {
      // Mantener scroll habilitado al desmontar
    };
  }, []);

  // Controlar visibilidad del header
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setHeaderVisible(latest < 100);
    });
    return unsubscribe;
  }, [scrollY]);

  // Auto-retry logic
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Obtener categorías únicas de productos y Firebase
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [{ name: 'Todas', count: 0 }];

    // Contar productos por categoría
    const categoryCount: Record<string, number> = {};
    products.forEach(p => {
      if (p.isAvailable) { // Solo contar productos disponibles
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
      }
    });

    // Crear lista de categorías con conteos
    const availableCategories = Object.keys(categoryCount).filter(cat => categoryCount[cat] > 0);
    
    const cats = [
      { name: 'Todas', count: products.filter(p => p.isAvailable).length },
      ...availableCategories.map(cat => ({
        name: cat,
        count: categoryCount[cat] || 0
      }))
    ];

    return cats;
  }, [products]);

  // Filtrar productos por categoría y disponibilidad
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter(p => p.isAvailable); // Solo productos disponibles
    
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    return filtered;
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
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  };

  // Función para inicializar datos de ejemplo
  const initializeSampleData = async () => {
    try {
      const response = await fetch('/api/database/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Error initializing data');
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3
      }}>
        <CircularProgress 
          size={60} 
          sx={{ 
            color: '#D4AF37',
            mb: 3,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: "'Inter', sans-serif",
            color: '#F8F8F8',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            mb: 1,
            fontWeight: 600
          }}
        >
          Cargando Carta Digital...
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: "'Inter', sans-serif",
            color: '#B8B8B8',
            textAlign: 'center',
            opacity: 0.8,
            fontStyle: 'italic'
          }}
        >
          {connected ? 'Conectado a Firebase' : 'Conectando con Firebase...'}
        </Typography>
      </Box>
    );
  }

  // Error state mejorado
  if (error || !menu) {
    const isMenuNotFound = !menu && !loading;
    const isConnectionError = error && !connected;
    
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3
      }}>
        <Container maxWidth="sm">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert 
              severity={isConnectionError ? "warning" : "error"}
              sx={{ 
                borderRadius: 0,
                backgroundColor: isConnectionError 
                  ? 'rgba(255, 152, 0, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                border: isConnectionError 
                  ? '1px solid rgba(255, 152, 0, 0.3)' 
                  : '1px solid rgba(239, 68, 68, 0.3)',
                color: isConnectionError ? '#FFB74D' : '#F87171',
                fontFamily: "'Inter', sans-serif",
                '& .MuiAlert-icon': {
                  color: isConnectionError ? '#FFB74D' : '#F87171'
                },
                mb: 3
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600
                }}
              >
                {isConnectionError 
                  ? 'Problema de Conexión' 
                  : isMenuNotFound 
                    ? 'Menú no encontrado'
                    : 'Error al cargar el menú'
                }
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8,
                  fontFamily: "'Inter', sans-serif",
                  mb: 2
                }}
              >
                {isConnectionError 
                  ? 'No se puede conectar con la base de datos. Verificando conexión...'
                  : isMenuNotFound 
                    ? `No se encontró un menú con el ID: ${menuId}`
                    : 'Ocurrió un error al cargar la información del menú.'
                }
              </Typography>
              
              {retryCount > 0 && retryCount < 3 && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.6,
                    fontFamily: "'Inter', sans-serif",
                    fontStyle: 'italic'
                  }}
                >
                  Reintentando automáticamente... ({retryCount}/3)
                </Typography>
              )}
            </Alert>
            
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={() => router.push('/')}
                sx={{
                  color: '#B8B8B8',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                  '&:hover': {
                    color: '#D4AF37',
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  }
                }}
              >
                Ir al Inicio
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  setRetryCount(0);
                  window.location.reload();
                }}
                sx={{
                  color: '#B8B8B8',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                  '&:hover': {
                    color: '#D4AF37',
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  }
                }}
              >
                Reintentar
              </Button>

              {isMenuNotFound && (
                <Button
                  variant="contained"
                  startIcon={<Restaurant />}
                  onClick={initializeSampleData}
                  sx={{
                    backgroundColor: '#D4AF37',
                    color: '#0A0A0A',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: '#F4E4BC'
                    }
                  }}
                >
                  Crear Menú de Ejemplo
                </Button>
              )}
            </Stack>

            {/* Información adicional para debugging */}
            <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(26, 26, 26, 0.5)', borderRadius: 0 }}>
              <Typography variant="caption" sx={{ color: '#B8B8B8', fontFamily: "'Inter', sans-serif" }}>
                ID del menú: {menuId}<br/>
                Estado de conexión: {connected ? 'Conectado' : 'Desconectado'}<br/>
                Error: {error || 'Ninguno'}<br/>
                Reintentos: {retryCount}/3
              </Typography>
            </Box>
          </MotionBox>
        </Container>
      </Box>
    );
  }

  // ... resto del componente permanece igual
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      position: 'relative',
      overflow: 'visible'
    }}>
      {/* Fondo elegante minimalista */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.02) 0%, transparent 50%),
            linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(16, 16, 16, 1) 100%)
          `
        }}
      />

      {/* Header elegante */}
      <MotionBox
        style={{ y: headerY }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.8) 70%, transparent 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
          pt: 2,
          pb: 4,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3
          }}>
            {/* Sección izquierda */}
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
              {/* Botón de regreso */}
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton 
                  onClick={() => router.push('/')}
                  sx={{ 
                    color: '#B8B8B8',
                    p: 1.5,
                    borderRadius: 0,
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      color: '#D4AF37',
                      borderColor: 'rgba(212, 175, 55, 0.5)',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)'
                    }
                  }}
                >
                  <ArrowBack fontSize="small" />
                </IconButton>
              </MotionBox>

              {/* Branding elegante */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 0,
                    border: '2px solid #D4AF37',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Restaurant sx={{ 
                    color: '#D4AF37', 
                    fontSize: 20
                  }} />
                </Box>
                <Box>
                  <Typography 
                    sx={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      color: '#F8F8F8',
                      letterSpacing: '0.02em',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      lineHeight: 1
                    }}
                  >
                    {menu.restaurantInfo?.name || menu.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#B8B8B8',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      opacity: 0.8,
                      lineHeight: 1,
                      mt: 0.5
                    }}
                  >
                    Carta Digital
                  </Typography>
                </Box>
              </Box>
            </MotionBox>

            {/* Sección derecha */}
            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98], delay: 0.1 }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {/* Hora actual */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ fontSize: 16, color: '#B8B8B8' }} />
                <Typography
                  sx={{
                    color: '#B8B8B8',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {new Date().toLocaleTimeString('es-AR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </Typography>
              </Box>

              {/* Estado de conexión */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 0,
                  border: `1px solid ${connected ? '#D4AF37' : '#F87171'}`,
                  backgroundColor: `rgba(${connected ? '212, 175, 55' : '248, 113, 113'}, 0.1)`
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: connected ? '#D4AF37' : '#F87171',
                    boxShadow: `0 0 8px rgba(${connected ? '212, 175, 55' : '248, 113, 113'}, 0.6)`,
                    animation: connected ? 'pulse 2s infinite' : 'none'
                  }}
                />
                <Typography
                  sx={{
                    color: connected ? '#D4AF37' : '#F87171',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {connected ? 'Conectado' : 'Desconectado'}
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
                ? 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)'
                : 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(16, 16, 16, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: `2px solid ${showFilters ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)'}`,
              borderRadius: 0,
              boxShadow: showFilters 
                ? '0 8px 32px rgba(212, 175, 55, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.4)',
              '&:hover': {
                background: showFilters 
                  ? 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 100%)'
                  : 'linear-gradient(135deg, rgba(26, 26, 26, 1) 0%, rgba(16, 16, 16, 1) 100%)',
                boxShadow: showFilters 
                  ? '0 12px 40px rgba(212, 175, 55, 0.4)' 
                  : '0 12px 40px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            <MotionBox
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showFilters ? (
                <Close sx={{ color: showFilters ? '#0A0A0A' : '#D4AF37', fontSize: 24 }} />
              ) : (
                <FilterList sx={{ color: '#D4AF37', fontSize: 24 }} />
              )}
            </MotionBox>
          </MotionFab>
        )}
      </AnimatePresence>

      {/* Panel de filtros */}
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
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(16, 16, 16, 0.95) 100%)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 0,
              p: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              transformOrigin: 'top right'
            }}
          >
            {/* Header del panel */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 4,
              pb: 2,
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <Typography 
                sx={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: '#F8F8F8',
                  fontSize: '1.25rem',
                  letterSpacing: '0.02em'
                }}
              >
                Filtrar Menú
              </Typography>
              <Typography
                sx={{
                  color: '#D4AF37',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {filteredProducts.length} productos
              </Typography>
            </Box>

            {/* Chips de categorías */}
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
                      minHeight: 40,
                      borderRadius: 0,
                      fontWeight: selectedCategory === category.name ? 600 : 500,
                      fontSize: '0.875rem',
                      px: 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      backgroundColor: selectedCategory === category.name 
                        ? '#D4AF37' 
                        : 'rgba(255, 255, 255, 0.05)',
                      color: selectedCategory === category.name 
                        ? '#0A0A0A' 
                        : '#B8B8B8',
                      borderColor: selectedCategory === category.name 
                        ? '#D4AF37' 
                        : 'rgba(212, 175, 55, 0.3)',
                      '&:hover': {
                        backgroundColor: selectedCategory === category.name 
                          ? '#F4E4BC' 
                          : 'rgba(212, 175, 55, 0.1)',
                        color: selectedCategory === category.name 
                          ? '#0A0A0A' 
                          : '#F8F8F8',
                        borderColor: selectedCategory === category.name 
                          ? '#F4E4BC' 
                          : 'rgba(212, 175, 55, 0.5)',
                      },
                    }}
                  />
                </MotionBox>
              ))}
            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Contenido principal con scroll habilitado */}
      <MotionContainer 
        maxWidth="lg" 
        sx={{ 
          pt: { xs: 20, sm: 24 },
          pb: 10,
          px: { xs: 3, sm: 4 },
          position: 'relative',
          zIndex: 1
        }}



        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero section elegante */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 10, sm: 12 } }}
        >
          {/* Ornamento superior */}
          <Box
            sx={{
              width: 80,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
              mx: 'auto',
              mb: 4
            }}
          />
          <Typography 
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
              fontWeight: 700,
              letterSpacing: '0.02em',
              lineHeight: 0.9,
              color: '#F8F8F8',
              mb: 2
            }}
          >
            {menu.restaurantInfo?.name || menu.name}
          </Typography>
          <Typography 
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              color: '#D4AF37',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              mb: 4,
              opacity: 0.9
            }}
          >
            Carta Digital
          </Typography>
          <Typography 
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              color: '#B8B8B8',
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 400,
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4,
              fontStyle: 'italic'
            }}
          >
            {menu.description}
          </Typography>
          {/* Ornamento inferior */}
          <Box
            sx={{
              width: 120,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
              mx: 'auto',
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
                background: '#D4AF37',
                boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
              }
            }}
          />
        </MotionBox>

        {/* Sistema de filtros cuando el header está visible */}
        <AnimatePresence>
          {showFilters && headerVisible && (
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
                  borderRadius: 0,
                  backgroundColor: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3
                }}>
                  <Typography 
                    sx={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: '#F8F8F8',
                      fontSize: { xs: '1.125rem', sm: '1.25rem' },
                      letterSpacing: '0.02em'
                    }}
                  >
                    Filtrar Menú
                  </Typography>
                  <Typography
                    sx={{
                      color: '#D4AF37',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      px: 2,
                      py: 0.75,
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: 0,
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {filteredProducts.length}
                  </Typography>
                </Box>
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
                          minHeight: 36,
                          borderRadius: 0,
                          fontWeight: selectedCategory === category.name ? 600 : 500,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          px: 2,
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          fontFamily: "'Inter', sans-serif",
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          backgroundColor: selectedCategory === category.name 
                            ? '#D4AF37' 
                            : 'rgba(255, 255, 255, 0.03)',
                          color: selectedCategory === category.name 
                            ? '#0A0A0A' 
                            : '#B8B8B8',
                          borderColor: selectedCategory === category.name 
                            ? '#D4AF37' 
                            : 'rgba(212, 175, 55, 0.3)',
                          '&:hover': {
                            backgroundColor: selectedCategory === category.name 
                              ? '#F4E4BC' 
                              : 'rgba(212, 175, 55, 0.1)',
                            color: selectedCategory === category.name 
                              ? '#0A0A0A' 
                              : '#F8F8F8',
                            borderColor: selectedCategory === category.name 
                              ? '#F4E4BC' 
                              : 'rgba(212, 175, 55, 0.5)',
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
              mb: 6,
              textAlign: 'center'
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 3,
                py: 1.5,
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 0
              }}
            >
              <Typography 
                sx={{ 
                  color: '#D4AF37',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
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
                    color: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    width: 20,
                    height: 20,
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(212, 175, 55, 0.2)'
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
          <Stack spacing={{ xs: 6, sm: 8 }}>
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

        {/* Footer elegante */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          sx={{ 
            mt: 16,
            pt: 8,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 0,
              background: 'rgba(26, 26, 26, 0.4)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                color: '#F8F8F8',
                fontSize: '1.25rem',
                fontWeight: 600,
                mb: 1,
                letterSpacing: '0.02em'
              }}
            >
              {menu.restaurantInfo?.name || menu.name}
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                color: '#B8B8B8',
                fontSize: '0.875rem',
                fontWeight: 400,
                mb: 3,
                lineHeight: 1.6,
                opacity: 0.8
              }}
            >
              Carta Digital • Precios sujetos a cambios sin previo aviso
            </Typography>
            <Box
              sx={{
                width: 60,
                height: 1,
                background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
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
            transform: scale(1.05);
          }
        }
      `}</style>
    </Box>
  );
};

export default MenuViewer;