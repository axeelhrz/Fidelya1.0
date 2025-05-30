'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Add, Refresh, Inventory2, Category, Assessment, Settings, ExitToApp, AdminPanelSettings, Restaurant, Download, DataUsage } from '@mui/icons-material';
import { useFirebaseMenu } from '../../../hooks/useFirebaseMenu';
import { useFirebaseCategories } from '../../../hooks/useFirebaseCategories';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import { prepareInitialData } from '../../../lib/firebaseInitialData';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
interface AdminDashboardProps {
  onLogout: () => void;
}

type DashboardView = 'main' | 'products' | 'categories' | 'stats';
export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>('main');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDescription, setNewMenuDescription] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const { 
    menus,
    products,
    loading: dataLoading,
    error: dataError,
    connected,
    createMenu,
    initializeDatabase,
    exportData,
    refreshData
  } = useFirebaseMenu(undefined, undefined, true);

  const {
    categories,
    loading: categoriesLoading
  } = useFirebaseCategories(selectedMenuId, true);

  // Seleccionar el primer menú disponible automáticamente
  React.useEffect(() => {
    if (menus.length > 0 && !selectedMenuId) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  const handleCreateMenu = async () => {
    if (!newMenuName.trim() || !newMenuDescription.trim()) return;

    try {
      const menuData = {
        name: newMenuName,
        description: newMenuDescription,
            isActive: true,
        categories: [],
        restaurantInfo: {
          name: newMenuName,
          address: '',
          phone: '',
          hours: ''
          }
      };

      const menuId = await createMenu(menuData);
      setSelectedMenuId(menuId);
      setShowCreateMenu(false);
      setNewMenuName('');
      setNewMenuDescription('');
    } catch (error) {
      console.error('Error creating menu:', error);
      alert('Error al crear el menú');
    }
      };

  const handleInitializeWithSampleData = async () => {
    if (!selectedMenuId) {
      alert('Primero debes crear un menú');
      return;
    }
    try {
      const initialData = prepareInitialData(selectedMenuId);
      const validatedData = {
        ...initialData,
        products: initialData.products.map(product => ({
          ...product,
          name: 'Sample Product',
          price: 0,
          category: 'General',
          isAvailable: true
        }))
      };
      await initializeDatabase(validatedData);
      alert('Menú inicializado con datos de ejemplo');
    } catch (error) {
      console.error('Error initializing:', error);
      alert('Error al inicializar el menú');
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `menuqr-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar datos');
    }
  };

  const ConnectionStatus = () => (
    <Chip
      icon={connected ? <Wifi /> : <WifiOff />}
      label={connected ? 'Tiempo Real Activo' : 'Sin Conexión'}
      color={connected ? 'success' : 'error'}
      variant={connected ? 'filled' : 'outlined'}
      size="small"
      sx={{
        fontWeight: 600,
        '& .MuiChip-icon': {
          fontSize: '1rem'
        }
      }}
    />
  );

  const currentMenu = menus.find(m => m.id === selectedMenuId);
  const menuProducts = products.filter(p => p.menuId === selectedMenuId);

  // Vista principal del dashboard
  const MainDashboardView = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
        >
      {/* Header con logo y título */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box
                  sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            mb: 3,
            border: '2px solid #D4AF37',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                  }}
              >
          <AdminPanelSettings sx={{ color: '#D4AF37', fontSize: 40 }} />
            </Box>
          
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            color: '#F8F8F8',
            mb: 1,
            letterSpacing: '0.02em'
          }}
                  >
          Panel de Control
            </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#B8B8B8',
            mb: 4,
            maxWidth: 600,
            mx: 'auto'
          }}
          >
          Administra tu menú digital de forma sencilla e intuitiva
        </Typography>

        {/* Línea decorativa */}
        <Box
          sx={{
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            mx: 'auto',
            mb: 4
          }}
        />
      </Box>

      {/* Selector de menú */}
      {menus.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <Restaurant sx={{ fontSize: 48, color: '#D4AF37', mb: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            No hay menús creados
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Crea tu primer menú para comenzar a gestionar productos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateMenu(true)}
            disabled={!connected}
            size="large"
          >
            Crear Primer Menú
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Menú Activo
            </Typography>
            <ConnectionStatus />
          </Box>
          
          {currentMenu && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ color: '#D4AF37' }}>
                {currentMenu.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {currentMenu.description}
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setShowCreateMenu(true)}
                  disabled={!connected}
                >
                  Nuevo Menú
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleExportData}
                  disabled={dataLoading || !connected}
                  startIcon={<Download />}
                >
                  Exportar Datos
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* Tarjetas principales de gestión */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
{/* Gestión de Productos */}
<Grid item xs={12} md={6}>
  <MotionCard
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    sx={{
      height: '100%',
      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0.8) 100%)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      cursor: 'pointer',
      '&:hover': {
        border: '1px solid rgba(212, 175, 55, 0.4)',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.1)'
      }
    }}
  >
    <CardActionArea 
      onClick={() => setCurrentView('products')}
      disabled={!selectedMenuId}
      sx={{ height: '100%', p: 4 }}
    >
      <CardContent sx={{ textAlign: 'center', p: 0 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            mb: 3,
            border: '2px solid #D4AF37',
            background: 'rgba(212, 175, 55, 0.1)',
          }}
        >
          <Inventory2 sx={{ fontSize: 40, color: '#D4AF37' }} />
        </Box>
        
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Gestión de Productos
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Agrega, edita y administra los productos de tu menú
        </Typography>
        
        <Chip 
          label={`${menuProducts.length} productos`}
          color="primary"
          variant="outlined"
        />
      </CardContent>
    </CardActionArea>
  </MotionCard>
</Grid>

        {/* Gestión de Categorías */}
        <Grid item xs={12} md={6}>
          <MotionCard
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0.8) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              cursor: 'pointer',
              '&:hover': {
                border: '1px solid rgba(212, 175, 55, 0.4)',
                boxShadow: '0 8px 32px rgba(212, 175, 55, 0.1)'
              }
            }}
          >
            <CardActionArea 
              onClick={() => setCurrentView('categories')}
              disabled={!selectedMenuId}
              sx={{ height: '100%', p: 4 }}
            >
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    mb: 3,
                    border: '2px solid #D4AF37',
                    background: 'rgba(212, 175, 55, 0.1)',
                  }}
                >
                  <Category sx={{ fontSize: 40, color: '#D4AF37' }} />
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Gestión de Categorías
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Organiza y administra las categorías de tu menú
                </Typography>
                
                <Chip 
                  label={`${categories.length} categorías`}
                  color="primary"
                  variant="outlined"
                />
              </CardContent>
            </CardActionArea>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Acciones Rápidas */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Acciones Rápidas
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => setCurrentView('stats')}
              disabled={!selectedMenuId}
              sx={{ py: 2 }}
            >
              Ver Estadísticas
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DataUsage />}
              onClick={handleInitializeWithSampleData}
              disabled={dataLoading || !connected || !selectedMenuId}
              sx={{ py: 2 }}
            >
              {dataLoading ? 'Cargando...' : 'Datos de Ejemplo'}
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={refreshData}
              disabled={dataLoading || !connected}
              sx={{ py: 2 }}
            >
              Actualizar Datos
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Settings />}
              disabled
              sx={{ py: 2 }}
            >
              Configuración
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </MotionBox>
  );

  // Vista de estadísticas
  const StatsView = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Estadísticas del Sistema
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCurrentView('main')}
          startIcon={<Settings />}
        >
          Volver al Panel
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" gutterBottom>
              {menus.length}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Menús Totales
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {menus.filter(m => m.isActive).length} activos
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="secondary" gutterBottom>
              {menuProducts.length}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Productos en Menú
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {menuProducts.filter(p => p.isAvailable).length} disponibles
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="info.main" gutterBottom>
              {categories.length}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Categorías
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {categories.filter(c => c.isActive).length} activas
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color={connected ? 'success.main' : 'error.main'} gutterBottom>
              {connected ? 'ON' : 'OFF'}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Estado Firebase
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {connected ? 'Conectado' : 'Desconectado'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {connected && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Tiempo Real Activo
          </Typography>
          <Typography variant="body2">
            Los cambios se reflejan automáticamente en el menú público y en este panel.
          </Typography>
        </Alert>
      )}
    </MotionBox>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      position: 'relative'
    }}>
      {/* Fondo elegante */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.02) 0%, transparent 50%),
            linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(16, 16, 16, 1) 100%)
          `,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
        {/* Header del Dashboard */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            {currentView !== 'main' && (
              <IconButton
                onClick={() => setCurrentView('main')}
                sx={{ 
                  color: '#D4AF37',
                  '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' }
                }}
              >
                <Settings />
              </IconButton>
            )}
            <Typography variant="h6" color="text.secondary">
              Administrador
            </Typography>
          </Box>
          
          <Tooltip title="Cerrar Sesión">
            <IconButton
              onClick={onLogout}
              sx={{ 
                color: '#F8F8F8',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ExitToApp />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Alertas de error */}
        <AnimatePresence>
          {dataError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={refreshData}>
                    <Refresh />
                  </Button>
                }
              >
                <Typography variant="subtitle2" gutterBottom>
                  Error de conexión con Firebase
                </Typography>
                <Typography variant="body2">
                  {dataError}
                </Typography>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido principal basado en la vista actual */}
        <AnimatePresence mode="wait">
          {currentView === 'main' && <MainDashboardView />}
          
          {currentView === 'products' && selectedMenuId && (
            <MotionBox
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">
                  Gestión de Productos
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setCurrentView('main')}
                  startIcon={<Settings />}
                >
                  Volver al Panel
                </Button>
              </Box>
              
              {dataLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" p={4} gap={2}>
                  <CircularProgress />
                  <Typography>Cargando productos en tiempo real...</Typography>
                </Box>
              ) : (
                <ProductManager 
                  products={menuProducts} 
                  menus={menus}
                  selectedMenuId={selectedMenuId}
                />
              )}
            </MotionBox>
          )}

          {currentView === 'categories' && selectedMenuId && (
            <MotionBox
              key="categories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">
                  Gestión de Categorías
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setCurrentView('main')}
                  startIcon={<Settings />}
                >
                  Volver al Panel
                </Button>
              </Box>
              
              {categoriesLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" p={4} gap={2}>
                  <CircularProgress />
                  <Typography>Cargando categorías en tiempo real...</Typography>
                </Box>
              ) : (
                <CategoryManager 
                  menus={menus}
                  selectedMenuId={selectedMenuId}
                  categories={categories}
                />
              )}
            </MotionBox>
          )}

          {currentView === 'stats' && (
            <StatsView />
          )}
        </AnimatePresence>

        {/* Dialog para crear menú */}
        <Dialog open={showCreateMenu} onClose={() => setShowCreateMenu(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Crear Nuevo Menú</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                fullWidth
                label="Nombre del Menú"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                placeholder="Ej: Menú Principal"
                required
              />
              <TextField
                fullWidth
                label="Descripción"
                value={newMenuDescription}
                onChange={(e) => setNewMenuDescription(e.target.value)}
                placeholder="Ej: Nuestro delicioso menú con los mejores platos"
                multiline
                rows={3}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateMenu(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateMenu}
              variant="contained"
              disabled={!newMenuName.trim() || !newMenuDescription.trim() || !connected}
            >
              Crear Menú
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}