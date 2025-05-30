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
import { FilterList, Restaurant, ArrowBack } from '@mui/icons-material';
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
  menuDescription = 'Escanea, explora y ordena con un simple toque'
}) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];
    return cats;
  }, [products]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todas') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);
  // Group products by category
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
      {/* Minimalist fixed header */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(58, 58, 60, 0.2)',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 64, sm: 72 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => router.push('/')}
              sx={{ 
                color: '#A1A1AA',
                p: 1,
                '&:hover': { 
                  color: '#F5F5F7',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)'
                }
              }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#F5F5F7',
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              {menuName}
          </Typography>
          </Box>

          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              color: showFilters ? '#3B82F6' : '#A1A1AA',
              p: 1,
              '&:hover': {
              color: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.04)'
              }
            }}
          >
            <FilterList fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 10, sm: 12 },
          pb: 8,
          px: { xs: 2, sm: 3 },
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Menu header */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}
        >
          <Typography 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              color: '#F5F5F7',
              mb: 3
            }}
          >
            {menuName}
          </Typography>
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 400,
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            {menuDescription}
          </Typography>
        </MotionBox>

        {/* Category filters */}
        <AnimatePresence>
          {showFilters && (
            <Fade in={showFilters}>
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                sx={{ mb: { xs: 6, sm: 8 } }}
              >
                <Paper sx={{ 
                  p: { xs: 3, sm: 4 }, 
                  borderRadius: 3,
                  backgroundColor: 'rgba(44, 44, 46, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: 'none',
                }}>
                  <Typography 
                    sx={{ 
                      mb: 3,
                      fontWeight: 600,
                      color: '#F5F5F7',
                      fontSize: { xs: '1.125rem', sm: '1.25rem' },
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Categorías
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={1.5}
                    sx={{ 
                      flexWrap: 'wrap',
                      gap: { xs: 1.5, sm: 2 },
                    }}
                  >
                    {categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? 'filled' : 'outlined'}
                        sx={{
                          minHeight: { xs: 40, sm: 44 },
                          borderRadius: 2,
                          fontWeight: selectedCategory === category ? 600 : 500,
                          fontSize: { xs: '0.875rem', sm: '0.9rem' },
                          px: { xs: 2, sm: 2.5 },
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          backgroundColor: selectedCategory === category 
                            ? '#3B82F6' 
                            : 'transparent',
                          color: selectedCategory === category 
                            ? '#FFFFFF' 
                            : '#A1A1AA',
                          borderColor: selectedCategory === category 
                            ? '#3B82F6' 
                            : 'rgba(161, 161, 170, 0.3)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            backgroundColor: selectedCategory === category 
                              ? '#2563eb' 
                              : 'rgba(255,255,255,0.04)',
                            color: selectedCategory === category 
                              ? '#FFFFFF' 
                              : '#F5F5F7',
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

        {/* Product count */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          sx={{ 
            mb: 6,
            textAlign: 'center'
          }}
        >
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            {selectedCategory !== 'Todas' && ` en ${selectedCategory}`}
          </Typography>
        </MotionBox>

        {/* Product sections */}
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

        {/* Footer */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          sx={{ 
            mt: 12,
            pt: 6,
            borderTop: '1px solid rgba(58, 58, 60, 0.2)',
            textAlign: 'center'
          }}
        >
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: '0.875rem',
              fontWeight: 400,
              mb: 1
            }}
          >
            Precios sujetos a cambios sin previo aviso
          </Typography>
          <Typography 
            sx={{ 
              color: '#3B82F6',
              fontSize: '0.8rem',
              fontWeight: 500
            }}
          >
            Actualizado • {new Date().toLocaleDateString('es-AR')}
          </Typography>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
};

export default MenuViewer;