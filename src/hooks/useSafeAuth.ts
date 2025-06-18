'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useSafeAuth() {
  try {
    const context = useContext(AuthContext);
    return context;
  } catch (error) {
    console.warn('Auth context not available:', error);
    return undefined;
  }
}
