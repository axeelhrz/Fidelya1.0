'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterForm, ApiResponse, User, RoleInfo, AvailableLeague, AvailableClub } from '@/types';

interface SignUpResponse {
  user: User;
  role_info: RoleInfo;
}

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const signUp = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the data for the API
      const apiData = {
        role: data.role,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone: data.phone,
        country: data.country,
      };

      // Add role-specific fields
      switch (data.role) {
        case 'liga':
          Object.assign(apiData, {
            league_name: data.league_name,
            province: data.province,
            logo_path: data.logo_path,
          });
          break;
        case 'club':
          Object.assign(apiData, {
            club_name: data.club_name,
            parent_league_id: data.parent_league_id,
            city: data.city,
            address: data.address,
            logo_path: data.logo_path,
          });
          break;
        case 'miembro':
          Object.assign(apiData, {
            full_name: data.full_name,
            parent_club_id: data.parent_club_id,
            birth_date: data.birth_date,
            gender: data.gender,
            rubber_type: data.rubber_type,
            ranking: data.ranking,
            photo_path: data.photo_path,
          });
          break;
      }

      const response = await axios.post<ApiResponse<SignUpResponse>>('/auth/register', apiData);
      
      if (response.data?.data?.user) {
        // Update auth context with the new user
        login(response.data.data.user);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Respuesta del servidor inválida');
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError[0] || 'Error de validación');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error al crear la cuenta. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    signUp,
    isLoading,
    error,
    clearError,
  };
};

// Hook for getting available leagues
export const useAvailableLeagues = () => {
  const [leagues, setLeagues] = useState<AvailableLeague[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeagues = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<ApiResponse<AvailableLeague[]>>('/auth/leagues');
      setLeagues(response.data.data || []);
    } catch (err: any) {
      console.error('Error fetching leagues:', err);
      setError('Error al cargar las ligas disponibles');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    leagues,
    isLoading,
    error,
    fetchLeagues,
  };
};

// Hook for getting available clubs
export const useAvailableClubs = () => {
  const [clubs, setClubs] = useState<AvailableClub[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = async (leagueId?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = leagueId ? { league_id: leagueId } : {};
      const response = await axios.get<ApiResponse<AvailableClub[]>>('/auth/clubs', { params });
      setClubs(response.data.data || []);
    } catch (err: any) {
      console.error('Error fetching clubs:', err);
      setError('Error al cargar los clubes disponibles');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clubs,
    isLoading,
    error,
    fetchClubs,
  };
};