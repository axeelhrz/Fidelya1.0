'use client';

import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { KPIMetric, Alert, Task, FinancialMetrics, ClinicalMetrics } from '@/types/dashboard';

// Datos mock para desarrollo
const mockKPIMetrics: KPIMetric[] = [
  {
    id: 'revenue',
    name: 'Ingresos Mensuales',
    value: 89750,
    previousValue: 78200,
    trend: 'up',
    status: 'success',
    unit: '$',
    sparklineData: [65000, 72000, 68000, 75000, 82000, 78000, 89750],
    target: 95000
  },
  {
    id: 'patients',
    name: 'Pacientes Activos',
    value: 247,
    previousValue: 228,
    trend: 'up',
    status: 'success',
    unit: '',
    sparklineData: [200, 215, 225, 235, 240, 245, 247],
    target: 300
  },
  {
    id: 'sessions',
    name: 'Sesiones Completadas',
    value: 156,
    previousValue: 142,
    trend: 'up',
    status: 'success',
    unit: '',
    sparklineData: [120, 125, 135, 140, 145, 150, 156],
    target: 180
  },
  {
    id: 'satisfaction',
    name: 'Satisfacción del Cliente',
    value: 94.2,
    previousValue: 91.8,
    trend: 'up',
    status: 'success',
    unit: '%',
    sparklineData: [88, 89, 90, 91, 92, 93, 94.2],
    target: 95
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Certificado SSL próximo a expirar',
    description: 'El certificado SSL expira en 7 días',
    level: 'critical',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    actionUrl: '/settings/ssl',
    type: 'system'
  },
  {
    id: '2',
    title: 'Saldo bajo en cuenta principal',
    description: 'Quedan $2,450 en la cuenta operativa',
    level: 'critical',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: false,
    type: 'financial'
  },
  {
    id: '3',
    title: 'Stock bajo: Tests PHQ-9',
    description: 'Quedan 12 unidades, reordenar pronto',
    level: 'warning',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isRead: true,
    type: 'operational'
  },
  {
    id: '4',
    title: 'Alta rotación detectada',
    description: '3 terapeutas han solicitado cambio de horario',
    level: 'warning',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isRead: false,
    type: 'clinical'
  },
  {
    id: '5',
    title: 'Backup completado exitosamente',
    description: 'Backup automático de base de datos completado',
    level: 'info',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    type: 'system'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar expedientes pendientes',
    description: 'Validar 15 expedientes que requieren firma',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Dr. García',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: 'administrative'
  },
  {
    id: '2',
    title: 'Actualizar protocolos COVID',
    description: 'Revisar y actualizar protocolos según nuevas normativas',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Dra. López',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: 'clinical'
  },
  {
    id: '3',
    title: 'Capacitación nuevo software',
    description: 'Organizar sesión de capacitación para el equipo',
    status: 'todo',
    priority: 'low',
    assignedTo: 'Admin',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: 'administrative'
  },
  {
    id: '4',
    title: 'Renovar licencias software',
    description: 'Renovar licencias de software clínico antes del vencimiento',
    status: 'done',
    priority: 'high',
    assignedTo: 'Admin',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: 'administrative'
  }
];

const mockFinancialMetrics: FinancialMetrics = {
  revenue: {
    mtd: 89750,
    ytd: 987500,
    projection: [95000, 102000, 108000, 115000, 122000, 128000]
  },
  expenses: {
    mtd: 45200,
    ytd: 498200,
    projection: [47000, 48500, 50000, 51500, 53000, 54500]
  },
  ebitda: 44550,
  burnRate: [42000, 43500, 45200, 46800, 48200],
  earnRate: [78000, 82000, 89750, 95000, 102000],
  cac: 125,
  ltv: 2850,
  arpu: 365,
  churnRate: 3.2
};

