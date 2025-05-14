import {
    collection,
    query,
    where,
    doc,
    orderBy,
    limit,
    onSnapshot,
    
  } from 'firebase/firestore';
  import { db } from '@/lib/firebase'; // Asegúrate de que esta ruta sea correcta
  import dayjs from 'dayjs';
  
  // Define types used in the module
  export type UserPlan = 'basic' | 'pro' | 'enterprise';
  
  // You'll also need to define other types that are missing
  interface AnalyticsFilters {
    dateRange?: { start: string, end: string };
    policyType?: string;
    // Add other filter properties as needed
  }
  
  interface KpiData {
    totalPolicies: number;
    totalPremiums: number;
    newClientsMonthly: number;
    retentionRate: number;
    policyTrend: 'up' | 'down' | 'neutral';
    premiumTrend: 'up' | 'down' | 'neutral';
    clientTrend: 'up' | 'down' | 'neutral';
    retentionTrend: 'up' | 'down' | 'neutral';
  }
  
  interface GraphData {
    byType: Array<{ name: string; value: number; color: string }>;
    byMonth: Array<{ month: string; new: number; renewals: number; total: number }>;
    expirations: Array<{ range: string; value: number; color: string }>;
    satisfaction: number;
    industryComparison?: Array<{ metric: string; yourValue: number; industryAvg: number; difference: number }>;
  }
  
  interface Policy {
    id: string;
    type: string;
    premium: number;
    status: string;
    date: string;
    clientName: string;
    clientId: string;
  }

  interface Customer {
    id: string;
    name: string;
    lastActivity: string;
    policyCount: number;
    totalPremium: number;
  }

  interface Task {
    id: string;
    description: string;
    dueDate: string;
    priority: string;
    relatedEntity?: {
      type: string;
      id: string;
      name: string;
    };
  }

  interface ListsData {
    recentPolicies: Array<Policy>;
    activeCustomers: Array<Customer>;
    pendingTasks: Array<Task>;
  }
  
  interface RecommendationData {
    id: string;
    text: string;
    priority: string;
    actionable: boolean;
    actionText?: string;
    actionLink?: string;
    relatedEntity?: {
      type: string;
      id: string;
      name: string;
    };
  }
  
  interface AlertData {
    id: string;
    text: string;
    severity: string;
    timestamp: string;
    read: boolean;
    relatedEntity?: {
      type: string;
      id: string;
      name: string;
    };
  }
  
  interface AnalyticsData {
    kpis: KpiData;
    graphs: GraphData;
    lists: ListsData;
    recommendations?: RecommendationData[];
    alerts?: AlertData[];
    lastUpdated: string;
  }
  
  // Función para obtener datos de análisis (una sola vez)
  export const fetchAnalyticsData = async (
    userId: string,
    userPlan: UserPlan,
    filters?: AnalyticsFilters
  ): Promise<AnalyticsData> => {
    try {
      // 1. Obtener KPIs
      const kpis = await fetchKpis(userId, filters);
      
      // 2. Obtener datos para gráficos
      const graphs = await fetchGraphData(userId, userPlan, filters);
      
      // 3. Obtener listas
      const lists = await fetchListsData(userId, filters);
      
      // 4. Obtener recomendaciones (si el plan lo permite)
      let recommendations: RecommendationData[] | undefined;
      if (userPlan === 'pro' || userPlan === 'enterprise') {
        recommendations = await fetchRecommendations(userId, filters);
      }
      
      // 5. Obtener alertas (si el plan lo permite)
      let alerts: AlertData[] | undefined;
      if (userPlan === 'enterprise') {
        alerts = await fetchAlerts(userId, filters);
      }
      
      return {
        kpis,
        graphs,
        lists,
        recommendations,
        alerts,
        lastUpdated: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  };
  
  // Función para suscribirse a actualizaciones en tiempo real
  export const subscribeToAnalyticsUpdates = (
    userId: string,
    userPlan: UserPlan,
    filters: AnalyticsFilters | undefined,
    callback: (data: AnalyticsData) => void,
    onError: (error: Error) => void
  ) => {
    // Solo permitir suscripciones en tiempo real para planes Pro y Enterprise
    if (userPlan === 'basic') {
      onError(new Error('Las actualizaciones en tiempo real no están disponibles en el plan Basic'));
      return () => {}; // Función vacía como unsubscribe
    }
    
    // Colecciones a las que nos suscribiremos
    const unsubscribers: (() => void)[] = [];
    
    // 1. Suscripción a KPIs
    const kpisRef = doc(db, `users/${userId}/analytics/kpis`);
    const kpisUnsubscribe = onSnapshot(
      kpisRef,
      async () => {
        try {
          // Cuando hay cambios, obtenemos todos los datos actualizados
          const data = await fetchAnalyticsData(userId, userPlan, filters);
          callback(data);
        } catch (error) {
          console.error('Error in analytics snapshot:', error);
          onError(error as Error);
        }
      },
      (error) => {
        console.error('Error in KPIs snapshot:', error);
        onError(error);
      }
    );
    unsubscribers.push(kpisUnsubscribe);
    
    // 2. Suscripción a pólizas recientes (para actualizar gráficos y listas)
    const policiesRef = collection(db, 'policies');
    const recentPoliciesQuery = query(
      policiesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    const policiesUnsubscribe = onSnapshot(
      recentPoliciesQuery,
      async (snapshot) => {
        if (!snapshot.empty) {
          try {
            const data = await fetchAnalyticsData(userId, userPlan, filters);
            callback(data);
          } catch (error) {
            console.error('Error in policies snapshot:', error);
            onError(error as Error);
          }
        }
      },
      (error) => {
        console.error('Error in policies snapshot:', error);
        onError(error);
      }
    );
    unsubscribers.push(policiesUnsubscribe);
    
    // 3. Suscripción a alertas (solo para Enterprise)
    if (userPlan === 'enterprise') {
      const alertsRef = collection(db, `users/${userId}/alerts`);
      const alertsUnsubscribe = onSnapshot(
        alertsRef,
        async (snapshot) => {
          if (!snapshot.empty) {
            try {
              const data = await fetchAnalyticsData(userId, userPlan, filters);
              callback(data);
            } catch (error) {
              console.error('Error in alerts snapshot:', error);
              onError(error as Error);
            }
          }
        },
        (error) => {
          console.error('Error in alerts snapshot:', error);
          onError(error);
        }
      );
      unsubscribers.push(alertsUnsubscribe);
    }
    
    // Función para cancelar todas las suscripciones
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  };
  
  // Funciones auxiliares para obtener datos específicos
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchKpis = async (userId: string, filters?: AnalyticsFilters): Promise<KpiData> => {
          try {
        // TODO: Use userId and filters when implementing actual Firestore query
      // En un caso real, obtendrías estos datos de Firestore
      // Aquí simulamos los datos para el ejemplo
      
      // Ejemplo de cómo sería con Firestore:
      // const kpisRef = doc(db, `users/${userId}/analytics/kpis`);
      // const kpisSnap = await getDoc(kpisRef);
      // if (kpisSnap.exists()) {
      //   return kpisSnap.data() as KpiData;
      // }
      
      // Datos simulados
      return {
        totalPolicies: 1250,
        totalPremiums: 1850000,
        newClientsMonthly: 25,
        retentionRate: 88,
        policyTrend: 'up',
        premiumTrend: 'up',
        clientTrend: 'down',
        retentionTrend: 'neutral'
      };
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  };
  
  const fetchGraphData = async (
      userId: string, 
      userPlan: UserPlan,
      filters?: AnalyticsFilters
    ): Promise<GraphData> => {
      try {
        // Use filters if provided
        console.log('Fetching graph data with filters:', filters);
      // Datos simulados para gráficos
      const graphData: GraphData = {
        byType: [
          { name: 'Salud', value: 400, color: '#1976d2' },
          { name: 'Vida', value: 300, color: '#388e3c' },
          { name: 'Auto', value: 200, color: '#d32f2f' },
          { name: 'Hogar', value: 250, color: '#f57c00' },
          { name: 'Empresa', value: 100, color: '#5e35b1' }
        ],
        byMonth: [
          { month: 'Ene', new: 20, renewals: 80, total: 100 },
          { month: 'Feb', new: 25, renewals: 85, total: 110 },
          { month: 'Mar', new: 18, renewals: 90, total: 108 },
          { month: 'Abr', new: 30, renewals: 95, total: 125 },
          { month: 'May', new: 22, renewals: 100, total: 122 },
          { month: 'Jun', new: 28, renewals: 105, total: 133 }
        ],
        expirations: [
          { range: '< 7 días', value: 15, color: '#d32f2f' },
          { range: '8-15 días', value: 30, color: '#f57c00' },
          { range: '16-30 días', value: 50, color: '#ffc107' },
          { range: '31-60 días', value: 80, color: '#4caf50' }
        ],
        satisfaction: 92
      };
      
      // Añadir comparativas de industria solo para plan Enterprise
      if (userPlan === 'enterprise') {
        graphData.industryComparison = [
          { metric: 'Retención', yourValue: 88, industryAvg: 75, difference: 13 },
          { metric: 'Prima Media', yourValue: 1480, industryAvg: 1250, difference: 230 },
          { metric: 'Pólizas/Cliente', yourValue: 2.3, industryAvg: 1.8, difference: 0.5 }
        ];
      }
      
      return graphData;
    } catch (error) {
      console.error('Error fetching graph data:', error);
      throw error;
    }
  };
  
  const fetchListsData = async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      userId: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filters?: AnalyticsFilters
    ): Promise<ListsData> => {
    try {
      // Datos simulados para listas
      return {
        recentPolicies: [
          { 
            id: 'p1', 
            type: 'Auto', 
            premium: 1200, 
            status: 'Activa', 
            date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
            clientName: 'Ana García',
            clientId: 'c1'
          },
          { 
            id: 'p2', 
            type: 'Salud', 
            premium: 3500, 
            status: 'Activa', 
            date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
            clientName: 'Luis Fernández',
            clientId: 'c2'
          },
          { 
            id: 'p3', 
            type: 'Hogar', 
            premium: 850, 
            status: 'Pendiente', 
            date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
            clientName: 'María Rodríguez',
            clientId: 'c3'
          },
          { 
            id: 'p4', 
            type: 'Vida', 
            premium: 2200, 
            status: 'Activa', 
            date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
            clientName: 'Carlos Sánchez',
            clientId: 'c4'
          },
          { 
            id: 'p5', 
            type: 'Empresa', 
            premium: 5800, 
            status: 'Activa', 
            date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
            clientName: 'Empresa XYZ',
            clientId: 'c5'
          }
        ],
        activeCustomers: [
          { 
            id: 'c1', 
            name: 'Ana García', 
            lastActivity: dayjs().subtract(5, 'day').format('YYYY-MM-DD'), 
            policyCount: 3,
            totalPremium: 4500
          },
          { 
            id: 'c2', 
            name: 'Luis Fernández', 
            lastActivity: dayjs().subtract(10, 'day').format('YYYY-MM-DD'), 
            policyCount: 1,
            totalPremium: 3500
          },
          { 
            id: 'c3', 
            name: 'María Rodríguez', 
            lastActivity: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), 
            policyCount: 2,
            totalPremium: 1650
          },
          { 
            id: 'c4', 
            name: 'Carlos Sánchez', 
            lastActivity: dayjs().subtract(15, 'day').format('YYYY-MM-DD'), 
            policyCount: 2,
            totalPremium: 3400
          },
          { 
            id: 'c5', 
            name: 'Empresa XYZ', 
            lastActivity: dayjs().subtract(7, 'day').format('YYYY-MM-DD'), 
            policyCount: 4,
            totalPremium: 12800
          }
        ],
        pendingTasks: [
          { 
            id: 't1', 
            description: 'Llamar a cliente por renovación', 
            dueDate: dayjs().add(3, 'day').format('YYYY-MM-DD'), 
            priority: 'high',
            relatedEntity: {
              type: 'client',
              id: 'c1',
              name: 'Ana García'
            }
          },
          { 
            id: 't2', 
            description: 'Preparar cotización Hogar', 
            dueDate: dayjs().add(5, 'day').format('YYYY-MM-DD'), 
            priority: 'medium',
            relatedEntity: {
              type: 'client',
              id: 'c3',
              name: 'María Rodríguez'
            }
          },
          { 
            id: 't3', 
            description: 'Revisar documentación póliza', 
            dueDate: dayjs().add(2, 'day').format('YYYY-MM-DD'), 
            priority: 'medium',
            relatedEntity: {
              type: 'policy',
              id: 'p5',
              name: 'Póliza Empresa XYZ'
            }
          },
          { 
            id: 't4', 
            description: 'Enviar recordatorio de pago', 
            dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'), 
            priority: 'high',
            relatedEntity: {
              type: 'client',
              id: 'c4',
              name: 'Carlos Sánchez'
            }
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching lists data:', error);
      throw error;
    }
  };
  
  const fetchRecommendations = async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      userId: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filters?: AnalyticsFilters
    ): Promise<RecommendationData[]> => {
    try {
      // Datos simulados para recomendaciones
      return [
        {
          id: 'r1',
          text: '💡 5 pólizas de Auto vencen en los próximos 15 días. Sugerimos contactar a los clientes.',
          priority: 'medium',
          actionable: true,
          actionText: 'Ver pólizas',
          actionLink: '/dashboard/policies?filter=expiring'
        },
        {
          id: 'r2',
          text: '🔔 Cliente "Luis Fernández" no registra interacción desde hace 10 días. Considera un seguimiento.',
          priority: 'low',
          relatedEntity: {
            type: 'client',
            id: 'c2',
            name: 'Luis Fernández'
          },
          actionable: true,
          actionText: 'Contactar',
          actionLink: '/dashboard/customers/c2'
        },
        {
          id: 'r3',
          text: '⚠️ La tasa de renovación ha bajado un 5% este mes. Revisa las causas de cancelación.',
          priority: 'high',
          actionable: true,
          actionText: 'Ver análisis',
          actionLink: '/dashboard/analysis?section=retention'
        },
        {
          id: 'r4',
          text: '💰 Oportunidad: 3 clientes tienen solo una póliza pero perfil para cross-selling.',
          priority: 'medium',
          actionable: true,
          actionText: 'Ver clientes',
          actionLink: '/dashboard/customers?filter=cross-selling'
        }
      ];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  };
  
  const fetchAlerts = async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      userId: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filters?: AnalyticsFilters
    ): Promise<AlertData[]> => {
    try {
      // Datos simulados para alertas
      return [
        {
          id: 'a1',
          text: '⚠️ La prima promedio de pólizas de Salud ha bajado un 15% este mes.',
          severity: 'warning',
          timestamp: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
          read: false
        },
        {
          id: 'a2',
          text: '🔔 Aseguradora ABC ha modificado condiciones en pólizas de Auto.',
          severity: 'info',
          timestamp: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
          read: true,
          relatedEntity: {
            type: 'insurer',
            id: 'ins1',
            name: 'Aseguradora ABC'
          }
        },
        {
          id: 'a3',
          text: '❗ 3 pólizas importantes vencen en menos de 7 días sin renovación iniciada.',
          severity: 'error',
          timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
          read: false
        }
      ];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  };