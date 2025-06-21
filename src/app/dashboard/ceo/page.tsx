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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary text-sm">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-error text-2xl">⚠</span>
          </div>
          <h1 className="text-xl font-semibold text-primary mb-2">Acceso Denegado</h1>
          <p className="text-secondary">No tienes permisos para acceder a esta vista.</p>
        </div>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleCenterChange = (centerId: string) => {
    console.log('Changing to center:', centerId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <Topbar onSearch={handleSearch} onCenterChange={handleCenterChange} />
      
      {/* Main Content */}
      <main className="container-dashboard py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Main Dashboard */}
          <div className="xl:col-span-3 space-y-8">
            {/* Welcome Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className="text-2xl font-semibold font-space-grotesk text-primary">
                Buenos días, {user.name}
              </h1>
              <p className="text-secondary">
                Resumen ejecutivo del estado actual de tu centro psicológico
              </p>
            </motion.section>

            {/* KPI Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <KPIGrid />
            </motion.section>

            {/* Analytics Panels */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <FinancialPanel />
              <ClinicalPanel />
              <CommercialPanel />
            </motion.section>

            {/* AI Insights Footer */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AIInsightsFooter />
            </motion.section>
          </div>

          {/* Right Column - Alerts & Tasks Dock */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-8"
            >
              <AlertsTasksDock />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}