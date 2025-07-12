import { BaseFirebaseService, FirebaseDocument } from './firebaseService';
import { COLLECTIONS } from '@/lib/firebase';
import { Session } from './financialService';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  getDocs,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interfaces para datos clínicos
export interface Patient extends FirebaseDocument {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
    email?: string;
  };
  assignedTherapist?: string;
  status: 'active' | 'inactive' | 'discharged' | 'pending';
  tags: string[];
  diagnosis: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  phq9Score?: number;
  gad7Score?: number;
  notes: string;
  lastSession?: Date;
  totalSessions: number;
  medicalHistory: {
    allergies: string[];
    medications: string[];
    previousDiagnoses: string[];
    familyHistory: string[];
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    validUntil?: Date;
  };
}

export interface Therapist extends FirebaseDocument {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specializations: string[];
  licenseNumber: string;
  status: 'active' | 'inactive' | 'on-leave';
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      available: boolean;
      breaks?: { start: string; end: string }[];
    };
  };
  consultingRooms: string[];
  hourlyRate: number;
  experience: number;
  education: string[];
  certifications: string[];
  currentPatients: number;
  maxPatients: number;
  averageRating?: number;
  totalSessions: number;
}

export interface ClinicalAssessment extends FirebaseDocument {
  patientId: string;
  therapistId: string;
  type: 'phq9' | 'gad7' | 'beck' | 'hamilton' | 'custom';
  score: number;
  maxScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe' | 'critical';
  responses: { [questionId: string]: number | string };
  notes?: string;
  recommendations: string[];
  nextAssessmentDate?: Date;
}

export interface ClinicalAlert extends FirebaseDocument {
  patientId: string;
  therapistId?: string;
  type: 'risk' | 'medication' | 'appointment' | 'assessment' | 'crisis';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'active' | 'acknowledged' | 'resolved';
  actionRequired: boolean;
  dueDate?: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolutionNotes?: string;
}

export interface ClinicalMetrics {
  occupancyRate: number;
  cancellationRate: number;
  noShowRate: number;
  averagePhq9: number;
  averageGad7: number;
  adherenceRate: number;
  riskPatients: number;
  averageSessionsPerPatient: number;
  improvementRate: number;
  dischargeRate: number;
  therapistUtilization: { [therapistId: string]: number };
  waitingListSize: number;
  averageWaitTime: number;
  lastUpdated: Date;
  totalPatients: number;
  totalTherapists: number;
  totalSessions: number;
  activeAlerts: number;
}

// Servicios especializados
class PatientService extends BaseFirebaseService<Patient> {
  constructor() {
    super(COLLECTIONS.PATIENTS);
  }

  async getActivePatients(centerId: string): Promise<Patient[]> {
    return this.getAll(centerId, {
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'lastName', direction: 'asc' }
    });
  }

  async getPatientsByTherapist(centerId: string, therapistId: string): Promise<Patient[]> {
    return this.getAll(centerId, {
      where: [
        { field: 'assignedTherapist', operator: '==', value: therapistId },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: { field: 'lastName', direction: 'asc' }
    });
  }

  async getHighRiskPatients(centerId: string): Promise<Patient[]> {
    return this.getAll(centerId, {
      where: [
        { field: 'riskLevel', operator: 'in', value: ['high', 'critical'] },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: { field: 'riskLevel', direction: 'desc' }
    });
  }

  async searchPatients(centerId: string, searchTerm: string): Promise<Patient[]> {
    const patients = await this.getActivePatients(centerId);
    const term = searchTerm.toLowerCase();
    
    return patients.filter(patient => 
      patient.firstName.toLowerCase().includes(term) ||
      patient.lastName.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term) ||
      patient.phone.includes(term)
    );
  }

  // Suscripción en tiempo real para pacientes
  subscribeToActivePatients(centerId: string, callback: (patients: Patient[]) => void): () => void {
    try {
      const q = query(
        collection(db, COLLECTIONS.CENTERS, centerId, this.collectionName),
        where('status', '==', 'active'),
        orderBy('lastName', 'asc')
      );

      return onSnapshot(q, (snapshot) => {
        const patients = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            dateOfBirth: data.dateOfBirth?.toDate() || new Date(),
            lastSession: data.lastSession?.toDate() || null,
            insuranceInfo: data.insuranceInfo ? {
              ...data.insuranceInfo,
              validUntil: data.insuranceInfo.validUntil?.toDate() || null
            } : undefined
          } as Patient;
        });
        callback(patients);
      }, (error) => {
        console.error('Error in patients subscription:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Failed to subscribe to patients:', error);
      return () => {};
    }
  }
}

