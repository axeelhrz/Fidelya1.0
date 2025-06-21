'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirigir según el rol del usuario
        if (user.role === 'admin') {
          router.push('/dashboard/ceo');
        } else {
          router.push('/dashboard/therapist');
        }
      } else {
        // Redirigir a login si no está autenticado
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary">Cargando...</p>
        </div>
      </div>
    );
  }

  return null;
}