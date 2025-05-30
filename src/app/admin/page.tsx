'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
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
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#1C1C1E',
          position: 'relative'
    }}>
      {/* Efectos de fondo similares al menú */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -10,
          pointerEvents: 'none'
        }}
          >
        {/* Gradiente base */}
        <Box
              sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(116, 172, 223, 0.04) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)
            `
          }}
                />

        {/* Orbes flotantes */}
        <Box
                  sx={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(116, 172, 223, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float1 20s ease-in-out infinite',
            '@keyframes float1': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(50px, -30px) scale(1.1)' }
            }
                  }}
        />
        <Box
                  sx={{ 
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float2 25s ease-in-out infinite reverse',
            '@keyframes float2': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(-40px, 20px) scale(1.2)' }
            }
                  }}
        />
            </Box>

      {/* Botón de regreso */}
      <MotionBox
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        sx={{
          position: 'absolute',
          top: { xs: 20, sm: 32 },
          left: { xs: 20, sm: 32 },
          zIndex: 2,
        }}
      >
        <MotionButton
          onClick={handleBackToHome}
          startIcon={<ArrowBackIcon />}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            color: '#A1A1AA',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            px: 2,
            py: 1,
            '&:hover': {
              color: '#F5F5F7',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            },
          }}
        >
          Volver al inicio
        </MotionButton>
      </MotionBox>

      <Container 
        maxWidth="md" 
        sx={{ 
          pt: { xs: 16, sm: 18 }, 
          pb: 8,
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Stack 
          spacing={{ xs: 6, sm: 8 }}
          alignItems="center" 
          textAlign="center"
        >
          {/* Logo/Icono - similar al HeroSection del menú */}
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
                color: '#74ACDF',
                filter: 'drop-shadow(0px 0px 20px rgba(116, 172, 223, 0.2))'
              }} 
            />
          </MotionBox>

          {/* Título principal - estilo similar al menú */}
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
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              color: '#F5F5F7',
              mb: 2,
              background: 'linear-gradient(135deg, #F5F5F7 0%, #A1A1AA 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              fontWeight: 500,
              color: '#A1A1AA',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 2,
              opacity: 0.8
            }}
          >
            Editor de Menú Digital
          </MotionTypography>

          <MotionTypography
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: 'easeOut',
              delay: 1.0
            }}
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              fontWeight: 400,
              color: '#A1A1AA',
              lineHeight: 1.5,
              maxWidth: 350,
              mx: 'auto',
              mb: 3
            }}
          >
            Ingresa la contraseña para acceder al editor de menú
          </MotionTypography>

          {/* Divisor decorativo */}
          <Box
            sx={{
              width: 60,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #74ACDF 50%, transparent 100%)',
              mx: 'auto',
              mb: 4
            }}
          />

          {/* Formulario - estilo similar a ProductCard */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: 'easeOut',
              delay: 1.2
            }}
            sx={{
              width: '100%',
              maxWidth: 400,
              background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.6) 0%, rgba(28, 28, 30, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              p: { xs: 4, sm: 5 },
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
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
                        borderColor: '#74ACDF',
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
                    background: '#74ACDF',
                    color: '#FFFFFF',
                    border: 'none',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#5a9bd4',
                      boxShadow: 'none',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: 'rgba(116, 172, 223, 0.3)',
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
                  fontSize: '0.75rem'
                }}
              >
                💡 Contraseña estándar: <code style={{ 
                  backgroundColor: 'rgba(116, 172, 223, 0.1)', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  color: '#74ACDF'
                }}>admin123</code>
              </Typography>
            </Box>
          </MotionBox>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminLogin;