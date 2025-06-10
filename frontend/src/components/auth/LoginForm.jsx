import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  InputAdornment, 
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { 
  EmailRounded, 
  LockRounded, 
  VisibilityRounded, 
  VisibilityOffRounded,
  LoginRounded,
  PersonAddRounded
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';

// Esquema de validación
const schema = yup.object({
  correo: yup
    .string()
    .email('Ingresa un correo válido')
    .required('El correo es requerido'),
  contraseña: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});

const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  const theme = useTheme();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Datos del formulario:', data);
      
      // Usar el contexto de autenticación en lugar del servicio directamente
      const response = await login({
        correo: data.correo,
        contraseña: data.contraseña
      });
      
      if (response.success) {
        reset();
        onLoginSuccess(response.user);
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                mb: 2,
                borderRadius: '12px',
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                fontSize: '0.875rem',
                '& .MuiAlert-icon': {
                  fontSize: '1.1rem'
                }
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <motion.div variants={inputVariants} initial="hidden" animate="visible">
          <TextField
            {...register('correo')}
            fullWidth
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            error={!!errors.correo}
            helperText={errors.correo?.message}
            disabled={isLoading}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRounded sx={{ color: alpha(theme.palette.text.secondary, 0.6), fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: alpha(theme.palette.background.default, 0.4),
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.default, 0.6),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.default, 0.8),
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.3),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500,
                fontSize: '0.875rem',
              },
              '& .MuiFormHelperText-root': {
                fontSize: '0.75rem',
              },
            }}
          />
        </motion.div>

        <motion.div 
          variants={inputVariants} 
          initial="hidden" 
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <TextField
            {...register('contraseña')}
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            error={!!errors.contraseña}
            helperText={errors.contraseña?.message}
            disabled={isLoading}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRounded sx={{ color: alpha(theme.palette.text.secondary, 0.6), fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={isLoading}
                    size="small"
                    sx={{ 
                      color: alpha(theme.palette.text.secondary, 0.6),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    {showPassword ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: alpha(theme.palette.background.default, 0.4),
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.default, 0.6),
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.background.default, 0.8),
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.3),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500,
                fontSize: '0.875rem',
              },
              '& .MuiFormHelperText-root': {
                fontSize: '0.75rem',
              },
            }}
          />
        </motion.div>

        <motion.div 
          variants={inputVariants} 
          initial="hidden" 
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <LoginRounded fontSize="small" />
              )
            }
            sx={{
              py: 1.2,
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.2)}, transparent)`,
                transition: 'left 0.6s ease',
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&::before': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'translateY(0px)',
              },
              '&:disabled': {
                background: alpha(theme.palette.action.disabled, 0.3),
                color: alpha(theme.palette.text.disabled, 0.7),
                boxShadow: 'none',
                transform: 'none',
              },
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Box sx={{ mt: 3 }}>
          <Divider 
            sx={{ 
              mb: 2,
              '&::before, &::after': {
                borderColor: alpha(theme.palette.divider, 0.2),
              }
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: alpha(theme.palette.text.secondary, 0.7),
                fontWeight: 500,
                px: 1.5,
                fontSize: '0.75rem',
              }}
            >
              ¿No tienes cuenta?
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={onSwitchToRegister}
            disabled={isLoading}
            startIcon={<PersonAddRounded fontSize="small" />}
            sx={{
              py: 1,
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.5),
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateY(-1px)',
                boxShadow: `0 3px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
              '&:active': {
                transform: 'translateY(0px)',
              },
            }}
          >
            Crear cuenta nueva
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default LoginForm;