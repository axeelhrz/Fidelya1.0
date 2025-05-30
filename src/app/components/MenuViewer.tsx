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
  Badge,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FilterList, 
  Restaurant, 
  ArrowBack, 
  Star,
  TrendingUp,
  LocalOffer
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
const MotionPaper = motion(Paper);

const MenuViewer: React.FC<MenuViewerProps> = ({
  products,
  menuName = 'MenuQR',
  menuDescription = 'Escanea, explora y ordena con un simple toque'
}) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories with counts
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

  // Statistics
  const stats = useMemo(() => {
    const recommended = products.filter(p => p.isRecommended).length;
    const newItems = products.filter(p => p.isNew).length;
    const vegetarian = products.filter(p => p.isVegetarian).length;
    
    return { recommended, newItems, vegetarian };
  }, [products]);

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
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1C1C1E' }}>
      {/* Ultra-modern fixed header */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 68, sm: 76 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
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
                  '&:hover': { 
                    color: '#F5F5F7',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)'
                  }
                }}
              >
                <ArrowBack fontSize="small" />
              </IconButton>
            </MotionBox>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Restaurant sx={{ color: '#3B82F6', fontSize: 24 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#F5F5F7',
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.125rem', sm: '1.25rem' }
                }}
              >
                {menuName}
              </Typography>
            </Box>
          </Box>
          
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
                backgroundColor: showFilters ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                '&:hover': {
                  color: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }
              }}
            >
              <FilterList fontSize="small" />
            </IconButton>
          </MotionBox>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <MotionContainer 
        maxWidth="lg" 
        sx={{ 
          pt: { xs: 11, sm: 13 },
          pb: 10,
          px: { xs: 2, sm: 3 },
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero section */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 8, sm: 10 } }}
        >
          <Typography 
            sx={{ 
              fontSize: { xs: '2.75rem', sm: '4rem', md: '4.5rem' },
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 0.85,
              color: '#F5F5F7',
              mb: 3,
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {menuName}
          </Typography>
          
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              fontWeight: 400,
              maxWidth: 520,
              mx: 'auto',
              lineHeight: 1.5,
              mb: 4
            }}
          >
            {menuDescription}
          </Typography>

          {/* Statistics cards */}
          <MotionBox
            variants={statsVariants}
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3 },
              flexWrap: 'wrap'
            }}
          >
            {stats.recommended > 0 && (
              <MotionPaper
                whileHover={{ y: -2, scale: 1.02 }}
                elevation={0}
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: 120
                }}
              >
                <Star sx={{ color: '#10B981', fontSize: 20 }} />
                <Box>
                  <Typography sx={{ color: '#10B981', fontWeight: 700, fontSize: '1.125rem' }}>
                    {stats.recommended}
                  </Typography>
                  <Typography sx={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 500 }}>
                    Recomendados
                  </Typography>
                </Box>
              </MotionPaper>
            )}

            {stats.newItems > 0 && (
              <MotionPaper
                whileHover={{ y: -2, scale: 1.02 }}
                elevation={0}
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: 120
                }}
              >
                <TrendingUp sx={{ color: '#3B82F6', fontSize: 20 }} />
                <Box>
                  <Typography sx={{ color: '#3B82F6', fontWeight: 700, fontSize: '1.125rem' }}>
                    {stats.newItems}
                  </Typography>
                  <Typography sx={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 500 }}>
                    Nuevos
                  </Typography>
                </Box>
              </MotionPaper>
            )}

            {stats.vegetarian > 0 && (
              <MotionPaper
                whileHover={{ y: -2, scale: 1.02 }}
                elevation={0}
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: 120
                }}
              >
                <LocalOffer sx={{ color: '#F59E0B', fontSize: 20 }} />
                <Box>
                  <Typography sx={{ color: '#F59E0B', fontWeight: 700, fontSize: '1.125rem' }}>
                    {stats.vegetarian}
                  </Typography>
                  <Typography sx={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: 500 }}>
                    Vegetarianos
                  </Typography>
                </Box>
              </MotionPaper>
            )}
          </MotionBox>
        </MotionBox>

        {/* Advanced category filters */}
        <AnimatePresence>
          {showFilters && (
            <Fade in={showFilters}>
              <MotionBox
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                sx={{ mb: { xs: 8, sm: 10 } }}
              >
                <MotionPaper
                  elevation={0}
                  sx={{ 
                    p: { xs: 4, sm: 5 }, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(44, 44, 46, 0.4)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Gradient overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(245, 158, 11, 0.02) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                  
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography 
                      sx={{ 
                        mb: 4,
                        fontWeight: 700,
                        color: '#F5F5F7',
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        letterSpacing: '-0.02em'
                      }}
                    >
                      Explorar Categorías
                    </Typography>
                    
                    <Stack 
                      direction="row" 
                      spacing={2}
                      sx={{ 
                        flexWrap: 'wrap',
                        gap: { xs: 2, sm: 2.5 },
                      }}
                    >
                      {categories.map((category) => (
                        <MotionBox
                          key={category.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Badge
                            badgeContent={category.count}
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: selectedCategory === category.name ? '#FFFFFF' : '#3B82F6',
                                color: selectedCategory === category.name ? '#3B82F6' : '#FFFFFF',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                minWidth: 20,
                                height: 20
                              }
                            }}
                          >
                            <Chip
                              label={category.name}
                              onClick={() => setSelectedCategory(category.name)}
                              variant={selectedCategory === category.name ? 'filled' : 'outlined'}
                              sx={{
                                minHeight: { xs: 44, sm: 48 },
                                borderRadius: 3,
                                fontWeight: selectedCategory === category.name ? 700 : 500,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                px: { xs: 2.5, sm: 3 },
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
                                  transform: 'translateY(-1px)',
                                  boxShadow: selectedCategory === category.name 
                                    ? '0 8px 25px rgba(59, 130, 246, 0.3)' 
                                    : '0 4px 12px rgba(0, 0, 0, 0.1)'
                                },
                              }}
                            />
                          </Badge>
                        </MotionBox>
                      ))}
                    </Stack>
                  </Box>
                </MotionPaper>
              </MotionBox>
            </Fade>
          )}
        </AnimatePresence>

        {/* Product count with elegant divider */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          sx={{ 
            mb: 8,
            textAlign: 'center'
          }}
        >
          <Divider sx={{ 
            mb: 3,
            borderColor: 'rgba(255, 255, 255, 0.06)',
            '&::before, &::after': {
              borderColor: 'rgba(255, 255, 255, 0.06)'
            }
          }}>
            <Typography 
              sx={{ 
                color: '#A1A1AA',
                fontSize: '0.9rem',
                fontWeight: 600,
                px: 3,
                py: 1,
                backgroundColor: 'rgba(44, 44, 46, 0.6)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              {selectedCategory !== 'Todas' && ` en ${selectedCategory}`}
            </Typography>
          </Divider>
        </MotionBox>

        {/* Product sections */}
        <AnimatePresence mode="wait">
          <Stack spacing={{ xs: 8, sm: 10 }}>
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

        {/* Premium footer */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          sx={{ 
            mt: 16,
            pt: 8,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.4) 0%, rgba(58, 58, 60, 0.2) 100%)',
              backdropFilter: 'blur(24px)',
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
                background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                sx={{ 
                  color: '#F5F5F7',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  mb: 2
                }}
              >
                Experiencia Digital Premium
              </Typography>
              <Typography 
                sx={{ 
                  color: '#A1A1AA',
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  mb: 3,
                  lineHeight: 1.6
                }}
              >
                Precios sujetos a cambios sin previo aviso • Menú actualizado diariamente
              </Typography>
              <Typography 
                sx={{ 
                  color: '#3B82F6',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                Última actualización • {new Date().toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Box>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
};

export default MenuViewer;