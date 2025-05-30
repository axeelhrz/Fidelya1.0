'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Container,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  LocalOffer as LocalOfferIcon,
  Eco as EcoIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductCategory, MenuData } from '../types';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';

interface MenuViewerProps {
  menuId: string;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionContainer = motion(Container);

const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

const categoryColors = {
  'Entrada': '#3B82F6',
  'Principal': '#F59E0B',
  'Bebida': '#10B981',
  'Postre': '#8B5CF6',
};

const categoryIcons = {
  'Entrada': '🥗',
  'Principal': '🍽️',
  'Bebida': '🥤',
  'Postre': '🍰',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => (
  <MotionBox
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: index * 0.05 }}
  >
    <Paper
      sx={{
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: categoryColors[product.category],
          opacity: 0.8,
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1} mb={1.5} flexWrap="wrap">
            <Typography 
              variant="h6" 
              fontWeight={600}
              sx={{ 
                color: 'text.primary',
                lineHeight: 1.3,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              {product.name}
            </Typography>
            
            {product.isRecommended && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Chip
                  icon={<StarIcon />}
                  label="Recomendado"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    '& .MuiChip-icon': {
                      color: '#10B981',
                      fontSize: '0.9rem',
                    },
                  }}
                />
              </motion.div>
            )}
            
            {product.isVegan && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <Chip
                  icon={<EcoIcon />}
                  label="Vegano"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#10B981',
                    color: '#10B981',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    '& .MuiChip-icon': {
                      color: '#10B981',
                      fontSize: '0.9rem',
                    },
                  }}
                />
              </motion.div>
            )}
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              lineHeight: 1.6,
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
            }}
          >
            {product.description}
          </Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{
              color: 'secondary.main',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              ml: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' },
              textAlign: 'right',
            }}
          >
            ${product.price.toLocaleString()}
          </Typography>
        </motion.div>
      </Box>
    </Paper>
  </MotionBox>
);

export const MenuViewer: React.FC<MenuViewerProps> = ({ menuId }) => {
  const { menuData, loading, error } = useFirebaseMenu(menuId);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Actualizar timestamp cuando cambie el menú
  useEffect(() => {
    if (menuData) {
      setLastUpdated(new Date());
    }
  }, [menuData]);

  const groupedProducts = menuData?.products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<ProductCategory, Product[]>) || {};

  const filteredProducts = activeCategory === 'all' 
    ? menuData?.products || []
    : groupedProducts[activeCategory] || [];

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: ProductCategory | 'all') => {
    setActiveCategory(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CircularProgress size={60} thickness={4} />
          </motion.div>
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Cargando menú...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Error al cargar el menú
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        </motion.div>
      </Container>
    );
  }

  if (!menuData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert 
            severity="warning"
            sx={{ 
              borderRadius: 3,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Menú no encontrado
            </Typography>
            <Typography variant="body2">
              El menú solicitado no existe o no está disponible.
            </Typography>
          </Alert>
        </motion.div>
      </Container>
    );
  }

  return (
    <MotionContainer
      maxWidth="md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}
    >
      {/* Header del menú */}
      <MotionPaper
        variants={itemVariants}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 4,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)',
          },
        }}
      >
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <RestaurantIcon sx={{ color: 'primary.main', fontSize: { xs: 28, sm: 32 } }} />
            </motion.div>
            <Typography 
              variant="h4" 
              fontWeight={700}
              sx={{ 
                background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
              }}
            >
              {menuData.name}
            </Typography>
          </Box>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              lineHeight: 1.6,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            {menuData.description}
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <Chip 
              label={`${menuData.products.length} productos`}
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                fontWeight: 600,
              }}
            />
            <Chip 
              label={`${Object.keys(groupedProducts).length} categorías`}
              sx={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                fontWeight: 600,
              }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Actualizado: {lastUpdated.toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </MotionPaper>

      {/* Filtros por categoría */}
      <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
        <Paper
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)',
                height: 3,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                minHeight: { xs: 48, sm: 56 },
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <Tab
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>🍽️ Todos</Typography>
                  <Badge badgeContent={menuData.products.length} color="primary" />
                </Box>
              }
              value="all"
            />
            {categories.map((category) => {
              const count = groupedProducts[category]?.length || 0;
              if (count === 0) return null;
              
              return (
                <Tab
                  key={category}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>{categoryIcons[category]} {category}</Typography>
                      <Badge badgeContent={count} color="primary" />
                    </Box>
                  }
                  value={category}
                />
              );
            })}
          </Tabs>
        </Paper>
      </MotionBox>

      {/* Lista de productos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeCategory === 'all' ? (
            // Vista por categorías
            <Stack spacing={4}>
              {categories.map((category) => {
                const categoryProducts = groupedProducts[category] || [];
                if (categoryProducts.length === 0) return null;

                return (
                  <MotionBox
                    key={category}
                    variants={itemVariants}
                  >
                    <Paper
                      sx={{
                        p: { xs: 2, sm: 3 },
                        backgroundColor: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 3,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <Typography variant="h2" sx={{ fontSize: '2rem' }}>
                          {categoryIcons[category]}
                        </Typography>
                        <Box>
                          <Typography 
                            variant="h5" 
                            fontWeight={600}
                            sx={{ 
                              color: categoryColors[category],
                              fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            }}
                          >
                            {category}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {categoryProducts.length} producto{categoryProducts.length !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack spacing={2}>
                        {categoryProducts.map((product, index) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            index={index}
                          />
                        ))}
                      </Stack>
                    </Paper>
                  </MotionBox>
                );
              })}
            </Stack>
          ) : (
            // Vista de categoría específica
            <Stack spacing={2}>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </Stack>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer con información adicional */}
      <MotionBox
        variants={itemVariants}
        sx={{ mt: 6, textAlign: 'center' }}
      >
        <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Typography variant="body2" color="text.secondary">
          Menú actualizado en tiempo real • {new Date().toLocaleDateString()}
        </Typography>
      </MotionBox>
    </MotionContainer>
  );
};

export default MenuViewer;