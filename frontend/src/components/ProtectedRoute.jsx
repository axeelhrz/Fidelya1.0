import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles si se especificaron
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.rol);
    
    if (!hasRequiredRole) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#f5f5f5',
          p: 3
        }}>
          <Alert 
            severity="error" 
            sx={{ 
              maxWidth: 600,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Acceso Denegado
            </Typography>
            <Typography variant="body1" gutterBottom>
              No tienes permisos para acceder a esta sección.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Se requiere uno de los siguientes roles: {requiredRoles.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tu rol actual: {user.rol}
            </Typography>
          </Alert>
        </Box>
      );
    }
  }

  // Renderizar el componente protegido
  return children;
};

export default ProtectedRoute;