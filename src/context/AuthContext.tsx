'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { User, AuthContextType, SignUpData } from '@/types/auth';
import { FirestoreService } from '@/services/firestore';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Obtener datos adicionales del usuario desde Firestore
          const userData = await FirestoreService.getUser(firebaseUser.uid);
          
          if (userData) {
            setUser({
              ...userData,
              emailVerified: firebaseUser.emailVerified,
            });
            setAuthStatus('authenticated');
            
            // Actualizar último login
            await FirestoreService.updateLastLogin(firebaseUser.uid);
          } else {
            // Usuario no encontrado en Firestore
            setUser(null);
            setAuthStatus('unauthenticated');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setAuthStatus('unauthenticated');
        }
      } else {
        setUser(null);
        setAuthStatus('unauthenticated');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
  };

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