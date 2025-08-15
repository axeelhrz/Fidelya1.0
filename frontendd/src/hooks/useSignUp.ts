import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from 'notistack';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'liga' | 'miembro' | 'club';
}

interface UseSignUpReturn {
  isLoading: boolean;
  error: string | null;
  signUp: (data: SignUpData) => Promise<void>;
  clearError: () => void;
}

export const useSignUp = (): UseSignUpReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const mapLaravelError = (error: any): string => {
    // Handle Laravel validation errors
    if (error?.response?.data?.errors) {
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0] as string[];
      return firstError[0] || 'Error de validación';
    }

    // Handle Laravel API errors
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    // Handle HTTP status codes
    if (error?.response?.status) {
      switch (error.response.status) {
        case 422:
          return 'Los datos proporcionados no son válidos.';
        case 409:
          return 'Ya existe una cuenta con este correo electrónico.';
        case 429:
          return 'Demasiados intentos. Inténtalo más tarde.';
        case 500:
          return 'Error del servidor. Inténtalo más tarde.';
        case 503:
          return 'Servicio no disponible. Inténtalo más tarde.';
        default:
          return 'Ha ocurrido un error inesperado.';
      }
    }

    // Network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }

    return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
  };

  const signUp = async (data: SignUpData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the existing register function from AuthContext
      await register({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
      });

      // Show success message
      enqueueSnackbar('¡Cuenta creada exitosamente! Bienvenido a Raquet Power.', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        autoHideDuration: 4000,
      });

      // Navigation is handled by the AuthContext
    } catch (err: any) {
      const errorMessage = mapLaravelError(err);
      setError(errorMessage);
      
      // Show error toast
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        autoHideDuration: 5000,
      });

      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    signUp,
    clearError,
  };
};