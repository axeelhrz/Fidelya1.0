import { BaseFirebaseService, FirebaseDocument } from './firebaseService';
import { COLLECTIONS } from '@/lib/firebase';

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
    // Firebase no soporta búsqueda de texto completo nativamente
    // Esta es una implementación básica que se puede mejorar con Algolia o similar
    const patients = await this.getActivePatients(centerId);
    const term = searchTerm.toLowerCase();
    
    return patients.filter(patient => 
      patient.firstName.toLowerCase().includes(term) ||
      patient.lastName.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term) ||
      patient.phone.includes(term)
    );
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
      
      // Verificar si el horario está dentro del rango disponible
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

    // Calcular horas semanales disponibles
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

    // Calcular tendencia simple
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

// Servicio principal para datos clínicos
export class ClinicalService {
  private patientService = new PatientService();
  private therapistService = new TherapistService();
  private assessmentService = new AssessmentService();
  private alertService = new ClinicalAlertService();

  async getClinicalMetrics(centerId: string): Promise<ClinicalMetrics> {
    try {
      // Obtener datos en paralelo
      const [patients, therapists] = await Promise.all([
        this.patientService.getActivePatients(centerId),
        this.therapistService.getActiveTherapists(centerId),
        this.alertService.getActiveAlerts(centerId)
      ]);

      // Calcular métricas
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

      // Calcular utilización de terapeutas
      const therapistUtilization: { [therapistId: string]: number } = {};
      for (const therapist of therapists) {
        const workload = await this.therapistService.getTherapistWorkload(centerId, therapist.id);
        therapistUtilization[therapist.id] = workload.utilization;
      }

      const totalCapacity = therapists.reduce((sum, t) => sum + t.maxPatients, 0);
      const totalAssigned = therapists.reduce((sum, t) => sum + t.currentPatients, 0);
      const occupancyRate = totalCapacity > 0 ? (totalAssigned / totalCapacity) * 100 : 0;

      return {
        occupancyRate,
        cancellationRate: 8.3, // Esto se calcularía desde las sesiones
        noShowRate: 3.2, // Esto se calcularía desde las sesiones
        averagePhq9,
        averageGad7,
        adherenceRate: 73.2, // Esto se calcularía desde las sesiones
        riskPatients,
        averageSessionsPerPatient,
        improvementRate: 68.5, // Esto se calcularía desde las evaluaciones
        dischargeRate: 12.8, // Esto se calcularía desde los pacientes dados de alta
        therapistUtilization,
        waitingListSize: 0, // Implementar lista de espera
        averageWaitTime: 0 // Implementar tiempo de espera promedio
      };
    } catch (error) {
      console.error('Error getting clinical metrics:', error);
      throw error;
    }
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

    // Evaluar adherencia (simulado)
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
    return this.patientService.subscribeToChanges(centerId, callback, {
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'lastName', direction: 'asc' }
    });
  }

  subscribeToAlerts(centerId: string, callback: (alerts: ClinicalAlert[]) => void): () => void {
    return this.alertService.subscribeToChanges(centerId, callback, {
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'severity', direction: 'desc' }
    });
  }

  subscribeToTherapists(centerId: string, callback: (therapists: Therapist[]) => void): () => void {
    return this.therapistService.subscribeToChanges(centerId, callback, {
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'lastName', direction: 'asc' }
    });
  }
}

// Exportar instancia del servicio
export const clinicalService = new ClinicalService();
export { PatientService, TherapistService, AssessmentService, ClinicalAlertService };
