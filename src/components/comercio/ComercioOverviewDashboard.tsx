'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  QrCode,
  BarChart3,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download
} from 'lucide-react';
import { useComercios } from '@/hooks/useComercios';
import { ValidationsChart } from './ValidationsChart';
import { RecentValidations } from './RecentValidations';
import { QuickActions } from './QuickActions';
import { TopBenefits } from './TopBenefits';

interface ComercioOverviewDashboardProps {
  onNavigate?: (section: string) => void;
}

type ComercioStats = {
  validacionesHoy?: number;
  validacionesMes?: number;
  clientesUnicos?: number;
  ingresosMensuales?: number;
  beneficiosActivos?: number;
  promedioValidacionesDiarias?: number;
  crecimientoMensual?: number;
};

export const ComercioOverviewDashboard: React.FC<ComercioOverviewDashboardProps> = ({ 
  onNavigate 
}) => {
  const {
    comerciosVinculados,
    stats,
    // analyticsData, // Remove this line if not returned by the hook
    loading,
    error,
    generateQRCode,
    refreshStats,
    clearError,
    validaciones // <-- Add this line if your hook returns validaciones
    // analyticsData // Remove this line if not returned by the hook
  } = useComercios();

  // Use the first linked commerce as the main comercio
  const comercio = comerciosVinculados?.[0];

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'generate-qr':
        if (comercio?.id) {
          await generateQRCode(comercio.id);
        }
        break;
      case 'view-beneficios':
        onNavigate?.('beneficios');
        break;
      case 'view-analytics':
        onNavigate?.('analytics');
        break;
      case 'view-profile':
        onNavigate?.('perfil');
        break;
      default:
        break;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Safe access to stats properties with fallbacks
  const safeStats = {
    validacionesHoy: stats?.validacionesHoy ?? 0,
    validacionesMes: stats?.validacionesMes ?? 0,
    clientesUnicos: stats?.clientesUnicos ?? 0,
    ingresosMensuales: (stats as any)?.ingresosMensuales ?? 0,
    beneficiosActivos: stats?.beneficiosActivos ?? 0,
    promedioValidacionesDiarias: (stats as any)?.promedioValidacionesDiarias ?? 0,
    crecimientoMensual: (stats as any)?.crecimientoMensual ?? 0,
  };

  if (loading && !comercio) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-red-800">{error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard - {comercio?.nombreComercio}
          </h1>
          <p className="text-gray-600 mt-2">
            Resumen de tu actividad comercial y beneficios
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshStats}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <BarChart3 className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          
          <button
            onClick={() => onNavigate?.('analytics')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Analytics
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Validaciones Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{safeStats.validacionesHoy}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  safeStats.crecimientoMensual >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {safeStats.crecimientoMensual >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 inline mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 inline mr-1" />
                  )}
                  {formatPercentage(safeStats.crecimientoMensual)}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Validaciones del Mes</p>
              <p className="text-2xl font-bold text-gray-900">{safeStats.validacionesMes}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  Promedio diario: {safeStats.promedioValidacionesDiarias.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
              <p className="text-2xl font-bold text-gray-900">{safeStats.clientesUnicos}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  Este mes
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(safeStats.ingresosMensuales)}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  Beneficios aplicados
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validations Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Validaciones por Día
            </h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
              </select>
            </div>
          </div>
          
          <ValidationsChart 
            data={[]} // Replace with actual data if available
            period={selectedPeriod}
          />
        </motion.div>

        {/* Top Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Beneficios Más Usados
            </h3>
            <button
              onClick={() => onNavigate?.('beneficios')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos
            </button>
          </div>
          
          <TopBenefits 
            data={[]} // Replace with actual data if available
          />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Validations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Validaciones Recientes
            </h3>
            <button
              onClick={() => onNavigate?.('validaciones')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todas
            </button>
          </div>
          
          <RecentValidations 
            validaciones={validaciones?.slice(0, 5) || []}
            onViewAll={() => onNavigate?.('validaciones')}
          />
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tu Código QR
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Los socios escanean este código para validar beneficios
            </p>

            {comercio?.qrCode ? (
              <>
                <div className="space-y-4">
                  <Image
                    src={comercio.qrCode}
                    alt="QR Code"
                    width={128}
                    height={128}
                    className="w-32 h-32 mx-auto"
                  />
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => comercio?.id && generateQRCode(comercio.id)}
                      disabled={loading}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {loading ? 'Regenerando...' : 'Regenerar'}
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = comercio.qrCode ?? '';
                        link.download = `qr-${comercio.nombreComercio}.png`;
                        link.click();
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 inline mr-1" />
                      Descargar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => comercio?.id && generateQRCode(comercio.id)}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Generando...' : 'Generar QR'}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Rendimiento del Mes
              </h3>
              <p className="text-sm text-gray-600">
                Resumen de tu actividad comercial
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {safeStats.beneficiosActivos}
                </p>
                <p className="text-xs text-gray-600">Beneficios Activos</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {safeStats.validacionesMes}
                </p>
                <p className="text-xs text-gray-600">Validaciones</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {safeStats.clientesUnicos}
                </p>
                <p className="text-xs text-gray-600">Clientes</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};