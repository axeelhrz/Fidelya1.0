import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { format, subDays } from 'date-fns';

interface DashboardData {
  totalPatients: number;
  totalSessions: number;
  activeAlerts: number;
  todaySessions: any[];
  recentAlerts: any[];
  upcomingSessions: any[];
}

export function useSimpleDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    totalPatients: 0,
    totalSessions: 0,
    activeAlerts: 0,
    todaySessions: [],
    recentAlerts: [],
    upcomingSessions: []
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

        const today = format(new Date(), 'yyyy-MM-dd');
        const tomorrow = format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        const weekFromNow = format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

        // Obtener pacientes activos
        const patientsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/patients`),
            where('status', '==', 'active'),
            limit(50)
          )
        );
        const totalPatients = patientsSnapshot.size;

        // Obtener sesiones recientes
        const sessionsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/sessions`),
            orderBy('createdAt', 'desc'),
            limit(50)
          )
        );
        const allSessions = sessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));

        // Filtrar sesiones de hoy
        const todaySessions = allSessions.filter(session => {
          const sessionDate = session.date || format(session.createdAt, 'yyyy-MM-dd');
          return sessionDate === today;
        });

        // Filtrar próximas sesiones
        const upcomingSessions = allSessions.filter(session => {
          const sessionDate = session.date || format(session.createdAt, 'yyyy-MM-dd');
          return sessionDate >= tomorrow && sessionDate <= weekFromNow && session.status === 'scheduled';
        });

        // Obtener alertas recientes
        const alertsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/alerts`),
            orderBy('createdAt', 'desc'),
            limit(20)
          )
        );
        const allAlerts = alertsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));

        const activeAlerts = allAlerts.filter(alert => alert.status === 'activa').length;
        const recentAlerts = allAlerts.filter(alert => alert.status === 'activa').slice(0, 5);

        setData({
          totalPatients,
          totalSessions: allSessions.length,
          activeAlerts,
          todaySessions: todaySessions.slice(0, 5),
          recentAlerts,
          upcomingSessions: upcomingSessions.slice(0, 5)
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.centerId]); // Solo depende del centerId

  return { data, loading, error };
}
