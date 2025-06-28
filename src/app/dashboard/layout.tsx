'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Consolidar todos los efectos en un solo useEffect para evitar problemas de orden de hooks
  useEffect(() => {
    // Redirigir al login si no hay usuario autenticado
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Redirigir según el rol si está en la ruta incorrecta
    if (user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      
      if (user.role === 'therapist' && currentPath.includes('/ceo')) {
        router.push('/dashboard/sessions');
      } else if (user.role === 'admin' && currentPath.includes('/sessions') && !currentPath.includes('/ceo')) {
        router.push('/dashboard/ceo');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #2563EB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Cargando dashboard...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}