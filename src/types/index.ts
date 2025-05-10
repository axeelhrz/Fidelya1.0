import * as functions from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Inicializar la aplicación de Firebase Admin
initializeApp();
const db = getFirestore();

// Interfaces para los documentos
interface Policy {
  id: string;
  userId: string;
  premium: number;
  type: string;
  isArchived?: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  [key: string]: string | number | boolean | FirebaseFirestore.Timestamp | undefined;
}

interface Customer {
  id: string;
  userId: string;
  createdAt: FirebaseFirestore.Timestamp | Date | string;
  [key: string]: string | number | boolean | FirebaseFirestore.Timestamp | Date | undefined;
}

interface Task {
  id: string;
  userId: string;
  status: string;
  createdAt: FirebaseFirestore.Timestamp | Date | string;
  [key: string]: string | number | boolean | FirebaseFirestore.Timestamp | Date | undefined;
}

// Interfaz para los KPIs
interface DashboardKPIs {
  totalPolicies: number;
  totalClients: number;
  completedTasks: number;
  pendingTasks: number;
  totalPremiums: number;
  retentionRate: number;
  monthlyChanges: {
    policies: number;
    clients: number;
    tasks: number;
    premiums: number;
    retention: number;
  };
  lastUpdated: FirebaseFirestore.Timestamp;
}

// Función para generar KPIs
async function generateKpis(userId: string) {
  try {
    // Fechas para cálculos mensuales
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Obtener todas las pólizas del usuario
    const policiesSnapshot = await db.collection('policies')
      .where('userId', '==', userId)
      .get();
    
    const policies = policiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Policy[];

    // 2. Obtener todos los clientes del usuario
    const customersSnapshot = await db.collection('customers')
      .where('userId', '==', userId)
      .get();
    
    const customers = customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[];

    // 3. Obtener todas las tareas del usuario
    const tasksSnapshot = await db.collection('tasks')
      .where('userId', '==', userId)
      .get();
    
    const tasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];

    // 4. Calcular KPIs actuales

    // 4. Calcular KPIs actuales
    
    // Pólizas activas (no archivadas)
    const activePolicies = policies.filter(policy => !policy.isArchived);
    const totalPolicies = activePolicies.length;
    
    // Total de clientes
    const totalClients = customers.length;
    
    // Tareas completadas y pendientes
    const completedTasks = tasks.filter(task => task.status === 'completada').length;
    const pendingTasks = tasks.filter(task => task.status !== 'completada').length;
    
    // Total de primas
    const totalPremiums = activePolicies.reduce((sum, policy) => sum + policy.premium, 0);
    
    // Tasa de retención (pólizas de renovación / total de pólizas)
    const renewalPolicies = activePolicies.filter(policy => policy.type === 'renewal').length;
    const retentionRate = totalPolicies > 0 ? Math.round((renewalPolicies / totalPolicies) * 100) : 0;

    // 5. Calcular cambios mensuales
    
    // Pólizas creadas en el mes actual
    const policiesThisMonth = policies.filter(policy => {
      const createdAt = policy.createdAt.toDate();
      return createdAt >= startOfCurrentMonth;
    });
    
    // Pólizas creadas en el mes anterior
    const policiesLastMonth = policies.filter(policy => {
      const createdAt = policy.createdAt.toDate();
      return createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
    });
    
    // Clientes creados en el mes actual
    const clientsThisMonth = customers.filter(customer => {
      const createdAt = customer.createdAt instanceof Timestamp 
        ? customer.createdAt.toDate() 
        : new Date(customer.createdAt);
      return createdAt >= startOfCurrentMonth;
    });
    
    // Clientes creados en el mes anterior
    const clientsLastMonth = customers.filter(customer => {
      const createdAt = customer.createdAt instanceof Timestamp 
        ? customer.createdAt.toDate() 
        : new Date(customer.createdAt);
      return createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
    });
    
    // Tareas creadas en el mes actual
    const tasksThisMonth = tasks.filter(task => {
      const createdAt = task.createdAt instanceof Timestamp 
        ? task.createdAt.toDate()
        : task.createdAt instanceof Date 
          ? task.createdAt 
          : new Date(task.createdAt as string);
      return createdAt >= startOfCurrentMonth;
    });
    
    // Tareas creadas en el mes anterior
    const tasksLastMonth = tasks.filter(task => {
      const createdAt = task.createdAt instanceof Timestamp 
        ? task.createdAt.toDate()
        : task.createdAt instanceof Date 
          ? task.createdAt 
          : new Date(task.createdAt as string);
      return createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
    });
    
    // Primas de pólizas creadas en el mes actual
    const premiumsThisMonth = policiesThisMonth.reduce((sum, policy) => sum + policy.premium, 0);
    
    // Primas de pólizas creadas en el mes anterior
    const premiumsLastMonth = policiesLastMonth.reduce((sum, policy) => sum + policy.premium, 0);
    
    // Tasa de retención del mes actual
    const renewalPoliciesThisMonth = policiesThisMonth.filter(policy => policy.type === 'renewal').length;
    const retentionRateThisMonth = policiesThisMonth.length > 0 
      ? Math.round((renewalPoliciesThisMonth / policiesThisMonth.length) * 100) 
      : 0;
    
    // Tasa de retención del mes anterior
    const renewalPoliciesLastMonth = policiesLastMonth.filter(policy => policy.type === 'renewal').length;
    const retentionRateLastMonth = policiesLastMonth.length > 0 
      ? Math.round((renewalPoliciesLastMonth / policiesLastMonth.length) * 100) 
      : 0;
    
    // Calcular cambios mensuales (diferencia entre mes actual y anterior)
    const monthlyChanges = {
      policies: policiesThisMonth.length - policiesLastMonth.length,
      clients: clientsThisMonth.length - clientsLastMonth.length,
      tasks: tasksThisMonth.length - tasksLastMonth.length,
      premiums: premiumsThisMonth - premiumsLastMonth,
      retention: retentionRateThisMonth - retentionRateLastMonth
    };

    // 6. Crear objeto de KPIs
    const kpis: DashboardKPIs = {
      totalPolicies,
      totalClients,
      completedTasks,
      pendingTasks,
      totalPremiums,
      retentionRate,
      monthlyChanges,
      lastUpdated: Timestamp.now()
    };

    // 7. Guardar KPIs en Firestore
    await db.doc(`users/${userId}/dashboard/kpis`).set(kpis);

    return kpis;
  } catch (error: unknown) {
    console.error('Error al generar KPIs:', error);
    return null;
  }
}

