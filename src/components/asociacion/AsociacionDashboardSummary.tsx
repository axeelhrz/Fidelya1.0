'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { SocioStats } from '@/types/socio';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

interface AsociacionDashboardSummaryProps {
  stats: SocioStats;
  loading: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export const AsociacionDashboardSummary: React.FC<AsociacionDashboardSummaryProps> = ({ 
  stats, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total de Socios',
      value: stats.total,
      icon: <Users size={24} className="text-blue-600" />,
      color: 'bg-blue-50',
      delay: 0
    },
    {
      title: 'Socios Activos',
      value: stats.activos,
      icon: <UserCheck size={24} className="text-green-600" />,
      color: 'bg-green-50',
      delay: 0.1
    },
    {
      title: 'Socios Vencidos',
      value: stats.vencidos,
      icon: <UserX size={24} className="text-red-600" />,
      color: 'bg-red-50',
      delay: 0.2
    },
    {
      title: 'Tasa de Actividad',
      value: stats.total > 0 ? Math.round((stats.activos / stats.total) * 100) : 0,
      icon: <TrendingUp size={24} className="text-purple-600" />,
      color: 'bg-purple-50',
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          delay={card.delay}
        />
      ))}
    </div>
  );
};
