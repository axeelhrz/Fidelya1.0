'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Container,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, Psychology } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      
      // Manejar errores específicos de Firebase
      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          setError('No existe una cuenta con este email.');
          break;
        case 'auth/wrong-password':
          setError('Contraseña incorrecta.');
          break;
        case 'auth/invalid-email':
          setError('Email inválido.');
          break;
        case 'auth/user-disabled':
          setError('Esta cuenta ha sido deshabilitada.');
          break;
        case 'auth/too-many-requests':
          setError('Demasiados intentos fallidos. Intenta más tarde.');
          break;
        default:
          setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

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

        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" textAlign="center" mb={3}>
              Iniciar Sesión
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                autoComplete="email"
                autoFocus
              />

              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <Box textAlign="center">
                <Link href="/auth/forgot-password">
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                    ¿Olvidaste tu contraseña?
                  </Typography>
                </Link>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿No tienes cuenta?
                </Typography>
              </Divider>

              <Link href="/auth/sign-up">
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                >
                  Crear Cuenta
                </Button>
              </Link>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
          © 2024 Centro Psicológico. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
}
