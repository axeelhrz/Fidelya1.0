import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [welcomeSnackbar, setWelcomeSnackbar] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState('');

  const handleLoginSuccess = (user) => {
    setWelcomeUser(user.nombre);
    setWelcomeSnackbar(true);
    // Redirigir al dashboard después de mostrar el mensaje
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <>
      <AuthFormWrapper
        title="Iniciar Sesión"
        subtitle="Accede a tu cuenta para gestionar tu frutería"
      >
        <LoginForm 
          onSwitchToRegister={onSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      </AuthFormWrapper>

      {/* Snackbar de bienvenida */}
      <Snackbar
        open={welcomeSnackbar}
        autoHideDuration={3000}
        onClose={() => setWelcomeSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setWelcomeSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          ¡Bienvenido/a de vuelta, {welcomeUser}! Redirigiendo al dashboard...
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;