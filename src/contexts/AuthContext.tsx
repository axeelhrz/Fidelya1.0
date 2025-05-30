'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  requireAuth: (action: () => void | Promise<void>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'admin123';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void | Promise<void>) | null>(null);

  const login = useCallback(async (password: string): Promise<boolean> => {
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const requireAuth = useCallback(async (action: () => void | Promise<void>) => {
    if (isAuthenticated) {
      await action();
    } else {
      setPendingAction(() => action);
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = useCallback(async () => {
    setShowLoginModal(false);
    if (pendingAction) {
      await pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleLoginCancel = useCallback(() => {
    setShowLoginModal(false);
    setPendingAction(null);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    requireAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showLoginModal && (
        <AuthModal
          onSuccess={handleLoginSuccess}
          onCancel={handleLoginCancel}
          login={login}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente modal de autenticación
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface AuthModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  login: (password: string) => Promise<boolean>;
}

const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onCancel, login }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const success = await login(password);
      if (success) {
        onSuccess();
      } else {
        setError('Contraseña incorrecta');
        setPassword('');
      }
    } catch (error) {
      setError('Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(44, 44, 46, 0.95) 0%, rgba(28, 28, 30, 0.9) 100%)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #74ACDF 0%, #5a9bd4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <AdminIcon sx={{ fontSize: 32, color: '#FFFFFF' }} />
          </Box>
        </motion.div>
        
        <Typography variant="h5" fontWeight={600} sx={{ color: '#F5F5F7', mb: 1 }}>
          Autenticación Requerida
        </Typography>
        <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
          Ingresa la contraseña de administrador para continuar
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Contraseña de administrador"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#A1A1AA' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                    sx={{ color: '#A1A1AA' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderColor: '#74ACDF',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#A1A1AA',
              },
              '& .MuiOutlinedInput-input': {
                color: '#F5F5F7',
              },
            }}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#F87171',
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#71717A',
                fontSize: '0.75rem'
              }}
            >
              💡 Contraseña: <code style={{ 
                backgroundColor: 'rgba(116, 172, 223, 0.1)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                color: '#74ACDF'
              }}>admin123</code>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={onCancel}
            disabled={loading}
            sx={{ color: '#A1A1AA' }}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !password.trim()}
            sx={{
              background: '#74ACDF',
              '&:hover': { background: '#5a9bd4' },
              '&:disabled': {
                background: 'rgba(116, 172, 223, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};