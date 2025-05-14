import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { logger } from '@/lib/logger';

export type UserProfile = {
  uid: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  phone?: string;
  photoURL?: string;
  company?: string;
  position?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    language?: string;
  };
  stats?: {
    totalPolicies?: number;
    totalCustomers?: number;
    totalRevenue?: number;
    activePolicies?: number;
    pendingPolicies?: number;
  };
  createdAt?: Timestamp | Date; // Timestamp
  updatedAt?: Timestamp | Date; // Timestamp
  lastLogin?: Timestamp | Date; // Timestamp
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
};

export type UpdateProfileData = Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>;

export const useUser = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Función para cargar el perfil del usuario
  const fetchUserProfile = useCallback(async () => {
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<UserProfile, 'uid'>;
        setProfile({
          uid: user.uid,
          ...userData
        });
      } else {
        // Si el documento no existe, creamos un perfil básico
        const basicProfile: UserProfile = {
          uid: user.uid,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          status: 'active',
          role: 'user',
          preferences: {
            theme: 'system',
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            language: 'es'
          },
          stats: {
            totalPolicies: 0,
            totalCustomers: 0,
            totalRevenue: 0,
            activePolicies: 0,
            pendingPolicies: 0
          }
        };
        
        setProfile(basicProfile);
        
        // Opcionalmente, podríamos guardar este perfil básico en Firestore
        // await setDoc(userDocRef, basicProfile);
      }
    } catch (err) {
      logger.error('Error fetching user profile:', err instanceof Error ? err : String(err));
      setError('No se pudo cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Suscripción a cambios en el perfil del usuario
  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as Omit<UserProfile, 'uid'>;
          setProfile({
            uid: user.uid,
            ...userData
          });
        } else {
          // Si no existe el documento, inicializamos el perfil con fetchUserProfile
          fetchUserProfile();
        }
        setLoading(false);
      },
      (err) => {
        logger.error('Error in user profile snapshot:', err instanceof Error ? err : String(err));
        setError('Error al suscribirse a los cambios del perfil');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, fetchUserProfile]);

  // Función para actualizar el perfil del usuario
  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    if (!user?.uid || !profile) {
      setUpdateError('Usuario no autenticado');
      return false;
    }

    try {
      setUpdating(true);
      setUpdateSuccess(false);
      setUpdateError(null);

      const userDocRef = doc(db, 'users', user.uid);
      
      // Añadir timestamp de actualización
      const updateData = {
        ...data,
        updatedAt: new Date()
      };
      
      await updateDoc(userDocRef, updateData);
      
      setUpdateSuccess(true);
      return true;
    } catch (err) {
      logger.error('Error updating user profile:', err instanceof Error ? err : String(err));
      setUpdateError('No se pudo actualizar el perfil');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Función para subir foto de perfil
  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    if (!user?.uid) {
      setUpdateError('Usuario no autenticado');
      return null;
    }

    try {
      setUpdating(true);
      setUpdateError(null);

      const storage = getStorage();
      const storageRef = ref(storage, `users/${user.uid}/profile-photo`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Actualizar el perfil con la nueva URL de la foto
      await updateProfile({ photoURL: downloadURL });
      
      return downloadURL;
    } catch (err) {
      logger.error('Error uploading profile photo:', err instanceof Error ? err : String(err));
      setUpdateError('No se pudo subir la foto de perfil');
      return null;
    } finally {
      setUpdating(false);
    }
  };

  // Función para actualizar las estadísticas del usuario
  const updateUserStats = async (stats: Partial<UserProfile['stats']>): Promise<boolean> => {
    if (!user?.uid || !profile) {
      return false;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      await updateDoc(userDocRef, {
        'stats': {
          ...profile.stats,
          ...stats
        },
        updatedAt: new Date()
      });
      
      return true;
    } catch (err) {
      logger.error('Error updating user stats:', err instanceof Error ? err : String(err));
      return false;
    }
  };

  // Función para actualizar las preferencias del usuario
  const updateUserPreferences = async (preferences: Partial<UserProfile['preferences']>): Promise<boolean> => {
    if (!user?.uid || !profile) {
      return false;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      await updateDoc(userDocRef, {
        'preferences': {
          ...profile.preferences,
          ...preferences
        },
        updatedAt: new Date()
      });
      
      return true;
    } catch (err) {
      logger.error('Error updating user preferences:', err instanceof Error ? err : String(err));
      return false;
    }
  };

  // Función para obtener el nombre completo del usuario
  const getFullName = (): string => {
    if (!profile) return '';
    return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
  };

  // Función para obtener las iniciales del usuario
  const getInitials = (): string => {
    if (!profile) return '';
    return `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Función para verificar si el perfil está completo
  const isProfileComplete = (): boolean => {
    if (!profile) return false;
    
    const requiredFields: (keyof UserProfile)[] = [
      'firstName',
      'lastName',
      'email',
      'phone'
    ];
    
    return requiredFields.every(field => !!profile[field]);
  };

  // Función para calcular el porcentaje de completitud del perfil
  const getProfileCompletionPercentage = (): number => {
    if (!profile) return 0;
    
    const fields: (keyof UserProfile)[] = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'company',
      'position',
      'bio',
      'address',
      'city',
      'country',
      'postalCode',
      'website',
      'photoURL'
    ];
    
    const completedFields = fields.filter(field => !!profile[field]);
    return Math.round((completedFields.length / fields.length) * 100);
  };

  return {
    profile,
    loading,
    error,
    updating,
    updateSuccess,
    updateError,
    updateProfile,
    uploadProfilePhoto,
    updateUserStats,
    updateUserPreferences,
    getFullName,
    getInitials,
    isProfileComplete,
    getProfileCompletionPercentage,
    refreshProfile: fetchUserProfile
  };
};