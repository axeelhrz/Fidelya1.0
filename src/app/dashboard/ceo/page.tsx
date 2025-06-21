'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  Heart, 
  Target, 
  Brain, 
  TrendingUp, 
  Sparkles,
  Activity,
  Users,
  Zap
} from 'lucide-react';

import Topbar from '@/components/dashboard/Topbar';
import TabNavigation from '@/components/dashboard/TabNavigation';
import KPIGrid from '@/components/dashboard/KPIGrid';
import FinancialPanel from '@/components/dashboard/FinancialPanel';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import AlertsTasksDock from '@/components/dashboard/AlertsTasksDock';
import AIInsightsFooter from '@/components/dashboard/AIInsightsFooter';

export default function CEODashboard() {
  const [activeTab, setActiveTab] = useState('executive');

  // Usuario mock para desarrollo
  const mockUser = {
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@centropsicologico.com',
    role: 'admin'
  };

  const tabs = [
    {
      id: 'executive',
      label: 'Resumen Ejecutivo',
      icon: BarChart3,
      description: 'KPIs principales'
    },
    {
      id: 'financial',
      label: 'Análisis Financiero',
      icon: DollarSign,
      description: 'Métricas económicas'
    },
    {
      id: 'clinical',
      label: 'Operaciones Clínicas',
      icon: Heart,
      description: 'Salud operativa'
    },
    {
      id: 'commercial',
      label: 'Marketing & Comercial',
      icon: Target,
      description: 'Conversión y campañas'
    },
    {
      id: 'insights',
      label: 'Insights & IA',
      icon: Brain,
      description: 'Recomendaciones inteligentes'
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleCenterChange = (centerId: string) => {
    console.log('Changing to center:', centerId);
  };

  const renderTabContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        transition: { duration: 0.3 }
      }
    };

    switch (activeTab) {
      case 'executive':
        return (
          <motion.div
            key="executive"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-10"
          >
            {/* Welcome Section Mejorado */}
            <div className="relative">
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 gradient-accent rounded-full shadow-glow"
                    />
                    <h1 className="text-5xl font-bold font-space-grotesk text-gradient-accent">
                      Buenos días, {mockUser.name}
                    </h1>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-7 h-7 text-accent" />
                    </motion.div>
                  </div>
                  <p className="text-xl text-secondary font-medium leading-relaxed max-w-2xl">
                    Resumen ejecutivo del estado actual de tu centro psicológico con insights en tiempo real
                  </p>
                </div>
                
                {/* Status Cards */}
                <div className="flex flex-col space-y-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex items-center space-x-4 bg-surface-glass backdrop-blur-xl rounded-2xl px-8 py-6 border border-success/30 shadow-glow"
                  >
                    <div className="w-4 h-4 bg-success rounded-full animate-pulse" />
                    <div>
                      <div className="text-lg font-bold text-success font-space-grotesk">Sistema Operativo</div>
                      <div className="text-sm text-success/70">Todos los servicios activos</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex items-center space-x-4 bg-surface-glass backdrop-blur-xl rounded-2xl px-8 py-6 border border-accent/30"
                  >
                    <Activity className="w-6 h-6 text-accent" />
                    <div>
                      <div className="text-lg font-bold text-accent font-space-grotesk">IA Activa</div>
                      <div className="text-sm text-accent/70">Análisis en tiempo real</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Quick Performance Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center justify-center space-x-12 mb-12"
              >
                <div className="flex items-center space-x-4 bg-surface-glass backdrop-blur-xl rounded-2xl px-8 py-6 border border-light shadow-card">
                  <TrendingUp className="w-8 h-8 text-success" />
                  <div>
                    <div className="text-3xl font-bold text-success font-space-grotesk">+12.5%</div>
                    <div className="text-sm text-secondary">Crecimiento mensual</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 bg-surface-glass backdrop-blur-xl rounded-2xl px-8 py-6 border border-light shadow-card">
                  <Zap className="w-8 h-8 text-accent" />
                  <div>
                    <div className="text-3xl font-bold text-accent font-space-grotesk">87.3%</div>
                    <div className="text-sm text-secondary">Eficiencia operativa</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 bg-surface-glass backdrop-blur-xl rounded-2xl px-8 py-6 border border-light shadow-card">
                  <Users className="w-8 h-8 text-warning" />
                  <div>
                    <div className="text-3xl font-bold text-warning font-space-grotesk">94.2%</div>
                    <div className="text-sm text-secondary">Satisfacción pacientes</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* KPI Grid */}
            <KPIGrid />
          </motion.div>
        );

      case 'financial':
        return (
          <motion.div
            key="financial"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-space-grotesk text-gradient-accent mb-4">
                Análisis Financiero Detallado
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Métricas financieras completas con proyecciones inteligentes y análisis de rentabilidad
              </p>
            </div>
            <FinancialPanel />
          </motion.div>
        );

      case 'clinical':
        return (
          <motion.div
            key="clinical"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-space-grotesk text-gradient-accent mb-4">
                Operaciones Clínicas
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Monitoreo inteligente de salud operativa, riesgos y capacidad del centro
              </p>
            </div>
            <ClinicalPanel />
          </motion.div>
        );

      case 'commercial':
        return (
          <motion.div
            key="commercial"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-space-grotesk text-gradient-accent mb-4">
                Marketing & Comercial
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Análisis completo de conversión, campañas y adquisición de pacientes
              </p>
            </div>
            <CommercialPanel />
          </motion.div>
        );

      case 'insights':
        return (
          <motion.div
            key="insights"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-space-grotesk text-gradient-accent mb-4">
                Insights & Inteligencia Artificial
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Recomendaciones inteligentes y análisis predictivo para optimizar tu centro
              </p>
            </div>
            <AIInsightsFooter />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface relative overflow-hidden">
      {/* Efectos de fondo futuristas mejorados */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-accent/20 rounded-full animate-particle-float" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-accent/30 rounded-full animate-particle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-2.5 h-2.5 bg-success/15 rounded-full animate-particle-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-warning/20 rounded-full animate-particle-float" style={{ animationDelay: '6s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-accent/25 rounded-full animate-particle-float" style={{ animationDelay: '8s' }} />
      </div>

      {/* Topbar */}
      <Topbar onSearch={handleSearch} onCenterChange={handleCenterChange} />
      
      {/* Main Content */}
      <main className="container-dashboard py-12">
        <div className="flex space-x-12">
          {/* Left Column - Main Dashboard */}
          <div className="flex-1 space-y-12">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <TabNavigation 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>

          {/* Right Column - Alerts & Tasks Dock */}
          <div className="w-96">
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

      {/* Floating Action Button Mejorado */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-20 h-20 gradient-accent rounded-2xl shadow-glow-strong flex items-center justify-center z-40 group"
      >
        <Sparkles className="w-10 h-10 text-inverse group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    </div>
  );
}