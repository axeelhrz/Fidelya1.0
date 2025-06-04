import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Servicios
import { crearCliente, actualizarCliente } from '../../services/clienteService';

// Esquema de validación
const schema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  correo: yup
    .string()
    .email('Debe ser un correo electrónico válido')
    .max(100, 'El correo no puede exceder 100 caracteres'),
  telefono: yup
    .string()
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  direccion: yup
    .string()
    .max(255, 'La dirección no puede exceder 255 caracteres'),
  notas: yup
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
});

const ClienteDialog = ({ 
  open, 
  onClose, 
  cliente, 
  editMode, 
  onClienteCreated, 
  onClienteUpdated 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
      correo: '',
      telefono: '',
      direccion: '',
      notas: ''
    },
    mode: 'onChange'
  });

  // Resetear formulario cuando cambie el cliente o se abra el diálogo
  useEffect(() => {
    if (open) {
      if (editMode && cliente) {
        reset({
          nombre: cliente.nombre || '',
          correo: cliente.correo || '',
          telefono: cliente.telefono || '',
          direccion: cliente.direccion || '',
          notas: cliente.notas || ''
        });
      } else {
        reset({
          nombre: '',
          correo: '',
          telefono: '',
          direccion: '',
          notas: ''
        });
      }
      setError('');
    }
  }, [open, editMode, cliente, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      // Limpiar campos vacíos
      const clienteData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value?.trim() || ''])
      );

      if (editMode) {
        await actualizarCliente(cliente.id, clienteData);
        onClienteUpdated();
      } else {
        await crearCliente(clienteData);
        onClienteCreated();
      }
    } catch (error) {
      console.error('Error guardando cliente:', error);
      setError(error.message || 'Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.9, y: 50 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 50 },
            transition: { duration: 0.3, ease: "easeOut" },
            sx: {
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }
          }}
        >
          {/* Header */}
          <DialogTitle sx={{ 
            pb: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #62a83d 0%, #4a7c2a 100%)',
            color: 'white',
            borderRadius: '16px 16px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {editMode ? 'Editar Cliente' : 'Nuevo Cliente'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {editMode ? 'Modifica los datos del cliente' : 'Completa la información del cliente'}
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={handleClose} 
              disabled={loading}
              sx={{ 
                color: 'white',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {/* Content */}
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Nombre */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nombre completo"
                        placeholder="Ej: María González"
                        fullWidth
                        required
                        error={!!errors.nombre}
                        helperText={errors.nombre?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 3 }
                        }}
                        autoFocus={!editMode}
                        disabled={loading}
                      />
                    )}
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Controller
                    name="correo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Correo electrónico"
                        placeholder="Ej: maria@email.com"
                        type="email"
                        fullWidth
                        error={!!errors.correo}
                        helperText={errors.correo?.message || 'Opcional'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: 'info.main' }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 3 }
                        }}
                        disabled={loading}
                      />
                    )}
                  />
                </motion.div>

                {/* Teléfono */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Teléfono"
                        placeholder="Ej: 099123456"
                        fullWidth
                        error={!!errors.telefono}
                        helperText={errors.telefono?.message || 'Opcional'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon sx={{ color: 'success.main' }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 3 }
                        }}
                        disabled={loading}
                      />
                    )}
                  />
                </motion.div>

                {/* Dirección */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Controller
                    name="direccion"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Dirección"
                        placeholder="Ej: Av. 18 de Julio 1234"
                        fullWidth
                        error={!!errors.direccion}
                        helperText={errors.direccion?.message || 'Opcional'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon sx={{ color: 'warning.main' }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 3 }
                        }}
                        disabled={loading}
                      />
                    )}
                  />
                </motion.div>

                {/* Notas */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Controller
                    name="notas"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Notas"
                        placeholder="Ej: Cliente frecuente, prefiere frutas orgánicas"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.notas}
                        helperText={errors.notas?.message || 'Opcional - Información adicional sobre el cliente'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                              <NotesIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 3 }
                        }}
                        disabled={loading}
                      />
                    )}
                  />
                </motion.div>
              </Box>
            </Box>
          </DialogContent>

          {/* Actions */}
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={loading || !isValid || (!editMode && !isDirty)}
              startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(98, 168, 61, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(98, 168, 61, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Guardando...' : (editMode ? 'Actualizar' : 'Crear Cliente')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ClienteDialog;