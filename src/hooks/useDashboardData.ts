'use client';

import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, where, orderBy, limit, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      setError('No hay centro asignado');
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'centers', user.centerId, 'metrics', 'kpis'),
      (doc) => {
        if (doc.exists()) {
          setMetrics(doc.data().metrics || []);
          setError(null);
        } else {
          setMetrics([]);
          setError('No hay métricas KPI configuradas');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading KPI metrics:', error);
        setError(`Error de conexión: ${error.message}`);
        setMetrics([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.centerId]);

  return { metrics, loading, error };
}

export function useAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      setError('No hay centro asignado');
      return;
    }

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
        
        setAlerts(alertsData);
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading alerts:', error);
        setError(`Error cargando alertas: ${error.message}`);
        setAlerts([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.centerId]);

  return { alerts, loading, error };
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      setError('No hay centro asignado');
      return;
    }

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
        
        setTasks(tasksData);
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading tasks:', error);
        setError(`Error cargando tareas: ${error.message}`);
        setTasks([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.centerId]);

  return { tasks, loading, error };
}

export function useFinancialMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      setError('No hay centro asignado');
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'centers', user.centerId, 'metrics', 'financial'),
      (doc) => {
        if (doc.exists()) {
          setMetrics(doc.data() as FinancialMetrics);
          setError(null);
        } else {
          setMetrics(null);
          setError('No hay métricas financieras configuradas');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading financial metrics:', error);
        setError(`Error cargando métricas financieras: ${error.message}`);
        setMetrics(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.centerId]);

  return { metrics, loading, error };
}

export function useClinicalMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ClinicalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.centerId) {
      setLoading(false);
      setError('No hay centro asignado');
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'centers', user.centerId, 'metrics', 'clinical'),
      (doc) => {
        if (doc.exists()) {
          setMetrics(doc.data() as ClinicalMetrics);
          setError(null);
        } else {
          setMetrics(null);
          setError('No hay métricas clínicas configuradas');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading clinical metrics:', error);
        setError(`Error cargando métricas clínicas: ${error.message}`);
        setMetrics(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.centerId]);

  return { metrics, loading, error };
}

