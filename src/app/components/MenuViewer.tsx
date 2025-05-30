'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Fab,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  Search, 
  Restaurant, 
  ExpandMore,
  ExpandLess,
  NoMeals
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebaseMenuById } from '../../hooks/useFirebaseMenu';
import { useFirebaseCategories } from '../../hooks/useFirebaseCategories';
import ProductCard from './ProductCard';

const MotionBox = motion(Box);

interface MenuViewerProps {
  menuId: string;
}

export default function MenuViewer({ menuId }: MenuViewerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

  const { menu, products, loading, error, connected } = useFirebaseMenuById(menuId);
  const { categories } = useFirebaseCategories(menuId, true);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por disponibilidad
    if (showOnlyAvailable) {
      filtered = filtered.filter(product => product.isAvailable);
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm, showOnlyAvailable]);

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

  const getCategoryInfo = (categoryKey: string) => {
    const category = categories.find(c => c.name === categoryKey);
    return {
      name: category?.name || categoryKey,
      icon: category?.icon || '🍽️',
      description: category?.description
    };
  };

  const ConnectionStatus = () => {
    if (!connected && !loading) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Sin conexión en tiempo real. Los datos pueden no estar actualizados.
        </Alert>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        gap: 3
      }}>
        <CircularProgress size={60} sx={{ color: '#D4AF37' }} />
        <Typography sx={{ 
          color: '#B8B8B8', 
          fontSize: '1.125rem',
          fontWeight: 500,
          textAlign: 'center'
        }}>
          Cargando menú...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Error al cargar el menú
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!menu) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">
          <Typography variant="h6" gutterBottom>
            Menú no encontrado
          </Typography>
          <Typography variant="body2">
            El menú solicitado no existe o no está disponible.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
      color: 'white'
    }}>
      <ConnectionStatus />
      
      {/* Header del menú */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
        py: 6,
        textAlign: 'center'
      }}>
        <Container>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              fontWeight: 700,
              color: '#0A0A0A',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {menu.name}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#2C2C2E',
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400
            }}>
              {menu.description}
            </Typography>
            
            {menu.restaurantInfo && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                {menu.restaurantInfo.address && (
                  <Typography variant="body2" sx={{ color: '#2C2C2E' }}>
                    📍 {menu.restaurantInfo.address}
                  </Typography>
                )}
                {menu.restaurantInfo.phone && (
                  <Typography variant="body2" sx={{ color: '#2C2C2E' }}>
                    📞 {menu.restaurantInfo.phone}
                  </Typography>
                )}
                {menu.restaurantInfo.hours && (
                  <Typography variant="body2" sx={{ color: '#2C2C2E' }}>
                    🕒 {menu.restaurantInfo.hours}
                  </Typography>
                )}
              </Box>
            )}
          </MotionBox>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* Barra de búsqueda y filtros */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{ mb: 4 }}
        >
          <Box display="flex" gap={2} mb={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#D4AF37' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D4AF37',
                  },
                  color: 'white'
                }
              }}
            />
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{ 
                color: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                }
              }}
            >
              {showFilters ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showFilters}>
            <Box sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              p: 2,
              mb: 2
            }}>
              <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                <Chip
                  label="Solo disponibles"
                  onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                  color={showOnlyAvailable ? 'primary' : 'default'}
                  variant={showOnlyAvailable ? 'filled' : 'outlined'}
                  icon={<Restaurant />}
                />
              </Box>
            </Box>
          </Collapse>
        </MotionBox>

        {/* Tabs de categorías */}
        {availableCategories.length > 1 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            sx={{ mb: 4 }}
          >
            <Tabs
              value={selectedCategory}
              onChange={(e, newValue) => setSelectedCategory(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    color: '#D4AF37',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#D4AF37',
                }
              }}
            >
              <Tab 
                label="Todos" 
                value="all" 
                icon="🍽️"
                iconPosition="start"
              />
              {availableCategories.map((category) => {
                const categoryInfo = getCategoryInfo(category);
                const count = products.filter(p => p.category === category && (!showOnlyAvailable || p.isAvailable)).length;
                return (
                  <Tab
                    key={category}
                    label={`${categoryInfo.name} (${count})`}
                    value={category}
                    icon={categoryInfo.icon}
                    iconPosition="start"
                  />
                );
              })}
            </Tabs>
          </MotionBox>
        )}

        {/* Productos */}
        {filteredProducts.length === 0 ? (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'center', py: 8 }}
          >
            <NoMeals sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron productos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm 
                ? `No hay productos que coincidan con "${searchTerm}"`
                : 'No hay productos disponibles en esta categoría'
              }
            </Typography>
          </MotionBox>
        ) : selectedCategory === 'all' ? (
          // Mostrar por categorías cuando está en "Todos"
          <Box>
            {Object.entries(productsByCategory).map(([category, categoryProducts], index) => {
              const categoryInfo = getCategoryInfo(category);
              return (
                <MotionBox
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  sx={{ mb: 6 }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Typography variant="h4">
                      {categoryInfo.icon}
                    </Typography>
                    <Box>
                      <Typography variant="h5" sx={{ color: '#D4AF37', fontWeight: 600 }}>
                        {categoryInfo.name}
                      </Typography>
                      {categoryInfo.description && (
                        <Typography variant="body2" color="text.secondary">
                          {categoryInfo.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box display="grid" gridTemplateColumns={{
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  }} gap={3}>
                    <AnimatePresence>
                      {categoryProducts.map((product, productIndex) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: productIndex * 0.05 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Box>
                </MotionBox>
              );
            })}
          </Box>
        ) : (
          // Mostrar solo la categoría seleccionada
          <Box display="grid" gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          }} gap={3}>
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        )}

        {/* Indicador de tiempo real */}
        {connected && (
          <Fab
            size="small"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 1)',
              }
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'white',
                animation: 'pulse 2s infinite'
              }}
            />
          </Fab>
        )}
      </Container>

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
}
