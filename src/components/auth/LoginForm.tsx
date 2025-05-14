'use client';

import { useState } from 'react';
import { Box, TextField, Typography, Alert, Link as MuiLink } from '@mui/material';
import { useAuth } from './AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      // Redirect will be handled by the protected route component
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
        Iniciar Sesión
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        margin="normal"
      />

      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
      />

      <Box sx={{ mt: 1, mb: 3, textAlign: 'right' }}>
        <Link href="/reset-password" passHref>
          <MuiLink underline="hover" color="primary">
            ¿Olvidaste tu contraseña?
          </MuiLink>
        </Link>
      </Box>

      <Button
        component="button"
        type="submit"
        variant="contained"
        color="secondary"
        size="large"
        fullWidth
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      <Typography variant="body2" align="center">
        ¿No tienes una cuenta?{' '}
        <Link href="/signup" passHref>
          <MuiLink underline="hover" color="primary">
            Regístrate
          </MuiLink>
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;