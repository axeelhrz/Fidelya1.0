'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Stack,
  Alert,
  Container,
  IconButton,
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const MotionPaper = motion(Paper);
const MotionContainer = motion(Container);
export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulamos un pequeño retraso para dar feedback visual
    await new Promise(resolve => setTimeout(resolve, 800));

    // Contraseña estática para simular login
    if (password === 'admin123') {
      localStorage.setItem('admin-authenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Contraseña incorrecta');
      setIsLoading(false);
    }
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    }
  };

  return (
    <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
            display: 'flex',
            alignItems: 'center',
                  justifyContent: 'center',
      p: 2,
    }}>
      <MotionContainer 
        maxWidth="sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
              >
        <MotionPaper
          variants={itemVariants}
          elevation={8}
                    sx={{ 
            p: 4,
                    borderRadius: 3,
            background: 'linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
          <Stack spacing={3} alignItems="center">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 1 }}>
                Panel de Administración
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Ingresa tu contraseña para acceder
              </Typography>
              </motion.div>
            <motion.form 
              variants={itemVariants}
              onSubmit={handleLogin}
              style={{ width: '100%' }}
            >
              <Stack spacing={3}>
                <TextField
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    }
                  }}
                />

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading || !password}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(59, 130, 246, 0.3)',
                    }
                  }}
                >
                  {isLoading ? 'Verificando...' : 'Ingresar'}
                </Button>
              </Stack>
            </motion.form>

            <motion.div variants={itemVariants}>
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Contraseña por defecto: admin123
              </Typography>
            </motion.div>
          </Stack>
        </MotionPaper>
      </MotionContainer>
    </Box>
  );
}