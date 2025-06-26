'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  alpha,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Warning,
  Close,
  Delete,
  Info,
} from '@mui/icons-material';
import { Socio } from '@/types/socio';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  socio: Socio | null;
  loading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  socio,
  loading = false
}) => {

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting socio:', error);
    }
  };

  if (!socio) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 0,
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
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
              <Warning sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                Confirmar Eliminación
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Esta acción requiere confirmación
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

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Main message */}
          <Box>
            <Typography variant="body1" sx={{ color: '#374151', mb: 2, fontSize: '1.1rem' }}>
              ¿Estás seguro de que deseas eliminar al socio{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#1f2937' }}>
                {socio.nombre}
              </Box>
              ?
            </Typography>
          </Box>

          {/* Info card */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha('#f59e0b', 0.05),
              border: `1px solid ${alpha('#f59e0b', 0.2)}`,
              borderRadius: 4,
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #f59e0b, #f97316)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha('#f59e0b', 0.15),
                  color: '#f59e0b',
                  flexShrink: 0,
                }}
              >
                <Info sx={{ fontSize: 20 }} />
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#f59e0b',
                    mb: 1,
                    fontSize: '1rem'
                  }}
                >
                  Información Importante
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha('#f59e0b', 0.8),
                    fontSize: '0.9rem',
                    lineHeight: 1.6
                  }}
                >
                  El socio será marcado como <strong>inactivo</strong> y no se eliminará permanentemente. 
                  Podrás reactivarlo más tarde si es necesario desde la configuración avanzada.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Socio details */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 4,
              p: 3
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#6b7280', mb: 2, fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Datos del Socio
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>Email:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>{socio.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>Estado actual:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: socio.estado === 'activo' ? '#10b981' : '#ef4444' }}>
                  {socio.estado === 'activo' ? 'Activo' : 'Vencido'}
                </Typography>
              </Box>
              {socio.telefono && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Teléfono:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>{socio.telefono}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            onClick={onClose}
            disabled={loading}
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
            onClick={handleConfirm}
            disabled={loading}
            variant="contained"
            startIcon={<Delete />}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 25px rgba(239, 68, 68, 0.4)',
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
            {loading ? 'Eliminando...' : 'Eliminar Socio'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};