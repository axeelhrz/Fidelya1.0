'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Container, Chip, IconButton, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { initialProducts } from '../data/initialProducts';
import { Product, ProductCategory } from '../types';
import MenuSection from '../components/MenuSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useRouter } from 'next/navigation';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionContainer = motion(Container);

export default function MenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    // Simulamos la carga de productos
    setProducts(initialProducts);
  }, []);

  // Agrupamos los productos por categoría
  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category === category)
  }));

  // Variantes de animación
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
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

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(245,245,245,0.5) 100%)',
        position: 'relative',
        overflow: 'hidden',
        pb: 10,
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, rgba(59, 130, 246, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.03) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 4 },
          position: 'relative',
          zIndex: 1,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionBox variants={itemVariants} sx={{ mb: 2 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={() => router.push('/')}
              sx={{
                mb: 2,
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                color: 'primary.main',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>
        </MotionBox>

        <MotionPaper
          variants={itemVariants}
          elevation={0}
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
              borderRadius: '0 0 0 100%',
              transform: 'translate(30%, -30%)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              borderRadius: '0 100% 0 0',
              transform: 'translate(-30%, 30%)',
            }}
          />
              
          <Stack direction="row" alignItems="center" spacing={2}>
            <RestaurantMenuIcon sx={{ fontSize: 36 }} />
            <MotionTypography
              variant="h3"
              fontWeight="bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Nuestro Menú
            </MotionTypography>
          </Stack>
          
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9, fontWeight: 500 }}>
            Descubre nuestra selección de platos preparados con los mejores ingredientes
          </Typography>
        </MotionPaper>

        {/* Filtro de categorías */}
        <MotionBox 
          variants={itemVariants}
          sx={{ 
            mb: 6,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 1 }}>
            Filtrar por:
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              flexWrap: 'wrap', 
              gap: 1,
              display: 'flex',
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Chip
                label="Todos"
                color={activeCategory === 'all' ? 'primary' : 'default'}
                onClick={() => handleCategoryChange('all')}
                sx={{ 
                  fontWeight: 500,
                  backgroundColor: activeCategory === 'all' ? 'primary.main' : 'rgba(59, 130, 246, 0.08)',
                  color: activeCategory === 'all' ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: activeCategory === 'all' ? 'primary.dark' : 'rgba(59, 130, 246, 0.12)',
                  }
                }}
              />
            </motion.div>
            
            {categories.map((category) => (
              <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip
                  label={category}
                  color={activeCategory === category ? 'primary' : 'default'}
                  onClick={() => handleCategoryChange(category)}
                  sx={{ 
                    fontWeight: 500,
                    backgroundColor: activeCategory === category ? 'primary.main' : 'rgba(59, 130, 246, 0.08)',
                    color: activeCategory === category ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: activeCategory === category ? 'primary.dark' : 'rgba(59, 130, 246, 0.12)',
                    }
                  }}
                />
              </motion.div>
            ))}
          </Stack>
        </MotionBox>

        {/* Secciones del menú */}
        {filteredCategories.map((group, index) => (
          <MenuSection
            key={group.category}
            title={group.category}
            products={group.products}
            index={index}
          />
        ))}

        {/* Footer sutil */}
        <MotionBox
          variants={itemVariants}
          sx={{ 
            mt: 8,
            textAlign: 'center',
            opacity: 0.6,
          }}
        >
          <Divider sx={{ mb: 4 }} />
          <Typography variant="caption" color="text.secondary">
            Potenciado por Assuriva • Diseño 2025
          </Typography>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
}