'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

// Este hook es seguro para usar en componentes que podrían renderizarse en el servidor
export function useAuthSafe() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Siempre llamamos a useAuth, pero usamos sus valores solo en el cliente
  const authResult = useAuth();
  
  const auth = isClient ? authResult : { 
    user: null, 
    userData: null, 
    loading: true, 
    error: null,
    isAuthenticated: false,
    isEmailVerified: false,
    signIn: async () => {},
    signInWithGoogle: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    resetPassword: async () => {},
    sendVerificationEmail: async () => {},
    updateProfile: async () => {},
    updateEmail: async () => {},
    updatePassword: async () => {},
    uploadAvatar: async () => undefined,
    updateUserData: async () => {}
  };
  
  return auth;
}