const mockClinicalMetrics: ClinicalMetrics = {
  occupancyRate: 87.5,
  cancellationRate: 8.2,
  noShowRate: 4.1,
  averagePhq9: 12.3,
  averageGad7: 10.8,
  adherenceRate: 92.1,
  riskPatients: 23,
  averageSessionsPerPatient: 8.5,
  improvementRate: 78.9,
  dischargeRate: 15.2
};

// Hook para simular carga de datos
function useSimulatedData<T>(data: T, delay: number = 1000) {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(data);
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay]);

  return { data: state, loading };
}

export function useKPIMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      return;
    }

    // Intentar conectar con Firebase, pero usar datos mock si falla
    const tryFirebaseConnection = async () => {
      try {
        // Simular intento de conexión con Firebase
        const unsubscribe = onSnapshot(
          doc(db, 'centers', user.centerId, 'metrics', 'kpis'),
          (doc) => {
            if (doc.exists()) {
              setMetrics(doc.data().metrics || []);
            } else {
              // Si no hay datos en Firebase, usar mock
              setMetrics(mockKPIMetrics);
            }
            setLoading(false);
          },
          (error) => {
            console.warn('Firebase connection failed, using mock data:', error.message);
            // En caso de error, usar datos mock
            setMetrics(mockKPIMetrics);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.warn('Firebase initialization failed, using mock data:', error);
        setMetrics(mockKPIMetrics);
        setLoading(false);
      }
    };

    tryFirebaseConnection();
  }, [user?.centerId]);

  return { metrics, loading };
}

export function useAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      return;
    }

    // Intentar conectar con Firebase, pero usar datos mock si falla
    const tryFirebaseConnection = async () => {
      try {
        const q = query(
          collection(db, 'centers', user.centerId, 'alerts'),
          orderBy('timestamp', 'desc'),
          limit(20)
        );

        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const alertsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp.toDate()
            })) as Alert[];
            
            setAlerts(alertsData.length > 0 ? alertsData : mockAlerts);
            setLoading(false);
          },
          (error) => {
            console.warn('Firebase alerts connection failed, using mock data:', error.message);
            setAlerts(mockAlerts);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.warn('Firebase alerts initialization failed, using mock data:', error);
        setAlerts(mockAlerts);
        setLoading(false);
      }
    };

    tryFirebaseConnection();
  }, [user?.centerId]);

  return { alerts, loading };
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      return;
    }

    // Intentar conectar con Firebase, pero usar datos mock si falla
    const tryFirebaseConnection = async () => {
      try {
        const q = query(
          collection(db, 'centers', user.centerId, 'tasks'),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q,
          (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              dueDate: doc.data().dueDate.toDate(),
              createdAt: doc.data().createdAt.toDate()
            })) as Task[];
            
            setTasks(tasksData.length > 0 ? tasksData : mockTasks);
            setLoading(false);
          },
          (error) => {
            console.warn('Firebase tasks connection failed, using mock data:', error.message);
            setTasks(mockTasks);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.warn('Firebase tasks initialization failed, using mock data:', error);
        setTasks(mockTasks);
        setLoading(false);
      }
    };

    tryFirebaseConnection();
  }, [user?.centerId]);

  return { tasks, loading };
}

export function useFinancialMetrics() {
  const { user } = useAuth();
  const { data: metrics, loading } = useSimulatedData(mockFinancialMetrics, 800);

  return { metrics, loading };
}

export function useClinicalMetrics() {
  const { user } = useAuth();
  const { data: metrics, loading } = useSimulatedData(mockClinicalMetrics, 600);

  return { metrics, loading };
}

// Funciones para manipular datos (simuladas)
export const updateAlert = async (alertId: string, updates: Partial<Alert>) => {
  // Simular actualización
  console.log('Updating alert:', alertId, updates);
  return Promise.resolve();
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
  // Simular creación
  console.log('Creating task:', task);
  return Promise.resolve();
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  // Simular actualización
  console.log('Updating task:', taskId, updates);
  return Promise.resolve();
};

export const deleteTask = async (taskId: string) => {
  // Simular eliminación
  console.log('Deleting task:', taskId);
  return Promise.resolve();
};