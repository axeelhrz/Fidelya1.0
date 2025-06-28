'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { ProfileCard } from '@/components/socio/ProfileCard';
import { AsociacionesList } from '@/components/socio/AsociacionesList';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SocioPerfilPage() {
  const { refreshData, loading } = useSocioProfile();

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <DashboardLayout
      activeSection="perfil"
      sidebarComponent={SocioSidebar}
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
              <p className="text-gray-600">
                Gestiona tu información personal y revisa el estado de tus membresías.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={16} />}
              onClick={handleRefresh}
              loading={loading}
            >
              Actualizar
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileCard />
          <AsociacionesList />
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <h3 className="font-medium text-blue-900 mb-2">💡 Consejos para tu perfil</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Mantén tu información actualizada para recibir beneficios personalizados</li>
            <li>• Verifica que tu teléfono esté correcto para recibir notificaciones importantes</li>
            <li>• Contacta a tu asociación si tienes problemas con tu membresía</li>
          </ul>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}