'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { ProfileCard } from '@/components/socio/ProfileCard';
import { AsociacionesList } from '@/components/socio/AsociacionesList';

export default function SocioPerfilPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">
            Gestiona tu información personal y revisa el estado de tus membresías.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileCard />
          <AsociacionesList />
        </div>
      </div>
    </DashboardLayout>
  );
}