// Cloud Function para actualizar KPIs cuando se modifica una póliza
export const onPolicyChange = functions.firestore
  .onDocumentWritten('policies/{policyId}', async (event) => {
    try {
      // Obtener el documento antes y después del cambio
      const beforeData = event.data?.before?.data();
      const afterData = event.data?.after?.data();
      
      // Si no hay datos, salir
      if (!beforeData && !afterData) {
        console.log('No hay datos para procesar');
        return null;
      }
      
      // Obtener el userId del documento (antes o después del cambio)
      const userId = afterData?.userId || beforeData?.userId;
      
      if (!userId) {
        console.log('No se encontró userId en el documento');
        return null;
      }
      
      // Generar KPIs para el usuario
      console.log(`Actualizando KPIs para el usuario ${userId} después de cambio en póliza`);
      await generateKpis(userId);
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Error al procesar cambio en póliza:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

// Cloud Function para actualizar KPIs cuando se modifica un cliente
export const onCustomerChange = functions.firestore
  .onDocumentWritten('customers/{customerId}', async (event) => {
    try {
      // Obtener el documento antes y después del cambio
      const beforeData = event.data?.before?.data();
      const afterData = event.data?.after?.data();
      
      // Si no hay datos, salir
      if (!beforeData && !afterData) {
        console.log('No hay datos para procesar');
        return null;
      }
      
      // Obtener el userId del documento (antes o después del cambio)
      const userId = afterData?.userId || beforeData?.userId;
      
      if (!userId) {
        console.log('No se encontró userId en el documento');
        return null;
      }
      
      // Generar KPIs para el usuario
      console.log(`Actualizando KPIs para el usuario ${userId} después de cambio en cliente`);
      await generateKpis(userId);
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Error al procesar cambio en cliente:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

// Cloud Function para actualizar KPIs cuando se modifica una tarea
export const onTaskChange = functions.firestore
  .onDocumentWritten('tasks/{taskId}', async (event) => {
    try {
      // Obtener el documento antes y después del cambio
      const beforeData = event.data?.before?.data();
      const afterData = event.data?.after?.data();
      
      // Si no hay datos, salir
      if (!beforeData && !afterData) {
        console.log('No hay datos para procesar');
        return null;
      }
      
      // Obtener el userId del documento (antes o después del cambio)
      const userId = afterData?.userId || beforeData?.userId;
      
      if (!userId) {
        console.log('No se encontró userId en el documento');
        return null;
      }
      
      // Generar KPIs para el usuario
      console.log(`Actualizando KPIs para el usuario ${userId} después de cambio en tarea`);
      await generateKpis(userId);
      
      return { success: true };
    } catch (error: unknown) {
      console.error('Error al procesar cambio en tarea:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

// Cloud Function para actualizar KPIs periódicamente (cada día a las 00:00)
export const scheduledKpiUpdate = functions.scheduler
  .onSchedule('0 0 * * *', async () => {
    try {
      // Obtener todos los usuarios
      const usersSnapshot = await db.collection('users').get();
      
      // Para cada usuario, generar KPIs
      const promises = usersSnapshot.docs.map(async (userDoc) => {
        const userId = userDoc.id;
        console.log(`Actualizando KPIs programados para el usuario ${userId}`);
        return generateKpis(userId);
      });
      
      // Esperar a que todas las actualizaciones se completen
      await Promise.all(promises);
      
      console.log(`Actualización programada de KPIs completada para ${usersSnapshot.size} usuarios`);
    } catch (error: unknown) {
      console.error('Error en la actualización programada de KPIs:', error);
    }
  });