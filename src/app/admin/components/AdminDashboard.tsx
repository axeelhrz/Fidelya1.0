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
  Chip
} from '@mui/material';
import { CloudSync, CloudOff, Wifi, WifiOff } from '@mui/icons-material';
import { useFirebaseMenu } from '../../../hooks/useFirebaseMenu';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import { initialProducts } from '../../data/initialProducts';

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
  const { 
    menus,
    products,
    loading: dataLoading,
    error: dataError,
    connected,
    initializeDatabase,
    exportData
  } = useFirebaseMenu(undefined, true); // Habilitar tiempo real
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
      a.download = `menuqr-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Error al exportar datos');
    }
  };

  // Componente de estado de conexión
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
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Reintentar
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

      {/* Gestión de Base de Datos */}
      <Paper sx={{ mb: 4, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Gestión de Base de Datos
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
        
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={handleInitializeDatabase}
            disabled={dataLoading || !connected}
            startIcon={dataLoading ? <CircularProgress size={16} /> : undefined}
          >
            {dataLoading ? 'Inicializando...' : 'Inicializar Base de Datos'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleExportData}
            disabled={dataLoading || !connected}
          >
            Exportar Datos
          </Button>
        </Box>
        
        {!connected && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Las operaciones de base de datos requieren conexión activa con Firebase
          </Alert>
        )}
      </Paper>

      {/* Tabs del Dashboard */}
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Productos (${products.length})`} />
          <Tab label={`Categorías (${menus.length})`} />
          <Tab label="Estadísticas" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {dataLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4} gap={2}>
              <CircularProgress />
              <Typography>Cargando productos en tiempo real...</Typography>
            </Box>
          ) : (
            <ProductManager products={products} menus={menus} />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {dataLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4} gap={2}>
              <CircularProgress />
              <Typography>Cargando menús en tiempo real...</Typography>
            </Box>
          ) : (
            <CategoryManager menus={menus} />
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
                Menús Activos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {connected ? 'Tiempo real' : 'Última actualización'}
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
              <Typography variant="h3" color="secondary" gutterBottom>
                {products.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Productos Total
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {products.filter(p => p.isAvailable).length} disponibles
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
                Los cambios se reflejan automáticamente en el menú público y en este panel de administración.
              </Typography>
            </Alert>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
}