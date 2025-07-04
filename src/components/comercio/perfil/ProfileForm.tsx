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
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useComercios } from '@/hooks/useComercios';
import { ComercioProfileFormData } from '@/lib/validations/comercio';
import { CATEGORIAS_COMERCIO } from '@/types/comercio';
import { ImageUploader } from './ImageUploader';
import { QRSection } from './QRSection';

export const ProfileForm: React.FC = () => {
  const { comercio, loading, updateProfile } = useComercios();
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ComercioProfileFormData>({
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
      reset({
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
      });
    }
  }, [comercio, reset]);

  const onSubmit = async (data: ComercioProfileFormData) => {
    const success = await updateProfile({
      nombre: data.nombre,
      nombreComercio: data.nombreComercio,
      email: data.email,
      categoria: data.categoria,
      direccion: data.direccion,
      telefono: data.telefono,
      horario: data.horario,
      descripcion: data.descripcion,
      sitioWeb: data.sitioWeb,
      razonSocial: data.razonSocial,
      cuit: data.cuit,
      ubicacion: data.ubicacion,
      emailContacto: data.emailContacto,
      visible: data.visible,
      redesSociales: data.redesSociales,
    });
    
    if (success) {
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    if (comercio) {
      reset({
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
      });
    }
    setIsEditing(false);
    setHasChanges(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Images Section */}
        <ImageUploader />

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

              <Stack direction="row" spacing={2}>
                <AnimatePresence>
                  {hasChanges && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Chip
                        label="Cambios sin guardar"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

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
                      disabled={isSubmitting || !hasChanges}
                      startIcon={<Save />}
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
                    onClick={() => setIsEditing(true)}
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
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <TextField
                          {...register('nombre')}
                          label="Nombre del Responsable"
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.nombre}
                          helperText={errors.nombre?.message}
                          InputProps={{
                            startAdornment: <Person sx={{ color: '#94a3b8', mr: 1 }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              '&.Mui-focused fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: 2,
                              }
                            }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <TextField
                          {...register('nombreComercio')}
                          label="Nombre Comercial"
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.nombreComercio}
                          helperText={errors.nombreComercio?.message}
                          InputProps={{
                            startAdornment: <Store sx={{ color: '#94a3b8', mr: 1 }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              '&.Mui-focused fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: 2,
                              }
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <TextField
                          {...register('razonSocial')}
                          label="Razón Social"
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.razonSocial}
                          helperText={errors.razonSocial?.message}
                          InputProps={{
                            startAdornment: <Business sx={{ color: '#94a3b8', mr: 1 }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              '&.Mui-focused fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: 2,
                              }
                            }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <TextField
                          {...register('cuit')}
                          label="RUT / CUIT"
                          fullWidth
                          disabled={!isEditing}
                          placeholder="12-34567890-1"
                          error={!!errors.cuit}
                          helperText={errors.cuit?.message}
                          InputProps={{
                            startAdornment: <Description sx={{ color: '#94a3b8', mr: 1 }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              '&.Mui-focused fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: 2,
                              }
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 300 }}>
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
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 300 }}>
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
                      </Box>
                    </Box>
                  </Box>
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
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <TextField
                          {...register('email')}
                          label="Email Principal"
                          type="email"
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          InputProps={{
                            startAdornment: <Email sx={{ color: '#94a3b8', mr: 1 }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              '&.Mui-focused fieldset': {
                                borderColor: '#06b6d4',
                                borderWidth: 2,
                              }
                            }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <TextField
                          {...register('emailContacto')}
                          label="Email de Contacto"
                          type="email"
                          fullWidth
                          disabled={!isEditing}
                          placeholder="contacto@micomercio.com"
                          error={!!errors.emailContacto}
                          helperText={errors.emailContacto?.message}
                          InputProps={{
                            startAdornment: <Email sx={{ color: '#94a3b8', mr: 1 }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              '&.Mui-focused fieldset': {
                                borderColor: '#06b6d4',
                                borderWidth: 2,
                              }
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <TextField
                          {...register('telefono')}
                          label="Teléfono"
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.telefono}
                          helperText={errors.telefono?.message}
                          placeholder="+598 99 123 456"
                          InputProps={{
                            startAdornment: <Phone sx={{ color: '#94a3b8', mr: 1 }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              '&.Mui-focused fieldset': {
                                borderColor: '#06b6d4',
                                borderWidth: 2,
                              }
                            }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 300 }}>
                        <TextField
                          {...register('horario')}
                          label="Horarios de Atención"
                          fullWidth
                          disabled={!isEditing}
                          placeholder="Lunes a Viernes - 9 a 18 hs"
                          error={!!errors.horario}
                          helperText={errors.horario?.message}
                          InputProps={{
                            startAdornment: <Schedule sx={{ color: '#94a3b8', mr: 1 }} />,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              '&.Mui-focused fieldset': {
                                borderColor: '#06b6d4',
                                borderWidth: 2,
                              }
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <TextField
                      {...register('direccion')}
                      label="Dirección Física"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.direccion}
                      helperText={errors.direccion?.message}
                      InputProps={{
                        startAdornment: <LocationOn sx={{ color: '#94a3b8', mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                            borderWidth: 2,
                          }
                        }
                      }}
                    />

                    <TextField
                      {...register('ubicacion')}
                      label="Ciudad y Departamento"
                      fullWidth
                      disabled={!isEditing}
                      placeholder="Montevideo, Montevideo"
                      error={!!errors.ubicacion}
                      helperText={errors.ubicacion?.message}
                      InputProps={{
                        startAdornment: <LocationOn sx={{ color: '#94a3b8', mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                            borderWidth: 2,
                          }
                        }
                      }}
                    />
                  </Box>
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
                  
                  <TextField
                    {...register('descripcion')}
                    label="Descripción del Comercio"
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!isEditing}
                    placeholder="Describe tu comercio, productos o servicios que ofreces a los socios de Fidelitá..."
                    helperText="Máximo 500 caracteres. Esta descripción será visible para los socios."
                    error={!!errors.descripcion}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981',
                          borderWidth: 2,
                        }
                      }
                    }}
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
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <TextField
                      {...register('sitioWeb')}
                      label="Sitio Web"
                      fullWidth
                      disabled={!isEditing}
                      placeholder="https://www.micomercio.com"
                      error={!!errors.sitioWeb}
                      helperText={errors.sitioWeb?.message}
                      InputProps={{
                        startAdornment: <Language sx={{ color: '#94a3b8', mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&.Mui-focused fieldset': {
                            borderColor: '#f59e0b',
                            borderWidth: 2,
                          }
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <TextField
                          {...register('redesSociales.facebook')}
                          label="Facebook"
                          fullWidth
                          disabled={!isEditing}
                          placeholder="@micomercio"
                          error={!!errors.redesSociales?.facebook}
                          helperText={errors.redesSociales?.facebook?.message}
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
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <TextField
                          {...register('redesSociales.instagram')}
                          label="Instagram"
                          fullWidth
                          disabled={!isEditing}
                          placeholder="@micomercio"
                          error={!!errors.redesSociales?.instagram}
                          helperText={errors.redesSociales?.instagram?.message}
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
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <TextField
                          {...register('redesSociales.twitter')}
                          label="Twitter"
                          fullWidth
                          disabled={!isEditing}
                          placeholder="@micomercio"
                          error={!!errors.redesSociales?.twitter}
                          helperText={errors.redesSociales?.twitter?.message}
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
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* QR Section */}
        <QRSection />

        {/* Save Changes Alert */}
        <AnimatePresence>
          {hasChanges && (
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
                      disabled={isSubmitting}
                    >
                      Guardar
                    </Button>
                  </Stack>
                }
                sx={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  borderRadius: 3,
                }}
              >
                Tienes cambios sin guardar
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};