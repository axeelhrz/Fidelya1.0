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
