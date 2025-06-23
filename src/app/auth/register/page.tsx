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
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <IconButton
            component={Link}
            href="/"
            sx={{ 
              position: 'absolute',
              top: 24,
              left: 24,
              bgcolor: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              '&:hover': { 
                bgcolor: '#f8fafc',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'inline-flex',
              width: 64,
              height: 64,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              textDecoration: 'none',
              fontSize: '2rem',
              fontWeight: 900,
              mb: 4,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              letterSpacing: '-0.02em',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            F
          </Box>

          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.2rem' },
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #6366f1 70%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
            }}
          >
            Únete a
            <br />
            <Box 
              component="span" 
              sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fidelita
            </Box>
          </Typography>
          
          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{ 
              color: '#475569', 
              fontWeight: 500,
              fontSize: '1.15rem',
              lineHeight: 1.5,
              maxWidth: 400,
              mx: 'auto',
              letterSpacing: '-0.01em'
            }}
          >
            Selecciona tu perfil y comienza a disfrutar de beneficios únicos
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 5,
            border: '1px solid #e2e8f0',
            bgcolor: 'white',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 5 }}>
            {/* Role Cards */}
            <Stack spacing={3} sx={{ mb: 5 }}>
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
                      border: '2px solid #f1f5f9',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: role.color,
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 40px ${alpha(role.color, 0.2)}`,
                        '& .role-arrow': {
                          transform: 'translateX(4px)',
                          color: role.color,
                        },
                        '&::before': {
                          opacity: 1,
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, ${role.color}, ${alpha(role.color, 0.6)})`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Box
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: 3,
                            bgcolor: role.bgColor,
                            color: role.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {role.icon}
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 800, 
                              mb: 1,
                              fontSize: '1.4rem',
                              color: '#0f172a',
                              letterSpacing: '-0.02em'
                            }}
                          >
                            {role.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: '#64748b', 
                              fontSize: '1rem',
                              lineHeight: 1.5,
                              fontWeight: 500
                            }}
                          >
                            {role.description}
                          </Typography>
                        </Box>
                        
                        <ArrowForward 
                          className="role-arrow"
                          sx={{ 
                            color: '#cbd5e1', 
                            fontSize: '1.5rem',
                            flexShrink: 0,
                            transition: 'all 0.3s ease'
                          }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Stack>

            {/* Divider */}
            <Box sx={{ position: 'relative', my: 4 }}>
              <Divider sx={{ borderColor: '#f1f5f9' }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'white',
                  px: 3,
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#94a3b8', 
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.02em'
                  }}
                >
                  ¿Ya tienes cuenta?
                </Typography>
              </Box>
            </Box>

            {/* Login Button */}
            <Button
              component={Link}
              href="/auth/login"
              variant="outlined"
              fullWidth
              startIcon={<Login />}
              sx={{
                py: 2,
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.05rem',
                borderColor: '#e2e8f0',
                color: '#475569',
                borderWidth: 2,
                letterSpacing: '-0.01em',
                '&:hover': {
                  borderColor: '#6366f1',
                  bgcolor: alpha('#6366f1', 0.03),
                  color: '#6366f1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                },
                transition: 'all 0.2s ease'
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