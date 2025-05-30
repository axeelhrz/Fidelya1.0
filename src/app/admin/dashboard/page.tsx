'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Save as SaveIcon,
  Restaurant,
  LocalBar,
  Cake,
  Fastfood,
  Star,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Product, ProductCategory } from '../../types';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionFab = motion(Fab);

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { 
    menus, 
  } = useAdminDashboard();

  // Estados del dashboard
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const showAddFab = true;

  // Estados del formulario
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    description: '',
    category: 'Bebida' as ProductCategory,
    isRecommended: false,
    isVegan: false,
    isAvailable: true,
  });

  const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];

  // Productos de ejemplo para mostrar la interfaz
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Mojito Clásico',
      price: 850,
      description: 'Ron blanco, menta fresca, lima, azúcar y soda',
      category: 'Bebida',
      isRecommended: true,
      isVegan: true,
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Bruschetta Italiana',
      price: 650,
      description: 'Pan tostado con tomate, albahaca y mozzarella',
      category: 'Entrada',
      isRecommended: false,
      isVegan: false,
      isAvailable: true,
    },
    {
      id: '3',
      name: 'Tiramisu',
      price: 750,
      description: 'Postre italiano con café, mascarpone y cacao',
      category: 'Postre',
      isRecommended: true,
      isVegan: false,
      isAvailable: true,
    },
    {
      id: '4',
      name: 'Risotto de Hongos',
      price: 1200,
      description: 'Arroz arborio con hongos porcini y parmesano',
      category: 'Principal',
      isRecommended: false,
      isVegan: false,
      isAvailable: true,
    },
  ]);

  // Cargar datos del menú seleccionado
  // Cargar datos del menú seleccionado
  useEffect(() => {
    if (selectedMenuId && menus.length > 0) {
      // Menu data is available but not stored in state since it's not being used
    }
  }, [selectedMenuId, menus, products]);
  // Seleccionar primer menú automáticamente
  useEffect(() => {
    if (menus.length > 0 && !selectedMenuId) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  // Funciones de manejo
  const handleBack = () => {
    router.push('/');
  };

  const handleLogout = () => {
    router.push('/admin');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      description: '',
      category: 'Bebida',
      isRecommended: false,
      isVegan: false,
      isAvailable: true,
    });
    setShowProductDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      isRecommended: product.isRecommended || false,
      isVegan: product.isVegan || false,
      isAvailable: product.isAvailable !== false,
    });
    setShowProductDialog(true);
  };

  const handleSaveProduct = async () => {
    if (editingProduct) {
      // Editar producto existente
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productForm }
          : p
      ));
    } else {
      // Agregar nuevo producto
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productForm,
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setShowProductDialog(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleToggleAvailability = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, isAvailable: !p.isAvailable }
        : p
    ));
  };

  const generateQRUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu?id=${selectedMenuId}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'bebida': return <LocalBar sx={{ fontSize: 20 }} />;
      case 'postre': return <Cake sx={{ fontSize: 20 }} />;
      case 'entrada': return <Fastfood sx={{ fontSize: 20 }} />;
      default: return <Restaurant sx={{ fontSize: 20 }} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'bebida': return '#74ACDF';
      case 'postre': return '#F59E0B';
      case 'entrada': return '#22C55E';
      default: return '#74ACDF';
    }
  };

  const filteredProducts = selectedCategory === 'Todas' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const groupedProducts = categories.reduce((acc, category) => {
    acc[category] = products.filter(p => p.category === category);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#1C1C1E',
      position: 'relative'
    }}>
      {/* Efectos de fondo similares al menú */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -10,
          pointerEvents: 'none'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(116, 172, 223, 0.04) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)
            `
          }}
        />

        {/* Orbes flotantes */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(116, 172, 223, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float1 20s ease-in-out infinite',
            '@keyframes float1': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(50px, -30px) scale(1.1)' }
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float2 25s ease-in-out infinite reverse',
            '@keyframes float2': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(-40px, 20px) scale(1.2)' }
            }
          }}
        />
      </Box>

      {/* Header fijo similar al menú */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(180deg, rgba(28, 28, 30, 0.8) 0%, rgba(28, 28, 30, 0.4) 70%, transparent 100%)',
          backdropFilter: 'blur(20px)',
          pt: 2,
          pb: 4,
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            {/* Sección izquierda */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={handleBack}
                sx={{ 
                  color: '#A1A1AA',
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': { 
                    color: '#F5F5F7',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ArrowBack fontSize="small" />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, rgba(116, 172, 223, 0.2) 0%, rgba(116, 172, 223, 0.1) 100%)',
                    border: '1px solid rgba(116, 172, 223, 0.3)',
                  }}
                >
                  <Restaurant sx={{ color: '#74ACDF', fontSize: 18 }} />
                </Box>
                
                <Box>
                  <Typography 
                    sx={{ 
                      fontWeight: 700,
                      color: '#F5F5F7',
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                    }}
                  >
                    Editor de Menú
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      color: '#A1A1AA',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Panel Admin
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Sección derecha */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Tooltip title="Generar QR">
                <IconButton
                  onClick={() => setShowQRDialog(true)}
                  disabled={!selectedMenuId}
                  sx={{
                    color: '#74ACDF',
                    backgroundColor: 'rgba(116, 172, 223, 0.1)',
                    border: '1px solid rgba(116, 172, 223, 0.3)',
                    '&:hover': { backgroundColor: 'rgba(116, 172, 223, 0.2)' },
                  }}
                >
                  <QrCodeIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{ 
                  borderRadius: 2,
                  color: '#A1A1AA',
                  borderColor: 'rgba(161, 161, 170, 0.3)',
                  '&:hover': {
                    borderColor: '#74ACDF',
                    color: '#74ACDF',
                  }
                }}
              >
                Salir
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contenido principal */}
      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 16, sm: 18 }, 
          pb: 8,
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Selector de menú */}
        {menus.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ mb: 6 }}
          >
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.6) 0%, rgba(28, 28, 30, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            >
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#A1A1AA' }}>Seleccionar Menú</InputLabel>
                <Select
                  value={selectedMenuId}
                  onChange={(e) => setSelectedMenuId(e.target.value)}
                  label="Seleccionar Menú"
                  sx={{
                    color: '#F5F5F7',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#74ACDF',
                    },
                  }}
                >
                  {menus.map((menu) => (
                    <MenuItem key={menu.id} value={menu.id}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography>{menu.name}</Typography>
                        <Chip 
                          label={menu.isActive ? 'Activo' : 'Inactivo'}
                          size="small"
                          color={menu.isActive ? 'success' : 'default'}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </MotionBox>
        )}

        {/* Filtros de categoría */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          sx={{ mb: 6 }}
        >
          <Box
            sx={{
              p: 3,
              background: 'rgba(44, 44, 46, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 2.5,
            }}
          >
            <Typography 
              sx={{ 
                fontWeight: 600,
                color: '#F5F5F7',
                fontSize: '1rem',
                mb: 2.5
              }}
            >
              Filtrar por Categoría
            </Typography>
            
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              <Chip
                label={`Todas (${products.length})`}
                onClick={() => setSelectedCategory('Todas')}
                variant={selectedCategory === 'Todas' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: selectedCategory === 'Todas' ? '#74ACDF' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedCategory === 'Todas' ? '#FFFFFF' : '#A1A1AA',
                  borderColor: selectedCategory === 'Todas' ? '#74ACDF' : 'rgba(161, 161, 170, 0.2)',
                  '&:hover': {
                    backgroundColor: selectedCategory === 'Todas' ? '#5a9bd4' : 'rgba(255,255,255,0.08)',
                  },
                }}
              />
              {categories.map((category) => {
                const count = products.filter(p => p.category === category).length;
                return (
                  <Chip
                    key={category}
                    label={`${category} (${count})`}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    sx={{
                      backgroundColor: selectedCategory === category ? getCategoryColor(category) : 'rgba(255, 255, 255, 0.03)',
                      color: selectedCategory === category ? '#FFFFFF' : '#A1A1AA',
                      borderColor: selectedCategory === category ? getCategoryColor(category) : 'rgba(161, 161, 170, 0.2)',
                      '&:hover': {
                        backgroundColor: selectedCategory === category ? getCategoryColor(category) : 'rgba(255,255,255,0.08)',
                      },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        </MotionBox>

        {/* Lista de productos editables */}
        <AnimatePresence>
          <Stack spacing={4}>
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
              if (selectedCategory !== 'Todas' && selectedCategory !== category) return null;
              if (categoryProducts.length === 0) return null;

              return (
                <MotionBox
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Header de categoría */}
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 3,
                        background: `linear-gradient(135deg, rgba(${getCategoryColor(category) === '#74ACDF' ? '116, 172, 223' : getCategoryColor(category) === '#F59E0B' ? '245, 158, 11' : '34, 197, 94'}, 0.12) 0%, rgba(44, 44, 46, 0.4) 100%)`,
                        backdropFilter: 'blur(16px)',
                        border: `1px solid ${getCategoryColor(category)}40`,
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: getCategoryColor(category),
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: `${getCategoryColor(category)}20`,
                            border: `1px solid ${getCategoryColor(category)}40`,
                            color: getCategoryColor(category),
                          }}
                        >
                          {getCategoryIcon(category)}
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '1.25rem',
                              color: '#F5F5F7',
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {category}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              color: '#A1A1AA',
                              opacity: 0.8
                            }}
                          >
                            {categoryProducts.length} {categoryProducts.length === 1 ? 'producto' : 'productos'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Productos de la categoría */}
                  <Stack spacing={3}>
                    {categoryProducts.map((product, index) => (
                      <MotionBox
                        key={product.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                        sx={{
                          position: 'relative',
                          background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.6) 0%, rgba(28, 28, 30, 0.8) 100%)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 3,
                          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                          opacity: product.isAvailable ? 1 : 0.6,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                          },
                        }}
                      >
                        <Box sx={{ p: 4 }}>
                          {/* Header con etiquetas */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {product.isRecommended && (
                                <Chip
                                  icon={<Star sx={{ fontSize: 12 }} />}
                                  label="Destacado"
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(116, 172, 223, 0.2)',
                                    color: '#74ACDF',
                                    border: '1px solid rgba(116, 172, 223, 0.3)',
                                    fontSize: '0.65rem',
                                  }}
                                />
                              )}
                              {product.isVegan && (
                                <Chip
                                  
                                  label="Vegano"
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                    color: '#22C55E',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    fontSize: '0.65rem',
                                  }}
                                />
                              )}
                            </Box>

                            {/* Controles de administrador */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title={product.isAvailable ? 'Ocultar' : 'Mostrar'}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleAvailability(product.id)}
                                  sx={{
                                    color: product.isAvailable ? '#22C55E' : '#A1A1AA',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                  }}
                                >
                                  {product.isAvailable ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditProduct(product)}
                                  sx={{
                                    color: '#74ACDF',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  sx={{
                                    color: '#F87171',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          {/* Información del producto */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '1.25rem',
                                  color: '#F5F5F7',
                                  letterSpacing: '-0.02em',
                                  mb: 0.5
                                }}
                              >
                                {product.name}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '0.7rem',
                                  fontWeight: 500,
                                  color: '#A1A1AA',
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase',
                                  opacity: 0.7,
                                  mb: 2
                                }}
                              >
                                {product.category}
                              </Typography>
                              <Typography
                                sx={{
                                  color: '#A1A1AA',
                                  fontSize: '0.85rem',
                                  lineHeight: 1.6,
                                  fontStyle: 'italic',
                                }}
                              >
                                {product.description}
                              </Typography>
                            </Box>

                            {/* Precio */}
                            <Box
                              sx={{
                                px: 2.5,
                                                                py: 1.5,
                                background: product.isRecommended 
                                  ? 'linear-gradient(135deg, rgba(116, 172, 223, 0.2) 0%, rgba(116, 172, 223, 0.1) 100%)'
                                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
                                border: `1px solid ${product.isRecommended ? 'rgba(116, 172, 223, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                                backdropFilter: 'blur(12px)',
                                textAlign: 'center',
                                minWidth: 'fit-content'
                              }}
                            >
                              <Box sx={{ mb: 0.5 }}>
                                {getCategoryIcon(product.category)}
                              </Box>
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  fontSize: '1.25rem',
                                  color: product.isRecommended ? '#74ACDF' : '#F59E0B',
                                  letterSpacing: '-0.02em',
                                  fontFamily: 'monospace'
                                }}
                              >
                                ${product.price}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </MotionBox>
                    ))}
                  </Stack>
                </MotionBox>
              );
            })}
          </Stack>
        </AnimatePresence>

        {/* Mensaje cuando no hay productos */}
        {filteredProducts.length === 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              textAlign: 'center',
              py: 8,
              background: 'rgba(44, 44, 46, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
            }}
          >
            <Typography
              sx={{
                color: '#A1A1AA',
                fontSize: '1.125rem',
                fontWeight: 500,
                mb: 2
              }}
            >
              No hay productos en esta categoría
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
              sx={{
                background: '#74ACDF',
                '&:hover': { background: '#5a9bd4' }
              }}
            >
              Agregar Primer Producto
            </Button>
          </MotionBox>
        )}
      </MotionContainer>

      {/* FAB para agregar productos */}
      <AnimatePresence>
        {showAddFab && (
          <MotionFab
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleAddProduct}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(135deg, #74ACDF 0%, #5a9bd4 100%)',
              color: '#FFFFFF',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a9bd4 0%, #4a8bc2 100%)',
                transform: 'scale(1.1)',
              },
              boxShadow: '0 8px 32px rgba(116, 172, 223, 0.3)',
              zIndex: 1100,
            }}
          >
            <AddIcon />
          </MotionFab>
        )}
      </AnimatePresence>

      {/* Dialog para agregar/editar productos */}
      <Dialog
        open={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.95) 0%, rgba(28, 28, 30, 0.9) 100%)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ color: '#F5F5F7', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nombre del producto"
              value={productForm.name}
              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  color: '#F5F5F7',
                },
                '& .MuiInputLabel-root': { color: '#A1A1AA' },
              }}
            />
            
            <TextField
              fullWidth
              label="Precio"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  color: '#F5F5F7',
                },
                '& .MuiInputLabel-root': { color: '#A1A1AA' },
              }}
            />
            
            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  color: '#F5F5F7',
                },
                '& .MuiInputLabel-root': { color: '#A1A1AA' },
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#A1A1AA' }}>Categoría</InputLabel>
              <Select
                value={productForm.category}
                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                label="Categoría"
                sx={{
                  color: '#F5F5F7',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryIcon(category)}
                      {category}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={productForm.isRecommended}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isRecommended: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#74ACDF' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#74ACDF' },
                    }}
                  />
                }
                label="Producto destacado"
                sx={{ color: '#F5F5F7' }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={productForm.isVegan}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isVegan: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#22C55E' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22C55E' },
                    }}
                  />
                }
                label="Producto vegano"
                sx={{ color: '#F5F5F7' }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={productForm.isAvailable}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#22C55E' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22C55E' },
                    }}
                  />
                }
                label="Disponible"
                sx={{ color: '#F5F5F7' }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button
            onClick={() => setShowProductDialog(false)}
            sx={{ color: '#A1A1AA' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!productForm.name || !productForm.price}
            sx={{
              background: '#74ACDF',
              '&:hover': { background: '#5a9bd4' }
            }}
          >
            {editingProduct ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para mostrar QR */}
      <Dialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.95) 0%, rgba(28, 28, 30, 0.9) 100%)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            textAlign: 'center',
          }
        }}
      >
        <DialogTitle sx={{ color: '#F5F5F7', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          Código QR del Menú
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 3
          }}>
            <Box
              sx={{
                p: 3,
                background: '#FFFFFF',
                borderRadius: 2,
                display: 'inline-block'
              }}
            >
              <QRCodeSVG
                value={generateQRUrl()}
                size={200}
                level="M"
                includeMargin={true}
              />
            </Box>
            
            <Box>
              <Typography sx={{ color: '#F5F5F7', mb: 1, fontWeight: 600 }}>
                URL del Menú:
              </Typography>
              <Typography 
                sx={{ 
                  color: '#74ACDF', 
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  backgroundColor: 'rgba(116, 172, 223, 0.1)',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid rgba(116, 172, 223, 0.3)'
                }}
              >
                {generateQRUrl()}
              </Typography>
            </Box>
            
            <Typography sx={{ color: '#A1A1AA', fontSize: '0.875rem', textAlign: 'center' }}>
              Los clientes pueden escanear este código QR para acceder directamente al menú
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button
            onClick={() => setShowQRDialog(false)}
            variant="contained"
            sx={{
              background: '#74ACDF',
              '&:hover': { background: '#5a9bd4' }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
