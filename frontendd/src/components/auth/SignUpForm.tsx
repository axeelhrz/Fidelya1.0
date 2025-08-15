'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Link,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import { useSignUp } from '@/hooks/useSignUp';
import RoleSelector from './RoleSelector';
import NextLink from 'next/link';

// Custom Stepper Connector
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '&.Mui-active .MuiStepConnector-line': {
    background: 'linear-gradient(90deg, #2F6DFB 0%, #6AA6FF 100%)',
  },
  '&.Mui-completed .MuiStepConnector-line': {
    background: 'linear-gradient(90deg, #2F6DFB 0%, #6AA6FF 100%)',
  },
  '& .MuiStepConnector-line': {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
}));

// Zod schema for form validation
const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .trim()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  password_confirmation: z
    .string()
    .trim()
    .min(1, 'Confirma tu contraseña'),
  role: z.enum(['liga', 'miembro', 'club'], {
    required_error: 'Selecciona un tipo de cuenta',
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signUp, isLoading, error, clearError } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: undefined,
    },
  });

  const watchedFields = watch();
  const steps = ['Tipo de cuenta', 'Información personal'];

  const onSubmit = async (data: SignUpFormData) => {
    clearError();
    await signUp(data);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      const isRoleValid = await trigger('role');
      if (isRoleValid && watchedFields.role) {
        setCurrentStep(1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  const handleRoleSelect = (role: 'liga' | 'miembro' | 'club') => {
    setValue('role', role);
    trigger('role');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
  };

  const getFieldState = (fieldName: string, value: string, hasError: boolean) => {
    if (hasError) return 'error';
    if (value && !hasError) return 'success';
    if (focusedField === fieldName) return 'focused';
    return 'default';
  };

  const getIconColor = (state: string) => {
    switch (state) {
      case 'error': return 'error.main';
      case 'success': return 'success.main';
      case 'focused': return 'primary.main';
      default: return 'text.secondary';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Stepper */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Stepper 
              activeStep={currentStep} 
              connector={<CustomStepConnector />}
              sx={{ mb: 2 }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: index <= currentStep ? 'primary.main' : 'text.secondary',
                      },
                      '& .MuiStepIcon-root': {
                        color: index <= currentStep ? 'primary.main' : 'action.disabled',
                        '&.Mui-active': {
                          color: 'primary.main',
                        },
                        '&.Mui-completed': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="error" 
                onClose={clearError}
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Role Selection */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RoleSelector
                    selectedRole={field.value || ''}
                    onRoleSelect={handleRoleSelect}
                  />
                )}
              />

              {errors.role && (
                <Typography 
                  variant="body2" 
                  color="error" 
                  sx={{ mt: 1, fontSize: '0.8125rem', fontWeight: 500 }}
                >
                  {errors.role.message}
                </Typography>
              )}

              <Box sx={{ mt: 4 }}>
                <Button
                  onClick={handleNext}
                  disabled={!watchedFields.role}
                  fullWidth
                  variant="contained"
                  sx={{
                    height: 56,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                  component={motion.button}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                >
                  Continuar
                </Button>
              </Box>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => {
                      const fieldState = getFieldState('name', field.value, !!errors.name);
                      
                      return (
                        <TextField
                          {...field}
                          fullWidth
                          label="Nombre completo"
                          type="text"
                          autoComplete="name"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          disabled={isLoading}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Tu nombre completo"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon 
                                  sx={{ 
                                    color: getIconColor(fieldState),
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontSize: 20,
                                  }} 
                                />
                              </InputAdornment>
                            ),
                            endAdornment: field.value && !errors.name && (
                              <InputAdornment position="end">
                                <Fade in={true}>
                                  <CheckCircleIcon 
                                    sx={{ 
                                      color: 'success.main',
                                      fontSize: 20,
                                    }} 
                                  />
                                </Fade>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: 56,
                              borderRadius: 2,
                              backgroundColor: 'background.paper',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&.Mui-focused': {
                                transform: 'scale(1.005)',
                                boxShadow: fieldState === 'error' ? 
                                  '0 0 0 4px rgba(244, 67, 54, 0.08)' :
                                  '0 0 0 4px rgba(47, 109, 251, 0.08)',
                              },
                            },
                          }}
                          component={motion.div}
                          whileFocus={{ scale: 1.005 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        />
                      );
                    }}
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => {
                      const fieldState = getFieldState('email', field.value, !!errors.email);
                      
                      return (
                        <TextField
                          {...field}
                          fullWidth
                          label="Correo electrónico"
                          type="email"
                          autoComplete="email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          disabled={isLoading}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="tu@email.com"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon 
                                  sx={{ 
                                    color: getIconColor(fieldState),
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontSize: 20,
                                  }} 
                                />
                              </InputAdornment>
                            ),
                            endAdornment: field.value && !errors.email && (
                              <InputAdornment position="end">
                                <Fade in={true}>
                                  <CheckCircleIcon 
                                    sx={{ 
                                      color: 'success.main',
                                      fontSize: 20,
                                    }} 
                                  />
                                </Fade>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: 56,
                              borderRadius: 2,
                              backgroundColor: 'background.paper',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&.Mui-focused': {
                                transform: 'scale(1.005)',
                                boxShadow: fieldState === 'error' ? 
                                  '0 0 0 4px rgba(244, 67, 54, 0.08)' :
                                  '0 0 0 4px rgba(47, 109, 251, 0.08)',
                              },
                            },
                          }}
                          component={motion.div}
                          whileFocus={{ scale: 1.005 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        />
                      );
                    }}
                  />
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => {
                      const fieldState = getFieldState('password', field.value, !!errors.password);
                      
                      return (
                        <TextField
                          {...field}
                          fullWidth
                          label="Contraseña"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          error={!!errors.password}
                          helperText={errors.password?.message}
                          disabled={isLoading}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Mínimo 8 caracteres"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon 
                                  sx={{ 
                                    color: getIconColor(fieldState),
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontSize: 20,
                                  }} 
                                />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {field.value && !errors.password && (
                                    <Fade in={true}>
                                      <CheckCircleIcon 
                                        sx={{ 
                                          color: 'success.main',
                                          fontSize: 20,
                                        }} 
                                      />
                                    </Fade>
                                  )}
                                  <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    disabled={isLoading}
                                    sx={{ 
                                      color: 'text.secondary',
                                      '&:hover': {
                                        color: 'text.primary',
                                        backgroundColor: 'action.hover',
                                      },
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: 56,
                              borderRadius: 2,
                              backgroundColor: 'background.paper',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&.Mui-focused': {
                                transform: 'scale(1.005)',
                                boxShadow: fieldState === 'error' ? 
                                  '0 0 0 4px rgba(244, 67, 54, 0.08)' :
                                  '0 0 0 4px rgba(47, 109, 251, 0.08)',
                              },
                            },
                          }}
                          component={motion.div}
                          whileFocus={{ scale: 1.005 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        />
                      );
                    }}
                  />
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div variants={itemVariants}>
                  <Controller
                    name="password_confirmation"
                    control={control}
                    render={({ field }) => {
                      const fieldState = getFieldState('password_confirmation', field.value, !!errors.password_confirmation);
                      
                      return (
                        <TextField
                          {...field}
                          fullWidth
                          label="Confirmar contraseña"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          error={!!errors.password_confirmation}
                          helperText={errors.password_confirmation?.message}
                          disabled={isLoading}
                          onFocus={() => setFocusedField('password_confirmation')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Repite tu contraseña"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon 
                                  sx={{ 
                                    color: getIconColor(fieldState),
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontSize: 20,
                                  }} 
                                />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {field.value && !errors.password_confirmation && field.value === watchedFields.password && (
                                    <Fade in={true}>
                                      <CheckCircleIcon 
                                        sx={{ 
                                          color: 'success.main',
                                          fontSize: 20,
                                        }} 
                                      />
                                    </Fade>
                                  )}
                                  <IconButton
                                    onClick={toggleConfirmPasswordVisibility}
                                    edge="end"
                                    disabled={isLoading}
                                    sx={{ 
                                      color: 'text.secondary',
                                      '&:hover': {
                                        color: 'text.primary',
                                        backgroundColor: 'action.hover',
                                      },
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: 56,
                              borderRadius: 2,
                              backgroundColor: 'background.paper',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&.Mui-focused': {
                                transform: 'scale(1.005)',
                                boxShadow: fieldState === 'error' ? 
                                  '0 0 0 4px rgba(244, 67, 54, 0.08)' :
                                  '0 0 0 4px rgba(47, 109, 251, 0.08)',
                              },
                            },
                          }}
                          component={motion.div}
                          whileFocus={{ scale: 1.005 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        />
                      );
                    }}
                  />
                </motion.div>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    onClick={handleBack}
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      height: 56,
                      px: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      minWidth: 120,
                    }}
                    component={motion.button}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    Atrás
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading || !isValid}
                    sx={{
                      height: 56,
                      flex: 1,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                    component={motion.button}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CircularProgress size={20} color="inherit" />
                        <Typography variant="button" sx={{ fontWeight: 600 }}>
                          Creando cuenta...
                        </Typography>
                      </Box>
                    ) : (
                      'Crear cuenta'
                    )}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign In Link */}
        <motion.div variants={itemVariants}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              ¿Ya tienes cuenta?{' '}
              <Link
                component={NextLink}
                href="/auth/sign-in"
                sx={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: 'primary.main',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.dark',
                  },
                }}
              >
                Iniciar sesión
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default SignUpForm;