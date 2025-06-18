'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser,
  reload
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { User, AuthContextType, SignUpData } from '@/types/auth';
import { FirestoreService } from '@/services/firestore';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Recargar el usuario para obtener el estado más reciente de emailVerified
          await reload(firebaseUser);
          
          // Obtener datos adicionales del usuario desde Firestore
          const userData = await FirestoreService.getUser(firebaseUser.uid);
          
          if (userData) {
            const updatedUser = {
              ...userData,
              emailVerified: firebaseUser.emailVerified,
            };
            
            setUser(updatedUser);
            setAuthStatus('authenticated');
            
            // Actualizar el estado de verificación en Firestore si ha cambiado
            if (userData.emailVerified !== firebaseUser.emailVerified) {
              await FirestoreService.updateUser(firebaseUser.uid, {
                emailVerified: firebaseUser.emailVerified,
              });
            }
            
            // Actualizar último login solo si el email está verificado
            if (firebaseUser.emailVerified) {
              await FirestoreService.updateLastLogin(firebaseUser.uid);
            }
          } else {
            // Usuario no encontrado en Firestore
            setUser(null);
            setAuthStatus('unauthenticated');
          }
        } else {
          setUser(null);
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        setAuthStatus('unauthenticated');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [mounted]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: SignUpData) => {
    try {
      setLoading(true);
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      // Crear perfil en Firestore
      await FirestoreService.createUser(userCredential.user.uid, {
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        centerId: userData.centerId,
        isActive: true,
        emailVerified: false,
        phone: userData.phone,
        specialization: userData.specialization,
        licenseNumber: userData.licenseNumber,
        emergencyContact: userData.emergencyContact,
      });

      // Enviar verificación de email
      await firebaseSendEmailVerification(userCredential.user);
      
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setAuthStatus('unauthenticated');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await FirestoreService.updateUser(user.uid, data);
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const sendEmailVerification = async () => {
    if (!auth.currentUser) throw new Error('No user logged in');
    
    try {
      await firebaseSendEmailVerification(auth.currentUser);
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        await reload(auth.currentUser);
        
        const userData = await FirestoreService.getUser(auth.currentUser.uid);
        if (userData) {
          const updatedUser = {
            ...userData,
            emailVerified: auth.currentUser.emailVerified,
          };
          setUser(updatedUser);
          
          // Actualizar Firestore si es necesario
          if (userData.emailVerified !== auth.currentUser.emailVerified) {
            await FirestoreService.updateUser(auth.currentUser.uid, {
              emailVerified: auth.currentUser.emailVerified,
            });
          }
        }
      } catch (error) {
        console.error('Error refreshing user:', error);
        throw error;
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    authStatus,
    signIn,
    signUp,
    signOut,
    updateProfile,
    sendEmailVerification,
    resetPassword,
    refreshUser,
  };

  // No renderizar el contexto hasta que esté montado
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}