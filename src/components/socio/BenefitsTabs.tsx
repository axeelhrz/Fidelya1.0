'use client';

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';
import { Gift, History, TrendingUp, Award, Target, Zap } from 'lucide-react';

interface BenefitsTabsProps {
  activeTab: 'disponibles' | 'usados';
  onTabChange: (tab: 'disponibles' | 'usados') => void;
  stats?: {
    disponibles: number;
    usados: number;
    ahorroTotal: number;
  };
}

const TabsContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
  }
`;

const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .icon-container {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .title-content h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .title-content p {
    color: #64748b;
    font-weight: 600;
  }
`;

const AhorroCard = styled(motion.div)`
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 2px solid #86efac;
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #10b981, #059669, #047857);
  }
  
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .text-section {
    flex: 1;
  }
  
  .label {
    font-size: 0.875rem;
    color: #166534;
    font-weight: 700;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .value {
    font-size: 2rem;
    font-weight: 900;
    color: #14532d;
    letter-spacing: -0.02em;
  }
  
  .icon-container {
    width: 3rem;
    height: 3rem;
    background: #10b981;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  }
`;

const TabsNavigation = styled.div`
  position: relative;
  background: #f1f5f9;
  border-radius: 1.5rem;
  padding: 0.5rem;
  display: flex;
`;

const Tab = styled(motion.button)<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
  
  ${({ active }) => active ? css`
    background: white;
    color: #1e293b;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  ` : css`
    background: transparent;
    color: #64748b;
    
    &:hover {
      color: #1e293b;
    }
  `}
`;

const TabBadge = styled.span<{ color: string; active: boolean }>`
  background: ${({ color, active }) => active ? color : '#e2e8f0'};
  color: ${({ active }) => active ? 'white' : '#64748b'};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  min-width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatItem = styled(motion.div)<{ color: string }>`
  text-align: center;
  padding: 1rem;
  background: ${({ color }) => `linear-gradient(135deg, ${color}10, ${color}05)`};
  border: 1px solid ${({ color }) => `${color}20`};
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${({ color }) => `${color}20`};
    border-color: ${({ color }) => `${color}40`};
  }
  
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    background: ${({ color }) => color};
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.75rem;
    color: white;
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: 900;
    color: ${({ color }) => color};
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const BenefitsTabs: React.FC<BenefitsTabsProps> = ({
  activeTab,
  onTabChange,
  stats = { disponibles: 0, usados: 0, ahorroTotal: 0 }
}) => {
  const tabs = [
    {
      id: 'disponibles' as const,
      label: 'Disponibles',
      icon: <Gift size={20} />,
      count: stats.disponibles,
      color: '#10b981'
    },
    {
      id: 'usados' as const,
      label: 'Usados',
      icon: <History size={20} />,
      count: stats.usados,
      color: '#6366f1'
    }
  ];

  return (
    <TabsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <StatsHeader>
        <div className="icon-container">
          <TrendingUp size={20} />
        </div>
        <div className="title-content">
          <h2>Resumen de Beneficios</h2>
          <p>Tu actividad y ahorros</p>
        </div>
      </StatsHeader>

      {/* Ahorro total destacado */}
      <AhorroCard
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="content">
          <div className="text-section">
            <div className="label">Total Ahorrado</div>
            <div className="value">${stats.ahorroTotal.toLocaleString()}</div>
          </div>
          <div className="icon-container">
            <TrendingUp size={20} />
          </div>
        </div>
      </AhorroCard>

      {/* Estadísticas adicionales */}
      <StatsGrid>
        <StatItem
          color="#10b981"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="icon">
            <Gift size={16} />
          </div>
          <div className="value">{stats.disponibles}</div>
          <div className="label">Disponibles</div>
        </StatItem>

        <StatItem
          color="#6366f1"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="icon">
            <Award size={16} />
          </div>
          <div className="value">{stats.usados}</div>
          <div className="label">Usados</div>
        </StatItem>

        <StatItem
          color="#f59e0b"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="icon">
            <Target size={16} />
          </div>
          <div className="value">{Math.round((stats.usados / (stats.disponibles + stats.usados)) * 100) || 0}%</div>
          <div className="label">Tasa de Uso</div>
        </StatItem>

        <StatItem
          color="#8b5cf6"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="icon">
            <Zap size={16} />
          </div>
          <div className="value">{stats.ahorroTotal > 0 ? Math.round(stats.ahorroTotal / Math.max(stats.usados, 1)) : 0}</div>
          <div className="label">Ahorro Promedio</div>
        </StatItem>
      </StatsGrid>

      {/* Tabs Navigation */}
      <TabsNavigation style={{ marginTop: '2rem' }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <TabBadge color={tab.color} active={activeTab === tab.id}>
              {tab.count}
            </TabBadge>
          </Tab>
        ))}
      </TabsNavigation>
    </TabsContainer>
  );
};