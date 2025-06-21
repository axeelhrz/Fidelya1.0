'use client';

import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, where, orderBy, limit, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { KPIMetric, Alert, Task, FinancialMetrics, ClinicalMetrics } from '@/types/dashboard';

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

interface MonthlyData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
  sessions: number;
  avgSessionCost: number;
}

interface PaymentData {
  id: string;
  amount: number;
  date: Date;
  status: string;
  [key: string]: unknown;
}

interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface SessionData {
  id: string;
  date: Date;
  cost: number;
  status: string;
  [key: string]: unknown;
}

interface ExpenseData {
  id: string;
  date: Date;
  amount: number;
  category: string;
  [key: string]: unknown;
}

// Hook personalizado para datos financieros detallados calculados desde Firebase
export function useFinancialData() {
  const { user } = useAuth();
  const [data, setData] = useState({
    monthlyData: [] as MonthlyData[],
    paymentsData: [] as PaymentData[],
    expensesBreakdown: [] as ExpenseBreakdown[],
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
        })) as SessionData[];

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
        })) as PaymentData[];

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
        })) as ExpenseData[];

        // Procesar datos
        const monthlyData = processMonthlyData(sessions, expenses);
        const expensesBreakdown = processExpensesBreakdown(expenses);
        const totalStats = calculateStats(sessions, payments, expenses);
        setData({
          monthlyData,
          paymentsData: payments,
          expensesBreakdown,
          totalStats
        });

      } catch (error: unknown) {
        setError(`Error cargando datos financieros: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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

  const processMonthlyData = (sessions: SessionData[], expenses: ExpenseData[]): MonthlyData[] => {
    const monthlyMap = new Map<string, MonthlyData>();

    // Procesar sesiones por mes
    sessions.forEach(session => {
      const monthKey = `${session.date.getFullYear()}-${String(session.date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          period: monthKey,
          revenue: 0,
          expenses: 0,
          profit: 0,
          growth: 0,
          sessions: 0,
          avgSessionCost: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      monthData.revenue += session.cost || 0;
      monthData.sessions += 1;
    });

    // Procesar gastos por mes
    expenses.forEach(expense => {
      const monthKey = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          period: monthKey,
          revenue: 0,
          expenses: 0,
          profit: 0,
          growth: 0,
          sessions: 0,
          avgSessionCost: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      monthData.expenses += expense.amount || 0;
    });

    // Calcular promedios y beneficios
    const result = Array.from(monthlyMap.values()).map(monthData => {
      monthData.avgSessionCost = monthData.sessions > 0 ? monthData.revenue / monthData.sessions : 0;
      monthData.profit = monthData.revenue - monthData.expenses;
      return monthData;
    });

    return result.sort((a, b) => a.period.localeCompare(b.period));
  };

  const processExpensesBreakdown = (expenses: ExpenseData[]): ExpenseBreakdown[] => {
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

  const calculateStats = (sessions: SessionData[], payments: PaymentData[], expenses: ExpenseData[]) => {
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
export const updateAlert = async (centerId: string, alertId: string, updates: Partial<Alert>) => {
  if (!centerId) throw new Error('No hay centro asignado');
  
  try {
    await updateDoc(doc(db, 'centers', centerId, 'alerts', alertId), updates);
  } catch (error) {
    console.error('Error updating alert:', error);
    throw error;
  }
};

export const createTask = async (centerId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
  if (!centerId) throw new Error('No hay centro asignado');
  
  try {
    await addDoc(collection(db, 'centers', centerId, 'tasks'), {
      ...task,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (centerId: string, taskId: string, updates: Partial<Task>) => {
  if (!centerId) throw new Error('No hay centro asignado');
  
  try {
    await updateDoc(doc(db, 'centers', centerId, 'tasks', taskId), updates);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (centerId: string, taskId: string) => {
  if (!centerId) throw new Error('No hay centro asignado');
  
  try {
    await deleteDoc(doc(db, 'centers', centerId, 'tasks', taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};