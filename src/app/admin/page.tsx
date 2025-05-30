'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Visibility, 
  VisibilityOff, 
  AdminPanelSettings,
  Restaurant,
  Lock
} from '@mui/icons-material';
import AdminDashboard from './components/AdminDashboard';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionButton = motion(Button);

const ADMIN_PASSWORD = 'xs-reset-admin-2024'; // En producción esto debería estar en variables de entorno

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si ya está autenticado al cargar
  useEffect(() => {
    const authStatus = localStorage.getItem('xs-reset-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('xs-reset-admin-auth', 'true');
    } else {
      setError('Contraseña incorrecta. Intenta nuevamente.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('xs-reset-admin-auth');
    setPassword('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Fondo elegante */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.02) 0%, transparent 50%),
            linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(16, 16, 16, 1) 100%)
          `,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="sm" sx={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3
      }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          sx={{ width: '100%', maxWidth: 400 }}
        >
          <MotionPaper
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              p: { xs: 4, sm: 5 },
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 0,
              textAlign: 'center'
            }}
          >
            {/* Logo del admin */}
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
              <AdminPanelSettings sx={{ 
                color: '#D4AF37', 
                fontSize: 32
              }} />
            </Box>

            {/* Título */}
            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#F8F8F8',
                mb: 1,
                letterSpacing: '0.02em'
              }}
            >
              Panel de Administración
            </Typography>

            <Typography 
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                color: '#B8B8B8',
                mb: 4,
                fontWeight: 400
              }}
            >
              Xs Reset - Gestión del Menú
            </Typography>

            {/* Línea decorativa */}
            <Box
              sx={{
                width: 60,
                height: 1,
                background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
                mx: 'auto',
                mb: 4
              }}
            />

            <Stack spacing={3}>
              {/* Campo de contraseña */}
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Contraseña de Administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#B8B8B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#B8B8B8' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(212, 175, 55, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D4AF37',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#B8B8B8',
                    fontFamily: "'Inter', sans-serif",
                    '&.Mui-focused': {
                      color: '#D4AF37',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#F8F8F8',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1rem',
                  },
                }}
              />

              {/* Mensaje de error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
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
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón de acceso */}
              <MotionButton
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={loading || !password.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: loading || !password.trim() 
                    ? 'rgba(212, 175, 55, 0.3)' 
                    : 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                  color: loading || !password.trim() ? '#B8B8B8' : '#0A0A0A',
                  border: 'none',
                  borderRadius: 0,
                  boxShadow: loading || !password.trim() 
                    ? 'none' 
                    : '0 4px 16px rgba(212, 175, 55, 0.3)',
                  '&:hover': {
                    background: loading || !password.trim() 
                      ? 'rgba(212, 175, 55, 0.3)' 
                      : 'linear-gradient(135deg, #E8C547 0%, #D4AF37 100%)',
                    boxShadow: loading || !password.trim() 
                      ? 'none' 
                      : '0 6px 20px rgba(212, 175, 55, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(212, 175, 55, 0.3)',
                    color: '#B8B8B8'
                  }
                }}
              >
                {loading ? 'Verificando...' : 'Acceder al Panel'}
              </MotionButton>
            </Stack>

            {/* Info adicional */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Restaurant sx={{ fontSize: 16, color: '#B8B8B8' }} />
                <Typography
                  sx={{
                    color: '#B8B8B8',
                    fontSize: '0.8rem',
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.8
                  }}
                >
                  Gestión segura del menú digital
                </Typography>
              </Stack>
            </Box>
          </MotionPaper>
        </MotionBox>
      </Container>
    </Box>
  );
}