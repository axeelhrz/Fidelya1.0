import { collection, query, where, getDocs, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Policy } from '@/types/policy';
import { Customer } from '@/types/customer';
import { Task } from '@/types/tasks';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

// Configurar dayjs con plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.locale('es');
dayjs.tz.setDefault('Europe/Madrid'); // Ajusta a la zona horaria de España

// Interfaz para los KPIs
export interface DashboardKPIs {
  totalPolicies: number;
  totalClients: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number; // Added for task stats
  urgentTasks: number; // Added for task stats
  dueTodayTasks: number; // Added for task stats
  dueThisWeekTasks: number; // Added for task stats
  overdueTasks: number; // Added for task stats
  totalPremiums: number;
  retentionRate: number; // en porcentaje
  monthlyChanges: {
    policies: number;
    clients: number;
    tasks: number;
    premiums: number;
    retention: number;
    completedTasks: number; // Added for task stats
    pendingTasks: number; // Added for task stats
    overdueTasks: number; // Added for task stats
  };
  lastUpdated: Timestamp;
  // Métricas adicionales
  averagePremium: number;
  topPolicyType: string;
  clientsWithMultiplePolicies: number;
  upcomingRenewals: number;
  revenueByMonth: { [month: string]: number };
}

/**
 * Genera y guarda los KPIs del dashboard para un usuario específico
 * @param userId ID del usuario autenticado
 * @returns Objeto con los KPIs generados o null si ocurre un error
 */