class TherapistService extends BaseFirebaseService<Therapist> {
  constructor() {
    super(COLLECTIONS.THERAPISTS);
  }

  async getActiveTherapists(centerId: string): Promise<Therapist[]> {
    return this.getAll(centerId, {
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'lastName', direction: 'asc' }
    });
  }

  async getAvailableTherapists(centerId: string, date: Date, time: string): Promise<Therapist[]> {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const therapists = await this.getActiveTherapists(centerId);
    
    return therapists.filter(therapist => {
      const schedule = therapist.schedule[dayOfWeek];
      if (!schedule || !schedule.available) return false;
      
      const requestedTime = new Date(`2000-01-01T${time}`);
      const startTime = new Date(`2000-01-01T${schedule.start}`);
      const endTime = new Date(`2000-01-01T${schedule.end}`);
      
      return requestedTime >= startTime && requestedTime <= endTime;
    });
  }

  async getTherapistWorkload(centerId: string, therapistId: string): Promise<{
    currentPatients: number;
    maxPatients: number;
    utilization: number;
    weeklyHours: number;
  }> {
    const therapist = await this.getById(centerId, therapistId);
    if (!therapist) throw new Error('Therapist not found');

    const weeklyHours = Object.values(therapist.schedule).reduce((total, day) => {
      if (!day.available) return total;
      
      const start = new Date(`2000-01-01T${day.start}`);
      const end = new Date(`2000-01-01T${day.end}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      return total + hours;
    }, 0);

    const utilization = therapist.maxPatients > 0 
      ? (therapist.currentPatients / therapist.maxPatients) * 100 
      : 0;

    return {
      currentPatients: therapist.currentPatients,
      maxPatients: therapist.maxPatients,
      utilization,
      weeklyHours
    };
  }

  // Suscripción en tiempo real para terapeutas
  subscribeToActiveTherapists(centerId: string, callback: (therapists: Therapist[]) => void): () => void {
    try {
      const q = query(
        collection(db, COLLECTIONS.CENTERS, centerId, this.collectionName),
        where('status', '==', 'active'),
        orderBy('lastName', 'asc')
      );

      return onSnapshot(q, (snapshot) => {
        const therapists = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as Therapist;
        });
        callback(therapists);
      }, (error) => {
        console.error('Error in therapists subscription:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Failed to subscribe to therapists:', error);
      return () => {};
    }
  }
}

class AssessmentService extends BaseFirebaseService<ClinicalAssessment> {
  constructor() {
    super('assessments');
  }

  async getPatientAssessments(centerId: string, patientId: string): Promise<ClinicalAssessment[]> {
    return this.getAll(centerId, {
      where: [{ field: 'patientId', operator: '==', value: patientId }],
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  }

  async getLatestAssessment(centerId: string, patientId: string, type: ClinicalAssessment['type']): Promise<ClinicalAssessment | null> {
    const assessments = await this.getAll(centerId, {
      where: [
        { field: 'patientId', operator: '==', value: patientId },
        { field: 'type', operator: '==', value: type }
      ],
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit: 1
    });

    return assessments.length > 0 ? assessments[0] : null;
  }

  async getAssessmentTrends(centerId: string, patientId: string, type: ClinicalAssessment['type']): Promise<{
    scores: number[];
    dates: Date[];
    trend: 'improving' | 'stable' | 'declining';
  }> {
    const assessments = await this.getAll(centerId, {
      where: [
        { field: 'patientId', operator: '==', value: patientId },
        { field: 'type', operator: '==', value: type }
      ],
      orderBy: { field: 'createdAt', direction: 'asc' }
    });

    const scores = assessments.map(a => a.score);
    const dates = assessments.map(a => a.createdAt);

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (scores.length >= 2) {
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg < firstAvg * 0.9) trend = 'improving';
      else if (secondAvg > firstAvg * 1.1) trend = 'declining';
    }

    return { scores, dates, trend };
  }

  async calculateImprovementRate(centerId: string): Promise<number> {
    try {
      const allAssessments = await this.getAll(centerId, {
        orderBy: { field: 'createdAt', direction: 'asc' }
      });

      const patientAssessments = new Map<string, ClinicalAssessment[]>();
      
      // Agrupar evaluaciones por paciente
      allAssessments.forEach(assessment => {
        if (!patientAssessments.has(assessment.patientId)) {
          patientAssessments.set(assessment.patientId, []);
        }
        patientAssessments.get(assessment.patientId)!.push(assessment);
      });

      let improvedPatients = 0;
      let totalPatientsWithMultipleAssessments = 0;

      // Calcular mejora para cada paciente
      patientAssessments.forEach((assessments) => {
        if (assessments.length < 2) return;
        
        totalPatientsWithMultipleAssessments++;
        
        // Comparar primera y última evaluación
        const firstAssessment = assessments[0];
        const lastAssessment = assessments[assessments.length - 1];
        
        // Considerar mejora si la puntuación ha disminuido (menor es mejor en PHQ-9 y GAD-7)
        if (lastAssessment.score < firstAssessment.score * 0.8) {
          improvedPatients++;
        }
      });

      return totalPatientsWithMultipleAssessments > 0 
        ? (improvedPatients / totalPatientsWithMultipleAssessments) * 100 
        : 0;
    } catch (error) {
      console.error('Error calculating improvement rate:', error);
      return 0;
    }
  }

  // Suscripción en tiempo real para evaluaciones
  subscribeToAssessments(centerId: string, callback: (assessments: ClinicalAssessment[]) => void): () => void {
    try {
      const q = query(
        collection(db, COLLECTIONS.CENTERS, centerId, this.collectionName),
        orderBy('createdAt', 'desc'),
        limit(100)
      );

      return onSnapshot(q, (snapshot) => {
        const assessments = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            nextAssessmentDate: data.nextAssessmentDate?.toDate() || null
          } as ClinicalAssessment;
        });
        callback(assessments);
      }, (error) => {
        console.error('Error in assessments subscription:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Failed to subscribe to assessments:', error);
      return () => {};
    }
  }
}

class ClinicalAlertService extends BaseFirebaseService<ClinicalAlert> {
  constructor() {
    super('clinical_alerts');
  }

  async getActiveAlerts(centerId: string): Promise<ClinicalAlert[]> {
    return this.getAll(centerId, {
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'severity', direction: 'desc' }
    });
  }

  async getCriticalAlerts(centerId: string): Promise<ClinicalAlert[]> {
    return this.getAll(centerId, {
      where: [
        { field: 'severity', operator: '==', value: 'critical' },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  }

  async getPatientAlerts(centerId: string, patientId: string): Promise<ClinicalAlert[]> {
    return this.getAll(centerId, {
      where: [{ field: 'patientId', operator: '==', value: patientId }],
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  }

  async acknowledgeAlert(centerId: string, alertId: string, acknowledgedBy: string): Promise<void> {
    await this.update(centerId, alertId, {
      status: 'acknowledged',
      acknowledgedBy,
      acknowledgedAt: new Date()
    });
  }

  async resolveAlert(centerId: string, alertId: string, resolvedBy: string, notes?: string): Promise<void> {
    await this.update(centerId, alertId, {
      status: 'resolved',
      resolvedBy,
      resolvedAt: new Date(),
      resolutionNotes: notes
    });
  }
}

class SessionService extends BaseFirebaseService<Session> {
  constructor() {
    super(COLLECTIONS.SESSIONS);
  }

  async getAllSessions(centerId: string): Promise<Session[]> {
    return this.getAll(centerId, {
      orderBy: { field: 'date', direction: 'desc' },
      limit: 1000
    });
  }

  async getSessionsByStatus(centerId: string, status: Session['status']): Promise<Session[]> {
    return this.getAll(centerId, {
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: { field: 'date', direction: 'desc' }
    });
  }

  async getRecentSessions(centerId: string, days: number = 30): Promise<Session[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.getAll(centerId, {
      where: [{ field: 'date', operator: '>=', value: startDate }],
      orderBy: { field: 'date', direction: 'desc' }
    });
  }

  // Suscripción en tiempo real para sesiones
  subscribeToRecentSessions(centerId: string, callback: (sessions: Session[]) => void, days: number = 30): () => void {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const q = query(
        collection(db, COLLECTIONS.CENTERS, centerId, this.collectionName),
        where('date', '>=', Timestamp.fromDate(startDate)),
        orderBy('date', 'desc'),
        limit(500)
      );

      return onSnapshot(q, (snapshot) => {
        const sessions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            date: data.date?.toDate() || new Date()
          } as Session;
        });
        callback(sessions);
      }, (error) => {
        console.error('Error in sessions subscription:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Failed to subscribe to sessions:', error);
      return () => {};
    }
  }
}

// Servicio principal para datos clínicos con capacidades en tiempo real
export class ClinicalService {
  private patientService = new PatientService();
  private therapistService = new TherapistService();
  private assessmentService = new AssessmentService();
  private alertService = new ClinicalAlertService();
  private sessionService = new SessionService();

  // Cache para métricas
  private metricsCache: { [centerId: string]: { data: ClinicalMetrics; timestamp: number } } = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  async getClinicalMetrics(centerId: string, useCache: boolean = true): Promise<ClinicalMetrics> {
    // Verificar cache
    if (useCache && this.metricsCache[centerId]) {
      const cached = this.metricsCache[centerId];
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    try {
      // Obtener datos en paralelo
      const [patients, therapists, sessions, assessments] = await Promise.all([
        this.patientService.getActivePatients(centerId),
        this.therapistService.getActiveTherapists(centerId),
        this.sessionService.getAllSessions(centerId),
        this.assessmentService.getAll(centerId)
      ]);

      // Calcular métricas básicas de pacientes
      const totalPatients = patients.length;
      const riskPatients = patients.filter(p => ['high', 'critical'].includes(p.riskLevel)).length;
      
      const phq9Scores = patients.filter(p => p.phq9Score !== undefined).map(p => p.phq9Score!);
      const gad7Scores = patients.filter(p => p.gad7Score !== undefined).map(p => p.gad7Score!);
      
      const averagePhq9 = phq9Scores.length > 0 
        ? phq9Scores.reduce((a, b) => a + b, 0) / phq9Scores.length 
        : 0;
      
      const averageGad7 = gad7Scores.length > 0 
        ? gad7Scores.reduce((a, b) => a + b, 0) / gad7Scores.length 
        : 0;

      const totalSessions = patients.reduce((sum, p) => sum + p.totalSessions, 0);
      const averageSessionsPerPatient = totalPatients > 0 ? totalSessions / totalPatients : 0;

      // Calcular métricas de sesiones
      const completedSessions = sessions.filter(s => s.status === 'completed');
      const cancelledSessions = sessions.filter(s => s.status === 'cancelled');
      const noShowSessions = sessions.filter(s => s.status === 'no-show');
      
      const totalScheduledSessions = sessions.length;
      const cancellationRate = totalScheduledSessions > 0 
        ? (cancelledSessions.length / totalScheduledSessions) * 100 
        : 0;
      
      const noShowRate = totalScheduledSessions > 0 
        ? (noShowSessions.length / totalScheduledSessions) * 100 
        : 0;

      // Calcular adherencia (sesiones completadas vs programadas)
      const adherenceRate = totalScheduledSessions > 0 
        ? (completedSessions.length / totalScheduledSessions) * 100 
        : 0;

      // Calcular utilización de terapeutas
      const therapistUtilization: { [therapistId: string]: number } = {};
      for (const therapist of therapists) {
        const workload = await this.therapistService.getTherapistWorkload(centerId, therapist.id);
        therapistUtilization[therapist.id] = workload.utilization;
      }

      // Calcular tasa de ocupación general
      const totalCapacity = therapists.reduce((sum, t) => sum + t.maxPatients, 0);
      const totalAssigned = therapists.reduce((sum, t) => sum + t.currentPatients, 0);
      const occupancyRate = totalCapacity > 0 ? (totalAssigned / totalCapacity) * 100 : 0;

      // Calcular tasa de mejora desde evaluaciones
      const improvementRate = await this.assessmentService.calculateImprovementRate(centerId);

      // Calcular tasa de alta (pacientes dados de alta en los últimos 6 meses)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const dischargedPatients = await this.patientService.getAll(centerId, {
        where: [
          { field: 'status', operator: '==', value: 'discharged' },
          { field: 'updatedAt', operator: '>=', value: sixMonthsAgo }
        ]
      });
      
      const dischargeRate = totalPatients > 0 
        ? (dischargedPatients.length / (totalPatients + dischargedPatients.length)) * 100 
        : 0;

      // Obtener alertas activas
      const activeAlerts = await this.alertService.getActiveAlerts(centerId);

      const metrics: ClinicalMetrics = {
        occupancyRate,
        cancellationRate,
        noShowRate,
        averagePhq9,
        averageGad7,
        adherenceRate,
        riskPatients,
        averageSessionsPerPatient,
        improvementRate,
        dischargeRate,
        therapistUtilization,
        waitingListSize: 0, // Implementar lista de espera
        averageWaitTime: 0, // Implementar tiempo de espera promedio
        lastUpdated: new Date(),
        totalPatients,
        totalTherapists: therapists.length,
        totalSessions: totalScheduledSessions,
        activeAlerts: activeAlerts.length
      };

      // Actualizar cache
      this.metricsCache[centerId] = {
        data: metrics,
        timestamp: Date.now()
      };

      return metrics;
    } catch (error) {
      console.error('Error getting clinical metrics:', error);
      throw error;
    }
  }

  // Suscripción en tiempo real para métricas clínicas
  subscribeToMetrics(centerId: string, callback: (metrics: ClinicalMetrics) => void): () => void {
    let unsubscribeFunctions: (() => void)[] = [];
    let isSubscribed = true;

    const updateMetrics = async () => {
      if (!isSubscribed) return;
      try {
        const metrics = await this.getClinicalMetrics(centerId, false);
        callback(metrics);
      } catch (error) {
        console.error('Error updating metrics:', error);
      }
    };

    // Suscribirse a cambios en pacientes
    const unsubscribePatients = this.patientService.subscribeToActivePatients(centerId, () => {
      updateMetrics();
    });

    // Suscribirse a cambios en terapeutas
    const unsubscribeTherapists = this.therapistService.subscribeToActiveTherapists(centerId, () => {
      updateMetrics();
    });

    // Suscribirse a cambios en sesiones recientes
    const unsubscribeSessions = this.sessionService.subscribeToRecentSessions(centerId, () => {
      updateMetrics();
    });

    // Suscribirse a cambios en evaluaciones
    const unsubscribeAssessments = this.assessmentService.subscribeToAssessments(centerId, () => {
      updateMetrics();
    });

    unsubscribeFunctions = [
      unsubscribePatients,
      unsubscribeTherapists,
      unsubscribeSessions,
      unsubscribeAssessments
    ];

    // Cargar métricas iniciales
    updateMetrics();

    // Retornar función de limpieza
    return () => {
      isSubscribed = false;
      unsubscribeFunctions.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
      });
    };
  }

  async generateRiskAssessment(centerId: string, patientId: string): Promise<{
    riskLevel: Patient['riskLevel'];
    factors: string[];
    recommendations: string[];
    score: number;
  }> {
    const patient = await this.patientService.getById(centerId, patientId);
    if (!patient) throw new Error('Patient not found');

    const factors: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Evaluar PHQ-9
    if (patient.phq9Score !== undefined) {
      if (patient.phq9Score >= 20) {
        factors.push('PHQ-9 severo (≥20)');
        score += 30;
      } else if (patient.phq9Score >= 15) {
        factors.push('PHQ-9 moderado-severo (15-19)');
        score += 20;
      } else if (patient.phq9Score >= 10) {
        factors.push('PHQ-9 moderado (10-14)');
        score += 10;
      }
    }

    // Evaluar GAD-7
    if (patient.gad7Score !== undefined) {
      if (patient.gad7Score >= 15) {
        factors.push('GAD-7 severo (≥15)');
        score += 25;
      } else if (patient.gad7Score >= 10) {
        factors.push('GAD-7 moderado (10-14)');
        score += 15;
      }
    }

    // Evaluar historial
    if (patient.medicalHistory.previousDiagnoses.some(d => 
      d.toLowerCase().includes('suicid') || d.toLowerCase().includes('autolesión')
    )) {
      factors.push('Historial de ideación suicida');
      score += 40;
    }

    // Evaluar adherencia
    const recentSessions = patient.totalSessions;
    if (recentSessions < 3) {
      factors.push('Baja adherencia al tratamiento');
      score += 15;
    }

    // Determinar nivel de riesgo
    let riskLevel: Patient['riskLevel'];
    if (score >= 60) {
      riskLevel = 'critical';
      recommendations.push('Evaluación inmediata de riesgo suicida');
      recommendations.push('Considerar hospitalización');
      recommendations.push('Contacto con emergencias');
    } else if (score >= 40) {
      riskLevel = 'high';
      recommendations.push('Aumentar frecuencia de sesiones');
      recommendations.push('Evaluación psiquiátrica');
      recommendations.push('Plan de seguridad');
    } else if (score >= 20) {
      riskLevel = 'medium';
      recommendations.push('Monitoreo cercano');
      recommendations.push('Revisión de medicación');
    } else {
      riskLevel = 'low';
      recommendations.push('Continuar tratamiento actual');
    }

    return { riskLevel, factors, recommendations, score };
  }

  // Métodos para suscripciones en tiempo real
  subscribeToPatients(centerId: string, callback: (patients: Patient[]) => void): () => void {
    return this.patientService.subscribeToActivePatients(centerId, callback);
  }

  subscribeToAlerts(centerId: string, callback: (alerts: ClinicalAlert[]) => void): () => void {
    return this.alertService.subscribeToChanges(centerId, callback, {
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'severity', direction: 'desc' }
    });
  }

  subscribeToTherapists(centerId: string, callback: (therapists: Therapist[]) => void): () => void {
    return this.therapistService.subscribeToActiveTherapists(centerId, callback);
  }

  subscribeToSessions(centerId: string, callback: (sessions: Session[]) => void): () => void {
    return this.sessionService.subscribeToRecentSessions(centerId, callback);
  }

  // Limpiar cache
  clearCache(centerId?: string): void {
    if (centerId) {
      delete this.metricsCache[centerId];
    } else {
      this.metricsCache = {};
    }
  }
}

// Exportar instancia del servicio
export const clinicalService = new ClinicalService();
export { PatientService, TherapistService, AssessmentService, ClinicalAlertService, SessionService };