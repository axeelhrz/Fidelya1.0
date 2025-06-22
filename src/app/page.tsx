'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Chip,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowForward,
  Business,
  Store,
  People,
  Security,
  Analytics,
  Speed,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import Link from 'next/link';

const HomePage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Business sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Asociaciones',
      description: 'Gestiona múltiples asociaciones con herramientas avanzadas de administración.',
      count: '500+'
    },
    {
      icon: <Store sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Comercios',
      description: 'Conecta comercios locales con programas de fidelización personalizados.',
      count: '2K+'
    },
    {
      icon: <People sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Socios Activos',
      description: 'Una comunidad creciente de usuarios comprometidos con beneficios exclusivos.',
      count: '50K+'
    }
  ];

  const benefits = [
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: 'Seguridad Avanzada',
      description: 'Protección de datos con los más altos estándares de seguridad.'
    },
    {
      icon: <Analytics sx={{ fontSize: 32 }} />,
      title: 'Analytics Inteligente',
      description: 'Insights detallados para optimizar tus programas de fidelización.'
    },
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: 'Rendimiento Óptimo',
      description: 'Plataforma rápida y confiable con 99.9% de disponibilidad.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              F
            </Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fidelitá
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              href="/auth/login"
              startIcon={<Login />}
              variant="outlined"
              sx={{ 
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              component={Link}
              href="/auth/register"
              startIcon={<PersonAdd />}
              variant="contained"
              sx={{ 
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              Registrarse
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 15, pb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip 
            label="Plataforma de Nueva Generación" 
            sx={{ 
              mb: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontWeight: 600,
              borderRadius: 3
            }} 
          />
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #667eea 50%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fidelización
            <br />
            <Box component="span" sx={{ color: 'primary.main' }}>
              Inteligente
            </Box>
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            La plataforma que conecta asociaciones, comercios y socios en un ecosistema único de beneficios mutuos.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              component={Link}
              href="/auth/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Comenzar Ahora
            </Button>
            
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Explorar Plataforma
            </Button>
          </Stack>
        </Box>

        {/* Stats */}
        <Grid container spacing={4} sx={{ mb: 12 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {feature.count}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Benefits Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              color: 'text.primary'
            }}
          >
            ¿Por qué elegir Fidelitá?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Tecnología avanzada y simplicidad en una sola plataforma
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 12 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      color: 'primary.main'
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}
          >
            ¿Listo para comenzar?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 500,
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Únete a miles de empresas que ya confían en nuestra plataforma
          </Typography>
          <Button
            component={Link}
            href="/auth/register"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: alpha('#ffffff', 0.9),
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Crear Cuenta Gratis
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          py: 4,
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ fontWeight: 500 }}
          >
            © 2024 Fidelitá. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;