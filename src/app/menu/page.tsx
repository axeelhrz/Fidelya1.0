'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography, Container, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import MenuViewer from '../components/MenuViewer';
import { getMenuById } from '../../data/menu';
import { Product } from '../types';

interface MenuData {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

const MotionBox = motion(Box);

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
        
        // Cargar desde datos estáticos
        const staticMenu = getMenuById(menuId);
        
        if (staticMenu) {
          setMenuData(staticMenu);
        } else {
          // Intentar cargar desde API como fallback
          try {
          const response = await fetch(`/api/menus/${menuId}`);
          if (response.ok) {
            const apiMenu = await response.json();
            setMenuData(apiMenu);
          } else {
            setError('Menú no encontrado');
          }
          } catch (apiError) {
            console.error('Error cargando desde API:', apiError);
        setError('Error al cargar el menú');
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
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#1C1C1E',
          px: 3
        }}
    >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: '#3B82F6',
            mb: 3,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
    />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#A1A1AA',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
            Cargando menú...
          </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#A1A1AA',
            textAlign: 'center',
            mt: 1,
            opacity: 0.7
          }}
        >
          Preparando la experiencia perfecta
        </Typography>
      </MotionBox>
    );
  }

  if (error || !menuData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#1C1C1E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3
        }}
      >
        <Container maxWidth="sm">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert 
              severity="error"
              sx={{ 
                borderRadius: 4,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#F87171',
                '& .MuiAlert-icon': {
                  color: '#F87171'
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {error || 'Menú no encontrado'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Por favor, escanea un código QR válido o verifica el ID del menú.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, fontFamily: 'monospace' }}>
                ID solicitado: {menuId}
              </Typography>
            </Alert>
          </MotionBox>
        </Container>
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
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#1C1C1E'
          }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#3B82F6',
              mb: 3
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#A1A1AA',
              textAlign: 'center'
            }}
          >
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
