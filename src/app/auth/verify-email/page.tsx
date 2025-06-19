'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress,
  Divider,
} from '@mui/material';
import { 
  Psychology, 
  MarkEmailRead, 
  Email, 
  CheckCircle, 
  Error as ErrorIcon 
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';

type VerificationState = 'loading' | 'success' | 'error' | 'expired' | 'invalid' | 'pending';

function VerifyEmailContent() {
  const [verificationState, setVerificationState] = useState<VerificationState>('loading');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { user, sendEmailVerification, authStatus } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    const verifyEmail = async () => {
      // Si hay un código de verificación en la URL, procesarlo
      if (oobCode && mode === 'verifyEmail') {
        try {
          // Verificar que el código sea válido
          await checkActionCode(auth, oobCode);
          
          // Aplicar el código de verificación
          await applyActionCode(auth, oobCode);
          
          setVerificationState('success');
          
          // Redirigir al dashboard después de 3 segundos
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
          
        } catch (error: unknown) {
          console.error('Email verification error:', error);
          
          const firebaseError = error as { code?: string };
          switch (firebaseError.code) {
            case 'auth/expired-action-code':
              setVerificationState('expired');
              setError('El enlace de verificación ha expirado.');
              break;
            case 'auth/invalid-action-code':
              setVerificationState('invalid');
              setError('El enlace de verificación es inválido.');
              break;
            case 'auth/user-disabled':
              setVerificationState('error');
              setError('Esta cuenta ha sido deshabilitada.');
              break;
            default:
              setVerificationState('error');
              setError('Error al verificar el email. Intenta nuevamente.');
          }
        }
      } else {
        // Si no hay código, mostrar estado pendiente
        setVerificationState('pending');
      }
    };

    verifyEmail();
  }, [oobCode, mode, router]);

  // Countdown para reenvío de email
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    if (!user || countdown > 0) return;
    
    setResendLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      await sendEmailVerification();
      setResendSuccess(true);
      setCountdown(60); // 60 segundos de espera
    } catch (error: unknown) {
      console.error('Resend verification error:', error);
      
      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case 'auth/too-many-requests':
          setError('Demasiados intentos. Espera un momento antes de intentar nuevamente.');
          setCountdown(120); // 2 minutos de espera
          break;
        default:
          setError('Error al enviar el email de verificación. Intenta nuevamente.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleGoToSignIn = () => {
    router.push('/auth/sign-in');
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Verificando email...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Por favor espera mientras procesamos tu verificación.
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box textAlign="center">
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h5" gutterBottom color="success.main">
              ¡Email verificado exitosamente!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Tu cuenta ha sido verificada correctamente. Serás redirigido al dashboard en unos segundos.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGoToDashboard}
              startIcon={<Psychology />}
            >
              Ir al Dashboard
            </Button>
          </Box>
        );

      case 'expired':
      case 'invalid':
        return (
          <Box textAlign="center">
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            <Typography variant="h6" gutterBottom color="error.main">
              {verificationState === 'expired' ? 'Enlace expirado' : 'Enlace inválido'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {error}
            </Typography>
            
            {user && !user.emailVerified && (
              <>
                <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                  Puedes solicitar un nuevo enlace de verificación.
                </Alert>
                
                {resendSuccess && (
                  <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                    ¡Email de verificación enviado! Revisa tu bandeja de entrada.
                  </Alert>
                )}
                
                <Button
                  variant="contained"
                  onClick={handleResendVerification}
                  disabled={resendLoading || countdown > 0}
                  startIcon={resendLoading ? <CircularProgress size={20} /> : <Email />}
                  sx={{ mb: 2 }}
                >
                  {countdown > 0 
                    ? `Reenviar en ${countdown}s` 
                    : resendLoading 
                      ? 'Enviando...' 
                      : 'Reenviar verificación'
                  }
                </Button>
              </>
            )}
            
            <Box>
              <Button
                variant="outlined"
                onClick={handleGoToSignIn}
                sx={{ ml: 1 }}
              >
                Volver al inicio de sesión
              </Button>
            </Box>
          </Box>
        );

      case 'error':
        return (
          <Box textAlign="center">
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            <Typography variant="h6" gutterBottom color="error.main">
              Error de verificación
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleGoToSignIn}
            >
              Volver al inicio de sesión
            </Button>
          </Box>
        );

      case 'pending':
      default:
        return (
          <Box textAlign="center">
            <MarkEmailRead sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Verifica tu email
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {user?.email ? (
                <>
                  Hemos enviado un enlace de verificación a <strong>{user.email}</strong>.
                  Haz clic en el enlace para verificar tu cuenta.
                </>
              ) : (
                'Revisa tu bandeja de entrada y haz clic en el enlace de verificación.'
              )}
            </Typography>

            {user && !user.emailVerified && (
              <>
                <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="body2">
                    <strong>¿No recibiste el email?</strong>
                    <br />
                    • Revisa tu carpeta de spam
                    <br />
                    • Asegúrate de que el email sea correcto
                    <br />
                    • Puedes solicitar un nuevo enlace
                  </Typography>
                </Alert>

                {resendSuccess && (
                  <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                    ¡Email de verificación enviado! Revisa tu bandeja de entrada.
                  </Alert>
                )}

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  variant="contained"
                  onClick={handleResendVerification}
                  disabled={resendLoading || countdown > 0}
                  startIcon={resendLoading ? <CircularProgress size={20} /> : <Email />}
                  sx={{ mb: 2 }}
                >
                  {countdown > 0 
                    ? `Reenviar en ${countdown}s` 
                    : resendLoading 
                      ? 'Enviando...' 
                      : 'Reenviar verificación'
                  }
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    o
                  </Typography>
                </Divider>
              </>
            )}

            <Button
              variant="outlined"
              onClick={handleGoToSignIn}
              fullWidth
            >
              Volver al inicio de sesión
            </Button>
          </Box>
        );
    }
  };

  // Si el usuario ya está verificado, redirigir al dashboard
  useEffect(() => {
    if (authStatus === 'authenticated' && user?.emailVerified && verificationState === 'pending') {
      router.push('/dashboard');
    }
  }, [authStatus, user, verificationState, router]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        py={4}
      >
        {/* Logo y título */}
        <Box display="flex" alignItems="center" mb={4}>
          <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Centro Psicológico
          </Typography>
        </Box>

        <Card sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            {renderContent()}
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
          © 2024 Centro Psicológico. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
}

function LoadingFallback() {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        py={4}
      >
        <Box display="flex" alignItems="center" mb={4}>
          <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Centro Psicológico
          </Typography>
        </Box>

        <Card sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center">
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Cargando...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preparando la verificación de email.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}