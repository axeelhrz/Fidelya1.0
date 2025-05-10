import { useState, useEffect, useCallback, useMemo } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  updateEmail, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  sendEmailVerification
} from 'firebase/auth';
import { db, auth, storage } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { debounce } from 'lodash';

export interface AppearanceSettings {
  darkMode: boolean;
  primaryColor: string;
  font: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  vencimiento: boolean;
  nuevaPoliza: boolean;
  pago: boolean;
}

export interface AISettings {
  suggestTasks: boolean;
  smartAlerts: boolean;
  autoEmails: boolean;
}

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string;
}

export interface GeneralPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

// Hook principal para configuraciones
export function useSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    darkMode: false,
    primaryColor: '#3f51b5',
    font: 'Sora',
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    vencimiento: true,
    nuevaPoliza: true,
    pago: true,
  });
  
  const [aiSettings, setAISettings] = useState<AISettings>({
    suggestTasks: false,
    smartAlerts: false,
    autoEmails: false,
  });
  
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    firstName: '',
    lastName: '',
    bio: '',
    avatarUrl: '',
  });
  
  const [generalPreferences, setGeneralPreferences] = useState<GeneralPreferences>({
    language: 'es-ES',
    timezone: 'America/Argentina/Buenos_Aires',
    dateFormat: 'DD/MM/YYYY',
    currency: 'ARS',
  });

  // Cargar configuraciones
  useEffect(() => {
    async function loadSettings() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Cargar configuración de apariencia
          if (userData.appearanceSettings) {
            setAppearanceSettings(userData.appearanceSettings);
          }
          
          // Cargar configuración de notificaciones
          if (userData.notifications) {
            setNotificationSettings(userData.notifications);
          }
          
          // Cargar configuración de IA
          if (userData.aiSettings) {
            setAISettings(userData.aiSettings);
          }
          
          // Cargar configuración de perfil
          setProfileSettings({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            bio: userData.bio || '',
            avatarUrl: userData.avatarUrl || '',
          });
          
          // Cargar preferencias generales
          if (userData.generalPreferences) {
            setGeneralPreferences(userData.generalPreferences);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar configuraciones:', err);
        setError('No se pudieron cargar las configuraciones. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, [user]);

  // Guardar configuración de apariencia con debounce
  const saveAppearanceSettings = useCallback(async (settings: AppearanceSettings) => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        appearanceSettings: settings,
      });
    } catch (err) {
      console.error('Error al guardar configuración de apariencia:', err);
      setError('No se pudo guardar la configuración de apariencia.');
    }
  }, [user, setError]);

  // Debounced version of saveAppearanceSettings
  const debouncedSaveAppearanceSettings = useMemo(
    () => debounce(saveAppearanceSettings, 500),
    [saveAppearanceSettings]
  );

  // Actualizar configuración de apariencia
  const updateAppearanceSettings = useCallback((settings: Partial<AppearanceSettings>) => {
    setAppearanceSettings(prev => {
      const newSettings = { ...prev, ...settings };
      debouncedSaveAppearanceSettings(newSettings);
      return newSettings;
    });
  }, [debouncedSaveAppearanceSettings]);

  // Guardar configuración de notificaciones
  const saveNotificationSettings = useCallback(async (settings: NotificationSettings) => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        notifications: settings,
      });
      setError(null);
      return true;
    } catch (err) {
      console.error('Error al guardar configuración de notificaciones:', err);
      setError('No se pudo guardar la configuración de notificaciones.');
      return false;
    }
  }, [user]);

  // Actualizar configuración de notificaciones
  const updateNotificationSettings = useCallback((settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => {
      const newSettings = { ...prev, ...settings };
      return newSettings;
    });
  }, []);

  // Guardar configuración de IA
  const saveAISettings = useCallback(async (settings: AISettings) => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        aiSettings: settings,
      });
      setError(null);
      return true;
    } catch (err) {
      console.error('Error al guardar configuración de IA:', err);
      setError('No se pudo guardar la configuración de IA.');
      return false;
    }
  }, [user]);

  // Actualizar configuración de IA
  const updateAISettings = useCallback((settings: Partial<AISettings>) => {
    setAISettings(prev => {
      const newSettings = { ...prev, ...settings };
      return newSettings;
    });
  }, []);

  // Guardar configuración de perfil
  const saveProfileSettings = useCallback(async (settings: ProfileSettings) => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        firstName: settings.firstName,
        lastName: settings.lastName,
        bio: settings.bio,
        avatarUrl: settings.avatarUrl,
      });
      setError(null);
      return true;
    } catch (err) {
      console.error('Error al guardar configuración de perfil:', err);
      setError('No se pudo guardar la configuración de perfil.');
      return false;
    }
  }, [user]);
  
  // Guardar preferencias generales
  const saveGeneralPreferences = useCallback(async (preferences: GeneralPreferences) => {
    if (!user) return false;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        generalPreferences: preferences,
      });
      setError(null);
      return true;
    } catch (err) {
      console.error('Error al guardar preferencias generales:', err);
      setError('No se pudieron guardar las preferencias generales.');
      return false;
    }
  }, [user]);

  // Actualizar preferencias generales
  const updateGeneralPreferences = useCallback((preferences: Partial<GeneralPreferences>) => {
    setGeneralPreferences(prev => {
      const newPreferences = { ...prev, ...preferences };
      return newPreferences;
    });
  }, []);

  // Subir avatar
  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      const storageRef = ref(storage, `users/${user.uid}/avatar.jpg`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Actualizar URL en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        avatarUrl: downloadUrl,
      });
      
      return downloadUrl;
    } catch (err) {
      console.error('Error al subir avatar:', err);
      throw new Error('No se pudo subir la imagen de perfil.');
    }
  }, [user]);

  // Eliminar avatar
  const deleteAvatar = useCallback(async (): Promise<void> => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      const storageRef = ref(storage, `users/${user.uid}/avatar.jpg`);
      await deleteObject(storageRef);
      
      // Actualizar URL en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        avatarUrl: '',
      });
      
      setProfileSettings(prev => ({
        ...prev,
        avatarUrl: '',
      }));
    } catch (err) {
      console.error('Error al eliminar avatar:', err);
      throw new Error('No se pudo eliminar la imagen de perfil.');
    }
  }, [user]);

  // Cambiar contraseña
  const changePassword = useCallback(async (
    currentPassword: string, 
    newPassword: string
  ): Promise<void> => {
    if (!user || !auth.currentUser || !user.email) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Cambiar contraseña
      await updatePassword(auth.currentUser, newPassword);
    } catch (err: unknown) {
      console.error('Error al cambiar contraseña:', err);
      if (typeof err === 'object' && err !== null && 'code' in err && err.code === 'auth/wrong-password') {
        throw new Error('La contraseña actual es incorrecta.');
      } else {
        throw new Error('No se pudo cambiar la contraseña. Inténtalo de nuevo más tarde.');
      }
    }
  }, [user]);

  // Cambiar email
  const changeEmail = useCallback(async (
    currentPassword: string, 
    newEmail: string
  ): Promise<void> => {
    if (!user || !auth.currentUser || !user.email) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Cambiar email
      await updateEmail(auth.currentUser, newEmail);
      
      // Enviar email de verificación
      await sendEmailVerification(auth.currentUser);
      
      // Actualizar en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        email: newEmail,
        emailVerified: false,
      });
    } catch (err: unknown) {
      console.error('Error al cambiar email:', err);
      if (typeof err === 'object' && err !== null && 'code' in err) {
        if (err.code === 'auth/wrong-password') {
          throw new Error('La contraseña es incorrecta.');
        } else if (err.code === 'auth/email-already-in-use') {
          throw new Error('Este correo electrónico ya está en uso.');
        } else {
          throw new Error('No se pudo cambiar el correo electrónico. Inténtalo de nuevo más tarde.');
        }
      }
    }
  }, [user]);

  // Activar autenticación de dos factores
  const enable2FA = useCallback(async (): Promise<string> => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      // Aquí iría la lógica para generar un QR de 2FA
      // Como Firebase no tiene 2FA nativo, esto sería una implementación personalizada
      // Por ahora, simulamos que devolvemos una URL de QR
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Assuriva:${user.email}?secret=JBSWY3DPEHPK3PXP&issuer=Assuriva`;
      
      // Actualizar en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        has2FA: true,
      });
      
      return qrCodeUrl;
    } catch (err) {
      console.error('Error al activar 2FA:', err);
      throw new Error('No se pudo activar la autenticación de dos factores.');
    }
  }, [user]);

  // Desactivar autenticación de dos factores
  const disable2FA = useCallback(async (password: string): Promise<void> => {
    if (!user || !auth.currentUser || !user.email) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Actualizar en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        has2FA: false,
      });
    } catch (err: unknown) {
      console.error('Error al desactivar 2FA:', err);
      if (typeof err === 'object' && err !== null && 'code' in err && err.code === 'auth/wrong-password') {
        throw new Error('La contraseña es incorrecta.');
      } else {
        throw new Error('No se pudo desactivar la autenticación de dos factores.');
      }
    }
  }, [user]);

  // Eliminar cuenta
  const deleteAccount = useCallback(async (password: string): Promise<void> => {
    if (!user || !auth.currentUser || !user.email) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      // Reautenticar usuario
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Eliminar datos en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        isDeleted: true,
        deletedAt: new Date(),
      });
      
      // Eliminar cuenta de autenticación
      await auth.currentUser.delete();
    } catch (err: unknown) {
      console.error('Error al eliminar cuenta:', err);
      if (typeof err === 'object' && err !== null && 'code' in err && err.code === 'auth/wrong-password') {
        throw new Error('La contraseña es incorrecta.');
      } else {
        throw new Error('No se pudo eliminar la cuenta. Inténtalo de nuevo más tarde.');
      }
    }
  }, [user]);

  return {
    loading,
    error,
    
    // Apariencia
    appearanceSettings,
    updateAppearanceSettings,
    saveAppearanceSettings,
    
    // Notificaciones
    notificationSettings,
    updateNotificationSettings,
    saveNotificationSettings,
    
    // IA
    aiSettings,
    updateAISettings,
    saveAISettings,
    
    // Perfil
    profileSettings,
    saveProfileSettings,
    uploadAvatar,
    deleteAvatar,
    
    // Preferencias generales
    generalPreferences,
    updateGeneralPreferences,
    saveGeneralPreferences,
    
    // Seguridad
    changePassword,
    changeEmail,
    enable2FA,
    disable2FA,
    deleteAccount,
  };
}

// Hook específico para preferencias generales
export function useGeneralPreferences() {
  const { 
    generalPreferences, 
    updateGeneralPreferences, 
    saveGeneralPreferences, 
    loading, 
    error 
  } = useSettings();

  return {
    generalPreferences,
    updateGeneralPreferences,
    saveGeneralPreferences,
    loading,
    error
  };
}