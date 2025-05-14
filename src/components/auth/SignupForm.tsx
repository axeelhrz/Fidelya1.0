'use client';

import { useState } from 'react';
import { Box, TextField, Typography, Alert, Link as MuiLink } from '@mui/material';
import { useAuth } from './AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      // Redirect will be handled by the protected route component
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
        Crear Cuenta
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Nombre"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        margin="normal"
      />

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

      <TextField
        label="Confirmar Contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        size="large"
        fullWidth
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      <Typography variant="body2" align="center">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" passHref>
          <MuiLink underline="hover" color="primary">
            Inicia sesión
          </MuiLink>
        </Link>
      </Typography>
    </Box>
  );
};

export default SignupForm;