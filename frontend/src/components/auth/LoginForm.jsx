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
  LinearProgress,
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
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Esquema de validación mejorado
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
  const [fieldFocus, setFieldFocus] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  // Cargar email recordado al montar el componente
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberUser');
    if (rememberedEmail) {
      setRememberMe(true);
      setValue('correo', rememberedEmail);
    }
  }, [setValue]);

  // Validación en tiempo real
  React.useEffect(() => {
    const validateField = async (field, value) => {
      try {
        await schema.validateAt(field, { [field]: value });
        setValidationStatus(prev => ({ ...prev, [field]: 'valid' }));
      } catch (err) {
        setValidationStatus(prev => ({ ...prev, [field]: 'invalid' }));
      }
    };

    if (watchedFields.correo) {
      validateField('correo', watchedFields.correo);
    }
    if (watchedFields.contraseña) {
      validateField('contraseña', watchedFields.contraseña);
    }
  }, [watchedFields]);

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
        
        // Llamar callback de éxito
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

  const getFieldIcon = (field) => {
    if (!watchedFields[field]) return null;
    
    if (validationStatus[field] === 'valid') {
      return <CheckCircleRounded sx={{ color: 'success.main' }} />;
    } else if (validationStatus[field] === 'invalid') {
      return <ErrorRounded sx={{ color: 'error.main' }} />;
    }
    return null;
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
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
                icon={<ErrorRounded />}
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants}>
          <Box sx={{ position: 'relative', mb: 3 }}>
            <TextField
              {...register('correo')}
              fullWidth
              label="Correo electrónico"
              type="email"
              error={!!errors.correo}
              helperText={errors.correo?.message}
              onFocus={() => setFieldFocus(prev => ({ ...prev, correo: true }))}
              onBlur={() => setFieldFocus(prev => ({ ...prev, correo: false }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <motion.div
                      animate={{
                        scale: fieldFocus.correo ? 1.1 : 1,
                        rotate: fieldFocus.correo ? 5 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Email color="primary" />
                    </motion.div>
                  </InputAdornment>
                ),
                endAdornment: watchedFields.correo && (
                  <InputAdornment position="end">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {getFieldIcon('correo')}
                    </motion.div>
                  </InputAdornment>
                ),
              }}
            />
            {validationStatus.correo === 'valid' && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5 }}
              >
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    borderRadius: '0 0 16px 16px',
                    backgroundColor: 'transparent',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'success.main',
                    },
                  }}
                />
              </motion.div>
            )}
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <TextField
              {...register('contraseña')}
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.contraseña}
              helperText={errors.contraseña?.message}
              onFocus={() => setFieldFocus(prev => ({ ...prev, contraseña: true }))}
              onBlur={() => setFieldFocus(prev => ({ ...prev, contraseña: false }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <motion.div
                      animate={{
                        scale: fieldFocus.contraseña ? 1.1 : 1,
                        rotate: fieldFocus.contraseña ? 5 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Lock color="primary" />
                    </motion.div>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {watchedFields.contraseña && getFieldIcon('contraseña')}
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <motion.div
                          animate={{ rotate: showPassword ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </motion.div>
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            {validationStatus.contraseña === 'valid' && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5 }}
              >
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    borderRadius: '0 0 16px 16px',
                    backgroundColor: 'transparent',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'success.main',
                    },
                  }}
                />
              </motion.div>
            )}
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                  sx={{
                    '&.Mui-checked': {
                      animation: 'pulse 0.5s ease-in-out',
                    },
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
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
            disabled={loading}
            sx={{ 
              mb: 3, 
              py: 2,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
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
                <CircularProgress size={24} color="inherit" />
                <Typography variant="button">Iniciando sesión...</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LoginRounded />
                <Typography variant="button">Iniciar Sesión</Typography>
              </Box>
            )}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ¿No tienes una cuenta?
            </Typography>
            <Chip
              label="Regístrate aquí"
              onClick={onSwitchToRegister}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: '20px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.1))',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)',
                },
              }}
            />
          </Box>
        </motion.div>

        {/* Indicador de seguridad */}
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Box sx={{ 
            mt: 4, 
            p: 2, 
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            textAlign: 'center',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <SecurityRounded color="primary" fontSize="small" />
              <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                CONEXIÓN SEGURA
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Tus datos están protegidos con encriptación de nivel bancario
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default LoginForm;