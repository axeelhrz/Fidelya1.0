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
  Divider,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuData } from '../../types';
import { useDatabase } from '../../../hooks/useDatabase';
import MenuEditor from '../../components/MenuEditor';
import QRGenerator from '../../components/QRGenerator';

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { 
    menus, 
    loading, 
    error, 
    initializeDatabase, 
    getDatabaseInfo,
    refreshMenus 
  } = useDatabase();

  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
  const [showInitDialog, setShowInitDialog] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
    // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (isAuthenticated !== 'true') {
    router.push('/admin');
    }
  }, [router]);

  // Cargar información de la base de datos
  useEffect(() => {
    const loadDbInfo = async () => {
      const info = await getDatabaseInfo();
      setDbInfo(info);
  };
    loadDbInfo();
  }, [getDatabaseInfo]);

  // Seleccionar primer menú automáticamente
  useEffect(() => {
    if (menus.length > 0 && !selectedMenuId) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  // Actualizar menú seleccionado
  useEffect(() => {
    const menu = menus.find(m => m.id === selectedMenuId);
    setSelectedMenu(menu || null);
  }, [menus, selectedMenuId]);

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    router.push('/admin');
  };

  const handleInitializeDatabase = async () => {
    setInitLoading(true);
    try {
      await initializeDatabase(true);
      await refreshMenus();
      const info = await getDatabaseInfo();
      setDbInfo(info);
      setShowInitDialog(false);
    } catch (error) {
      console.error('Error inicializando base de datos:', error);
    } finally {
      setInitLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const dataStr = JSON.stringify(menus, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `menu-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando datos:', error);
    }
  };

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

            <Stack direction="row" spacing={2}>
              <Tooltip title="Actualizar datos">
                <IconButton
                  onClick={refreshMenus}
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

        {/* Estadísticas */}
        <MotionPaper variants={itemVariants} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Estadísticas de la Base de Datos
          </Typography>
          
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap={3}>
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
                      {dbInfo?.menusCount || 0}
                        </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Menús
                    </Typography>
    </Box>
                </Box>
              </CardContent>
            </MotionCard>

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
                      {dbInfo?.productsCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Productos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>

            <MotionCard
              whileHover={{ scale: 1.02 }}
              sx={{ 
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <StorageIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body1" fontWeight={600} color="secondary.main">
                      {dbInfo?.dbType || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Base de Datos
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>

            <MotionCard
              whileHover={{ scale: 1.02 }}
              sx={{ 
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <QrCodeIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body1" fontWeight={600} sx={{ color: '#8B5CF6' }}>
                      Tiempo Real
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Firebase
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Box>
        </MotionPaper>

        {/* Selector de menú y acciones */}
        <MotionPaper variants={itemVariants} sx={{ p: 3, mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
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
                        label={`${menu.products.length} productos`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<QrCodeIcon />}
                onClick={() => setShowQRGenerator(true)}
                disabled={!selectedMenu}
                sx={{ borderRadius: 2 }}
              >
                Generar QR
              </Button>

              {process.env.VERCEL !== '1' && (
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => setShowInitDialog(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Inicializar DB
                </Button>
              )}
            </Stack>
          </Stack>
        </MotionPaper>

        {/* Error */}
        {error && (
          <MotionPaper variants={itemVariants} sx={{ mb: 4 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          </MotionPaper>
        )}

        {/* Editor de menú */}
        {selectedMenu ? (
          <MotionPaper variants={itemVariants} sx={{ p: 3 }}>
            <MenuEditor 
              menuId={selectedMenu.id}
              onMenuUpdate={(menu) => setSelectedMenu(menu)}
            />
          </MotionPaper>
        ) : (
          <MotionPaper variants={itemVariants} sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {menus.length === 0 ? 'No hay menús disponibles' : 'Selecciona un menú para editar'}
            </Typography>
            {menus.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Inicializa la base de datos para comenzar
              </Typography>
            )}
          </MotionPaper>
        )}

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
              Esto sobrescribirá todos los datos existentes.
            </Typography>
          </DialogContent>
          <DialogActions>
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
              Inicializar
            </Button>
          </DialogActions>
        </Dialog>
      </MotionContainer>
    </Box>
  );
};

export default AdminDashboard;
