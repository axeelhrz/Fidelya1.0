export interface User {
  id: string;
  email: string;
  role: 'admin' | 'therapist';
  centerId: string;
  name: string;
  avatar?: string;
}

export interface Center {
  id: string;
  name: string;
  address: string;
  phone: string;
  settings: CenterSettings;
}

export interface CenterSettings {
  timezone: string;
  currency: string;
  businessHours: {
    start: string;
    end: string;
  };
}

export interface KPIMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  status: 'success' | 'warning' | 'error';
  unit: string;
  sparklineData: number[];
  target?: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  level: 'critical' | 'warning' | 'info';
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  dueDate: Date;
  createdAt: Date;
}

export interface FinancialMetrics {
  revenue: {
    mtd: number;
    ytd: number;
    projection: number[];
  };
  expenses: {
    mtd: number;
    ytd: number;
    projection: number[];
  };
  ebitda: number;
  burnRate: number[];
  earnRate: number[];
}

export interface ClinicalMetrics {
  occupancyRate: number;
  cancellationRate: number;
  noShowRate: number;
  averagePhq9: number;
  averageGad7: number;
  adherenceRate: number;
  riskPatients: number;
}
