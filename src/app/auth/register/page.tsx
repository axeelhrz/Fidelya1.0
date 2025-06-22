'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Divider,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  Business,
  Store,
  People,
  ArrowForward,
  Login,
  Star,
  Security,
  Analytics,
  Support,
  Verified,
  ArrowBack,
} from '@mui/icons-material';
import Link from 'next/link';

const RegisterPage = () => {
  const theme = useTheme();

  const roles = [
    {
      id: 'asociacion',
      title: 'Asociación',
      description: 'Para organizaciones que gestionan programas de fidelidad y beneficios comunitarios',
      icon: <Business sx={{ fontSize: 40 }} />,
      color: '#10b981',
      bgColor: alpha('#10b981', 0.1),
      href: '/auth/register/asociacion',
    },
    {
      id: 'socio',
      title: 'Socio',
      description: 'Para personas que quieren acceder a beneficios exclusivos y programas de fidelidad',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      bgColor: alpha('#6366f1', 0.1),
      href: '/auth/register/socio',
      popular: true,
    },
    {
      id: 'comercio',
      title: 'Comercio',
      description: 'Para negocios que desean ofrecer beneficios únicos y fidelizar a sus clientes',
      icon: <Store sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      bgColor: alpha('#8b5cf6', 0.1),
      href: '/auth/register/comercio',
    },
  ];

  const stats = [
    { icon: <Business />, count: '500+', label: 'Asociaciones', color: '#10b981' },
    { icon: <Store />, count: '2K+', label: 'Comercios', color: '#8b5cf6' },
    { icon: <People />, count: '50K+', label: 'Socios', color: '#6366f1' },
  ];

  const benefits = [
    { icon: <Verified />, text: 'Plataforma premium' },
    { icon: <Support />, text: 'Soporte 24/7' },
    { icon: <Security />, text: 'Seguridad avanzada' },
    { icon: <Analytics />, text: 'Analytics en tiempo real' },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#fafbfc',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <IconButton
            component={Link}
            href="/"
            sx={{ 
              mb: 3,
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            <ArrowBack />
          </IconButton>

          <Box
            component={Link}
            href="/"
            sx={{
              display: 'inline-block',
              width: 48,
              height: 48,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: 900,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25)',
            }}
          >
            F
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Únete a Fidelita
          </Typography>
          
          <Typography
            variant="body1"
            sx={{ color: '#64748b', mb: 4, fontWeight: 500 }}
          >
            Elige el tipo de cuenta que mejor se adapte a tus necesidades
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            bgcolor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Stats */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                {stats.map((stat, index) => (
                  <Grid item xs={4} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.2rem' }}>
                        {stat.count}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Role Cards */}
            <Stack spacing={2} sx={{ mb: 4 }}>
              {roles.map((role) => (
                <Card
                  key={role.id}
                  elevation={0}
                  sx={{
                    position: 'relative',
                    border: '2px solid #e2e8f0',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: role.color,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 30px ${alpha(role.color, 0.15)}`,
                    },
                  }}
                  component={Link}
                  href={role.href}
                >
                  {role.popular && (
                    <Chip
                      icon={<Star sx={{ fontSize: '0.8rem' }} />}
                      label="MÁS POPULAR"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: '#6366f1',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        zIndex: 1,
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: role.bgColor,
                          color: role.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {role.icon}
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {role.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                          {role.description}
                        </Typography>
                      </Box>
                      
                      <ArrowForward sx={{ color: '#94a3b8', fontSize: '1.2rem' }} />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                ¿Ya tienes cuenta?
              </Typography>
            </Divider>

            {/* Login Button */}
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              fullWidth
              startIcon={<Login />}
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#e2e8f0',
                color: '#475569',
                mb: 4,
                '&:hover': {
                  borderColor: '#6366f1',
                  bgcolor: alpha('#6366f1', 0.02),
                  color: '#6366f1',
                },
              }}
            >
              Iniciar sesión
            </Button>

            {/* Benefits */}
            <Card
              elevation={0}
              sx={{
                bgcolor: alpha('#6366f1', 0.05),
                border: `1px solid ${alpha('#6366f1', 0.1)}`,
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#6366f1',
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  ¿Por qué elegir Fidelita?
                </Typography>
                
                <Grid container spacing={2}>
                  {benefits.map((benefit, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: '#6366f1', fontSize: '1rem' }}>
                          {benefit.icon}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: '#6366f1', fontWeight: 600, fontSize: '0.85rem' }}
                        >
                          {benefit.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;