// Hook personalizado para datos financieros detallados calculados desde Firebase
export function useFinancialData() {
  const { user } = useAuth();
  const [data, setData] = useState({
    monthlyData: [] as any[],
    paymentsData: [] as any[],
    expensesBreakdown: [] as any[],
    totalStats: {
      totalRevenue: 0,
      totalExpenses: 0,
      totalProfit: 0,
      averageGrowth: 0,
      pendingPayments: 0,
      overduePayments: 0,
      totalSessions: 0,
      avgSessionValue: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFinancialData = async () => {
      if (!user?.centerId) {
        setLoading(false);
        setError('No hay centro asignado');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Cargar sesiones completadas
        const sessionsQuery = query(
          collection(db, 'centers', user.centerId, 'sessions'),
          where('status', '==', 'completed'),
          orderBy('date', 'desc'),
          limit(200)
        );

        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessions = sessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));

        // Cargar pagos
        const paymentsQuery = query(
          collection(db, 'centers', user.centerId, 'payments'),
          orderBy('date', 'desc'),
          limit(100)
        );

        const paymentsSnapshot = await getDocs(paymentsQuery);
        const payments = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));

        // Cargar gastos
        const expensesQuery = query(
          collection(db, 'centers', user.centerId, 'expenses'),
          orderBy('date', 'desc'),
          limit(100)
        );

        const expensesSnapshot = await getDocs(expensesQuery);
        const expenses = expensesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));

        // Procesar datos
        const monthlyData = processMonthlyData(sessions, expenses);
        const totalStats = calculateStats(sessions, payments, expenses);
        const expensesBreakdown = processExpensesBreakdown(expenses);

        setData({
          monthlyData,
          paymentsData: payments,
          expensesBreakdown,
          totalStats
        });

      } catch (error: any) {
        console.error('Error loading financial data:', error);
        setError(`Error cargando datos financieros: ${error.message}`);
        setData({
          monthlyData: [],
          paymentsData: [],
          expensesBreakdown: [],
          totalStats: {
            totalRevenue: 0,
            totalExpenses: 0,
            totalProfit: 0,
            averageGrowth: 0,
            pendingPayments: 0,
            overduePayments: 0,
            totalSessions: 0,
            avgSessionValue: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadFinancialData();
  }, [user?.centerId]);

  const processMonthlyData = (sessions: any[], expenses: any[]) => {
    const monthlyMap = new Map();
    
    // Procesar sesiones por mes
    sessions.forEach(session => {
      const month = session.date.toLocaleDateString('es-ES', { month: 'short' });
      const monthKey = `${session.date.getFullYear()}-${session.date.getMonth()}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          period: month,
          revenue: 0,
          expenses: 0,
          profit: 0,
          growth: 0,
          sessions: 0,
          avgSessionCost: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey);
      monthData.revenue += session.cost || 0;
      monthData.sessions += 1;
    });

    // Procesar gastos por mes
    expenses.forEach(expense => {
      const monthKey = `${expense.date.getFullYear()}-${expense.date.getMonth()}`;
      
      if (monthlyMap.has(monthKey)) {
        const monthData = monthlyMap.get(monthKey);
        monthData.expenses += expense.amount || 0;
      }
    });

    // Calcular promedios y beneficios
    const result = Array.from(monthlyMap.values()).map(monthData => {
      monthData.avgSessionCost = monthData.sessions > 0 ? monthData.revenue / monthData.sessions : 0;
      monthData.profit = monthData.revenue - monthData.expenses;
      return monthData;
    });

    // Calcular crecimiento
    for (let i = 1; i < result.length; i++) {
      const current = result[i];
      const previous = result[i - 1];
      current.growth = previous.revenue > 0 ? 
        ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;
    }

    return result.sort((a, b) => a.period.localeCompare(b.period));
  };

  const processExpensesBreakdown = (expenses: any[]) => {
    const categoryMap = new Map();
    let totalExpenses = 0;

    expenses.forEach(expense => {
      const category = expense.category || 'Otros';
      const amount = expense.amount || 0;
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0);
      }
      
      categoryMap.set(category, categoryMap.get(category) + amount);
      totalExpenses += amount;
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
    let colorIndex = 0;

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: colors[colorIndex++ % colors.length]
    }));
  };

  const calculateStats = (sessions: any[], payments: any[], expenses: any[]) => {
    const totalRevenue = sessions.reduce((sum, session) => sum + (session.cost || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const totalProfit = totalRevenue - totalExpenses;
    
    const pendingPayments = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const overduePayments = payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Calcular crecimiento promedio de los últimos 6 meses
    const recentSessions = sessions.filter(session => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return session.date >= sixMonthsAgo;
    });

    const monthlyRevenues = new Map();
    recentSessions.forEach(session => {
      const monthKey = `${session.date.getFullYear()}-${session.date.getMonth()}`;
      if (!monthlyRevenues.has(monthKey)) {
        monthlyRevenues.set(monthKey, 0);
      }
      monthlyRevenues.set(monthKey, monthlyRevenues.get(monthKey) + (session.cost || 0));
    });

    const revenueArray = Array.from(monthlyRevenues.values());
    let averageGrowth = 0;
    if (revenueArray.length > 1) {
      let totalGrowth = 0;
      for (let i = 1; i < revenueArray.length; i++) {
        if (revenueArray[i - 1] > 0) {
          totalGrowth += ((revenueArray[i] - revenueArray[i - 1]) / revenueArray[i - 1]) * 100;
        }
      }
      averageGrowth = totalGrowth / (revenueArray.length - 1);
    }
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageGrowth,
      pendingPayments,
      overduePayments,
      totalSessions: sessions.length,
      avgSessionValue: sessions.length > 0 ? totalRevenue / sessions.length : 0
    };
  };

  return { data, loading, error };
}

// Funciones para manipular datos en Firebase
export const updateAlert = async (alertId: string, updates: Partial<Alert>) => {
  const { user } = useAuth();
  if (!user?.centerId) throw new Error('No hay centro asignado');
  
  try {
    await updateDoc(doc(db, 'centers', user.centerId, 'alerts', alertId), updates);
  } catch (error) {
    console.error('Error updating alert:', error);
    throw error;
  }
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
  const { user } = useAuth();
  if (!user?.centerId) throw new Error('No hay centro asignado');
  
  try {
    await addDoc(collection(db, 'centers', user.centerId, 'tasks'), {
      ...task,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const { user } = useAuth();
  if (!user?.centerId) throw new Error('No hay centro asignado');
  
  try {
    await updateDoc(doc(db, 'centers', user.centerId, 'tasks', taskId), updates);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  const { user } = useAuth();
  if (!user?.centerId) throw new Error('No hay centro asignado');
  
  try {
    await deleteDoc(doc(db, 'centers', user.centerId, 'tasks', taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};