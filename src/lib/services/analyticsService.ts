import { BaseFirebaseService } from './firebaseService';
import { COLLECTIONS } from '@/lib/firebase';
import { 
  TherapistAnalytics, 
  AnalyticsFilters, 
  EmotionalDistribution,
  MonthlySessionData,
  ConsultationReason,
  EmotionalEvolution,
  SymptomImprovement,
  PatientAnalyticsSummary,
  AIInsight,
} from '@/types/analytics';
import { Session } from '@/types/session';
import { Patient } from '@/types/patient';

export class AnalyticsService {
  private sessionService = new BaseFirebaseService<Session>(COLLECTIONS.SESSIONS);
  private patientService = new BaseFirebaseService<Patient>(COLLECTIONS.PATIENTS);
  private insightService = new BaseFirebaseService<AIInsight>('ai_insights');

  async getTherapistAnalytics(
    centerId: string, 
    therapistId: string, 
    filters?: AnalyticsFilters
  ): Promise<TherapistAnalytics> {
    try {
      // Obtener datos base
      const [patients, sessions] = await Promise.all([
        this.getTherapistPatients(centerId, therapistId),
        this.getTherapistSessions(centerId, therapistId, filters)
      ]);

      // Calcular métricas principales
      const totalPatients = patients.length;
      const activeSessions = sessions.filter(s => s.status === 'programada' || s.status === 'completada').length;
      const averageSessionsPerPatient = totalPatients > 0 ? activeSessions / totalPatients : 0;
      
      // Calcular alertas activas
      const activeAlerts = patients.reduce((sum, p) => {
        if (p.riskLevel === 'critical') return sum + 3;
        if (p.riskLevel === 'high') return sum + 2;
        if (p.riskLevel === 'medium') return sum + 1;
        return sum;
      }, 0);

      // Calcular distribución emocional
      const predominantEmotions = this.calculateEmotionalDistribution(sessions);

      // Calcular tasa de seguimiento
      const patientsWithMultipleSessions = patients.filter(p => p.totalSessions >= 2).length;
      const followUpRate = totalPatients > 0 ? (patientsWithMultipleSessions / totalPatients) * 100 : 0;

      // Calcular retención de pacientes
      const activePatients = patients.filter(p => p.status === 'active').length;
      const patientRetentionRate = totalPatients > 0 ? (activePatients / totalPatients) * 100 : 0;

      // Calcular tasa de finalización de sesiones
      const scheduledSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.status === 'completed').length;
      const sessionCompletionRate = scheduledSessions > 0 ? (completedSessions / scheduledSessions) * 100 : 0;

      // Calcular duración promedio de sesiones
      const completedSessionsWithDuration = sessions.filter(s => s.status === 'completed' && s.duration);
      const averageSessionDuration = completedSessionsWithDuration.length > 0 
        ? completedSessionsWithDuration.reduce((sum, s) => sum + s.duration, 0) / completedSessionsWithDuration.length 
        : 0;

      // Generar datos mensuales
      const monthlySessionTrends = this.generateMonthlySessionTrends(sessions);

      // Calcular razones de consulta
      const consultationReasons = this.calculateConsultationReasons(patients);

      // Calcular evolución emocional
      const emotionalEvolution = this.calculateEmotionalEvolution(sessions, patients);

      // Calcular mejora de síntomas
      const symptomImprovement = this.calculateSymptomImprovement(patients);

      // Generar resumen de pacientes
      const patientSummary = this.generatePatientSummary(patients, sessions);

      return {
        totalPatients,
        activeSessions,
        averageSessionsPerPatient,
        activeAlerts,
        predominantEmotions,
        followUpRate,
        patientRetentionRate,
        sessionCompletionRate,
        averageSessionDuration,
        monthlySessionTrends,
        consultationReasons,
        emotionalEvolution,
        symptomImprovement,
        patientSummary
      };
    } catch (error) {
      console.error('Error getting therapist analytics:', error);
      throw error;
    }
  }

  private async getTherapistPatients(centerId: string, therapistId: string): Promise<Patient[]> {
    return this.patientService.getAll(centerId, {
      where: [{ field: 'assignedTherapist', operator: '==', value: therapistId }],
      orderBy: { field: 'lastName', direction: 'asc' }
    });
  }

  private async getTherapistSessions(
    centerId: string, 
    therapistId: string, 
    filters?: AnalyticsFilters
  ): Promise<Session[]> {
    const whereConditions: any[] = [
      { field: 'therapistId', operator: '==', value: therapistId }
    ];

    if (filters?.dateRange) {
      whereConditions.push(
        { field: 'date', operator: '>=', value: filters.dateRange.start },
        { field: 'date', operator: '<=', value: filters.dateRange.end }
      );
    }

    if (filters?.sessionType) {
      whereConditions.push({ field: 'type', operator: '==', value: filters.sessionType });
    }

    return this.sessionService.getAll(centerId, {
      where: whereConditions,
      orderBy: { field: 'date', direction: 'desc' }
    });
  }

  private calculateEmotionalDistribution(sessions: Session[]): EmotionalDistribution {
    const distribution: EmotionalDistribution = {
      anxiety: 0,
      depression: 0,
      stress: 0,
      calm: 0,
      happiness: 0,
      anger: 0,
      fear: 0,
      other: 0
    };

    const completedSessions = sessions.filter(s => s.status === 'completed' && s.emotionalState);
    
    if (completedSessions.length === 0) return distribution;

    // Simular distribución basada en datos de sesiones
    completedSessions.forEach(session => {
      const beforeState = session.emotionalState?.before || 5;
      
      if (beforeState <= 3) {
        distribution.depression += 1;
      } else if (beforeState <= 4) {
        distribution.anxiety += 1;
      } else if (beforeState <= 6) {
        distribution.stress += 1;
      } else if (beforeState <= 7) {
        distribution.calm += 1;
      } else {
        distribution.happiness += 1;
      }
    });

    // Convertir a porcentajes
    const total = completedSessions.length;
    Object.keys(distribution).forEach(key => {
      distribution[key as keyof EmotionalDistribution] = 
        (distribution[key as keyof EmotionalDistribution] / total) * 100;
    });

    return distribution;
  }

  private generateMonthlySessionTrends(sessions: Session[]): MonthlySessionData[] {
    const monthlyData = new Map<string, MonthlySessionData>();

    sessions.forEach(session => {
      const date = new Date(session.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('es-ES', { month: 'long' });

      if (!monthlyData.has(key)) {
        monthlyData.set(key, {
          month: monthName,
          year: date.getFullYear(),
          totalSessions: 0,
          completedSessions: 0,
          cancelledSessions: 0,
          noShowSessions: 0,
          averageRating: 0,
          revenue: 0
        });
      }

      const data = monthlyData.get(key)!;
      data.totalSessions += 1;

      if (session.status === 'completed') {
        data.completedSessions += 1;
        data.revenue += session.cost || 0;
      } else if (session.status === 'cancelled') {
        data.cancelledSessions += 1;
      } else if (session.status === 'no-show') {
        data.noShowSessions += 1;
      }
    });

    return Array.from(monthlyData.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return new Date(`${a.month} 1, ${a.year}`).getMonth() - new Date(`${b.month} 1, ${b.year}`).getMonth();
    });
  }

  private calculateConsultationReasons(patients: Patient[]): ConsultationReason[] {
    const reasonCounts = new Map<string, number>();
    const total = patients.length;

    patients.forEach(patient => {
      patient.diagnosis.forEach(diagnosis => {
        reasonCounts.set(diagnosis, (reasonCounts.get(diagnosis) || 0) + 1);
      });
    });

    return Array.from(reasonCounts.entries())
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: (count / total) * 100,
        trend: 'stable' as const // Simplificado, se podría calcular comparando con períodos anteriores
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateEmotionalEvolution(sessions: Session[], patients: Patient[]): EmotionalEvolution[] {
    const patientEvolution = new Map<string, EmotionalEvolution>();

    patients.forEach(patient => {
      patientEvolution.set(patient.id, {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        sessions: [],
        overallTrend: 'stable',
        averageImprovement: 0
      });
    });

    sessions
      .filter(s => s.status === 'completed' && s.emotionalState)
      .forEach(session => {
        const evolution = patientEvolution.get(session.patientId);
        if (evolution) {
          const improvement = (session.emotionalState.after - session.emotionalState.before);
          evolution.sessions.push({
            date: new Date(session.date),
            beforeSession: session.emotionalState.before,
            afterSession: session.emotionalState.after,
            improvement
          });
        }
      });

    // Calcular tendencias y promedios
    patientEvolution.forEach(evolution => {
      if (evolution.sessions.length > 0) {
        const improvements = evolution.sessions.map(s => s.improvement);
        evolution.averageImprovement = improvements.reduce((a, b) => a + b, 0) / improvements.length;
        
        if (evolution.averageImprovement > 1) {
          evolution.overallTrend = 'improving';
        } else if (evolution.averageImprovement < -1) {
          evolution.overallTrend = 'declining';
        }
      }
    });

    return Array.from(patientEvolution.values())
      .filter(e => e.sessions.length > 0)
      .sort((a, b) => b.averageImprovement - a.averageImprovement);
  }

  private calculateSymptomImprovement(patients: Patient[]): SymptomImprovement[] {
    // Simplificado - en una implementación real se compararían evaluaciones pre/post
    const symptoms = ['Ansiedad', 'Depresión', 'Estrés', 'Insomnio', 'Fobias'];
    
    return symptoms.map(symptom => ({
      symptom,
      pretreatmentAverage: Math.random() * 3 + 7, // 7-10
      currentAverage: Math.random() * 3 + 3, // 3-6
      improvementPercentage: Math.random() * 30 + 40, // 40-70%
      patientsAffected: Math.floor(Math.random() * patients.length * 0.6)
    }));
  }

  private generatePatientSummary(patients: Patient[], sessions: Session[]): PatientAnalyticsSummary[] {
    return patients.map(patient => {
      const patientSessions = sessions.filter(s => s.patientId === patient.id);
      const completedSessions = patientSessions.filter(s => s.status === 'completed');
      
      // Calcular emoción predominante
      const emotionalStates = completedSessions
        .filter(s => s.emotionalState)
        .map(s => s.emotionalState.before);
      
      const avgEmotionalState = emotionalStates.length > 0 
        ? emotionalStates.reduce((a, b) => a + b, 0) / emotionalStates.length 
        : 5;

      let predominantEmotion = 'Neutral';
      if (avgEmotionalState <= 3) predominantEmotion = 'Depresión';
      else if (avgEmotionalState <= 4) predominantEmotion = 'Ansiedad';
      else if (avgEmotionalState <= 6) predominantEmotion = 'Estrés';
      else if (avgEmotionalState <= 7) predominantEmotion = 'Calma';
      else predominantEmotion = 'Bienestar';

      // Calcular alertas activas
      let activeAlerts = 0;
      if (patient.riskLevel === 'critical') activeAlerts = 3;
      else if (patient.riskLevel === 'high') activeAlerts = 2;
      else if (patient.riskLevel === 'medium') activeAlerts = 1;

      // Calcular progreso general
      const improvements = completedSessions
        .filter(s => s.emotionalState)
        .map(s => s.emotionalState.after - s.emotionalState.before);
      
      const averageImprovement = improvements.length > 0 
        ? improvements.reduce((a, b) => a + b, 0) / improvements.length 
        : 0;

      const overallProgress = Math.max(0, Math.min(100, 50 + (averageImprovement * 10)));

      // Calcular adherencia
      const scheduledSessions = patientSessions.length;
      const adherenceRate = scheduledSessions > 0 
        ? (completedSessions.length / scheduledSessions) * 100 
        : 0;

      // Encontrar última y próxima sesión
      const lastSession = completedSessions.length > 0 
        ? new Date(Math.max(...completedSessions.map(s => new Date(s.date).getTime())))
        : new Date(patient.createdAt);

      const upcomingSessions = patientSessions.filter(s => 
        s.status === 'scheduled' && new Date(s.date) > new Date()
      );
      const nextSession = upcomingSessions.length > 0 
        ? new Date(Math.min(...upcomingSessions.map(s => new Date(s.date).getTime())))
        : undefined;

      return {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        totalSessions: completedSessions.length,
        predominantEmotion,
        activeAlerts,
        lastSession,
        nextSession,
        overallProgress,
        riskLevel: patient.riskLevel,
        adherenceRate,
        averageImprovement
      };
    }).sort((a, b) => b.overallProgress - a.overallProgress);
  }

  async getAIInsights(centerId: string, therapistId: string): Promise<AIInsight[]> {
    try {
      // En una implementación real, esto se generaría con IA
      const now = new Date();
      const mockInsights: Omit<AIInsight, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          type: 'recommendation',
          title: 'Aumentar frecuencia de seguimiento',
          description: 'Se recomienda aumentar la frecuencia de sesiones para 3 pacientes con alta alerta emocional.',
          confidence: 0.85,
          impact: 'high',
          actionable: true,
          suggestedActions: [
            'Programar sesiones adicionales para pacientes de alto riesgo',
            'Implementar check-ins semanales',
            'Considerar terapia intensiva'
          ],
          relatedPatients: ['patient1', 'patient2', 'patient3'],
          category: 'clinical'
        },
        {
          type: 'alert',
          title: 'Patrón de cancelaciones',
          description: '5 pacientes han cancelado 2+ sesiones consecutivas. Riesgo de abandono del tratamiento.',
          confidence: 0.92,
          impact: 'high',
          actionable: true,
          suggestedActions: [
            'Contactar pacientes para evaluar barreras',
            'Ofrecer sesiones virtuales como alternativa',
            'Revisar horarios disponibles'
          ],
          category: 'operational'
        },
        {
          type: 'trend',
          title: 'Mejora en síntomas de ansiedad',
          description: 'Los pacientes muestran una mejora del 65% en síntomas de ansiedad en los últimos 3 meses.',
          confidence: 0.78,
          impact: 'medium',
          actionable: false,
          suggestedActions: [
            'Continuar con las técnicas actuales',
            'Documentar estrategias exitosas'
          ],
          category: 'clinical'
        }
      ];

      // Convert mock data to full AIInsight objects with Firebase document properties
      return mockInsights.map((insight, index) => ({
        id: `insight_${index + 1}`,
        ...insight,
        createdAt: now,
        updatedAt: now
      }));
    } catch (error) {
      console.error('Error getting AI insights:', error);
      return [];
    }
  }

  async exportAnalyticsData(
    centerId: string, 
    therapistId: string, 
    options: { format: 'json' | 'csv'; dateRange: { start: Date; end: Date } }
  ): Promise<Blob> {
    const analytics = await this.getTherapistAnalytics(centerId, therapistId, {
      dateRange: options.dateRange
    });

    if (options.format === 'json') {
      const data = JSON.stringify(analytics, null, 2);
      return new Blob([data], { type: 'application/json' });
    } else {
      // Generar CSV
      const csvData = this.generateCSV(analytics);
      return new Blob([csvData], { type: 'text/csv' });
    }
  }

  private generateCSV(analytics: TherapistAnalytics): string {
    const headers = [
      'Métrica',
      'Valor',
      'Descripción'
    ];

    const rows = [
      ['Total de Pacientes', analytics.totalPatients.toString(), 'Número total de pacientes asignados'],
      ['Sesiones Activas', analytics.activeSessions.toString(), 'Sesiones completadas en el período'],
      ['Promedio Sesiones/Paciente', analytics.averageSessionsPerPatient.toFixed(2), 'Promedio de sesiones por paciente'],
      ['Alertas Activas', analytics.activeAlerts.toString(), 'Número de alertas clínicas activas'],
      ['Tasa de Seguimiento', `${analytics.followUpRate.toFixed(1)}%`, 'Porcentaje de pacientes con 2+ sesiones'],
      ['Tasa de Retención', `${analytics.patientRetentionRate.toFixed(1)}%`, 'Porcentaje de pacientes activos'],
      ['Finalización de Sesiones', `${analytics.sessionCompletionRate.toFixed(1)}%`, 'Porcentaje de sesiones completadas'],
      ['Duración Promedio', `${analytics.averageSessionDuration.toFixed(0)} min`, 'Duración promedio de sesiones']
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }
}

export const analyticsService = new AnalyticsService();