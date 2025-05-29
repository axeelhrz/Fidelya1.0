'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Container, Chip, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { initialProducts } from '../data/initialProducts';
import { Product, ProductCategory } from '../types';
import MenuSection from '../components/MenuSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useRouter } from 'next/navigation';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionContainer = motion(Container);
export default function MenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    const timer = setTimeout(() => {
    setProducts(initialProducts);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
    if (typeof window !== 'undefined' && window.innerWidth < 600) {
      setShowFilters(false);
    }
  };

  const filteredCategories = activeCategory === 'all'
    ? productsByCategory
    : productsByCategory.filter(group => group.category === activeCategory);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        position: 'relative',
        overflow: 'hidden',
        pb: 12,
      }}
    >
      {/* Elementos decorativos de fondo */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 0.2, duration: 1.5 }}
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0) 70%)',
            borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
        <MotionBox 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.4, duration: 1.5 }}
          sx={{ 
              position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: 0,
            }}
          />

      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 4, sm: 6, md: 8 },
          px: { xs: 3, sm: 4 },
          position: 'relative',
          zIndex: 1,
            }}
        variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
        {/* Header con navegación */}
        <MotionBox 
          variants={itemVariants} 
          sx={{ 
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={() => router.push('/')}
          sx={{ 
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                minHeight: 48,
                minWidth: 48,
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.25)',
                },
          }}
        >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                backgroundColor: showFilters 
                  ? '#3B82F6' 
                  : 'rgba(59, 130, 246, 0.15)',
                color: showFilters ? '#FFFFFF' : '#3B82F6',
                display: { sm: 'none' },
                minHeight: 48,
                minWidth: 48,
                '&:hover': {
                  backgroundColor: showFilters 
                    ? '#2563eb' 
                    : 'rgba(59, 130, 246, 0.25)',
                },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </motion.div>
        </MotionBox>

        {/* Hero del menú */}
        <MotionPaper
          variants={itemVariants}
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            mb: 8,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.25)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              borderRadius: '0 16px 0 100%',
              transform: 'translate(25%, -25%)',
            }}
          />
              
          <Stack direction="row" alignItems="center" spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            <RestaurantMenuIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Box>
              <MotionTypography
                variant="h3"
                fontWeight="bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
                  mb: 1,
                }}
              >
                Carta Premium
              </MotionTypography>
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.9, 
                  fontWeight: 400,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.5,
                }}
              >
                Experiencia culinaria de alta gama con ingredientes selectos
              </Typography>
    </Box>
          </Stack>
        </MotionPaper>

        {/* Filtros de categorías */}
        <AnimatePresence>
          {(showFilters || (typeof window !== 'undefined' && window.innerWidth >= 600)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MotionBox 
                sx={{ 
                  mb: 8,
                  p: 3,
                  backgroundColor: 'rgba(44, 44, 46, 0.6)',
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  fontWeight={600} 
                  sx={{ 
                    mb: 3,
                    color: '#F5F5F7',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Filtrar por categoría:
                </Typography>
                
                <Stack 
                  direction="row" 
                  spacing={2} 
                  sx={{ 
                    flexWrap: 'wrap', 
                    gap: 2,
                  }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Chip
                      label="Todos"
                      onClick={() => handleCategoryChange('all')}
                      sx={{ 
                        fontWeight: 500,
                        minHeight: 36,
                        backgroundColor: activeCategory === 'all' ? '#3B82F6' : 'rgba(59, 130, 246, 0.15)',
                        color: activeCategory === 'all' ? '#FFFFFF' : '#3B82F6',
                        '&:hover': {
                          backgroundColor: activeCategory === 'all' ? '#2563eb' : 'rgba(59, 130, 246, 0.25)',
}
                      }}
                    />
                  </motion.div>
                  
                  {categories.map((category) => (
                    <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Chip
                        label={category}
                        onClick={() => handleCategoryChange(category)}
                        sx={{ 
                          fontWeight: 500,
                          minHeight: 36,
                          backgroundColor: activeCategory === category ? '#3B82F6' : 'rgba(59, 130, 246, 0.15)',
                          color: activeCategory === category ? '#FFFFFF' : '#3B82F6',
                          '&:hover': {
                            backgroundColor: activeCategory === category ? '#2563eb' : 'rgba(59, 130, 246, 0.25)',
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </MotionBox>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {products.length === 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            sx={{
              textAlign: 'center',
              py: 12,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Cargando carta...
            </Typography>
          </MotionBox>
        )}

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
        <MotionBox
          variants={itemVariants}
          sx={{ 
            textAlign: 'center',
            mt: 12,
            pt: 6,
            borderTop: '1px solid #3A3A3C',
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              opacity: 0.6,
            }}
          >
            POWERED BY ASSURIVA • DISEÑO 2025
          </Typography>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
}