'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useSCAT } from '@/contexts/SCATContext';

interface SCATHeaderProps {
  title?: string;
  subtitle?: string;
  showTabs?: boolean;
  currentTab?: 'ci' | 'cb' | 'nac';
  onTabChange?: (tab: 'ci' | 'cb' | 'nac') => void;
}

const SCATHeader: React.FC<SCATHeaderProps> = ({
  title = "TABLA SCAT",
  subtitle = "Técnica de Análisis Sistemático de las Causas",
  showTabs = true,
  currentTab,
  onTabChange
}) => {
  const { state, dispatch } = useSCAT();
  const activeTab = currentTab || state.currentSection;

  const tabs = [
    { id: 'ci', label: 'CI', fullName: 'Causas Inmediatas', color: '#FF6B6B' },
    { id: 'cb', label: 'CB', fullName: 'Causas Básicas', color: '#4ECDC4' },
    { id: 'nac', label: 'NAC', fullName: 'Necesidades de Acción de Control', color: '#45B7D1' }
  ];

  const handleTabClick = (tabId: 'ci' | 'cb' | 'nac') => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      dispatch({ type: 'SET_CURRENT_SECTION', payload: tabId });
    }
  };

  return (
    <motion.div 
      className="bg-[#2E2E2E] border-b border-[#555555]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header principal */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
            <p className="text-[#B3B3B3] text-sm">{subtitle}</p>
          </div>
          
          {/* Indicador de progreso del proyecto actual */}
          {state.currentProject && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-medium">{state.currentProject.name}</p>
                <p className="text-[#B3B3B3] text-sm">Proyecto Activo</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#404040] flex items-center justify-center">
                <span className="text-[#FFD600] font-bold text-sm">
                  {Math.round((Object.values(state.currentProject.scatProgress.ci).filter(Boolean).length + 
                              Object.values(state.currentProject.scatProgress.cb).filter(Boolean).length + 
                              Object.values(state.currentProject.scatProgress.nac).filter(Boolean).length) / 42 * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs de navegación */}
      {showTabs && (
        <div className="px-8">
          <div className="flex space-x-1 bg-[#404040] rounded-lg p-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as 'ci' | 'cb' | 'nac')}
                className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-md'
                    : 'text-[#B3B3B3] hover:text-white hover:bg-[#4A4A4A]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      activeTab === tab.id ? 'opacity-100' : 'opacity-60'
                    }`}
                    style={{ backgroundColor: tab.color }}
                  />
                  <span className="font-bold">{tab.label}</span>
                </div>
                <div className="text-xs mt-1 opacity-80">
                  {tab.fullName}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SCATHeader;
