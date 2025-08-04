'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSocios } from '@/hooks/useSocios';
import { useComercios } from '@/hooks/useComercios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useReports } from '@/hooks/useReports';
import { useNotifications } from '@/hooks/useNotifications';
import { useBeneficios } from '@/hooks/useBeneficios';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import OptimizedOverviewDashboard from '@/components/asociacion/OptimizedOverviewDashboard';

const AsociacionDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { socios, loading: sociosLoading } = useSocios();
  const { comercios, loading: comerciosLoading } = useComercios();
  const { validaciones, loading: validacionesLoading } = useValidaciones();
  const { reports, loading: reportsLoading } = useReports();
  const { notifications, loading: notificationsLoading } = useNotifications();
  const { beneficios, loading: beneficiosLoading } = useBeneficios();

  const isLoading = sociosLoading || comerciosLoading || validacionesLoading || 
                   reportsLoading || notificationsLoading || beneficiosLoading;

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['asociacion']}>
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Panel de Asociación
              </h1>
              <p className="text-gray-600">
                Gestiona socios, comercios y beneficios de tu asociación
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <OptimizedOverviewDashboard
                socios={socios}
                comercios={comercios}
                validaciones={validaciones}
                reports={reports}
                notifications={notifications}
                beneficios={beneficios}
                loading={isLoading}
              />
            )}
          </div>
        </motion.div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AsociacionDashboardPage;