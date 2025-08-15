'use client';

import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Avatar,
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
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HomeIcon from '@mui/icons-material/Home';
import SportsIcon from '@mui/icons-material/Sports';
import CakeIcon from '@mui/icons-material/Cake';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
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

// Esquema de validación simplificado - solo para el paso 1
const roleSchema = z.object({
  role: z.enum(['liga', 'miembro', 'club'], {
    required_error: 'Selecciona un tipo de cuenta',
  }),
});

// Esquema completo para el paso 2 (sin validación estricta para permitir campos dinámicos)
const completeSchema = z.object({
  role: z.enum(['liga', 'miembro', 'club']),
  email: z.string().trim().min(1, 'El correo electrónico es requerido').email('Ingresa un correo electrónico válido'),
  password: z.string().trim().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  password_confirmation: z.string().trim().min(1, 'Confirma tu contraseña'),
  phone: z.string().trim().min(1, 'El teléfono es requerido'),
  country: z.string().trim().min(1, 'El país es requerido'),
  // Campos opcionales que se validarán dinámicamente
  league_name: z.string().optional(),
  province: z.string().optional(),
  club_name: z.string().optional(),
  league_id: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  full_name: z.string().optional(),
  club_id: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(['masculino', 'femenino']).optional(),
  rubber_type: z.enum(['liso', 'pupo', 'ambos']).optional(),
  ranking: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
});

const SignUpForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const { signUp, isLoading, error, clearError } = useSignUp();

  // Usar esquema diferente según el paso
  const currentSchema = currentStep === 0 ? roleSchema : completeSchema;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
    defaultValues: {
      role: undefined,
      country: 'Ecuador',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      league_name: '',
      province: '',
      club_name: '',
      league_id: '',
      city: '',
      address: '',
      full_name: '',
      club_id: '',
      birth_date: '',
      gender: undefined,
      rubber_type: undefined,
      ranking: '',
    },
  });

  const watchedFields = watch();
  const selectedRole = watchedFields.role;
  const steps = ['Tipo de cuenta', 'Información personal'];

  // Cargar datos simulados
  useEffect(() => {
    setLeagues([
      { id: '1', name: 'Liga Nacional de Tenis de Mesa' },
      { id: '2', name: 'Liga Provincial de Pichincha' },
      { id: '3', name: 'Liga Regional del Guayas' },
    ]);

    setClubs([
      { id: '1', name: 'Club Deportivo Los Campeones', league: 'Liga Nacional' },
      { id: '2', name: 'Club Raqueta de Oro', league: 'Liga Provincial' },
      { id: '3', name: 'Club Tenis de Mesa Quito', league: 'Liga Nacional' },
    ]);
  }, []);

  const onSubmit = async (data: any) => {
    if (currentStep === 0) {
      // Validar solo el rol en el paso 1
      if (!data.role) {
        return;
      }
      setCurrentStep(1);
      return;
    }

    // Paso 2: Enviar datos completos
    clearError();
    
    // Validar campos específicos según el rol
    const validationErrors: string[] = [];
    
    if (selectedRole === 'liga') {
      if (!data.league_name?.trim()) validationErrors.push('El nombre de la liga es requerido');
      if (!data.province?.trim()) validationErrors.push('La provincia es requerida');
    } else if (selectedRole === 'club') {
      if (!data.club_name?.trim()) validationErrors.push('El nombre del club es requerido');
      if (!data.league_id) validationErrors.push('Selecciona una liga');
      if (!data.city?.trim()) validationErrors.push('La ciudad es requerida');
      if (!data.address?.trim()) validationErrors.push('La dirección es requerida');
    } else if (selectedRole === 'miembro') {
      if (!data.full_name?.trim()) validationErrors.push('El nombre completo es requerido');
      if (!data.club_id) validationErrors.push('Selecciona un club');
      if (!data.birth_date) validationErrors.push('La fecha de nacimiento es requerida');
      if (!data.gender) validationErrors.push('Selecciona el sexo');
      if (!data.rubber_type) validationErrors.push('Selecciona el tipo de caucho');
    }

    if (validationErrors.length > 0) {
      clearError();
      setTimeout(() => {
        clearError();
        // Mostrar el primer error
        const errorMessage = validationErrors[0];
        // Aquí podrías usar un estado local para mostrar el error
        console.error('Validation errors:', validationErrors);
      }, 100);
      return;
    }

    await signUp(data);
  };

  const handleNext = async () => {
    const isRoleValid = await trigger('role');
    if (isRoleValid && watchedFields.role) {
      setCurrentStep(1);
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'photo') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogoPreview(reader.result as string);
        } else {
          setPhotoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
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

  // Componente para campos de Liga
  const renderLeagueFields = () => (
    <>
      {/* Nombre de la Liga */}
      <motion.div variants={itemVariants}>
        <Controller
          name="league_name"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('league_name', field.value || '', !!errors.league_name);
            return (
              <TextField
                {...field}
                fullWidth
                label="Nombre de la liga"
                error={!!errors.league_name}
                helperText={errors.league_name?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('league_name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ej: Liga Nacional de Tenis de Mesa"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: field.value && !errors.league_name && (
                    <InputAdornment position="end">
                      <Fade in={true}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Provincia */}
      <motion.div variants={itemVariants}>
        <Controller
          name="province"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('province', field.value || '', !!errors.province);
            return (
              <TextField
                {...field}
                fullWidth
                label="Provincia / Región"
                error={!!errors.province}
                helperText={errors.province?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('province')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ej: Pichincha, Guayas, Azuay"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: field.value && !errors.province && (
                    <InputAdornment position="end">
                      <Fade in={true}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Logo Upload */}
      <motion.div variants={itemVariants}>
        <Box>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
            Logo de la liga (opcional)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={logoPreview}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: 'primary.light',
                color: 'primary.main',
              }}
            >
              <BusinessIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                height: 48,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Subir logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
              />
            </Button>
          </Box>
        </Box>
      </motion.div>
    </>
  );

  // Componente para campos de Club
  const renderClubFields = () => (
    <>
      {/* Nombre del Club */}
      <motion.div variants={itemVariants}>
        <Controller
          name="club_name"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('club_name', field.value || '', !!errors.club_name);
            return (
              <TextField
                {...field}
                fullWidth
                label="Nombre del club"
                error={!!errors.club_name}
                helperText={errors.club_name?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('club_name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ej: Club Deportivo Los Campeones"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: field.value && !errors.club_name && (
                    <InputAdornment position="end">
                      <Fade in={true}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Liga a la que pertenece */}
      <motion.div variants={itemVariants}>
        <Controller
          name="league_id"
          control={control}
          render={({ field }) => (
            <FormControl 
              fullWidth 
              error={!!errors.league_id}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                },
              }}
            >
              <InputLabel>Liga a la que pertenece</InputLabel>
              <Select
                {...field}
                label="Liga a la que pertenece"
                disabled={isLoading}
              >
                {leagues.map((league) => (
                  <MenuItem key={league.id} value={league.id}>
                    {league.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.league_id && (
                <FormHelperText>{errors.league_id.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </motion.div>

      {/* Ciudad */}
      <motion.div variants={itemVariants}>
        <Controller
          name="city"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('city', field.value || '', !!errors.city);
            return (
              <TextField
                {...field}
                fullWidth
                label="Provincia / Ciudad"
                error={!!errors.city}
                helperText={errors.city?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ej: Quito, Guayaquil, Cuenca"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: field.value && !errors.city && (
                    <InputAdornment position="end">
                      <Fade in={true}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Dirección */}
      <motion.div variants={itemVariants}>
        <Controller
          name="address"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('address', field.value || '', !!errors.address);
            return (
              <TextField
                {...field}
                fullWidth
                label="Dirección completa"
                multiline
                rows={2}
                error={!!errors.address}
                helperText={errors.address?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ej: Av. 6 de Diciembre N24-253 y Wilson"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <HomeIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
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
              />
            );
          }}
        />
      </motion.div>

      {/* Logo Upload */}
      <motion.div variants={itemVariants}>
        <Box>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
            Logo del club (opcional)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={logoPreview}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: 'primary.light',
                color: 'primary.main',
              }}
            >
              <BusinessIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                height: 48,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Subir logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
              />
            </Button>
          </Box>
        </Box>
      </motion.div>
    </>
  );

  // Componente para campos de Miembro
  const renderMemberFields = () => (
    <>
      {/* Nombre completo */}
      <motion.div variants={itemVariants}>
        <Controller
          name="full_name"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('full_name', field.value || '', !!errors.full_name);
            return (
              <TextField
                {...field}
                fullWidth
                label="Nombre completo"
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('full_name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ej: Juan Carlos Pérez González"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: field.value && !errors.full_name && (
                    <InputAdornment position="end">
                      <Fade in={true}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Foto de perfil */}
      <motion.div variants={itemVariants}>
        <Box>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
            Foto de perfil (opcional pero recomendable)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={photoPreview}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: 'primary.light',
                color: 'primary.main',
              }}
            >
              <PersonIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                height: 48,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Subir foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
              />
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Club de pertenencia */}
      <motion.div variants={itemVariants}>
        <Controller
          name="club_id"
          control={control}
          render={({ field }) => (
            <FormControl 
              fullWidth 
              error={!!errors.club_id}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                },
              }}
            >
              <InputLabel>Club de pertenencia</InputLabel>
              <Select
                {...field}
                label="Club de pertenencia"
                disabled={isLoading}
              >
                {clubs.map((club) => (
                  <MenuItem key={club.id} value={club.id}>
                    {club.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.club_id && (
                <FormHelperText>{errors.club_id.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </motion.div>

      {/* Ranking inicial */}
      <motion.div variants={itemVariants}>
        <Controller
          name="ranking"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Ranking inicial (opcional)"
              placeholder="Ej: 1500 puntos o 'Sin ranking'"
              disabled={isLoading}
              onFocus={() => setFocusedField('ranking')}
              onBlur={() => setFocusedField(null)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmojiEventsIcon sx={{ color: field.value ? 'primary.main' : 'text.secondary', fontSize: 20 }} />
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
                    boxShadow: '0 0 0 4px rgba(47, 109, 251, 0.08)',
                  },
                },
              }}
            />
          )}
        />
      </motion.div>

      {/* Fecha de nacimiento */}
      <motion.div variants={itemVariants}>
        <Controller
          name="birth_date"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('birth_date', field.value || '', !!errors.birth_date);
            return (
              <TextField
                {...field}
                fullWidth
                label="Fecha de nacimiento"
                type="date"
                error={!!errors.birth_date}
                helperText={errors.birth_date?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('birth_date')}
                onBlur={() => setFocusedField(null)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Sexo */}
      <motion.div variants={itemVariants}>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.gender}>
              <FormLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
                Sexo
              </FormLabel>
              <RadioGroup
                {...field}
                row
                sx={{ gap: 2 }}
              >
                <FormControlLabel 
                  value="masculino" 
                  control={<Radio />} 
                  label="Masculino"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                    },
                  }}
                />
                <FormControlLabel 
                  value="femenino" 
                  control={<Radio />} 
                  label="Femenino"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                    },
                  }}
                />
              </RadioGroup>
              {errors.gender && (
                <FormHelperText>{errors.gender.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </motion.div>

      {/* Tipo de caucho */}
      <motion.div variants={itemVariants}>
        <Controller
          name="rubber_type"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.rubber_type}>
              <FormLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
                Tipo de caucho
              </FormLabel>
              <RadioGroup
                {...field}
                row
                sx={{ gap: 2 }}
              >
                <FormControlLabel 
                  value="liso" 
                  control={<Radio />} 
                  label="Liso"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                    },
                  }}
                />
                <FormControlLabel 
                  value="pupo" 
                  control={<Radio />} 
                  label="Pupo"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                    },
                  }}
                />
                <FormControlLabel 
                  value="ambos" 
                  control={<Radio />} 
                  label="Ambos"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                    },
                  }}
                />
              </RadioGroup>
              {errors.rubber_type && (
                <FormHelperText>{errors.rubber_type.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </motion.div>
    </>
  );

  // Campos comunes (país, email, teléfono, contraseñas)
  const renderCommonFields = () => (
    <>
      {/* País */}
      <motion.div variants={itemVariants}>
        <Controller
          name="country"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('country', field.value || '', !!errors.country);
            return (
              <TextField
                {...field}
                fullWidth
                label="País"
                error={!!errors.country}
                helperText={errors.country?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('country')}
                onBlur={() => setFocusedField(null)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PublicIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: field.value && !errors.country && (
                    <InputAdornment position="end">
                      <Fade in={true}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Email */}
      <motion.div variants={itemVariants}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('email', field.value || '', !!errors.email);
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
                      <EmailIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: field.value && !errors.email && (
                    <InputAdornment position="end">
                      <Fade in={true}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Teléfono */}
      <motion.div variants={itemVariants}>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('phone', field.value || '', !!errors.phone);
            return (
              <TextField
                {...field}
                fullWidth
                label="Teléfono de contacto"
                type="tel"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                placeholder="+593 99 123 4567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: field.value && !errors.phone && (
                    <InputAdornment position="end">
                      <Fade in={true}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Contraseña */}
      <motion.div variants={itemVariants}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('password', field.value || '', !!errors.password);
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
                      <LockIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {field.value && !errors.password && (
                          <Fade in={true}>
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>

      {/* Confirmar Contraseña */}
      <motion.div variants={itemVariants}>
        <Controller
          name="password_confirmation"
          control={control}
          render={({ field }) => {
            const fieldState = getFieldState('password_confirmation', field.value || '', !!errors.password_confirmation);
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
                      <LockIcon sx={{ color: getIconColor(fieldState), fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {field.value && !errors.password_confirmation && field.value === watchedFields.password && (
                          <Fade in={true}>
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
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
              />
            );
          }}
        />
      </motion.div>
    </>
  );

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
          {currentStep === 1 && selectedRole && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Renderizar campos específicos según el rol */}
                {selectedRole === 'liga' && renderLeagueFields()}
                {selectedRole === 'club' && renderClubFields()}
                {selectedRole === 'miembro' && renderMemberFields()}
                
                {/* Campos comunes para todos los roles */}
                {renderCommonFields()}

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
                    disabled={isLoading}
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
