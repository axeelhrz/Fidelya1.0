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
      {/* Header Premium Ultra-Elegante */}
      <AppBar 
        position="fixed" 
                elevation={0}
        sx={{ 
          backgroundColor: 'rgba(28, 28, 30, 0.88)',
          backdropFilter: 'blur(48px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
          zIndex: 1100,
          '&::before': {
            content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.015) 0%, transparent 100%)',
                pointerEvents: 'none'
          }
              }}
              >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2.5, sm: 4 },
          minHeight: { xs: 68, sm: 76 },
          position: 'relative'
        }}>
          {/* Botón de regreso minimalista */}
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
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  color: '#F5F5F7',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                }
                }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
        </MotionBox>
          
          {/* Branding Central Premium - Xs Reset */}
          <MotionBox
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98], delay: 0.2 }}
            sx={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', 
              flexDirection: 'column',
                alignItems: 'center',
              gap: 0.5
            }}
            >
            {/* Logo Premium */}
            <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {/* Icono con efecto de lujo */}
            <Box
              sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
              position: 'relative',
                  '&::before': {
                    content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                    borderRadius: 'inherit',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                pointerEvents: 'none'
                  }
              }}
              >
                <Restaurant sx={{ 
                  color: '#3B82F6', 
                  fontSize: 22,
                  filter: 'drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4))'
                }} />
              </Box>
              
              {/* Nombre del Bar - Xs Reset */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  sx={{ 
                    fontWeight: 700,
                    color: '#F5F5F7',
                    letterSpacing: '-0.03em',
                    fontSize: { xs: '1.375rem', sm: '1.5rem' },
                    lineHeight: 1,
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
                    background: 'linear-gradient(135deg, #F5F5F7 0%, #E5E5E7 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
              >
                  Xs Reset
              </Typography>
              
                {/* Subtítulo elegante */}
                <Typography
                sx={{
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: '#A1A1AA',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    opacity: 0.8,
                    mt: 0.25
                  }}
                >
                  Bar & Lounge
                </Typography>
          </Box>
            </Box>
          </MotionBox>

          {/* Indicador de tiempo/estado elegante */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98], delay: 0.4 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 0.5
            }}
          >
            {/* Hora actual */}
            <Typography
              sx={{
                color: '#F5F5F7',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                fontFamily: 'monospace'
              }}
            >
              {new Date().toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </Typography>
            
            {/* Estado premium */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                backgroundColor: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.12)'
              }}
            >
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                  animation: 'pulse 2s infinite'
                }}
              />
              <Typography
                sx={{
                  color: '#10B981',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                Abierto
              </Typography>
    </Box>
          </MotionBox>
        </Toolbar>

        {/* Línea decorativa inferior con gradiente elegante */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.2) 20%, rgba(245, 158, 11, 0.3) 50%, rgba(59, 130, 246, 0.2) 80%, transparent 100%)',
            opacity: 0.7
          }}
        />

        {/* Efecto de brillo sutil en el centro */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '60px',
            background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
            borderRadius: '50%'
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
        {/* Hero section con branding del bar */}
        <MotionBox
          variants={headerVariants}
          sx={{ textAlign: 'center', mb: { xs: 12, sm: 16 } }}
        >
          {/* Título principal con el nombre del bar */}
          <Typography 
            sx={{ 
              fontSize: { xs: '2.75rem', sm: '3.75rem', md: '4.25rem' },
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.85,
              color: '#F5F5F7',
              mb: 2,
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Xs Reset
          </Typography>

          {/* Subtítulo elegante */}
          <Typography 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 500,
              color: '#A1A1AA',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              mb: 4,
              opacity: 0.8
            }}
          >
            Bar & Lounge Experience
          </Typography>
          
          <Typography 
            sx={{ 
              color: '#A1A1AA',
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 400,
              maxWidth: 520,
              mx: 'auto',
              lineHeight: 1.6,
              mb: 6
            }}
          >
            {menuDescription}
          </Typography>

          {/* Divisor elegante con gradiente */}
          <Box
            sx={{
              width: 140,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #3B82F6 30%, #F59E0B 70%, transparent 100%)',
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

        {/* Footer premium con branding */}
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
                  fontWeight: 600,
                  mb: 1,
                  letterSpacing: '-0.01em'
                }}
              >
                Xs Reset
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
                Experiencia Digital Premium • Precios sujetos a cambios
              </Typography>
              
              {/* Línea decorativa final */}
              <Box
                sx={{
                  width: 80,
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