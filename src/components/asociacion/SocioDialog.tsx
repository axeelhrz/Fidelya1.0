'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CreditCard,
  Close,
  Save,
  PersonAdd,
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

export const SocioDialog: React.FC<SocioDialogProps> = ({
  open,
  onClose,
  onSave,
  socio,
}) => {
  const isEditing = !!socio;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 0,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: alpha('#ffffff', 0.2),
                color: 'white',
              }}
            >
              {isEditing ? <Person sx={{ fontSize: 28 }} /> : <PersonAdd sx={{ fontSize: 28 }} />}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {isEditing ? 'Actualiza la información del socio' : 'Completa los datos del nuevo socio'}
              </Typography>
            </Box>
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

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <DialogContent 
          sx={{ 
            p: 4,
            flex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f5f9',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e1',
              borderRadius: '4px',
              '&:hover': {
                background: '#94a3b8',
              },
            },
          }}
        >
          <Stack spacing={4}>
            {/* Nombre */}
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
                  borderRadius: 3,
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

            {/* Email */}
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
                  borderRadius: 3,
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

            {/* Estado */}
            <FormControl 
              fullWidth 
              error={!!errors.estado}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
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
              <InputLabel>Estado</InputLabel>
              <Select
                {...register('estado')}
                label="Estado"
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

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, px: 2 }}>
                INFORMACIÓN ADICIONAL (OPCIONAL)
              </Typography>
            </Divider>

            {/* Teléfono */}
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
                  borderRadius: 3,
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

            {/* DNI */}
            <TextField
              {...register('dni')}
              label="DNI"
              placeholder="Documento de identidad"
              fullWidth
              error={!!errors.dni}
              helperText={errors.dni?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
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
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 0, flexShrink: 0, borderTop: '1px solid #f1f5f9' }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              variant="outlined"
              startIcon={<Close />}
              sx={{
                flex: 1,
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
                },
                transition: 'all 0.2s ease'
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              startIcon={<Save />}
              sx={{
                flex: 1,
                py: 1.5,
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
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.2s ease'
              }}
            >
              {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Socio
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};