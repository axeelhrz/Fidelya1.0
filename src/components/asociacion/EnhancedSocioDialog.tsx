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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Close,
  Save,
  PersonAdd,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  ContactMail,
  Badge,
} from '@mui/icons-material';
import { Socio, SocioFormData } from '@/types/socio';
import { socioSchema } from '@/lib/validations/socio';

interface EnhancedSocioDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SocioFormData) => Promise<void>;
  socio?: Socio | null;
  loading?: boolean;
}

const steps = [
  {
    label: 'Información Personal',
    description: 'Datos básicos del miembro',
    icon: <Person />,
  },
  {
    label: 'Contacto',
    description: 'Información de contacto',
    icon: <ContactMail />,
  },
  {
    label: 'Verificación',
    description: 'Revisión y confirmación',
    icon: <CheckCircle />,
  },
];

export const EnhancedSocioDialog: React.FC<EnhancedSocioDialogProps> = ({
  open,
  onClose,
  onSave,
  socio,
}) => {
  const isEditing = !!socio;
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<SocioFormData>({
    resolver: zodResolver(socioSchema),
    defaultValues: {
      nombre: '',
      email: '',
      estado: 'activo',
      telefono: '',
      dni: ''
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (open) {
      if (socio) {
        reset({
          nombre: socio.nombre,
          email: socio.email,
          estado: socio.estado === 'inactivo' ? 'activo' : socio.estado,
          telefono: socio.telefono || '',
          dni: socio.dni || ''
        });
        setCompletedSteps([0, 1, 2]);
        setActiveStep(2);
      } else {
        reset({
          nombre: '',
          email: '',
          estado: 'activo',
          telefono: '',
          dni: ''
        });
        setCompletedSteps([]);
        setActiveStep(0);
      }
    }
  }, [open, socio, reset]);

  const validateStep = async (step: number) => {
    const fieldsToValidate = {
      0: ['nombre'],
      1: ['email'],
      2: []
    };

    const fields = fieldsToValidate[step as keyof typeof fieldsToValidate];
    if (fields.length > 0) {
      const isValid = await trigger(fields as (keyof SocioFormData)[]);
      return isValid;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = async (step: number) => {
    if (step <= activeStep || completedSteps.includes(step)) {
      setActiveStep(step);
    }
  };

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
      setActiveStep(0);
      setCompletedSteps([]);
      onClose();
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Información Personal
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Ingresa los datos básicos del miembro
                </Typography>
              </Box>

              <TextField
                {...register('nombre')}
                label="Nombre completo"
                placeholder="Ingresa el nombre completo"
                fullWidth
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: '#fafbfc',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6366f1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                      borderWidth: 2,
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#6366f1',
                  },
                }}
              />

              <TextField
                {...register('dni')}
                label="DNI / Documento de Identidad"
                placeholder="Número de documento"
                fullWidth
                error={!!errors.dni}
                helperText={errors.dni?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: '#fafbfc',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6366f1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                      borderWidth: 2,
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#6366f1',
                  },
                }}
              />
            </Stack>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: alpha('#10b981', 0.1),
                    color: '#10b981',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <ContactMail sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Información de Contacto
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Datos para comunicación y notificaciones
                </Typography>
              </Box>

              <TextField
                {...register('email')}
                label="Correo electrónico"
                type="email"
                placeholder="socio@email.com"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: '#fafbfc',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6366f1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                      borderWidth: 2,
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#6366f1',
                  },
                }}
              />

              <TextField
                {...register('telefono')}
                label="Teléfono"
                placeholder="Número de teléfono"
                fullWidth
                error={!!errors.telefono}
                helperText={errors.telefono?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: '#fafbfc',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6366f1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                      borderWidth: 2,
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#6366f1',
                  },
                }}
              />

              <FormControl 
                fullWidth 
                error={!!errors.estado}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: '#fafbfc',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6366f1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                      borderWidth: 2,
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#6366f1',
                  },
                }}
              >
                <InputLabel>Estado del miembro</InputLabel>
                <Select
                  {...register('estado')}
                  label="Estado del miembro"
                  defaultValue="activo"
                >
                  <MenuItem value="activo">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                      Activo
                    </Box>
                  </MenuItem>
                  <MenuItem value="vencido">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
                      Vencido
                    </Box>
                  </MenuItem>
                </Select>
                {errors.estado && (
                  <FormHelperText>{errors.estado.message}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: alpha('#8b5cf6', 0.1),
                    color: '#8b5cf6',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Verificación de Datos
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Revisa la información antes de guardar
                </Typography>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  bgcolor: alpha('#6366f1', 0.05),
                  border: `1px solid ${alpha('#6366f1', 0.15)}`,
                  borderRadius: 4,
                  p: 3,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6366f1', mb: 2 }}>
                  Resumen del Miembro
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Nombre:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 700 }}>
                      {watchedValues.nombre || 'No especificado'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Email:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 700 }}>
                      {watchedValues.email || 'No especificado'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Teléfono:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 700 }}>
                      {watchedValues.telefono || 'No especificado'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      DNI:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 700 }}>
                      {watchedValues.dni || 'No especificado'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Estado:
                    </Typography>
                    <Chip
                      label={watchedValues.estado === 'activo' ? 'Activo' : 'Vencido'}
                      size="small"
                      sx={{
                        bgcolor: watchedValues.estado === 'activo' ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                        color: watchedValues.estado === 'activo' ? '#10b981' : '#ef4444',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 6,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          minHeight: 600,
        }
      }}
    >
      {/* Enhanced Header */}
      <DialogTitle
        sx={{
          p: 0,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: alpha('#ffffff', 0.2),
                  color: 'white',
                }}
              >
                {isEditing ? <Person sx={{ fontSize: 32 }} /> : <PersonAdd sx={{ fontSize: 32 }} />}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                  {isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {isEditing ? 'Actualiza la información del miembro' : 'Registro completo paso a paso'}
                </Typography>
              </Box>
            </Box>
            
            <IconButton
              onClick={handleClose}
              sx={{
                color: 'white',
                bgcolor: alpha('#ffffff', 0.1),
                '&:hover': {
                  bgcolor: alpha('#ffffff', 0.2),
                }
              }}
            >
              <Close />
            </IconButton>
          </Box>
          
          {/* Progress bar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                Progreso del registro
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 700 }}>
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha('#ffffff', 0.2),
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                  borderRadius: 3,
                }
              }}
            />
          </Box>
        </Box>
        
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: alpha('#ffffff', 0.1),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: alpha('#ffffff', 0.1),
          }}
        />
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', minHeight: 400 }}>
            {/* Stepper Sidebar */}
            <Box
              sx={{
                width: 280,
                bgcolor: '#fafbfc',
                borderRight: '1px solid #f1f5f9',
                p: 3,
              }}
            >
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label} completed={completedSteps.includes(index)}>
                    <StepLabel
                      onClick={() => handleStepClick(index)}
                      sx={{
                        cursor: index <= activeStep || completedSteps.includes(index) ? 'pointer' : 'default',
                        '& .MuiStepLabel-label': {
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        },
                        '& .MuiStepLabel-label.Mui-active': {
                          color: '#6366f1',
                          fontWeight: 700,
                        },
                        '& .MuiStepLabel-label.Mui-completed': {
                          color: '#10b981',
                          fontWeight: 700,
                        },
                      }}
                      icon={
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: completedSteps.includes(index) ? '#10b981' : 
                                     index === activeStep ? '#6366f1' : '#e2e8f0',
                            color: completedSteps.includes(index) || index === activeStep ? 'white' : '#94a3b8',
                            fontSize: '0.8rem',
                          }}
                        >
                          {completedSteps.includes(index) ? <CheckCircle sx={{ fontSize: 18 }} /> : index + 1}
                        </Avatar>
                      }
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Content Area */}
            <Box sx={{ flex: 1, p: 4 }}>
              <AnimatePresence mode="wait">
                {getStepContent(activeStep)}
              </AnimatePresence>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 4, borderTop: '1px solid #f1f5f9' }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              variant="outlined"
              startIcon={<Close />}
              sx={{
                py: 1.5,
                px: 3,
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
                },
                transition: 'all 0.2s ease'
              }}
            >
              Cancelar
            </Button>
            
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                startIcon={<ArrowBack />}
                sx={{
                  py: 1.5,
                  px: 3,
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
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Anterior
              </Button>
            )}
            
            <Box sx={{ flex: 1 }} />
            
            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 25px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                startIcon={<Save />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 25px rgba(16, 185, 129, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e2e8f0',
                    color: '#94a3b8',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Miembro
              </Button>
            )}
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};
