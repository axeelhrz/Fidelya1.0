// frontendd/src/hooks/useSignUp.ts

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from 'notistack';

interface SignUpData {
  role: 'liga' | 'miembro' | 'club';
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  country: string;
  
  // Campos específicos de Liga
  league_name?: string;
  province?: string;
  logo?: File;
  
  // Campos específicos de Club
  club_name?: string;
  league_id?: string;
  city?: string;
  address?: string;
  
  // Campos específicos de Miembro
  full_name?: string;
  club_id?: string;
  birth_date?: string;
  gender?: 'masculino' | 'femenino';
  rubber_type?: 'liso' | 'pupo' | 'ambos';
  ranking?: string;
  profile_photo?: File;
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

      // Preparar datos según el rol
      let registrationData: any = {
        email: data.email.trim(),
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone: data.phone.trim(),
        country: data.country.trim(),
        role: data.role,
      };

      // Agregar campos específicos según el rol
      switch (data.role) {
        case 'liga':
          registrationData = {
            ...registrationData,
            name: data.league_name?.trim(),
            league_name: data.league_name?.trim(),
            province: data.province?.trim(),
          };
          break;
          
        case 'club':
          registrationData = {
            ...registrationData,
            name: data.club_name?.trim(),
            club_name: data.club_name?.trim(),
            league_id: data.league_id,
            city: data.city?.trim(),
            address: data.address?.trim(),
          };
          break;
          
        case 'miembro':
          registrationData = {
            ...registrationData,
            name: data.full_name?.trim(),
            full_name: data.full_name?.trim(),
            club_id: data.club_id,
            birth_date: data.birth_date,
            gender: data.gender,
            rubber_type: data.rubber_type,
            ranking: data.ranking?.trim() || null,
          };
          break;
      }

      // Use the existing register function from AuthContext
      await register(registrationData);

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