export const generateKpis = async (userId: string): Promise<DashboardKPIs | null> => {
  try {
    console.log(`Iniciando generación de KPIs para el usuario: ${userId}`);
    
    // Obtener fecha actual y fecha de inicio del mes actual y anterior
    const now = dayjs();
    const startOfCurrentMonth = now.startOf('month').toDate();
    const startOfPreviousMonth = now.subtract(1, 'month').startOf('month').toDate();
    const endOfPreviousMonth = now.startOf('month').subtract(1, 'day').endOf('day').toDate();
    const nextThirtyDays = now.add(30, 'day').toDate();
    const tomorrow = now.add(1, 'day').startOf('day').toDate();
    const nextWeek = now.add(7, 'day').startOf('day').toDate();

    // 1. Obtener todas las pólizas del usuario
    const policiesRef = collection(db, 'policies');
    const policiesQuery = query(policiesRef, where('userId', '==', userId));
    const policiesSnapshot = await getDocs(policiesQuery);
    
    const policies: Policy[] = [];
    policiesSnapshot.forEach(doc => {
      policies.push({ id: doc.id, ...doc.data() } as Policy);
    });
    console.log(`Pólizas obtenidas para ${userId}: ${policies.length}`);

    // 2. Obtener todos los clientes del usuario
    const customersRef = collection(db, 'customers');
    const customersQuery = query(customersRef, where('userId', '==', userId));
    const customersSnapshot = await getDocs(customersQuery);
    
    const customers: Customer[] = [];
    customersSnapshot.forEach(doc => {
      customers.push({ id: doc.id, ...doc.data() } as Customer);
    });
    console.log(`Clientes obtenidos para ${userId}: ${customers.length}`);

    // 3. Obtener todas las tareas del usuario
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const tasksSnapshot = await getDocs(tasksRef);
    
    const tasks: Task[] = [];
    tasksSnapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    console.log(`Tareas obtenidas para ${userId}: ${tasks.length}`);

    // 4. Calcular KPIs actuales
    
    // Pólizas activas (no archivadas)
    const activePolicies = policies.filter(policy => !policy.isArchived);
    const totalPolicies = activePolicies.length;
    
    // Total de clientes
    const totalClients = customers.length;
    
    // Tareas completadas y pendientes
    const completedTasks = tasks.filter(task => task.status === 'completada').length;
    const pendingTasks = tasks.filter(task => task.status === 'pendiente').length;
    const inProgressTasks = tasks.filter(task => task.status === 'en_progreso').length;
    const urgentTasks = tasks.filter(task => task.priority === 'alta').length;
    
    // Due today tasks
    const dueTodayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      return dueDate >= now.toDate() && dueDate < tomorrow;
    }).length;
    
    // Due this week tasks
    const dueThisWeekTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      return dueDate >= now.toDate() && dueDate < nextWeek;
    }).length;
    
    // Overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completada') return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      return dueDate < now.toDate();
    }).length;
    
    // Total de primas
    const totalPremiums = activePolicies.reduce((sum, policy) => sum + (policy.premium || 0), 0);
    
    // Tasa de retención (pólizas de renovación / total de pólizas)
    const renewalPolicies = activePolicies.filter(policy => policy.isRenewal === true).length;
    const retentionRate = totalPolicies > 0 ? Math.round((renewalPolicies / totalPolicies) * 100) : 0;

    // 5. Calcular cambios mensuales
    
    // Pólizas creadas en el mes actual
    const policiesThisMonth = policies.filter(policy => {
      const createdAt = policy.createdAt?.toDate() || new Date();
      return createdAt >= startOfCurrentMonth;
    });
    
    // Pólizas creadas en el mes anterior
    const policiesLastMonth = policies.filter(policy => {
      const createdAt = policy.createdAt?.toDate() || new Date();
      return createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
    });
    
    // Clientes creados en el mes actual
    const clientsThisMonth = customers.filter(customer => {
      const createdAt = customer.createdAt instanceof Timestamp 
        ? customer.createdAt.toDate() 
        : new Date(customer.createdAt || Date.now());
      return createdAt >= startOfCurrentMonth;
    });
    
    // Clientes creados en el mes anterior
    const clientsLastMonth = customers.filter(customer => {
      const createdAt = customer.createdAt instanceof Timestamp 
        ? customer.createdAt.toDate() 
        : new Date(customer.createdAt || Date.now());
      return createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
    });
    
    // Tareas creadas en el mes actual
    const tasksThisMonth = tasks.filter(task => {
      let createdAt: Date;
      if (task.createdAt instanceof Timestamp) {
        createdAt = task.createdAt.toDate();
      } else if (typeof task.createdAt === 'number' || typeof task.createdAt === 'string') {
        createdAt = new Date(task.createdAt);
      } else {
        createdAt = new Date();
      }
      return createdAt >= startOfCurrentMonth;
    });
    
    // Tareas creadas en el mes anterior
    const tasksLastMonth = tasks.filter(task => {
      let createdAt: Date;
      if (task.createdAt instanceof Timestamp) {
        createdAt = task.createdAt.toDate();
      } else if (typeof task.createdAt === 'number' || typeof task.createdAt === 'string') {
        createdAt = new Date(task.createdAt);
      } else {
        createdAt = new Date();
      }
      return createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
    });
    
    // Tasks completed this month
    const tasksCompletedThisMonth = tasks.filter(task => {
      if (task.status !== 'completada' || !task.completedAt) return false;
      const completedAt = task.completedAt instanceof Date ? task.completedAt : task.completedAt.toDate();
      return completedAt >= startOfCurrentMonth;
    }).length;
    
    // Tasks completed last month
    const tasksCompletedLastMonth = tasks.filter(task => {
      if (task.status !== 'completada' || !task.completedAt) return false;
      const completedAt = task.completedAt instanceof Date ? task.completedAt : task.completedAt.toDate();
      return completedAt >= startOfPreviousMonth && completedAt <= endOfPreviousMonth;
    }).length;
    
    // Pending tasks last month
    const pendingTasksLastMonth = tasks.filter(task => {
      let createdAt: Date;
      if (task.createdAt instanceof Timestamp) {
        createdAt = task.createdAt.toDate();
      } else if (typeof task.createdAt === 'number' || typeof task.createdAt === 'string') {
        createdAt = new Date(task.createdAt);
      } else {
        createdAt = new Date();
      }
      return task.status !== 'completada' && createdAt <= endOfPreviousMonth;
    }).length;
    
    // Overdue tasks last month
    const overdueTasksLastMonth = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completada') return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      return dueDate < endOfPreviousMonth && dueDate >= startOfPreviousMonth;
    }).length;
    
    // Primas de pólizas creadas en el mes actual
    const premiumsThisMonth = policiesThisMonth.reduce((sum, policy) => sum + (policy.premium || 0), 0);
    
    // Primas de pólizas creadas en el mes anterior
    const premiumsLastMonth = policiesLastMonth.reduce((sum, policy) => sum + (policy.premium || 0), 0);
    
    // Tasa de retención del mes actual
    const renewalPoliciesThisMonth = policiesThisMonth.filter(policy => policy.isRenewal === true).length;
    const retentionRateThisMonth = policiesThisMonth.length > 0 
      ? Math.round((renewalPoliciesThisMonth / policiesThisMonth.length) * 100) 
      : 0;
    
    // Tasa de retención del mes anterior
    const renewalPoliciesLastMonth = policiesLastMonth.filter(policy => policy.isRenewal === true).length;
    const retentionRateLastMonth = policiesLastMonth.length > 0 
      ? Math.round((renewalPoliciesLastMonth / policiesLastMonth.length) * 100) 
      : 0;
    
    // Calcular cambios mensuales (diferencia entre mes actual y anterior)
    const monthlyChanges = {
      policies: policiesThisMonth.length - policiesLastMonth.length,
      clients: clientsThisMonth.length - clientsLastMonth.length,
      tasks: tasksThisMonth.length - tasksLastMonth.length,
      premiums: premiumsThisMonth - premiumsLastMonth,
      retention: retentionRateThisMonth - retentionRateLastMonth,
      completedTasks: tasksCompletedThisMonth - tasksCompletedLastMonth,
      pendingTasks: pendingTasks - pendingTasksLastMonth,
      overdueTasks: overdueTasks - overdueTasksLastMonth
    };

    // 6. Calcular métricas adicionales
    
    // Prima promedio
    const averagePremium = totalPolicies > 0 ? totalPremiums / totalPolicies : 0;
    
    // Tipo de póliza más común
    const policyTypeCount: Record<string, number> = {};
    activePolicies.forEach(policy => {
      const type = policy.type || 'unknown';
      policyTypeCount[type] = (policyTypeCount[type] || 0) + 1;
    });
    
    let topPolicyType = 'ninguno';
    let maxCount = 0;
    Object.entries(policyTypeCount).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topPolicyType = type;
      }
    });
    
    // Clientes con múltiples pólizas
    const clientPoliciesCount: Record<string, number> = {};
    activePolicies.forEach(policy => {
      const clientId = policy.customerId;
      if (clientId) {
        clientPoliciesCount[clientId] = (clientPoliciesCount[clientId] || 0) + 1;
      }
    });
    
    const clientsWithMultiplePolicies = Object.values(clientPoliciesCount).filter(count => count > 1).length;
    
    // Renovaciones próximas (en los próximos 30 días)

    // Renovaciones próximas (en los próximos 30 días)
    const upcomingRenewals = activePolicies.filter(policy => {
      if (!policy.renewalDate && !('renewalDate' in policy)) return false;
      const renewalDate = policy.renewalDate instanceof Date 
        ? policy.renewalDate 
        : policy.renewalDate instanceof Timestamp 
          ? policy.renewalDate.toDate() 
          : null;
      return renewalDate && renewalDate >= now.toDate() && renewalDate <= nextThirtyDays;
    }).length;
    
    // Ingresos por mes (últimos 6 meses)
    const revenueByMonth: { [month: string]: number } = {};
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const month = now.subtract(i, 'month');
      return month.format('YYYY-MM');
    });
    
    last6Months.forEach(monthKey => {
      revenueByMonth[monthKey] = 0;
    });
    
    activePolicies.forEach(policy => {
      if (!policy.createdAt) return;
      
      const createdAt = policy.createdAt.toDate();
      const monthKey = dayjs(createdAt).format('YYYY-MM');
      
      if (revenueByMonth[monthKey] !== undefined) {
        revenueByMonth[monthKey] += policy.premium || 0;
      }
    });

    // 7. Crear objeto de KPIs
    const dashboardKpis: DashboardKPIs = {
      totalPolicies,
      totalClients,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      urgentTasks,
      dueTodayTasks,
      dueThisWeekTasks,
      overdueTasks,
      totalPremiums,
      retentionRate,
      monthlyChanges,
      lastUpdated: Timestamp.now(),
      averagePremium,
      topPolicyType,
      clientsWithMultiplePolicies,
      upcomingRenewals,
      revenueByMonth
    };
    
    // 8. Guardar KPIs en Firestore
    const kpisDocRef = doc(db, `users/${userId}/dashboard/kpis`);
    await setDoc(kpisDocRef, dashboardKpis);
    console.log(`KPIs guardados para el usuario ${userId}`);
    
    return dashboardKpis;
  } catch (error) {
    console.error('Error al generar KPIs:', error);
    return null;
  }
};

