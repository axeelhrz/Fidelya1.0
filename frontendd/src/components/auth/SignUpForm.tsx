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
import { motion, AnimatePresence, type Variants } from 'framer-motion';
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
import CakeIcon from '@mui/icons-material/Cake';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { styled } from '@mui/material/styles';
import { useSignUp } from '@/hooks/useSignUp';
import RoleSelector from './RoleSelector';
import NextLink from 'next/link';
import type { SvgIconProps } from '@mui/material/SvgIcon';

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

// Esquema completo para todo el formulario
const signUpSchema = z.object({
  role: z.enum(['liga', 'miembro', 'club'], {
    error: 'Selecciona un tipo de cuenta',
  }),
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

type SignUpFormData = z.infer<typeof signUpSchema>;

interface League {
  id: string;
  name: string;
}

interface Club {
  id: string;
  name: string;
  league: string;
}

const SignUpForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [mounted, setMounted] = useState(false);
  const { signUp, isLoading, error, clearError } = useSignUp();

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
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
    if (mounted) {
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
    }
  }, [mounted]);

  const onSubmit = async (data: SignUpFormData) => {
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
      console.error('Validation errors:', validationErrors);
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

  // Función helper para obtener errores de campos específicos
  const getFieldError = (fieldName: keyof SignUpFormData) => {
    return errors[fieldName];
  };

  // Función helper para obtener valores de campos específicos
  const getFieldValue = (fieldName: keyof SignUpFormData) => {
    return watchedFields[fieldName];
  };

  // Si no está montado, mostrar un loading simple
  if (!mounted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Variantes de animación simplificadas
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
  };
  // Función para crear campos de texto con el estilo de SignIn
    const createTextField = (
      name: keyof SignUpFormData,
      label: string,
      icon: React.ReactElement<SvgIconProps>,
      options: {
        type?: string;
        placeholder?: string;
        multiline?: boolean;
        rows?: number;
        required?: boolean;
      } = {}
    ) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const fieldError = getFieldError(name);
        const fieldState = getFieldState(name, field.value || '', !!fieldError);
        
        return (
          <Box sx={{ position: 'relative', mb: 3 }}>
            <TextField
              {...field}
              fullWidth
              label={label}
              type={options.type || 'text'}
              error={!!fieldError}
              helperText={fieldError?.message}
              disabled={isLoading}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              placeholder={options.placeholder}
              multiline={options.multiline}
              rows={options.rows}
              InputProps={{
                startAdornment: (
                  <InputAdornment position={options.multiline ? 'start' : 'start'} 
                    sx={options.multiline ? { alignSelf: 'flex-start', mt: 1 } : {}}>
                    {React.isValidElement(icon) && React.cloneElement(icon, {
                      sx: { 
                        color: getIconColor(fieldState),
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 20,
                      }
                    })}
                  </InputAdornment>
                ),
                endAdornment: field.value && !fieldError && !options.multiline && (
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
                  minHeight: options.multiline ? 'auto' : 56,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& fieldset': {
                    borderColor: fieldState === 'error' ? 'error.main' : 
                                fieldState === 'success' ? 'success.light' :
                                fieldState === 'focused' ? 'primary.main' : 'divider',
                    borderWidth: fieldState === 'focused' ? 2 : 1,
                  },
                  '&:hover fieldset': {
                    borderColor: fieldState === 'error' ? 'error.main' : 
                                fieldState === 'success' ? 'success.main' :
                                'primary.light',
                  },
                  '&.Mui-focused': {
                    transform: 'scale(1.005)',
                    boxShadow: fieldState === 'error' ? 
                      '0 0 0 4px rgba(244, 67, 54, 0.08)' :
                      '0 0 0 4px rgba(47, 109, 251, 0.08)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: fieldState === 'error' ? 'error.main' : 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  '&.Mui-focused': {
                    color: fieldState === 'error' ? 'error.main' : 'primary.main',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  '&::placeholder': {
                    color: 'text.disabled',
                    opacity: 0.7,
                  },
                },
                '& .MuiFormHelperText-root': {
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  marginLeft: 0,
                  marginTop: 1,
                },
              }}
            />
          </Box>
        );
      }}
    />
  );

  // Componente para campos de Liga
  const renderLeagueFields = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Nombre de la Liga */}
      {createTextField('league_name', 'Nombre de la liga', <BusinessIcon />, {
        placeholder: 'Ej: Liga Nacional de Tenis de Mesa',
        required: true
      })}

      {/* Provincia */}
      {createTextField('province', 'Provincia / Región', <LocationOnIcon />, {
        placeholder: 'Ej: Pichincha, Guayas, Azuay',
        required: true
      })}

      {/* Logo Upload */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
          Logo de la liga (opcional)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={logoPreview || undefined}
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
    </Box>
  );

  // Componente para campos de Club
  const renderClubFields = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Nombre del Club */}
      {createTextField('club_name', 'Nombre del club', <BusinessIcon />, {
        placeholder: 'Ej: Club Deportivo Los Campeones',
        required: true
      })}

      {/* Liga a la que pertenece */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="league_id"
          control={control}
          render={({ field }) => {
            const fieldError = getFieldError('league_id');
            return (
              <FormControl 
                fullWidth 
                error={!!fieldError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '& fieldset': {
                      borderColor: fieldError ? 'error.main' : 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: fieldError ? 'error.main' : 'primary.light',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: fieldError ? 'error.main' : 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: fieldError ? 'error.main' : 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    '&.Mui-focused': {
                      color: fieldError ? 'error.main' : 'primary.main',
                    },
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
                {fieldError && (
                  <FormHelperText sx={{ fontSize: '0.8125rem', fontWeight: 500, ml: 0, mt: 1 }}>
                    {fieldError.message}
                  </FormHelperText>
                )}
              </FormControl>
            );
          }}
        />
      </Box>

      {/* Ciudad */}
      {createTextField('city', 'Provincia / Ciudad', <LocationOnIcon />, {
        placeholder: 'Ej: Quito, Guayaquil, Cuenca',
        required: true
      })}

      {/* Dirección */}
      {createTextField('address', 'Dirección completa', <HomeIcon />, {
        placeholder: 'Ej: Av. 6 de Diciembre N24-253 y Wilson',
        multiline: true,
        rows: 2,
        required: true
      })}

      {/* Logo Upload */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
          Logo del club (opcional)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={logoPreview || undefined}
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
    </Box>
  );

  // Componente para campos de Miembro
  const renderMemberFields = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Nombre completo */}
      {createTextField('full_name', 'Nombre completo', <PersonIcon />, {
        placeholder: 'Ej: Juan Carlos Pérez González',
        required: true
      })}

      {/* Foto de perfil */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
          Foto de perfil (opcional pero recomendable)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={photoPreview || undefined}
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

      {/* Club de pertenencia */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="club_id"
          control={control}
          render={({ field }) => {
            const fieldError = getFieldError('club_id');
            return (
              <FormControl 
                fullWidth 
                error={!!fieldError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '& fieldset': {
                      borderColor: fieldError ? 'error.main' : 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: fieldError ? 'error.main' : 'primary.light',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: fieldError ? 'error.main' : 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: fieldError ? 'error.main' : 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    '&.Mui-focused': {
                      color: fieldError ? 'error.main' : 'primary.main',
                    },
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
                {fieldError && (
                  <FormHelperText sx={{ fontSize: '0.8125rem', fontWeight: 500, ml: 0, mt: 1 }}>
                    {fieldError.message}
                  </FormHelperText>
                )}
              </FormControl>
            );
          }}
        />
      </Box>

      {/* Ranking inicial */}
      {createTextField('ranking', 'Ranking inicial (opcional)', <EmojiEventsIcon />, {
        placeholder: 'Ej: 1500 puntos o "Sin ranking"'
      })}

      {/* Fecha de nacimiento */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="birth_date"
          control={control}
          render={({ field }) => {
            const fieldError = getFieldError('birth_date');
            const fieldState = getFieldState('birth_date', field.value || '', !!fieldError);
            return (
              <TextField
                {...field}
                fullWidth
                label="Fecha de nacimiento"
                type="date"
                error={!!fieldError}
                helperText={fieldError?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('birth_date')}
                onBlur={() => setFocusedField(null)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon sx={{ 
                        color: getIconColor(fieldState),
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 20,
                      }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& fieldset': {
                      borderColor: fieldState === 'error' ? 'error.main' : 
                                  fieldState === 'success' ? 'success.light' :
                                  fieldState === 'focused' ? 'primary.main' : 'divider',
                      borderWidth: fieldState === 'focused' ? 2 : 1,
                    },
                    '&:hover fieldset': {
                      borderColor: fieldState === 'error' ? 'error.main' : 
                                  fieldState === 'success' ? 'success.main' :
                                  'primary.light',
                    },
                    '&.Mui-focused': {
                      transform: 'scale(1.005)',
                      boxShadow: fieldState === 'error' ? 
                        '0 0 0 4px rgba(244, 67, 54, 0.08)' :
                        '0 0 0 4px rgba(47, 109, 251, 0.08)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: fieldState === 'error' ? 'error.main' : 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    '&.Mui-focused': {
                      color: fieldState === 'error' ? 'error.main' : 'primary.main',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    marginLeft: 0,
                    marginTop: 1,
                  },
                }}
              />
            );
          }}
        />
      </Box>

      {/* Sexo */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => {
            const fieldError = getFieldError('gender');
            return (
              <FormControl error={!!fieldError}>
                <FormLabel sx={{ 
                  mb: 1, 
                  fontWeight: 500, 
                  color: fieldError ? 'error.main' : 'text.primary',
                  fontSize: '0.9375rem'
                }}>
                  Sexo
                </FormLabel>
                <RadioGroup
                  {...field}
                  row
                  sx={{ gap: 2 }}
                >
                  <FormControlLabel 
                    value="masculino" 
                    control={<Radio sx={{ '&.Mui-checked': { color: 'primary.main' } }} />} 
                    label="Masculino"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                      },
                    }}
                  />
                  <FormControlLabel 
                    value="femenino" 
                    control={<Radio sx={{ '&.Mui-checked': { color: 'primary.main' } }} />} 
                    label="Femenino"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                      },
                    }}
                  />
                </RadioGroup>
                {fieldError && (
                  <FormHelperText sx={{ fontSize: '0.8125rem', fontWeight: 500, ml: 0, mt: 1 }}>
                    {fieldError.message}
                  </FormHelperText>
                )}
              </FormControl>
            );
          }}
        />
      </Box>

      {/* Tipo de caucho */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="rubber_type"
          control={control}
          render={({ field }) => {
            const fieldError = getFieldError('rubber_type');
            return (
              <FormControl error={!!fieldError}>
                <FormLabel sx={{ 
                  mb: 1, 
                  fontWeight: 500, 
                  color: fieldError ? 'error.main' : 'text.primary',
                  fontSize: '0.9375rem'
                }}>
                  Tipo de caucho
                </FormLabel>
                <RadioGroup
                  {...field}
                  row
                  sx={{ gap: 2 }}
                >
                  <FormControlLabel 
                    value="liso" 
                    control={<Radio sx={{ '&.Mui-checked': { color: 'primary.main' } }} />} 
                    label="Liso"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                      },
                    }}
                  />
                  <FormControlLabel 
                    value="pupo" 
                    control={<Radio sx={{ '&.Mui-checked': { color: 'primary.main' } }} />} 
                    label="Pupo"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                      },
                    }}
                  />
                  <FormControlLabel 
                    value="ambos" 
                    control={<Radio sx={{ '&.Mui-checked': { color: 'primary.main' } }} />} 
                    label="Ambos"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                      },
                    }}
                  />
                </RadioGroup>
                {fieldError && (
                  <FormHelperText sx={{ fontSize: '0.8125rem', fontWeight: 500, ml: 0, mt: 1 }}>
                    {fieldError.message}
                  </FormHelperText>
                )}
              </FormControl>
            );
          }}
        />
      </Box>
    </Box>
  );

  // Campos comunes (país, email, teléfono, contraseñas)
  const renderCommonFields = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* País */}
      {createTextField('country', 'País', <PublicIcon />, {
        required: true
      })}

      {/* Email */}
      {createTextField('email', 'Correo electrónico', <EmailIcon />, {
        type: 'email',
        placeholder: 'tu@email.com',
        required: true
      })}

      {/* Teléfono */}
      {createTextField('phone', 'Teléfono de contacto', <PhoneIcon />, {
        type: 'tel',
        placeholder: '+593 99 123 4567',
        required: true
      })}

      {/* Contraseña */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => {
            const fieldError = getFieldError('password');
            const fieldState = getFieldState('password', field.value || '', !!fieldError);
            return (
              <TextField
                {...field}
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                error={!!fieldError}
                helperText={fieldError?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Mínimo 8 caracteres"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ 
                        color: getIconColor(fieldState),
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 20,
                      }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {field.value && !fieldError && (
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
                    '& fieldset': {
                      borderColor: fieldState === 'error' ? 'error.main' : 
                                  fieldState === 'success' ? 'success.light' :
                                  fieldState === 'focused' ? 'primary.main' : 'divider',
                      borderWidth: fieldState === 'focused' ? 2 : 1,
                    },
                    '&:hover fieldset': {
                      borderColor: fieldState === 'error' ? 'error.main' : 
                                  fieldState === 'success' ? 'success.main' :
                                  'primary.light',
                    },
                    '&.Mui-focused': {
                      transform: 'scale(1.005)',
                      boxShadow: fieldState === 'error' ? 
                        '0 0 0 4px rgba(244, 67, 54, 0.08)' :
                        '0 0 0 4px rgba(47, 109, 251, 0.08)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: fieldState === 'error' ? 'error.main' : 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    '&.Mui-focused': {
                      color: fieldState === 'error' ? 'error.main' : 'primary.main',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    '&::placeholder': {
                      color: 'text.disabled',
                      opacity: 0.7,
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    marginLeft: 0,
                    marginTop: 1,
                  },
                }}
              />
            );
          }}
        />
      </Box>

      {/* Confirmar Contraseña */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="password_confirmation"
          control={control}
          render={({ field }) => {
            const fieldError = getFieldError('password_confirmation');
            const fieldState = getFieldState('password_confirmation', field.value || '', !!fieldError);
            const passwordValue = getFieldValue('password');
            return (
              <TextField
                {...field}
                fullWidth
                label="Confirmar contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                error={!!fieldError}
                helperText={fieldError?.message}
                disabled={isLoading}
                onFocus={() => setFocusedField('password_confirmation')}
                onBlur={() => setFocusedField(null)}
                placeholder="Repite tu contraseña"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ 
                        color: getIconColor(fieldState),
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 20,
                      }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {field.value && !fieldError && field.value === passwordValue && (
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
                    '& fieldset': {
                      borderColor: fieldState === 'error' ? 'error.main' : 
                                  fieldState === 'success' ? 'success.light' :
                                  fieldState === 'focused' ? 'primary.main' : 'divider',
                      borderWidth: fieldState === 'focused' ? 2 : 1,
                    },
                    '&:hover fieldset': {
                      borderColor: fieldState === 'error' ? 'error.main' : 
                                  fieldState === 'success' ? 'success.main' :
                                  'primary.light',
                    },
                    '&.Mui-focused': {
                      transform: 'scale(1.005)',
                      boxShadow: fieldState === 'error' ? 
                        '0 0 0 4px rgba(244, 67, 54, 0.08)' :
                        '0 0 0 4px rgba(47, 109, 251, 0.08)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: fieldState === 'error' ? 'error.main' : 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    '&.Mui-focused': {
                      color: fieldState === 'error' ? 'error.main' : 'primary.main',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    '&::placeholder': {
                      color: 'text.disabled',
                      opacity: 0.7,
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    marginLeft: 0,
                    marginTop: 1,
                  },
                }}
              />
            );
          }}
        />
      </Box>
    </Box>
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
        {currentStep === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div variants={itemVariants}>
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
                    boxShadow: '0 4px 12px rgba(47, 109, 251, 0.15)',
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(47, 109, 251, 0.25)',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&:disabled': {
                      backgroundColor: 'action.disabledBackground',
                      color: 'action.disabled',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                  }}
                >
                  Continuar
                </Button>
              </Box>
            </motion.div>
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
            <motion.div variants={itemVariants}>
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
                    borderColor: 'divider',
                    color: 'text.secondary',
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.light',
                      backgroundColor: 'action.hover',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    },
                  }}
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
                    boxShadow: '0 4px 12px rgba(47, 109, 251, 0.15)',
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(47, 109, 251, 0.25)',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&:disabled': {
                      backgroundColor: 'action.disabledBackground',
                      color: 'action.disabled',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                  }}
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
            </motion.div>
          </motion.div>
        )}

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

