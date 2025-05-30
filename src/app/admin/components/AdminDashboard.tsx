'use client';

import React, { useState } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { CloudSync, CloudOff, Wifi, WifiOff, Add, Refresh } from '@mui/icons-material';
import { useFirebaseMenu } from '../../../hooks/useFirebaseMenu';
import { useFirebaseCategories } from '../../../hooks/useFirebaseCategories';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import { prepareInitialData } from '../../../lib/firebaseInitialData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AdminDashboardProps {
  onLogout: () => void;
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

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [tabValue, setTabValue] = useState(0);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
      // Ensure products have all required properties
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header del Dashboard */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Panel de Administración
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <ConnectionStatus />
            <Typography variant="body2" color="text.secondary">
              {connected ? 'Actualizaciones en tiempo real' : 'Modo offline'}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Administrador
          </Typography>
          <Button variant="outlined" onClick={onLogout}>
            Cerrar Sesión
          </Button>
        </Box>
      </Box>

      {dataError && (
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
      )}

      {/* Selector de Menú */}
      <Paper sx={{ mb: 4, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Gestión de Menús
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {connected ? (
              <CloudSync color="success" fontSize="small" />
            ) : (
              <CloudOff color="error" fontSize="small" />
            )}
            <Typography variant="body2" color={connected ? 'success.main' : 'error.main'}>
              {connected ? 'Sincronizado' : 'Desconectado'}
            </Typography>
          </Box>
        </Box>
        
        {menus.length === 0 ? (
          <Box textAlign="center" py={4}>
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
            >
              Crear Primer Menú
            </Button>
          </Box>
        ) : (
          <Box>
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              {menus.map((menu) => (
                <Chip
                  key={menu.id}
                  label={menu.name}
                  onClick={() => setSelectedMenuId(menu.id)}
                  color={selectedMenuId === menu.id ? 'primary' : 'default'}
                  variant={selectedMenuId === menu.id ? 'filled' : 'outlined'}
                  sx={{ 
                    minHeight: 40,
                    fontSize: '0.875rem',
                    fontWeight: selectedMenuId === menu.id ? 600 : 400
                  }}
                />
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setShowCreateMenu(true)}
                disabled={!connected}
                size="small"
              >
                Nuevo Menú
              </Button>
            </Box>
          
            {currentMenu && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Menú Activo: <strong>{currentMenu.name}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {currentMenu.description}
              </Typography>
                
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    onClick={handleInitializeWithSampleData}
                    disabled={dataLoading || !connected}
                    startIcon={dataLoading ? <CircularProgress size={16} /> : undefined}
                  >
                    {dataLoading ? 'Inicializando...' : 'Cargar Datos de Ejemplo'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleExportData}
                    disabled={dataLoading || !connected}
                  >
                    Exportar Datos
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
        
        {!connected && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Las operaciones requieren conexión activa con Firebase
          </Alert>
        )}
      </Paper>

      {/* Tabs del Dashboard */}
      {selectedMenuId && (
        <Paper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="admin tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={`Productos (${menuProducts.length})`} />
            <Tab label={`Categorías (${categories.length})`} />
            <Tab label="Estadísticas" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
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
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
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
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Estadísticas del Sistema
            </Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
              <Paper sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
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
              
              <Paper sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
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
              
              <Paper sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
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
              
              <Paper sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
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
            </Box>
            
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
          </TabPanel>
        </Paper>
      )}

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
  );
}