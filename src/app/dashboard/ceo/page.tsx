'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Topbar from '@/components/dashboard/Topbar';
import KPIGrid from '@/components/dashboard/KPIGrid';
import FinancialPanel from '@/components/dashboard/FinancialPanel';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import AlertsTasksDock from '@/components/dashboard/AlertsTasksDock';
import AIInsightsFooter from '@/components/dashboard/AIInsightsFooter';
import { useAuth } from '@/contexts/AuthContext';

export default function CEODashboard() {
  const { user, loading } = useAuth();

  // Verificar que el usuario tenga rol de admin
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">Acceso Denegado</h1>
          <p className="text-secondary">No tienes permisos para acceder a esta vista.</p>
        </div>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    // Implementar lógica de búsqueda global
    console.log('Searching for:', query);
  };

  const handleCenterChange = (centerId: string) => {
    // Implementar cambio de centro
    console.log('Changing to center:', centerId);
  };

  return (
    <div className="min-h-screen bg-neutral">
      {/* Topbar */}
      <Topbar onSearch={handleSearch} onCenterChange={handleCenterChange} />
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Column - Main Dashboard */}
          <div className="flex-1 space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold font-space-grotesk text-primary mb-2">
                Buenos días, {user.name}
              </h1>
              <p className="text-secondary">
                Aquí tienes un resumen del estado actual de tu centro psicológico
              </p>
            </motion.div>

            {/* KPI Grid */}
            <KPIGrid />

            {/* Paneles Plegables */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <FinancialPanel />
              <ClinicalPanel />
              <CommercialPanel />
            </div>

            {/* AI Insights Footer */}
            <AIInsightsFooter />
          </div>

          {/* Right Column - Alerts & Tasks Dock */}
          <div className="w-80">
            <AlertsTasksDock />
          </div>
        </div>
      </main>
    </div>
  );
}
