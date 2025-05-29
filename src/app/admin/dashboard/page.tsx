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
export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
    setProducts(initialProducts);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    if (productData.id) {
      setProducts(products.map(p => 
        p.id === productData.id
          ? { ...productData, id: productData.id } as Product
          : p
      ));
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
      };
      setProducts([...products, newProduct]);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
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

  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];
  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category === category)
  }));

  const filteredCategories = activeCategory === 'all'
    ? productsByCategory
    : productsByCategory.filter(group => group.category === activeCategory);

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

  const getCategoryIcon = (category: ProductCategory) => {
    switch(category) {
      case 'Entrada': return <LocalDiningIcon />;
      case 'Principal': return <FastfoodIcon />;
      case 'Bebida': return <LocalCafeIcon />;
      case 'Postre': return <CakeIcon />;
      default: return <CategoryIcon />;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        position: 'relative',
        overflow: 'hidden',
        pb: 12,
        '&::before': {
          content: '""',
          position: 'absolute',
              top: 0,
          left: 0,
          right: 0,
              bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.01) 49%, rgba(255,255,255,0.01) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.01) 49%, rgba(255,255,255,0.01) 51%, transparent 52%)
          `,
          backgroundSize: '400px 400px, 300px 300px, 25px 25px, 25px 25px',
          zIndex: 0,
        }
            }}
            >
      {/* Elementos decorativos flotantes */}
        <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 0.3, duration: 2 }}
          sx={{ 
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
          }}
      />
      <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.6, duration: 2 }}
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />
      <MotionContainer 
        maxWidth="lg" 
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
        <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mb: 6 }}
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
}
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
                  borderColor: '#3B82F6',
                  color: '#3B82F6',
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  }
                }}
              >
                Ver Menú Público
              </Button>
            </motion.div>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Estadísticas rápidas */}
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {categories.map((category) => {
                const count = products.filter(p => p.category === category).length;
                return (
                  <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge 
                      badgeContent={count} 
                      sx={{ 
                        '& .MuiBadge-badge': { 
                          backgroundColor: '#F59E0B',
                          color: '#1C1C1E',
                          fontWeight: 600,
                          fontSize: '0.7rem' 
                        } 
                      }}
                    >
                      <Chip
                        icon={getCategoryIcon(category)}
                        label={category}
                        variant="outlined"
                        sx={{ 
                          borderWidth: '1.5px',
                          borderColor: 'rgba(245, 158, 11, 0.3)',
                          color: '#F59E0B',
                          backgroundColor: 'rgba(245, 158, 11, 0.05)',
                          '& .MuiChip-icon': { 
                            color: '#F59E0B',
                          },
                          '&:hover': {
                            borderColor: '#F59E0B',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
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

        {/* Hero del dashboard */}
        <MotionPaper
          variants={itemVariants}
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            mb: 8,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.25)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
                linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.02) 49%, rgba(255,255,255,0.02) 51%, transparent 52%)
              `,
              backgroundSize: '300px 300px, 200px 200px, 30px 30px',
              zIndex: 0,
            }
          }}
        >
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={3} 
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Box
              sx={{
                width: { xs: 60, sm: 70 },
                height: { xs: 60, sm: 70 },
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              <DashboardIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <MotionTypography
                variant="h3"
                fontWeight="bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
                  mb: 1,
                }}
              >
                Panel de Control
              </MotionTypography>
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.9, 
                  fontWeight: 400,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Gestiona tu carta digital con herramientas profesionales
              </Typography>
              
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label={`${products.length} productos`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
                
                <Chip
                  label={`${categories.length} categorías`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />

                <Chip
                  label={`${products.filter(p => p.isRecommended).length} recomendados`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </MotionPaper>

        {/* Formulario de productos */}
        <MotionBox variants={itemVariants}>
          <ProductForm 
            onSubmit={handleAddProduct} 
            editingProduct={editingProduct}
            onCancelEdit={handleCancelEdit}
          />
        </MotionBox>

        {/* Sección de productos */}
        <MotionBox variants={itemVariants} sx={{ mt: 8 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mb: 6 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                color: '#F5F5F7',
                mb: { xs: 3, sm: 0 },
              }}
            >
              Gestión de Productos
            </Typography>
            
            <Stack 
              direction="row" 
              spacing={1.5} 
              sx={{ 
                flexWrap: 'wrap', 
                gap: 1.5,
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
                    border: activeCategory === 'all' ? 'none' : '1px solid rgba(59, 130, 246, 0.3)',
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
                      border: activeCategory === category ? 'none' : '1px solid rgba(59, 130, 246, 0.3)',
                      '&:hover': {
                        backgroundColor: activeCategory === category ? '#2563eb' : 'rgba(59, 130, 246, 0.25)',
                      }
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
          </Stack>

          <Divider sx={{ mb: 6, borderColor: '#3A3A3C' }} />

          <AnimatePresence>
            {isLoading ? (
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  borderRadius: 4,
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
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
                  p: 6, 
                  textAlign: 'center', 
                  borderRadius: 4,
                  backgroundColor: '#2C2C2E',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  No hay productos disponibles. Agrega algunos usando el formulario superior.
                </Typography>
              </MotionPaper>
            ) : (
              <Box>
                {filteredCategories.map((group, index) => {
                  if (group.products.length === 0) return null;
                  
                  return (
                    <Box key={group.category} sx={{ mb: 8 }}>
                      <MotionPaper
                        elevation={0}
                        sx={{
                          p: 4,
                          mb: 4,
                          borderRadius: 4,
                          backgroundColor: '#2C2C2E',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `
                              radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
                              linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.01) 49%, rgba(255,255,255,0.01) 51%, transparent 52%)
                            `,
                            backgroundSize: '200px 200px, 15px 15px',
                            zIndex: 0,
                          }
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                      >
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              border: '2px solid rgba(245, 158, 11, 0.3)',
                            }}
                          >
                            {getCategoryIcon(group.category)}
                          </Box>
                          
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: '#F5F5F7',
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
                              {group.products.length} {group.products.length === 1 ? 'producto' : 'productos'} • 
                              {group.products.filter(p => p.isRecommended).length} recomendados
                            </Typography>
                          </Box>
                        </Stack>
                      </MotionPaper>
                      
                      <Stack spacing={3}>
                        <AnimatePresence>
                          {group.products.map((product, productIndex) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ 
                                delay: 0.3 + index * 0.1 + productIndex * 0.05, 
                                duration: 0.6 
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
                      p: 6, 
                      textAlign: 'center', 
                      borderRadius: 4,
                      backgroundColor: '#2C2C2E',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                      No hay productos en esta categoría. Agrega algunos usando el formulario superior.
                    </Typography>
                  </MotionPaper>
                )}
              </Box>
            )}
          </AnimatePresence>
        </MotionBox>

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
            POWERED BY ASSURIVA • ADMIN DASHBOARD 2025
          </Typography>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
}