export interface RecommendationData {
    id: string;
    title: string;
    description: string;
    type: 'suggestion' | 'warning' | 'alert';
    priority: 'low' | 'medium' | 'high';
    date: string;
  }

  export type ExportableCustomer = {
    Nombre: string;
    Email: string;
    Teléfono: string;
    Estado: string;
    Género: string;
    'Estado Civil': string;
    'Fecha Registro': string;
    'Nivel de Riesgo': string;
    'Pólizas': number;
  };

  // src/types/analytics.ts
export interface AnalyticsValues {
  kpis: {
    totalPolicies: number;
    totalPremiums: number;
    newClientsMonthly: number;
    retentionRate: number;
    policyTrend: string;
    premiumTrend: string;
    clientTrend: string;
    retentionTrend: string;
  };
  graphs: {
    byType?: { name: string; value: number }[];
    byMonth?: { month: string; new: number; renewals: number }[];
    expirations?: { range: string; value: number }[];
    satisfaction?: number;
  };
  lists: {
    recentPolicies?: { type: string; clientName: string; premium: number; status: string; date: string }[];
    activeCustomers?: { name: string; lastActivity: string; policyCount: number; totalPremium?: number }[];
    pendingTasks?: { description: string; dueDate: string; priority: string }[];
  };
}

export interface ExportableAnalytics {
  id: string;
  name: string;
  values: AnalyticsValues;
}
