'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  alpha,
  Paper,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Store,
  Person,
  Email,
  Phone,
  LocationOn,
  Schedule,
  Language,
  Description,
  Save,
  Refresh,
  Visibility,
  VisibilityOff,
  Business,
  Category,
  CheckCircle,
  ErrorOutline,
  Facebook,
  Instagram,
  Twitter,
  Public,
  ContactMail,
  Receipt,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useComercios } from '@/hooks/useComercios';
import { ComercioProfileFormData, comercioProfileSchema } from '@/lib/validations/comercio';
import { CATEGORIAS_COMERCIO } from '@/types/comercio';

export const ProfileForm: React.FC = () => {
  const { comercio, loading, updateProfile } = useComercios();
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    trigger,
    clearErrors,
  } = useForm<ComercioProfileFormData>({
    resolver: zodResolver(comercioProfileSchema),
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      nombreComercio: '',
      email: '',
      categoria: '',
      direccion: '',
      telefono: '',
      horario: '',
      descripcion: '',
      sitioWeb: '',
      razonSocial: '',
      cuit: '',
      ubicacion: '',
      emailContacto: '',
      visible: true,
      redesSociales: {
        facebook: '',
        instagram: '',
        twitter: '',
      }
    }
  });

  // Watch for changes
  useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty]);

  // Load comercio data
  useEffect(() => {
    if (comercio) {
      const formData = {
        nombre: comercio.nombre || '',
        nombreComercio: comercio.nombreComercio || '',
        email: comercio.email || '',
        categoria: comercio.categoria || '',
        direccion: comercio.direccion || '',
        telefono: comercio.telefono || '',
        horario: comercio.horario || '',
        descripcion: comercio.descripcion || '',
        sitioWeb: comercio.sitioWeb || '',
        razonSocial: comercio.razonSocial || comercio.nombreComercio || '',
        cuit: comercio.cuit || '',
        ubicacion: comercio.ubicacion || comercio.direccion || '',
        emailContacto: comercio.emailContacto || comercio.email || '',
        visible: comercio.visible ?? true,
        redesSociales: {
          facebook: comercio.redesSociales?.facebook || '',
          instagram: comercio.redesSociales?.instagram || '',
          twitter: comercio.redesSociales?.twitter || '',
        }
      };
      reset(formData);
    }
  }, [comercio, reset]);

  const onSubmit = async (data: ComercioProfileFormData) => {
    try {
      const success = await updateProfile(data);
      
      if (success) {
        setIsEditing(false);
        setHasChanges(false);
        setSaveSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleReset = () => {
    if (comercio) {
      const formData = {
        nombre: comercio.nombre || '',
        nombreComercio: comercio.nombreComercio || '',
        email: comercio.email || '',
        categoria: comercio.categoria || '',
        direccion: comercio.direccion || '',
        telefono: comercio.telefono || '',
        horario: comercio.horario || '',
        descripcion: comercio.descripcion || '',
        sitioWeb: comercio.sitioWeb || '',
        razonSocial: comercio.razonSocial || comercio.nombreComercio || '',
        cuit: comercio.cuit || '',
        ubicacion: comercio.ubicacion || comercio.direccion || '',
        emailContacto: comercio.emailContacto || comercio.email || '',
        visible: comercio.visible ?? true,
        redesSociales: {
          facebook: comercio.redesSociales?.facebook || '',
          instagram: comercio.redesSociales?.instagram || '',
          twitter: comercio.redesSociales?.twitter || '',
        }
      };
      reset(formData);
    }
    setIsEditing(false);
    setHasChanges(false);
    clearErrors();
  };

  const handleEditToggle = () => {
    if (isEditing && hasChanges) {
      // Show confirmation dialog or save changes
      const shouldSave = window.confirm('¿Deseas guardar los cambios antes de salir del modo edición?');
      if (shouldSave) {
        handleSubmit(onSubmit)();
        return;
      }
    }
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Trigger validation when entering edit mode
      trigger();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Store sx={{ fontSize: 40, color: '#06b6d4' }} />
        </motion.div>
      </Box>
    );
  }

  const FormField: React.FC<{
    name: keyof ComercioProfileFormData;
    label: string;
    icon: React.ReactNode;
    color: string;
    type?: string;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    helperText?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    fullWidth?: boolean;
  }> = ({ 
    name, 
    label, 
    icon, 
    color, 
    type = 'text', 
    multiline = false, 
    rows = 1,
    placeholder,
    helperText,
    startAdornment,
    endAdornment,
    fullWidth = true
  }) => {
    const fieldError = errors[name];
    const hasError = !!fieldError;
    
    return (
      <TextField
        {...register(name)}
        label={label}
        type={type}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        disabled={!isEditing}
        placeholder={placeholder}
        error={hasError}
        helperText={hasError ? fieldError?.message : helperText}
        InputProps={{
          startAdornment: startAdornment || (
            <InputAdornment position="start">
              {React.cloneElement(icon as React.ReactElement, { 
                sx: { color: hasError ? '#ef4444' : '#94a3b8', mr: 1 } 
              })}
            </InputAdornment>
          ),
          endAdornment,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&.Mui-focused fieldset': {
              borderColor: hasError ? '#ef4444' : color,
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: hasError ? '#ef4444' : alpha(color, 0.7),
            }
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            marginTop: 1,
          }
        }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Success Alert */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert
                severity="success"
                icon={<CheckCircle />}
                sx={{
                  borderRadius: 3,
                  bgcolor: alpha('#10b981', 0.1),
                  border: '1px solid',
                  borderColor: alpha('#10b981', 0.3),
                  '& .MuiAlert-icon': {
                    color: '#10b981',
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#047857' }}>
                  ¡Perfil actualizado correctamente! Los cambios ya están visibles para los socios.
                </Typography>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <Card
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Animated background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 200,
              height: 200,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '50%',
              opacity: 0.05,
              transform: 'translate(50%, -50%)',
            }}
          />

          <CardContent sx={{ p: 6, position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 900, 
                    color: '#0f172a',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Store sx={{ fontSize: 32, color: '#6366f1' }} />
                  Información General
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Mantén actualizada la información de tu comercio para que los socios puedan encontrarte fácilmente.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                {/* Form Status Indicators */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Stack direction="row" spacing={1}>
                        {hasChanges && (
                          <Chip
                            label="Cambios sin guardar"
                            color="warning"
                            size="small"
                            sx={{ fontWeight: 600 }}
                            icon={<ErrorOutline />}
                          />
                        )}
                        {isValid && hasChanges && (
                          <Chip
                            label="Listo para guardar"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 600 }}
                            icon={<CheckCircle />}
                          />
                        )}
                      </Stack>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                {isEditing ? (
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      startIcon={<Refresh />}
                      sx={{
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: alpha('#6b7280', 0.1),
                        }
                      }}
                    >
                      Restablecer
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting || !hasChanges || !isValid}
                      startIcon={isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Save /></motion.div> : <Save />}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                          boxShadow: '0 6px 25px rgba(99, 102, 241, 0.4)',
                        },
                        '&:disabled': {
                          background: '#e2e8f0',
                          color: '#94a3b8',
                          boxShadow: 'none',
                        }
                      }}
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleEditToggle}
                    startIcon={<Store />}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                        boxShadow: '0 6px 25px rgba(99, 102, 241, 0.4)',
                      }
                    }}
                  >
                    Editar Perfil
                  </Button>
                )}
              </Stack>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={6}>
                {/* Basic Information */}
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#374151', 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Business sx={{ fontSize: 20, color: '#6366f1' }} />
                    Datos Generales
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormField
                        name="nombre"
                        label="Nombre del Responsable"
                        icon={<Person />}
                        color="#6366f1"
                        placeholder="Juan Pérez"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormField
                        name="nombreComercio"
                        label="Nombre Comercial"
                        icon={<Store />}
                        color="#6366f1"
                        placeholder="Mi Comercio S.A."
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormField
                        name="razonSocial"
                        label="Razón Social"
                        icon={<Business />}
                        color="#6366f1"
                        placeholder="Mi Comercio Sociedad Anónima"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormField
                        name="cuit"
                        label="RUT / CUIT"
                        icon={<Receipt />}
                        color="#6366f1"
                        placeholder="12-34567890-1"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="categoria"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth disabled={!isEditing} error={!!errors.categoria}>
                            <InputLabel>Rubro o Categoría</InputLabel>
                            <Select
                              {...field}
                              label="Rubro o Categoría"
                              startAdornment={<Category sx={{ color: '#94a3b8', mr: 1 }} />}
                              sx={{
                                borderRadius: 3,
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#6366f1',
                                  borderWidth: 2,
                                }
                              }}
                            >
                              {CATEGORIAS_COMERCIO.map((categoria) => (
                                <MenuItem key={categoria} value={categoria}>
                                  {categoria}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.categoria && (
                              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                                {errors.categoria.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="visible"
                        control={control}
                        render={({ field }) => (
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              border: '1px solid #e2e8f0',
                              borderRadius: 3,
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Switch
                                  {...field}
                                  checked={field.value ?? true}
                                  disabled={!isEditing}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#6366f1',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#6366f1',
                                    },
                                  }}
                                />
                              }
                              label={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  {field.value ? <Visibility sx={{ color: '#10b981' }} /> : <VisibilityOff sx={{ color: '#ef4444' }} />}
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {field.value ? 'Visible para socios' : 'Oculto para socios'}
                                  </Typography>
                                </Stack>
                              }
                            />
                          </Paper>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ opacity: 0.3 }} />

                {/* Contact Information */}
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#374151', 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Phone sx={{ fontSize: 20, color: '#06b6d4' }} />
                    Información de Contacto
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormField
                        name="email"
                        label="Email Principal"
                        icon={<Email />}
                        color="#06b6d4"
                        type="email"
                        placeholder="contacto@micomercio.com"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormField
                        name="emailContacto"
                        label="Email de Contacto"
                        icon={<ContactMail />}
                        color="#06b6d4"
                        type="email"
                        placeholder="info@micomercio.com"
                        helperText="Email alternativo para contacto"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormField
                        name="telefono"
                        label="Teléfono"
                        icon={<Phone />}
                        color="#06b6d4"
                        placeholder="+598 99 123 456"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormField
                        name="horario"
                        label="Horarios de Atención"
                        icon={<Schedule />}
                        color="#06b6d4"
                        placeholder="Lunes a Viernes - 9 a 18 hs"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormField
                        name="direccion"
                        label="Dirección Física"
                        icon={<LocationOn />}
                        color="#06b6d4"
                        placeholder="Av. 18 de Julio 1234, Montevideo"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormField
                        name="ubicacion"
                        label="Ciudad y Departamento"
                        icon={<LocationOn />}
                        color="#06b6d4"
                        placeholder="Montevideo, Montevideo"
                        helperText="Ciudad y departamento donde se encuentra tu comercio"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ opacity: 0.3 }} />

                {/* Description */}
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#374151', 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Description sx={{ fontSize: 20, color: '#10b981' }} />
                    Descripción y Presentación
                  </Typography>
                  
                  <FormField
                    name="descripcion"
                    label="Descripción del Comercio"
                    icon={<Description />}
                    color="#10b981"
                    multiline
                    rows={4}
                    placeholder="Describe tu comercio, productos o servicios que ofreces a los socios de Fidelitá..."
                    helperText="Máximo 500 caracteres. Esta descripción será visible para los socios."
                  />
                </Box>

                <Divider sx={{ opacity: 0.3 }} />

                {/* Online Presence */}
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#374151', 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Language sx={{ fontSize: 20, color: '#f59e0b' }} />
                    Presencia Online
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormField
                        name="sitioWeb"
                        label="Sitio Web"
                        icon={<Public />}
                        color="#f59e0b"
                        placeholder="https://www.micomercio.com"
                        helperText="URL completa de tu sitio web"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        {...register('redesSociales.facebook')}
                        label="Facebook"
                        fullWidth
                        disabled={!isEditing}
                        placeholder="@micomercio"
                        error={!!errors.redesSociales?.facebook}
                        helperText={errors.redesSociales?.facebook?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Facebook sx={{ color: '#1877f2', mr: 1 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '&.Mui-focused fieldset': {
                              borderColor: '#1877f2',
                              borderWidth: 2,
                            }
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        {...register('redesSociales.instagram')}
                        label="Instagram"
                        fullWidth
                        disabled={!isEditing}
                        placeholder="@micomercio"
                        error={!!errors.redesSociales?.instagram}
                        helperText={errors.redesSociales?.instagram?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Instagram sx={{ color: '#e4405f', mr: 1 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '&.Mui-focused fieldset': {
                              borderColor: '#e4405f',
                              borderWidth: 2,
                            }
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        {...register('redesSociales.twitter')}
                        label="Twitter"
                        fullWidth
                        disabled={!isEditing}
                        placeholder="@micomercio"
                        error={!!errors.redesSociales?.twitter}
                        helperText={errors.redesSociales?.twitter?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Twitter sx={{ color: '#1da1f2', mr: 1 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '&.Mui-focused fieldset': {
                              borderColor: '#1da1f2',
                              borderWidth: 2,
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Save Changes Alert */}
        <AnimatePresence>
          {hasChanges && isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
            >
              <Alert
                severity="warning"
                action={
                  <Stack direction="row" spacing={1}>
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleReset}
                    >
                      Descartar
                    </Button>
                    <Button
                      color="inherit"
                      size="small"
                      variant="outlined"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </Stack>
                }
                sx={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  borderRadius: 3,
                  minWidth: 300,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Tienes cambios sin guardar
                </Typography>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};