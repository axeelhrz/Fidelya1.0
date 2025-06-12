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
  Snackbar
} from '@mui/material';
import {
  Person,
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
  nombre: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es obligatorio'),
  correo: yup
    .string()
    .email('Correo electrónico inválido')
    .required('El correo es obligatorio'),
  contraseña: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    )
    .required('La contraseña es obligatoria'),
  confirmarContraseña: yup
    .string()
    .oneOf([yup.ref('contraseña'), null], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

const RegisterForm = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  
  const { register: registerUser } = useAuth();

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
      const { confirmarContraseña, ...userData } = data;
      const result = await registerUser(userData);
      
      if (result.success) {
        setSuccessSnackbar(true);
        reset();
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {error && (
            <motion.div variants={itemVariants}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <TextField
              {...register('nombre')}
              fullWidth
              label="Nombre completo"
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
              sx={{ mb: 2 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" sx={{ fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { fontSize: '0.875rem' }
              }}
              FormHelperTextProps={{
                sx: { fontSize: '0.75rem' }
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              {...register('correo')}
              fullWidth
              label="Correo electrónico"
              type="email"
              error={!!errors.correo}
              helperText={errors.correo?.message}
              sx={{ mb: 2 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" sx={{ fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { fontSize: '0.875rem' }
              }}
              FormHelperTextProps={{
                sx: { fontSize: '0.75rem' }
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
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" sx={{ fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { fontSize: '0.875rem' }
              }}
              FormHelperTextProps={{
                sx: { fontSize: '0.75rem' }
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextField
              {...register('confirmarContraseña')}
              fullWidth
              label="Confirmar contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              error={!!errors.confirmarContraseña}
              helperText={errors.confirmarContraseña?.message}
              sx={{ mb: 2 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" sx={{ fontSize: '1.1rem' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { fontSize: '0.875rem' }
              }}
              FormHelperTextProps={{
                sx: { fontSize: '0.75rem' }
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mb: 2, 
                py: 1.2,
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                ¿Ya tienes una cuenta?{' '}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  color="primary"
                  onClick={onSwitchToLogin}
                  sx={{ 
                    textDecoration: 'none', 
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </motion.div>

      {/* Snackbar de éxito */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            fontSize: '0.875rem',
          }}
        >
          ¡Cuenta creada exitosamente! Redirigiendo al login...
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterForm;