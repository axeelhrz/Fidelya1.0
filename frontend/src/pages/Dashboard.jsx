import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Dashboard as DashboardIcon,
  Store,
  AttachMoney,
  Inventory
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await authService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🍎 Frutería Nina - Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={user?.rol || 'Usuario'}
              color="secondary"
              size="small"
            />
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.nombre?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          ¡Bienvenido, {user?.nombre}!
        </Typography>

        <Grid container spacing={3}>
          {/* Tarjetas de resumen */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Store sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" component="div">
                  Ventas Hoy
                </Typography>
                <Typography variant="h4" color="primary">
                  $1,250
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" component="div">
                  Ganancias
                </Typography>
                <Typography variant="h4" color="success.main">
                  $350
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Inventory sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" component="div">
                  Productos
                </Typography>
                <Typography variant="h4" color="warning.main">
                  45
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DashboardIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" component="div">
                  Órdenes
                </Typography>
                <Typography variant="h4" color="info.main">
                  12
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Panel de información */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Información del Sistema
              </Typography>
              <Typography variant="body1" paragraph>
                Bienvenido al sistema de gestión contable de Frutería Nina. 
                Desde aquí podrás administrar todas las operaciones de tu negocio.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usuario: {user?.correo} | Rol: {user?.rol} | 
                Última conexión: {new Date().toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;