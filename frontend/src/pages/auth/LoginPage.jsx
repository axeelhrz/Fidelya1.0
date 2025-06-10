import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Slide, Backdrop, Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleRounded, RocketLaunchRounded } from '@mui/icons-material';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import LoginForm from '../../components/auth/LoginForm';

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [welcomeSnackbar, setWelcomeSnackbar] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  const handleLoginSuccess = (user) => {
    setWelcomeUser(user.nombre);
    setWelcomeSnackbar(true);
    setIsRedirecting(true);
    
    // Redirigir al dashboard después de mostrar el mensaje
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <>
      <AuthFormWrapper
        title="¡Bienvenido de vuelta!"
        subtitle="Inicia sesión para acceder a tu panel de control"
      >
        <LoginForm 
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      </AuthFormWrapper>

      {/* Backdrop de redirección mejorado */}
      <AnimatePresence>
        {isRedirecting && (
          <Backdrop
            open={isRedirecting}
            sx={{
              zIndex: 9999,
              background: `
                linear-gradient(135deg, 
                  rgba(99, 102, 241, 0.95) 0%, 
                  rgba(139, 92, 246, 0.95) 50%,
                  rgba(16, 185, 129, 0.95) 100%
                )
              `,
              backdropFilter: 'blur(20px)',
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  p: 5,
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                  maxWidth: 400,
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      mb: 3,
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <CheckCircleRounded sx={{ fontSize: 60, color: 'white' }} />
                  </Box>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                    ¡Perfecto, {welcomeUser}!
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
                    Acceso concedido exitosamente
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 2,
                    p: 3,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <RocketLaunchRounded sx={{ fontSize: 24 }} />
                    </motion.div>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Redirigiendo al panel de control...
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence>

      {/* Notificación de bienvenida mejorada */}
      <Snackbar
        open={welcomeSnackbar}
        autoHideDuration={6000}
        onClose={() => setWelcomeSnackbar(false)}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 10000 }}
      >
        <Alert
          onClose={() => setWelcomeSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
            '& .MuiAlert-message': {
              fontWeight: 600,
              fontSize: '1rem',
            },
          }}
        >
          ¡Hola {welcomeUser}! Has iniciado sesión correctamente
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;