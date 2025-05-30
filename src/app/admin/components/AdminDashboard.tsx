'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useFirebaseAuth } from '../../../hooks/useFirebaseAuth';
import { useFirebaseMenu } from '../../../hooks/useFirebaseMenu';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import { initialProducts } from '../../data/initialProducts';

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const { 
    user, 
    loading: authLoading, 
    error: authError, 
    signIn, 
    signUp, 
    signOut,
    clearError 
  } = useFirebaseAuth();

  const {
    menus,
    products,
    loading: dataLoading,
    error: dataError,
    initializeDatabase,
    exportData
  } = useFirebaseMenu();

  useEffect(() => {
    if (!authLoading && !user) {
      setLoginOpen(true);
    }
  }, [user, authLoading]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogin = async () => {
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      setLoginOpen(false);
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch {
      // Error is handled by the hook
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleInitializeDatabase = async () => {
    try {
      const initialData = {
        menus: [
          {
            id: 'menu-1',
            name: 'Menú Principal',
            description: 'Nuestro delicioso menú con los mejores platos',
            isActive: true,
            categories: ['Entradas', 'Platos Principales', 'Postres', 'Bebidas'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        products: initialProducts.map(product => ({
          ...product,
          menuId: 'menu-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
      };

      await initializeDatabase(initialData);
      alert('Base de datos inicializada correctamente');
    } catch {
      alert('Error al inicializar la base de datos');
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
      a.download = 'menuqr-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Error al exportar datos');
    }
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isSignUp ? 'Crear Cuenta Admin' : 'Iniciar Sesión Admin'}
        </DialogTitle>
        <DialogContent>
          {authError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {authError}
            </Alert>
          )}
          
          {isSignUp && (
            <TextField
              fullWidth
              label="Nombre"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              margin="normal"
            />
          )}
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          
          <Button
            variant="text"
            onClick={() => setIsSignUp(!isSignUp)}
            sx={{ mt: 1 }}
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} variant="contained">
            {isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Dashboard */}
      {user && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Panel de Administración
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ mr: 2, display: 'inline' }}>
                Bienvenido, {user.displayName || user.email}
              </Typography>
              <Button variant="outlined" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Box>
          </Box>

          {(dataError || authError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {dataError || authError}
            </Alert>
          )}

          <Paper sx={{ mb: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Gestión de Base de Datos
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleInitializeDatabase}
                disabled={dataLoading}
              >
                Inicializar Base de Datos
              </Button>
              <Button
                variant="outlined"
                onClick={handleExportData}
                disabled={dataLoading}
              >
                Exportar Datos
              </Button>
            </Box>
          </Paper>

          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="admin tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Productos" />
              <Tab label="Categorías" />
              <Tab label="Estadísticas" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {dataLoading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <ProductManager products={products} menus={menus} />
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {dataLoading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <CategoryManager menus={menus} />
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Estadísticas del Sistema
              </Typography>
              <Box display="flex" gap={4}>
                <Paper sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="h4" color="primary">
                    {menus.length}
                  </Typography>
                  <Typography variant="body2">
                    Menús Activos
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, minWidth: 150 }}>
                  <Typography variant="h4" color="secondary">
                    {products.length}
                  </Typography>
                  <Typography variant="body2">
                    Productos Total
                  </Typography>
                </Paper>
              </Box>
            </TabPanel>
          </Paper>
        </>
      )}
    </Container>
  );
}
