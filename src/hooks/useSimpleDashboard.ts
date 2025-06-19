import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { isToday, isFuture, startOfWeek, endOfWeek } from 'date-fns';

interface Patient {
  id: string;
  name: string;
  age: number;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'completed';
  riskLevel?: 'low' | 'medium' | 'high';
  lastSession?: Date;
}

interface Session {
  id: string;
  patientName: string;
  patientId: string;
  date: Date;
  duration: number;
  type: string;
  aiSummary?: string;
  emotionalTone?: 'positive' | 'neutral' | 'negative';
  status: 'completed' | 'in-progress' | 'scheduled';
  hasAiAnalysis: boolean;
  createdAt: Date;
}

interface Alert {
  id: string;
  type: 'appointment' | 'medication' | 'follow-up' | 'emergency' | 'custom';
  urgency: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  createdAt: Date;
  patientName?: string;
  status: string;
}

interface DashboardData {
  totalPatients: number;
  totalSessions: number;
  activeAlerts: number;
  todaySessions: Session[];
  recentAlerts: Alert[];
  upcomingSessions: Session[];
  recentPatients: Patient[];
  emotionalData: Record<string, number>;
  motivesData: Record<string, number>;
  completedSessionsThisWeek: number;
  averageSessionDuration: number;
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
    recentPatients: [],
    emotionalData: {},
    motivesData: {},
    completedSessionsThisWeek: 0,
    averageSessionDuration: 0,
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
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);

        // Obtener pacientes
        const patientsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/patients`),
            orderBy('createdAt', 'desc'),
            limit(100)
          )
        );
        
        const allPatients: Patient[] = patientsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Sin nombre',
            age: data.age || 0,
            registrationDate: data.createdAt?.toDate?.() || new Date(),
            status: data.status || 'active',
            riskLevel: data.riskLevel,
            lastSession: data.lastSessionDate?.toDate?.(),
          };
        });

        const activePatients = allPatients.filter(p => p.status === 'active');
        const recentPatients = allPatients.slice(0, 5);

        // Obtener sesiones
        const sessionsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/sessions`),
            orderBy('createdAt', 'desc'),
            limit(100)
          )
        );
        
        const allSessions: Session[] = sessionsSnapshot.docs.map(doc => {
          const data = doc.data();
          const sessionDate = data.date?.toDate?.() || data.createdAt?.toDate?.() || new Date();
          
          return {
            id: doc.id,
            patientName: data.patientName || 'Paciente',
            patientId: data.patientId || '',
            date: sessionDate,
            duration: data.duration || 60,
            type: data.type || 'Sesión',
            aiSummary: data.aiSummary,
            emotionalTone: data.emotionalTone,
            status: data.status || 'completed',
            hasAiAnalysis: Boolean(data.aiSummary || data.aiAnalysis),
            createdAt: data.createdAt?.toDate?.() || new Date(),
          };
        });

        // Filtrar sesiones de hoy
        const todaySessions = allSessions.filter(session => 
          isToday(session.date)
        ).slice(0, 5);

        // Filtrar próximas sesiones
        const upcomingSessions = allSessions.filter(session => 
          isFuture(session.date) && session.status === 'scheduled'
        ).slice(0, 5);

        // Calcular sesiones completadas esta semana
        const completedSessionsThisWeek = allSessions.filter(session => 
          session.status === 'completed' && 
          session.createdAt >= weekStart && 
          session.createdAt <= weekEnd
        ).length;

        // Calcular duración promedio
        const completedSessions = allSessions.filter(s => s.status === 'completed' && s.duration > 0);
        const averageSessionDuration = completedSessions.length > 0 
          ? Math.round(completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length)
          : 0;

        // Contar análisis de IA
        const aiAnalysisCount = allSessions.filter(s => s.hasAiAnalysis).length;

        // Procesar datos emocionales de las sesiones
        const emotionalData: Record<string, number> = {};
        allSessions.forEach(session => {
          if (session.emotionalTone) {
            const tone = session.emotionalTone === 'positive' ? 'Positivo' :
                         session.emotionalTone === 'negative' ? 'Negativo' : 'Neutral';
            emotionalData[tone] = (emotionalData[tone] || 0) + 1;
          }
        });

        // Procesar motivos de consulta de los pacientes
        const motivesData: Record<string, number> = {};
        // TODO: Implementar obtención de motivos de consulta de pacientes
        // allPatients.forEach(patient => {
        //   // Aquí deberías obtener el motivo de consulta del paciente
        //   // Por ahora usamos tipos de sesión como proxy
        // });

        // Si no hay datos emocionales de sesiones, usar datos de pacientes si están disponibles
        if (Object.keys(emotionalData).length === 0) {
          // Obtener datos emocionales de evaluaciones de pacientes
          const evaluationsSnapshot = await getDocs(
            query(
              collection(db, `centers/${user.centerId}/evaluations`),
              orderBy('createdAt', 'desc'),
              limit(50)
            )
          );

          evaluationsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.emotionalState) {
              emotionalData[data.emotionalState] = (emotionalData[data.emotionalState] || 0) + 1;
            }
          });
        }

        // Procesar tipos de sesión como motivos
        allSessions.forEach(session => {
          if (session.type && session.type !== 'Sesión') {
            motivesData[session.type] = (motivesData[session.type] || 0) + 1;
          }
        });

        // Obtener alertas
        const alertsSnapshot = await getDocs(
          query(
            collection(db, `centers/${user.centerId}/alerts`),
            orderBy('createdAt', 'desc'),
            limit(50)
          )
        );
        
        const allAlerts: Alert[] = alertsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type || 'custom',
            urgency: data.urgency || 'low',
            title: data.title || 'Alerta',
            description: data.description || '',
            createdAt: data.createdAt?.toDate?.() || new Date(),
            patientName: data.patientName,
            status: data.status || 'active',
          };
        });

        const activeAlerts = allAlerts.filter(alert => alert.status === 'active' || alert.status === 'activa');
        const recentAlerts = activeAlerts.slice(0, 5);

        setData({
          totalPatients: activePatients.length,
          totalSessions: allSessions.length,
          activeAlerts: activeAlerts.length,
          todaySessions,
          recentAlerts,
          upcomingSessions,
          recentPatients,
          emotionalData,
          motivesData,
          completedSessionsThisWeek,
          averageSessionDuration,
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