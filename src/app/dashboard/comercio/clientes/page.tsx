'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { ClienteProfileView } from '@/components/comercio/clientes/ClienteProfileView';
import { useAuth } from '@/hooks/useAuth';

export default function ClientesPage() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <DashboardLayout
      activeSection="clientes"
      sidebarComponent={(props) => (
        <ComercioSidebar {...props} onLogoutClick={handleLogout} />
      )}
      onLogout={handleLogout}
    >
      <ClienteProfileView />
    </DashboardLayout>
  );
}
