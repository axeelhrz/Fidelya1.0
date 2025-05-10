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
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Password, 
  DeviceMobile, 
  SignOut, 
  Check, 
  X, 
  Laptop, 
  Desktop 
} from 'phosphor-react';
import { useSettings } from '@/hooks/use-settings';

export default function SecurityTab() {
  const theme = useTheme();
  const { 
    changePassword, 
    enable2FA, 
    disable2FA, 
    loading 
  } = useSettings();
  
  const [has2FA, setHas2FA] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [twoFADialogOpen, setTwoFADialogOpen] = useState(false);
  const [disableTwoFADialogOpen, setDisableTwoFADialogOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [twoFAPassword, setTwoFAPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [enabling2FA, setEnabling2FA] = useState(false);
  const [disabling2FA, setDisabling2FA] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Dispositivos conectados (simulados)
  const connectedDevices = [
    { id: 1, name: 'MacBook Pro', type: 'laptop', lastActive: '2023-11-15T10:30:00Z', current: true },
    { id: 2, name: 'iPhone 13', type: 'mobile', lastActive: '2023-11-14T18:45:00Z', current: false },
    { id: 3, name: 'Windows PC', type: 'desktop', lastActive: '2023-11-10T09:15:00Z', current: false },
  ];
  
  // Abrir diálogo de cambio de contraseña
  const handlePasswordDialogOpen = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordDialogOpen(true);
  };
  
  // Cerrar diálogo de cambio de contraseña
  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };
  
  // Cambiar contraseña
  const handleChangePassword = async () => {
    // Validar contraseñas
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      handlePasswordDialogClose();
      setSnackbarMessage('Contraseña cambiada correctamente');
      setSnackbarSeverity('success');
    } catch (error: Error | unknown) {
      console.error('Error changing password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Error al cambiar la contraseña');
    } finally {
      setChangingPassword(false);
      setSnackbarOpen(true);
    }
  };
  
  // Abrir diálogo de activación de 2FA
  const handleTwoFADialogOpen = async () => {
    setEnabling2FA(true);
    try {
      const qrUrl = await enable2FA();
      setQrCodeUrl(qrUrl);
      setTwoFADialogOpen(true);
    } catch (error: Error | unknown) {
      console.error('Error enabling 2FA:', error);
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al activar la autenticación de dos factores');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setEnabling2FA(false);
    }
  };
  
  // Cerrar diálogo de activación de 2FA
  const handleTwoFADialogClose = () => {
    setTwoFADialogOpen(false);
  };
  
  // Confirmar activación de 2FA
  const handleConfirm2FA = () => {
    setHas2FA(true);
    handleTwoFADialogClose();
    setSnackbarMessage('Autenticación de dos factores activada correctamente');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  // Abrir diálogo de desactivación de 2FA
  const handleDisableTwoFADialogOpen = () => {
    setTwoFAPassword('');
    setDisableTwoFADialogOpen(true);
  };
  
  // Cerrar diálogo de desactivación de 2FA
  const handleDisableTwoFADialogClose = () => {
    setDisableTwoFADialogOpen(false);
  };
  
  // Desactivar 2FA
  const handleDisable2FA = async () => {
    setDisabling2FA(true);
    try {
      await disable2FA(twoFAPassword);
      setHas2FA(false);
      handleDisableTwoFADialogClose();
      setSnackbarMessage('Autenticación de dos factores desactivada correctamente');
      setSnackbarSeverity('success');
    } catch (error: Error | unknown) {
      console.error('Error disabling 2FA:', error);
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al desactivar la autenticación de dos factores');
      setSnackbarSeverity('error');
    } finally {
      setDisabling2FA(false);
      setSnackbarOpen(true);
    }
  };
  
  // Cerrar sesión en todos los dispositivos
  const handleSignOutAll = () => {
    // Aquí iría la lógica para cerrar sesión en todos los dispositivos
    // Por ahora, solo mostramos un mensaje
    setSnackbarMessage('Sesión cerrada en todos los dispositivos');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando configuración de seguridad...</Typography>
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
          mb: 2 
        }}
      >
        Seguridad
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
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Stack spacing={4}>
          {/* Cambiar contraseña */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 1, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  borderRadius: '10px', 
                  color: theme.palette.primary.main 
                }}
              >
                <Password weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Contraseña
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Cambia tu contraseña regularmente para mayor seguridad
                </Typography>
                
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlePasswordDialogOpen}
                  sx={{ 
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cambiar contraseña
                </Button>
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Autenticación de dos factores */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 1, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  borderRadius: '10px', 
                  color: theme.palette.primary.main 
                }}
              >
                <Shield weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Autenticación de dos factores
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Añade una capa extra de seguridad a tu cuenta
                </Typography>
                
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={has2FA} 
                        onChange={() => has2FA ? handleDisableTwoFADialogOpen() : handleTwoFADialogOpen()}
                        color="primary"
                        disabled={enabling2FA}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {has2FA ? 'Activado' : 'Desactivado'}
                      </Typography>
                    }
                  />
                  
                  {enabling2FA && (
                    <CircularProgress size={20} color="primary" />
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>
          
          <Divider />
          
          {/* Dispositivos conectados */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 1, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  borderRadius: '10px', 
                  color: theme.palette.primary.main 
                }}
              >
                <DeviceMobile weight="duotone" size={24} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Dispositivos conectados
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Gestiona los dispositivos que tienen acceso a tu cuenta
                </Typography>
                
                <List 
                  sx={{ 
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.background.default, 0.4) 
                      : alpha(theme.palette.background.default, 0.4),
                    borderRadius: '10px',
                    mb: 2
                  }}
                >
                  {connectedDevices.map((device) => (
                    <ListItem 
                      key={device.id}
                      sx={{ 
                        borderBottom: device.id !== connectedDevices.length ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                        py: 1.5
                      }}
                    >
                      <Box 
                        sx={{ 
                          mr: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          p: 1, 
                          bgcolor: alpha(theme.palette.primary.main, 0.1), 
                          borderRadius: '8px', 
                          color: theme.palette.primary.main 
                        }}
                      >
                        {device.type === 'laptop' && <Laptop weight="duotone" size={20} />}
                        {device.type === 'mobile' && <DeviceMobile weight="duotone" size={20} />}
                        {device.type === 'desktop' && <Desktop weight="duotone" size={20} />}
                      </Box>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {device.name}
                            {device.current && (
                              <Typography 
                                component="span" 
                                variant="caption" 
                                sx={{ 
                                  ml: 1, 
                                  color: theme.palette.success.main,
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: '4px'
                                }}
                              >
                                Actual
                              </Typography>
                            )}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Último acceso: {formatDate(device.lastActive)}
                          </Typography>
                        }
                      />
                      {!device.current && (
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            size="small"
                            sx={{ 
                              color: theme.palette.error.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.1)
                              }
                            }}
                          >
                            <SignOut weight="bold" size={16} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
                
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleSignOutAll}
                  startIcon={<SignOut weight="bold" />}
                  sx={{ 
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cerrar sesión en todos los dispositivos
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Card>
      
      {/* Diálogo para cambiar contraseña */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handlePasswordDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Sora', fontWeight: 600 }}>
          Cambiar contraseña
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Para cambiar tu contraseña, introduce tu contraseña actual y la nueva contraseña.
            </Typography>
            
            <TextField
              label="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              variant="outlined"
              type="password"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            
            <TextField
              label="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              type="password"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            
            <TextField
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            onClick={handlePasswordDialogClose}
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
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
            startIcon={changingPassword ? <CircularProgress size={20} color="inherit" /> : <Check weight="bold" />}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {changingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para activar 2FA */}
      <Dialog 
        open={twoFADialogOpen} 
        onClose={handleTwoFADialogClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Sora', fontWeight: 600 }}>
          Activar autenticación de dos factores
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Escanea el código QR con una aplicación de autenticación como Google Authenticator o Authy.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Box 
                component="img" 
                src={qrCodeUrl} 
                alt="QR Code" 
                sx={{ 
                  width: 200, 
                  height: 200, 
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: '8px'
                }} 
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Después de escanear el código, introduce el código de verificación de 6 dígitos que aparece en la aplicación.
            </Typography>
            
            <TextField
              label="Código de verificación"
              placeholder="123456"
              fullWidth
              variant="outlined"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleTwoFADialogClose}
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
            onClick={handleConfirm2FA}
            variant="contained"
            color="primary"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Verificar y activar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para desactivar 2FA */}
      <Dialog 
        open={disableTwoFADialogOpen} 
        onClose={handleDisableTwoFADialogClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Sora', fontWeight: 600 }}>
          Desactivar autenticación de dos factores
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Para desactivar la autenticación de dos factores, introduce tu contraseña.
            </Typography>
            
            <TextField
              label="Contraseña"
              value={twoFAPassword}
              onChange={(e) => setTwoFAPassword(e.target.value)}
              fullWidth
              variant="outlined"
              type="password"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            
            <Typography variant="body2" color="error">
              Advertencia: Desactivar la autenticación de dos factores reducirá la seguridad de tu cuenta.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDisableTwoFADialogClose}
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
            onClick={handleDisable2FA}
            variant="contained"
            color="error"
            disabled={disabling2FA || !twoFAPassword}
            startIcon={disabling2FA ? <CircularProgress size={20} color="inherit" /> : <X weight="bold" />}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {disabling2FA ? 'Desactivando...' : 'Desactivar 2FA'}
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