'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { AuthContextType } from '@/types/auth';

export function useSafeAuth(): AuthContextType | null {
  try {
    const context = useContext(AuthContext);
    return context || null;
  } catch (error) {
    console.warn('Auth context not available:', error);
    return null;
  }
}