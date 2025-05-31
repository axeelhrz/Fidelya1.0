'use client';

import React, { useState, useEffect } from 'react';
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
  useTheme,
  useMediaQuery,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Add, 
  Refresh, 
  Inventory2, 
  Category, 
  Assessment, 
  Settings, 
  ExitToApp, 
  AdminPanelSettings, 
  Restaurant, 
  Download, 
  DataUsage,
  QrCode,
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';
import { useFirebaseCategories } from '../../hooks/useFirebaseCategories';
import ProductManager from './components/ProductManager';
import CategoryManager from './components/CategoryManager';
import QRMenuGenerator from './components/QRMenuGenerator';
import { prepareInitialData } from '../../lib/firebaseInitialData';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

type DashboardView = 'main' | 'products' | 'categories' | 'stats' | 'qr';

// Simple login component
const LoginForm = ({ onLogin, loading, error }: { 
  onLogin: (password: string) => void; 
  loading: boolean; 
  error: string | null; 
}) => {
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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

      <Container maxWidth="sm" sx={{ position: 'relative' }}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            p: { xs: 3, md: 4 },
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0.8) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            textAlign: 'center'
          }}
        >
          <Box
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              mb: 3,
              border: '2px solid #D4AF37',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
            mx: 'auto',
              width: 'fit-content'
          }}
        >
            <AdminPanelSettings sx={{ color: '#D4AF37', fontSize: 40 }} />
      </Box>

          <Typography 
            variant={isMobile ? "h5" : "h4"}
            sx={{ 
              fontWeight: 700,
                    color: '#F8F8F8',
              mb: 1,
              letterSpacing: '0.02em',
              textAlign: 'center'
            }}
            >
            Panel de Administración
                </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#B8B8B8',
              mb: 4,
              textAlign: 'center'
            }}
            >
            Ingresa la contraseña para acceder
                </Typography>

          <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                required
              disabled={loading}
              sx={{
                mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              />
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
                {error}
              </Alert>
            )}

            <Button 
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !password.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{
                py: 1.5,
                borderRadius: 0,
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              '&:hover': {
                  background: 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
              },
            }}
          >
              {loading ? 'Verificando...' : 'Acceder'}
            </Button>
          </form>
        </MotionPaper>
      </Container>
    </Box>
  );
};

