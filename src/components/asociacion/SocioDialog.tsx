'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  alpha,
  Avatar,
  Divider,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CreditCard,
  Close,
  Save,
  PersonAdd,
  CheckCircle,
  Info,
  Visibility,
  VisibilityOff,
  Star,
  Security,
  ContactMail,
  Badge,
  AccountCircle,
} from '@mui/icons-material';
import { Socio, SocioFormData } from '@/types/socio';
import { socioSchema } from '@/lib/validations/socio';

interface SocioDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SocioFormData) => Promise<void>;
  socio?: Socio | null;
  loading?: boolean;
}

const FormSection: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, color, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card
      elevation={0}
      sx={{
        mb: 4,
        border: `2px solid ${alpha(color, 0.1)}`,
        borderRadius: 4,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(color, 0.02)} 0%, ${alpha(color, 0.05)} 100%)`,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: alpha(color, 0.2),
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 32px ${alpha(color, 0.15)}`,
        }
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Section Header */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.12)} 100%)`,
            borderBottom: `1px solid ${alpha(color, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: alpha(color, 0.15),
                color: color,
                borderRadius: 3,
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Section Content */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const StyledTextField: React.FC<{
  register: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  error?: any;
  helperText?: string;
  required?: boolean;
}> = ({ register, name, label, placeholder, type = 'text', icon, error, helperText, required = false }) => (
  <TextField
    {...register(name)}
    label={label}
    type={type}
    placeholder={placeholder}
    fullWidth
    required={required}
    error={!!error}
    helperText={helperText}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Box sx={{ color: error ? '#ef4444' : '#94a3b8', fontSize: '1.3rem', transition: 'color 0.2s ease' }}>
            {icon}
          </Box>
        </InputAdornment>
      ),
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 3,
        bgcolor: '#fafbfc',
        transition: 'all 0.3s ease',
        '& fieldset': {
          borderColor: error ? '#ef4444' : '#e2e8f0',
          borderWidth: 2,
        },
        '&:hover fieldset': {
          borderColor: error ? '#ef4444' : '#6366f1',
          borderWidth: 2,
        },
        '&.Mui-focused fieldset': {
          borderColor: error ? '#ef4444' : '#6366f1',
          borderWidth: 2,
          boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(99, 102, 241, 0.1)',
        },
        '&.Mui-focused': {
          bgcolor: 'white',
        }
      },
      '& .MuiInputLabel-root': {
        fontWeight: 600,
        '&.Mui-focused': {
          color: error ? '#ef4444' : '#6366f1',
        },
      },
      '& .MuiFormHelperText-root': {
        fontWeight: 500,
        fontSize: '0.8rem',
      }
    }}
  />
);

