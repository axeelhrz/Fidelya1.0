import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LoginRounded,
  SecurityRounded,
  CheckCircleRounded,
  ErrorRounded,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Esquema de validación
const schema = yup.object({
  correo: yup
    .string()
    .email('Correo electrónico inválido')
    .required('El correo es obligatorio'),
  contraseña: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
});

const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  // Cargar email recordado
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberUser');
    if (rememberedEmail) {
      setRememberMe(true);
      setValue('correo', rememberedEmail);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await login({
        correo: data.correo,
        contraseña: data.contraseña
      });
      
      if (result.success) {
        // Manejar "recordarme"
        if (rememberMe) {
          localStorage.setItem('rememberUser', data.correo);
        } else {
          localStorage.removeItem('rememberUser');
        }
        
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
        
        reset();
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error inesperado en login:', err);
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  '& .MuiAlert-icon': {
                    color: 'error.main',
                  },
                }}
                icon={<ErrorRounded />}
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants}>
          <TextField
            {...register('correo')}
            fullWidth
            label="Correo electrónico"
            type="email"
            error={!!errors.correo}
            helperText={errors.correo?.message}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'rgba(248, 250, 252, 0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(248, 250, 252, 1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: watchedFields.correo && !errors.correo && (
                <InputAdornment position="end">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircleRounded sx={{ color: 'success.main' }} />
                  </motion.div>
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TextField
            {...register('contraseña')}
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            error={!!errors.contraseña}
            helperText={errors.contraseña?.message}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'rgba(248, 250, 252, 0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(248, 250, 252, 1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {watchedFields.contraseña && !errors.contraseña && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircleRounded sx={{ color: 'success.main' }} />
                      </motion.div>
                    )}
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  Recordarme
                </Typography>
              }
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              color="primary"
              sx={{ 
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              onClick={() => {
                alert('Funcionalidad de recuperación de contraseña próximamente');
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !isValid}
            sx={{ 
              mb: 4, 
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s ease',
              },
              '&:hover::before': {
                left: '100%',
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} color="inherit" />
                <Typography variant="button">Iniciando sesión...</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LoginRounded />
                <Typography variant="button">Iniciar Sesión</Typography>
                <ArrowForwardRounded />
              </Box>
            )}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ textAlign: 'center' }}>
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                ¿No tienes una cuenta?
              </Typography>
            </Divider>
            
            <Button
              variant="outlined"
              onClick={onSwitchToRegister}
              sx={{
                borderRadius: '12px',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: 'primary.main',
                fontWeight: 600,
                textTransform: 'none',
                px: 4,
                py: 1,
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              Crear cuenta nueva
            </Button>
          </Box>
        </motion.div>

        {/* Indicador de seguridad */}
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Box sx={{ 
            mt: 4, 
            p: 3, 
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            textAlign: 'center',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <SecurityRounded sx={{ color: 'primary.main', fontSize: 18 }} />
              <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                CONEXIÓN SEGURA
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              Tus datos están protegidos con encriptación de nivel bancario
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default LoginForm;