// Main page component - this is what Next.js expects
export default function AdminPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Dashboard state
  const [currentView, setCurrentView] = useState<DashboardView>('main');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDescription, setNewMenuDescription] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if already authenticated on mount
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

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
  } = useFirebaseMenu(undefined, undefined, isAuthenticated);

  const {
    categories,
    loading: categoriesLoading
  } = useFirebaseCategories(selectedMenuId, isAuthenticated);

  // Seleccionar el primer menú disponible automáticamente
  React.useEffect(() => {
    if (menus.length > 0 && !selectedMenuId) {
      setSelectedMenuId(menus[0].id);
}
  }, [menus, selectedMenuId]);

  const handleLogin = async (password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      setAuthError('Contraseña incorrecta');
    }
    
    setAuthLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setCurrentView('main');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} loading={authLoading} error={authError} />;
  }

  // ... rest of existing code remains the same
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

  // Navegación para móviles
  const navigationItems = [
    { id: 'main', label: 'Panel Principal', icon: <DashboardIcon /> },
    { id: 'products', label: 'Productos', icon: <Inventory2 /> },
    { id: 'categories', label: 'Categorías', icon: <Category /> },
    { id: 'qr', label: 'Códigos QR', icon: <QrCode /> },
    { id: 'stats', label: 'Estadísticas', icon: <Assessment /> },
  ];

  const MobileNavigation = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: '#1A1A1A',
          border: 'none',
          borderRight: '1px solid rgba(212, 175, 55, 0.2)',
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <AdminPanelSettings sx={{ color: '#D4AF37', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: '#F8F8F8', fontWeight: 600 }}>
            Panel Admin
          </Typography>
        </Box>
        <ConnectionStatus />
      </Box>
      
      <List sx={{ px: 2, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            button
            onClick={() => {
              setCurrentView(item.id as DashboardView);
              setMobileMenuOpen(false);
            }}
            sx={{
              borderRadius: 0,
              mb: 1,
              backgroundColor: currentView === item.id ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              border: currentView === item.id ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
              },
            }}
            disabled={!selectedMenuId && (item.id === 'products' || item.id === 'categories' || item.id === 'qr')}
          >
            <ListItemIcon sx={{ color: currentView === item.id ? '#D4AF37' : '#B8B8B8', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              sx={{ 
                '& .MuiListItemText-primary': { 
                  color: currentView === item.id ? '#D4AF37' : '#F8F8F8',
                  fontWeight: currentView === item.id ? 600 : 400,
                  fontSize: '0.9rem'
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExitToApp />}
          onClick={handleLogout}
          sx={{
            borderRadius: 0,
            borderColor: 'rgba(212, 175, 55, 0.3)',
            color: '#D4AF37',
            '&:hover': {
              borderColor: 'rgba(212, 175, 55, 0.5)',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
            },
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Drawer>
  );

  // Vista principal del dashboard
  const MainDashboardView = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header con logo y título */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Box
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1.5, md: 2 },
            mb: { xs: 2, md: 3 },
            border: '2px solid #D4AF37',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
          }}
        >
          <AdminPanelSettings sx={{ color: '#D4AF37', fontSize: { xs: 32, md: 40 } }} />
        </Box>
        
        <Typography 
          variant={isMobile ? "h4" : "h3"}
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
            mx: 'auto',
            px: { xs: 2, md: 0 }
          }}
        >
          Administra tu menú digital de forma sencilla e intuitiva
        </Typography>

        {/* Línea decorativa */}
        <Box
          sx={{
            width: { xs: 60, md: 80 },
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            mx: 'auto',
            mb: 4
          }}
        />
      </Box>

      {/* Selector de menú */}
      {menus.length === 0 ? (
        <MotionPaper 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', mb: 4 }}
        >
          <Restaurant sx={{ fontSize: { xs: 40, md: 48 }, color: '#D4AF37', mb: 2 }} />
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom color="text.secondary">
            No hay menús creados
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3} sx={{ px: { xs: 1, md: 0 } }}>
            Crea tu primer menú para comenzar a gestionar productos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateMenu(true)}
            disabled={!connected}
            size={isMobile ? "medium" : "large"}
            sx={{
              borderRadius: 0,
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
            }}
          >
            Crear Primer Menú
          </Button>
        </MotionPaper>
      ) : (
        <MotionPaper 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          sx={{ p: { xs: 2, md: 3 }, mb: 4 }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <Typography variant="h6">
              Menú Activo
            </Typography>
            <ConnectionStatus />
          </Box>
          
          {currentMenu && (
            <Box>
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ color: '#D4AF37' }}>
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
                  size={isMobile ? "small" : "medium"}
                  sx={{ borderRadius: 0 }}
                >
                  Nuevo Menú
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleExportData}
                  disabled={dataLoading || !connected}
                  startIcon={<Download />}
                  size={isMobile ? "small" : "medium"}
                  sx={{ borderRadius: 0 }}
                >
                  Exportar Datos
                </Button>
              </Box>
            </Box>
          )}
        </MotionPaper>
      )}

      {/* Tarjetas principales de gestión */}
      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 4 }}>
        {/* Gestión de Productos */}
        <Grid item xs={12} sm={6} lg={3}>
          <MotionCard
            whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -4 }}
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
              sx={{ height: '100%', p: { xs: 2, md: 4 } }}
            >
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 60, md: 80 },
                    height: { xs: 60, md: 80 },
                    mb: { xs: 2, md: 3 },
                    border: '2px solid #D4AF37',
                    background: 'rgba(212, 175, 55, 0.1)',
                  }}
                >
                  <Inventory2 sx={{ fontSize: { xs: 28, md: 40 }, color: '#D4AF37' }} />
                </Box>
                
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: 600 }}>
                  Productos
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  Gestiona los productos de tu menú
                </Typography>
                
                <Chip 
                  label={`${menuProducts.length} productos`}
                  color="primary"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </CardContent>
            </CardActionArea>
          </MotionCard>
        </Grid>

        {/* Gestión de Categorías */}
        <Grid item xs={12} sm={6} lg={3}>
          <MotionCard
            whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -4 }}
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
              sx={{ height: '100%', p: { xs: 2, md: 4 } }}
            >
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 60, md: 80 },
                    height: { xs: 60, md: 80 },
                    mb: { xs: 2, md: 3 },
                    border: '2px solid #D4AF37',
                    background: 'rgba(212, 175, 55, 0.1)',
                  }}
                >
                  <Category sx={{ fontSize: { xs: 28, md: 40 }, color: '#D4AF37' }} />
                </Box>
                
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: 600 }}>
                  Categorías
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  Organiza las categorías de tu menú
                </Typography>
                
                <Chip 
                  label={`${categories.length} categorías`}
                  color="primary"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
              </CardContent>
            </CardActionArea>
          </MotionCard>
        </Grid>

        {/* Códigos QR */}
        <Grid item xs={12} sm={6} lg={3}>
          <MotionCard
            whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(26, 26, 26, 0.8) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              cursor: 'pointer',
              '&:hover': {
                border: '1px solid rgba(59, 130, 246, 0.4)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
              }
            }}
          >
            <CardActionArea 
              onClick={() => setCurrentView('qr')}
              disabled={!selectedMenuId}
              sx={{ height: '100%', p: { xs: 2, md: 4 } }}
            >
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 60, md: 80 },
                    height: { xs: 60, md: 80 },
                    mb: { xs: 2, md: 3 },
                    border: '2px solid #3B82F6',
                    background: 'rgba(59, 130, 246, 0.1)',
                  }}
                >
                  <QrCode sx={{ fontSize: { xs: 28, md: 40 }, color: '#3B82F6' }} />
                </Box>
                
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: 600 }}>
                  Códigos QR
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  Genera códigos QR para tus menús
                </Typography>
                
                <Chip 
                  label="Nuevo"
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#3B82F6',
                    fontWeight: 600,
                  }}
                  size={isMobile ? "small" : "medium"}
                />
              </CardContent>
            </CardActionArea>
          </MotionCard>
        </Grid>

        {/* Estadísticas */}
        <Grid item xs={12} sm={6} lg={3}>
          <MotionCard
            whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(26, 26, 26, 0.8) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              cursor: 'pointer',
              '&:hover': {
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)'
              }
            }}
          >
            <CardActionArea 
              onClick={() => setCurrentView('stats')}
              disabled={!selectedMenuId}
              sx={{ height: '100%', p: { xs: 2, md: 4 } }}
            >
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 60, md: 80 },
                    height: { xs: 60, md: 80 },
                    mb: { xs: 2, md: 3 },
                    border: '2px solid #10B981',
                    background: 'rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <Assessment sx={{ fontSize: { xs: 28, md: 40 }, color: '#10B981' }} />
                </Box>
                
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: 600 }}>
                  Estadísticas
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  Analiza el rendimiento de tu menú
                </Typography>
                
                <Chip 
                  label="Reportes"
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    fontWeight: 600,
                  }}
                  size={isMobile ? "small" : "medium"}
                />
              </CardContent>
            </CardActionArea>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Acciones Rápidas */}
      <MotionPaper 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        sx={{ p: { xs: 3, md: 4 } }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Acciones Rápidas
        </Typography>
        
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => setCurrentView('stats')}
              disabled={!selectedMenuId}
              sx={{ py: { xs: 1.5, md: 2 }, borderRadius: 0 }}
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
              sx={{ py: { xs: 1.5, md: 2 }, borderRadius: 0 }}
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
              sx={{ py: { xs: 1.5, md: 2 }, borderRadius: 0 }}
            >
              Actualizar Datos
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<QrCode />}
              onClick={() => setCurrentView('qr')}
              disabled={!selectedMenuId}
              sx={{ py: { xs: 1.5, md: 2 }, borderRadius: 0 }}
            >
              Generar QR
            </Button>
          </Grid>
        </Grid>
      </MotionPaper>
    </MotionBox>
  );

  // Vista de estadísticas
  const StatsView = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant={isMobile ? "h5" : "h4"}>
          Estadísticas del Sistema
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCurrentView('main')}
          startIcon={<Settings />}
          sx={{ borderRadius: 0 }}
        >
          Volver al Panel
        </Button>
      </Box>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
            <Typography variant={isMobile ? "h4" : "h3"} color="primary" gutterBottom>
              {menus.length}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
              Menús Totales
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {menus.filter(m => m.isActive).length} activos
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
            <Typography variant={isMobile ? "h4" : "h3"} color="secondary" gutterBottom>
              {menuProducts.length}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
              Productos en Menú
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {menuProducts.filter(p => p.isAvailable).length} disponibles
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
            <Typography variant={isMobile ? "h4" : "h3"} color="info.main" gutterBottom>
              {categories.length}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
              Categorías
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {categories.filter(c => c.isActive).length} activas
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
            <Typography variant={isMobile ? "h4" : "h3"} color={connected ? 'success.main' : 'error.main'} gutterBottom>
              {connected ? 'ON' : 'OFF'}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
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

      {/* Header móvil */}
      {isMobile && (
        <AppBar 
          position="sticky" 
          sx={{ 
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
            boxShadow: 'none',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2, color: '#D4AF37' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, color: '#F8F8F8' }}>
              {currentView === 'main' && 'Panel de Control'}
              {currentView === 'products' && 'Productos'}
              {currentView === 'categories' && 'Categorías'}
              {currentView === 'qr' && 'Códigos QR'}
              {currentView === 'stats' && 'Estadísticas'}
            </Typography>
            <ConnectionStatus />
          </Toolbar>
        </AppBar>
      )}

      {/* Navegación móvil */}
      <MobileNavigation />

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, position: 'relative' }}>
        {/* Header del Dashboard para desktop */}
        {!isMobile && (
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
            
            <Box display="flex" alignItems="center" gap={2}>
              <ConnectionStatus />
              <Tooltip title="Cerrar Sesión">
                <IconButton
                  onClick={handleLogout}
                  sx={{ 
                    color: '#F8F8F8',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <ExitToApp />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Typography variant={isMobile ? "h5" : "h4"}>
                  Gestión de Productos
                </Typography>
                {!isMobile && (
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentView('main')}
                    startIcon={<Settings />}
                    sx={{ borderRadius: 0 }}
                  >
                    Volver al Panel
                  </Button>
                )}
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Typography variant={isMobile ? "h5" : "h4"}>
                  Gestión de Categorías
                </Typography>
                {!isMobile && (
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentView('main')}
                    startIcon={<Settings />}
                    sx={{ borderRadius: 0 }}
                  >
                    Volver al Panel
                  </Button>
                )}
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

          {currentView === 'qr' && selectedMenuId && (
            <MotionBox
              key="qr"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <QRMenuGenerator 
                menus={menus}
                onBack={() => setCurrentView('main')}
              />
            </MotionBox>
          )}

          {currentView === 'stats' && (
            <StatsView />
          )}
        </AnimatePresence>

        {/* Dialog para crear menú */}
        <Dialog 
          open={showCreateMenu} 
          onClose={() => setShowCreateMenu(false)} 
          maxWidth="sm" 
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 0,
              backgroundColor: '#2C2C2E',
              backgroundImage: 'none',
              border: isMobile ? 'none' : '1px solid rgba(212, 175, 55, 0.2)',
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" sx={{ color: '#F8F8F8' }}>
                Crear Nuevo Menú
              </Typography>
              {isMobile && (
                <IconButton onClick={() => setShowCreateMenu(false)} sx={{ color: '#B8B8B8' }}>
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={1}>
              <TextField
                fullWidth
                label="Nombre del Menú"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                placeholder="Ej: Menú Principal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            {!isMobile && (
              <Button onClick={() => setShowCreateMenu(false)} sx={{ color: '#B8B8B8' }}>
                Cancelar
              </Button>
            )}
            <Button 
              onClick={handleCreateMenu}
              variant="contained"
              disabled={!newMenuName.trim() || !newMenuDescription.trim() || !connected}
              sx={{ 
                borderRadius: 0,
                flex: isMobile ? 1 : 'none',
              }}
            >
              Crear Menú
            </Button>
          </DialogActions>
        </Dialog>

        {/* FAB para móviles */}
        {isMobile && currentView === 'main' && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              backgroundColor: '#D4AF37',
              '&:hover': {
                backgroundColor: '#E8C547',
              },
            }}
            onClick={() => setShowCreateMenu(true)}
            disabled={!connected}
          >
            <Add />
          </Fab>
        )}
      </Container>
    </Box>
  );
}