export const SocioDialog: React.FC<SocioDialogProps> = ({
  open,
  onClose,
  onSave,
  socio,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isEditing = !!socio;
  const [formProgress, setFormProgress] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SocioFormData>({
    resolver: zodResolver(socioSchema),
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      email: '',
      estado: 'activo',
      telefono: '',
      dni: ''
    }
  });

  const watchedFields = watch();

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['nombre', 'email'];
    const optionalFields = ['telefono', 'dni'];
    const allFields = [...requiredFields, ...optionalFields];
    
    const filledRequiredFields = requiredFields.filter(field => 
      watchedFields[field as keyof SocioFormData]?.toString().trim()
    ).length;
    
    const filledOptionalFields = optionalFields.filter(field => 
      watchedFields[field as keyof SocioFormData]?.toString().trim()
    ).length;
    
    const requiredProgress = (filledRequiredFields / requiredFields.length) * 70;
    const optionalProgress = (filledOptionalFields / optionalFields.length) * 30;
    
    setFormProgress(requiredProgress + optionalProgress);
  }, [watchedFields]);

  useEffect(() => {
    if (open) {
      if (socio) {
        reset({
          nombre: socio.nombre,
          email: socio.email,
          estado: socio.estado === 'activo' || socio.estado === 'vencido' ? socio.estado : 'activo',
          telefono: socio.telefono || '',
          dni: socio.dni || ''
        });
      } else {
        reset({
          nombre: '',
          email: '',
          estado: 'activo',
          telefono: '',
          dni: ''
        });
      }
    }
  }, [open, socio, reset]);

  const onSubmit = async (data: SocioFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving socio:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const getProgressColor = () => {
    if (formProgress < 30) return '#ef4444';
    if (formProgress < 70) return '#f59e0b';
    return '#10b981';
  };

  const getProgressLabel = () => {
    if (formProgress < 30) return 'Comenzando';
    if (formProgress < 70) return 'En progreso';
    if (formProgress < 100) return 'Casi completo';
    return 'Completo';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Slide : Fade}
      TransitionProps={isMobile ? { direction: 'up' } : {}}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 6,
          boxShadow: isMobile ? 'none' : '0 32px 64px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          maxHeight: isMobile ? '100vh' : '90vh',
          height: isMobile ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          margin: isMobile ? 0 : 2,
          position: 'relative',
        }
      }}
    >
      {/* Enhanced Header - Fixed */}
      <DialogTitle
        sx={{
          p: 0,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Box sx={{ p: isMobile ? 3 : 4, position: 'relative', zIndex: 1 }}>
          {/* Header Content */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <Avatar
                  sx={{
                    width: isMobile ? 64 : 72,
                    height: isMobile ? 64 : 72,
                    bgcolor: alpha('#ffffff', 0.2),
                    color: 'white',
                    borderRadius: 4,
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {isEditing ? <Person sx={{ fontSize: isMobile ? 32 : 36 }} /> : <PersonAdd sx={{ fontSize: isMobile ? 32 : 36 }} />}
                </Avatar>
              </motion.div>
              <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 900, mb: 0.5 }}>
                    {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                    {isEditing ? 'Actualiza la información del socio' : 'Completa los datos del nuevo socio'}
                  </Typography>
                </motion.div>
              </Box>
            </Box>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Tooltip title="Cerrar">
                <IconButton
                  onClick={handleClose}
                  disabled={isSubmitting}
                  sx={{
                    color: 'white',
                    bgcolor: alpha('#ffffff', 0.1),
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      bgcolor: alpha('#ffffff', 0.2),
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>
          
          {/* Progress Section */}
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                    Progreso del formulario
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 700 }}>
                      {Math.round(formProgress)}%
                    </Typography>
                    <Chip
                      label={getProgressLabel()}
                      size="small"
                      sx={{
                        bgcolor: alpha('#ffffff', 0.2),
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={formProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha('#ffffff', 0.2),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getProgressColor(),
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                    }
                  }}
                />
              </Box>
            </motion.div>
          )}
        </Box>
        
        {/* Animated Background Elements */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.1),
          }}
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.1),
          }}
        />
      </DialogTitle>

      {/* Scrollable Content */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0, // Important for flex scrolling
        }}
      >
        <DialogContent 
          sx={{ 
            p: isMobile ? 2 : 4,
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f5f9',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)',
              borderRadius: '4px',
              '&:hover': {
                background: 'linear-gradient(135deg, #94a3b8, #64748b)',
              },
            },
            // Firefox scrollbar
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9',
          }}
        >
          <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
            {/* Personal Information Section */}
            <FormSection
              title="Información Personal"
              subtitle="Datos básicos del socio"
              icon={<AccountCircle />}
              color="#6366f1"
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    register={register}
                    name="nombre"
                    label="Nombre completo"
                    placeholder="Ingresa el nombre completo del socio"
                    icon={<Person />}
                    error={errors.nombre}
                    helperText={errors.nombre?.message}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    register={register}
                    name="dni"
                    label="DNI / Documento"
                    placeholder="Número de documento"
                    icon={<Badge />}
                    error={errors.dni}
                    helperText={errors.dni?.message || "Documento de identidad (opcional)"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={!!errors.estado}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: '#fafbfc',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          borderColor: errors.estado ? '#ef4444' : '#e2e8f0',
                          borderWidth: 2,
                        },
                        '&:hover fieldset': {
                          borderColor: errors.estado ? '#ef4444' : '#6366f1',
                          borderWidth: 2,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.estado ? '#ef4444' : '#6366f1',
                          borderWidth: 2,
                          boxShadow: errors.estado ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(99, 102, 241, 0.1)',
                        },
                        '&.Mui-focused': {
                          bgcolor: 'white',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 600,
                        '&.Mui-focused': {
                          color: errors.estado ? '#ef4444' : '#6366f1',
                        },
                      },
                    }}
                  >
                    <InputLabel>Estado del socio</InputLabel>
                    <Select
                      {...register('estado')}
                      label="Estado del socio"
                      defaultValue="activo"
                      startAdornment={
                        <InputAdornment position="start">
                          <Security sx={{ color: '#94a3b8', fontSize: '1.3rem', mr: 1 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="activo">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Activo</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>Socio con membresía vigente</Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="vencido">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Info sx={{ color: '#ef4444', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Vencido</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>Membresía expirada</Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                    {errors.estado && (
                      <FormHelperText sx={{ fontWeight: 500 }}>{errors.estado.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            {/* Contact Information Section */}
            <FormSection
              title="Información de Contacto"
              subtitle="Datos para comunicación y notificaciones"
              icon={<ContactMail />}
              color="#10b981"
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    register={register}
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    placeholder="socio@email.com"
                    icon={<Email />}
                    error={errors.email}
                    helperText={errors.email?.message || "Email principal para notificaciones"}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    register={register}
                    name="telefono"
                    label="Teléfono"
                    placeholder="Número de teléfono con código de área"
                    icon={<Phone />}
                    error={errors.telefono}
                    helperText={errors.telefono?.message || "Teléfono de contacto (opcional)"}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Form Summary */}
            {!isEditing && formProgress > 50 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    border: '2px solid #bae6fd',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#0ea5e9', color: 'white', width: 32, height: 32 }}>
                      <Star sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0c4a6e' }}>
                      Resumen del Socio
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                        Nombre:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 700 }}>
                        {watchedFields.nombre || 'No especificado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                        Email:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 700 }}>
                        {watchedFields.email || 'No especificado'}
                      </Typography>
                    </Grid>
                    {watchedFields.telefono && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                          Teléfono:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 700 }}>
                          {watchedFields.telefono}
                        </Typography>
                      </Grid>
                    )}
                    {watchedFields.dni && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                          DNI:
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 700 }}>
                          {watchedFields.dni}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </motion.div>
            )}
          </Box>
        </DialogContent>

        {/* Fixed Actions */}
        <DialogActions 
          sx={{ 
            p: isMobile ? 2 : 4, 
            pt: isMobile ? 2 : 3,
            flexShrink: 0, 
            borderTop: '1px solid #f1f5f9',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            gap: 2,
          }}
        >
          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={2} 
            sx={{ width: '100%' }}
          >
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              variant="outlined"
              startIcon={<Close />}
              sx={{
                flex: isMobile ? undefined : 1,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                borderColor: '#e2e8f0',
                color: '#475569',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#6366f1',
                  bgcolor: alpha('#6366f1', 0.03),
                  color: '#6366f1',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              Cancelar
            </Button>
            
            <motion.div
              style={{ flex: isMobile ? undefined : 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                variant="contained"
                startIcon={isSubmitting ? null : <Save />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  background: isSubmitting || !isValid 
                    ? '#e2e8f0' 
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                  color: isSubmitting || !isValid ? '#94a3b8' : 'white',
                  boxShadow: isSubmitting || !isValid 
                    ? 'none' 
                    : '0 8px 32px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: isSubmitting || !isValid 
                      ? '#e2e8f0' 
                      : 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #db2777 100%)',
                    transform: isSubmitting || !isValid ? 'none' : 'translateY(-2px)',
                    boxShadow: isSubmitting || !isValid 
                      ? 'none' 
                      : '0 12px 40px rgba(99, 102, 241, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e2e8f0',
                    color: '#94a3b8',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isSubmitting && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      zIndex: 1,
                    }}
                  />
                )}
                <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Save />
                      </motion.div>
                      Guardando...
                    </>
                  ) : (
                    `${isEditing ? 'Actualizar' : 'Crear'} Socio`
                  )}
                </Box>
              </Button>
            </motion.div>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  );
};