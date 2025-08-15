import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from 'notistack';

interface SignInData {
  email: string;
  password: string;
  remember?: boolean;
}

interface UseSignInReturn {
  isLoading: boolean;
  error: string | null;
  signIn: (data: SignInData) => Promise<void>;
  clearError: () => void;
}

export const useSignIn = (): UseSignInReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
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
        case 401:
          return 'Credenciales incorrectas. Verifica tu email y contraseña.';
        case 422:
          return 'Los datos proporcionados no son válidos.';
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

  const signIn = async (data: SignInData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the existing login function from AuthContext
      await login({
        email: data.email.trim(),
        password: data.password,
      });

      // Show success message
      enqueueSnackbar('¡Bienvenido de vuelta!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        autoHideDuration: 3000,
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

      console.error('Sign in error:', err);
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
    signIn,
    clearError,
  };
};