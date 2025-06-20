import { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { 
  DashboardMetrics, 
  MetricsFilters, 
  TimeSeriesData, 
  EmotionalTrendData,
  MetricsCalculationOptions,
  DEFAULT_CALCULATION_OPTIONS
} from '@/types/metrics';
import { Session, EmotionalTone } from '@/types/session';
import { Patient } from '@/types/patient';
import { ClinicalAlert } from '@/types/alert';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';

// Helper function to convert Timestamp to Date
const convertToDate = (value: Date | Timestamp | string): Date => {
  if (value instanceof Date) {
    return value;
  }
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate();
  }
  if (typeof value === 'string') {
    return new Date(value);
  }
  return new Date();
};

// Helper function to format date safely
const formatDateSafely = (value: Date | Timestamp | string, formatStr: string = 'yyyy-MM-dd'): string => {
  try {
    const date = convertToDate(value);
    return format(date, formatStr);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return format(new Date(), formatStr);
  }
};

export function useMetrics(
  filters: MetricsFilters,
  options: MetricsCalculationOptions = DEFAULT_CALCULATION_OPTIONS
) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos base para cálculos
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>([]);

  // Obtener datos de Firestore con manejo de errores mejorado
  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Crear promesas para todas las consultas
        const promises = [];

        // Obtener sesiones con consulta simple
        const sessionsPromise = getDocs(
          query(
            collection(db, `centers/${user.centerId}/sessions`),
            orderBy('createdAt', 'desc'),
            limit(100) // Limitar para evitar problemas de rendimiento
          )
        ).then(snapshot => {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
          })) as Session[];
        });

        // Obtener pacientes con consulta simple
        const patientsPromise = getDocs(
          query(
            collection(db, `centers/${user.centerId}/patients`),
            orderBy('createdAt', 'desc'),
            limit(100)
          )
        ).then(snapshot => {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
          })) as Patient[];
        });

        // Obtener alertas con consulta simple
        const alertsPromise = getDocs(
          query(
            collection(db, `centers/${user.centerId}/alerts`),
            orderBy('createdAt', 'desc'),
            limit(50)
          )
        ).then(snapshot => {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
          })) as ClinicalAlert[];
        });

        promises.push(sessionsPromise, patientsPromise, alertsPromise);

        // Ejecutar todas las consultas en paralelo con timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: Las consultas tardaron demasiado')), 10000);
        });

        const results = await Promise.race([
          Promise.all(promises),
          timeoutPromise
        ]) as [Session[], Patient[], ClinicalAlert[]];

        const [sessionsData, patientsData, alertsData] = results;

        // Filtrar datos en el cliente para evitar consultas complejas
        const startDate = parseISO(filters.dateRange.start);
        const endDate = parseISO(filters.dateRange.end);

        // Filtrar sesiones
        const filteredSessions = sessionsData.filter(session => {
          const sessionDateValue = session.date || session.createdAt;
          const sessionDate = convertToDate(sessionDateValue);
          if (sessionDate < startDate || sessionDate > endDate) return false;
          if (filters.professionalId && session.professionalId !== filters.professionalId) return false;
          if (filters.patientId && session.patientId !== filters.patientId) return false;
          if (filters.sessionType && session.type !== filters.sessionType) return false;
          if (filters.emotionalTone && session.aiAnalysis?.emotionalTone !== filters.emotionalTone) return false;
          if (options.excludeCancelledSessions && session.status === 'cancelled') return false;
          return true;
        });

        // Filtrar pacientes
        const filteredPatients = patientsData.filter(patient => {
          if (!filters.includeInactive && patient.status !== 'active') return false;
          if (filters.emotionalTone && patient.emotionalState !== filters.emotionalTone) return false;
          return true;
        });

        // Filtrar alertas
        const filteredAlerts = alertsData.filter(alert => {
          const alertDate = convertToDate(alert.createdAt);
          if (alertDate < startDate || alertDate > endDate) return false;
          if (filters.patientId && alert.patientId !== filters.patientId) return false;
          if (filters.alertType && alert.type !== filters.alertType) return false;
          return true;
        });

        setSessions(filteredSessions);
        setPatients(filteredPatients);
        setAlerts(filteredAlerts);

      } catch (err) {
        console.error('Error fetching metrics data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los datos de métricas');
        
        // Establecer datos vacíos en caso de error
        setSessions([]);
        setPatients([]);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    user?.centerId, 
    filters.dateRange.start, 
    filters.dateRange.end,
    filters.alertType,
    filters.emotionalTone,
    filters.includeInactive,
    filters.patientId,
    filters.professionalId,
    filters.sessionType,
    options.excludeCancelledSessions
  ]);

  // Calcular métricas basadas en los datos con valores por defecto
  const calculatedMetrics = useMemo((): DashboardMetrics => {
    // Métricas básicas con valores por defecto
    const totalActivePatients = patients.filter(p => p.status === 'active').length;
    const totalSessions = sessions.length;
    const averageSessionsPerPatient = totalActivePatients > 0 ? totalSessions / totalActivePatients : 0;

    // Alertas
    const activeAlerts = alerts.filter(a => a.status === 'activa').length;
    const resolvedAlerts = alerts.filter(a => a.status === 'resuelta').length;

    // Distribución emocional con valores por defecto
    const emotionalDistribution: Record<string, number> = {};
    
    // Emociones de pacientes
    patients.forEach(patient => {
      if (patient.emotionalState) {
        const emotion = patient.emotionalState;
        emotionalDistribution[emotion] = (emotionalDistribution[emotion] || 0) + 1;
      }
    });

    // Emociones de sesiones con IA
    sessions.forEach(session => {
      if (session.aiAnalysis?.emotionalTone) {
        const emotion = session.aiAnalysis.emotionalTone;
        emotionalDistribution[emotion] = (emotionalDistribution[emotion] || 0) + 1;
      }
    });

    // Distribución de motivos de consulta
    const motivesDistribution: Record<string, number> = {};
    patients.forEach(patient => {
      if (patient.motivoConsulta) {
        const motivo = patient.motivoConsulta;
        motivesDistribution[motivo] = (motivesDistribution[motivo] || 0) + 1;
      }
    });

    // Distribución de tipos de sesión
    const sessionTypeDistribution: Record<string, number> = {};
    sessions.forEach(session => {
      if (session.type) {
        sessionTypeDistribution[session.type] = (sessionTypeDistribution[session.type] || 0) + 1;
      }
    });

    // Distribución de alertas
    const alertTypeDistribution: Record<string, number> = {};
    const alertUrgencyDistribution: Record<string, number> = {};
    alerts.forEach(alert => {
      if (alert.type) {
        alertTypeDistribution[alert.type] = (alertTypeDistribution[alert.type] || 0) + 1;
      }
      if (alert.urgency) {
        alertUrgencyDistribution[alert.urgency] = (alertUrgencyDistribution[alert.urgency] || 0) + 1;
      }
    });

    // Tendencias temporales - sesiones por día
    const dateRange = eachDayOfInterval({
      start: parseISO(filters.dateRange.start),
      end: parseISO(filters.dateRange.end)
    });

    const sessionsOverTime: TimeSeriesData[] = dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySessions = sessions.filter(s => {
        const sessionDate = s.date || formatDateSafely(s.createdAt);
        return sessionDate === dateStr;
      });
      return {
        date: dateStr,
        value: daySessions.length,
        label: format(date, 'dd/MM')
      };
    });

    // Tendencias de pacientes nuevos por día
    const patientsOverTime: TimeSeriesData[] = dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayPatients = patients.filter(p => {
        const createdDate = formatDateSafely(p.createdAt);
        return createdDate === dateStr;
      });
      return {
        date: dateStr,
        value: dayPatients.length,
        label: format(date, 'dd/MM')
      };
    });

    // Tendencias emocionales
    const emotionalTrendsOverTime: EmotionalTrendData[] = [];
    dateRange.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySessions = sessions.filter(s => {
        const sessionDate = s.date || formatDateSafely(s.createdAt);
        return sessionDate === dateStr && s.aiAnalysis?.emotionalTone;
      });
      
      const emotionCounts: Record<string, number> = {};
      daySessions.forEach(session => {
        if (session.aiAnalysis?.emotionalTone) {
          const emotion = session.aiAnalysis.emotionalTone;
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        }
      });

      Object.entries(emotionCounts).forEach(([emotion, count]) => {
        emotionalTrendsOverTime.push({
          date: dateStr,
          emotion: emotion as EmotionalTone,
          count,
          percentage: daySessions.length > 0 ? (count / daySessions.length) * 100 : 0
        });
      });
    });

    // Tasa de seguimiento (pacientes con 2+ sesiones)
    const patientSessionCounts: Record<string, number> = {};
    sessions.forEach(session => {
      if (session.patientId) {
        patientSessionCounts[session.patientId] = (patientSessionCounts[session.patientId] || 0) + 1;
      }
    });
    
    const patientsWithMultipleSessions = Object.values(patientSessionCounts)
      .filter(count => count >= (options.minimumSessionsForFollowUp || 2)).length;
    const followUpRate = totalActivePatients > 0 ? (patientsWithMultipleSessions / totalActivePatients) * 100 : 0;

    // Carga de trabajo por profesional
    const professionalWorkload: Record<string, number> = {};
    sessions.forEach(session => {
      if (session.professionalId) {
        professionalWorkload[session.professionalId] = (professionalWorkload[session.professionalId] || 0) + 1;
      }
    });

    // Métricas de riesgo basadas en análisis de IA
    const riskCounts = { high: 0, medium: 0, low: 0 };
    sessions.forEach(session => {
      if (session.aiAnalysis?.riskLevel) {
        riskCounts[session.aiAnalysis.riskLevel]++;
      }
    });

    // Tiempo promedio entre sesiones
    const sessionsByPatient: Record<string, Session[]> = {};
    sessions.forEach(session => {
      if (session.patientId) {
        if (!sessionsByPatient[session.patientId]) {
          sessionsByPatient[session.patientId] = [];
        }
        sessionsByPatient[session.patientId].push(session);
      }
    });

    let totalDaysBetweenSessions = 0;
    let sessionPairs = 0;

    Object.values(sessionsByPatient).forEach(patientSessions => {
      if (patientSessions.length >= 2) {
        const sortedSessions = patientSessions.sort((a, b) => {
          const dateA = a.date || formatDateSafely(a.createdAt);
          const dateB = b.date || formatDateSafely(b.createdAt);
          return dateA.localeCompare(dateB);
        });
        
        for (let i = 1; i < sortedSessions.length; i++) {
          const dateA = sortedSessions[i-1].date || formatDateSafely(sortedSessions[i-1].createdAt);
          const dateB = sortedSessions[i].date || formatDateSafely(sortedSessions[i].createdAt);
          
          const daysDiff = Math.abs(
            (parseISO(dateB).getTime() - parseISO(dateA).getTime()) 
            / (1000 * 60 * 60 * 24)
          );
          totalDaysBetweenSessions += daysDiff;
          sessionPairs++;
        }
      }
    });

    const averageTimeBetweenSessions = sessionPairs > 0 ? totalDaysBetweenSessions / sessionPairs : 0;

    return {
      totalActivePatients,
      totalSessions,
      averageSessionsPerPatient: Math.round(averageSessionsPerPatient * 100) / 100,
      activeAlerts,
      resolvedAlerts,
      emotionalDistribution,
      motivesDistribution,
      sessionTypeDistribution,
      alertTypeDistribution,
      alertUrgencyDistribution,
      sessionsOverTime,
      patientsOverTime,
      emotionalTrendsOverTime,
      followUpRate: Math.round(followUpRate * 100) / 100,
      averageTimeBetweenSessions: Math.round(averageTimeBetweenSessions * 100) / 100,
      professionalWorkload,
      highRiskPatients: riskCounts.high,
      mediumRiskPatients: riskCounts.medium,
      lowRiskPatients: riskCounts.low,
      calculatedAt: new Date(),
      periodStart: parseISO(filters.dateRange.start),
      periodEnd: parseISO(filters.dateRange.end)
    };
  }, [
    sessions, 
    patients, 
    alerts, 
    filters.dateRange.start, 
    filters.dateRange.end,
    options.minimumSessionsForFollowUp
  ]);

  // REMOVED: The problematic useEffect that was causing the infinite loop
  // useEffect(() => {
  //   setMetrics(calculatedMetrics);
  // }, [calculatedMetrics]);

  // Instead, directly use the calculated metrics
  useEffect(() => {
    setMetrics(calculatedMetrics);
  }, [calculatedMetrics]);

  return {
    metrics,
    loading,
    error,
    rawData: {
      sessions,
      patients,
      alerts
    }
  };
}

