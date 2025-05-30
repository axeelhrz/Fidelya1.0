'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  Divider
} from '@mui/material';
import { 
  Search, 
  Restaurant, 
  ArrowBack,
  Refresh,
  LocationOn,
  Phone,
  Schedule
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useFirebaseMenuById } from '../../hooks/useFirebaseMenu';
import { useFirebaseCategories } from '../../hooks/useFirebaseCategories';
import ProductCard from './ProductCard';

const MotionBox = motion(Box);

interface MenuViewerProps {
  menuId: string;
}

export default function MenuViewer({ menuId }: MenuViewerProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { menu, products, loading, error, connected } = useFirebaseMenuById(menuId);
  const { categories } = useFirebaseCategories(menuId, true);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => product.isAvailable);
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Agrupar productos por categoría
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: typeof products } = {};
    
    filteredProducts.forEach(product => {
      const category = product.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });

    return grouped;
  }, [filteredProducts]);

  // Obtener categorías únicas de los productos
  const availableCategories = useMemo(() => {
    const categorySet = new Set(products.map(p => p.category));
    return Array.from(categorySet);
  }, [products]);

  if (loading) {
  return (
      <Box sx={{ 
      minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0A',
        gap: 3
    }}>
        <CircularProgress size={40} sx={{ color: '#D4AF37' }} />
        <Typography sx={{ 
          color: '#B8B8B8', 
          fontSize: '0.9rem',
          fontWeight: 400,
          textAlign: 'center'
        }}>
          Cargando menú...
            </Typography>
                    </Box>
              );
  }

  if (error || !menu) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container sx={{ py: 4 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Error al cargar el menú
              </Typography>
              <Typography variant="body2">
                {error || 'Menú no encontrado'}
              </Typography>
            </Alert>
            
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => router.push('/menu')}
                sx={{ 
                  borderColor: '#D4AF37',
                  color: '#D4AF37'
                }}
              >
                Volver a menús
              </Button>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                sx={{
                  background: '#D4AF37',
                  color: '#0A0A0A'
                }}
              >
                Reintentar
              </Button>
    </Box>
          </MotionBox>
        </Container>
      </Box>
  );
}

    return (
    <Box sx={{ 
        minHeight: '100vh',
      background: '#0A0A0A',
      color: '#F8F8F8'
      }}>
      {/* Header elegante estilo Xs Reset */}
      <Box sx={{ 
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        py: { xs: 4, md: 6 }
    }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center' }}
          >
            {/* Logo/Nombre del restaurante */}
            <Typography 
              variant="h1" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: '#F8F8F8',
                letterSpacing: '0.05em',
                mb: 2
              }}
            >
              {menu.name}
            </Typography>
            
            {/* Tagline elegante */}
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '0.9rem', md: '1rem' },
                color: '#B8B8B8',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 400,
                mb: 4
              }}
            >
              {menu.description || 'Carta Digital Premium'}
            </Typography>

            {/* Información del restaurante */}
            {menu.restaurantInfo && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: { xs: 2, md: 4 }, 
                flexWrap: 'wrap',
                opacity: 0.8
              }}>
                {menu.restaurantInfo.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#D4AF37' }} />
                    <Typography variant="body2" sx={{ color: '#B8B8B8', fontSize: '0.8rem' }}>
                      {menu.restaurantInfo.address}
            </Typography>
                    </Box>
                )}
                {menu.restaurantInfo.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 16, color: '#D4AF37' }} />
                    <Typography variant="body2" sx={{ color: '#B8B8B8', fontSize: '0.8rem' }}>
                      {menu.restaurantInfo.phone}
                    </Typography>
                  </Box>
                )}
                {menu.restaurantInfo.hours && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule sx={{ fontSize: 16, color: '#D4AF37' }} />
                    <Typography variant="body2" sx={{ color: '#B8B8B8', fontSize: '0.8rem' }}>
                      {menu.restaurantInfo.hours}
                    </Typography>
                  </Box>
                )}
          </Box>
            )}
          </MotionBox>
      </Container>
    </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Barra de búsqueda minimalista */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{ mb: 4 }}
        >
          <TextField
            fullWidth
            placeholder="Buscar en la carta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#D4AF37', fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'rgba(26, 26, 26, 0.6)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 0,
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover': {
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  borderColor: 'rgba(212, 175, 55, 0.3)'
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(26, 26, 26, 0.9)',
                  borderColor: '#D4AF37'
                },
                color: '#F8F8F8',
                fontSize: '0.9rem'
}
            }}
            sx={{ maxWidth: 600, mx: 'auto', display: 'block' }}
          />
        </MotionBox>

        {/* Navegación de categorías elegante */}
        {availableCategories.length > 1 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            sx={{ mb: 6 }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: { xs: 1, md: 2 },
              flexWrap: 'wrap'
            }}>
              <Chip
                label="Todos"
                onClick={() => setSelectedCategory('all')}
                sx={{
                  backgroundColor: selectedCategory === 'all' ? '#D4AF37' : 'transparent',
                  color: selectedCategory === 'all' ? '#0A0A0A' : '#B8B8B8',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: selectedCategory === 'all' ? '#D4AF37' : 'rgba(212, 175, 55, 0.1)',
                    color: selectedCategory === 'all' ? '#0A0A0A' : '#D4AF37'
                  }
                }}
              />
              {availableCategories.map((category) => {
                const count = products.filter(p => p.category === category && p.isAvailable).length;
                return (
                  <Chip
                    key={category}
                    label={`${category} (${count})`}
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      backgroundColor: selectedCategory === category ? '#D4AF37' : 'transparent',
                      color: selectedCategory === category ? '#0A0A0A' : '#B8B8B8',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: 0,
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: selectedCategory === category ? '#D4AF37' : 'rgba(212, 175, 55, 0.1)',
                        color: selectedCategory === category ? '#0A0A0A' : '#D4AF37'
                      }
                    }}
                  />
                );
              })}
            </Box>
          </MotionBox>
        )}

        {/* Lista de productos */}
        {filteredProducts.length === 0 ? (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'center', py: 8 }}
          >
            <Restaurant sx={{ fontSize: 48, color: 'rgba(212, 175, 55, 0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#B8B8B8', mb: 1 }}>
              No se encontraron productos
            </Typography>
            <Typography variant="body2" sx={{ color: '#B8B8B8', opacity: 0.7 }}>
              {searchTerm 
                ? `No hay productos que coincidan con "${searchTerm}"`
                : 'No hay productos disponibles en esta categoría'
              }
            </Typography>
          </MotionBox>
        ) : selectedCategory === 'all' ? (
          // Mostrar por categorías cuando está en "Todos"
          <Box>
            {Object.entries(productsByCategory).map(([category, categoryProducts], index) => (
              <MotionBox
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                sx={{ mb: 6 }}
              >
                {/* Título de categoría elegante */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      color: '#D4AF37',
                      letterSpacing: '0.02em',
                      mb: 1
                    }}
                  >
                    {category}
                  </Typography>
                  <Divider sx={{ 
                    borderColor: 'rgba(212, 175, 55, 0.2)',
                    width: '60px'
                  }} />
                </Box>
                
                {/* Lista de productos */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <AnimatePresence>
                    {categoryProducts.map((product, productIndex) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: productIndex * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </MotionBox>
            ))}
          </Box>
        ) : (
          // Mostrar solo la categoría seleccionada
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  color: '#D4AF37',
                  letterSpacing: '0.02em',
                  mb: 1
                }}
              >
                {selectedCategory}
              </Typography>
              <Divider sx={{ 
                borderColor: 'rgba(212, 175, 55, 0.2)',
                width: '60px'
              }} />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}