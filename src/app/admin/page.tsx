'use client';

import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Contraseña estática para simular login
    if (password === 'admin123') {
      router.push('/admin/dashboard');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        p: 2
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          width: '100%' 
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Acceso al Panel de Administración
        </Typography>
        
        <Box component="form" sx={{ mt: 3 }} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            Ingresar
          </Button>
          
          <Button 
            fullWidth 
            variant="text" 
            onClick={() => router.push('/')}
          >
            Volver al Inicio
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}