/**
 * Obtiene los KPIs del dashboard para un usuario específico
 * @param userId ID del usuario autenticado
 * @returns Objeto con los KPIs o null si no existen
 */
export const getKpis = async (userId: string): Promise<DashboardKPIs | null> => {
  try {
    const kpisDocRef = doc(db, `users/${userId}/dashboard/kpis`);
    const kpisDoc = await getDoc(kpisDocRef);
    
    if (kpisDoc.exists()) {
      return kpisDoc.data() as DashboardKPIs;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener KPIs:', error);
    return null;
  }
};

/**
 * Verifica si los KPIs deben ser actualizados (si han pasado más de 24 horas)
 * @param userId ID del usuario autenticado
 * @returns true si los KPIs deben actualizarse, false en caso contrario
 */
export const shouldUpdateKpis = async (userId: string): Promise<boolean> => {
  try {
    const kpis = await getKpis(userId);
    
    if (!kpis) {
      return true; // Si no existen KPIs, deben generarse
    }
    
    const lastUpdated = kpis.lastUpdated.toDate();
    const now = new Date();
    const hoursSinceLastUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastUpdate >= 24; // Actualizar si han pasado más de 24 horas
  } catch (error) {
    console.error('Error al verificar si los KPIs deben actualizarse:', error);
    return true; // En caso de error, intentar actualizar
  }
};
