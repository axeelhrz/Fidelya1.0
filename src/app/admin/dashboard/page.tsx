'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Badge,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  LinearProgress,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  QrCode as QrCodeIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Backup as BackupIcon,
  CloudSync as CloudSyncIcon,
  NotificationsActive as NotificationsIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuData, Menu } from '../../types';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';
import MenuEditor from '../../components/MenuEditor';
import QRGenerator from '../../components/QRGenerator';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { 
    menus, 
    statistics,
    loading, 
    error, 
    refreshData,
    createMenu,
    updateMenu,
    deleteMenu,
    duplicateMenu,
    initializeDatabase,
    exportData
  } = useAdminDashboard();

  // Estados del dashboard
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showInitDialog, setShowInitDialog] = useState(false);
  const [showCreateMenuDialog, setShowCreateMenuDialog] = useState(false);
  const [showDeleteMenuDialog, setShowDeleteMenuDialog] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const [initLoading, setInitLoading] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Estados para crear menú
  const [newMenuData, setNewMenuData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (isAuthenticated !== 'true') {
      router.push('/admin');
    }
  }, [router]);

  // Seleccionar primer menú automáticamente
  useEffect(() => {
    if (menus.length > 0 && !selectedMenuId) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  // Actualizar menú seleccionado
  useEffect(() => {
    const menu = menus.find(m => m.id === selectedMenuId);
    if (menu) {
      // Convertir Menu a MenuData (agregar productos vacíos si no existen)
      setSelectedMenu({
        ...menu,
        products: []
      });
    } else {
      setSelectedMenu(null);
    }
  }, [menus, selectedMenuId]);

  // Agregar notificación
  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== message));
    }, 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    router.push('/admin');
  };

  const handleInitializeDatabase = async () => {
    setInitLoading(true);
    try {
      await initializeDatabase();
      await refreshData();
      setShowInitDialog(false);
      addNotification('Base de datos inicializada exitosamente');
    } catch (error) {
      console.error('Error inicializando base de datos:', error);
      addNotification('Error al inicializar la base de datos');
    } finally {
      setInitLoading(false);
    }
  };

  const handleCreateMenu = async () => {
    if (!newMenuData.name.trim()) {
      addNotification('El nombre del menú es requerido');
      return;
    }

    try {
      const menu = await createMenu(newMenuData);
      if (menu) {
        setSelectedMenuId(menu.id);
        setShowCreateMenuDialog(false);
        setNewMenuData({ name: '', description: '', isActive: true });
        addNotification('Menú creado exitosamente');
      }
    } catch (error) {
      console.error('Error creando menú:', error);
      addNotification('Error al crear el menú');
    }
  };

  const handleDeleteMenu = async () => {
    if (!menuToDelete) return;

    try {
      await deleteMenu(menuToDelete.id);
      if (selectedMenuId === menuToDelete.id) {
        setSelectedMenuId('');
      }
      setShowDeleteMenuDialog(false);
      setMenuToDelete(null);
      addNotification('Menú eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando menú:', error);
      addNotification('Error al eliminar el menú');
    }
  };

  const handleDuplicateMenu = async (menuId: string, menuName: string) => {
    try {
      const duplicatedMenu = await duplicateMenu(menuId, `Copia de ${menuName}`);
      if (duplicatedMenu) {
        addNotification('Menú duplicado exitosamente');
      }
    } catch (error) {
      console.error('Error duplicando menú:', error);
      addNotification('Error al duplicar el menú');
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      if (data) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `menu-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        addNotification('Datos exportados exitosamente');
      }
    } catch (error) {
      console.error('Error exportando datos:', error);
      addNotification('Error al exportar los datos');
    }
  };

  const speedDialActions = [
    {
      icon: <AddIcon />,
      name: 'Crear Menú',
      onClick: () => setShowCreateMenuDialog(true),
    },
    {
      icon: <QrCodeIcon />,
      name: 'Generar QR',
      onClick: () => setShowQRGenerator(true),
      disabled: !selectedMenu,
    },
    {
      icon: <DownloadIcon />,
      name: 'Exportar Datos',
      onClick: handleExportData,
    },
    {
      icon: <RefreshIcon />,
      name: 'Actualizar',
      onClick: refreshData,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Notificaciones */}
      <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: 8 }}
            >
              <Alert 
                severity="success" 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                onClose={() => setNotifications(prev => prev.filter(n => n !== notification))}
              >
                {notification}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      <MotionContainer 
        maxWidth="xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 4 }}
      >
        {/* Header */}
        <MotionPaper
          variants={itemVariants}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <DashboardIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Panel de Administración
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestiona tu menú en tiempo real con Firebase
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Badge badgeContent={notifications.length} color="error">
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
              </Badge>

              <Tooltip title="Actualizar datos">
                <IconButton
                  onClick={refreshData}
                  disabled={loading}
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Exportar datos">
                <IconButton
                  onClick={handleExportData}
                  disabled={menus.length === 0}
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ borderRadius: 2 }}
              >
                Cerrar Sesión
              </Button>
            </Stack>
          </Box>
        </MotionPaper>

        {/* Estadísticas principales */}
        {statistics && (
          <MotionPaper variants={itemVariants} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Estadísticas Generales
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  sx={{ 
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <RestaurantIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                      <Box>
                        <Typography variant="h4" fontWeight={700} color="primary.main">
                          {statistics.totalMenus}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Menús
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  sx={{ 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <AnalyticsIcon sx={{ color: 'success.main', fontSize: 28 }} />
                      <Box>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                          {statistics.totalProducts}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Productos
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  sx={{ 
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <VisibilityIcon sx={{ color: '#22c55e', fontSize: 28 }} />
                      <Box>
                        <Typography variant="h4" fontWeight={700} sx={{ color: '#22c55e' }}>
                          {statistics.availableProducts}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Disponibles
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  sx={{ 
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <TrendingUpIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                      <Box>
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                          {statistics.recommendedProducts}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Recomendados
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            </Grid>

            {/* Progreso de disponibilidad */}
            <Box sx={{ mt: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Productos Disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {statistics.availableProducts} / {statistics.totalProducts}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(statistics.availableProducts / statistics.totalProducts) * 100}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
          </MotionPaper>
        )}

        {/* Tabs de navegación */}
        <MotionPaper variants={itemVariants} sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            sx={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              },
            }}
          >
            <Tab label="Editor de Menú" />
            <Tab label="Gestión de Menús" />
            <Tab label="Configuración" />
          </Tabs>

          {/* Panel 1: Editor de Menú */}
          <TabPanel value={currentTab} index={0}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            ) : (
              <Box>
                {/* Selector de menú */}
                <Box sx={{ mb: 3 }}>
                  <FormControl sx={{ minWidth: 300 }}>
                    <InputLabel>Seleccionar Menú</InputLabel>
                    <Select
                      value={selectedMenuId}
                      onChange={(e) => setSelectedMenuId(e.target.value)}
                      label="Seleccionar Menú"
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

                {/* Editor de menú */}
                {selectedMenu ? (
                  <MenuEditor 
                    menuId={selectedMenu.id}
                    onMenuUpdate={(menu) => setSelectedMenu(menu)}
                  />
                ) : (
                  <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      {menus.length === 0 ? 'No hay menús disponibles' : 'Selecciona un menú para editar'}
                    </Typography>
                    {menus.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Crea un nuevo menú o inicializa la base de datos para comenzar
                      </Typography>
                    )}
                  </Paper>
                )}
              </Box>
            )}
          </TabPanel>

          {/* Panel 2: Gestión de Menús */}
          <TabPanel value={currentTab} index={1}>
            <Stack spacing={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                  Gestión de Menús
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateMenuDialog(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Crear Menú
                </Button>
              </Box>

              <Grid container spacing={3}>
                {menus.map((menu) => (
                  <Grid item xs={12} md={6} lg={4} key={menu.id}>
                    <MotionCard
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        height: '100%',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Typography variant="h6" fontWeight={600}>
                            {menu.name}
                          </Typography>
                          <Chip 
                            label={menu.isActive ? 'Activo' : 'Inactivo'}
                            size="small"
                            color={menu.isActive ? 'success' : 'default'}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {menu.description}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Creado: {menu.createdAt ? new Date(menu.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>

                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Editar menú">
                              <IconButton
                                size="small"
                                onClick={() => setSelectedMenuId(menu.id)}
                                sx={{
                                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Duplicar menú">
                              <IconButton
                                size="small"
                                onClick={() => handleDuplicateMenu(menu.id, menu.name)}
                                sx={{
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                                }}
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Generar QR">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedMenuId(menu.id);
                                  setShowQRGenerator(true);
                                }}
                                sx={{
                                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.2)' },
                                }}
                              >
                                <QrCodeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Eliminar menú">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setMenuToDelete(menu);
                                  setShowDeleteMenuDialog(true);
                                }}
                                sx={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>

                          <Switch
                            checked={menu.isActive ?? true}
                            onChange={(e) => updateMenu(menu.id, { isActive: e.target.checked })}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>

              {menus.length === 0 && (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    No hay menús disponibles
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Crea tu primer menú o inicializa la base de datos con datos de ejemplo
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setShowCreateMenuDialog(true)}
                    >
                      Crear Menú
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => setShowInitDialog(true)}
                    >
                      Inicializar DB
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </TabPanel>

          {/* Panel 3: Configuración */}
          <TabPanel value={currentTab} index={2}>
            <Stack spacing={4}>
              <Typography variant="h6" fontWeight={600}>
                Configuración del Sistema
              </Typography>

              {/* Configuración de la base de datos */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Base de Datos
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <StorageIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle2">Estado de Firebase</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Conexión en tiempo real activa
                      </Typography>
                      <Chip label="Conectado" color="success" size="small" />
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <CloudSyncIcon sx={{ color: 'success.main' }} />
                        <Typography variant="subtitle2">Sincronización</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Datos sincronizados automáticamente
                      </Typography>
                      <Chip label="Tiempo Real" color="success" size="small" />
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<BackupIcon />}
                    onClick={handleExportData}
                    disabled={menus.length === 0}
                  >
                    Exportar Backup
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={() => setShowInitDialog(true)}
                    color="warning"
                  >
                    Reinicializar DB
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={refreshData}
                  >
                    Actualizar Datos
                  </Button>
                </Stack>
              </Paper>

              {/* Configuración de QR */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Códigos QR
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Genera códigos QR personalizados para cada menú con opciones avanzadas de diseño y configuración.
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<QrCodeIcon />}
                    onClick={() => setShowQRGenerator(true)}
                    disabled={!selectedMenu}
                  >
                    Generar QR
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    disabled={!selectedMenu}
                  >
                    Descargar Todos los QR
                  </Button>
                </Stack>
              </Paper>

              {/* Estadísticas detalladas */}
              {statistics && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Estadísticas Detalladas
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Distribución por Categorías
                      </Typography>
                      <Stack spacing={1}>
                        {Object.entries(statistics.productsByCategory).map(([category, count]) => (
                          <Box key={category} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">{category}</Typography>
                            <Chip label={count} size="small" />
                          </Box>
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Resumen de Productos
                      </Typography>
                      <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Total de productos:</Typography>
                          <Typography variant="body2" fontWeight={600}>{statistics.totalProducts}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Productos disponibles:</Typography>
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            {statistics.availableProducts}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Productos recomendados:</Typography>
                          <Typography variant="body2" fontWeight={600} color="warning.main">
                            {statistics.recommendedProducts}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Productos veganos:</Typography>
                          <Typography variant="body2" fontWeight={600} color="info.main">
                            {statistics.veganProducts}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Stack>
          </TabPanel>
        </MotionPaper>

        {/* SpeedDial para acciones rápidas */}
        <SpeedDial
          ariaLabel="Acciones del dashboard"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          icon={<SpeedDialIcon />}
        >
          {speedDialActions
            .filter((action) => !action.disabled)
            .map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
        </SpeedDial>

        {/* Dialog para crear menú */}
        <Dialog
          open={showCreateMenuDialog}
          onClose={() => setShowCreateMenuDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: '#2C2C2E',
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Crear Nuevo Menú
            </Typography>
          </DialogTitle>
          
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Nombre del menú"
                value={newMenuData.name}
                onChange={(e) => setNewMenuData({ ...newMenuData, name: e.target.value })}
                fullWidth
                required
              />

              <TextField
                label="Descripción"
                value={newMenuData.description}
                onChange={(e) => setNewMenuData({ ...newMenuData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={newMenuData.isActive}
                    onChange={(e) => setNewMenuData({ ...newMenuData, isActive: e.target.checked })}
                  />
                }
                label="Menú activo"
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setShowCreateMenuDialog(false)}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleCreateMenu}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!newMenuData.name.trim()}
            >
              Crear Menú
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para eliminar menú */}
        <Dialog
          open={showDeleteMenuDialog}
          onClose={() => setShowDeleteMenuDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: '#2C2C2E',
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Confirmar Eliminación
            </Typography>
          </DialogTitle>
          
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres eliminar el menú &quot;{menuToDelete?.name}&quot;?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Esta acción eliminará el menú y todos sus productos. No se puede deshacer.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setShowDeleteMenuDialog(false)}
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleDeleteMenu}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para generar QR */}
        <Dialog
          open={showQRGenerator}
          onClose={() => setShowQRGenerator(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: '#2C2C2E',
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Generador de Código QR
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedMenu && (
              <QRGenerator
                menuId={selectedMenu.id}
                menuName={selectedMenu.name}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowQRGenerator(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para inicializar base de datos */}
        <Dialog
          open={showInitDialog}
          onClose={() => !initLoading && setShowInitDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: '#2C2C2E',
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Inicializar Base de Datos
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres inicializar la base de datos con datos de ejemplo?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Esto creará un menú de ejemplo con productos predefinidos. Los datos existentes no se verán afectados.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setShowInitDialog(false)}
              disabled={initLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleInitializeDatabase}
              variant="contained"
              disabled={initLoading}
              startIcon={initLoading ? <CircularProgress size={16} /> : <UploadIcon />}
            >
              {initLoading ? 'Inicializando...' : 'Inicializar'}
            </Button>
          </DialogActions>
        </Dialog>
      </MotionContainer>
    </Box>
  );
};

export default AdminDashboard;