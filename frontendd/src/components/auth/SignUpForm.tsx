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
  Card,
  CardContent,
  Fade,
  Grow,
  Slide,
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
  Chip,
  Divider,
  Paper,
  Grid,
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
import CakeIcon from '@mui/icons-material/Cake';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material/styles';
import { useSignUp } from '@/hooks/useSignUp';
import NextLink from 'next/link';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 24,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #2F6DFB 0%, #6AA6FF 50%, #8B5CF6 100%)',
  },
}));

const RoleCard = styled(Card)<{ selected?: boolean; roleColor?: string }>(({ theme, selected, roleColor }) => ({
  cursor: 'pointer',
  borderRadius: 20,
  border: selected ? `2px solid ${roleColor}` : '2px solid transparent',
  background: selected 
    ? `linear-gradient(135deg, ${roleColor}08 0%, ${roleColor}04 100%)`
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: selected 
      ? `0 20px 40px ${roleColor}20`
      : '0 20px 40px rgba(0, 0, 0, 0.1)',
    borderColor: selected ? roleColor : theme.palette.primary.light,
  },
  '&::before': selected ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(90deg, ${roleColor} 0%, ${roleColor}80 100%)`,
  } : {},
}));

const FormSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
}));

// Validation Schema
const signUpSchema = z.object({
  role: z.enum(['liga', 'miembro', 'club'], {
    errorMap: () => ({ message: 'Selecciona un tipo de cuenta' }),
  }),
  email: z.string().trim().min(1, 'El correo electrónico es requerido').email('Ingresa un correo electrónico válido'),
  password: z.string().trim().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  password_confirmation: z.string().trim().min(1, 'Confirma tu contraseña'),
  phone: z.string().trim().min(1, 'El teléfono es requerido'),
  country: z.string().trim().min(1, 'El país es requerido'),
  // Campos opcionales
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

const roles = [
  {
    id: 'liga',
    name: 'Liga',
    description: 'Administra múltiples clubes y competencias deportivas',
    icon: SportsTennisIcon,
    color: '#2F6DFB',
    features: ['Gestión de clubes', 'Organización de torneos', 'Estadísticas avanzadas']
  },
  {
    id: 'club',
    name: 'Club',
    description: 'Gestiona miembros y actividades deportivas del club',
    icon: BusinessIcon,
    color: '#8B5CF6',
    features: ['Gestión de miembros', 'Programación de entrenamientos', 'Reportes de rendimiento']
  },
  {
    id: 'miembro',
    name: 'Miembro',
    description: 'Participa en actividades y competencias del club',
    icon: PersonIcon,
    color: '#10B981',
    features: ['Seguimiento personal', 'Participación en torneos', 'Estadísticas individuales']
  },
];

const SignUpForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { signUp, isLoading, error, clearError } = useSignUp();

  useEffect(() => {
    setIsClient(true);
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
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

  const watchedRole = watch('role');

  const onSubmit = async (data: SignUpFormData) => {
    if (currentStep === 0) {
      if (!data.role) return;
      setCurrentStep(1);
      return;
    }

    // Validar campos específicos según el rol
    let isValid = true;
    
    if (watchedRole === 'liga') {
      if (!data.league_name?.trim()) isValid = false;
      if (!data.province?.trim()) isValid = false;
    } else if (watchedRole === 'club') {
      if (!data.club_name?.trim()) isValid = false;
      if (!data.league_id) isValid = false;
      if (!data.city?.trim()) isValid = false;
      if (!data.address?.trim()) isValid = false;
    } else if (watchedRole === 'miembro') {
      if (!data.full_name?.trim()) isValid = false;
      if (!data.club_id) isValid = false;
      if (!data.birth_date) isValid = false;
      if (!data.gender) isValid = false;
      if (!data.rubber_type) isValid = false;
    }

    if (!isValid) return;

    clearError();
    await signUp(data);
  };

  const handleRoleSelect = (roleId: string) => {
    setValue('role', roleId as 'liga' | 'miembro' | 'club');
    trigger('role');
  };

  const handleNext = async () => {
    const isRoleValid = await trigger('role');
    if (isRoleValid && watchedRole) {
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

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

  const selectedRoleData = roles.find(role => role.id === watchedRole);

  if (!isClient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Progress Indicator */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            1
          </Box>
          <Box
            sx={{
              flex: 1,
              height: 4,
              mx: 2,
              borderRadius: 2,
              backgroundColor: currentStep >= 1 ? 'primary.main' : 'divider',
              transition: 'all 0.3s ease',
            }}
          />
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: currentStep >= 1 ? 'primary.main' : 'action.disabled',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
            }}
          >
            2
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
            Tipo de cuenta
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500, 
              color: currentStep >= 1 ? 'primary.main' : 'text.secondary',
              transition: 'color 0.3s ease',
            }}
          >
            Información personal
          </Typography>
        </Box>
      </Box>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="error" 
              onClose={clearError}
              sx={{ 
                mb: 3,
                borderRadius: 3,
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

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #2F6DFB 0%, #8B5CF6 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                      }}
                    >
                      ¡Bienvenido a Raquet Power!
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '1.125rem',
                        fontWeight: 400,
                        maxWidth: 500,
                        mx: 'auto',
                        lineHeight: 1.6,
                      }}
                    >
                      Selecciona el tipo de cuenta que mejor se adapte a tus necesidades
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {roles.map((role, index) => {
                      const IconComponent = role.icon;
                      const isSelected = watchedRole === role.id;
                      
                      return (
                        <Grid item xs={12} md={4} key={role.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <RoleCard
                              selected={isSelected}
                              roleColor={role.color}
                              onClick={() => handleRoleSelect(role.id)}
                            >
                              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                <Avatar
                                  sx={{
                                    width: 64,
                                    height: 64,
                                    backgroundColor: isSelected ? role.color : 'background.default',
                                    color: isSelected ? 'white' : role.color,
                                    mx: 'auto',
                                    mb: 2,
                                    transition: 'all 0.3s ease',
                                    boxShadow: isSelected 
                                      ? `0 8px 24px ${role.color}40`
                                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                                  }}
                                >
                                  <IconComponent sx={{ fontSize: 32 }} />
                                </Avatar>

                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    color: isSelected ? role.color : 'text.primary',
                                    mb: 1,
                                    transition: 'color 0.3s ease',
                                  }}
                                >
                                  {role.name}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    mb: 2,
                                  }}
                                >
                                  {role.description}
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                                  {role.features.map((feature, idx) => (
                                    <Chip
                                      key={idx}
                                      label={feature}
                                      size="small"
                                      sx={{
                                        fontSize: '0.75rem',
                                        backgroundColor: isSelected 
                                          ? `${role.color}20`
                                          : 'action.hover',
                                        color: isSelected ? role.color : 'text.secondary',
                                        border: 'none',
                                      }}
                                    />
                                  ))}
                                </Box>

                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                  >
                                    <CheckCircleIcon
                                      sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        color: role.color,
                                        fontSize: 24,
                                      }}
                                    />
                                  </motion.div>
                                )}
                              </CardContent>
                            </RoleCard>
                          </motion.div>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {errors.role && (
                    <Typography 
                      variant="body2" 
                      color="error" 
                      sx={{ mt: 2, textAlign: 'center', fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      {errors.role.message}
                    </Typography>
                  )}

                  <Box sx={{ mt: 4 }}>
                    <Button
                      onClick={handleNext}
                      disabled={!watchedRole || isLoading}
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        height: 56,
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: 'none',
                        background: selectedRoleData 
                          ? `linear-gradient(135deg, ${selectedRoleData.color} 0%, ${selectedRoleData.color}CC 100%)`
                          : 'linear-gradient(135deg, #2F6DFB 0%, #6AA6FF 100%)',
                        boxShadow: selectedRoleData
                          ? `0 8px 24px ${selectedRoleData.color}40`
                          : '0 8px 24px rgba(47, 109, 251, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: selectedRoleData
                            ? `0 12px 32px ${selectedRoleData.color}50`
                            : '0 12px 32px rgba(47, 109, 251, 0.4)',
                        },
                        '&:disabled': {
                          background: 'action.disabledBackground',
                          color: 'action.disabled',
                          boxShadow: 'none',
                          transform: 'none',
                        },
                      }}
                    >
                      Continuar como {selectedRoleData?.name || 'Usuario'}
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </motion.div>
          )}

          {/* Step 2: Form Fields */}
          {currentStep === 1 && watchedRole && selectedRoleData && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Header Card */}
              <StyledCard sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: selectedRoleData.color,
                        color: 'white',
                      }}
                    >
                      <selectedRoleData.icon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Cuenta de {selectedRoleData.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {selectedRoleData.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>

              {/* Role-specific Fields */}
              {watchedRole === 'liga' && (
                <FormSection>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SportsTennisIcon sx={{ color: selectedRoleData.color }} />
                    Información de la Liga
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="league_name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Nombre de la liga"
                            placeholder="Ej: Liga Nacional de Tenis de Mesa"
                            error={!!errors.league_name}
                            helperText={errors.league_name?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BusinessIcon sx={{ color: selectedRoleData.color }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="province"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Provincia / Región"
                            placeholder="Ej: Pichincha, Guayas, Azuay"
                            error={!!errors.province}
                            helperText={errors.province?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOnIcon sx={{ color: selectedRoleData.color }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: '2px dashed',
                          borderColor: 'divider',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: selectedRoleData.color,
                            backgroundColor: `${selectedRoleData.color}08`,
                          },
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          {logoPreview ? (
                            <Avatar src={logoPreview} sx={{ width: 64, height: 64 }} />
                          ) : (
                            <Avatar sx={{ width: 64, height: 64, backgroundColor: `${selectedRoleData.color}20`, color: selectedRoleData.color }}>
                              <CloudUploadIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                              Logo de la liga (opcional)
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Haz clic para subir una imagen
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </FormSection>
              )}

              {watchedRole === 'club' && (
                <FormSection>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ color: selectedRoleData.color }} />
                    Información del Club
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="club_name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Nombre del club"
                            placeholder="Ej: Club Deportivo Los Campeones"
                            error={!!errors.club_name}
                            helperText={errors.club_name?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BusinessIcon sx={{ color: selectedRoleData.color }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="league_id"
                        control={control}
                        render={({ field }) => (
                          <FormControl 
                            fullWidth 
                            error={!!errors.league_id}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          >
                            <InputLabel>Liga a la que pertenece</InputLabel>
                            <Select
                              {...field}
                              label="Liga a la que pertenece"
                              startAdornment={
                                <InputAdornment position="start">
                                  <SportsTennisIcon sx={{ color: selectedRoleData.color, ml: 1 }} />
                                </InputAdornment>
                              }
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Provincia / Ciudad"
                            placeholder="Ej: Quito, Guayaquil, Cuenca"
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOnIcon sx={{ color: selectedRoleData.color }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Dirección completa"
                            placeholder="Ej: Av. 6 de Diciembre N24-253 y Wilson"
                            error={!!errors.address}
                            helperText={errors.address?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <HomeIcon sx={{ color: selectedRoleData.color }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: '2px dashed',
                          borderColor: 'divider',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: selectedRoleData.color,
                            backgroundColor: `${selectedRoleData.color}08`,
                          },
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          {logoPreview ? (
                            <Avatar src={logoPreview} sx={{ width: 64, height: 64 }} />
                          ) : (
                            <Avatar sx={{ width: 64, height: 64, backgroundColor: `${selectedRoleData.color}20`, color: selectedRoleData.color }}>
                              <CloudUploadIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                              Logo del club (opcional)
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Haz clic para subir una imagen
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </FormSection>
              )}

              {watchedRole === 'miembro' && (
                <FormSection>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: selectedRoleData.color }} />
                    Información Personal
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="full_name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Nombre completo"
                            placeholder="Ej: Juan Carlos Pérez González"
                            error={!!errors.full_name}
                            helperText={errors.full_name?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon sx={{ color: selectedRoleData.color }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="club_id"
                        control={control}
                        render={({ field }) => (
                          <FormControl 
                            fullWidth 
                            error={!!errors.club_id}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          >
                            <InputLabel>Club de pertenencia</InputLabel>
                            <Select
                              {...field}
                              label="Club de pertenencia"
                              startAdornment={
                                <InputAdornment position="start">
                                  <BusinessIcon sx={{ color: selectedRoleData.color, ml: 1 }} />
                                </InputAdornment>
                              }
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="birth_date"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Fecha de nacimiento"
                            type="date"
                            error={!!errors.birth_date}
                            helperText={errors.birth_date?.message}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CakeIcon sx={{ color: selectedRoleData.color }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="ranking"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Ranking inicial (opcional)"
                            placeholder='Ej: 1500 puntos o "Sin ranking"'
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmojiEventsIcon sx={{ color: selectedRoleData.color }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: selectedRoleData.color,
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: selectedRoleData.color,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <FormControl error={!!errors.gender} fullWidth>
                            <FormLabel sx={{ mb: 1, fontWeight: 500, color: selectedRoleData.color }}>
                              Sexo
                            </FormLabel>
                            <RadioGroup {...field} row sx={{ gap: 2 }}>
                              <FormControlLabel 
                                value="masculino" 
                                control={<Radio sx={{ '&.Mui-checked': { color: selectedRoleData.color } }} />} 
                                label="Masculino"
                              />
                              <FormControlLabel 
                                value="femenino" 
                                control={<Radio sx={{ '&.Mui-checked': { color: selectedRoleData.color } }} />} 
                                label="Femenino"
                              />
                            </RadioGroup>
                            {errors.gender && (
                              <FormHelperText>{errors.gender.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="rubber_type"
                        control={control}
                        render={({ field }) => (
                          <FormControl error={!!errors.rubber_type} fullWidth>
                            <FormLabel sx={{ mb: 1, fontWeight: 500, color: selectedRoleData.color }}>
                              Tipo de caucho
                            </FormLabel>
                            <RadioGroup {...field} row sx={{ gap: 2 }}>
                              <FormControlLabel 
                                value="liso" 
                                control={<Radio sx={{ '&.Mui-checked': { color: selectedRoleData.color } }} />} 
                                label="Liso"
                              />
                              <FormControlLabel 
                                value="pupo" 
                                control={<Radio sx={{ '&.Mui-checked': { color: selectedRoleData.color } }} />} 
                                label="Pupo"
                              />
                              <FormControlLabel 
                                value="ambos" 
                                control={<Radio sx={{ '&.Mui-checked': { color: selectedRoleData.color } }} />} 
                                label="Ambos"
                              />
                            </RadioGroup>
                            {errors.rubber_type && (
                              <FormHelperText>{errors.rubber_type.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: '2px dashed',
                          borderColor: 'divider',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: selectedRoleData.color,
                            backgroundColor: `${selectedRoleData.color}08`,
                          },
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'photo')}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          {photoPreview ? (
                            <Avatar src={photoPreview} sx={{ width: 64, height: 64 }} />
                          ) : (
                            <Avatar sx={{ width: 64, height: 64, backgroundColor: `${selectedRoleData.color}20`, color: selectedRoleData.color }}>
                              <PersonIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                              Foto de perfil (opcional)
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Haz clic para subir una imagen
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </FormSection>
              )}

              {/* Common Fields */}
              <FormSection>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: selectedRoleData.color }} />
                  Información de Contacto
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="País"
                          error={!!errors.country}
                          helperText={errors.country?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PublicIcon sx={{ color: selectedRoleData.color }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&.Mui-focused fieldset': {
                                borderColor: selectedRoleData.color,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: selectedRoleData.color,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Teléfono de contacto"
                          placeholder="+593 99 123 4567"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon sx={{ color: selectedRoleData.color }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&.Mui-focused fieldset': {
                                borderColor: selectedRoleData.color,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: selectedRoleData.color,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Correo electrónico"
                          type="email"
                          placeholder="tu@email.com"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon sx={{ color: selectedRoleData.color }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&.Mui-focused fieldset': {
                                borderColor: selectedRoleData.color,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: selectedRoleData.color,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormSection>

              {/* Password Fields */}
              <FormSection>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon sx={{ color: selectedRoleData.color }} />
                  Seguridad
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Contraseña"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 8 caracteres"
                          error={!!errors.password}
                          helperText={errors.password?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: selectedRoleData.color }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&.Mui-focused fieldset': {
                                borderColor: selectedRoleData.color,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: selectedRoleData.color,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="password_confirmation"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Confirmar contraseña"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repite tu contraseña"
                          error={!!errors.password_confirmation}
                          helperText={errors.password_confirmation?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: selectedRoleData.color }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&.Mui-focused fieldset': {
                                borderColor: selectedRoleData.color,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: selectedRoleData.color,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormSection>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  disabled={isLoading}
                  sx={{
                    height: 56,
                    px: 4,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    minWidth: 140,
                    borderColor: selectedRoleData.color,
                    color: selectedRoleData.color,
                    '&:hover': {
                      borderColor: selectedRoleData.color,
                      backgroundColor: `${selectedRoleData.color}08`,
                    },
                    '&:disabled': {
                      borderColor: 'action.disabled',
                      color: 'action.disabled',
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
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${selectedRoleData.color} 0%, ${selectedRoleData.color}CC 100%)`,
                    boxShadow: `0 8px 24px ${selectedRoleData.color}40`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 32px ${selectedRoleData.color}50`,
                    },
                    '&:disabled': {
                      background: 'action.disabledBackground',
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
                    <>
                      <StarIcon sx={{ mr: 1 }} />
                      Crear mi cuenta de {selectedRoleData.name}
                    </>
                  )}
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign In Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Divider sx={{ mb: 3 }}>
            <Chip label="¿Ya tienes cuenta?" sx={{ backgroundColor: 'background.paper', fontWeight: 500 }} />
          </Divider>
          <Link
            component={NextLink}
            href="/auth/sign-in"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              textDecoration: 'none',
              color: selectedRoleData?.color || 'primary.main',
              backgroundColor: selectedRoleData ? `${selectedRoleData.color}08` : 'primary.light',
              fontWeight: 600,
              fontSize: '0.9375rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: selectedRoleData ? `${selectedRoleData.color}15` : 'primary.light',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Iniciar sesión
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpForm;
