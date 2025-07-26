'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Gift, 
  DollarSign, 
  Users, 
  Calendar,
  Award,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import { BeneficioStats, Beneficio, BeneficioUso } from '@/types/beneficio';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BeneficiosStatsProps {
  stats: BeneficioStats | null;
  loading?: boolean;
  userRole?: 'socio' | 'comercio' | 'asociacion';
  className?: string;
  // Nuevos props para datos locales del socio
  beneficiosActivos?: Beneficio[];
  beneficiosUsados?: BeneficioUso[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  subtitle,
  trend = 'neutral',
  loading = false
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: color }}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            icon
          )}
        </div>

        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
            trend === 'up' ? 'bg-green-100 text-green-700' :
            trend === 'down' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
          {title}
        </h3>
        <p className="text-3xl font-black text-gray-900 mb-1">
          {loading ? '...' : value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export const BeneficiosStats: React.FC<BeneficiosStatsProps> = ({
  stats,
  loading = false,
  userRole = 'socio',
  className = '',
  beneficiosActivos,
  beneficiosUsados
}) => {
  // Para socios, usar datos locales si están disponibles
  const effectiveStats = useMemo(() => {
    if (userRole === 'socio' && beneficiosActivos && beneficiosUsados) {
      console.log('📊 Usando datos locales para socio:', {
        beneficiosActivos: beneficiosActivos.length,
        beneficiosUsados: beneficiosUsados.length
      });
      
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
      
      return {
        totalBeneficios: beneficiosActivos.length,
        beneficiosActivos: beneficiosActivos.length,
        beneficiosUsados: beneficiosUsados.length,
        beneficiosVencidos: beneficiosActivos.filter(b => b.estado === 'vencido').length,
        ahorroTotal: beneficiosUsados.reduce((total, uso) => total + (uso.montoDescuento || 0), 0),
        ahorroEsteMes: beneficiosUsados
          .filter(uso => uso.fechaUso.toDate() >= inicioMes)
          .reduce((total, uso) => total + (uso.montoDescuento || 0), 0),
        usosPorMes: stats?.usosPorMes || [],
        topBeneficios: stats?.topBeneficios || [],
        categorias: stats?.categorias || [],
        comercios: stats?.comercios || [],
        activos: beneficiosActivos.length
      };
    }
    return stats;
  }, [userRole, beneficiosActivos, beneficiosUsados, stats]);

  // Calcular top beneficios específicos para el socio
  const topBeneficiosSocio = useMemo(() => {
    if (userRole === 'socio' && beneficiosActivos && beneficiosUsados) {
      // Crear un mapa de usos por beneficio
      const usosPorBeneficio = new Map<string, { usos: number; ahorro: number; titulo: string; comercio: string }>();
      
      beneficiosUsados.forEach(uso => {
        const beneficioId = uso.beneficioId || 'unknown';
        const existing = usosPorBeneficio.get(beneficioId) || { 
          usos: 0, 
          ahorro: 0, 
          titulo: uso.beneficioTitulo || 'Beneficio Usado',
          comercio: uso.comercioNombre || 'Comercio'
        };
        
        usosPorBeneficio.set(beneficioId, {
          ...existing,
          usos: existing.usos + 1,
          ahorro: existing.ahorro + (uso.montoDescuento || 0)
        });
      });

      // Agregar beneficios disponibles que no han sido usados
      beneficiosActivos.forEach(beneficio => {
        if (!usosPorBeneficio.has(beneficio.id)) {
          usosPorBeneficio.set(beneficio.id, {
            usos: 0,
            ahorro: 0,
            titulo: beneficio.titulo,
            comercio: beneficio.comercioNombre || 'Comercio'
          });
        }
      });

      // Convertir a array y ordenar por usos
      return Array.from(usosPorBeneficio.entries())
        .map(([id, data]) => ({
          id,
          titulo: data.titulo,
          usos: data.usos,
          ahorro: data.ahorro,
          comercio: data.comercio
        }))
        .sort((a, b) => b.usos - a.usos)
        .slice(0, 5);
    }
    return effectiveStats?.topBeneficios.slice(0, 5) || [];
  }, [userRole, beneficiosActivos, beneficiosUsados, effectiveStats]);

  // Calcular categorías específicas para el socio
  const categoriasSocio = useMemo(() => {
    if (userRole === 'socio' && beneficiosActivos) {
      const categoriaMap = new Map<string, { cantidad: number; usos: number }>();
      
      // Contar beneficios por categoría
      beneficiosActivos.forEach(beneficio => {
        const categoria = beneficio.categoria || 'Sin categoría';
        const existing = categoriaMap.get(categoria) || { cantidad: 0, usos: 0 };
        categoriaMap.set(categoria, {
          ...existing,
          cantidad: existing.cantidad + 1
        });
      });

      // Agregar usos por categoría
      if (beneficiosUsados) {
        beneficiosUsados.forEach(uso => {
          // Encontrar la categoría del beneficio usado
          const beneficio = beneficiosActivos.find(b => b.id === uso.beneficioId);
          const categoria = beneficio?.categoria || 'Sin categoría';
          const existing = categoriaMap.get(categoria) || { cantidad: 0, usos: 0 };
          categoriaMap.set(categoria, {
            ...existing,
            usos: existing.usos + 1
          });
        });
      }

      return Array.from(categoriaMap.entries())
        .map(([nombre, data]) => ({
          nombre,
          cantidad: data.cantidad,
          usos: data.usos
        }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);
    }
    return effectiveStats?.categorias.slice(0, 5) || [];
  }, [userRole, beneficiosActivos, beneficiosUsados, effectiveStats]);

  const statsCards = useMemo(() => {
    if (!effectiveStats) return [];

    const baseCards = [
      {
        title: 'Total Beneficios',
        value: effectiveStats.totalBeneficios.toLocaleString(),
        icon: <Gift size={24} />,
        color: '#6366f1',
        subtitle: userRole === 'socio' ? 'Disponibles para ti' : 'En la plataforma'
      },
      {
        title: 'Beneficios Activos',
        value: effectiveStats.beneficiosActivos.toLocaleString(),
        icon: <Target size={24} />,
        color: '#10b981',
        subtitle: 'Disponibles para usar',
        change: effectiveStats.beneficiosActivos > 0 ? 5.2 : 0,
        trend: 'up' as const
      },
      {
        title: 'Total Usado',
        value: effectiveStats.beneficiosUsados.toLocaleString(),
        icon: <Users size={24} />,
        color: '#8b5cf6',
        subtitle: 'Beneficios utilizados'
      },
      {
        title: 'Ahorro Total',
        value: `$${effectiveStats.ahorroTotal.toLocaleString()}`,
        icon: <DollarSign size={24} />,
        color: '#f59e0b',
        subtitle: 'Dinero ahorrado',
        change: effectiveStats.ahorroEsteMes > 0 ? 12.5 : 0,
        trend: 'up' as const
      }
    ];

    // Agregar cards específicos por rol
    if (userRole === 'socio') {
      baseCards.push({
        title: 'Ahorro Este Mes',
        value: `$${effectiveStats.ahorroEsteMes.toLocaleString()}`,
        icon: <Calendar size={24} />,
        color: '#ec4899',
        subtitle: 'En el mes actual'
      });
    }

    if (userRole === 'asociacion') {
      baseCards.push({
        title: 'Comercios Activos',
        value: effectiveStats.comercios.length.toLocaleString(),
        icon: <Award size={24} />,
        color: '#06b6d4',
        subtitle: 'Con beneficios'
      });
    }

    return baseCards;
  }, [effectiveStats, userRole]);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCard
              key={index}
              title="Cargando..."
              value="..."
              icon={<Gift size={24} />}
              color="#6366f1"
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!effectiveStats) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <BarChart3 size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay estadísticas disponibles
        </h3>
        <p className="text-gray-500">
          Las estadísticas aparecerán cuando haya datos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Gráficos y datos adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Beneficios */}
        <motion.div
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {userRole === 'socio' ? 'Mis Beneficios' : 'Top Beneficios'}
              </h3>
              <p className="text-sm text-gray-600">
                {userRole === 'socio' ? 'Disponibles y utilizados' : 'Más utilizados'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {topBeneficiosSocio.length > 0 ? (
              topBeneficiosSocio.map((beneficio, index) => (
                <div key={beneficio.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {beneficio.titulo}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {beneficio.usos} usos • ${beneficio.ahorro.toLocaleString()} ahorrado
                    </p>
                    {userRole === 'socio' && (
                      <p className="text-xs text-blue-600">
                        {beneficio.comercio}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {beneficio.usos}
                    </div>
                    {beneficio.ahorro > 0 && (
                      <div className="text-xs text-green-600 font-semibold">
                        ${beneficio.ahorro}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <PieChart size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">
                  {userRole === 'socio' ? 'No tienes beneficios disponibles' : 'No hay datos disponibles'}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Categorías */}
        <motion.div
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {userRole === 'socio' ? 'Mis Categorías' : 'Categorías Populares'}
              </h3>
              <p className="text-sm text-gray-600">
                {userRole === 'socio' ? 'Beneficios por categoría' : 'Por cantidad de beneficios'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {categoriasSocio.length > 0 ? (
              categoriasSocio.map((categoria, index) => {
                const maxCantidad = Math.max(...categoriasSocio.map(c => c.cantidad));
                const percentage = maxCantidad > 0 ? (categoria.cantidad / maxCantidad) * 100 : 0;
                
                return (
                  <div key={categoria.nombre} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        {categoria.nombre}
                      </h4>
                      <div className="text-sm text-gray-600">
                        {categoria.cantidad} beneficios • {categoria.usos} usos
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <BarChart3 size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">
                  {userRole === 'socio' ? 'No tienes beneficios en categorías' : 'No hay datos disponibles'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Gráfico de usos por mes */}
      {effectiveStats.usosPorMes.length > 0 && (
        <motion.div
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tendencia Mensual</h3>
              <p className="text-sm text-gray-600">
                {userRole === 'socio' ? 'Tus usos y ahorros por mes' : 'Usos y ahorros por mes'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {effectiveStats.usosPorMes.slice(-6).map((mes, index) => {
              const maxUsos = Math.max(...effectiveStats.usosPorMes.map(m => m.usos));
              const height = maxUsos > 0 ? (mes.usos / maxUsos) * 100 : 0;
              
              return (
                <div key={mes.mes} className="text-center">
                  <div className="h-32 flex items-end justify-center mb-2">
                    <motion.div
                      className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="text-xs font-medium text-gray-900">
                    {format(new Date(mes.mes + '-01'), 'MMM', { locale: es })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {mes.usos} usos
                  </div>
                  <div className="text-xs text-green-600 font-semibold">
                    ${mes.ahorro.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};