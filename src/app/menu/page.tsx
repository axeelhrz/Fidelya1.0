'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Container, Chip, IconButton, Divider } from '@mui/material';
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
const MotionDivider = motion(Divider);

export default function MenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  useEffect(() => {
    // Simulamos la carga de productos con un pequeño delay para mostrar animaciones
    const timer = setTimeout(() => {
    setProducts(initialProducts);
    }, 300);

    return () => clearTimeout(timer);
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

  const filterVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      marginBottom: 24,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      } 
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginBottom: 0,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      } 
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    // En móvil, ocultar los filtros después de seleccionar
    if (window.innerWidth < 600) {
      setShowFilters(false);
    }
  };

  const filteredCategories = activeCategory === 'all'
    ? productsByCategory
    : productsByCategory.filter(group => group.category === activeCategory);

  // Elementos decorativos animados
  const decorElements = [
    { top: '5%', right: '5%', size: 300, color: 'primary', delay: 0.2 },
    { bottom: '10%', left: '5%', size: 250, color: 'highlight', delay: 0.4 },
    { top: '40%', left: '15%', size: 150, color: 'accent', delay: 0.6 },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f9f9fb 0%, #f3f4f6 100%)',
        position: 'relative',
        overflow: 'hidden',
        pb: 10,
      }}
    >
      {/* Elementos decorativos de fondo animados */}
      {decorElements.map((elem, index) => (
        <MotionBox
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.4, 
            scale: 1,
            transition: { 
              delay: elem.delay, 
              duration: 1.2,
              ease: "easeOut"
            }
        }}
        sx={{
          position: 'absolute',
            top: elem.top || 'auto',
            left: elem.left || 'auto',
            right: elem.right || 'auto',
            bottom: elem.bottom || 'auto',
            width: `${elem.size}px`,
            height: `${elem.size}px`,
            background: `radial-gradient(circle, ${
              elem.color === 'primary' 
                ? 'rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%'
                : elem.color === 'highlight'
                ? 'rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0) 70%'
                : 'rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0) 70%'
            })`,
            borderRadius: '50%',
          zIndex: 0,
        }}
      />
            ))}

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
        <MotionBox 
          variants={itemVariants} 
          sx={{ 
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={() => router.push('/')}
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                color: 'primary.main',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="sm-only"
          >
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                backgroundColor: showFilters 
                  ? 'primary.main' 
                  : 'rgba(59, 130, 246, 0.08)',
                color: showFilters ? 'white' : 'primary.main',
                display: { sm: 'none' },
              }}
            >
              <FilterListIcon />
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
              sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem' } }}
            >
              Nuestro Menú
            </MotionTypography>
          </Stack>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mt: 1, 
              opacity: 0.9, 
              fontWeight: 500,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Descubre nuestra selección de platos preparados con los mejores ingredientes
          </Typography>
        </MotionPaper>

        {/* Filtro de categorías - Visible siempre en desktop, toggle en móvil */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 600) && (
            <MotionBox 
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              sx={{ 
                mb: 6,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
              }}
            >
              <Typography 
                variant="subtitle1" 
                fontWeight={600} 
                sx={{ 
                  mr: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
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
          )}
        </AnimatePresence>

        {/* Mensaje cuando no hay productos */}
        {products.length === 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Cargando menú...
            </Typography>
          </MotionBox>
        )}

        {/* Secciones del menú */}
        <AnimatePresence>
          {filteredCategories.map((group, index) => (
            <MenuSection
              key={group.category}
              title={group.category}
              products={group.products}
              index={index}
            />
          ))}
        </AnimatePresence>

        {/* Mensaje cuando no hay resultados para el filtro */}
        {filteredCategories.length === 0 && products.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No hay productos en esta categoría
            </Typography>
          </MotionBox>
        )}

        {/* Footer sutil */}
        <MotionDivider
          variants={itemVariants}
          sx={{ 
            mt: 8,
            mb: 4,
            opacity: 0.2,
          }}
        />
        
        <MotionBox
          variants={itemVariants}
          sx={{ 
            textAlign: 'center',
            opacity: 0.6,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Potenciado por Assuriva • Diseño 2025
          </Typography>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
}