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
} from '@mui/material';
import { motion } from 'framer-motion';
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
    },
  },
};

    return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1C1C1E' }}>
      {/* Encabezado fijo con nombre del bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #3A3A3C',
                            }}
                          >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: '#F5F5F7',
              letterSpacing: '0.05em',
            }}
                                >
            {menuName}
                                </Typography>
        </Toolbar>
      </AppBar>

      {/* Contenido principal con padding p: 3 */}
      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: 12, // Espacio para AppBar fijo
          pb: 4,
          px: 3, // Padding p: 3
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
                                >
        {/* Header del Menú */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography 
            variant="h3"
            fontWeight={700}
            sx={{ 
              mb: 2,
              background: 'linear-gradient(135deg, #3B82F6 0%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {menuName}
                                </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#A1A1AA',
              fontSize: '1rem',
            }}
          >
            {menuDescription}
          </Typography>
          </MotionBox>

        {/* Filtros de Categoría optimizados para mobile */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{ mb: 6 }}
        >
          <Paper sx={{ 
            p: 3, 
            borderRadius: 4,
            backgroundColor: '#2C2C2E',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: '#F5F5F7',
              }}
            >
              Categorías
            </Typography>
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                gap: 2.5, // gap: 2.5
                flexWrap: 'wrap',
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
                    minHeight: 48, // Botones táctiles grandes
                    borderRadius: 3, // borderRadius: 12px
                    fontWeight: selectedCategory === category ? 600 : 500,
                    fontSize: '0.9rem',
                    px: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      backgroundColor: selectedCategory === category 
                        ? 'primary.dark' 
                        : 'rgba(255,255,255,0.04)',
                    },
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </MotionBox>

        {/* Lista de Productos por Categoría usando Stack */}
        <Stack spacing={6}>
          {Object.entries(groupedProducts).map(([category, categoryProducts], index) => (
            <MenuSection
              key={category}
              title={category}
              products={categoryProducts}
              index={index}
            />
          ))}
        </Stack>
      </MotionContainer>
    </Box>
  );
};

export default MenuViewer;