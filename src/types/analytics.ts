import { FirebaseDocument } from '@/lib/services/firebaseService';

export interface TherapistAnalytics {
  totalPatients: number;
  activeSessions: number;
  averageSessionsPerPatient: number;
  activeAlerts: number;
  predominantEmotions: EmotionalDistribution;
  followUpRate: number;
  patientRetentionRate: number;
  sessionCompletionRate: number;
  averageSessionDuration: number;
  monthlySessionTrends: MonthlySessionData[];
  consultationReasons: ConsultationReason[];
  emotionalEvolution: EmotionalEvolution[];
  symptomImprovement: SymptomImprovement[];
  patientSummary: PatientAnalyticsSummary[];
}

export interface EmotionalDistribution {
  anxiety: number;
  depression: number;
  stress: number;
  calm: number;
  happiness: number;
  anger: number;
  fear: number;
  other: number;
}

export interface MonthlySessionData {
  month: string;
  year: number;
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  averageRating: number;
  revenue: number;
}

export interface ConsultationReason {
  reason: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface EmotionalEvolution {
  patientId: string;
  patientName: string;
  sessions: {
    date: Date;
    beforeSession: number;
    afterSession: number;
    improvement: number;
  }[];
  overallTrend: 'improving' | 'stable' | 'declining';
  averageImprovement: number;
}

export interface SymptomImprovement {
  symptom: string;
  pretreatmentAverage: number;
  currentAverage: number;
  improvementPercentage: number;
  patientsAffected: number;
}

export interface PatientAnalyticsSummary {
  id: string;
  name: string;
  totalSessions: number;
  predominantEmotion: string;
  activeAlerts: number;
  lastSession: Date;
  nextSession?: Date;
  overallProgress: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  adherenceRate: number;
  averageImprovement: number;
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  patientId?: string;
  sessionType?: 'individual' | 'group' | 'family' | 'couple';
  alertLevel?: 'low' | 'medium' | 'high' | 'critical';
  therapistId?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel' | 'json';
  includeCharts: boolean;
  includePatientDetails: boolean;
  includeMetrics: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface AIInsight extends FirebaseDocument {
  type: 'recommendation' | 'alert' | 'trend' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestedActions: string[];
  relatedPatients?: string[];
  category: 'clinical' | 'operational' | 'patient-care';
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  status: 'success' | 'warning' | 'error' | 'info';
  unit: string;
  description: string;
  target?: number;
  sparklineData?: number[];
}