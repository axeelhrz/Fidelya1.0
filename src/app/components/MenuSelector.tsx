'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Restaurant, Visibility, Schedule, Warning, Add } from '@mui/icons-material';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const MenuSelector: React.FC = () => {
  const router = useRouter();
  const [checkingMenus, setCheckingMenus] = useState(true);
  const [menuCheckResult, setMenuCheckResult] = useState<{
    data?: { hasMenus: boolean };
    success?: boolean;
  } | null>(null);

  const { 
    menus, 
    loading, 
    error, 
    connected,
    initializeDatabase 
  } = useFirebaseMenu(undefined, { isActive: true }, true);

  // Verificar si existen menús al cargar
  useEffect(() => {
    const checkMenus = async () => {
      try {
        const response = await fetch('/api/menus/check');
        const result = await response.json();
        setMenuCheckResult(result);
      } catch (error) {
        console.error('Error checking menus:', error);
      } finally {
        setCheckingMenus(false);
      }
    };

    if (connected && !loading) {
      checkMenus();
    }
  }, [connected, loading]);

  const handleMenuSelect = (menuId: string) => {
    router.push(`/menu?id=${menuId}`);
  };
  const handleCreateSampleMenu = async () => {
    try {
      setCheckingMenus(true);
      const response = await fetch('/api/database/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Recargar la página para mostrar los nuevos datos
        window.location.reload();
      } else {
        console.error('Error initializing data');
        alert('Error al crear el menú de ejemplo');
      }
    } catch (error) {
      console.error('Error creating sample menu:', error);
      alert('Error al crear el menú de ejemplo');
    } finally {
      setCheckingMenus(false);
    }
  };

  // Loading state
  if (loading || checkingMenus) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3
      }}>
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
            fontFamily: "'Inter', sans-serif",
            color: '#F8F8F8',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            mb: 1,
            fontWeight: 600
          }}
        >
          Cargando Menús Disponibles...
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
          {connected ? 'Conectado a Firebase' : 'Conectando con Firebase...'}
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3
      }}>
        <Container maxWidth="sm">
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
              },
              mb: 3
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Error de Conexión
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {error}
            </Typography>
          </Alert>
          
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{
                color: '#D4AF37',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                borderRadius: 0,
                '&:hover': {
                  borderColor: 'rgba(212, 175, 55, 0.5)',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)'
                }
              }}
            >
              Reintentar
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // No menus available state
  if (menus.length === 0 || (menuCheckResult && !menuCheckResult.data?.hasMenus)) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3
      }}>
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ textAlign: 'center' }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 0,
                border: '2px solid #D4AF37',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4
              }}
            >
              <Restaurant sx={{ color: '#D4AF37', fontSize: 48 }} />
            </Box>

            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                color: '#F8F8F8',
                mb: 2,
                letterSpacing: '0.02em'
              }}
            >
              No hay menús disponibles
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                color: '#B8B8B8',
                mb: 4,
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Parece que aún no se han configurado menús en el sistema. 
              Puedes crear un menú de ejemplo para comenzar.
            </Typography>

            <Alert 
              severity="info"
              icon={<Warning />}
              sx={{ 
                borderRadius: 0,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                color: '#64B5F6',
                fontFamily: "'Inter', sans-serif",
                mb: 4,
                '& .MuiAlert-icon': {
                  color: '#64B5F6'
                }
              }}
            >
              <Typography variant="body2">
                Esta acción creará un menú de ejemplo con productos de muestra 
                que podrás personalizar desde el panel de administración.
              </Typography>
            </Alert>

            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={handleCreateSampleMenu}
                disabled={checkingMenus}
                sx={{
                  backgroundColor: '#D4AF37',
                  color: '#0A0A0A',
                  borderRadius: 0,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#F4E4BC'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(212, 175, 55, 0.3)',
                    color: 'rgba(10, 10, 10, 0.5)'
                  }
                }}
              >
                {checkingMenus ? 'Creando...' : 'Crear Menú de Ejemplo'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/admin')}
                sx={{
                  color: '#B8B8B8',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    color: '#D4AF37',
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  }
                }}
              >
                Ir al Admin
              </Button>
            </Stack>

            {/* Información técnica */}
            <Box sx={{ mt: 6, p: 3, backgroundColor: 'rgba(26, 26, 26, 0.5)', borderRadius: 0 }}>
              <Typography variant="caption" sx={{ color: '#B8B8B8', fontFamily: "'Inter', sans-serif" }}>
                Estado de conexión: {connected ? 'Conectado' : 'Desconectado'}<br/>
                Menús encontrados: {menus.length}<br/>
                Base de datos: Firebase Firestore
              </Typography>
            </Box>
          </MotionBox>
        </Container>
      </Box>
    );
  }

  // Normal menu selection state
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      py: 8
    }}>
      {/* Fondo elegante */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.02) 0%, transparent 50%),
            linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(16, 16, 16, 1) 100%)
          `
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 0,
              border: '2px solid #D4AF37',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4
            }}
          >
            <Restaurant sx={{ color: '#D4AF37', fontSize: 32 }} />
          </Box>

          <Typography 
            variant="h3" 
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              color: '#F8F8F8',
              mb: 2,
              letterSpacing: '0.02em',
              fontSize: { xs: '2rem', sm: '3rem' }
            }}
          >
            Selecciona un Menú
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Inter', sans-serif",
              color: '#B8B8B8',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Elige el menú que deseas visualizar de nuestra colección de cartas digitales
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`${menus.length} ${menus.length === 1 ? 'Menú' : 'Menús'} Disponible${menus.length === 1 ? '' : 's'}`}
              sx={{
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                color: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 0,
                fontWeight: 600
              }}
            />
            <Chip
              label={connected ? 'Conectado' : 'Desconectado'}
              sx={{
                backgroundColor: connected ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)',
                color: connected ? '#81C784' : '#E57373',
                border: `1px solid ${connected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                borderRadius: 0,
                fontWeight: 600
              }}
            />
          </Box>
        </MotionBox>

        {/* Menu Grid */}
        <Grid container spacing={4}>
          {menus.map((menu, index) => (
            <Grid item xs={12} sm={6} md={4} key={menu.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                sx={{
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'rgba(212, 175, 55, 0.5)',

                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    boxShadow: '0 12px 40px rgba(212, 175, 55, 0.2)'
                  }
                }}
                onClick={() => handleMenuSelect(menu.id)}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 0,
                        border: '1px solid #D4AF37',
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                        mr: 2
                      }}
                    >
                      <Restaurant sx={{ color: '#D4AF37', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          color: '#F8F8F8',
                          mb: 0.5,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {menu.restaurantInfo?.name || menu.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#D4AF37',
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
                        }}
                      >
                        Carta Digital
                      </Typography>
                    </Box>
                  </Box>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: "'Inter', sans-serif",
                      color: '#B8B8B8',
                      lineHeight: 1.6,
                      mb: 3,
                      minHeight: 48,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {menu.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    <Chip
                      size="small"
                      label={menu.isActive ? 'Activo' : 'Inactivo'}
                      sx={{
                        backgroundColor: menu.isActive 
                          ? 'rgba(76, 175, 80, 0.15)' 
                          : 'rgba(158, 158, 158, 0.15)',
                        color: menu.isActive ? '#81C784' : '#BDBDBD',
                        border: `1px solid ${menu.isActive 
                          ? 'rgba(76, 175, 80, 0.3)' 
                          : 'rgba(158, 158, 158, 0.3)'}`,
                        borderRadius: 0,
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    />
                    <Chip
                      size="small"
                      label={`ID: ${menu.id.substring(0, 8)}...`}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#B8B8B8',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 0,
                        fontSize: '0.75rem',
                        fontWeight: 400
                      }}
                    />
                  </Box>

                  {menu.restaurantInfo && (
                    <Box sx={{ mb: 2 }}>
                      {menu.restaurantInfo.address && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#B8B8B8',
                            display: 'block',
                            mb: 0.5,
                            opacity: 0.8
                          }}
                        >
                          📍 {menu.restaurantInfo.address}
                        </Typography>
                      )}
                      {menu.restaurantInfo.hours && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#B8B8B8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            opacity: 0.8
                          }}
                        >
                          <Schedule sx={{ fontSize: 12 }} />
                          {menu.restaurantInfo.hours}
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Visibility />}
                    sx={{
                      color: '#D4AF37',
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      borderRadius: 0,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        color: '#0A0A0A',
                        backgroundColor: '#D4AF37',
                        borderColor: '#D4AF37',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Ver Menú
                  </Button>
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Footer Actions */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          sx={{ 
            mt: 8,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              p: 4,
              borderRadius: 0,
              background: 'rgba(26, 26, 26, 0.4)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                color: '#F8F8F8',
                mb: 2,
                fontWeight: 600
              }}
            >
              ¿Necesitas administrar los menús?
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                color: '#B8B8B8',
                mb: 3,
                opacity: 0.8
              }}
            >
              Accede al panel de administración para crear, editar o eliminar menús y productos.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push('/admin')}
              sx={{
                color: '#B8B8B8',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                borderRadius: 0,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  color: '#D4AF37',
                  borderColor: 'rgba(212, 175, 55, 0.5)',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)'
                }
              }}
            >
              Panel de Administración
            </Button>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default MenuSelector;