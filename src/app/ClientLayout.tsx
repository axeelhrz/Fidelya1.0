'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { initializeClientNotifications } from '@/lib/notification-init';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Inicializar notificaciones del cliente
    initializeClientNotifications();
  }, []);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            },
          },
        }}
      />
    </>
  );
}