'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import { 
  Restaurant, 
  QrCode,
  ArrowForward,
  Refresh,
  Warning,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function MenuSelector() {
  const router = useRouter();
  const { menus, loading, error, connected, refreshData } = useFirebaseMenu();
  const [debugMode, setDebugMode] = useState(false);

  const handleMenuSelect = useCallback((menuId: string) => {
    router.push(`/menu?id=${menuId}`);
  }, [router]);

  // Handle automatic redirect for single menu
  useEffect(() => {
    if (menus.length === 1 && !loading) {
      setTimeout(() => {
      handleMenuSelect(menus[0].id);
      }, 1000); // Pequeño delay para mostrar el menú antes de redirigir
    }
  }, [menus, loading, handleMenuSelect]);

  // Debug mode toggle (doble click en el título)
  const handleTitleDoubleClick = () => {
    setDebugMode(!debugMode);
  };

  const handleRetry = async () => {
    try {
      await refreshData();
    } catch (err) {
      console.error('Error al recargar datos:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        gap: 3,
        px: 3
      }}>
        <CircularProgress 
          size={60} 
          sx={{ 
            color: '#D4AF37',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        <Typography sx={{ 
          color: '#F8F8F8', 
          fontSize: '1.25rem',
                      fontWeight: 600,
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif"
                    }}>
          Cargando menús disponibles...
                    </Typography>
        <Typography sx={{ 
          color: '#B8B8B8', 
          fontSize: '0.875rem',
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif"
                  }}>
          {connected ? 'Conectado a Firebase' : 'Conectando con Firebase...'}
                  </Typography>

        {/* Indicador de carga animado */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
                    sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#D4AF37',
                animation: `pulse 1.5s infinite ${index * 0.2}s`,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                  '50%': { opacity: 1, transform: 'scale(1.2)' }
                }
                    }}
            />
          ))}
        </Box>
      </Box>
  );
}

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        display: 'flex',
        alignItems: 'center',
        px: 3
      }}>
        <Container maxWidth="md">
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
                '& .MuiAlert-icon': { color: '#F87171' },
                mb: 3
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Error al cargar los menús
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Estado de conexión: {connected ? 'Conectado' : 'Desconectado'}
              </Typography>
            </Alert>
            
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => router.push('/')}
                sx={{
                  color: '#B8B8B8',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                  '&:hover': {
                    color: '#D4AF37',
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  }
                }}
              >
                Volver al inicio
              </Button>
              
              <Button
                variant="contained"
                onClick={handleRetry}
                startIcon={<Refresh />}
                sx={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                  color: '#0A0A0A',
                  borderRadius: 0,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B8941F 0%, #D4AF37 100%)',
                  }
                }}
              >
                Reintentar
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>
    );
  }

  if (menus.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'center' }}
          >
            <Restaurant sx={{ fontSize: 80, color: '#D4AF37', mb: 3 }} />
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                color: '#F8F8F8', 
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif"
              }}
              onDoubleClick={handleTitleDoubleClick}
            >
              No hay menús disponibles
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#B8B8B8', 
              mb: 4,
              fontFamily: "'Inter', sans-serif"
            }}>
              Actualmente no hay menús configurados en el sistema.
            </Typography>
            
            {/* Estado de conexión */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Chip
                icon={connected ? <CheckCircle /> : <ErrorIcon />}
                label={connected ? 'Conectado a Firebase' : 'Desconectado de Firebase'}
                color={connected ? 'success' : 'error'}
                variant="outlined"
                sx={{
                  borderRadius: 0,
                  fontFamily: "'Inter', sans-serif"
                }}
              />
            </Box>
            
            <Alert 
              severity="info" 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                borderRadius: 0,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60A5FA',
                fontFamily: "'Inter', sans-serif",
                '& .MuiAlert-icon': { color: '#60A5FA' },
                mb: 3
              }}
            >
              <Typography variant="body2">
                Si eres administrador, puedes inicializar la base de datos desde el panel de administración.
              </Typography>
            </Alert>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => router.push('/')}
                sx={{
                  color: '#B8B8B8',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                  '&:hover': {
                    color: '#D4AF37',
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  }
                }}
              >
                Volver al inicio
              </Button>
              
              <Button
                variant="contained"
                onClick={handleRetry}
                startIcon={<Refresh />}
                sx={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                  color: '#0A0A0A',
                  borderRadius: 0,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B8941F 0%, #D4AF37 100%)',
                  }
                }}
              >
                Recargar
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => router.push('/admin')}
                sx={{
                  color: '#B8B8B8',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  borderRadius: 0,
                  '&:hover': {
                    color: '#D4AF37',
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)'
                  }
                }}
              >
                Panel Admin
              </Button>
            </Stack>

            {/* Debug info */}
            {debugMode && (
              <Box sx={{ 
                mt: 4, 
                p: 3, 
                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 0,
                textAlign: 'left'
              }}>
                <Typography variant="h6" sx={{ color: '#D4AF37', mb: 2 }}>
                  Debug Info:
                </Typography>
                <Typography variant="body2" sx={{ color: '#B8B8B8', fontFamily: 'monospace' }}>
                  Connected: {connected.toString()}<br/>
                  Loading: {loading.toString()}<br/>
                  Error: {error || 'null'}<br/>
                  Menus count: {menus.length}<br/>
                  Firebase Project: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
                </Typography>
              </Box>
            )}
          </MotionBox>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
      py: 6
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
        py: 6,
        textAlign: 'center',
        mb: 6
      }}>
        <Container>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <QrCode sx={{ fontSize: 60, color: '#0A0A0A', mb: 2 }} />
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: '#0A0A0A',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontFamily: "'Inter', sans-serif"
              }}
              onDoubleClick={handleTitleDoubleClick}
            >
              Menús Digitales
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#2C2C2E',
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
              fontFamily: "'Inter', sans-serif"
            }}>
              Selecciona el menú que deseas ver
            </Typography>
            
            {/* Estado de conexión en header */}
            <Box sx={{ mt: 2 }}>
              <Chip
                icon={connected ? <CheckCircle /> : <Warning />}
                label={`${menus.length} menú${menus.length !== 1 ? 's' : ''} disponible${menus.length !== 1 ? 's' : ''}`}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: '#0A0A0A',
                  fontWeight: 600,
                  borderRadius: 0
                }}
              />
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Menús disponibles */}
      <Container>
        <Grid container spacing={4}>
          {menus.map((menu, index) => (
            <Grid item xs={12} md={6} lg={4} key={menu.id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                sx={{
                  background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                    boxShadow: '0 20px 40px rgba(212, 175, 55, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Restaurant sx={{ color: '#D4AF37', fontSize: 32 }} />
                    <Typography variant="h5" sx={{ 
                      color: '#F8F8F8', 
                      fontWeight: 600,
                      flex: 1,
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      {menu.name}
                    </Typography>
                    {menu.isActive && (
                      <Chip
                        label="Activo"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(34, 197, 94, 0.2)',
                          color: '#22C55E',
                          borderRadius: 0,
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body1" sx={{ 
                    color: '#B8B8B8',
                    mb: 3,
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {menu.description}
                  </Typography>

                  {menu.restaurantInfo && (
                    <Box sx={{ mb: 3 }}>
                      {menu.restaurantInfo.name && (
                        <Typography variant="body2" sx={{ color: '#D4AF37', mb: 1, fontWeight: 500 }}>
                          🏪 {menu.restaurantInfo.name}
                        </Typography>
                      )}
                      {menu.restaurantInfo.address && (
                        <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                          📍 {menu.restaurantInfo.address}
                        </Typography>
                      )}
                      {menu.restaurantInfo.phone && (
                        <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                          📞 {menu.restaurantInfo.phone}
                        </Typography>
                      )}
                      {menu.restaurantInfo.hours && (
                        <Typography variant="body2" sx={{ color: '#888' }}>
                          🕒 {menu.restaurantInfo.hours}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {menu.categories && menu.categories.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#D4AF37', mb: 1, fontWeight: 500 }}>
                        Categorías disponibles:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        {menu.categories.slice(0, 3).join(', ')}
                        {menu.categories.length > 3 && ` y ${menu.categories.length - 3} más...`}
                      </Typography>
                    </Box>
                  )}

                  {debugMode && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 1
                    }}>
                      <Typography variant="caption" sx={{ color: '#888', fontFamily: 'monospace' }}>
                        ID: {menu.id}<br/>
                        Created: {new Date(menu.createdAt).toLocaleString()}<br/>
                        Active: {menu.isActive.toString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleMenuSelect(menu.id)}
                    endIcon={<ArrowForward />}
                    sx={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                      color: '#0A0A0A',
                      fontWeight: 600,
                      py: 1.5,
                      borderRadius: 0,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontFamily: "'Inter', sans-serif",
                      '&:hover': {
                        background: 'linear-gradient(135deg, #B8941F 0%, #D4AF37 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)'
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
      </Container>

      {/* Debug panel */}
      {debugMode && (
        <Container sx={{ mt: 6 }}>
          <Box sx={{ 
            p: 4, 
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: 0
          }}>
            <Typography variant="h6" sx={{ color: '#D4AF37', mb: 2 }}>
              Debug Panel:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#B8B8B8', fontFamily: 'monospace' }}>
                  <strong>Connection Status:</strong> {connected ? '✅ Connected' : '❌ Disconnected'}<br/>
                  <strong>Loading:</strong> {loading ? '⏳ Loading' : '✅ Loaded'}<br/>
                  <strong>Error:</strong> {error || '✅ None'}<br/>
                  <strong>Menus Count:</strong> {menus.length}<br/>
                  <strong>Firebase Project:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#B8B8B8', fontFamily: 'monospace' }}>
                  <strong>Menu IDs:</strong><br/>
                  {menus.map(menu => `• ${menu.id} (${menu.isActive ? 'active' : 'inactive'})`).join('\n')}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
    </Box>
  );
}