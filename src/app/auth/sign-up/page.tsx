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
  Container,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, Psychology } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

const steps = ['Información Básica', 'Información Profesional', 'Confirmación'];

export default function SignUpPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: '',
    role: 'psychologist' as UserRole,
    centerId: 'demo-center', // Por ahora usamos un centro demo
    specialization: '',
    licenseNumber: '',
    emergencyContact: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.email && formData.password && formData.confirmPassword && 
                 formData.displayName && formData.password === formData.confirmPassword);
      case 1:
        if (formData.role === 'psychologist') {
          return !!(formData.specialization && formData.licenseNumber);
        }
        return true;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
    } else {
      setError('Por favor completa todos los campos requeridos.');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        role: formData.role,
        centerId: formData.centerId,
        phone: formData.phone,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        emergencyContact: formData.emergencyContact,
      });
      
      router.push('/auth/verify-email');
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      
      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setError('Ya existe una cuenta con este email.');
          break;
        case 'auth/weak-password':
          setError('La contraseña debe tener al menos 6 caracteres.');
          break;
        case 'auth/invalid-email':
          setError('Email inválido.');
          break;
        default:
          setError('Error al crear la cuenta. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Nombre completo"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              margin="normal"
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              margin="normal"
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

            <TextField
              fullWidth
              label="Confirmar contraseña"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              margin="normal"
              error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
              helperText={
                formData.confirmPassword !== '' && formData.password !== formData.confirmPassword
                  ? 'Las contraseñas no coinciden'
                  : ''
              }
            />
          </>
        );

      case 1:
        return (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                label="Rol"
              >
                <MenuItem value="psychologist">Psicólogo</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            {formData.role === 'psychologist' && (
              <>
                <TextField
                  fullWidth
                  label="Especialización"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  required
                  margin="normal"
                  placeholder="Ej: Psicología Clínica, Terapia Familiar..."
                />

                <TextField
                  fullWidth
                  label="Número de licencia"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  required
                  margin="normal"
                />
              </>
            )}
          </>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirma tu información
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Nombre:</strong> {formData.displayName}</Typography>
              <Typography><strong>Email:</strong> {formData.email}</Typography>
              <Typography><strong>Teléfono:</strong> {formData.phone}</Typography>
              <Typography><strong>Rol:</strong> {formData.role === 'psychologist' ? 'Psicólogo' : 'Administrador'}</Typography>
              {formData.role === 'psychologist' && (
                <>
                  <Typography><strong>Especialización:</strong> {formData.specialization}</Typography>
                  <Typography><strong>Licencia:</strong> {formData.licenseNumber}</Typography>
                </>
              )}
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Se enviará un email de verificación a tu dirección de correo.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
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

        <Card sx={{ width: '100%', maxWidth: 600 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" textAlign="center" mb={3}>
              Crear Cuenta
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box>
              {renderStepContent(activeStep)}

              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Atrás
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!validateStep(activeStep)}
                  >
                    Siguiente
                  </Button>
                )}
              </Box>
            </Box>

            <Box textAlign="center" mt={3}>
              <Link href="/auth/sign-in">
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Typography>
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
