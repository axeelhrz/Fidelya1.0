'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
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
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  alpha,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Google,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Security,
  Shield,
  Fingerprint,
  Refresh,
  Info,
  ErrorOutline,
  Business,
  Phone
} from '@mui/icons-material';

// Esquema de validación con Zod
const emailSchema = z.object({
  email: z.string().email('Correo electrónico inválido').min(1, 'El correo electrónico es requerido'),
});

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  company: z.string().optional(),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

const registerSchema = z.object({
  email: emailSchema.shape.email,
  firstName: personalInfoSchema.shape.firstName,
  lastName: personalInfoSchema.shape.lastName,
  company: personalInfoSchema.shape.company,
  phone: personalInfoSchema.shape.phone,
  password: passwordSchema.shape.password,
  confirmPassword: passwordSchema.shape.confirmPassword,
  termsAccepted: passwordSchema.shape.termsAccepted,
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

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

// Componente para mostrar la fortaleza de la contraseña
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // Criterios de fortaleza
  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  // Calcular puntuación
  const criteria = [hasLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
  const score = criteria.filter(Boolean).length;
  
  // Determinar color y mensaje
  let color = '#EF4444'; // Rojo
  let message = 'Débil';
  let progress = 20;
  
  if (score >= 3) {
    color = '#F59E0B'; // Amarillo
    message = 'Moderada';
    progress = 60;
  }
  
  if (score >= 5) {
    color = '#10B981'; // Verde
    message = 'Fuerte';
    progress = 100;
  }
  
  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif' }}>
          Fortaleza de la contraseña
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            color
          }}
        >
          {message}
        </Typography>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            transition: 'all 0.5s ease',
          }
        }}
      />
      
      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        {[
          { label: 'Longitud', met: hasLength },
          { label: 'Mayúscula', met: hasUpperCase },
          { label: 'Minúscula', met: hasLowerCase },
          { label: 'Número', met: hasNumber },
          { label: 'Especial', met: hasSpecialChar }
        ].map((criterion, index) => (
          <Chip
            key={index}
            size="small"
            label={criterion.label}
            color={criterion.met ? "success" : "default"}
            variant={criterion.met ? "filled" : "outlined"}
            sx={{
              height: 24,
              fontSize: '0.7rem',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              opacity: criterion.met ? 1 : 0.7,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

// Componente para generar contraseña segura
const PasswordGenerator = ({ onGenerate }: { onGenerate: (password: string) => void }) => {
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    
    // Asegurar al menos una de cada tipo
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
    
    // Completar el resto
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mezclar los caracteres
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    onGenerate(password);
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 1 }}>
      <Typography
        variant="caption"
        sx={{
          fontFamily: '"Inter", sans-serif',
          color: 'text.secondary',
          mr: 1
        }}
      >
        ¿Necesitas una contraseña segura?
      </Typography>
      <Button
        size="small"
        startIcon={<Refresh sx={{ fontSize: 14 }} />}
        onClick={generatePassword}
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.7rem',
          textTransform: 'none',
          py: 0.5,
          minWidth: 'auto',
        }}
      >
        Generar
      </Button>
    </Box>
  );
};

