'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center max-w-md mx-auto">
          {/* Logo animado */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <span className="text-white font-bold text-xl">CP</span>
          </motion.div>

          {/* Spinner mejorado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative mb-6"
          >
            <div className="w-8 h-8 border-2 rounded-full mx-auto" style={{ borderColor: 'var(--color-border-light)' }}></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent)' }}></div>
          </motion.div>

          {/* Texto de carga */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-family-space-grotesk)', color: 'var(--color-text-primary)' }}>
              Centro Psicológico
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Cargando dashboard...</p>
          </motion.div>

          {/* Indicador de progreso */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="mt-6 h-1 rounded-full mx-auto max-w-xs shadow-sm"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
        </div>
      </div>
    );
  }

  return null;
}