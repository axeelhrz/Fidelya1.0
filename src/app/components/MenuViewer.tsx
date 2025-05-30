'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  LocalBar as BarIcon,
  Restaurant as FoodIcon,
  Coffee as CoffeeIcon,
  LocalOffer as OfferIcon,
  Grass as VeganIcon,
  Star as RecommendedIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Product } from '../types';
interface MenuViewerProps {
  products: Product[];
  menuName?: string;
  menuDescription?: string;
}

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const MenuViewer: React.FC<MenuViewerProps> = ({
  products,
  menuName = 'Carta del Bar',
  menuDescription = 'Nuestra selección de bebidas y comidas'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Bebidas', 'Tapas']));

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

  // Iconos por categoría
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'bebidas':
      case 'sin alcohol':
        return <BarIcon />;
      case 'tapas':
      case 'principales':
        return <FoodIcon />;
      case 'café':
        return <CoffeeIcon />;
      case 'promociones':
        return <OfferIcon />;
      default:
        return <FoodIcon />;
    }
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header del Menú */}
                  <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ textAlign: 'center', mb: 4 }}
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
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {menuDescription}
                          </Typography>
                  </MotionBox>

      {/* Filtros de Categoría */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{ mb: 4 }}
      >
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Categorías
        </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                color={selectedCategory === category ? 'primary' : 'default'}
                sx={{
                  fontWeight: selectedCategory === category ? 600 : 400,
                  '&:hover': {
                    backgroundColor: selectedCategory === category 
                      ? 'primary.dark' 
                      : 'rgba(59, 130, 246, 0.1)',
                  },
                }}
              />
            ))}
          </Stack>
        </Paper>
      </MotionBox>

      {/* Lista de Productos por Categoría */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <MotionBox key={category} variants={itemVariants} sx={{ mb: 4 }}>
            <Paper sx={{ overflow: 'hidden' }}>
              {/* Header de Categoría */}
              <Box
                sx={{
                  p: 2,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => toggleCategory(category)}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ color: 'primary.main' }}>
                      {getCategoryIcon(category)}
                    </Box>
                    <Typography variant="h5" fontWeight={600}>
                      {category}
                    </Typography>
                    <Chip
                      label={`${categoryProducts.length} productos`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                  <IconButton>
                    {expandedCategories.has(category) ? <CollapseIcon /> : <ExpandIcon />}
                  </IconButton>
                </Stack>
              </Box>

              {/* Productos de la Categoría */}
              <Collapse in={expandedCategories.has(category)}>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {categoryProducts.map((product, index) => (
                      <Grid item xs={12} key={product.id}>
                        <MotionCard
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          sx={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box sx={{ flex: 1, mr: 2 }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                  <Typography variant="h6" fontWeight={600}>
                                    {product.name}
                                  </Typography>
                                  {product.isRecommended && (
                                    <Chip
                                      icon={<RecommendedIcon />}
                                      label="Recomendado"
                                      size="small"
                                      color="success"
                                      variant="filled"
                                    />
                                  )}
                                  {product.isVegan && (
                                    <Chip
                                      icon={<VeganIcon />}
                                      label="Vegano"
                                      size="small"
                                      color="success"
                                      variant="outlined"
                                    />
                                  )}
                                </Stack>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ lineHeight: 1.6 }}
                                >
                                  {product.description}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography
                                  variant="h5"
                                  fontWeight={700}
                                  color="secondary.main"
                                >
                                  {formatPrice(product.price)}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </MotionCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Collapse>
            </Paper>
          </MotionBox>
        ))}
      </MotionBox>
    </Container>
  );
};

export default MenuViewer;