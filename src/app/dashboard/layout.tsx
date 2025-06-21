'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
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
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Redirigir según el rol
  if (user.role === 'therapist' && window.location.pathname.includes('/ceo')) {
    router.push('/dashboard/therapist');
    return null;
  }

  return (
    <AdminLayout>
      <Topbar />
      {children}
    </AdminLayout>
  );
}
