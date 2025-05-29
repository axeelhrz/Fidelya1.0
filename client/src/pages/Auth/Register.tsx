import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Container,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Card sx={{ maxWidth: 400, mx: 'auto' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  FruteriaApp
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Crear Cuenta
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    autoFocus
                  />

                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />

                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />

                  <TextField
                    fullWidth
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </Stack>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{ textDecoration: 'none' }}
                  >
                    Inicia sesión aquí
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Register;