import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import type { User } from '@/types/user';
import { Timestamp } from 'firebase/firestore';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authClient.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const mappedUser: User = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'user',
          createdAt: Timestamp.fromDate(firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date()),
          updatedAt: Timestamp.fromDate(firebaseUser.metadata.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime) : new Date()),
          phoneNumber: firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
          emailVerified: firebaseUser.emailVerified,
          metadata: {},
          notifications: {
            email: true,
            push: true,
            sms: true,
            emailExpiration: true,
            emailNewPolicy: true,
            emailPayment: true
          },
          appearance: { theme: 'light', language: 'en', primaryColor: '#000000', sidebarCollapsed: false, denseMode: false },
          stats: {
            lastActive: new Date(),
            lastLoginAt: Timestamp.fromDate(new Date()),
            totalPolicies: 0,
            activePolicies: 0,
            totalClients: 0,
            activeClients: 0,
            totalInvoices: 0,
            totalPayments: 0,
            totalClaims: 0,
            totalIncome: 0,
            pendingClaims: 0
          },
          permissions: {
            canCreatePolicies: false,
            canDeletePolicies: false,
            canManageClients: false,
            canAccessReports: false,
            canManageUsers: false,
            canManageRoles: false,
            canManageSettings: false,
            canViewDashboard: false
          },
          twoFactorEnabled: false
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const userInfo = await authClient.signInWithPassword({ email, password });
      
      if (!userInfo.user) {
        throw new Error('Authentication succeeded but no user data was returned');
      }
      
      const mappedUser: User = {
        id: userInfo.user.uid,
        uid: userInfo.user.uid,
        displayName: userInfo.user.displayName || '',
        email: userInfo.user.email || '',
        firstName: userInfo.user.displayName?.split(' ')[0] || '',
        lastName: userInfo.user.displayName?.split(' ').slice(1).join(' ') || '',
        role: 'user',
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        phoneNumber: userInfo.user.phoneNumber || '',
        photoURL: userInfo.user.photoURL || '',
        emailVerified: userInfo.user.emailVerified,
        metadata: {},
        notifications: {
          email: true,
          push: true,
          sms: true,
          emailExpiration: true,
          emailNewPolicy: true,
          emailPayment: true
        },
        appearance: { theme: 'light', language: 'en', primaryColor: '#000000', sidebarCollapsed: false, denseMode: false },
        stats: {
          lastActive: new Date(),
          lastLoginAt: Timestamp.fromDate(new Date()),
          totalPolicies: 0,
          activePolicies: 0,
          totalClients: 0,
          activeClients: 0,
          totalInvoices: 0,
          totalPayments: 0,
          totalClaims: 0,
          totalIncome: 0,
          pendingClaims: 0
        },
        permissions: {
          canCreatePolicies: false,
          canDeletePolicies: false,
          canManageClients: false,
          canAccessReports: false,
          canManageUsers: false,
          canManageRoles: false,
          canManageSettings: false,
          canViewDashboard: false
        },
        twoFactorEnabled: false
      };
      setUser(mappedUser);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      const firstName = fullName.split(' ')[0] || '';
      const lastName = fullName.split(' ').slice(1).join(' ') || '';
      const response = await authClient.signUp({ email, password, firstName, lastName });
      
      if (!response.user) {
        throw new Error('User registration succeeded but no user data was returned');
      }
      
      const mappedUser: User = {
        id: response.user.uid,
        uid: response.user.uid,
        displayName: fullName,
        email: response.user.email || '',
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ').slice(1).join(' ') || '',
        role: 'user',
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        phoneNumber: '',
        photoURL: '',
        emailVerified: false,
        metadata: {},
        notifications: {
          email: true,
          push: true,
          sms: true,
          emailExpiration: true,
          emailNewPolicy: true,
          emailPayment: true
        },
        appearance: { theme: 'light', language: 'en', primaryColor: '#000000', sidebarCollapsed: false, denseMode: false },
        stats: {
          lastActive: new Date(),
          lastLoginAt: Timestamp.fromDate(new Date()),
          totalPolicies: 0,
          activePolicies: 0,
          totalClients: 0,
          activeClients: 0,
          totalInvoices: 0,
          totalPayments: 0,
          totalClaims: 0,
          totalIncome: 0,
          pendingClaims: 0
        },
        permissions: {
          canCreatePolicies: false,
          canDeletePolicies: false,
          canManageClients: false,
          canAccessReports: false,
          canManageUsers: false,
          canManageRoles: false,
          canManageSettings: false,
          canViewDashboard: false
        },
        twoFactorEnabled: false
      };
      setUser(mappedUser);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authClient.signOut();
      setUser(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await authClient.resetPassword(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      if (!user) throw new Error('No hay usuario autenticado');
      await authClient.updateProfile(user.id, data);
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
  };
}