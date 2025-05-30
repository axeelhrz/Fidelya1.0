'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Fade,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowBack, 
  Restaurant
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import MenuSection from './MenuSection';

interface MenuViewerProps {
  products: Product[];
  menuName?: string;
  menuDescription?: string;
}

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MenuViewer: React.FC<MenuViewerProps> = ({
  products,
  menuName = 'MenuQR',
  menuDescription = 'Experiencia gastronómica premium'
}) => {
  const router = useRouter();

  // Agrupar productos por categoría
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    products.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#1C1C1E',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0),
        radial-gradient(circle at 2px 2px, rgba(255,255,255,0.008) 1px, transparent 0)
      `,
      backgroundSize: '20px 20px, 40px 40px',
      backgroundPosition: '0 0, 10px 10px'
    }}>
      {/* Header minimalista y sofisticado */}
      <AppBar 
        position="fixed" 
                elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          zIndex: 1100,
                }}
              >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          px: { xs: 3, sm: 4 },
          minHeight: { xs: 72, sm: 80 }
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton 
                onClick={() => router.push('/')}
                sx={{ 
                  color: '#A1A1AA',
                  p: 2,
                  borderRadius: 2.5,
                  '&:hover': { 
                  color: '#F5F5F7',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)'
                  }
                }}
              >
                <ArrowBack fontSize="medium" />
              </IconButton>
            </MotionBox>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Restaurant sx={{ color: '#3B82F6', fontSize: 28 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#F5F5F7',
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.25rem', sm: '1.375rem' }
                }}
              >
                {menuName}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 12, sm: 14 },
          pb: 12,
          px: { xs: 3, sm: 4 },
                }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
              >
        {/* Hero section minimalista */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 12, sm: 16 } }}
        >
          <Typography 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: '#F5F5F7',
              mb: 4,
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {menuName}
          </Typography>
          
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 400,
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.6,
              mb: 6
            }}
          >
            {menuDescription}
          </Typography>

          {/* Divisor elegante */}
          <Box
            sx={{
              width: 120,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #3B82F6 50%, transparent 100%)',
              mx: 'auto'
            }}
          />
        </MotionBox>

        {/* Secciones del menú */}
        <AnimatePresence>
          <Stack spacing={{ xs: 12, sm: 16 }}>
            {Object.entries(groupedProducts).map(([category, categoryProducts], index) => (
              <MenuSection
                key={category}
                title={category}
                products={categoryProducts}
                index={index}
              />
            ))}
          </Stack>
        </AnimatePresence>

        {/* Footer premium minimalista */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          sx={{ 
            mt: 20,
            pt: 12,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              p: 8,
              borderRadius: 4,
              background: 'rgba(44, 44, 46, 0.3)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Efecto de iluminación sutil */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                sx={{ 
                  color: '#F5F5F7',
                  fontSize: '1rem',
                  fontWeight: 500,
                  mb: 2,
                  letterSpacing: '-0.01em'
                }}
              >
                Experiencia Digital Premium
              </Typography>
              <Typography 
                sx={{ 
                  color: '#A1A1AA',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  mb: 4,
                  lineHeight: 1.6,
                  opacity: 0.8
                }}
              >
                Precios sujetos a cambios • Menú actualizado diariamente
              </Typography>
              
              {/* Línea decorativa final */}
              <Box
                sx={{
                  width: 60,
                  height: 1,
                  background: 'linear-gradient(90deg, transparent 0%, #F59E0B 50%, transparent 100%)',
                  mx: 'auto'
                }}
              />
    </Box>
          </Box>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
};

export default MenuViewer;