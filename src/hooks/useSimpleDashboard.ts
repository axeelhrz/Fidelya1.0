import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { format, subDays, isToday, isFuture, isPast } from 'date-fns';

interface DashboardData {
  totalPatients: number;
  totalSessions: number;
  activeAlerts: number;
  todaySessions: any[];
  recentAlerts: any[];
  upcomingSessions: any[];
  completedSessionsThisWeek: number;
  averageSessionDuration: number;
  patientSatisfactionRate: number;
  aiAnalysisCount: number;
}

export function useSimpleDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    totalPatients: 0,
    totalSessions: 0,
    activeAlerts: 0,
    todaySessions: [],
    recentAlerts: [],
    upcomingSessions: [],
    completedSessionsThisWeek: 0,
    averageSessionDuration: 0,
    patientSatisfactionRate: 0,
    aiAnalysisCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const weekAgo = subDays(today, 7);
        const todayString = format(today, 'yyyy-MM-dd');
        const tomorrowString = format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        const weekFromNowString = format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

        // Obtener pacientes activos
        const patientsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/patients`),
            where('status', '==', 'active'),
            limit(100)
          )
        );
        const totalPatients = patientsSnapshot.size;

        // Obtener todas las sesiones recientes
        const sessionsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/sessions`),
            orderBy('createdAt', 'desc'),
            limit(100)
          )
        );
        
        const allSessions = sessionsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            date: data.date || format(data.createdAt?.toDate?.() || new Date(), 'yyyy-MM-dd'),
            duration: data.duration || 60,
            hasAiAnalysis: data.aiSummary ? true : false,
          };
        });

        // Filtrar sesiones de hoy
        const todaySessions = allSessions.filter(session => {
          const sessionDate = new Date(session.date);
          return isToday(sessionDate);
        }).slice(0, 5);

        // Filtrar próximas sesiones
        const upcomingSessions = allSessions.filter(session => {
          const sessionDate = new Date(session.date);
          return isFuture(sessionDate) && session.status === 'scheduled';
        }).slice(0, 5);

        // Calcular sesiones completadas esta semana
        const completedSessionsThisWeek = allSessions.filter(session => {
          const sessionDate = new Date(session.createdAt);
          return sessionDate >= weekAgo && session.status === 'completed';
        }).length;

        // Calcular duración promedio de sesiones
        const completedSessions = allSessions.filter(s => s.status === 'completed' && s.duration);
        const averageSessionDuration = completedSessions.length > 0 
          ? completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length
          : 60;

        // Contar sesiones con análisis de IA
        const aiAnalysisCount = allSessions.filter(s => s.hasAiAnalysis).length;

        // Obtener alertas activas
        const alertsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/alerts`),
            orderBy('createdAt', 'desc'),
            limit(50)
          )
        );
        
        const allAlerts = alertsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));

        const activeAlerts = allAlerts.filter(alert => alert.status === 'activa').length;
        const recentAlerts = allAlerts.filter(alert => alert.status === 'activa').slice(0, 5);

        // Calcular tasa de satisfacción (simulada)
        const patientSatisfactionRate = Math.min(100, 85 + Math.random() * 10);

        setData({
          totalPatients,
          totalSessions: allSessions.length,
          activeAlerts,
          todaySessions,
          recentAlerts,
          upcomingSessions,
          completedSessionsThisWeek,
          averageSessionDuration: Math.round(averageSessionDuration),
          patientSatisfactionRate: Math.round(patientSatisfactionRate),
          aiAnalysisCount,
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.centerId]);

  return { data, loading, error };
}