'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Fab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CodeIcon from '@mui/icons-material/Code';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useRouter } from 'next/navigation';
import { Product, ProductCategory } from '../../types';
import { getMenuById, getAvailableMenuIds } from '../../../data/menu';
import ProductForm from '../../components/ProductForm';
import QRGenerator from '../../components/QRGenerator';
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionContainer = motion(Container);

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('default');

  const currentMenu = getMenuById(selectedMenuId);
  const availableMenus = getAvailableMenuIds();

  const loadMenuData = useCallback(() => {
    // Cargar desde localStorage si existe, sino desde el archivo
    const storageKey = `menu-${selectedMenuId}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProducts(parsedData);
    } else if (currentMenu) {
      setProducts([...currentMenu.products]);
    }
    
    // Guardar estado original
    if (currentMenu) {
      setOriginalProducts([...currentMenu.products]);
    }
  }, [selectedMenuId, currentMenu]);

  const saveToLocalStorage = () => {
    const storageKey = `menu-${selectedMenuId}`;
    localStorage.setItem(storageKey, JSON.stringify(products));
    setSaveMessage('Cambios guardados en localStorage');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const restoreOriginal = useCallback(() => {
    setProducts([...originalProducts]);
    // Guardar estado original
    if (currentMenu) {
      setOriginalProducts([...currentMenu.products]);
    }
  }, [originalProducts, currentMenu]);

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }
    loadMenuData();
  }, [selectedMenuId, router, loadMenuData]);

  useEffect(() => {
    // Verificar si hay cambios
    const hasModifications = JSON.stringify(products) !== JSON.stringify(originalProducts);
    setHasChanges(hasModifications);
  }, [products, originalProducts]);

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const handleEditProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setDeleteConfirm(null);
  };

  const exportMenuCode = () => {
    const menuData = {
      id: selectedMenuId,
      name: currentMenu?.name || 'Menú',
      description: currentMenu?.description || 'Descripción del menú',
      products: products
    };

    const codeString = `'${selectedMenuId}': ${JSON.stringify(menuData, null, 2)},`;
    
    navigator.clipboard.writeText(codeString).then(() => {
      setSaveMessage('Código del menú copiado al portapapeles');
      setTimeout(() => setSaveMessage(''), 3000);
    });
  };

  const logout = () => {
    localStorage.removeItem('admin-authenticated');
    router.push('/admin');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const productsByCategory = ['Entrada', 'Principal', 'Bebida', 'Postre'].map(category => ({
    category: category as ProductCategory,
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    }
  };

  if (!currentMenu) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Menú no encontrado
              </Typography>
            </Box>
                  );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      pb: 10,
    }}>
      <MotionContainer 
        maxWidth="lg" 
        sx={{ pt: 4 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
                  >
        {/* Header */}
        <MotionPaper
          variants={itemVariants}
          elevation={3}
            sx={{ 
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
            color: '#FFFFFF',
            }}
          >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                Panel de Administración
          </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Gestiona el menú: {currentMenu.name}
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<QrCodeIcon />}
                onClick={() => setShowQRGenerator(true)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#FFFFFF',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
}
                }}
              >
                Generar QR
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExitToAppIcon />}
                onClick={logout}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#FFFFFF',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Salir
              </Button>
            </Stack>
          </Box>
        </MotionPaper>

        {/* Selector de Menú y Controles */}
        <MotionPaper
          variants={itemVariants}
          elevation={2}
          sx={{ p: 3, mb: 4, borderRadius: 3 }}
        >
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { md: 'center' } }}>
              <Box sx={{ minWidth: 250 }}>
                <FormControl fullWidth>
                  <InputLabel>Seleccionar Menú</InputLabel>
                  <Select
                    value={selectedMenuId}
                    onChange={(e) => setSelectedMenuId(e.target.value)}
                    label="Seleccionar Menú"
                  >
                    {availableMenus.map((menuId) => {
                      const menu = getMenuById(menuId);
                      return (
                        <MenuItem key={menuId} value={menuId}>
                          {menu?.name || menuId}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              
              <Stack direction="row" spacing={2} sx={{ flex: 1, justifyContent: { md: 'flex-end' } }} flexWrap="wrap">
                {hasChanges && (
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={saveToLocalStorage}
                    sx={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      }
                    }}
                  >
                    Guardar Cambios
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={restoreOriginal}
                  disabled={!hasChanges}
                >
                  Restaurar Original
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<CodeIcon />}
                  onClick={exportMenuCode}
                >
                  Exportar Código
                </Button>
              </Stack>
            </Box>
          </Stack>
        </MotionPaper>

        {/* Mensaje de estado */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="success" 
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setSaveMessage('')}
              >
                {saveMessage}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estadísticas */}
        <MotionPaper
          variants={itemVariants}
          elevation={2}
          sx={{ p: 3, mb: 4, borderRadius: 3 }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Estadísticas del Menú
          </Typography>
          <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {products.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Productos
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" color="secondary" fontWeight="bold">
                {products.filter(p => p.isRecommended).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recomendados
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {products.filter(p => p.isVegan).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Veganos
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {formatPrice(Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Precio Promedio
              </Typography>
            </Box>
          </Stack>
        </MotionPaper>

        {/* Productos por Categoría */}
        {productsByCategory.map((group) => (
          <MotionPaper
            key={group.category}
            variants={itemVariants}
            elevation={2}
            sx={{ p: 3, mb: 4, borderRadius: 3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                {group.category} ({group.products.length})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowProductForm(true)}
                size="small"
              >
                Agregar
              </Button>
            </Box>

            {group.products.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4, 
                color: 'text.secondary',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
              }}>
                <RestaurantMenuIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">
                  No hay productos en esta categoría
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Haz clic en &quot;Agregar&quot; para crear el primer producto
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {group.products.map((product, index) => (
                  <MotionCard
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    elevation={1}
                    sx={{
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                      }
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="h6" color="secondary.main" fontWeight="bold">
                          {formatPrice(product.price)}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                        {product.description}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {product.isRecommended && (
                          <Chip 
                            label="Recomendado" 
                            size="small" 
                            color="secondary"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {product.isVegan && (
                          <Chip 
                            label="Vegano" 
                            size="small" 
                            color="success"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Stack>
                    </CardContent>
                    
                    <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteConfirm(product)}
                      >
                        Eliminar
                      </Button>
                    </CardActions>
                  </MotionCard>
                ))}
              </Stack>
            )}
          </MotionPaper>
        ))}

        {/* FAB para agregar producto */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }
          }}
          onClick={() => setShowProductForm(true)}
        >
          <AddIcon />
        </Fab>
      </MotionContainer>

      {/* Formulario de Producto */}
      <ProductForm
        open={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
        menuId={selectedMenuId}
      />

      {/* Generador de QR */}
      <Dialog
        open={showQRGenerator}
        onClose={() => setShowQRGenerator(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Código QR del Menú
          </Typography>
        </DialogTitle>
        <DialogContent>
          <QRGenerator 
            menuId={selectedMenuId} 
            menuName={currentMenu.name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQRGenerator(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación de eliminación */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Confirmar Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar &quot;{deleteConfirm?.name}&quot;?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteConfirm && handleDeleteProduct(deleteConfirm.id)}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}