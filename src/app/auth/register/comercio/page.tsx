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
} from '@mui/material';
import {
  Store,
  Person,
  Email,
  Lock,
  Category,
  ArrowBack,
  Visibility,
  VisibilityOff,
  ArrowForward,
  Business,
} from '@mui/icons-material';
import Link from 'next/link';
import { comercioRegisterSchema, type ComercioRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';

const ComercioRegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ComercioRegisterFormData>({
    resolver: zodResolver(comercioRegisterSchema),
  });

  const handleRegister = async (data: ComercioRegisterFormData) => {
    try {
      setIsSubmitting(true);
      const userData = await createUser(data.email, data.password, {
        nombre: data.nombre,
        email: data.email,
        role: 'comercio',
        estado: 'activo',
      });
      
      const dashboardRoute = getDashboardRoute(userData.role);
      router.push(dashboardRoute);
    } catch (error: unknown) {
      let message = 'Ha ocurrido un error. Inténtalo de nuevo.';
      if (error instanceof Error) {
        message = error.message;
      }
      setError('root', {
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            href="/auth/register"
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
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '2.2rem',
                fontWeight: 900,
                mb: 3,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                letterSpacing: '-0.02em',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 16px 50px rgba(139, 92, 246, 0.4)',
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

          {/* Role Badge */}
          <Paper
            elevation={0}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              px: 3,
              py: 1.5,
              mb: 4,
              borderRadius: 4,
              bgcolor: alpha('#8b5cf6', 0.08),
              border: `1px solid ${alpha('#8b5cf6', 0.15)}`,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: alpha('#8b5cf6', 0.15),
                color: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Business sx={{ fontSize: '1.2rem' }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#8b5cf6',
                  fontSize: '0.9rem',
                  lineHeight: 1.2
                }}
              >
                Cuenta Comercio
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: alpha('#8b5cf6', 0.8),
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}
              >
                Para negocios y empresas
              </Typography>
            </Box>
          </Paper>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 1,
              fontSize: { xs: '2.2rem', md: '2.8rem' },
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
            }}
          >
            Crear Cuenta
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
            Únete a nuestra plataforma y comienza a fidelizar a tus clientes con beneficios únicos
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
            <Box component="form" onSubmit={handleSubmit(handleRegister)}>
              <Stack spacing={4}>
                {/* Personal Info Section */}
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
                    Información Personal
                  </Typography>
                  
                  <TextField
                    {...register('nombre')}
                    label="Nombre del responsable"
                    placeholder="Tu nombre completo"
                    fullWidth
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
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
                          borderColor: '#8b5cf6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#8b5cf6',
                          borderWidth: 2,
                        },
                        '&.Mui-focused': {
                          bgcolor: 'white',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#8b5cf6',
                      },
                    }}
                  />
                </Box>

                {/* Business Info Section */}
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
                    Información del Negocio
                  </Typography>
                  
                  <Stack spacing={3}>
                    <TextField
                      {...register('nombreComercio')}
                      label="Nombre del comercio"
                      placeholder="Nombre de tu negocio"
                      fullWidth
                      error={!!errors.nombreComercio}
                      helperText={errors.nombreComercio?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Store sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
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
                            borderColor: '#8b5cf6',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#8b5cf6',
                        },
                      }}
                    />

                    <TextField
                      {...register('categoria')}
                      label="Categoría del negocio"
                      placeholder="Ej: Restaurante, Tienda, Servicios"
                      fullWidth
                      error={!!errors.categoria}
                      helperText={errors.categoria?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Category sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
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
                            borderColor: '#8b5cf6',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#8b5cf6',
                        },
                      }}
                    />
                  </Stack>
                </Box>

                {/* Account Info Section */}
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
                    Información de la Cuenta
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
                            borderColor: '#8b5cf6',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#8b5cf6',
                        },
                      }}
                    />

                    <TextField
                      {...register('password')}
                      label="Contraseña"
                      placeholder="Mínimo 6 caracteres"
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
                            borderColor: '#8b5cf6',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#8b5cf6',
                        },
                      }}
                    />

                    <TextField
                      {...register('confirmPassword')}
                      label="Confirmar contraseña"
                      placeholder="Confirma tu contraseña"
                      type={showConfirmPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{ color: '#94a3b8' }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                            borderColor: '#8b5cf6',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                            borderWidth: 2,
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#8b5cf6',
                        },
                      }}
                    />
                  </Stack>
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
                  endIcon={isSubmitting ? null : <ArrowForward />}
                  sx={{
                    py: 2.5,
                    borderRadius: 4,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                    letterSpacing: '-0.01em',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
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
                  {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center', pt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Box
                      component={Link}
                      href="/auth/login"
                      sx={{
                        color: '#8b5cf6',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Iniciar sesión
                    </Box>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ComercioRegisterPage;