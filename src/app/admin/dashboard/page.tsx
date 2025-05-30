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
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  QrCode as QrCodeIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';
import SimpleMenuEditor from '../../components/SimpleMenuEditor';

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { 
    menus, 
    loading, 
    error, 
    refreshData,
    initializeDatabase,
    exportData
  } = useAdminDashboard();

  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [initLoading, setInitLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  // Verificar autenticación de forma más robusta
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const authStatus = localStorage.getItem('admin-authenticated');
        
        if (authStatus === 'true') {
          setIsAuthenticated(true);
        } else {
          // Si no está autenticado, redirigir inmediatamente
          setIsAuthenticated(false);
          router.replace('/admin');
          return;
        }
    } catch (error) {
        // Si hay error accediendo al localStorage, redirigir
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        router.replace('/admin');
        return;
      } finally {
        setIsCheckingAuth(false);
    }
  };

    // Verificar inmediatamente al montar el componente
    checkAuthentication();

    // También verificar cuando la ventana recupera el foco
    const handleFocus = () => {
      checkAuthentication();
};

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
};
  }, [router]);

  // Verificar autenticación periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      const authStatus = localStorage.getItem('admin-authenticated');
      if (authStatus !== 'true') {
        setIsAuthenticated(false);
        router.replace('/admin');
      }
    }, 5000); // Verificar cada 5 segundos

    return () => clearInterval(interval);
  }, [router]);

  // Seleccionar primer menú automáticamente
  useEffect(() => {
    if (isAuthenticated && menus.length > 0 && !selectedMenuId) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId, isAuthenticated]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('admin-authenticated');
      setIsAuthenticated(false);
      router.replace('/admin');
    } catch (error) {
      console.error('Error during logout:', error);
      // Forzar redirección incluso si hay error
      router.replace('/admin');
    }
  };

  const handleInitializeDatabase = async () => {
    // Verificar autenticación antes de ejecutar acciones sensibles
    const authStatus = localStorage.getItem('admin-authenticated');
    if (authStatus !== 'true') {
      router.replace('/admin');
      return;
    }

    setInitLoading(true);
    try {
      await initializeDatabase(true);
      await refreshData();
    } catch (error) {
      console.error('Error inicializando base de datos:', error);
    } finally {
      setInitLoading(false);
    }
  };

  const handleExportData = async () => {
    // Verificar autenticación antes de exportar
    const authStatus = localStorage.getItem('admin-authenticated');
    if (authStatus !== 'true') {
      router.replace('/admin');
      return;
    }

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
      }
    } catch (error) {
      console.error('Error exportando datos:', error);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isCheckingAuth || !isAuthenticated) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#1C1C1E'
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} sx={{ color: '#3B82F6' }} />
          <Typography variant="body2" color="#A1A1AA">
            {isCheckingAuth ? 'Verificando autenticación...' : 'Redirigiendo...'}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <MotionContainer 
        maxWidth="xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{ py: 4 }}
      >
        {/* Header */}
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                  Editor de Menú
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Edita tus productos de forma simple y rápida
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
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

        {/* Selector de menú */}
        {menus.length > 0 && (
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            sx={{ p: 3, mb: 4 }}
          >
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
          </MotionPaper>
        )}

        {/* Contenido principal */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        ) : selectedMenuId ? (
          <SimpleMenuEditor menuId={selectedMenuId} />
        ) : (
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 6, textAlign: 'center' }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {menus.length === 0 ? 'No hay menús disponibles' : 'Selecciona un menú para editar'}
            </Typography>
            {menus.length === 0 && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Inicializa la base de datos para comenzar
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={handleInitializeDatabase}
                  disabled={initLoading}
                >
                  {initLoading ? 'Inicializando...' : 'Inicializar Base de Datos'}
                </Button>
              </>
            )}
          </MotionPaper>
        )}
      </MotionContainer>
    </Box>
  );
};

export default AdminDashboard;