// Hook para métricas comparativas simplificado
export function useComparativeMetrics(filters: MetricsFilters) {
  const currentPeriod = useMetrics(filters);
  
  // Calcular período anterior del mismo tamaño
  const startDate = parseISO(filters.dateRange.start);
  const endDate = parseISO(filters.dateRange.end);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const previousStart = format(subDays(startDate, daysDiff), 'yyyy-MM-dd');
  const previousEnd = format(subDays(startDate, 1), 'yyyy-MM-dd');
  
  const previousPeriod = useMetrics({
    ...filters,
    dateRange: {
      start: previousStart,
      end: previousEnd
    }
  });

  const comparison = useMemo(() => {
    if (!currentPeriod.metrics || !previousPeriod.metrics) return null;

    const current = currentPeriod.metrics;
    const previous = previousPeriod.metrics;

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      totalActivePatients: {
        current: current.totalActivePatients,
        previous: previous.totalActivePatients,
        change: calculateChange(current.totalActivePatients, previous.totalActivePatients)
      },
      totalSessions: {
        current: current.totalSessions,
        previous: previous.totalSessions,
        change: calculateChange(current.totalSessions, previous.totalSessions)
      },
      averageSessionsPerPatient: {
        current: current.averageSessionsPerPatient,
        previous: previous.averageSessionsPerPatient,
        change: calculateChange(current.averageSessionsPerPatient, previous.averageSessionsPerPatient)
      },
      activeAlerts: {
        current: current.activeAlerts,
        previous: previous.activeAlerts,
        change: calculateChange(current.activeAlerts, previous.activeAlerts)
      },
      followUpRate: {
        current: current.followUpRate,
        previous: previous.followUpRate,
        change: calculateChange(current.followUpRate, previous.followUpRate)
      }
    };
  }, [currentPeriod.metrics, previousPeriod.metrics]);

  return {
    current: currentPeriod,
    previous: previousPeriod,
    comparison,
    loading: currentPeriod.loading || previousPeriod.loading,
    error: currentPeriod.error || previousPeriod.error
  };
}
