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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { initialProducts } from '../../data/initialProducts';
import { Product, ProductCategory } from '../../types';
import ProductForm from '../../components/ProductForm';
import ProductCard from '../../components/ProductCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DashboardIcon from '@mui/icons-material/Dashboard';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionContainer = motion(Container);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Simulamos la carga de productos
    setProducts(initialProducts);
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

  // Agrupamos los productos por categoría para mostrarlos
  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];
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
            direction="row" 
            spacing={2} 
            alignItems="center"
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
            <DashboardIcon sx={{ fontSize: 36 }} />
            <MotionTypography
              variant="h3"
              fontWeight="bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Panel de Administración
            </MotionTypography>
          </Stack>
          
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9, fontWeight: 500 }}>
            Gestiona tu menú digital de forma sencilla y elegante
          </Typography>
        </MotionPaper>

        <MotionBox variants={itemVariants}>
          <ProductForm 
            onSubmit={handleAddProduct} 
            editingProduct={editingProduct}
            onCancelEdit={handleCancelEdit}
          />
        </MotionBox>

        <MotionBox variants={itemVariants} sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
            Productos Actuales
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {products.length === 0 ? (
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
                No hay productos disponibles. Agrega algunos usando el formulario.
              </Typography>
            </MotionPaper>
          ) : (
            <Box>
              {productsByCategory.map((group, index) => {
                if (group.products.length === 0) return null;
                
                return (
                  <Box key={group.category} sx={{ mb: 5 }}>
                    <MotionTypography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: 700,
                        position: 'relative',
                        display: 'inline-block',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    >
                      {group.category}
                      <Box
                        component="span"
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          left: 0,
                          width: '40%',
                          height: 3,
                          backgroundColor: 'secondary.main',
                          borderRadius: 4,
                        }}
                      />
                    </MotionTypography>
                    
                    <Stack spacing={2}>
                      {group.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isAdmin={true}
                          onEdit={handleEditProduct}
                          onDelete={handleDeleteProduct}
                        />
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          )}
        </MotionBox>

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