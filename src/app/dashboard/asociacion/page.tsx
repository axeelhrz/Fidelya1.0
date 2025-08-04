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
import { AsociacionDashboardLayout } from '@/components/layout/AsociacionDashboardLayout';
import { OptimizedOverviewDashboard } from '@/components/asociacion/OptimizedOverviewDashboard';

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
      <AsociacionDashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <OptimizedOverviewDashboard
            socios={socios}
            comercios={comercios}
            validaciones={validaciones}
            reports={reports}
            notifications={notifications}
            beneficios={beneficios}
            loading={isLoading}
          />
        </motion.div>
      </AsociacionDashboardLayout>
    </ProtectedRoute>
  );
};

export default AsociacionDashboardPage;