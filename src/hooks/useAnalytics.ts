'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useValidaciones } from './useValidaciones';
import { useBeneficios } from './useBeneficios';
import { format, startOfDay, endOfDay, eachDayOfInterval, getHours } from 'date-fns';
import { es } from 'date-fns/locale';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsData {
  // KPI Data
  totalValidaciones: number;
  promedioDiario: number;
  asociacionesActivas: number;
  beneficioMasUsado: {
    nombre: string;
    usos: number;
  } | null;
  
  // Chart Data
  dailyValidations: Array<{
    fecha: string;
    validaciones: number;
    exitosas: number;
    fallidas: number;
  }>;
  
  byAssociation: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  
  hourlyActivity: Array<{
    hora: string;
    total: number;
  }>;
  
  topDays: Array<{
    fecha: string;
    validaciones: number;
    isRecord: boolean;
  }>;
  
  topBenefits: Array<{
    id: string;
    nombre: string;
    asociacion: string;
    usos: number;
    estado: 'activo' | 'inactivo';
  }>;
}

const CHART_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

export const useAnalytics = (dateRange: DateRange) => {
  const { user } = useAuth();
  const { validaciones } = useValidaciones();
  const { beneficios } = useBeneficios();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalValidaciones: 0,
    promedioDiario: 0,
    asociacionesActivas: 0,
    beneficioMasUsado: null,
    dailyValidations: [],
    byAssociation: [],
    hourlyActivity: [],
    topDays: [],
    topBenefits: [],
  });
  const [loading, setLoading] = useState(true);

  const processAnalyticsData = useCallback(() => {
    if (!user || !validaciones.length) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Filter validaciones by date range
      const filteredValidaciones = validaciones.filter(v => {
        const vDate = v.fechaHora.toDate();
        return vDate >= startOfDay(dateRange.startDate) && vDate <= endOfDay(dateRange.endDate);
      });

      // Calculate KPIs
      const totalValidaciones = filteredValidaciones.length;
      const daysDiff = Math.max(1, Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const promedioDiario = totalValidaciones / daysDiff;

      // Get unique associations
      const asociacionesActivas = new Set(filteredValidaciones.map(v => v.asociacionId)).size;

      // Calculate most used benefit
      const beneficioUsos: Record<string, number> = {};
      filteredValidaciones.forEach(v => {
        beneficioUsos[v.beneficioId] = (beneficioUsos[v.beneficioId] || 0) + 1;
      });

      const beneficioMasUsadoId = Object.entries(beneficioUsos).sort(([,a], [,b]) => b - a)[0];
      const beneficioMasUsado = beneficioMasUsadoId ? {
        nombre: beneficios.find(b => b.id === beneficioMasUsadoId[0])?.titulo || 'Desconocido',
        usos: beneficioMasUsadoId[1]
      } : null;

      // Daily validations chart data
      const allDays = eachDayOfInterval({ start: dateRange.startDate, end: dateRange.endDate });
      const dailyValidations = allDays.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);
        
        const dayValidaciones = filteredValidaciones.filter(v => {
          const vDate = v.fechaHora.toDate();
          return vDate >= dayStart && vDate <= dayEnd;
        });

        const exitosas = dayValidaciones.filter(v => v.resultado === 'valido').length;
        const fallidas = dayValidaciones.length - exitosas;

        return {
          fecha: format(day, 'dd/MM', { locale: es }),
          validaciones: dayValidaciones.length,
          exitosas,
          fallidas,
        };
      });

      // By association chart data
      const asociacionCounts: Record<string, number> = {};
      filteredValidaciones.forEach(v => {
        asociacionCounts[v.asociacionId] = (asociacionCounts[v.asociacionId] || 0) + 1;
      });

      const byAssociation = Object.entries(asociacionCounts)
        .map(([asociacionId, count], index) => ({
          name: `Asociación ${asociacionId.substring(0, 8)}...`,
          value: count,
          percentage: (count / totalValidaciones) * 100,
          color: CHART_COLORS[index % CHART_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      // Hourly activity data
      const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
        const hourValidaciones = filteredValidaciones.filter(v => 
          getHours(v.fechaHora.toDate()) === hour
        );

        return {
          hora: `${hour.toString().padStart(2, '0')}:00`,
          total: hourValidaciones.length,
        };
      });

      // Top days data
      const topDays = dailyValidations
        .filter(day => day.validaciones > 0)
        .sort((a, b) => b.validaciones - a.validaciones)
        .slice(0, 5)
        .map((day, index) => ({
          fecha: day.fecha,
          validaciones: day.validaciones,
          isRecord: index === 0,
        }));

      // Top benefits data
      const topBenefits = Object.entries(beneficioUsos)
        .map(([beneficioId, usos]) => {
          const beneficio = beneficios.find(b => b.id === beneficioId);
          return {
            id: beneficioId,
            nombre: beneficio?.titulo || 'Beneficio Desconocido',
            asociacion: beneficio?.asociacionesVinculadas[0] || 'N/A',
            usos,
            estado: beneficio?.estado || 'inactivo' as const,
          };
        })
        .sort((a, b) => b.usos - a.usos)
        .slice(0, 10);

      setAnalyticsData({
        totalValidaciones,
        promedioDiario,
        asociacionesActivas,
        beneficioMasUsado,
        dailyValidations,
        byAssociation,
        hourlyActivity,
        topDays,
        topBenefits,
      });

    } catch (error) {
      console.error('Error processing analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, validaciones, beneficios, dateRange]);

  useEffect(() => {
    processAnalyticsData();
  }, [processAnalyticsData]);

  // Export functionality
  const exportToCSV = useCallback(() => {
    const csvData = [
      ['Métrica', 'Valor'],
      ['Total Validaciones', analyticsData.totalValidaciones.toString()],
      ['Promedio Diario', analyticsData.promedioDiario.toFixed(2)],
      ['Asociaciones Activas', analyticsData.asociacionesActivas.toString()],
      ['Beneficio Más Usado', analyticsData.beneficioMasUsado?.nombre || 'N/A'],
      ['Usos del Beneficio Más Usado', analyticsData.beneficioMasUsado?.usos.toString() || '0'],
      [''],
      ['Validaciones Diarias'],
      ['Fecha', 'Total', 'Exitosas', 'Fallidas'],
      ...analyticsData.dailyValidations.map(day => [
        day.fecha,
        day.validaciones.toString(),
        day.exitosas.toString(),
        day.fallidas.toString(),
      ]),
      [''],
      ['Top Beneficios'],
      ['Nombre', 'Usos', 'Estado'],
      ...analyticsData.topBenefits.map(benefit => [
        benefit.nombre,
        benefit.usos.toString(),
        benefit.estado,
      ]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [analyticsData]);

  return {
    analyticsData,
    loading,
    exportToCSV,
    refresh: processAnalyticsData,
  };
};
