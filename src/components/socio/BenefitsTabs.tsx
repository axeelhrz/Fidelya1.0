'use client';

import React from 'react';
import { Gift, History, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenefitsTabsProps {
  activeTab: 'disponibles' | 'usados';
  onTabChange: (tab: 'disponibles' | 'usados') => void;
  stats?: {
    disponibles: number;
    usados: number;
    ahorroTotal: number;
  };
}

export const BenefitsTabs: React.FC<BenefitsTabsProps> = ({
  activeTab,
  onTabChange,
  stats = { disponibles: 0, usados: 0, ahorroTotal: 0 }
}) => {
  const tabs = [
    {
      id: 'disponibles' as const,
      label: 'Disponibles',
      icon: <Gift size={18} />,
      count: stats.disponibles,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'usados' as const,
      label: 'Usados',
      icon: <History size={18} />,
      count: stats.usados,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Stats Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mis Beneficios</h2>
            <p className="text-sm text-gray-500">Descuentos y ofertas especiales</p>
          </div>
        </div>

        {/* Ahorro total */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 font-medium">Total Ahorrado</p>
              <p className="text-2xl font-bold text-emerald-800">
                ${stats.ahorroTotal.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 relative',
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-bold',
                  activeTab === tab.id
                    ? `${tab.bgColor} ${tab.color} ${tab.borderColor} border`
                    : 'bg-gray-200 text-gray-600'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
