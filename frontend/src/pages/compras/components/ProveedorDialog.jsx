import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { proveedorService } from '../../../services/proveedorService';

// Esquema de validación
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es requerido').min(2, 'Mínimo 2 caracteres'),
  rut: yup.string().min(8, 'RUT debe tener al menos 8 caracteres'),
  telefono: yup.string().min(8, 'Teléfono debe tener al menos 8 dígitos'),
  direccion: yup.string(),
  observaciones: yup.string(),
});

const ProveedorDialog = ({ open, onClose, onSuccess, mode = 'create', proveedor = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
      rut: '',
      telefono: '',
      direccion: '',
      observaciones: '',
    }
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && proveedor) {
        reset({
          nombre: proveedor.nombre || '',
          rut: proveedor.rut || '',
          telefono: proveedor.telefono || '',
          direccion: proveedor.direccion || '',
          observaciones: proveedor.observaciones || '',
        });
      } else {
        reset({
          nombre: '',
          rut: '',
          telefono: '',
          direccion: '',
          observaciones: '',
        });
      }
      setError(null);
    }
  }, [open, mode, proveedor, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        await proveedorService.crearProveedor(data);
        onSuccess('Proveedor creado exitosamente');
      } else {
        await proveedorService.actualizarProveedor(proveedor.id, data);
        onSuccess('Proveedor actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error guardando proveedor:', error);
      setError(error.message || 'Error al guardar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {mode === 'create' ? 'Nuevo Proveedor' : 'Editar Proveedor'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Nombre */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del Proveedor *"
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* RUT */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="rut"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="RUT"
                      error={!!errors.rut}
                      helperText={errors.rut?.message}
                      placeholder="Ej: 12345678901"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="telefono"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Teléfono"
                      error={!!errors.telefono}
                      helperText={errors.telefono?.message}
                      placeholder="Ej: +598 2123 4567"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Dirección */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="direccion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Dirección"
                      error={!!errors.direccion}
                      helperText={errors.direccion?.message}
                      placeholder="Dirección completa"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Observaciones */}
              <Grid item xs={12}>
                <Controller
                  name="observaciones"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Observaciones"
                      error={!!errors.observaciones}
                      helperText={errors.observaciones?.message}
                      placeholder="Notas adicionales sobre el proveedor..."
                      multiline
                      rows={3}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <DescriptionIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </motion.div>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProveedorDialog;