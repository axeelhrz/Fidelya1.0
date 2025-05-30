'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';
import { prepareInitialData } from '../../lib/firebaseInitialData';

interface DebugInfo {
  menusCount?: number;
  productsCount?: number;
  connected?: boolean;
  error?: string | null;
  menus?: Array<{ id: string; name: string }>;
  firstProducts?: Array<{ id: string; name: string; menuId: string }>;
}

interface DebugMenu {
  id: string;
  name: string;
}

interface DebugProduct {
  id: string;
  name: string;
  menuId: string;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [loading, setLoading] = useState(true);
  
  const { 
    menus, 
    products, 
    loading: dataLoading, 
    error, 
    connected,
    initializeDatabase,
    createMenu
  } = useFirebaseMenu(undefined, undefined, true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebugInfo({
        menusCount: menus.length,
        productsCount: products.length,
        connected,
        error,
        menus: menus.map(m => ({ id: m.id, name: m.name })),
        firstProducts: products.slice(0, 3).map(p => ({ id: p.id, name: p.name, menuId: p.menuId }))
      });
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [menus, products, connected, error]);

  const handleCreateTestMenu = async () => {
    try {
      const menuData = {
        name: 'Xs Reset - Bar & Resto',
        description: 'Tragos de autor, picadas y buena onda en el corazón de la ciudad',
        isActive: true,
        categories: [],
        restaurantInfo: {
          name: 'Xs Reset',
          address: 'Av. Principal 123, Ciudad',
          phone: '+54 11 1234-5678',
          hours: 'Lun-Dom 18:00-02:00'
        }
      };

      const menuId = await createMenu(menuData);
      console.log('Menu created with ID:', menuId);
      
      // Inicializar con datos de ejemplo
      const initialData = prepareInitialData(menuId);
      await initializeDatabase(initialData);
      
      alert(`Menú creado con ID: ${menuId}`);
    } catch (error) {
      console.error('Error creating menu:', error);
      alert('Error al crear el menú');
    }
  };

  const handleInitializeWithId = async () => {
    const menuId = 'xs-reset-menu';
    try {
      // Crear menú con ID específico
      const menuData = {
        name: 'Xs Reset - Bar & Resto',
        description: 'Tragos de autor, picadas y buena onda en el corazón de la ciudad',
        isActive: true,
        categories: [],
        restaurantInfo: {
          name: 'Xs Reset',
          address: 'Av. Principal 123, Ciudad',
          phone: '+54 11 1234-5678',
          hours: 'Lun-Dom 18:00-02:00'
        }
      };

      // Usar el primer menú existente o crear uno nuevo
      let targetMenuId = menuId;
      if (menus.length > 0) {
        targetMenuId = menus[0].id;
      } else {
        targetMenuId = await createMenu(menuData);
      }
      
      const initialData = prepareInitialData(targetMenuId);
      await initializeDatabase(initialData);
      
      alert(`Datos inicializados para menú: ${targetMenuId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al inicializar datos');
    }
  };

  if (loading || dataLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando información de debug...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Debug Firebase
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Estado de Conexión
        </Typography>
        <Typography>
          Conectado: {connected ? '✅ Sí' : '❌ No'}
        </Typography>
        <Typography>
          Cargando: {dataLoading ? '⏳ Sí' : '✅ No'}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Datos
        </Typography>
        <Typography>Menús: {debugInfo.menusCount}</Typography>
        <Typography>Productos: {debugInfo.productsCount}</Typography>
        
        {debugInfo.menus && debugInfo.menus.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Menús encontrados:</Typography>
            {debugInfo.menus.map((menu: DebugMenu) => (
              <Typography key={menu.id} variant="body2">
                - {menu.name} (ID: {menu.id})
              </Typography>
            ))}
          </Box>
        )}

        {debugInfo.firstProducts && debugInfo.firstProducts.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Primeros productos:</Typography>
            {debugInfo.firstProducts.map((product: DebugProduct) => (
              <Typography key={product.id} variant="body2">
                - {product.name} (MenuID: {product.menuId})
              </Typography>
            ))}
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Acciones de Debug
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={handleCreateTestMenu}
            disabled={!connected}
          >
            Crear Menú de Prueba
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleInitializeWithId}
            disabled={!connected}
          >
            Inicializar Datos Completos
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => window.location.reload()}
          >
            Recargar Página
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información Técnica
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </Paper>
    </Box>
  );
}