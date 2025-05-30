'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

// Contraseña de administrador estándar
const ADMIN_PASSWORD = 'admin123';

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si ya está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (isAuthenticated === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === ADMIN_PASSWORD) {
      // Redirigir directamente al dashboard sin guardar en localStorage
      router.push('/admin/dashboard');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToHome = () => {
    router.push('/');
};

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#1C1C1E',
        overflow: 'hidden',
        px: { xs: 3, sm: 4 },
        py: 4
      }}
    >
      {/* Subtle background gradient - igual que HeroSection */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Botón de regreso */}
      <MotionButton
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={handleBackToHome}
        startIcon={<ArrowBackIcon />}
        sx={{
          position: 'absolute',
          top: { xs: 20, sm: 32 },
          left: { xs: 20, sm: 32 },
          color: '#A1A1AA',
          '&:hover': {
            color: '#F5F5F7',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          zIndex: 2,
        }}
      >
        Volver al inicio
      </MotionButton>

      <Container 
        maxWidth="sm"
        sx={{ 
          zIndex: 1,
          position: 'relative'
        }}
      >
        <Stack 
          spacing={{ xs: 6, sm: 8 }}
          alignItems="center" 
          textAlign="center"
        >
          {/* Logo/Icono - similar al HeroSection */}
          <MotionBox
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: 'easeOut',
              delay: 0.4
            }}
          >
            <AdminIcon 
              sx={{ 
                fontSize: { xs: 64, sm: 80 },
                color: '#3B82F6',
                filter: 'drop-shadow(0px 0px 20px rgba(59, 130, 246, 0.2))'
              }} 
            />
          </MotionBox>

          {/* Título principal - estilo similar al HeroSection */}
          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: 'easeOut',
              delay: 0.6
            }}
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: '#F5F5F7',
              mb: 2
            }}
          >
            Panel Admin
          </MotionTypography>

          {/* Subtítulo */}
          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: 'easeOut',
              delay: 0.8
            }}
            sx={{
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              fontWeight: 400,
              color: '#A1A1AA',
              lineHeight: 1.5,
              maxWidth: 480,
              mx: 'auto'
            }}
          >
            Ingresa la contraseña para acceder al editor de menú
          </MotionTypography>

          {/* Formulario */}
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: 'easeOut',
              delay: 1.0
            }}
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: 3,
              background: 'rgba(44, 44, 46, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña de administrador"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#A1A1AA' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          disabled={loading}
                          sx={{ color: '#A1A1AA' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        borderColor: '#3B82F6',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#A1A1AA',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#F5F5F7',
                    },
                  }}
                />

                <MotionButton
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || !password.trim()}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    background: '#3B82F6',
                    color: '#FFFFFF',
                    border: 'none',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#2563eb',
                      boxShadow: 'none',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: 'rgba(59, 130, 246, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {loading ? 'Verificando...' : 'Acceder al Panel'}
                </MotionButton>
              </Stack>
            </Box>

            {/* Error */}
            {error && (
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3,
                    borderRadius: 2,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#F87171',
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Información adicional */}
            <Box textAlign="center" sx={{ mt: 3 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#71717A',
                  fontSize: '0.875rem'
                }}
              >
                💡 Contraseña estándar: <code style={{ 
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  color: '#3B82F6'
                }}>admin123</code>
              </Typography>
            </Box>
          </MotionPaper>
        </Stack>
      </Container>
    </MotionBox>
  );
};

export default AdminLogin;