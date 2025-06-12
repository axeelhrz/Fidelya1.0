import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Tune as TuneIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Importar componentes de configuración
import ConfigImpuestos from '../components/Configuracion/ConfigImpuestos';
import DatosFruteriaForm from '../components/Configuracion/DatosFruteriaForm';
import CategoriasManager from '../components/Configuracion/CategoriasManager';
import RolesUsuariosManager from '../components/Configuracion/RolesUsuariosManager';
import ParametrosSistema from '../components/Configuracion/ParametrosSistema';

const Configuracion = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar permisos de administrador
  useEffect(() => {
    if (user && user.rol !== 'admin') {
      setError('No tienes permisos para acceder a esta sección');
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleSuccess = (message) => {
    setSuccess(message);
    setError('');
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleError = (message) => {
    setError(message);
    setSuccess('');
  };

  // Si no es admin, mostrar mensaje de error
  if (user && user.rol !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          No tienes permisos para acceder a la configuración del sistema.
          Solo los administradores pueden modificar estos ajustes.
        </Alert>
      </Container>
    );
  }

  const tabs = [
    {
      label: 'Impuestos',
      icon: <ReceiptIcon />,
      component: <ConfigImpuestos onSuccess={handleSuccess} onError={handleError} />
    },
    {
      label: 'Datos del Negocio',
      icon: <BusinessIcon />,
      component: <DatosFruteriaForm onSuccess={handleSuccess} onError={handleError} />
    },
    {
      label: 'Categorías',
      icon: <CategoryIcon />,
      component: <CategoriasManager onSuccess={handleSuccess} onError={handleError} />
    },
    {
      label: 'Usuarios y Roles',
      icon: <PeopleIcon />,
      component: <RolesUsuariosManager onSuccess={handleSuccess} onError={handleError} />
    },
    {
      label: 'Parámetros',
      icon: <TuneIcon />,
      component: <ParametrosSistema onSuccess={handleSuccess} onError={handleError} />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">Configuración</Typography>
      </Breadcrumbs>

      {/* Título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Configuración del Sistema
        </Typography>
      </Box>

      {/* Alertas */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Loading */}
      {/* Contenido principal */}
      <Paper sx={{ width: '100%' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Contenido de las tabs */}
        <Box sx={{ p: 3 }}>
          {tabs[tabValue]?.component}
        </Box>
      </Paper>

      {/* Información adicional */}
      <Paper sx={{ mt: 3, p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          ℹ️ Información Importante
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Los cambios en la configuración se aplican inmediatamente al sistema<br/>
          • Solo los administradores pueden modificar estos ajustes<br/>
          • El porcentaje de IVA se aplicará automáticamente a nuevas ventas y facturas<br/>
          • Los cambios en categorías afectarán los reportes y filtros del sistema<br/>
          • Ten cuidado al modificar roles de usuarios activos
        </Typography>
      </Paper>
    </Container>
  );
};

export default Configuracion;