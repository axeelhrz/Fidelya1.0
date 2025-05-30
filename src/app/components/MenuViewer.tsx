'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Fade,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterList, Restaurant } from '@mui/icons-material';
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
  menuName = 'XSreset',
  menuDescription = 'Experiencia nocturna premium'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showFilters, setShowFilters] = useState(false);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];
    return cats;
  }, [products]);

  // Filtrar productos por categoría
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todas') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);
  // Agrupar productos por categoría
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
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1C1C1E' }}>
      {/* Header fijo con glassmorphism */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(58, 58, 60, 0.3)',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Restaurant sx={{ color: '#3B82F6', fontSize: 24 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#F5F5F7',
                letterSpacing: '0.02em',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {menuName}
          </Typography>
    </Box>
          
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              color: '#3B82F6',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                transform: 'scale(1.05)'
}
            }}
          >
            <FilterList />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <MotionContainer 
        maxWidth="lg" 
        sx={{ 
          pt: { xs: 10, sm: 12 },
          pb: 6,
          px: { xs: 2, sm: 3 },
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header del Menú */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}
        >
          <Typography 
            variant="h3"
            sx={{ 
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {menuName}
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#A1A1AA',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            {menuDescription}
          </Typography>
        </MotionBox>

        {/* Filtros de Categoría */}
        <AnimatePresence>
          {(showFilters || categories.length <= 6) && (
            <Fade in={showFilters || categories.length <= 6}>
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                sx={{ mb: { xs: 4, sm: 6 } }}
              >
                <Paper sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(44, 44, 46, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0px 6px 18px rgba(0,0,0,0.12)',
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      color: '#F5F5F7',
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Categorías
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={1.5}
                    sx={{ 
                      flexWrap: 'wrap',
                      gap: { xs: 1, sm: 1.5 },
                    }}
                  >
                    {categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? 'filled' : 'outlined'}
                        color={selectedCategory === category ? 'primary' : 'default'}
                        sx={{
                          minHeight: { xs: 40, sm: 48 },
                          borderRadius: 3,
                          fontWeight: selectedCategory === category ? 600 : 500,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          px: { xs: 1.5, sm: 2 },
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            backgroundColor: selectedCategory === category 
                              ? 'primary.dark' 
                              : 'rgba(255,255,255,0.08)',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </MotionBox>
            </Fade>
          )}
        </AnimatePresence>

        {/* Contador de productos */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          sx={{ 
            mb: 4,
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#A1A1AA',
              fontSize: '0.875rem'
            }}
          >
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            {selectedCategory !== 'Todas' && ` en ${selectedCategory}`}
          </Typography>
        </MotionBox>

        {/* Lista de Productos por Categoría */}
        <AnimatePresence mode="wait">
          <Stack spacing={{ xs: 4, sm: 6 }}>
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

        {/* Footer del menú */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          sx={{ 
            mt: 8,
            pt: 4,
            borderTop: '1px solid rgba(58, 58, 60, 0.3)',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#A1A1AA',
              fontSize: '0.875rem',
              mb: 1
            }}
          >
            Precios sujetos a cambios sin previo aviso
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#3B82F6',
              fontSize: '0.8rem',
              fontWeight: 500
            }}
          >
            Menú actualizado • {new Date().toLocaleDateString('es-AR')}
          </Typography>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
};

export default MenuViewer;