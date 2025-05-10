'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Stack, 
  Button, 
  useTheme, 
  alpha,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Trash, 
  Warning, 
  X, 
} from 'phosphor-react';
import { useSettings } from '@/hooks/use-settings';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function DeleteAccountTab() {
  const theme = useTheme();
  const router = useRouter();
  const { signOut } = useAuth();
  const { deleteAccount, loading } = useSettings();
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Abrir diálogo de confirmación
  const handleConfirmDialogOpen = () => {
    setPassword('');
    setConfirmText('');
    setPasswordError('');
    setConfirmDialogOpen(true);
  };
  
  // Cerrar diálogo de confirmación
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };
  
  // Eliminar cuenta
  const handleDeleteAccount = async () => {
    if (confirmText !== 'ELIMINAR') {
      setPasswordError('Por favor, escribe ELIMINAR para confirmar');
      return;
    }
    
    setDeleting(true);
    try {
      await deleteAccount(password);
      handleConfirmDialogClose();
      setSnackbarMessage('Cuenta eliminada correctamente');
      setSnackbarSeverity('success');
      
      // Redirigir al inicio después de un breve retraso
      setTimeout(() => {
        signOut();
        router.push('/');
      }, 2000);
    } catch (error: Error | unknown) {
      console.error('Error deleting account:', error);
      setPasswordError(error instanceof Error ? error.message : 'Error al eliminar la cuenta');
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }
  
  return (
    <Stack spacing={4}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontFamily: 'Sora', 
          fontWeight: 600,
          mb: 2,
          color: theme.palette.error.main
        }}
      >
        Eliminar cuenta
      </Typography>
      
      <Card 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.6) 
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                p: 1, 
                bgcolor: alpha(theme.palette.error.main, 0.1), 
                borderRadius: '10px', 
                color: theme.palette.error.main 
              }}
            >
              <Warning weight="duotone" size={24} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
              Acción irreversible
            </Typography>
          </Box>
          
          <Typography variant="body1">
            Eliminar tu cuenta es una acción permanente y no se puede deshacer. Esto eliminará:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2, mt: -3 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Todos tus datos personales
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Todos tus clientes y sus datos
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Todas tus pólizas y documentos
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Todo tu historial de actividad
            </Typography>
            <Typography component="li" variant="body1">
              Tu suscripción (sin reembolso por el período restante)
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Antes de eliminar tu cuenta, considera descargar una copia de tus datos desde la sección de exportación. Si tienes problemas con la plataforma, contacta con nuestro soporte para ayudarte a resolverlos.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDialogOpen}
              startIcon={<Trash weight="bold" />}
              sx={{ 
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 500,
                px: 3
              }}
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Eliminar mi cuenta
            </Button>
          </Box>
        </Stack>
      </Card>
      
      {/* Diálogo de confirmación */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={handleConfirmDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Sora', fontWeight: 600, color: theme.palette.error.main }}>
          Confirmar eliminación de cuenta
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 2, 
                  bgcolor: alpha(theme.palette.error.main, 0.1), 
                  borderRadius: '50%', 
                  color: theme.palette.error.main 
                }}
              >
                <Trash weight="duotone" size={48} />
              </Box>
            </Box>
            
            <Typography variant="body1" fontWeight={500}>
              Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Para confirmar, escribe ELIMINAR en el campo a continuación:
            </Typography>
            
            <TextField
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="ELIMINAR"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            
            <Typography variant="body2" color="text.secondary">
              Introduce tu contraseña para verificar tu identidad:
            </Typography>
            
            <TextField
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              type="password"
              size="small"
              error={!!passwordError}
              helperText={passwordError}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleConfirmDialogClose}
            color="inherit"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={deleting || !password || confirmText !== 'ELIMINAR'}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <X weight="bold" />}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {deleting ? 'Eliminando...' : 'Eliminar definitivamente'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar de notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}