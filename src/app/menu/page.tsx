'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Typography, Alert, CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { MenuData } from '../types';
import MenuContent from './MenuContent';

const MotionContainer = motion(Container);
export default function MenuPage() {
  const searchParams = useSearchParams();
  const menuId = searchParams.get('id') || 'menu-bar-noche'; // ID por defecto
  
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/menus/${menuId}`);
        const data = await response.json();
        
        if (data.success) {
          setMenu(data.data);
        } else {
          setError(data.error || 'Error cargando el menú');
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (menuId) {
      fetchMenu();
    }
  }, [menuId]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <MotionContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{ py: 4 }}
      >
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </MotionContainer>
    );
  }

  if (!menu) {
    return (
      <MotionContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{ py: 4 }}
      >
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Menú no encontrado
        </Alert>
      </MotionContainer>
    );
  }

  return <MenuContent menu={menu} />;
}