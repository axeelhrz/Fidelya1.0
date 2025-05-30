'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Alert, CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useFirebaseMenuById } from '../../hooks/useFirebaseMenu';
import MenuContent from './MenuContent';
import { MenuData } from '../types';

const MotionContainer = motion(Container);

export default function MenuPageContent() {
  const searchParams = useSearchParams();
  const menuId = searchParams.get('id') || 'menu-bar-noche'; // ID por defecto
  
  // Usar el hook de Firebase para tiempo real
  const { menu, products, loading, error, connected } = useFirebaseMenuById(menuId);
  const [menuData, setMenuData] = useState<MenuData | null>(null);

  // Helper function para convertir fechas de manera segura
  const convertToISOString = (date: Date | string | undefined): string => {
    if (!date) return new Date().toISOString();
    if (date instanceof Date) return date.toISOString();
    if (typeof date === 'string') return date;
    return new Date().toISOString();
    };

  // Convertir datos de Firebase al formato esperado por MenuContent
  useEffect(() => {
    if (menu && products) {
      const convertedMenuData: MenuData = {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        isActive: menu.isActive,
        products: products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          category: product.category,
          image: (product as { image?: string }).image || '',
          isAvailable: product.isAvailable ?? true,
          menuId: product.menuId || menu.id
        })),
        createdAt: convertToISOString(menu.createdAt),
        updatedAt: convertToISOString(menu.updatedAt)
      };
      setMenuData(convertedMenuData);
    }
  }, [menu, products]);

  // Estado de conexión
  const ConnectionStatus = () => {
    if (!connected && !loading) {
    return (
        <Box sx={{ 
          position: 'fixed', 
          top: 16, 
          right: 16, 
          zIndex: 9999,
          backgroundColor: 'rgba(244, 67, 54, 0.9)',
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: 1,
          fontSize: '0.875rem',
          fontWeight: 500
      }}>
          Sin conexión en tiempo real
      </Box>
    );
  }

    if (connected) {
    return (
        <Box sx={{ 
          position: 'fixed', 
          top: 16, 
          right: 16, 
          zIndex: 9999,
          backgroundColor: 'rgba(76, 175, 80, 0.9)',
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: 1,
          fontSize: '0.875rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'white',
              animation: 'pulse 2s infinite'
            }}
          />
          Tiempo real activo
        </Box>
    );
  }

    return null;
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        gap: 3
      }}>
        <CircularProgress size={60} sx={{ color: '#D4AF37' }} />
        <Typography sx={{ 
          color: '#B8B8B8', 
          fontSize: '1.125rem',
          fontWeight: 500,
          textAlign: 'center'
        }}>
          Cargando menú en tiempo real...
        </Typography>
        <Typography sx={{ 
          color: '#666', 
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          Conectando con Firebase
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <>
        <ConnectionStatus />
        <MotionContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{ py: 4 }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              color: '#f44336'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Error de conexión
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
              Verifica tu conexión a internet y la configuración de Firebase
            </Typography>
          </Alert>
        </MotionContainer>
      </>
    );
}

  if (!menuData) {
    return (
      <>
        <ConnectionStatus />
        <MotionContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{ py: 4 }}
        >
          <Alert 
            severity="warning" 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              color: '#ff9800'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Menú no encontrado
            </Typography>
            <Typography variant="body2">
              El menú con ID &quot;{menuId}&quot; no existe o no está disponible.
            </Typography>
          </Alert>
        </MotionContainer>
      </>
    );
  }

  return (
    <>
      <ConnectionStatus />
      <MenuContent menu={menuData} />
      
      {/* Estilos para animaciones */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}