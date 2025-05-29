'use client';

import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, InputAdornment, Container, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginIcon from '@mui/icons-material/Login';

// Componentes con motion
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulamos un pequeño retraso para dar feedback visual
    await new Promise(resolve => setTimeout(resolve, 800));

    // Contraseña estática para simular login
    if (password === 'admin123') {
      router.push('/admin/dashboard');
    } else {
      setError('Contraseña incorrecta');
      setIsLoading(false);
    }
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.01) 49%, rgba(255,255,255,0.01) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.01) 49%, rgba(255,255,255,0.01) 51%, transparent 52%)
          `,
          backgroundSize: '400px 400px, 300px 300px, 20px 20px, 20px 20px',
          zIndex: 0,
        }
      }}
    >
      {/* Elementos decorativos flotantes */}
        <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
          sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)',
                  borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0,
                }}
                  />

      <Container maxWidth="sm">
          <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
            sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <MotionBox variants={itemVariants} sx={{ mb: 3, width: '100%' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={() => router.push('/')}
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3B82F6',
                  minHeight: 48,
                  minWidth: 48,
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.25)',
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </motion.div>
        </MotionBox>

          <MotionPaper
            variants={itemVariants}
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              maxWidth: 450,
              width: '100%',
              borderRadius: 4,
              backgroundColor: '#2C2C2E',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.02) 49%, rgba(255,255,255,0.02) 51%, transparent 52%),
                  radial-gradient(circle at 30% 70%, rgba(245, 158, 11, 0.03) 0%, transparent 50%)
                `,
                backgroundSize: '15px 15px, 200px 200px',
                zIndex: 0,
}
            }}
          >
            <MotionBox
              variants={itemVariants}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 4,
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17,
                    delay: 0.6
                  }}
                >
                  <LockIcon 
                    sx={{ 
                      fontSize: 36,
                      color: '#3B82F6',
                    }} 
                  />
                </motion.div>
              </Box>

              <MotionTypography
                variant="h4"
                align="center"
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  background: 'linear-gradient(135deg, #3B82F6 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Panel Administrativo
              </MotionTypography>

              <MotionTypography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 5, lineHeight: 1.6 }}
              >
                Acceso exclusivo para gestión del menú digital
              </MotionTypography>
            </MotionBox>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 4, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    '& .MuiAlert-icon': {
                      color: '#ef4444',
                    }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ position: 'relative', zIndex: 1 }}>
              <TextField
                fullWidth
                type="password"
                placeholder="Contraseña de administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(28, 28, 30, 0.6)',
                    color: '#F5F5F7',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3B82F6',
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#A1A1AA',
                    opacity: 1,
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#A1A1AA' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(59, 130, 246, 0.3)',
                    }
                  }}
                >
                  {isLoading ? 'Verificando acceso...' : 'Ingresar al Panel'}
                </Button>
              </motion.div>
            </Box>
          </MotionPaper>

          <MotionBox
            variants={itemVariants}
            sx={{ 
              mt: 6,
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                opacity: 0.6,
              }}
            >
              POWERED BY ASSURIVA • ADMIN PANEL
            </Typography>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
}