// Componente de características de seguridad
const SecurityFeatures = () => {
  const features = [
    { icon: <Shield fontSize="small" />, title: 'Encriptación de datos', description: 'Tus datos están protegidos con encriptación de nivel bancario' },
    { icon: <Fingerprint fontSize="small" />, title: 'Autenticación segura', description: 'Múltiples capas de seguridad protegen tu cuenta' },
    { icon: <Security fontSize="small" />, title: 'Verificación en dos pasos', description: 'Activa la verificación en dos pasos para mayor seguridad' },
  ];
  
  return (
    <Stack spacing={2} sx={{ mt: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          opacity: 0.9,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        <CheckCircle fontSize="small" color="success" />
        Tu seguridad es nuestra prioridad
      </Typography>
      
      {features.map((feature, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5
          }}
        >
          <Box
            sx={{
              color: 'primary.main',
              mt: 0.3
            }}
          >
            {feature.icon}
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                lineHeight: 1.2
              }}
            >
              {feature.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Inter", sans-serif',
                display: 'block',
                color: 'text.secondary',
                mt: 0.3
              }}
            >
              {feature.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

// Componente de beneficios
const BenefitsSection = () => {
  const benefits = [
    { title: 'Organiza tus pólizas fácilmente', description: 'Gestiona todas tus pólizas en un solo lugar con nuestro dashboard intuitivo.' },
    { title: 'Acceso seguro y encriptado', description: 'Tu información siempre protegida con los más altos estándares de seguridad.' },
    { title: 'Disponible 24/7 desde cualquier lugar', description: 'Accede a tu cuenta en cualquier momento y desde cualquier dispositivo.' },
  ];
  
  return (
    <Stack spacing={4} sx={{ height: '100%', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
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
          Únete a Assuriva
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
            <Stack spacing={1}>
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
            </Stack>
          </Card>
        </motion.div>
      ))}
      
      <SecurityFeatures />
    </Stack>
  );
};

// Componente para el paso 1: Email
const Step1Email = ({ emailAvailable, emailCheckLoading }: { emailAvailable: boolean | null, emailCheckLoading: boolean }) => {
  const { control, formState: { errors } } = useFormContext<RegisterFormData>();
  
  return (
    <Stack spacing={3}>
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
              endAdornment: emailCheckLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : emailAvailable === true ? (
                <InputAdornment position="end">
                  <Tooltip title="Email disponible">
                    <CheckCircle color="success" />
                  </Tooltip>
                </InputAdornment>
              ) : emailAvailable === false ? (
                <InputAdornment position="end">
                  <Tooltip title="Email no disponible">
                    <Info color="error" />
                  </Tooltip>
                </InputAdornment>
              ) : null,
              sx: {
                borderRadius: 2,
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
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
      
      {emailAvailable === true && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            severity="success"
            sx={{
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontFamily: '"Inter", sans-serif',
              }
            }}
          >
            Email disponible para registro
          </Alert>
        </motion.div>
      )}
      
      {emailAvailable === false && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontFamily: '"Inter", sans-serif',
              }
            }}
          >
            Este email ya está registrado
          </Alert>
        </motion.div>
      )}
    </Stack>
  );
};

// Componente para el paso 2: Información personal
const Step2PersonalInfo = () => {
  const { control, formState: { errors } } = useFormContext<RegisterFormData>();
  
  return (
    <Stack spacing={3}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nombre"
            variant="outlined"
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
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
      
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Apellido"
            variant="outlined"
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
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
      
      <Controller
        name="company"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Empresa (opcional)"
            variant="outlined"
            fullWidth
            error={!!errors.company}
            helperText={errors.company?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
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
      
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Teléfono (opcional)"
            variant="outlined"
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
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
    </Stack>
  );
};

// Componente para el paso 3: Contraseña y términos
const Step3Password = ({ showPassword, togglePasswordVisibility, handleGeneratePassword }: { 
  showPassword: boolean, 
  togglePasswordVisibility: () => void,
  handleGeneratePassword: (password: string) => void
}) => {
  const { control, watch, formState: { errors } } = useFormContext<RegisterFormData>();
  const watchPassword = watch('password', '');
  
  return (
    <Stack spacing={3}>
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
                  boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
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
      
      {/* Generador de contraseña */}
      <PasswordGenerator onGenerate={handleGeneratePassword} />
      
      {/* Indicador de fortaleza de contraseña */}
      {watchPassword && <PasswordStrengthIndicator password={watchPassword} />}
      
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Confirmar contraseña"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                fontFamily: '"Inter", sans-serif',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
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
      
      <Controller
        name="termsAccepted"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                color="primary"
                sx={{
                  '&.Mui-checked': {
                    color: '#3B82F6',
                  }
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.875rem',
                }}
              >
                Acepto los{' '}
                <Link href="/terminos" passHref>
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
                    términos y condiciones
                  </Typography>
                </Link>{' '}
                y la{' '}
                <Link href="/privacidad" passHref>
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
                    política de privacidad
                  </Typography>
                </Link>
              </Typography>
            }
            sx={{
              alignItems: 'flex-start',
              '.MuiFormControlLabel-label': {
                mt: 0.5
              }
            }}
          />
        )}
      />
      
      {errors.termsAccepted && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            fontFamily: '"Inter", sans-serif',
            mt: -2,
            ml: 2
          }}
        >
          {errors.termsAccepted.message}
        </Typography>
      )}
    </Stack>
  );
};

