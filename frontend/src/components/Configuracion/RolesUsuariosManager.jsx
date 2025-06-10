import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Alert,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';
import {
  People as PeopleIcon,
  VpnKey as VpnKeyIcon,
  PersonAdd as PersonAddIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import configuracionService from '../../services/configuracionService';

const RolesUsuariosManager = ({ onSuccess, onError }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await configuracionService.obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      onError('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarRol = async (usuario, nuevoRol) => {
    if (usuario.id === currentUser.id) {
      onError('No puedes cambiar tu propio rol');
      return;
    }

    try {
      setLoading(true);
      await configuracionService.cambiarRolUsuario(usuario.id, nuevoRol);
      onSuccess(`Rol de ${usuario.nombre} cambiado a ${nuevoRol}`);
      await cargarUsuarios();
    } catch (error) {
      onError(error.message || 'Error cambiando rol de usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleActivarDesactivar = async (usuario, activo) => {
    if (usuario.id === currentUser.id) {
      onError('No puedes desactivar tu propia cuenta');
      return;
    }

    try {
      setLoading(true);
      await configuracionService.activarDesactivarUsuario(usuario.id, activo);
      const accion = activo ? 'activado' : 'desactivado';
      onSuccess(`Usuario ${usuario.nombre} ${accion} exitosamente`);
      await cargarUsuarios();
    } catch (error) {
      onError(error.message || 'Error cambiando estado de usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPasswordDialog = (usuario) => {
    setSelectedUser(usuario);
    setNewPassword('');
    setPasswordDialogOpen(true);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      onError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await configuracionService.resetearPasswordUsuario(selectedUser.id, newPassword);
      onSuccess(`Contraseña de ${selectedUser.nombre} reseteada exitosamente`);
      setPasswordDialogOpen(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch (error) {
      onError(error.message || 'Error reseteando contraseña');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PeopleIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          Gestión de Usuarios y Roles
        </Typography>
      </Box>

      {/* Información de roles */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Administrador</Typography>
            </Box>
            <Typography variant="body2">
              Acceso completo al sistema, puede modificar configuraciones y gestionar usuarios.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonAddIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Operador</Typography>
            </Box>
            <Typography variant="body2">
              Puede gestionar inventario, ventas, compras y generar reportes.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <VpnKeyIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Cajero</Typography>
            </Box>
            <Typography variant="body2">
              Puede realizar ventas, facturación y cierre de caja.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla de usuarios */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Registro</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {usuario.nombre}
                    {usuario.id === currentUser.id && (
                      <Chip label="Tú" size="small" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {usuario.correo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={usuario.rol}
                      onChange={(e) => handleCambiarRol(usuario, e.target.value)}
                      disabled={usuario.id === currentUser.id || loading}
                    >
                      <MenuItem value="admin">Administrador</MenuItem>
                      <MenuItem value="operador">Operador</MenuItem>
                      <MenuItem value="cajero">Cajero</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={usuario.activo}
                        onChange={(e) => handleActivarDesactivar(usuario, e.target.checked)}
                        disabled={usuario.id === currentUser.id || loading}
                      />
                    }
                    label={usuario.activo ? 'Activo' : 'Inactivo'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {usuario.creado ? new Date(usuario.creado).toLocaleDateString() : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenPasswordDialog(usuario)}
                    color="primary"
                    disabled={loading}
                    title="Resetear contraseña"
                  >
                    <VpnKeyIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Información adicional */}
      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Importante:</strong><br/>
          • No puedes cambiar tu propio rol o desactivar tu cuenta<br/>
          • Los cambios de rol se aplican inmediatamente<br/>
          • Los usuarios inactivos no pueden iniciar sesión<br/>
          • Al resetear una contraseña, el usuario deberá usar la nueva contraseña en su próximo inicio de sesión
        </Typography>
      </Alert>

      {/* Dialog para resetear contraseña */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Resetear Contraseña - {selectedUser?.nombre}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            El usuario deberá usar esta nueva contraseña en su próximo inicio de sesión.
          </Alert>
          <TextField
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            helperText="Mínimo 6 caracteres"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleResetPassword} 
            variant="contained" 
            disabled={loading || !newPassword || newPassword.length < 6}
          >
            {loading ? 'Reseteando...' : 'Resetear Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesUsuariosManager;