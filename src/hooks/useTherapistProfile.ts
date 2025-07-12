'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface TherapistProfileData {
  // Información personal
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  
  // Información profesional
  specialties: string[];
  licenseNumber: string;
  experience: number;
  education: string[];
  bio: string;
  languages: string[];
  
  // Avatar
  avatarUrl?: string;
  
  // Preferencias
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  darkMode: boolean;
  language: string;
  
  // Seguridad
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface ProfileUpdateData {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  specialties?: string[];
  licenseNumber?: string;
  experience?: number;
  education?: string[];
  bio?: string;
  languages?: string[];
  notifications?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  darkMode?: boolean;
  language?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useTherapistProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<TherapistProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Cargar datos del perfil
  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular carga de datos desde Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockProfileData: TherapistProfileData = {
        fullName: user?.name || 'Dra. Ana García',
        email: user?.email || 'ana.garcia@centropsicologico.com',
        phone: user?.phone || '+34 612 345 678',
        dateOfBirth: '1985-03-15',
        gender: 'female',
        specialties: user?.therapistInfo?.specialties || ['Psicología Clínica', 'Terapia Cognitivo-Conductual', 'Ansiedad'],
        licenseNumber: user?.therapistInfo?.license || 'PSY-12345-ES',
        experience: user?.therapistInfo?.experience || 8,
        education: user?.therapistInfo?.education || [
          'Licenciatura en Psicología - Universidad Complutense Madrid',
          'Máster en Psicología Clínica - Universidad Autónoma Barcelona',
          'Especialización en TCC - Instituto Beck'
        ],
        bio: 'Psicóloga clínica especializada en trastornos de ansiedad y depresión. Con más de 8 años de experiencia ayudando a pacientes a superar sus desafíos emocionales mediante terapia cognitivo-conductual.',
        languages: ['Español', 'Inglés', 'Catalán'],
        avatarUrl: undefined,
        notifications: {
          email: true,
          sms: false,
          whatsapp: true
        },
        darkMode: false,
        language: 'es',
        emailVerified: true,
        twoFactorEnabled: false
      };

      setProfileData(mockProfileData);
    } catch (err) {
      setError('Error al cargar los datos del perfil');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = async (updateData: ProfileUpdateData): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // Simular actualización en Firebase
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (profileData) {
        const updatedProfile = {
          ...profileData,
          ...updateData
        };
        setProfileData(updatedProfile);
      }

      return true;
    } catch (err) {
      setError('Error al actualizar el perfil');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'therapist') {
      loadProfileData();
    }
  }, [user, loadProfileData]);

  const changePassword = async (passwordData: PasswordChangeData): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // Validaciones
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (passwordData.newPassword.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 2000));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setError(errorMessage);
      console.error('Error changing password:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    try {
      setUploadingAvatar(true);
      setError(null);

      // Validar archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('El archivo no puede ser mayor a 5MB');
      }

      // Simular subida a Firebase Storage
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAvatarUrl = URL.createObjectURL(file);
      
      if (profileData) {
        setProfileData({
          ...profileData,
          avatarUrl: mockAvatarUrl
        });
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(errorMessage);
      console.error('Error uploading avatar:', err);
      return false;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // Simular eliminación en Firebase Storage
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (profileData) {
        setProfileData({
          ...profileData,
          avatarUrl: undefined
        });
      }

      return true;
    } catch (err) {
      setError('Error al eliminar la imagen');
      console.error('Error removing avatar:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const sendEmailVerification = async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // Simular envío de email de verificación
      await new Promise(resolve => setTimeout(resolve, 1500));

      return true;
    } catch (err) {
      setError('Error al enviar el email de verificación');
      console.error('Error sending verification email:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleTwoFactor = async (enable: boolean): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);

      // Simular configuración de 2FA
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (profileData) {
        setProfileData({
          ...profileData,
          twoFactorEnabled: enable
        });
      }

      return true;
    } catch (err) {
      setError('Error al configurar la autenticación de dos factores');
      console.error('Error toggling 2FA:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    profileData,
    loading,
    saving,
    error,
    uploadingAvatar,
    updateProfile,
    changePassword,
    uploadAvatar,
    removeAvatar,
    sendEmailVerification,
    toggleTwoFactor,
    clearError: () => setError(null)
  };
}
