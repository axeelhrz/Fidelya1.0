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
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
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
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(data);
      
      if (result.success) {
        // Guardar preferencia de "recordarme"
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
        setError(result.message);
      }
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar email recordado al montar el componente
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberUser');
    if (rememberedEmail) {
      setRememberMe(true);
      // Establecer el valor en el formulario
      reset({ correo: rememberedEmail });
    }
  }, [reset]);

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <motion.div variants={itemVariants}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <TextField
            {...register('correo')}
            fullWidth
            label="Correo electrónico"
            type="email"
            error={!!errors.correo}
            helperText={errors.correo?.message}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
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
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Recordarme"
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              color="primary"
              sx={{ textDecoration: 'none' }}
              onClick={() => {
                // Aquí podrías implementar la funcionalidad de "olvidé mi contraseña"
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
            sx={{ mb: 3, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes una cuenta?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                color="primary"
                onClick={onSwitchToRegister}
                sx={{ textDecoration: 'none', fontWeight: 500 }}
              >
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default LoginForm;