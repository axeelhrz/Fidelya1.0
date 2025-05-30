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
      {/* Header Premium Ultra-Minimalista */}
      <AppBar 
        position="fixed" 
                elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.85)',
          backdropFilter: 'blur(40px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          zIndex: 1100,
          '&::before': {
            content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)',
                pointerEvents: 'none'
          }
              }}
              >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 64, sm: 72 },
          position: 'relative'
        }}>
          {/* Botón de regreso premium */}
          <MotionBox
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
            <IconButton 
              onClick={() => router.push('/')}
              sx={{ 
                color: '#A1A1AA',
                p: 1.5,
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  color: '#F5F5F7',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
                }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
        </MotionBox>
          
          {/* Logo y título central premium */}
          <MotionBox
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98], delay: 0.2 }}
            sx={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', 
              alignItems: 'center', 
              gap: 2
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Restaurant sx={{ 
                color: '#3B82F6', 
                fontSize: 20,
                filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
              }} />
    </Box>
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#F5F5F7',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              {menuName}
            </Typography>
          </MotionBox>

          {/* Indicador de estado premium */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98], delay: 0.4 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.15)'
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                animation: 'pulse 2s infinite'
              }}
            />
            <Typography
              sx={{
                color: '#10B981',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              En línea
            </Typography>
          </MotionBox>
        </Toolbar>

        {/* Línea decorativa inferior */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)',
            opacity: 0.6
          }}
        />
      </AppBar>

      {/* Contenido principal */}
      <MotionContainer 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 10, sm: 12 },
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

      {/* Estilos para animación pulse */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </Box>
  );
};

export default MenuViewer;