'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Button,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { initialProducts } from '../../data/initialProducts';
import { Product, ProductCategory } from '../../types';
import ProductForm from '../../components/ProductForm';
import ProductCard from '../../components/ProductCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

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

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, sm: 3, md: 4 }, pb: 8 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 4 }}
        >
          <Box>
            <MotionTypography
              variant="h3"
              sx={{ fontWeight: 700, mb: 1 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Panel de Administración
            </MotionTypography>
            <MotionTypography
              variant="subtitle1"
              color="text.secondary"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Gestiona tu menú digital de forma sencilla
            </MotionTypography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, sm: 0 } }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/')}
              >
                Inicio
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<RestaurantMenuIcon />}
                onClick={() => router.push('/menu')}
                sx={{
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                }}
              >
                Ver Menú
              </Button>
            </motion.div>
          </Stack>
        </Stack>

        <ProductForm
          onSubmit={handleAddProduct}
          editingProduct={editingProduct}
          onCancelEdit={handleCancelEdit}
        />

        <MotionTypography
          variant="h4"
          sx={{ mb: 3, fontWeight: 600 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Productos Actuales
        </MotionTypography>

        {products.length === 0 ? (
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}
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
                      mb: 2,
                      pb: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      fontWeight: 600,
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    {group.category}
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
    </Box>
  );
}