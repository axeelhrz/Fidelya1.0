'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  Stack,
  Card,
  Alert,
  CircularProgress,
  alpha
} from '@mui/material';
import {
  Email,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';

// Esquema de validación con Zod
const resetPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido').min(1, 'El correo electrónico es requerido'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

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

// Componente principal
export default function ResetPasswordForm() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      await sendPasswordResetEmail(auth, data.email);
      setSuccess(true);
      setEmailSent(data.email);
    } catch (error) {
      let errorMessage = 'Ha ocurrido un error al enviar el correo de restablecimiento';
      
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No existe una cuenta con este correo electrónico';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Formato de correo electrónico inválido';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Demasiados intentos. Intenta más tarde';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
      
      <Box
        sx={{
          width: '100%',
          maxWidth: '450px',
          margin: 'auto',
          p: 3,
          zIndex: 1,
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
                ? alpha(theme.palette.background.paper, 0.7)
                : alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(16px)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(59, 130, 246, 0.1)',
              boxShadow: isDark 
                ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                : '0 10px 30px rgba(59, 130, 246, 0.1)',
            }}
          >
            {success ? (
              // Pantalla de éxito
              <Stack spacing={3} alignItems="center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 40,
                        color: theme.palette.success.main,
                      }}
                    />
                  </Box>
                </motion.div>
                
                <Typography
                  variant="h5"
                  component="h1"
                  textAlign="center"
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Correo enviado
                </Typography>
                
                <Typography
                  variant="body1"
                  textAlign="center"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    mb: 3,
                  }}
                >
                  Hemos enviado un correo de restablecimiento a <strong>{emailSent}</strong>. Sigue las instrucciones para crear una nueva contraseña.
                </Typography>
                
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 2,
                    width: '100%',
                    '& .MuiAlert-message': {
                      fontFamily: '"Inter", sans-serif',
                    }
                  }}
                >
                  Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.
                </Alert>
                
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={() => router.push('/auth/sign-in')}
                  sx={{
                    mt: 2,
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
                  Volver a inicio de sesión
                </Button>
              </Stack>
            ) : (
              // Formulario de restablecimiento
              <>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    Restablecer contraseña
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
                    Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
                  </Typography>
                </motion.div>
                
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
                
                <form onSubmit={handleSubmit(handleResetPassword)}>
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
                    
                    {/* Botón de enviar */}
                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
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
                          'Enviar instrucciones'
                        )}
                      </Button>
                    </motion.div>
                    
                    {/* Enlace para volver a inicio de sesión */}
                    <motion.div variants={itemVariants}>
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link href="/auth/sign-in" passHref>
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: '"Inter", sans-serif',
                              color: 'primary.main',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            <ArrowBack fontSize="small" /> Volver a inicio de sesión
                          </Typography>
                        </Link>
                      </Box>
                    </motion.div>
                  </Stack>
                </form>
              </>
            )}
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}