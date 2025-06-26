'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComercioSidebar } from '@/components/layout/ComercioSidebar';
import { DashboardHeader } from '@/components/comercio/DashboardHeader';
import { StatsCards } from '@/components/comercio/StatsCards';
import { ValidationsChart } from '@/components/comercio/ValidationsChart';
import { TopBenefits } from '@/components/comercio/TopBenefits';
import { Alerts } from '@/components/comercio/Alerts';
import { RecentValidations } from '@/components/comercio/RecentValidations';
import { QuickActions } from '@/components/comercio/QuickActions';
import { Shield, Loader2 } from 'lucide-react';

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-slate-200 border-t-cyan-500 border-r-cyan-400 rounded-full animate-spin mx-auto" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4">
        Cargando Panel de Control
      </h1>
      <p className="text-lg text-slate-600 font-medium">
        {message}
      </p>
    </motion.div>
  </div>
);

const AccessDeniedScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-md mx-4"
    >
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Shield className="w-12 h-12 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 mb-4">
        Acceso Restringido
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Necesitas permisos de comercio para acceder a este panel de control.
      </p>
    </motion.div>
  </div>
);

export default function ComercioDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { comercio, loading: comercioLoading } = useComercios();
  const { loading: beneficiosLoading } = useBeneficios();
  const { loading: validacionesLoading } = useValidaciones();

  const loading = authLoading || comercioLoading || beneficiosLoading || validacionesLoading;

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <AccessDeniedScreen />;
  }

  if (loading) {
    return <LoadingScreen message="Preparando tu panel de control comercial..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1)_0%,transparent_50%)] bg-[length:800px_800px,600px_600px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header */}
          <DashboardHeader />

          {/* Stats Cards */}
          <div className="mb-8">
            <StatsCards />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-8">
              <ValidationsChart />
              <TopBenefits />
            </div>

            {/* Right Column - Alerts & Quick Actions */}
            <div className="space-y-8">
              <Alerts />
              <QuickActions />
            </div>
          </div>

          {/* Recent Validations */}
          <RecentValidations />
        </div>
      </div>
    </div>
  );
}