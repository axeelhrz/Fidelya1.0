'use client';

import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Stack, 
  Button, 
  TextField, 
  Avatar, 
  useTheme, 
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  User, 
  PencilSimple, 
  Camera, 
  X, 
  Check, 
  Envelope, 
  IdentificationCard 
} from 'phosphor-react';
import { useSettings } from '@/hooks/use-settings';
import { useAuth } from '@/hooks/use-auth';

export default function ProfileTab() {
  const theme = useTheme();
  const { user } = useAuth();
  const { 
    profileSettings, 
    saveProfileSettings, 
    uploadAvatar, 
    deleteAvatar, 
    changeEmail,
    loading 
  } = useSettings();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profileSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Manejar cambios en los campos
  const handleChange = (field: keyof typeof editedProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Abrir diálogo de edición
  const handleEditClick = () => {
    setEditedProfile(profileSettings);
    setIsEditing(true);
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  // Guardar cambios
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await saveProfileSettings(editedProfile);
      setIsEditing(false);
      setSnackbarMessage('Perfil actualizado correctamente');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbarMessage('Error al actualizar el perfil');
      setSnackbarSeverity('error');
    } finally {
      setSaving(false);
      setSnackbarOpen(true);
    }
  };
  
  // Manejar clic en botón de avatar
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  // Manejar cambio de avatar
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingAvatar(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      setEditedProfile(prev => ({
        ...prev,
        avatarUrl
      }));
      setSnackbarMessage('Avatar actualizado correctamente');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setSnackbarMessage('Error al subir el avatar');
      setSnackbarSeverity('error');
    } finally {
      setUploadingAvatar(false);
      setSnackbarOpen(true);
    }
  };
  
  // Eliminar avatar
  const handleDeleteAvatar = async () => {
    setUploadingAvatar(true);
    try {
      await deleteAvatar();
      setEditedProfile(prev => ({
        ...prev,
        avatarUrl: ''
      }));
      setSnackbarMessage('Avatar eliminado correctamente');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      setSnackbarMessage('Error al eliminar el avatar');
      setSnackbarSeverity('error');
    } finally {
      setUploadingAvatar(false);
      setSnackbarOpen(true);
    }
  };
  
  // Abrir diálogo de cambio de email
  const handleEmailDialogOpen = () => {
    setNewEmail(user?.email || '');
    setPassword('');
    setEmailDialogOpen(true);
  };
  
  // Cerrar diálogo de cambio de email
  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false);
  };
  
  // Cambiar email
  const handleChangeEmail = async () => {
    setChangingEmail(true);
    try {
      await changeEmail(password, newEmail);
      handleEmailDialogClose();
      setSnackbarMessage('Email actualizado. Por favor, verifica tu nuevo correo electrónico.');
      setSnackbarSeverity('success');
    } catch (error: unknown) {
      console.error('Error changing email:', error);
      setSnackbarMessage(error instanceof Error ? error.message : 'Error al cambiar el email');
      setSnackbarSeverity('error');
    } finally {
      setChangingEmail(false);
      setSnackbarOpen(true);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando información de perfil...</Typography>
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
        Información personal
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
          {/* Avatar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={editedProfile.avatarUrl || ''}
                alt={`${profileSettings.firstName} ${profileSettings.lastName}`}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
              >
                {!editedProfile.avatarUrl && (
                  <User weight="bold" size={48} />
                )}
              </Avatar>
              
              {isEditing && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <IconButton 
                    size="small" 
                    onClick={handleAvatarClick}
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark
                      }
                    }}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Camera weight="bold" size={16} />
                    )}
                  </IconButton>
                  
                  {editedProfile.avatarUrl && (
                    <IconButton 
                      size="small" 
                      onClick={handleDeleteAvatar}
                      sx={{ 
                        bgcolor: theme.palette.error.main,
                        color: 'white',
                        '&:hover': {
                          bgcolor: theme.palette.error.dark
                        }
                      }}
                      disabled={uploadingAvatar}
                    >
                      <X weight="bold" size={16} />
                    </IconButton>
                  )}
                </Box>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Box>
          </Box>
          
          {/* Información personal */}
          {!isEditing ? (
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={2} alignItems="center">
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
                    <IdentificationCard weight="duotone" size={24} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nombre completo
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {profileSettings.firstName} {profileSettings.lastName}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Box>
                <Stack direction="row" spacing={2} alignItems="center">
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
                    <Envelope weight="duotone" size={24} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Correo electrónico
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user?.email}
                      {!user?.emailVerified && (
                        <Typography 
                          component="span" 
                          variant="caption" 
                          sx={{ 
                            ml: 1, 
                            color: theme.palette.warning.main,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px'
                          }}
                        >
                          No verificado
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Biografía
                </Typography>
                <Typography variant="body1">
                  {profileSettings.bio || 'No has añadido una biografía.'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEmailDialogOpen}
                    startIcon={<Envelope weight="bold" />}
                    sx={{ 
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cambiar email
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditClick}
                    startIcon={<PencilSimple weight="bold" />}
                    sx={{ 
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Editar perfil
                  </Button>
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Nombre"
                  value={editedProfile.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
                <TextField
                  label="Apellido"
                  value={editedProfile.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Stack>
              
              <TextField
                label="Biografía"
                value={editedProfile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                placeholder="Cuéntanos sobre ti..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancelEdit}
                    startIcon={<X weight="bold" />}
                    sx={{ 
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Check weight="bold" />}
                    sx={{ 
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}
        </Stack>
      </Card>
      
      {/* Diálogo para cambiar email */}
      <Dialog 
        open={emailDialogOpen} 
        onClose={handleEmailDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Sora', fontWeight: 600 }}>
          Cambiar correo electrónico
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Para cambiar tu correo electrónico, necesitarás confirmar tu contraseña actual y verificar el nuevo correo.
            </Typography>
            
            <TextField
              label="Nuevo correo electrónico"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
              variant="outlined"
              type="email"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            
            <TextField
              label="Contraseña actual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              type="password"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleEmailDialogClose}
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
            onClick={handleChangeEmail}
            variant="contained"
            color="primary"
            disabled={changingEmail || !newEmail || !password}
            startIcon={changingEmail ? <CircularProgress size={20} color="inherit" /> : <Check weight="bold" />}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {changingEmail ? 'Cambiando...' : 'Cambiar email'}
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