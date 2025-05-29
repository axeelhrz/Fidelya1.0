'use client';

import { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CodeIcon from '@mui/icons-material/Code';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DatabaseIcon from '@mui/icons-material/Storage';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';
import { Product, ProductCategory, MenuData } from '../../types';
import { useDatabase } from '../../../hooks/useDatabase';
import ProductForm from '../../components/ProductForm';
import QRGenerator from '../../components/QRGenerator';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionContainer = motion(Container);

export default function AdminDashboard() {
  const router = useRouter();
  const {
    loading,
    error,
    menus,
    createProduct,
    updateProduct,
    deleteProduct,
    initializeDatabase,
    refreshMenus,
  } = useDatabase();
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [currentMenu, setCurrentMenu] = useState<MenuData | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [showInitDialog, setShowInitDialog] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }
  }, [router]);
  useEffect(() => {
    // Seleccionar el primer menú disponible
    if (menus.length > 0 && !selectedMenuId) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  useEffect(() => {
    // Cargar el menú seleccionado
    if (selectedMenuId) {
      const menu = menus.find(m => m.id === selectedMenuId);
      setCurrentMenu(menu || null);
    }
  }, [selectedMenuId, menus]);

  const handleAddProduct = async (product: Product) => {
    if (!selectedMenuId) return;
    
    const success = await createProduct(product, selectedMenuId);
    if (success) {
      setSaveMessage('Producto agregado correctamente');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleEditProduct = async (product: Product) => {
    if (!selectedMenuId) return;
    
    const success = await updateProduct(product, selectedMenuId);
    if (success) {
      setSaveMessage('Producto actualizado correctamente');
    setTimeout(() => setSaveMessage(''), 3000);
          setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const success = await deleteProduct(productId);
    if (success) {
      setSaveMessage('Producto eliminado correctamente');
      setTimeout(() => setSaveMessage(''), 3000);
      setDeleteConfirm(null);
    }
  };

  const handleInitializeDatabase = async () => {
    const success = await initializeDatabase();
    if (success) {
      setSaveMessage('Base de datos inicializada correctamente');
      setTimeout(() => setSaveMessage(''), 3000);
      setShowInitDialog(false);
    }
  };

  const handleRefresh = async () => {
    await refreshMenus();
    setSaveMessage('Datos actualizados');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const exportMenuCode = () => {
    if (!currentMenu) return;

    const codeString = `'${selectedMenuId}': ${JSON.stringify(currentMenu, null, 2)},`;
    
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

  const products = currentMenu?.products || [];
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

  // Mostrar pantalla de carga
  if (loading && menus.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Cargando panel de administración...
          </Typography>
            </Stack>
          </Box>
                      );
  }

  // Mostrar opción de inicializar si no hay menús
  if (menus.length === 0 && !loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4 
              }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, maxWidth: 500 }}>
          <DatabaseIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Base de Datos Vacía
                </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No se encontraron menús en la base de datos. ¿Deseas inicializar con los datos por defecto?
                </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="outlined" 
              onClick={() => router.push('/admin')}
            >
              Volver al Login
                      </Button>
            <Button 
              variant="contained" 
              startIcon={<DatabaseIcon />}
              onClick={() => setShowInitDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
              }}
            >
              Inicializar Base de Datos
          </Button>
          </Stack>
        </Paper>
      </Box>
  );
}

  if (!currentMenu) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4 
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Menú no encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            El menú seleccionado no existe o no se pudo cargar.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="outlined" 
              onClick={() => router.push('/admin')}
            >
              Volver al Login
            </Button>
            <Button 
              variant="contained" 
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
            >
              Actualizar
            </Button>
          </Stack>
        </Paper>
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
              <Chip 
                label="Base de Datos Activa" 
                size="small" 
                sx={{ 
                  mt: 1,
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }} 
              />
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
                    {menus.map((menu) => (
                      <MenuItem key={menu.id} value={menu.id}>
                        {menu.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Stack direction="row" spacing={2} sx={{ flex: 1, justifyContent: { md: 'flex-end' } }} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<CodeIcon />}
                  onClick={exportMenuCode}
                >
                  Exportar Código
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DatabaseIcon />}
                  onClick={() => setShowInitDialog(true)}
                  color="warning"
                >
                  Reinicializar DB
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

        {/* Error de la base de datos */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={handleRefresh}>
                    Reintentar
                  </Button>
                }
              >
                {error}
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
                {products.length > 0 ? formatPrice(Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)) : '$0'}
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
                        disabled={loading}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteConfirm(product)}
                        disabled={loading}
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
          disabled={loading}
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
            Esta acción no se puede deshacer y se eliminará permanentemente de la base de datos.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteConfirm && handleDeleteProduct(deleteConfirm.id)}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de inicialización de base de datos */}
      <Dialog
        open={showInitDialog}
        onClose={() => setShowInitDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Inicializar Base de Datos
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Esta acción inicializará la base de datos con los datos por defecto del archivo menu.ts.
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
            ⚠️ Advertencia: Esto puede sobrescribir datos existentes.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ¿Estás seguro de que quieres continuar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInitDialog(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            color="warning"
            variant="contained"
            onClick={handleInitializeDatabase}
            disabled={loading}
            startIcon={<DatabaseIcon />}
          >
            {loading ? 'Inicializando...' : 'Inicializar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}