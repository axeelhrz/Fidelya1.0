'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import Logo from '@/components/ui/logo';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  Stack,
  Card,
  Divider,
  Badge,
  useMediaQuery,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Login,
  Security,
  AccessTime,
  Dashboard
} from '@mui/icons-material';

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido').min(1, 'El correo electrónico es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

type LoginFormData = z.infer<typeof loginSchema>;

// Componente de partículas animadas
const ParticlesBackground = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const particleColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)';
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {[...Array(50)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            backgroundColor: particleColor,
            borderRadius: '50%',
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
          }}
          animate={{
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </Box>
  );
};

// Componente de beneficios
const BenefitsSection = () => {
  const benefits = [
    { icon: <Dashboard />, title: 'Organiza tus pólizas fácilmente', description: 'Gestiona todas tus pólizas en un solo lugar con nuestro dashboard intuitivo.' },
    { icon: <Security />, title: 'Acceso seguro y encriptado', description: 'Tu información siempre protegida con los más altos estándares de seguridad.' },
    { icon: <AccessTime />, title: 'Disponible 24/7 desde cualquier lugar', description: 'Accede a tu cuenta en cualquier momento y desde cualquier dispositivo.' },
  ];

  return (
    <Stack spacing={4} sx={{ height: '100%', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Typography 
          variant="h4" 
          fontWeight={800} 
          gutterBottom
          sx={{ 
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Bienvenido a Assuriva
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: '"Inter", sans-serif',
            mb: 4,
            opacity: 0.9
          }}
        >
          La plataforma que revoluciona la gestión de seguros
        </Typography>
      </motion.div>

      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + index * 0.2, duration: 0.6 }}
        >
          <Card 
            elevation={0}
            sx={{ 
              p: 2, 
              borderRadius: 2,
              background: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.5)' 
                : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(59, 130, 246, 0.1)'}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: (theme) => theme.palette.mode === 'dark' 
                  ? '0 10px 20px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 20px rgba(59, 130, 246, 0.1)',
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box 
                sx={{ 
                  color: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {benefit.icon}
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ 
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '1rem',
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    opacity: 0.8,
                    fontSize: '0.875rem',
                  }}
                >
                  {benefit.description}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </motion.div>
      ))}
    </Stack>
  );
};

// Componente principal de la página
export default function SignInForm() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPlan, setSavedPlan] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    // Verificar si hay un plan guardado en localStorage
    try {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        setSavedPlan(JSON.parse(storedPlan));
      }
    } catch (error) {
      console.error('Error al recuperar el plan guardado:', error);
    }
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      let errorMessage = 'Ha ocurrido un error al iniciar sesión';
      
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No existe una cuenta con este correo electrónico';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Contraseña incorrecta';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Formato de correo electrónico inválido';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      setError('Error al iniciar sesión con Google');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animaciones para los elementos del formulario
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        background: isDark
          ? 'radial-gradient(circle at 50% 50%, #0F172A 0%, #1E293B 100%)'
          : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #EFF6FF 100%)',
        overflow: 'hidden',
      }}
    >
      <ParticlesBackground />
      
      {/* Logo */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.div>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90vh',
            gap: 4,
          }}
        >
          {/* Sección de beneficios (solo visible en desktop) */}
          {isDesktop && (
            <Box sx={{ flex: 1, p: 3, display: { xs: 'none', md: 'block' } }}>
              <BenefitsSection />
            </Box>
          )}

          {/* Formulario de inicio de sesión */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: { xs: '100%', sm: '450px' },
            }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  background: isDark 
                    ? 'rgba(15, 23, 42, 0.7)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(16px)',
                  border: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(59, 130, 246, 0.1)',
                  boxShadow: isDark 
                    ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 30px rgba(59, 130, 246, 0.1)',
                }}
              >
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: { xs: '2rem', md: '3rem' },
                      background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    Iniciar Sesión
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      mb: 3,
                      opacity: 0.8,
                    }}
                  >
                    Accede a tu cuenta para gestionar tus pólizas
                  </Typography>
                </motion.div>

                {/* Badge de plan seleccionado */}
                {savedPlan && (
                  <motion.div 
                    variants={itemVariants}
                    style={{ marginBottom: '16px' }}
                  >
                    <Badge
                      sx={{
                        '& .MuiBadge-badge': {
                          position: 'static',
                          transform: 'none',
                          p: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }
                      }}
                      badgeContent={`Estás ingresando con el plan ${savedPlan}`}
                      color="primary"
                    />
                  </motion.div>
                )}

                {/* Mensaje de error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      style={{ marginBottom: '16px' }}
                    >
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(handleLogin)}>
                  <Stack spacing={3}>
                    {/* Campo de correo electrónico */}
                    <motion.div variants={itemVariants}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Correo electrónico"
                            variant="outlined"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email color="primary" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: 2,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                '&:focus-within': {
                                  boxShadow: `0 0 0 3px ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                                },
                              }
                            }}
                            InputLabelProps={{
                              sx: {
                                fontFamily: '"Inter", sans-serif',
                              }
                            }}
                          />
                        )}
                      />
                    </motion.div>

                    {/* Campo de contraseña */}
                    <motion.div variants={itemVariants}>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock color="primary" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: 2,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                '&:focus-within': {
                                  boxShadow: `0 0 0 3px ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                                },
                              }
                            }}
                            InputLabelProps={{
                              sx: {
                                fontFamily: '"Inter", sans-serif',
                              }
                            }}
                          />
                        )}
                      />
                    </motion.div>

                    {/* Enlace para recuperar contraseña */}
                    <motion.div variants={itemVariants}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Link href="/auth/reset-password" passHref>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              color: 'primary.main',
                              cursor: 'pointer',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            ¿Olvidaste tu contraseña?
                          </Typography>
                        </Link>
                      </Box>
                    </motion.div>

                    {/* Botón de inicio de sesión */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        startIcon={loading ? undefined : <Login />}
                        sx={{
                          mt: 2,
                          py: 1.5,
                          borderRadius: 2,
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                          boxShadow: isDark 
                            ? '0 4px 12px rgba(37, 99, 235, 0.5)' 
                            : '0 4px 12px rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Iniciar sesión'
                        )}
                      </Button>
                    </motion.div>

                    {/* Separador */}
                    <motion.div variants={itemVariants}>
                      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                        <Divider sx={{ flex: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            mx: 2,
                            color: 'text.secondary',
                          }}
                        >
                          o continúa con
                        </Typography>
                        <Divider sx={{ flex: 1 }} />
                      </Box>
                    </motion.div>

                    {/* Botón de Google */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        startIcon={<Google />}
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderWidth: '2px',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Iniciar sesión con Google
                      </Button>
                    </motion.div>

                    {/* Enlace para registrarse */}
                    <motion.div variants={itemVariants}>
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                          }}
                        >
                          ¿No tienes una cuenta?{' '}
                          <Link href="/auth/sign-up" passHref>
                            <Typography
                              component="span"
                              sx={{
                                fontFamily: '"Inter", sans-serif',
                                color: 'primary.main',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              Regístrate
                            </Typography>
                          </Link>
                        </Typography>
                      </Box>
                    </motion.div>
                  </Stack>
                </form>
              </Card>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
