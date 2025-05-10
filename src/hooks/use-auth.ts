import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { logger } from '@/lib/logger';

export type PlanStatus = 'active' | 'pending' | 'canceled' | 'trial' | 'expired';
export type UserRole = 'user' | 'admin' | 'superadmin';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  emailVerified: boolean;
  plan: string;
  planStatus: PlanStatus;
  planExpiresAt?: Timestamp;
  trialEndsAt?: Timestamp;
  verified: boolean;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  };
  metadata?: Record<string, unknown>;
}

export type AuthError = {
  code: string;
  message: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<boolean>(false);

  // Función para manejar errores de Firebase Auth
  const handleAuthError = (err: unknown): AuthError => {
    const firebaseError = err as { code?: string; message?: string };
    const errorCode = firebaseError.code || 'auth/unknown-error';
    let errorMessage = 'Error de autenticación desconocido';

    switch (errorCode) {
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Este email ya está en uso';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es demasiado débil';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde o restablece tu contraseña';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Esta operación es sensible y requiere autenticación reciente. Inicia sesión nuevamente antes de volver a intentarlo';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'Ya existe una cuenta con este email pero con un método de inicio de sesión diferente';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de red. Verifica tu conexión a internet';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Ventana emergente cerrada antes de completar la operación';
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'El dominio de la aplicación no está autorizado';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Esta operación no está permitida';
        break;
      default:
        errorMessage = firebaseError.message || 'Error de autenticación desconocido';
    }

    const authError: AuthError = {
      code: errorCode,
      message: errorMessage
    };

    setAuthError(authError);
    setError(errorMessage);
    logger.error('Auth error:', authError);

    return authError;
  };

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (!authUser) {
        setUserData(null);
        setLoading(false);
        setInitializing(false);
        return;
      }

      try {
        // Obtener datos del usuario desde Firestore
        const userDocRef = doc(db, 'users', authUser.uid);
        
        // Suscribirse a cambios en tiempo real
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              uid: authUser.uid,
              ...data
            } as UserData);
          } else {
            // Si el documento no existe, crear uno básico
            const newUserData: Partial<UserData> = {
              uid: authUser.uid,
              email: authUser.email || '',
              displayName: authUser.displayName || '',
              firstName: authUser.displayName?.split(' ')[0] || '',
              lastName: authUser.displayName?.split(' ').slice(1).join(' ') || '',
              photoURL: authUser.photoURL || '',
              emailVerified: authUser.emailVerified,
              plan: 'free',
              planStatus: 'trial',
              verified: false,
              role: 'user',
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              lastLoginAt: Timestamp.now(),
              notifications: {
                email: true,
                push: true,
                sms: false
              },
              preferences: {
                theme: 'system',
                language: 'es'
              }
            };
            
            // Crear el documento del usuario en Firestore
            setDoc(userDocRef, newUserData, { merge: true })
              .then(() => {
                setUserData({
                  ...newUserData,
                  uid: authUser.uid,
                  email: authUser.email || '',
                  emailVerified: authUser.emailVerified,
                } as UserData);
              })
              .catch((err) => {
                logger.error('Error creating user document:', err as Error);
                setError('Error al crear el documento del usuario');
              });
          }
          
          setLoading(false);
          setInitializing(false);
        }, (err) => {
          logger.error('Error al obtener datos del usuario:', err as Error);
          setError('Error al cargar datos del usuario');
          setLoading(false);
          setInitializing(false);
        });
        
        // Actualizar último inicio de sesión
        updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        }).catch((err) => {
          logger.error('Error updating last login:', err as Error);
        });
        
        return () => unsubscribeDoc();
      } catch (err) {
        logger.error('Error al configurar listener de Firestore:', err as Error);
        setError('Error al cargar datos del usuario');
        setLoading(false);
        setInitializing(false);
      }
    }, (err) => {
      logger.error('Error en onAuthStateChanged:', err as Error);
      setError('Error al verificar estado de autenticación');
      setLoading(false);
      setInitializing(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Iniciar sesión con email y contraseña
  const signIn = async (email: string, password: string): Promise<User | null> => {
    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Actualizar último inicio de sesión
      if (userCredential.user) {
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        }).catch((err) => {
          logger.error('Error updating last login:', err);
        });
      }
      
      setActionSuccess(true);
      return userCredential.user;
    } catch (err) {
      handleAuthError(err);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  // Registrar nuevo usuario
  const signUp = async (email: string, password: string, userData?: Partial<UserData>): Promise<User | null> => {
    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Crear documento del usuario en Firestore
      if (userCredential.user) {
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        
        // Datos básicos del usuario
        const newUserData: Partial<UserData> = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName || '',
          firstName: userData?.firstName || userCredential.user.displayName?.split(' ')[0] || '',
          lastName: userData?.lastName || userCredential.user.displayName?.split(' ').slice(1).join(' ') || '',
          photoURL: userCredential.user.photoURL || '',
          emailVerified: userCredential.user.emailVerified,
          plan: userData?.plan || 'free',
          planStatus: userData?.planStatus || 'trial',
          verified: false,
          role: 'user',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
          ...userData
        };
        
        await setDoc(userDocRef, newUserData);
        
        // Enviar email de verificación
        await sendEmailVerification(userCredential.user);
      }
      
      setActionSuccess(true);
      return userCredential.user;
    } catch (err) {
      handleAuthError(err);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  // Cerrar sesión
  const signOut = async (): Promise<boolean> => {
    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      
      await firebaseSignOut(auth);
      
      setActionSuccess(true);
      return true;
    } catch (err) {
      handleAuthError(err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Restablecer contraseña
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      await sendPasswordResetEmail(auth, email);
      
      setActionSuccess(true);
      return true;
    } catch (err) {
      handleAuthError(err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Enviar email de verificación
  const sendVerificationEmail = async (): Promise<boolean> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return false;
    }

    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      await sendEmailVerification(user);
      
      setActionSuccess(true);
      return true;
    } catch (err) {
      handleAuthError(err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Actualizar perfil básico
  const updateUserProfile = async (displayName?: string, photoURL?: string): Promise<boolean> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return false;
    }

    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      // Actualizar perfil en Firebase Auth
      await updateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL
      });
      
      // Actualizar datos en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      
      const updateData: Partial<UserData> = {
        displayName: displayName || user.displayName || undefined,
        photoURL: photoURL || user.photoURL || undefined,
        updatedAt: Timestamp.now()
      };
      
      // Si hay nombre completo, separarlo en nombre y apellido
      if (displayName) {
        const nameParts = displayName.split(' ');
        updateData.firstName = nameParts[0];
        updateData.lastName = nameParts.slice(1).join(' ');
      }
      
      await updateDoc(userDocRef, updateData);
      
      setActionSuccess(true);
      return true;
    } catch (err) {
      handleAuthError(err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Actualizar email
  const updateUserEmail = async (newEmail: string, password: string): Promise<boolean> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return false;
    }

    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      // Reautenticar al usuario
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      
      // Actualizar email en Firebase Auth
      await updateEmail(user, newEmail);
      
      // Actualizar email en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        email: newEmail,
        updatedAt: Timestamp.now()
      });
      
      // Enviar email de verificación
      await sendEmailVerification(user);
      
      setActionSuccess(true);
      return true;
    } catch (err) {
      handleAuthError(err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Actualizar contraseña
  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return false;
    }

    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      // Reautenticar al usuario
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Actualizar contraseña
      await updatePassword(user, newPassword);
      
      // Actualizar timestamp en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        updatedAt: Timestamp.now()
      });
      
      setActionSuccess(true);
      return true;
    } catch (err) {
      handleAuthError(err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Actualizar datos del usuario en Firestore
  const updateUserData = async (data: Partial<UserData>): Promise<boolean> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return false;
    }

    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      const userDocRef = doc(db, 'users', user.uid);
      
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      
      setActionSuccess(true);
      return true;
    } catch (err) {
      logger.error('Error updating user data:', err as Error);
      setError('Error al actualizar datos del usuario');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Actualizar plan del usuario
  const updateUserPlan = async (plan: string, status: PlanStatus, expiresAt?: Date): Promise<boolean> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return false;
    }

    try {
      setActionLoading(true);
      setError(null);
      setAuthError(null);
      setActionSuccess(false);
      
      const userDocRef = doc(db, 'users', user.uid);
      
      const updateData: Partial<UserData> = {
        plan,
        planStatus: status,
        updatedAt: Timestamp.now()
      };
      
      if (expiresAt) {
        updateData.planExpiresAt = Timestamp.fromDate(expiresAt);
      }
      
      await updateDoc(userDocRef, updateData);
      
      setActionSuccess(true);
      return true;
    } catch (err) {
      logger.error('Error updating user plan:', err as Error);
      setError('Error al actualizar el plan del usuario');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Verificar si el usuario tiene acceso al dashboard
  const hasAccessToDashboard = useCallback((): boolean => {
    if (!userData) return false;
    
    // Verificar si el email está verificado
    if (!userData.emailVerified) return false;
    
    // Verificar si el plan está activo o en período de prueba
    if (userData.planStatus !== 'active' && userData.planStatus !== 'trial') return false;
    
    // Si hay fecha de expiración del plan, verificar que no haya vencido
    if (userData.planExpiresAt) {
      const now = new Date();
      const expiresAt = userData.planExpiresAt.toDate();
      if (expiresAt < now) return false;
    }
    
    // Si hay fecha de fin de prueba, verificar que no haya vencido
    if (userData.planStatus === 'trial' && userData.trialEndsAt) {
      const now = new Date();
      const trialEndsAt = userData.trialEndsAt.toDate();
      if (trialEndsAt < now) return false;
    }
    
    return true;
  }, [userData]);

  // Verificar si el usuario tiene un plan activo
  const hasPlanActive = useCallback((): boolean => {
    if (!userData) return false;
    
    // Verificar si el plan está activo
    if (userData.planStatus !== 'active') return false;
    
    // Si hay fecha de expiración del plan, verificar que no haya vencido
    if (userData.planExpiresAt) {
      const now = new Date();
      const expiresAt = userData.planExpiresAt.toDate();
      if (expiresAt < now) return false;
    }
    
    return true;
  }, [userData]);

  // Verificar si el usuario está en período de prueba
  const isInTrialPeriod = useCallback((): boolean => {
    if (!userData) return false;
    
    // Verificar si el plan está en período de prueba
    if (userData.planStatus !== 'trial') return false;
    
    // Si hay fecha de fin de prueba, verificar que no haya vencido
    if (userData.trialEndsAt) {
      const now = new Date();
      const trialEndsAt = userData.trialEndsAt.toDate();
      if (trialEndsAt < now) return false;
    }
    
    return true;
  }, [userData]);

  // Obtener el plan actual del usuario
  const getCurrentPlan = useCallback((): string | null => {
    if (!userData) return null;
    return userData.plan;
  }, [userData]);

  // Obtener días restantes de prueba
  const getTrialDaysRemaining = useCallback((): number => {
    if (!userData || !userData.trialEndsAt || userData.planStatus !== 'trial') return 0;
    
    const now = new Date();
    const trialEndsAt = userData.trialEndsAt.toDate();
    
    if (trialEndsAt < now) return 0;
    
    const diffTime = Math.abs(trialEndsAt.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }, [userData]);

  // Obtener días restantes del plan
  const getPlanDaysRemaining = useCallback((): number => {
    if (!userData || !userData.planExpiresAt || userData.planStatus !== 'active') return 0;
    
    const now = new Date();
    const expiresAt = userData.planExpiresAt.toDate();
    
    if (expiresAt < now) return 0;
    
    const diffTime = Math.abs(expiresAt.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }, [userData]);

  // Verificar si el usuario es administrador
  const isAdmin = useCallback((): boolean => {
    if (!userData) return false;
    return userData.role === 'admin' || userData.role === 'superadmin';
  }, [userData]);

  // Verificar si el usuario es superadministrador
  const isSuperAdmin = useCallback((): boolean => {
    if (!userData) return false;
    return userData.role === 'superadmin';
  }, [userData]);

  // Obtener nombre completo del usuario
  const getFullName = useCallback((): string => {
    if (!userData) return '';
    
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    
    if (userData.displayName) {
      return userData.displayName;
    }
    
    return userData.email;
  }, [userData]);

  return {
    user,
    userData,
    loading,
    initializing,
    error,
    authError,
    actionLoading,
    actionSuccess,
    signIn,
    signUp,
    signOut,
    resetPassword,
    sendVerificationEmail,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    updateUserData,
    updateUserPlan,
    hasAccessToDashboard,
    hasPlanActive,
    isInTrialPeriod,
    getCurrentPlan,
    getTrialDaysRemaining,
    getPlanDaysRemaining,
    isAdmin,
    isSuperAdmin,
    getFullName
  };
}