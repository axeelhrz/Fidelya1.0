'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Container, Alert, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { MenuData } from '../types';
import MenuContent from './MenuContent';

const MotionContainer = motion(Container);
export default function MenuPage() {
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/menus');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          setMenus(data.data);
          // Seleccionar el primer menú por defecto
          setSelectedMenu(data.data[0]);
        } else {
          setError('No se encontraron menús disponibles');
        }
      } catch (err) {
        console.error('Error fetching menus:', err);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

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

  if (!selectedMenu) {
    return (
      <MotionContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{ py: 4 }}
      >
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          No hay menús disponibles
        </Alert>
      </MotionContainer>
    );
  }

  // Si hay múltiples menús, mostrar selector
  if (menus.length > 1) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      }}>
        {/* Selector de menús */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {menus.map((menu) => (
              <Button
                key={menu.id}
                variant={selectedMenu.id === menu.id ? 'contained' : 'outlined'}
                onClick={() => setSelectedMenu(menu)}
                size="small"
              >
                {menu.name}
              </Button>
            ))}
          </Stack>
        </Box>
        
        <MenuContent menu={selectedMenu} />
      </Box>
    );
  }

  return <MenuContent menu={selectedMenu} />;
}