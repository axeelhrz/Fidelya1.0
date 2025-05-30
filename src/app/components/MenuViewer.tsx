'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Stack, CircularProgress, Alert, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Product } from '../types';
import MenuSection from './MenuSection';

const MotionBox = motion(Box);

export default function MenuViewer() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menus');
        if (!response.ok) {
          throw new Error('Error al cargar el menú');
        }
        const menus = await response.json();
        if (menus.length > 0) {
          setMenu(menus[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#1C1C1E'
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CircularProgress 
            size={48} 
            sx={{ 
              color: '#3B82F6',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#A1A1AA',
              fontSize: '1rem'
            }}
          >
            Cargando menú...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#F87171'
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!menu) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert 
          severity="info"
          sx={{ 
            borderRadius: 3,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#60A5FA'
          }}
        >
          No hay menú disponible
        </Alert>
      </Container>
    );
  }

  // Agrupar productos por categoría
  const groupedProducts = menu.products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: '#1C1C1E',
        py: 4
      }}
    >
      <Container maxWidth="md">
        {/* Header del menú */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          sx={{ mb: 6, textAlign: 'center' }}
        >
          <Typography 
            variant="titleMedium" 
            sx={{ 
              mb: 2,
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {menu.name}
          </Typography>
          
          {menu.description && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#A1A1AA',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              {menu.description}
            </Typography>
          )}
        </MotionBox>

        {/* Secciones del menú */}
        <AnimatePresence>
          <Stack spacing={5}>
            {Object.entries(groupedProducts).map(([category, products], index) => (
              <MenuSection
                key={category}
                title={category}
                products={products}
                index={index}
              />
            ))}
          </Stack>
        </AnimatePresence>
      </Container>
    </Box>
  );
}
