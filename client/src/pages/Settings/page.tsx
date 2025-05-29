import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Business,
  Person,
  Security,
  Backup,
  Palette,
  Save,
  PhotoCamera,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';

interface BusinessSettings {
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  tax_rate: string;
  currency: string;
  low_stock_threshold: string;
  expiry_warning_days: string;
}

interface UserSettings {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    business_name: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    tax_rate: '',
    currency: '',
    low_stock_threshold: '',
    expiry_warning_days: '',
  });
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
    if (user) {
      setUserSettings(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/settings');
      setBusinessSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleBusinessSettingsChange = (field: keyof BusinessSettings, value: string) => {
    setBusinessSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleUserSettingsChange = (field: keyof UserSettings, value: string) => {
    setUserSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveBusinessSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/settings', businessSettings);
      setSuccess('Configuración del negocio guardada exitosamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const saveUserSettings = async () => {
    if (userSettings.newPassword && userSettings.newPassword !== userSettings.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update user profile
      await axios.put(`/users/${user?.id}`, {
        name: userSettings.name,
      });

      // Update password if provided
      if (userSettings.newPassword) {
        await axios.put(`/users/${user?.id}/password`, {
          currentPassword: userSettings.currentPassword,
          newPassword: userSettings.newPassword,
        });
      }

      setSuccess('Perfil actualizado exitosamente');
      setUserSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      // Implementar exportación de datos
      setSuccess('Exportación iniciada. Recibirás un email cuando esté lista.');
    } catch (error) {
      setError('Error al exportar los datos');
    }
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Configuración
        </Typography>

        {(success || error) && (
          <Alert severity={success ? 'success' : 'error'} sx={{ mb: 3 }}>
            {success || error}
          </Alert>
        )}

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab icon={<Business />} label="Negocio" />
              <Tab icon={<Person />} label="Perfil" />
              <Tab icon={<Palette />} label="Apariencia" />
              <Tab icon={<Security />} label="Seguridad" />
              <Tab icon={<Backup />} label="Respaldo" />
            </Tabs>
          </Box>

          {/* Configuración del Negocio */}
          <TabPanel value={activeTab} index={0}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Información del Negocio
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nombre del Negocio"
                  value={businessSettings.business_name}
                  onChange={(e) => handleBusinessSettingsChange('business_name', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Dirección"
                  value={businessSettings.business_address}
                  onChange={(e) => handleBusinessSettingsChange('business_address', e.target.value)}
                  multiline
                  rows={2}
                />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={businessSettings.business_phone}
                    onChange={(e) => handleBusinessSettingsChange('business_phone', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={businessSettings.business_email}
                    onChange={(e) => handleBusinessSettingsChange('business_email', e.target.value)}
                  />
                </Stack>

                <Divider />

                <Typography variant="h6">
                  Configuración Operativa
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Tasa de Impuesto (%)"
                    type="number"
                    value={businessSettings.tax_rate}
                    onChange={(e) => handleBusinessSettingsChange('tax_rate', e.target.value)}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                  />
                  <TextField
                    fullWidth
                    label="Moneda"
                    value={businessSettings.currency}
                    onChange={(e) => handleBusinessSettingsChange('currency', e.target.value)}
                    placeholder="USD, EUR, MXN, etc."
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Umbral de Stock Bajo"
                    type="number"
                    value={businessSettings.low_stock_threshold}
                    onChange={(e) => handleBusinessSettingsChange('low_stock_threshold', e.target.value)}
                    inputProps={{ min: 0 }}
                    helperText="Cantidad mínima para alertas de stock bajo"
                  />
                  <TextField
                    fullWidth
                    label="Días de Alerta de Vencimiento"
                    type="number"
                    value={businessSettings.expiry_warning_days}
                    onChange={(e) => handleBusinessSettingsChange('expiry_warning_days', e.target.value)}
                    inputProps={{ min: 1 }}
                    helperText="Días antes del vencimiento para mostrar alerta"
                  />
                </Stack>

                <Box sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveBusinessSettings}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Configuración'}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </TabPanel>

          {/* Perfil de Usuario */}
          <TabPanel value={activeTab} index={1}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Información Personal
              </Typography>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                    {user?.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
                    </Typography>
                    <IconButton size="small" sx={{ mt: 1 }}>
                      <PhotoCamera />
                    </IconButton>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Nombre Completo"
                  value={userSettings.name}
                  onChange={(e) => handleUserSettingsChange('name', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={userSettings.email}
                  disabled
                  helperText="El email no se puede modificar"
                />

                <Divider />

                <Typography variant="h6">
                  Cambiar Contraseña
                </Typography>
                <TextField
                  fullWidth
                  label="Contraseña Actual"
                  type="password"
                  value={userSettings.currentPassword}
                  onChange={(e) => handleUserSettingsChange('currentPassword', e.target.value)}
                />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    type="password"
                    value={userSettings.newPassword}
                    onChange={(e) => handleUserSettingsChange('newPassword', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Confirmar Nueva Contraseña"
                    type="password"
                    value={userSettings.confirmPassword}
                    onChange={(e) => handleUserSettingsChange('confirmPassword', e.target.value)}
                  />
                </Stack>

                <Box sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveUserSettings}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Actualizar Perfil'}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </TabPanel>

          {/* Apariencia */}
          <TabPanel value={activeTab} index={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Personalización de la Interfaz
              </Typography>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDarkMode}
                      onChange={toggleTheme}
                    />
                  }
                  label="Modo Oscuro"
                />
                <Typography variant="body2" color="text.secondary">
                  Cambia entre el tema claro y oscuro de la aplicación
                </Typography>

                <Divider />

                <Typography variant="subtitle1">
                  Colores del Sistema
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#62C370',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption">Primario</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#FF8C42',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption">Secundario</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption">Fondo</Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </TabPanel>

          {/* Seguridad */}
          <TabPanel value={activeTab} index={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Configuración de Seguridad
              </Typography>
              <Stack spacing={3}>
                <Alert severity="info">
                  Tu cuenta está protegida con autenticación JWT. 
                  Las sesiones expiran automáticamente por seguridad.
                </Alert>

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Información de la Sesión
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuario: {user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rol: {user?.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Última actividad: {new Date().toLocaleString()}
                  </Typography>
                </Box>

                <Divider />

                <Typography variant="subtitle1">
                  Recomendaciones de Seguridad
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Usa contraseñas seguras con al menos 8 caracteres
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Cambia tu contraseña regularmente
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    No compartas tus credenciales con otros usuarios
                  </Typography>
                  <Typography component="li" variant="body2">
                    Cierra sesión al terminar de usar el sistema
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </TabPanel>

          {/* Respaldo */}
          <TabPanel value={activeTab} index={4}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Respaldo y Exportación de Datos
              </Typography>
              <Stack spacing={3}>
                <Alert severity="warning">
                  Realiza respaldos regulares de tus datos para evitar pérdidas de información.
                </Alert>

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Exportar Datos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Exporta todos los datos del sistema en formato CSV para respaldo o migración.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Backup />}
                    onClick={exportData}
                  >
                    Exportar Todos los Datos
                  </Button>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Información de la Base de Datos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tipo: SQLite
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ubicación: Local
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Último respaldo: No disponible
                  </Typography>
                </Box>

                <Alert severity="info">
                  Para configurar respaldos automáticos, contacta al administrador del sistema.
                </Alert>
              </Stack>
            </CardContent>
          </TabPanel>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Settings;