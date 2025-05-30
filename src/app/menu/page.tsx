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
  const menuId = searchParams.get('id') || 'xs-reset-menu';
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
            setError('Menú no encontrado');
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
          backgroundColor: '#0A0A0A',
          px: 3
        }}
    >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: '#D4AF37',
            mb: 3,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
    />
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: "'Playfair Display', serif",
            color: '#F8F8F8',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            mb: 1
          }}
        >
          Cargando Carta Digital...
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: "'Inter', sans-serif",
            color: '#B8B8B8',
            textAlign: 'center',
            opacity: 0.8,
            fontStyle: 'italic'
            }}
          >
          Preparando la experiencia Xs Reset
          </Typography>
      </MotionBox>
    );
  }

  if (error || !menuData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
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
                borderRadius: 0,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                fontFamily: "'Inter', sans-serif",
                '& .MuiAlert-icon': {
                  color: '#F87171'
                }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600
                }}
              >
                {error || 'Menú no encontrado'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Por favor, escanea un código QR válido o verifica el ID del menú.
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 2, 
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  opacity: 0.6
                }}
              >
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
            backgroundColor: '#0A0A0A'
          }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#D4AF37',
              mb: 3
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              color: '#F8F8F8',
              textAlign: 'center'
            }}
          >
            Cargando Carta Digital...
          </Typography>
        </Box>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
};

export default MenuPage;
