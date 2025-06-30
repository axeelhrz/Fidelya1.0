'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import TherapistLayout from '@/components/layout/TherapistLayout';
import PatientLayout from '@/components/layout/PatientLayout';

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
      return;
    }

    if (user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      
      // Redirecciones basadas en roles
      if (user.role === 'therapist' && currentPath.includes('/ceo')) {
        router.push('/dashboard/therapist');
      } else if (user.role === 'ceo' && currentPath.includes('/therapist')) {
        router.push('/dashboard/ceo');
      } else if (user.role === 'patient' && !currentPath.includes('/patient')) {
        router.push('/dashboard/patient');
      } else if (user.role === 'receptionist' && !currentPath.includes('/reception')) {
        router.push('/dashboard/reception');
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

  // Seleccionar layout según el rol del usuario
  const LayoutComponent = () => {
    switch (user.role) {
      case 'ceo':
        return <AdminLayout>{children}</AdminLayout>;
      case 'therapist':
        return <TherapistLayout>{children}</TherapistLayout>;
      case 'patient':
        return <PatientLayout>{children}</PatientLayout>;
      case 'receptionist':
        // TODO: Crear ReceptionistLayout
        return <div>Receptionist Layout - En desarrollo</div>;
      default:
        return <AdminLayout>{children}</AdminLayout>;
    }
  };

  return <LayoutComponent />;
}