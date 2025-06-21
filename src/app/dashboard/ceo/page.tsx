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
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

export default function CEODashboard() {
  // Usuario mock para desarrollo
  const mockUser = {
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@centropsicologico.com',
    role: 'admin'
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleCenterChange = (centerId: string) => {
    console.log('Changing to center:', centerId);
  };

  return (
    <div className="min-h-screen bg-gradient-surface relative overflow-hidden">
      {/* Efectos de fondo futuristas */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-accent/30 rounded-full animate-particle-float" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-accent/40 rounded-full animate-particle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-success/20 rounded-full animate-particle-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-warning/30 rounded-full animate-particle-float" style={{ animationDelay: '6s' }} />
      </div>

      {/* Topbar */}
      <Topbar onSearch={handleSearch} onCenterChange={handleCenterChange} />
      
      {/* Main Content */}
      <main className="container-dashboard py-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          {/* Left Column - Main Dashboard */}
          <div className="xl:col-span-3 space-y-10">
            {/* Welcome Section Futurista */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 gradient-accent rounded-full"
                    />
                    <h1 className="text-4xl font-bold font-space-grotesk text-gradient-accent">
                      Buenos días, {mockUser.name}
                    </h1>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-6 h-6 text-accent" />
                    </motion.div>
                  </div>
                  <p className="text-lg text-secondary font-medium leading-relaxed">
                    Resumen ejecutivo del estado actual de tu centro psicológico
                  </p>
                </div>
                
                {/* Status indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex items-center space-x-3 bg-surface-glass backdrop-blur-xl rounded-2xl px-6 py-4 border border-success/30"
                >
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <div>
                    <div className="text-sm font-bold text-success font-space-grotesk">Sistema Operativo</div>
                    <div className="text-xs text-success/70">Todos los servicios activos</div>
                  </div>
                </motion.div>
              </div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center space-x-8 mt-6"
              >
                <div className="flex items-center space-x-3 bg-surface-glass backdrop-blur-xl rounded-xl px-4 py-3 border border-light">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <div>
                    <div className="text-sm font-bold text-success">+12.5%</div>
                    <div className="text-xs text-secondary">vs. mes anterior</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-surface-glass backdrop-blur-xl rounded-xl px-4 py-3 border border-light">
                  <Zap className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-sm font-bold text-accent">87.3%</div>
                    <div className="text-xs text-secondary">Eficiencia operativa</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-surface-glass backdrop-blur-xl rounded-xl px-4 py-3 border border-light">
                  <div className="w-5 h-5 gradient-success rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-inverse">AI</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-success">Activo</div>
                    <div className="text-xs text-secondary">Insights automáticos</div>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* KPI Grid */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <KPIGrid />
            </motion.section>

            {/* Analytics Panels */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <FinancialPanel />
              <ClinicalPanel />
              <CommercialPanel />
            </motion.section>

            {/* AI Insights Footer */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <AIInsightsFooter />
            </motion.section>
          </div>

          {/* Right Column - Alerts & Tasks Dock */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="sticky top-32"
            >
              <AlertsTasksDock />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Floating action button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 gradient-accent rounded-full shadow-glow-strong flex items-center justify-center z-40"
      >
        <Sparkles className="w-8 h-8 text-inverse" />
      </motion.button>
    </div>
  );
}