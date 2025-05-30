'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  IconButton,
  Chip,
  Fab,
  AppBar,
  Toolbar,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Restaurant,
  Add,
  Category,
  Inventory,
  Logout,
  Dashboard,
  ArrowBack,
  QrCode2
} from '@mui/icons-material';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionFab = motion(Fab);

interface AdminDashboardProps {
  onLogout: () => void;
}

type ActiveSection = 'dashboard' | 'products' | 'categories';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');

  const menuItems = [
    {
      id: 'products' as ActiveSection,
      title: 'Gestión de Productos',
      description: 'Agregar, editar y eliminar productos del menú',
      icon: <Inventory sx={{ fontSize: 32 }} />,
      color: '#D4AF37',
      count: '12 productos'
    },
    {
      id: 'categories' as ActiveSection,
      title: 'Gestión de Categorías',
      description: 'Organizar y administrar las categorías del menú',
      icon: <Category sx={{ fontSize: 32 }} />,
      color: '#22C55E',
      count: '4 categorías'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'products':
        return <ProductManager onBack={() => setActiveSection('dashboard')} />;
      case 'categories':
        return <CategoryManager onBack={() => setActiveSection('dashboard')} />;
      default:
        return (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header del dashboard */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  border: '2px solid #D4AF37',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Dashboard sx={{ color: '#D4AF37', fontSize: 32 }} />
              </Box>

              <Typography 
                sx={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  fontWeight: 700,
                  color: '#F8F8F8',
                  mb: 2,
                  letterSpacing: '0.02em'
                }}
              >
                Panel de Control
              </Typography>

              <Typography 
                sx={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  color: '#B8B8B8',
                  maxWidth: 500,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Administra tu menú digital de forma sencilla e intuitiva
              </Typography>

              {/* Línea decorativa */}
              <Box
                sx={{
                  width: 80,
                  height: 1,
                  background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
                  mx: 'auto',
                  mt: 3
                }}
              />
            </Box>

            {/* Tarjetas de gestión */}
            <Stack spacing={3}>
              {menuItems.map((item, index) => (
                <MotionCard
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.id)}
                  sx={{
                    background: 'rgba(26, 26, 26, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: 'rgba(212, 175, 55, 0.5)',
                      background: 'rgba(26, 26, 26, 0.8)',
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      {/* Icono */}
                      <Box
                        sx={{
                          p: 2,
                          border: `2px solid ${item.color}`,
                          background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 80,
                          minHeight: 80
                        }}
                      >
                        {React.cloneElement(item.icon, { 
                          sx: { color: item.color, fontSize: 32 } 
                        })}
                      </Box>

                      {/* Contenido */}
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          sx={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            fontWeight: 600,
                            color: '#F8F8F8',
                            mb: 1,
                            letterSpacing: '0.02em'
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography 
                          sx={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.9rem',
                            color: '#B8B8B8',
                            mb: 2,
                            lineHeight: 1.5
                          }}
                        >
                          {item.description}
                        </Typography>

                        <Chip
                          label={item.count}
                          size="small"
                          sx={{
                            backgroundColor: `${item.color}20`,
                            color: item.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            fontFamily: "'Inter', sans-serif",
                            borderRadius: 0,
                            border: `1px solid ${item.color}40`
                          }}
                        />
                      </Box>

                      {/* Flecha */}
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ArrowBack 
                          sx={{ 
                            color: '#D4AF37', 
                            fontSize: 20,
                            transform: 'rotate(180deg)'
                          }} 
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </MotionCard>
              ))}
            </Stack>

            {/* Acciones rápidas */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography 
                sx={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#F8F8F8',
                  mb: 3
                }}
              >
                Acciones Rápidas
              </Typography>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
              >
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setActiveSection('products')}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    borderColor: '#D4AF37',
                    color: '#D4AF37',
                    borderRadius: 0,
                    '&:hover': {
                      borderColor: '#D4AF37',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    }
                  }}
                >
                  Agregar Producto
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<QrCode2 />}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#B8B8B8',
                    borderRadius: 0,
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  Generar QR
                </Button>
              </Stack>
            </Box>
          </MotionBox>
        );
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      position: 'relative'
    }}>
      {/* Fondo elegante */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.02) 0%, transparent 50%),
            linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(16, 16, 16, 1) 100%)
          `,
          pointerEvents: 'none',
          zIndex: -1
        }}
      />

      {/* Header fijo */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box
              sx={{
                p: 1,
                border: '1px solid #D4AF37',
                background: 'rgba(212, 175, 55, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Restaurant sx={{ color: '#D4AF37', fontSize: 20 }} />
            </Box>
            
            <Box>
              <Typography 
                sx={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  color: '#F8F8F8',
                  fontSize: '1.125rem'
                }}
              >
                Xs Reset Admin
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                  color: '#B8B8B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                Panel de Control
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={onLogout}
            sx={{
              color: '#B8B8B8',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 0,
              '&:hover': {
                color: '#F87171',
                borderColor: 'rgba(248, 113, 113, 0.3)',
                backgroundColor: 'rgba(248, 113, 113, 0.1)'
              }
            }}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 6, px: { xs: 3, sm: 4 } }}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </Container>

      {/* FAB para agregar producto rápido */}
      {activeSection === 'dashboard' && (
        <MotionFab
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveSection('products')}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
            color: '#0A0A0A',
            borderRadius: 0,
            width: 64,
            height: 64,
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
              boxShadow: '0 12px 40px rgba(212, 175, 55, 0.4)',
            }
          }}
        >
          <Add sx={{ fontSize: 28 }} />
        </MotionFab>
      )}
    </Box>
  );
}