'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import MenuViewer from '../components/MenuViewer';
import { getMenuById } from '../../data/menu';
import { Product } from '../types';

interface MenuData {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

const MenuPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const menuId = searchParams.get('id') || 'menu-bar';
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar cargar desde datos estáticos primero
        const staticMenu = getMenuById(menuId);
        
        if (staticMenu) {
          setMenuData(staticMenu);
        } else {
          // Si no se encuentra en datos estáticos, intentar cargar desde API
          const response = await fetch(`/api/menus/${menuId}`);
          if (response.ok) {
            const apiMenu = await response.json();
            setMenuData(apiMenu);
          } else {
            setError('Menú no encontrado');
          }
        }
      } catch (err) {
        console.error('Error cargando menú:', err);
        setError('Error al cargar el menú');
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [menuId]);

  if (loading) {
    return (
      <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Cargando menú...
          </Typography>
        </Box>
    );
  }

  if (error || !menuData) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ px: 2 }}
    >
        <Typography variant="h5" color="error" gutterBottom>
          {error || 'Menú no encontrado'}
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Por favor, escanea un código QR válido o verifica el ID del menú.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          ID solicitado: {menuId}
        </Typography>
      </Box>
  );
  }

  return (
    <MenuViewer
      products={menuData.products}
      menuName={menuData.name}
      menuDescription={menuData.description}
    />
  );
};

const MenuPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Cargando menú...
          </Typography>
        </Box>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
};

export default MenuPage;
