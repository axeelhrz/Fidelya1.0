'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Container,
  Paper,
  Stack,
  Collapse,
  alpha,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Home as HomeIcon,
  ContactSupport as SupportIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

interface ErrorScreenProps {
  message?: string;
  error?: Error;
  fullScreen?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showSupportButton?: boolean;
  onRetry?: () => void;
}

export default function ErrorScreen({
  message = 'Ha ocurrido un error inesperado',
  error,
  fullScreen = false,
  showHomeButton = true,
  showRefreshButton = true,
  showSupportButton = true,
  onRetry,
}: ErrorScreenProps) {
  const theme = useTheme();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleContactSupport = () => {
    // Implementar lógica para contactar soporte
    window.open('/ayuda', '_blank');
  };

  return (
    <Container maxWidth="sm">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          minHeight: fullScreen ? '100vh' : 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            width: '100%',
            backgroundColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.8)
              : theme.palette.background.paper,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Stack spacing={3} alignItems="center">
            {/* Icono de Error Animado */}
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: theme.palette.error.main,
                  mb: 2,
                }}
              />
            </Box>

            {/* Mensaje de Error */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h5"
                component={motion.h5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                ¡Ups! Algo salió mal
              </Typography>
              <Typography
                color="text.secondary"
                component={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {message}
              </Typography>
            </Box>

            {/* Detalles del Error (Expandible) */}
            {error && (
              <Box sx={{ width: '100%' }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowDetails(!showDetails)}
                  endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
                </Button>
                <Collapse in={showDetails}>
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 1,
                      p: 2,
                      backgroundColor: alpha(theme.palette.error.main, 0.05),
                      borderColor: alpha(theme.palette.error.main, 0.1),
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: theme.palette.error.main,
                        m: 0,
                      }}
                    >
                      {error.message}
                      {error.stack && (
                        <>
                          {'\n\n'}
                          {error.stack}
                        </>
                      )}
                    </Typography>
                  </Paper>
                </Collapse>
              </Box>
            )}

            {/* Botones de Acción */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              {showRefreshButton && (
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    minWidth: 140,
                  }}
                >
                  Intentar de nuevo
                </Button>
              )}

              {showHomeButton && (
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={handleGoHome}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    minWidth: 140,
                  }}
                >
                  Ir al inicio
                </Button>
              )}

              {showSupportButton && (
                <Button
                  variant="text"
                  startIcon={<SupportIcon />}
                  onClick={handleContactSupport}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    minWidth: 140,
                  }}
                >
                  Contactar soporte
                </Button>
              )}
            </Stack>

            {/* Mensaje de Ayuda */}
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              Si el problema persiste, por favor contacta con nuestro equipo de soporte.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

// Ejemplos de uso
export function NotFoundError() {
  return (
    <ErrorScreen
      message="La página que buscas no existe o ha sido movida."
      showRefreshButton={false}
    />
  );
}

export function NetworkError() {
  return (
    <ErrorScreen
      message="No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet."
      error={new Error('Network request failed')}
    />
  );
}

export function PermissionError() {
  return (
    <ErrorScreen
      message="No tienes permisos para acceder a este recurso."
      showRefreshButton={false}
      showHomeButton={true}
    />
  );
}