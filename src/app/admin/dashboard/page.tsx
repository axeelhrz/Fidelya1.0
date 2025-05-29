'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Button,
  Paper,
  Container,
  Divider,
  IconButton,
  Chip,
  Badge,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { initialProducts } from '../../data/initialProducts';
import { Product, ProductCategory } from '../../types';
import ProductForm from '../../components/ProductForm';
import ProductCard from '../../components/ProductCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import CakeIcon from '@mui/icons-material/Cake';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionContainer = motion(Container);
const MotionDivider = motion(Divider);
const MotionChip = motion(Chip);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    // Simulamos la carga de productos con un pequeño delay para mostrar animaciones
    const timer = setTimeout(() => {
    setProducts(initialProducts);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    if (productData.id) {
      // Actualizar producto existente
      setProducts(products.map(p => 
        p.id === productData.id
          ? { ...productData, id: productData.id } as Product
          : p
      ));
      setEditingProduct(null);
    } else {
      // Agregar nuevo producto
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
      };
      setProducts([...products, newProduct]);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Agrupamos los productos por categoría para mostrarlos
  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];
  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category === category)
  }));

  const filteredCategories = activeCategory === 'all'
    ? productsByCategory
    : productsByCategory.filter(group => group.category === activeCategory);

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

  const getCategoryIcon = (category: ProductCategory) => {
    switch(category) {
      case 'Entrada': return <LocalDiningIcon />;
      case 'Principal': return <FastfoodIcon />;
      case 'Bebida': return <LocalCafeIcon />;
      case 'Postre': return <CakeIcon />;
      default: return <CategoryIcon />;
    }
  };

  // Elementos decorativos animados
  const decorElements = [
    { top: '5%', right: '5%', size: 300, color: 'primary', delay: 0.2 },
    { bottom: '10%', left: '5%', size: 250, color: 'highlight', delay: 0.4 },
    { top: '40%', left: '15%', size: 150, color: 'accent', delay: 0.6 },
    { bottom: '30%', right: '15%', size: 180, color: 'highlight', delay: 0.8 },
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
        maxWidth="lg" 
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
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mb: 4 }}
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
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                startIcon={<RestaurantMenuIcon />}
                onClick={() => router.push('/menu')}
                sx={{
                  borderWidth: '1.5px',
                }}
              >
                Ver Menú
              </Button>
            </motion.div>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {categories.map((category) => {
                const count = products.filter(p => p.category === category).length;
                return (
                  <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge badgeContent={count} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
                      <Chip
                        icon={getCategoryIcon(category)}
                        label={category}
                        variant="outlined"
                        sx={{ 
                          borderWidth: '1.5px',
                          '& .MuiChip-icon': { 
                            color: 'primary.main',
                          }
                        }}
                      />
                    </Badge>
                  </motion.div>
  );
              })}
            </Stack>
          </Stack>
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
            <DashboardIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
            <MotionTypography
              variant="h3"
              fontWeight="bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem' } }}
            >
              Panel de Administración
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
            Gestiona tu menú digital de forma sencilla y elegante
          </Typography>
          
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <MotionChip
              label={`${products.length} productos`}
              size="small"
              color="primary"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 500,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            />
            
            <MotionChip
              label={`${categories.length} categorías`}
              size="small"
              color="primary"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 500,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            />
          </Box>
        </MotionPaper>

        <MotionBox variants={itemVariants}>
          <ProductForm 
            onSubmit={handleAddProduct} 
            editingProduct={editingProduct}
            onCancelEdit={handleCancelEdit}
          />
        </MotionBox>

        <MotionBox variants={itemVariants} sx={{ mt: 6 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mb: 4 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                mb: { xs: 2, sm: 0 },
              }}
            >
              Productos Actuales
            </Typography>
            
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                flexWrap: 'wrap', 
                gap: 1,
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
          </Stack>

          <MotionDivider variants={itemVariants} sx={{ mb: 4 }} />

          <AnimatePresence>
            {isLoading ? (
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <Typography color="text.secondary">
                  Cargando productos...
                </Typography>
              </MotionPaper>
            ) : products.length === 0 ? (
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <Typography color="text.secondary">
                  No hay productos disponibles. Agrega algunos usando el formulario.
                </Typography>
              </MotionPaper>
            ) : (
              <Box>
                {filteredCategories.map((group, index) => {
                  if (group.products.length === 0) return null;
                  
                  return (
                    <Box key={group.category} sx={{ mb: 5 }}>
                      <MotionPaper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.01) 100%)',
                          border: '1px solid',
                          borderColor: 'rgba(59, 130, 246, 0.1)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '150px',
                            height: '150px',
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)',
                            borderRadius: '0 0 0 100%',
                            transform: 'translate(30%, -30%)',
                          }}
                        />
                        
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {getCategoryIcon(group.category)}
                          </Box>
                          
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                position: 'relative',
                                display: 'inline-block',
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                              }}
                            >
                              {group.category}
                            </Typography>
                            
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {group.products.length} {group.products.length === 1 ? 'producto' : 'productos'}
                            </Typography>
                          </Box>
                        </Stack>
                      </MotionPaper>
                      
                      <Stack spacing={2}>
                        <AnimatePresence>
                          {group.products.map((product, productIndex) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ 
                                delay: 0.3 + index * 0.1 + productIndex * 0.05, 
                                duration: 0.5 
                              }}
                            >
                              <ProductCard
                                product={product}
                                isAdmin={true}
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteProduct}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </Stack>
                    </Box>
                  );
                })}
                
                {filteredCategories.length === 0 && (
                  <MotionPaper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <Typography color="text.secondary">
                      No hay productos en esta categoría. Agrega algunos usando el formulario.
                    </Typography>
                  </MotionPaper>
                )}
              </Box>
            )}
          </AnimatePresence>
        </MotionBox>

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