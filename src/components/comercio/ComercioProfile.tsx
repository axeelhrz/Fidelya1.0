'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Stack,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  alpha,
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
  Facebook,
  Instagram,
  Twitter,
  PhotoCamera,
  Save,
  Edit,
  Description,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useComercios } from '@/hooks/useComercios';
import { comercioProfileSchema, ComercioProfileFormData } from '@/lib/validations/comercio';
import { CATEGORIAS_COMERCIO } from '@/types/comercio';
import toast from 'react-hot-toast';

export const ComercioProfile: React.FC = () => {
  const { comercio, loading, updateProfile, uploadImage } = useComercios();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<ComercioProfileFormData>({
    resolver: zodResolver(comercioProfileSchema),
    defaultValues: {
      nombre: comercio?.nombre || '',
      nombreComercio: comercio?.nombreComercio || '',
      email: comercio?.email || '',
      categoria: comercio?.categoria || '',
      direccion: comercio?.direccion || '',
      telefono: comercio?.telefono || '',
      horario: comercio?.horario || '',
      descripcion: comercio?.descripcion || '',
      sitioWeb: comercio?.sitioWeb || '',
      redesSociales: {
        facebook: comercio?.redesSociales?.facebook || '',
        instagram: comercio?.redesSociales?.instagram || '',
        twitter: comercio?.redesSociales?.twitter || '',
      }
    }
  });

  React.useEffect(() => {
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
        redesSociales: {
          facebook: comercio.redesSociales?.facebook || '',
          instagram: comercio.redesSociales?.instagram || '',
          twitter: comercio.redesSociales?.twitter || '',
        }
      });
    }
  }, [comercio, reset]);

  const onSubmit = async (data: ComercioProfileFormData) => {
    const success = await updateProfile(data);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'imagen') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    setUploading(true);
    await uploadImage(file, type);
    setUploading(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Avatar sx={{ width: 60, height: 60, bgcolor: '#06b6d4' }}>
            <Store sx={{ fontSize: 30 }} />
          </Avatar>
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
      <Grid container spacing={4}>
        {/* Profile Images */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              background: 'white',
              border: '1px solid #f1f5f9',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                Imágenes del Comercio
              </Typography>

              {/* Logo */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#64748b', fontWeight: 600 }}>
                  Logo del Comercio
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={comercio?.logoUrl}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: alpha('#06b6d4', 0.1),
                      border: '3px solid #f1f5f9',
                    }}
                  >
                    <Store sx={{ fontSize: 40, color: '#06b6d4' }} />
                  </Avatar>
                  <IconButton
                    component="label"
                    disabled={uploading}
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      bgcolor: '#06b6d4',
                      color: 'white',
                      width: 36,
                      height: 36,
                      '&:hover': {
                        bgcolor: '#0891b2',
                      }
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 18 }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                    />
                  </IconButton>
                </Box>
              </Box>

              {/* Main Image */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#64748b', fontWeight: 600 }}>
                  Imagen Principal
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: 200,
                      height: 120,
                      bgcolor: alpha('#06b6d4', 0.1),
                      border: '3px solid #f1f5f9',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: comercio?.imagenPrincipalUrl ? `url(${comercio.imagenPrincipalUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!comercio?.imagenPrincipalUrl && (
                      <Store sx={{ fontSize: 40, color: '#06b6d4' }} />
                    )}
                  </Paper>
                  <IconButton
                    component="label"
                    disabled={uploading}
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      bgcolor: '#06b6d4',
                      color: 'white',
                      width: 36,
                      height: 36,
                      '&:hover': {
                        bgcolor: '#0891b2',
                      }
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 18 }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'imagen')}
                    />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              background: 'white',
              border: '1px solid #f1f5f9',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Información del Comercio
                </Typography>
                <Button
                  variant={isEditing ? "outlined" : "contained"}
                  startIcon={isEditing ? <Save /> : <Edit />}
                  onClick={() => {
                    if (isEditing) {
                      handleSubmit(onSubmit)();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: isEditing ? 'transparent' : '#06b6d4',
                    borderColor: '#06b6d4',
                    color: isEditing ? '#06b6d4' : 'white',
                    '&:hover': {
                      bgcolor: isEditing ? alpha('#06b6d4', 0.1) : '#0891b2',
                    }
                  }}
                >
                  {isEditing ? 'Guardar' : 'Editar'}
                </Button>
              </Stack>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                      Información Básica
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('nombre')}
                      label="Nombre del Responsable"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('nombreComercio')}
                      label="Nombre del Comercio"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.nombreComercio}
                      helperText={errors.nombreComercio?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Store sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('email')}
                      label="Email"
                      type="email"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        {...register('categoria')}
                        label="Categoría"
                        error={!!errors.categoria}
                        sx={{
                          borderRadius: 2,
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#06b6d4',
                          }
                        }}
                      >
                        {CATEGORIAS_COMERCIO.map((categoria) => (
                          <MenuItem key={categoria} value={categoria}>
                            {categoria}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('telefono')}
                      label="Teléfono"
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.telefono}
                      helperText={errors.telefono?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('horario')}
                      label="Horario de Atención"
                      fullWidth
                      disabled={!isEditing}
                      placeholder="Ej: Lun-Vie 9:00-18:00"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Schedule sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      {...register('direccion')}
                      label="Dirección"
                      fullWidth
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      {...register('descripcion')}
                      label="Descripción del Comercio"
                      fullWidth
                      multiline
                      rows={3}
                      disabled={!isEditing}
                      placeholder="Describe tu comercio, productos o servicios..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                            <Description sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  {/* Online Presence */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                      Presencia Online
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      {...register('sitioWeb')}
                      label="Sitio Web"
                      fullWidth
                      disabled={!isEditing}
                      placeholder="https://www.micomercio.com"
                      error={!!errors.sitioWeb}
                      helperText={errors.sitioWeb?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Language sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register('redesSociales.facebook')}
                      label="Facebook"
                      fullWidth
                      disabled={!isEditing}
                      placeholder="@micomercio"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Facebook sx={{ color: '#1877f2' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register('redesSociales.instagram')}
                      label="Instagram"
                      fullWidth
                      disabled={!isEditing}
                      placeholder="@micomercio"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Instagram sx={{ color: '#e4405f' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register('redesSociales.twitter')}
                      label="Twitter"
                      fullWidth
                      disabled={!isEditing}
                      placeholder="@micomercio"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Twitter sx={{ color: '#1da1f2' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      sx={{
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: alpha('#6b7280', 0.1),
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={<Save />}
                      sx={{
                        bgcolor: '#06b6d4',
                        '&:hover': {
                          bgcolor: '#0891b2',
                        }
                      }}
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Stack>
                )}
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};
