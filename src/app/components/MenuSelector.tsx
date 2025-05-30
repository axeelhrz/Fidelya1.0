'use client';

import React, { useCallback } from 'react';
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
  Grid
} from '@mui/material';
import { 
  Restaurant, 
  QrCode,
  ArrowForward
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useFirebaseMenu } from '../../hooks/useFirebaseMenu';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function MenuSelector() {
  const router = useRouter();
  const { menus, loading, error } = useFirebaseMenu();

  const handleMenuSelect = useCallback((menuId: string) => {
    router.push(`/menu?id=${menuId}`);
  }, [router]);

  // Handle automatic redirect for single menu
  React.useEffect(() => {
    if (menus.length === 1) {
      handleMenuSelect(menus[0].id);
    }
  }, [menus, handleMenuSelect]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        gap: 3
      }}>
        <CircularProgress size={60} sx={{ color: '#D4AF37' }} />
        <Typography sx={{ 
          color: '#B8B8B8', 
          fontSize: '1.125rem',
          fontWeight: 500,
          textAlign: 'center'
        }}>
          Cargando menús disponibles...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Error al cargar los menús
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Container>
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
            <Typography variant="h4" gutterBottom sx={{ color: '#F8F8F8', fontWeight: 700 }}>
              No hay menús disponibles
            </Typography>
            <Typography variant="h6" sx={{ color: '#B8B8B8', mb: 4 }}>
              Actualmente no hay menús configurados en el sistema.
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
              <Typography variant="body2">
                Si eres administrador, puedes inicializar la base de datos desde el panel de administración.
              </Typography>
            </Alert>
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
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              fontWeight: 700,
              color: '#0A0A0A',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Menús Digitales
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#2C2C2E',
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400
            }}>
              Selecciona el menú que deseas ver
            </Typography>
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
                  borderRadius: 3,
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
                      flex: 1
                    }}>
                      {menu.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ 
                    color: '#B8B8B8',
                    mb: 3,
                    lineHeight: 1.6
                  }}>
                    {menu.description}
                  </Typography>

                  {menu.restaurantInfo && (
                    <Box sx={{ mb: 3 }}>
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
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
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
    </Box>
  );
}