'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
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
  ArrowBack,
} from '@mui/icons-material';
import Link from 'next/link';

const RegisterPage = () => {
  const theme = useTheme();

  const roles = [
    {
      id: 'asociacion',
      title: 'Asociación',
      description: 'Gestiona programas de fidelidad y conecta con múltiples comercios',
      icon: <Business sx={{ fontSize: 40 }} />,
      color: '#10b981',
      bgColor: alpha('#10b981', 0.1),
      href: '/auth/register/asociacion',
    },
    {
      id: 'socio',
      title: 'Socio',
      description: 'Accede a beneficios exclusivos y descuentos especiales',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      bgColor: alpha('#6366f1', 0.1),
      href: '/auth/register/socio',
    },
    {
      id: 'comercio',
      title: 'Comercio',
      description: 'Atrae y fideliza clientes con programas de recompensas',
      icon: <Store sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      bgColor: alpha('#8b5cf6', 0.1),
      href: '/auth/register/comercio',
    },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#fafbfc',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
              display: 'inline-flex',
              width: 48,
              height: 48,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: 900,
              mb: 3,
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
              fontSize: { xs: '2rem', md: '2.5rem' },
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
            sx={{ 
              color: '#64748b', 
              mb: 4, 
              fontWeight: 500,
              fontSize: '1.1rem'
            }}
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
            {/* Role Cards */}
            <Stack spacing={3} sx={{ mb: 4 }}>
              {roles.map((role) => (
                <Box
                  key={role.id}
                  component={Link}
                  href={role.href}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Card
                    elevation={0}
                    sx={{
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
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
                            flexShrink: 0,
                          }}
                        >
                          {role.icon}
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              mb: 0.5,
                              fontSize: '1.2rem',
                              color: '#1e293b'
                            }}
                          >
                            {role.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b', 
                              fontSize: '0.95rem',
                              lineHeight: 1.4
                            }}
                          >
                            {role.description}
                          </Typography>
                        </Box>
                        
                        <ArrowForward 
                          sx={{ 
                            color: '#94a3b8', 
                            fontSize: '1.3rem',
                            flexShrink: 0
                          }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Stack>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748b', 
                  fontWeight: 600,
                  px: 2
                }}
              >
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
                fontSize: '1rem',
                borderColor: '#e2e8f0',
                color: '#475569',
                '&:hover': {
                  borderColor: '#6366f1',
                  bgcolor: alpha('#6366f1', 0.02),
                  color: '#6366f1',
                },
              }}
            >
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;