// Componente principal de la página
export default function SignUpForm() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === 'dark';
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { signUp, signInWithGoogle, error: authError, clearError } = useAuth();
  
  type PlanId = 'basic' | 'pro' | 'enterprise';
  
  interface Plan {
    id: string;
    name: string;
    price: number;
    billingPeriod?: string;
    trialDays?: number;
    paypalPlanId?: string;
  }
  
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false
    },
    mode: 'onChange'
  });
  
  const { handleSubmit, watch, setValue, trigger } = methods;
  
  const watchEmail = watch('email', '');
  
  // Cargar plan seleccionado desde localStorage
  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        const plan = JSON.parse(storedPlan);
        setSelectedPlan(plan);
      }
    } catch (error) {
      console.error('Error al cargar el plan seleccionado:', error);
    }
  }, []);
  
  // Limpiar errores de autenticación al desmontar
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  // Verificar disponibilidad de email
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (!watchEmail || !watchEmail.includes('@') || !watchEmail.includes('.')) {
        setEmailAvailable(null);
        return;
      }
      
      setEmailCheckLoading(true);
      
      try {
        // Verificar si el email ya está en uso en Firebase
        const isInUse = await fetch(`/api/auth/check-email?email=${encodeURIComponent(watchEmail)}`).then(res => res.json()).then(data => data.exists);
        setEmailAvailable(!isInUse);
      } catch (error) {
        console.error('Error al verificar email:', error);
        setEmailAvailable(true); // Asumimos disponible en caso de error
      } finally {
        setEmailCheckLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(checkEmailAvailability, 800);
    return () => clearTimeout(debounceTimer);
  }, [watchEmail]);
  
  // Manejar errores de autenticación
  useEffect(() => {
    if (authError) {
      setError(authError.message);
    }
  }, [authError]);
  
  const handleNext = async () => {
    let isValid = false;
    
    if (activeStep === 0) {
      isValid = await trigger('email');
      if (isValid && emailAvailable) {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      isValid = await trigger(['firstName', 'lastName', 'company', 'phone']);
      if (isValid) {
        setActiveStep(2);
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  
  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Registrar usuario
      const response = await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        plan: (selectedPlan?.id as PlanId) || 'basic' as PlanId,
        termsAccepted: data.termsAccepted
      });
      
      if (response.error) {
        setError(response.error.message);
        setLoading(false);
        return;
      }
      
      // Redirigir a la página de verificación de email
      router.push('/auth/verify-email');
      
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('Ha ocurrido un error al registrarse. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await signInWithGoogle();
      
      if (response.error) {
        setError(response.error.message);
        setLoading(false);
        return;
      }
      
      const user = response.user;
      
      // Redirigir según el estado de verificación
      if (user?.emailVerified) {
        router.push('/dashboard');
      } else {
        router.push('/auth/verify-email');
      }
      
    } catch (error) {
      console.error('Error al registrarse con Google:', error);
      setError('Error al registrarse con Google. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleGeneratePassword = (password: string) => {
    setValue('password', password);
    setValue('confirmPassword', password);
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
  
  const stepVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  // Pasos del registro
  const steps = ['Correo electrónico', 'Información personal', 'Seguridad'];
  
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
          {/* Formulario de registro (ahora a la izquierda) */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: { xs: '100%', sm: '500px' },
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
                    Crear cuenta
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
                    Únete a Assuriva y comienza a gestionar tus pólizas
                  </Typography>
                </motion.div>
                
                {/* Mostrar información del plan seleccionado si existe */}
                {selectedPlan && (
                  <motion.div 
                    variants={itemVariants}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isDark 
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ fontFamily: '"Inter", sans-serif' }}>
                          Plan seleccionado: <span style={{ color: theme.palette.primary.main }}>{selectedPlan.name}</span>
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', display: 'block', mt: 0.5 }}>
                          {selectedPlan.price === 0 ? 'Gratuito' : `$${selectedPlan.price}/${selectedPlan.billingPeriod === 'year' ? 'año' : 'mes'}`}
                        </Typography>
                      </Box>
                      <Chip 
                        label={selectedPlan.id === 'basic' ? 'Básico' : selectedPlan.id === 'pro' ? 'Profesional' : 'Enterprise'} 
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    </Paper>
                  </motion.div>
                )}
                
                {/* Stepper */}
                <motion.div variants={itemVariants}>
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{
                      mb: 4,
                      '& .MuiStepLabel-label': {
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.8rem',
                        mt: 0.5
                      },
                      '& .MuiStepIcon-root': {
                        color: 'rgba(59, 130, 246, 0.3)',
                        '&.Mui-active, &.Mui-completed': {
                          color: '#3B82F6',
                        }
                      }
                    }}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
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
                      <Alert 
                        severity="error" 
                        sx={{ 
                          borderRadius: 2,
                          alignItems: 'center',
                          '& .MuiAlert-icon': {
                            alignItems: 'center',
                            mr: 1
                          }
                        }}
                        icon={<ErrorOutline />}
                      >
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(handleRegister)}>
                    <AnimatePresence mode="wait">
                      {/* Paso 1: Email */}
                      {activeStep === 0 && (
                        <motion.div
                          key="step1"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Step1Email 
                            emailAvailable={emailAvailable} 
                            emailCheckLoading={emailCheckLoading} 
                          />
                          
                          <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={handleNext}
                            disabled={loading || !emailAvailable}
                            sx={{
                              mt: 3,
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
                            Continuar
                          </Button>
                        </motion.div>
                      )}

                      {/* Paso 2: Información personal */}
                      {activeStep === 1 && (
                        <motion.div
                          key="step2"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Step2PersonalInfo />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                              variant="outlined"
                              size="large"
                              startIcon={<ArrowBack />}
                              onClick={handleBack}
                              sx={{
                                py: 1.5,
                                px: 3,
                                borderRadius: 2,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderWidth: '2px',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              Atrás
                            </Button>
                            
                            <Button
                              variant="contained"
                              size="large"
                              endIcon={<ArrowForward />}
                              onClick={handleNext}
                              sx={{
                                py: 1.5,
                                px: 3,
                                borderRadius: 2,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                                boxShadow: isDark
                                  ? '0 4px 12px rgba(37, 99, 235, 0.5)'
                                  : '0 4px 12px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              Continuar
                            </Button>
                          </Box>
                        </motion.div>
                      )}
                      
                      {/* Paso 3: Contraseña y términos */}
                      {activeStep === 2 && (
                        <motion.div
                          key="step3"
                          variants={stepVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Step3Password 
                            showPassword={showPassword}
                            togglePasswordVisibility={togglePasswordVisibility}
                            handleGeneratePassword={handleGeneratePassword}
                          />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                              variant="outlined"
                              size="large"
                              startIcon={<ArrowBack />}
                              onClick={handleBack}
                              sx={{
                                py: 1.5,
                                px: 3,
                                borderRadius: 2,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderWidth: '2px',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              Atrás
                            </Button>
                            
                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              disabled={loading}
                              sx={{
                                py: 1.5,
                                px: 3,
                                borderRadius: 2,
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '1rem',
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
                                'Crear cuenta'
                              )}
                            </Button>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </FormProvider>
                
                {/* Separador y botón de Google */}
                {activeStep === 0 && (
                  <>
                    <motion.div variants={itemVariants}>
                      <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                        <Divider sx={{ flex: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            mx: 2,
                            color: 'text.secondary',
                          }}
                        >
                          o regístrate con
                        </Typography>
                        <Divider sx={{ flex: 1 }} />
                      </Box>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        startIcon={<Google />}
                        onClick={handleGoogleSignUp}
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
                        Registrarse con Google
                      </Button>
                    </motion.div>
                  </>
                )}
                
                {/* Enlace para iniciar sesión */}
                <motion.div variants={itemVariants}>
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      ¿Ya tienes cuenta?{' '}
                      <Link href="/auth/sign-in" passHref>
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
                          Inicia sesión
                        </Typography>
                      </Link>
                    </Typography>
                  </Box>
                </motion.div>
              </Card>
            </motion.div>
          </Box>
          
          {/* Sección de beneficios (ahora a la derecha) */}
          {isDesktop && (
            <Box sx={{ flex: 1, p: 3, display: { xs: 'none', md: 'block' } }}>
              <BenefitsSection />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}