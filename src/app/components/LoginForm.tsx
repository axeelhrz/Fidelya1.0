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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
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
        background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(245,245,245,0.5) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, rgba(59, 130, 246, 0) 70%)',
          borderRadius: '50%',
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
          }}
        >
          <MotionBox variants={itemVariants} sx={{ mb: 2, width: '100%' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={() => router.push('/')}
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  color: 'primary.main',
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
              p: 5,
              maxWidth: 450,
              width: '100%',
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.06)',
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Elemento decorativo */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%)',
                borderRadius: '0 0 0 100%',
                zIndex: 0,
              }}
            />

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
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17,
                    delay: 0.4
                  }}
                >
                  <LockIcon 
                    sx={{ 
                      fontSize: 32,
                      color: 'primary.main',
                    }} 
                  />
                </motion.div>
              </Box>

              <MotionTypography
                variant="h4"
                align="center"
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Acceso Administrativo
              </MotionTypography>

              <MotionTypography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 4 }}
              >
                Ingresa la contraseña para acceder al panel
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
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: 'error.main',
                    }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
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
                    py: 1.8,
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    },
                  }}
                >
                  {isLoading ? 'Verificando...' : 'Ingresar'}
                </Button>
              </motion.div>
            </Box>
          </MotionPaper>

          <MotionBox
            variants={itemVariants}
            sx={{ 
              mt: 4,
              opacity: 0.6,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Potenciado por Assuriva • Diseño 2025
            </Typography>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
}