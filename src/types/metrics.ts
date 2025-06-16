import { Timestamp } from 'firebase/firestore';
import { EmotionalTone } from './session';
import { EmotionalState } from './patient';
import { AlertType, AlertUrgency } from './alert';

export interface Metrics {
  id: string;
  centerId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  data: {
    totalPatients: number;
    activeSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    newPatients: number;
    revenue?: number;
    averageSessionDuration: number;
    patientSatisfaction?: number;
    psychologistUtilization: Record<string, number>;
  };
  emotionalMetrics: {
    mostCommonEmotions: Record<string, number>;
    improvementRate: number;
    riskPatients: number;
  };
  createdAt: Date;
}

// Nuevas interfaces para el dashboard avanzado
export interface DashboardMetrics {
  // Métricas básicas
  totalActivePatients: number;
  totalSessions: number;
  averageSessionsPerPatient: number;
  activeAlerts: number;
  resolvedAlerts: number;
  
  // Distribuciones
  emotionalDistribution: Record<EmotionalTone | EmotionalState, number>;
  motivesDistribution: Record<string, number>;
  sessionTypeDistribution: Record<string, number>;
  alertTypeDistribution: Record<AlertType, number>;
  alertUrgencyDistribution: Record<AlertUrgency, number>;
  
  // Tendencias temporales
  sessionsOverTime: TimeSeriesData[];
  patientsOverTime: TimeSeriesData[];
  emotionalTrendsOverTime: EmotionalTrendData[];
  
  // Métricas de seguimiento
  followUpRate: number; // Pacientes con 2+ sesiones
  averageTimeBetweenSessions: number; // En días
  professionalWorkload: Record<string, number>;
  
  // Métricas de riesgo
  highRiskPatients: number;
  mediumRiskPatients: number;
  lowRiskPatients: number;
  
  // Período de cálculo
  calculatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
}

export interface TimeSeriesData {
  date: string; // YYYY-MM-DD
  value: number;
  label?: string;
}

export interface EmotionalTrendData {
  date: string;
  emotion: EmotionalTone | EmotionalState;
  count: number;
  percentage: number;
}

export interface MetricsFilters {
  dateRange: {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
  };
  professionalId?: string;
  patientId?: string;
  sessionType?: string;
  emotionalTone?: EmotionalTone | EmotionalState;
  alertType?: AlertType;
  includeInactive?: boolean;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'heatmap';
  title: string;
  dataKey: string;
  color?: string;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
}

export interface DashboardCard {
  id: string;
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'notion';
  includeCharts: boolean;
  includeSummary: boolean;
  includeRawData: boolean;
  dateRange: {
    start: string;
    end: string;
  };
  filters?: MetricsFilters;
}

export interface NotionExportConfig {
  databaseId: string;
  apiKey: string;
  pageTitle: string;
  includeCharts: boolean;
}

// Constantes para configuración de gráficos
export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1',
  emotions: [
    '#4caf50', // Estable
    '#ff9800', // Ansioso
    '#2196f3', // Deprimido
    '#f44336', // Irritable
    '#9c27b0', // Eufórico
    '#607d8b', // Confundido
    '#d32f2f', // Agresivo
    '#795548', // Retraído
    '#8bc34a', // Esperanzado
    '#ff5722'  // Frustrado
  ],
  gradient: [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#00ff00',
    '#0088fe',
    '#00c49f',
    '#ffbb28',
    '#ff8042',
    '#8dd1e1'
  ]
};

export const DEFAULT_CHART_CONFIG: Partial<ChartConfig> = {
  showLegend: true,
  showTooltip: true,
  height: 300
};

// Tipos para métricas agregadas mensuales (optimización)
export interface MonthlyMetrics {
  id: string;
  centerId: string;
  yearMonth: string; // YYYY-MM
  totalSessions: number;
  totalPatients: number;
  newPatients: number;
  completedSessions: number;
  cancelledSessions: number;
  emotionalToneDistribution: Record<EmotionalTone, number>;
  motivesDistribution: Record<string, number>;
  averageSessionsPerPatient: number;
  followUpRate: number;
  alertsGenerated: number;
  alertsResolved: number;
  professionalWorkload: Record<string, number>;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Utilidades para cálculos de métricas
export interface MetricsCalculationOptions {
  includeWeekends?: boolean;
  excludeCancelledSessions?: boolean;
  minimumSessionsForFollowUp?: number;
  riskLevelWeights?: {
    high: number;
    medium: number;
    low: number;
  };
}

export const DEFAULT_CALCULATION_OPTIONS: MetricsCalculationOptions = {
  includeWeekends: true,
  excludeCancelledSessions: true,
  minimumSessionsForFollowUp: 2,
  riskLevelWeights: {
    high: 3,
    medium: 2,
    low: 1
  }
};