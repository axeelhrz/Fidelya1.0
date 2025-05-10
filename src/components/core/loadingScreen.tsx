'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  delay?: number; // Retraso antes de mostrar en ms
  showLogo?: boolean;
}

export default function LoadingScreen({
  message = 'Cargando...',
  fullScreen = false,
  delay = 500,
  showLogo = true,
}: LoadingScreenProps) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) {
    return null;
  }

  return (
    <Fade in={show}>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        sx={{
          height: fullScreen ? '100vh' : '100%',
          minHeight: fullScreen ? undefined : 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: fullScreen ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme.zIndex.modal,
          backgroundColor: fullScreen
            ? alpha(theme.palette.background.default, 0.95)
            : 'transparent',
          backdropFilter: fullScreen ? 'blur(6px)' : 'none',
        }}
      >
        {showLogo && (
          <Box
            component={motion.div}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{ mb: 4 }}
          >
            {/* Aquí puedes poner tu logo */}
            <Box
              component="img"
              src="/logos/logo.png" // Asegúrate de tener tu logo en esta ruta
              alt="Logo"
              sx={{
                width: 64,
                height: 64,
                // Si no tienes logo, puedes ocultarlo
                display: 'none', // Quita esta línea cuando tengas tu logo
              }}
            />
          </Box>
        )}

        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
        </Box>

        <Box sx={{ textAlign: 'center', maxWidth: 300 }}>
          <Typography
            variant="h6"
            component={motion.h6}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {message}
          </Typography>

          <Typography
            variant="body2"
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3 }}
            color="textSecondary"
          >
            Por favor, espera un momento mientras cargamos tu contenido.
          </Typography>
        </Box>

        {/* Dots animation */}
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            mt: 3,
          }}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
              }}
            />
          ))}
        </Box>
      </Box>
    </Fade>
  );
}

// Componente de ejemplo de uso con mensaje personalizado
export function CustomLoadingScreen() {
  return (
    <LoadingScreen
      message="Actualizando suscripción..."
      fullScreen={false}
      delay={0}
      showLogo={true}
    />
  );
}

// Componente de ejemplo de uso a pantalla completa
export function FullScreenLoading() {
  return (
    <LoadingScreen
      message="Iniciando aplicación..."
      fullScreen={true}
      delay={1000}
      showLogo={true}
    />
  );
}