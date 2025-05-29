'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Container, Chip, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, ProductCategory } from '../types';

interface MenuData {
  name: string;
  description: string;
  products: Product[];
}
import { getMenuById } from '../../data/menu';
import MenuSection from '../components/MenuSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);
const MotionContainer = motion(Container);

export default function MenuPage() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const menuId = searchParams.get('id') || 'menu-bar-noche';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    // Cargar datos del menú desde localStorage o archivo
    const storageKey = `menu-${menuId}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProducts(parsedData);
    } else {
      const menu = getMenuById(menuId);
      if (menu) {
        setProducts(menu.products);
        setMenuData(menu);
      }
    }
  }, [menuId]);
  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category === category)
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  const filteredCategories = activeCategory === 'all'
    ? productsByCategory
    : productsByCategory.filter(group => group.category === activeCategory);

  if (!menuData && products.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      }}>
            <Typography variant="h6" color="text.secondary">
          Menú no encontrado
            </Typography>
      </Box>
  );
}

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      pb: 4,
    }}>
      <MotionContainer 
        maxWidth="md" 
        sx={{ pt: 2 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <MotionPaper
          variants={itemVariants}
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <IconButton 
              onClick={() => router.push('/')}
              sx={{ 
                color: '#3B82F6',
                '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <RestaurantMenuIcon sx={{ color: '#3B82F6', fontSize: 28 }} />
            <Box sx={{ flex: 1 }}>
              <MotionTypography 
                variant="h5" 
                fontWeight="bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {menuData?.name || 'Menú Digital'}
              </MotionTypography>
              <Typography variant="body2" color="text.secondary">
                {menuData?.description || 'Experiencia culinaria premium'}
              </Typography>
            </Box>
          </Stack>

          {/* Filtros de categoría */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="Todos"
              onClick={() => handleCategoryChange('all')}
              variant={activeCategory === 'all' ? 'filled' : 'outlined'}
              color={activeCategory === 'all' ? 'primary' : 'default'}
              size="small"
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryChange(category)}
                variant={activeCategory === category ? 'filled' : 'outlined'}
                color={activeCategory === category ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Stack>
        </MotionPaper>

        {/* Secciones del menú */}
        <AnimatePresence mode="wait">
          {filteredCategories.map((group, index) => (
            <MenuSection
              key={group.category}
              title={group.category}
              products={group.products}
              index={index}
            />
          ))}
        </AnimatePresence>

        {/* Footer */}
        <MotionPaper
          variants={itemVariants}
          elevation={1}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Menú digital generado con ❤️
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Los precios pueden variar sin previo aviso
          </Typography>
        </MotionPaper>
      </MotionContainer>
    </Box>
  );
}