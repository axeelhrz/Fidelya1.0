'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { ProfileForm } from '@/components/comercio/perfil/ProfileForm';
import { QRSection } from '@/components/comercio/perfil/QRSection';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { 
  Store, 
  RefreshCw,
  QrCode
} from 'lucide-react';

export default function ComercioPerfilPage() {
  const { signOut } = useAuth();
  const { comerciosVinculados, loading } = useComercios();
  const comercio = comerciosVinculados && comerciosVinculados.length > 0 ? comerciosVinculados[0] : null;
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'datos';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const tabs = [
    {
      id: 'datos',
      label: 'Datos del Comercio',
      icon: Store,
      description: 'Información básica y contacto'
    },
    {
      id: 'qr',
      label: 'Código QR',
      icon: QrCode,
      description: 'Gestión del código QR'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout
        activeSection="perfil"
        sidebarComponent={(props) => (
          <ComercioSidebar
            {...props}
            onLogoutClick={handleLogout}
          />
        )}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
              <RefreshCw size={32} className="text-blue-500 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cargando perfil...
            </h3>
            <p className="text-gray-500">Obteniendo información del comercio</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="perfil"
      sidebarComponent={(props) => (
        <ComercioSidebar
          {...props}
          onLogoutClick={handleLogout}
        />
      )}
    >
      <motion.div
        className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Mi Perfil
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Gestiona la información de tu comercio
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} />}
                onClick={() => window.location.reload()}
              >
                Actualizar
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('tab', tab.id);
                  window.history.pushState({}, '', url.toString());
                  window.location.reload();
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {activeTab === 'datos' && <ProfileForm />}

          {activeTab === 'qr' && <QRSection />}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}