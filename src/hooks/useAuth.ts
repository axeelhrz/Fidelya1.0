'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserData } from '@/lib/auth';

export const useAuth = () => {
  const [firebaseUser, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setUserData(null);
      setUserLoading(false);
      return;
    }

    // Subscribe to user document in Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserData({
            uid: doc.id,
            email: data.email,
            nombre: data.nombre,
            role: data.role,
            estado: data.estado,
            creadoEn: data.creadoEn?.toDate() || new Date(),
          } as UserData);
        } else {
          setUserData(null);
        }
        setUserLoading(false);
      },
      (error) => {
        console.error('Error fetching user data:', error);
        setUserData(null);
        setUserLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  return {
    user: userData,
    firebaseUser,
    loading: loading || userLoading,
    error,
    isAuthenticated: !!firebaseUser && !!userData
  };
};