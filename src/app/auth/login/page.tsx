'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  Alert,
  InputAdornment,
  alpha,
  Paper,
  Divider,
  Collapse,
  Fade,
  Slide,
  Zoom,
} from '@mui/material';
import {
  Email,
  Lock,
  ArrowBack,
  Visibility,
  VisibilityOff,
  Login,
  PersonAdd,
  Shield,
  Speed,
  Verified,
  Key,
  Send,
  Close,
  Warning,
  AutoAwesome,
} from '@mui/icons-material';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { getDashboardRoute } from '@/lib/auth';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [configValid, setConfigValid] = useState(true);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Animation trigger
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate Firebase configuration on component mount
  useEffect(() => {
    const isValid = authService.validateFirebaseConfig();
    setConfigValid(isValid);
    
    if (!isValid) {
      toast.error('Error de configuración. Contacta al administrador.');
    }
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      clearErrors();

      console.log('🔐 Login attempt for:', data.email);

      // Validate Firebase configuration before attempting login
      if (!configValid) {
        throw new Error('Error de configuración del sistema. Contacta al administrador.');
      }

      const response = await authService.signIn({
        email: data.email.trim().toLowerCase(),
        password: data.password
      });

      if (!response.success) {
        console.error('🔐 Login failed:', response.error);
        setError('root', { message: response.error || 'Error al iniciar sesión' });
        return;
      }

      if (!response.user) {
        console.error('🔐 Login succeeded but no user data returned');
        setError('root', { message: 'Error al obtener datos del usuario' });
        return;
      }

      console.log('🔐 Login successful for user:', response.user.nombre);
      toast.success(`¡Bienvenido, ${response.user.nombre}!`);
      
      const dashboardRoute = getDashboardRoute(response.user.role);
      console.log('🔐 Redirecting to:', dashboardRoute);
      router.push(dashboardRoute);
      
    } catch (error: unknown) {
      console.error('🔐 Login error:', error);
      
      let message = 'Ha ocurrido un error inesperado. Intenta nuevamente.';
      
      if (error && typeof error === 'object' && 'message' in error) {
        message = (error as { message: string }).message;
      }
      
      setError('root', { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast.error('Ingresa tu email para recuperar la contraseña');
      return;
    }

    if (!resetEmail.includes('@')) {
      toast.error('Ingresa un email válido');
      return;
    }

    setIsResetting(true);
    try {
      console.log('🔐 Password reset attempt for:', resetEmail);
      
      const response = await authService.resetPassword(resetEmail.trim().toLowerCase());
      
      if (response.success) {
        toast.success('Enlace de recuperación enviado a tu email');
        setShowForgotPassword(false);
        setResetEmail('');
      } else {
        toast.error(response.error || 'Error al enviar el enlace de recuperación');
      }
    } catch (error: unknown) {
      console.error('🔐 Password reset error:', error);
      toast.error('Error al enviar el enlace de recuperación');
    } finally {
      setIsResetting(false);
    }
  };

  const securityFeatures = [
    { icon: <Shield />, text: 'SSL Seguro', color: '#10b981' },
    { icon: <Verified />, text: 'Verificado', color: '#3b82f6' },
    { icon: <Speed />, text: 'Acceso Rápido', color: '#f59e0b' },
  ];

  const demoAccounts = [
    { role: 'Asociación', email: 'asociacion@demo.com', password: 'demo123', color: '#8b5cf6' },
    { role: 'Comercio', email: 'comercio@demo.com', password: 'demo123', color: '#3b82f6' },
    { role: 'Socio', email: 'socio@demo.com', password: 'demo123', color: '#10b981' },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#fafbfc',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 50%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99,102,241, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(59,130,246, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Configuration Error Alert */}
        <Fade in={!configValid} timeout={500}>
          <Box>
            {!configValid && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 4,
                  bgcolor: alpha('#ef4444', 0.05),
                  border: `1px solid ${alpha('#ef4444', 0.2)}`,
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
                }}
                icon={<Warning />}
              >
                Error de configuración del sistema. Contacta al administrador.
              </Alert>
            )}
          </Box>
        </Fade>

        {/* Header */}
        <Slide in={mounted} direction="down" timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Zoom in={mounted} timeout={600}>
              <IconButton
                component={Link}
                href="/"
                sx={{ 
                  position: 'absolute',
                  top: 24,
                  left: 24,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <ArrowBack />
              </IconButton>
            </Zoom>

            {/* Logo & Brand */}
            <Fade in={mounted} timeout={1000}>
              <Box sx={{ mb: 4 }}>
                <Box
                  component={Link}
                  href="/"
                  sx={{
                    display: 'inline-flex',
                    width: 80,
                    height: 80,
                    borderRadius: 5,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    mb: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)',
                    letterSpacing: '-0.02em',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.6s',
                    },
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: '0 25px 80px rgba(99, 102, 241, 0.5)',
                      '&::before': {
                        transform: 'translateX(100%)',
                      }
                    },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <AutoAwesome 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      fontSize: '1rem',
                      opacity: 0.7,
                      animation: 'pulse 2s infinite'
                    }} 
                  />
                  F
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    letterSpacing: '-0.01em',
                    background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Fidelya
                </Typography>
              </Box>
            </Fade>

            <Slide in={mounted} direction="up" timeout={1200}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.2rem' },
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #6366f1 70%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.04em',
                    lineHeight: 0.9,
                    textShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  Bienvenido de vuelta
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 500,
                    fontSize: '1.1rem',
                    maxWidth: 450,
                    mx: 'auto',
                    lineHeight: 1.6,
                    opacity: 0.9
                  }}
                >
                  Accede a tu cuenta de Fidelya y gestiona tu programa de fidelidad con estilo
                </Typography>
              </Box>
            </Slide>
          </Box>
        </Slide>

        <Zoom in={mounted} timeout={1000}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 6,
              border: '1px solid rgba(226, 232, 240, 0.8)',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.05)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
              }
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Box component="form" onSubmit={handleSubmit(handleLogin)}>
                <Stack spacing={5}>
                  {/* Login Form */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 4,
                        fontSize: '1.3rem',
                        letterSpacing: '-0.02em',
                        textAlign: 'center'
                      }}
                    >
                      Iniciar Sesión
                    </Typography>
                    
                    <Stack spacing={4}>
                      <TextField
                        {...register('email')}
                        label="Correo electrónico"
                        placeholder="tu@email.com"
                        type="email"
                        fullWidth
                        disabled={!configValid}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: '#94a3b8', fontSize: '1.4rem' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            bgcolor: 'rgba(248, 250, 252, 0.8)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '1rem',
                            '& fieldset': {
                              borderColor: 'rgba(226, 232, 240, 0.8)',
                              borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                            },
                            '&.Mui-focused': {
                              bgcolor: 'rgba(255, 255, 255, 0.95)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 600,
                            '&.Mui-focused': {
                              color: '#6366f1',
                            },
                          },
                        }}
                      />

                      <TextField
                        {...register('password')}
                        label="Contraseña"
                        placeholder="Tu contraseña"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        disabled={!configValid}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: '#94a3b8', fontSize: '1.4rem' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                disabled={!configValid}
                                sx={{ 
                                  color: '#94a3b8',
                                  '&:hover': {
                                    color: '#6366f1',
                                    bgcolor: alpha('#6366f1', 0.05),
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            bgcolor: 'rgba(248, 250, 252, 0.8)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '1rem',
                            '& fieldset': {
                              borderColor: 'rgba(226, 232, 240, 0.8)',
                              borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                            },
                            '&.Mui-focused': {
                              bgcolor: 'rgba(255, 255, 255, 0.95)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 600,
                            '&.Mui-focused': {
                              color: '#6366f1',
                            },
                          },
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Forgot Password */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      onClick={() => setShowForgotPassword(!showForgotPassword)}
                      disabled={!configValid}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#6366f1',
                        fontSize: '0.95rem',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        '&:hover': {
                          bgcolor: alpha('#6366f1', 0.08),
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>

                    <Collapse in={showForgotPassword} timeout={400}>
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 4,
                          p: 5,
                          bgcolor: alpha('#6366f1', 0.04),
                          border: `1.5px solid ${alpha('#6366f1', 0.12)}`,
                          borderRadius: 5,
                          position: 'relative',
                          overflow: 'hidden',
                          backdropFilter: 'blur(10px)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 4,
                              bgcolor: alpha('#6366f1', 0.15),
                              color: '#6366f1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.2)',
                            }}
                          >
                            <Key sx={{ fontSize: '1.8rem' }} />
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: '#6366f1',
                                mb: 1.5,
                                fontSize: '1.2rem'
                              }}
                            >
                              Recuperar Contraseña
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: alpha('#6366f1', 0.8),
                                mb: 4,
                                fontSize: '0.95rem',
                                lineHeight: 1.5
                              }}
                            >
                              Ingresa tu email y te enviaremos un enlace seguro para restablecer tu contraseña.
                            </Typography>
                            
                            <Stack spacing={3}>
                              <TextField
                                label="Email de recuperación"
                                placeholder="tu@email.com"
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                size="small"
                                fullWidth
                                disabled={!configValid}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Email sx={{ color: '#94a3b8', fontSize: '1.2rem' }} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    '& fieldset': {
                                      borderColor: alpha('#6366f1', 0.25),
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#6366f1',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#6366f1',
                                      boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)',
                                    }
                                  },
                                  '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#6366f1',
                                  },
                                }}
                              />
                              
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                  onClick={handlePasswordReset}
                                  disabled={isResetting || !resetEmail || !configValid}
                                  variant="contained"
                                  size="small"
                                  startIcon={<Send />}
                                  sx={{
                                    flex: 1,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}
                                >
                                  {isResetting ? 'Enviando...' : 'Enviar enlace'}
                                </Button>
                                <IconButton
                                  onClick={() => {
                                    setShowForgotPassword(false);
                                    setResetEmail('');
                                  }}
                                  size="small"
                                  sx={{ 
                                    color: '#94a3b8',
                                    '&:hover': {
                                      color: '#ef4444',
                                      bgcolor: alpha('#ef4444', 0.05),
                                    }
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              </Box>
                            </Stack>
                          </Box>
                        </Box>
                      </Paper>
                    </Collapse>
                  </Box>

                  {/* Error Alert */}
                  <Fade in={!!errors.root} timeout={300}>
                    <Box>
                      {errors.root && (
                        <Alert 
                          severity="error" 
                          sx={{ 
                            borderRadius: 4,
                            bgcolor: alpha('#ef4444', 0.05),
                            border: `1.5px solid ${alpha('#ef4444', 0.2)}`,
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.1)',
                          }}
                        >
                          {errors.root.message}
                        </Alert>
                      )}
                    </Box>
                  </Fade>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting || !configValid}
                    endIcon={isSubmitting ? null : <Login />}
                    sx={{
                      py: 3,
                      borderRadius: 5,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                      letterSpacing: '-0.01em',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.6s',
                      },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #9333ea 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.5)',
                        '&::before': {
                          transform: 'translateX(100%)',
                        }
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                        color: '#94a3b8',
                        transform: 'none',
                        boxShadow: 'none',
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </Button>

                  {/* Divider */}
                  <Box sx={{ position: 'relative', my: 4 }}>
                    <Divider sx={{ borderColor: '#f1f5f9' }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        px: 4,
                        borderRadius: 3,
                        border: '1px solid #f1f5f9',
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
                        ¿No tienes cuenta?
                      </Typography>
                    </Box>
                  </Box>

                  {/* Register Button */}
                  <Button
                    component={Link}
                    href="/auth/register"
                    variant="outlined"
                    fullWidth
                    disabled={!configValid}
                    startIcon={<PersonAdd />}
                    sx={{
                      py: 2.5,
                      borderRadius: 5,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                      color: '#475569',
                      borderWidth: 2,
                      letterSpacing: '-0.01em',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: '#6366f1',
                        bgcolor: alpha('#6366f1', 0.05),
                        color: '#6366f1',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 30px rgba(99, 102, 241, 0.15)',
                        borderWidth: 2,
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    Crear cuenta nueva
                  </Button>

                  {/* Security Features */}
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'rgba(248, 250, 252, 0.8)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      borderRadius: 5,
                      p: 4,
                      mt: 4,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        gap: 3
                      }}
                    >
                      {securityFeatures.map((feature, index) => (
                        <Zoom key={index} in={mounted} timeout={1000 + index * 200}>
                          <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 3,
                                bgcolor: alpha(feature.color, 0.1),
                                color: feature.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 1.5,
                                boxShadow: `0 4px 15px ${alpha(feature.color, 0.2)}`,
                                '&:hover': {
                                  transform: 'translateY(-2px) scale(1.05)',
                                  boxShadow: `0 8px 25px ${alpha(feature.color, 0.3)}`,
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {React.cloneElement(feature.icon, { sx: { fontSize: '1.3rem' } })}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748b',
                                fontWeight: 600,
                                fontSize: '0.8rem'
                              }}
                            >
                              {feature.text}
                            </Typography>
                          </Box>
                        </Zoom>
                      ))}
                    </Box>
                  </Paper>

                  {/* Demo Accounts */}
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: alpha('#f59e0b', 0.04),
                      border: `1.5px solid ${alpha('#f59e0b', 0.2)}`,
                      borderRadius: 5,
                      p: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      backdropFilter: 'blur(10px)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #f59e0b, #f97316, #ea580c)',
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#f59e0b',
                        mb: 3,
                        fontSize: '1.1rem',
                        textAlign: 'center'
                      }}
                    >
                      Cuentas de Demostración
                    </Typography>
                    
                    <Stack spacing={2}>
                      {demoAccounts.map((account, index) => (
                        <Slide key={index} in={mounted} direction="left" timeout={800 + index * 200}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 3,
                              bgcolor: 'rgba(255, 255, 255, 0.7)',
                              borderRadius: 4,
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(245, 158, 11, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.1)',
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box 
                                sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%', 
                                  bgcolor: account.color,
                                  boxShadow: `0 0 10px ${alpha(account.color, 0.5)}`
                                }} 
                              />
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: '#92400e', fontSize: '0.85rem' }}
                              >
                                {account.role}:
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography
                                variant="body2"
                                sx={{ color: '#92400e', fontSize: '0.8rem', fontFamily: 'monospace', mb: 0.5 }}
                              >
                                {account.email}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: '#92400e', fontSize: '0.8rem', fontFamily: 'monospace' }}
                              >
                                {account.password}
                              </Typography>
                            </Box>
                          </Box>
                        </Slide>
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      </Container>
    </Box>
  );
};

export default LoginPage;