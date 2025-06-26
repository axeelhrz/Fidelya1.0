'use client';

import React, { useState } from 'react';
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
} from '@mui/icons-material';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { signIn, resetPassword, getDashboardRoute } from '@/lib/auth';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      const userData = await signIn(data.email, data.password);
      
      if (userData.estado === 'inactivo') {
        throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
      }

      toast.success(`¡Bienvenido, ${userData.nombre}!`);
      
      const dashboardRoute = getDashboardRoute(userData.role);
      router.push(dashboardRoute);
    } catch (error: unknown) {
      let message = 'Ha ocurrido un error. Inténtalo de nuevo.';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        
        switch (firebaseError.code) {
          case 'auth/user-not-found':
            message = 'No existe una cuenta con este email.';
            break;
          case 'auth/wrong-password':
            message = 'Contraseña incorrecta.';
            break;
          case 'auth/invalid-email':
            message = 'El formato del email no es válido.';
            break;
          case 'auth/user-disabled':
            message = 'Esta cuenta ha sido deshabilitada.';
            break;
          case 'auth/too-many-requests':
            message = 'Demasiados intentos fallidos. Intenta más tarde.';
            break;
          default:
            if (firebaseError.message) {
              message = firebaseError.message;
            }
        }
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
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
      await resetPassword(resetEmail);
      toast.success('Enlace de recuperación enviado a tu email');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: unknown }).code === 'auth/user-not-found'
      ) {
        toast.error('No existe una cuenta con este email');
      } else {
        toast.error('Error al enviar el enlace de recuperación');
      }
    } finally {
      setIsResetting(false);
    }
  };

  const securityFeatures = [
    { icon: <Shield />, text: 'SSL Seguro' },
    { icon: <Verified />, text: 'Verificado' },
    { icon: <Speed />, text: 'Acceso Rápido' },
  ];

  const demoAccounts = [
    { role: 'Asociación', email: 'asociacion@demo.com', password: 'demo123' },
    { role: 'Comercio', email: 'comercio@demo.com', password: 'demo123' },
    { role: 'Socio', email: 'socio@demo.com', password: 'demo123' },
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
        <Box sx={{ textAlign: 'center', mb: 5 }}>
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

          {/* Logo & Brand */}
          <Box sx={{ mb: 4 }}>
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'inline-flex',
                width: 72,
                height: 72,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '2.2rem',
                fontWeight: 900,
                mb: 3,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)',
                letterSpacing: '-0.02em',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 16px 50px rgba(99, 102, 241, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              F
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '1.1rem',
                letterSpacing: '-0.01em'
              }}
            >
              Fidelita
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 1,
              fontSize: { xs: '2.2rem', md: '2.8rem' },
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #6366f1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}
          >
            Bienvenido de vuelta
          </Typography>
          
          <Typography
            variant="body1"
            sx={{ 
              color: '#64748b', 
              fontWeight: 500,
              fontSize: '1.05rem',
              maxWidth: 420,
              mx: 'auto',
              lineHeight: 1.5
            }}
          >
            Accede a tu cuenta de Fidelita y gestiona tu programa de fidelidad
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
            <Box component="form" onSubmit={handleSubmit(handleLogin)}>
              <Stack spacing={4}>
                {/* Login Form */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#1e293b',
                      mb: 3,
                      fontSize: '1.1rem',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Iniciar Sesión
                  </Typography>
                  
                  <Stack spacing={3}>
                    <TextField
                      {...register('email')}
                      label="Correo electrónico"
                      placeholder="tu@email.com"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: '#fafbfc',
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                            borderWidth: 2,
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#6366f1',
                        },
                      }}
                    />

                    <TextField
                      {...register('password')}
                      label="Contraseña"
                      placeholder="Tu contraseña"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#94a3b8' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: '#fafbfc',
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#6366f1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                            borderWidth: 2,
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#6366f1',
                        },
                      }}
                    />
                  </Stack>
                </Box>

                {/* Forgot Password */}
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    onClick={() => setShowForgotPassword(!showForgotPassword)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#6366f1',
                      fontSize: '0.9rem',
                      '&:hover': {
                        bgcolor: alpha('#6366f1', 0.05),
                      }
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>

                  <Collapse in={showForgotPassword}>
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 3,
                        p: 4,
                        bgcolor: alpha('#6366f1', 0.05),
                        border: `1px solid ${alpha('#6366f1', 0.15)}`,
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            bgcolor: alpha('#6366f1', 0.15),
                            color: '#6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Key sx={{ fontSize: '1.5rem' }} />
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: '#6366f1',
                              mb: 1,
                              fontSize: '1.1rem'
                            }}
                          >
                            Recuperar Contraseña
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: alpha('#6366f1', 0.8),
                              mb: 3,
                              fontSize: '0.9rem'
                            }}
                          >
                            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                          </Typography>
                          
                          <Stack spacing={2}>
                            <TextField
                              label="Email de recuperación"
                              placeholder="tu@email.com"
                              type="email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              size="small"
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Email sx={{ color: '#94a3b8', fontSize: '1.1rem' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  bgcolor: 'white',
                                  '& fieldset': {
                                    borderColor: alpha('#6366f1', 0.2),
                                  },
                                  '&:hover fieldset': {
                                    borderColor: '#6366f1',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#6366f1',
                                  }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: '#6366f1',
                                },
                              }}
                            />
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                onClick={handlePasswordReset}
                                disabled={isResetting || !resetEmail}
                                variant="contained"
                                size="small"
                                startIcon={<Send />}
                                sx={{
                                  flex: 1,
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                                  }
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
                                sx={{ color: '#94a3b8' }}
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
                {errors.root && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 3,
                      bgcolor: alpha('#ef4444', 0.05),
                      border: `1px solid ${alpha('#ef4444', 0.2)}`,
                    }}
                  >
                    {errors.root.message}
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? null : <Login />}
                  sx={{
                    py: 2.5,
                    borderRadius: 4,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    letterSpacing: '-0.01em',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                    },
                    '&:disabled': {
                      background: '#e2e8f0',
                      color: '#94a3b8',
                      transform: 'none',
                      boxShadow: 'none',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>

                {/* Divider */}
                <Box sx={{ position: 'relative', my: 3 }}>
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
                  startIcon={<PersonAdd />}
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
                  Crear cuenta nueva
                </Button>

                {/* Security Features - Replaced Grid with Flexbox */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 4,
                    p: 3,
                    mt: 3
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    {securityFeatures.map((feature, index) => (
                      <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            bgcolor: alpha('#10b981', 0.1),
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 1,
                          }}
                        >
                          {React.cloneElement(feature.icon, { sx: { fontSize: '1.1rem' } })}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748b',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        >
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* Demo Accounts */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: alpha('#f59e0b', 0.05),
                    border: `1px solid ${alpha('#f59e0b', 0.2)}`,
                    borderRadius: 4,
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#f59e0b',
                      mb: 2,
                      fontSize: '1rem',
                      textAlign: 'center'
                    }}
                  >
                    Cuentas de Demostración
                  </Typography>
                  
                  <Stack spacing={1}>
                    {demoAccounts.map((account, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#92400e', fontSize: '0.8rem' }}
                        >
                          {account.role}:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#92400e', fontSize: '0.8rem', fontFamily: 'monospace' }}
                        >
                          {account.email} / {account.password}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;