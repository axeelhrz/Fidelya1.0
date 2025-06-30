// ============================================================================
// TIPOS BASE DEL MÓDULO CLÍNICO
// ============================================================================

export interface ClinicalModule {
  agenda: AgendaModule;
  patients: PatientsModule;
  notes: NotesModule;
  treatmentPlans: TreatmentPlansModule;
  assessments: AssessmentsModule;
  teleconsultation: TeleconsultationModule;
  patientPortal: PatientPortalModule;
  supervision: SupervisionModule;
  documents: DocumentsModule;
  globalSearch: GlobalSearchModule;
}

// ============================================================================
// 1.1 AGENDA Y RESERVA DE RECURSOS
// ============================================================================

export interface AgendaModule {
  appointments: Appointment[];
  rooms: ConsultingRoom[];
  therapists: Therapist[];
  schedules: TherapistSchedule[];
}

// ============================================================================
// AUXILIAR: DEFINICIÓN DE THERAPIST
// ============================================================================

export interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  licenseNumber: string;
  licenseState?: string;
  licenseExpiry?: Date;
  photoUrl?: string;
  isActive: boolean;
  centers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  roomId: string;
  centerId: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  reminderSent: boolean;
  checkIn?: Date;
  checkOut?: Date;
  cost: number;
  paid: boolean;
  repeatSeriesId?: string;
  isVirtual: boolean;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentType = 'individual' | 'group' | 'family' | 'couple' | 'assessment' | 'supervision';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';

export interface RepeatSeries {
  id: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  endDate?: Date;
  occurrences?: number;
  appointments: string[]; // appointment IDs
}

export interface TherapistSchedule {
  id: string;
  therapistId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  breaks: TimeSlot[];
  isActive: boolean;
  exceptions: ScheduleException[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  type?: 'break' | 'lunch' | 'meeting';
  description?: string;
}

export interface ScheduleException {
  date: Date;
  type: 'vacation' | 'sick' | 'meeting' | 'unavailable';
  startTime?: string;
  endTime?: string;
  description?: string;
}

export interface ConsultingRoom {
  id: string;
  centerId: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  location: string;
  features: RoomFeature[];
  bookings: RoomBooking[];
}

export interface RoomFeature {
  name: string;
  description?: string;
  icon?: string;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  appointmentId: string;
  startTime: Date;
  endTime: Date;
  purpose: string;
}

// ============================================================================
// 1.2 MAESTRO DE PACIENTES (EXTENDIDO)
// ============================================================================

export interface PatientsModule {
  patients: ExtendedPatient[];
  documents: PatientDocument[];
  timeline: PatientTimelineEvent[];
}

export interface ExtendedPatient {
  // Datos básicos (ya existentes)
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  pronouns?: string;
  
  // Datos extendidos
  identification: {
    type: 'dni' | 'passport' | 'nie';
    number: string;
    expiryDate?: Date;
  };
  
  address: {
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
  
  insurance: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
    copay?: number;
  };
  
  medicalInfo: {
    allergies: string[];
    currentMedications: Medication[];
    medicalHistory: string[];
    previousTherapy: boolean;
    previousTherapyDetails?: string;
  };
  
  // Información clínica
  assignedTherapist: string;
  status: PatientStatus;
  tags: string[];
  riskLevel: RiskLevel;
  
  // Escalas y evaluaciones
  assessmentScores: {
    phq9?: number;
    gad7?: number;
    beck?: number;
    custom: { [key: string]: number };
  };
  
  // Información administrativa
  referralSource: ReferralSource;
  consentForms: ConsentForm[];
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  lastSession?: Date;
  totalSessions: number;
  
  // Configuración de privacidad
  privacySettings: {
    allowSMS: boolean;
    allowEmail: boolean;
    allowCalls: boolean;
    shareWithFamily: boolean;
  };
  
  // Datos de seguimiento
  adherenceRate: number;
  satisfactionScore?: number;
  feedback: PatientFeedback[];
}

export type PatientStatus = 'active' | 'inactive' | 'discharged' | 'on-hold' | 'transferred';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface ReferralSource {
  type: 'self' | 'family' | 'friend' | 'doctor' | 'insurance' | 'online' | 'advertisement' | 'other';
  details?: string;
  referrerName?: string;
  referrerContact?: string;
}

export interface ConsentForm {
  id: string;
  type: string;
  signedDate: Date;
  documentUrl: string;
  version: string;
}

export interface PatientFeedback {
  id: string;
  date: Date;
  type: 'session' | 'general' | 'complaint' | 'compliment';
  rating: number; // 1-5
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: number;
  mimeType: string;
  tags: string[];
  isConfidential: boolean;
}

export type DocumentType = 'intake-form' | 'assessment' | 'medical-record' | 'insurance' | 'consent' | 'photo' | 'audio' | 'other';

export interface PatientTimelineEvent {
  id: string;
  patientId: string;
  date: Date;
  type: TimelineEventType;
  title: string;
  description: string;
  relatedId?: string; // ID of related session, assessment, etc.
  createdBy: string;
}

export type TimelineEventType = 'session' | 'assessment' | 'medication-change' | 'diagnosis-update' | 'referral' | 'discharge' | 'incident' | 'note';

// ============================================================================
// 1.3 NOTAS Y EVOLUCIONES
// ============================================================================

export interface NotesModule {
  notes: ClinicalNote[];
  templates: NoteTemplate[];
  signatures: ElectronicSignature[];
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  sessionId?: string;
  therapistId?: string;
  templateType: string;
  content: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    freeText?: string;
    [key: string]: unknown;
  };
  icdCodes: { code: string; description: string; confidence?: number }[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    interventions: string[];
  };
  signed: boolean;
  signedAt?: Date;
  signedBy?: string;
  signature?: ElectronicSignature;
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteTemplateType = 'soap' | 'dap' | 'birp' | 'girp' | 'free-form' | 'intake' | 'discharge';
export type NoteStatus = 'draft' | 'pending-signature' | 'signed' | 'locked' | 'archived';

export interface NoteContent {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  data?: string;
  behavior?: string;
  intervention?: string;
  response?: string;
  goals?: string;
  freeText?: string;
  riskAssessment?: RiskAssessment;
  mentalStatusExam?: MentalStatusExam;
}

export interface NoteTemplate {
  id: string;
  name: string;
  type: NoteTemplateType;
  fields: TemplateField[];
  isDefault: boolean;
  centerId: string;
  createdBy: string;
  createdAt: Date;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'number' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: FieldValidation;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface ElectronicSignature {
  id: string;
  therapistId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  signatureData: string; // Base64 encoded signature image
  isValid: boolean;
}

export interface AIValidation {
  id: string;
  noteId: string;
  timestamp: Date;
  coherenceScore: number; // 0-100
  suggestions: AISuggestion[];
  flaggedIssues: AIFlag[];
  confidence: number;
  isValid: boolean;
  riskFlags: string[];
  suggestedIcdCodes: string[];
}

export interface AISuggestion {
  type: 'icd-code' | 'dsm-code' | 'intervention' | 'risk-assessment' | 'grammar' | 'clarity';
  suggestion: string;
  confidence: number;
  reasoning: string;
  message: string;
  field?: string; // Optional field name if applicable
}

export interface AIFlag {
  type: 'inconsistency' | 'missing-info' | 'risk-indicator' | 'compliance-issue';
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

export interface RiskAssessment {
  suicidalIdeation: boolean;
  homicidalIdeation: boolean;
  selfHarm: boolean;
  substanceAbuse: boolean;
  psychosis: boolean;
  riskLevel: RiskLevel;
  interventions: string[];
  followUpRequired: boolean;
  emergencyContacts: boolean;
}

export interface MentalStatusExam {
  appearance: string;
  behavior: string;
  speech: string;
  mood: string;
  affect: string;
  thoughtProcess: string;
  thoughtContent: string;
  perceptions: string;
  cognition: string;
  insight: string;
  judgment: string;
}

// ============================================================================
// 1.4 PLANES DE TRATAMIENTO
// ============================================================================

export interface TreatmentPlansModule {
  plans: TreatmentPlan[];
  goals: TreatmentGoal[];
  tasks: PatientTask[];
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  therapistId: string;
  centerId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: TreatmentPlanStatus;
  goals: TreatmentGoal[];
  interventions: PlannedIntervention[];
  milestones: TreatmentMilestone[];
  adherenceRate: number;
  lastReviewDate?: Date;
  nextReviewDate: Date;
  reviewFrequency: number; // sessions
  signature?: ElectronicSignature;
  createdAt: Date;
  updatedAt: Date;
  history: TreatmentPlanHistory[];
}

export type TreatmentPlanStatus = 'active' | 'completed' | 'on-hold' | 'discontinued' | 'transferred';

export interface TreatmentGoal {
  id: string;
  planId: string;
  title: string;
  description: string;
  type: GoalType;
  priority: 'high' | 'medium' | 'low';
  targetDate: Date;
  status: GoalStatus;
  progress: number; // 0-100
  measurableOutcomes: MeasurableOutcome[];
  interventions: string[];
  barriers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type GoalType = 'behavioral' | 'cognitive' | 'emotional' | 'social' | 'functional' | 'symptom-reduction';
export type GoalStatus = 'not-started' | 'in-progress' | 'achieved' | 'modified' | 'discontinued';

export interface MeasurableOutcome {
  id: string;
  description: string;
  metric: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  measurementDates: Date[];
  values: number[];
}

export interface PlannedIntervention {
  id: string;
  name: string;
  type: InterventionType;
  frequency: string;
  duration: string;
  description: string;
  evidence: string;
  expectedOutcome: string;
}

export type InterventionType = 'cbt' | 'dbt' | 'psychodynamic' | 'humanistic' | 'behavioral' | 'mindfulness' | 'exposure' | 'emdr' | 'family-therapy' | 'group-therapy';

export interface TreatmentMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  achievedDate?: Date;
  status: 'pending' | 'achieved' | 'overdue';
  criteria: string[];
}

export interface TreatmentPlanHistory {
  id: string;
  date: Date;
  action: 'created' | 'modified' | 'reviewed' | 'goal-added' | 'goal-modified' | 'goal-achieved' | 'discontinued';
  description: string;
  changedBy: string;
  changes: Record<string, unknown>; // JSON object with specific changes
}

export interface PatientTask {
  id: string;
  patientId: string;
  planId: string;
  goalId?: string;
  title: string;
  description: string;
  type: TaskType;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  status: TaskStatus;
  completedDate?: Date;
  instructions: string;
  resources: TaskResource[];
  feedback?: string;
  rating?: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

export type TaskType = 'homework' | 'exercise' | 'reading' | 'practice' | 'reflection' | 'monitoring' | 'behavioral-experiment';
export type TaskStatus = 'assigned' | 'in-progress' | 'completed' | 'overdue' | 'skipped';

export interface TaskResource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'link' | 'app';
  url: string;
  description?: string;
}

// ============================================================================
// 1.5 EVALUACIONES PSICOMÉTRICAS
// ============================================================================

export interface AssessmentsModule {
  assessments: PsychometricAssessment[];
  tests: TestDefinition[];
  results: TestResult[];
  interpretations: TestInterpretation[];
}

export interface PsychometricAssessment {
  id: string;
  patientId: string;
  therapistId: string;
  centerId: string;
  testId: string;
  date: Date;
  type: AssessmentType;
  status: AssessmentStatus;
  administrationMethod: 'in-person' | 'online' | 'take-home';
  results: TestResult[];
  interpretation: TestInterpretation;
  recommendations: string[];
  followUpRequired: boolean;
  nextAssessmentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AssessmentType = 'screening' | 'diagnostic' | 'progress' | 'outcome' | 'neuropsychological' | 'personality';
export type AssessmentStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'invalid';

export interface TestDefinition {
  id: string;
  name: string;
  abbreviation: string;
  category: TestCategory;
  description: string;
  ageRange: {
    min: number;
    max: number;
  };
  administrationTime: number; // minutes
  scoringMethod: 'manual' | 'automated' | 'hybrid';
  normativeData: NormativeData[];
  subscales: TestSubscale[];
  license: TestLicense;
  version: string;
  publisher: string;
  isActive: boolean;
}

export type TestCategory = 'depression' | 'anxiety' | 'personality' | 'cognitive' | 'behavioral' | 'trauma' | 'substance-abuse' | 'eating-disorder' | 'adhd' | 'autism';

export interface TestSubscale {
  id: string;
  name: string;
  description: string;
  items: number[];
  scoringFormula: string;
  interpretation: ScoreInterpretation[];
}

export interface NormativeData {
  id: string;
  population: string;
  ageRange: { min: number; max: number };
  gender?: 'male' | 'female' | 'all';
  sampleSize: number;
  mean: number;
  standardDeviation: number;
  percentiles: { [key: number]: number };
}

export interface TestLicense {
  type: 'free' | 'paid' | 'subscription';
  cost?: number;
  expiryDate?: Date;
  usageLimit?: number;
  usageCount: number;
}

export interface TestResult {
  id: string;
  assessmentId: string;
  subscaleId?: string;
  rawScore: number;
  standardScore?: number;
  percentile?: number;
  tScore?: number;
  zScore?: number;
  interpretation: string;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe';
}

export interface TestInterpretation {
  id: string;
  assessmentId: string;
  overallScore: number;
  severity: string;
  summary: string;
  clinicalSignificance: boolean;
  recommendations: string[];
  comparisonToPrevious?: ComparisonResult;
  generatedBy: 'therapist' | 'ai' | 'automated';
  confidence?: number;
}

export interface ComparisonResult {
  previousAssessmentId: string;
  changeScore: number;
  changePercentage: number;
  significance: 'significant-improvement' | 'improvement' | 'no-change' | 'deterioration' | 'significant-deterioration';
  reliableChange: boolean;
}

export interface ScoreInterpretation {
  range: { min: number; max: number };
  label: string;
  description: string;
  severity: string;
  recommendations: string[];
}

// ============================================================================
// 1.6 TELECONSULTA
// ============================================================================

export interface TeleconsultationModule {
  virtualAppointments: VirtualAppointment[];
  meetingRooms: VirtualMeetingRoom[];
  recordings: SessionRecording[];
}

export interface VirtualAppointment {
  id: string;
  appointmentId: string;
  patientId: string;
  therapistId: string;
  centerId: string;
  meetingLink: string;
  meetingId: string;
  platform: 'zoom' | 'teams' | 'meet' | 'custom';
  status: VirtualAppointmentStatus;
  startTime: Date;
  endTime?: Date;
  actualDuration?: number;
  participants: MeetingParticipant[];
  recording?: SessionRecording;
  technicalIssues: TechnicalIssue[];
  qualityMetrics: CallQualityMetrics;
  createdAt: Date;
}

export type VirtualAppointmentStatus = 'scheduled' | 'waiting' | 'in-progress' | 'completed' | 'cancelled' | 'technical-issues';

export interface VirtualMeetingRoom {
  id: string;
  name: string;
  platform: string;
  maxParticipants: number;
  features: string[];
  isActive: boolean;
  currentMeeting?: string;
}

export interface MeetingParticipant {
  id: string;
  name: string;
  role: 'therapist' | 'patient' | 'family-member' | 'supervisor';
  joinTime?: Date;
  leaveTime?: Date;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface SessionRecording {
  id: string;
  appointmentId: string;
  filename: string;
  duration: number;
  size: number;
  url: string;
  isEncrypted: boolean;
  retentionDate: Date;
  accessLog: RecordingAccess[];
  transcription?: string;
  consent: RecordingConsent;
}

export interface RecordingAccess {
  userId: string;
  accessTime: Date;
  action: 'view' | 'download' | 'share';
  ipAddress: string;
}

export interface RecordingConsent {
  patientConsent: boolean;
  therapistConsent: boolean;
  consentDate: Date;
  consentMethod: 'verbal' | 'written' | 'digital';
}

export interface TechnicalIssue {
  id: string;
  type: 'audio' | 'video' | 'connection' | 'platform' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  reportedBy: string;
  reportedAt: Date;
  resolved: boolean;
  resolution?: string;
}

export interface CallQualityMetrics {
  audioQuality: number; // 1-5
  videoQuality: number; // 1-5
  connectionStability: number; // 1-5
  overallSatisfaction: number; // 1-5
  latency: number; // ms
  packetLoss: number; // percentage
}

// ============================================================================
// 1.7 PORTAL DEL PACIENTE
// ============================================================================

export interface PatientPortalModule {
  accounts: PatientAccount[];
  appointments: PatientAppointmentView[];
  payments: PatientPayment[];
  tasks: PatientPortalTask[];
  resources: PatientResource[];
  communications: PatientCommunication[];
}

export interface PatientAccount {
  id: string;
  patientId: string;
  email: string;
  isActive: boolean;
  lastLogin?: Date;
  preferences: PatientPreferences;
  securitySettings: SecuritySettings;
  accessLog: PatientAccessLog[];
  createdAt: Date;
}

export interface PatientPreferences {
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilitySettings;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  appointmentReminders: boolean;
  taskReminders: boolean;
  paymentReminders: boolean;
  reminderTiming: number; // hours before
}

export interface PrivacyPreferences {
  shareProgressWithFamily: boolean;
  allowTherapistNotes: boolean;
  showDiagnosis: boolean;
  showMedications: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: Date;
  securityQuestions: SecurityQuestion[];
  trustedDevices: TrustedDevice[];
}

export interface SecurityQuestion {
  question: string;
  answerHash: string;
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: Date;
  isActive: boolean;
}

export interface PatientAccessLog {
  id: string;
  timestamp: Date;
  action: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
}

export interface PatientAppointmentView {
  id: string;
  date: Date;
  time: string;
  therapistName: string;
  type: string;
  status: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  canReschedule: boolean;
  canCancel: boolean;
  notes?: string;
}

export interface PatientPayment {
  id: string;
  patientId: string;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId: string;
  receiptUrl: string;
  refundable: boolean;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
export type PaymentMethod = 'card' | 'bank-transfer' | 'paypal' | 'cash' | 'insurance';

export interface PatientPortalTask {
  id: string;
  patientId: string;
  title: string;
  description: string;
  type: string;
  dueDate?: Date;
  status: string;
  instructions: string;
  resources: TaskResource[];
  completionData?: Record<string, unknown>;
  feedback?: string;
  points?: number; // gamification
}

export interface PatientResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'exercise' | 'worksheet' | 'app';
  category: string;
  url?: string;
  content?: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isRecommended: boolean;
  accessCount: number;
  rating: number;
}

export interface PatientCommunication {
  id: string;
  patientId: string;
  type: 'message' | 'announcement' | 'reminder' | 'alert';
  subject: string;
  content: string;
  sender: string;
  sentAt: Date;
  readAt?: Date;
  priority: 'low' | 'medium' | 'high';
  requiresResponse: boolean;
  response?: string;
  responseAt?: Date;
}

// ============================================================================
// 1.8 SUPERVISIÓN CLÍNICA
// ============================================================================

export interface SupervisionModule {
  sessions: SupervisionSession[];
  competencies: CompetencyFramework[];
  evaluations: CompetencyEvaluation[];
  videos: SupervisionVideo[];
}

export interface SupervisionSession {
  id: string;
  superviseeId: string;
  supervisorId: string;
  centerId: string;
  date: Date;
  duration: number;
  type: SupervisionType;
  format: 'individual' | 'group' | 'peer';
  status: 'scheduled' | 'completed' | 'cancelled';
  agenda: SupervisionAgendaItem[];
  notes: string;
  competenciesDiscussed: string[];
  casesReviewed: CaseReview[];
  actionItems: ActionItem[];
  nextSessionDate?: Date;
  rating?: SupervisionRating;
  createdAt: Date;
  updatedAt: Date;
}

export type SupervisionType = 'clinical' | 'administrative' | 'educational' | 'supportive' | 'crisis';

export interface SupervisionAgendaItem {
  id: string;
  topic: string;
  timeAllocated: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  notes?: string;
}

export interface CaseReview {
  id: string;
  patientId: string;
  sessionId?: string;
  concerns: string[];
  interventionsDiscussed: string[];
  recommendations: string[];
  riskFactors: string[];
  followUpRequired: boolean;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  completedDate?: Date;
  notes?: string;
}

export interface SupervisionRating {
  overall: number; // 1-5
  preparation: number;
  engagement: number;
  insight: number;
  skillDevelopment: number;
  feedback: string;
}

export interface CompetencyFramework {
  id: string;
  name: string;
  version: string;
  domains: CompetencyDomain[];
  isActive: boolean;
  applicableRoles: string[];
  createdAt: Date;
}

export interface CompetencyDomain {
  id: string;
  name: string;
  description: string;
  competencies: Competency[];
  weight: number; // for overall scoring
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  behavioralIndicators: string[];
  proficiencyLevels: ProficiencyLevel[];
  isCore: boolean;
}

export interface ProficiencyLevel {
  level: number;
  name: string;
  description: string;
  criteria: string[];
}

export interface CompetencyEvaluation {
  id: string;
  superviseeId: string;
  supervisorId: string;
  frameworkId: string;
  evaluationDate: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  scores: CompetencyScore[];
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  developmentPlan: DevelopmentGoal[];
  nextEvaluationDate: Date;
  status: 'draft' | 'completed' | 'reviewed' | 'approved';
  signatures: EvaluationSignature[];
}

export interface CompetencyScore {
  competencyId: string;
  score: number;
  evidence: string[];
  comments: string;
  confidence: number;
}

export interface DevelopmentGoal {
  id: string;
  competencyId: string;
  description: string;
  targetLevel: number;
  strategies: string[];
  timeline: string;
  measurableOutcomes: string[];
  progress: number; // 0-100
}

export interface EvaluationSignature {
  role: 'supervisee' | 'supervisor' | 'clinical-director';
  userId: string;
  timestamp: Date;
  signature: string;
}

export interface SupervisionVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  duration: number;
  competencies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  viewCount: number;
  rating: number;
  isActive: boolean;
  createdAt: Date;
}

// ============================================================================
// 1.9 DOCUMENTOS & FORMULARIOS
// ============================================================================

export interface DocumentsModule {
  templates: DocumentTemplate[];
  forms: CustomForm[];
  documents: GeneratedDocument[];
  scans: ScannedDocument[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentTemplateType;
  category: string;
  description: string;
  template: string; // HTML template with placeholders
  fields: TemplateField[];
  isActive: boolean;
  version: string;
  centerId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentTemplateType = 'consent-form' | 'intake-form' | 'assessment-report' | 'treatment-plan' | 'discharge-summary' | 'prescription' | 'referral-letter' | 'progress-note' | 'certificate';

export interface CustomForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  logic: FormLogic[];
  styling: FormStyling;
  isActive: boolean;
  isPublic: boolean;
  requiresAuth: boolean;
  centerId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  submissions: FormSubmission[];
}

export interface FormField {
  id: string;
  type: FormFieldType;
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation: FieldValidation;
  options?: FormFieldOption[];
  defaultValue?: string | number | boolean | string[] | number[] | boolean[] | null;
  helpText?: string;
  conditional?: ConditionalLogic;
}

export type FormFieldType = 'text' | 'textarea' | 'email' | 'phone' | 'number' | 'date' | 'time' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file' | 'signature' | 'rating' | 'slider';

export interface FormFieldOption {
  value: string;
  label: string;
  isDefault?: boolean;
}

export interface ConditionalLogic {
  dependsOn: string; // field ID
  condition: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  value: string | number | boolean;
  action: 'show' | 'hide' | 'require' | 'disable';
}

export interface FormLogic {
  id: string;
  type: 'conditional' | 'calculation' | 'validation';
  rules: LogicRule[];
}

export interface LogicRule {
  condition: string;
  action: string;
  target: string;
  value: unknown;
}

export interface FormStyling {
  theme: 'default' | 'modern' | 'clinical' | 'minimal';
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  customCSS?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  patientId?: string;
  submittedBy: string;
  submissionDate: Date;
  data: { [fieldName: string]: unknown };
  status: 'draft' | 'submitted' | 'reviewed' | 'processed';
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  ipAddress: string;
  userAgent: string;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  patientId?: string;
  name: string;
  content: string; // HTML content
  pdfUrl: string;
  status: 'draft' | 'final' | 'signed' | 'archived';
  generatedBy: string;
  generatedAt: Date;
  signatures: DocumentSignature[];
  qrCode: string;
  verificationUrl: string;
  metadata: DocumentMetadata;
}

export interface DocumentSignature {
  id: string;
  signerName: string;
  signerRole: string;
  signatureData: string;
  timestamp: Date;
  ipAddress: string;
  isValid: boolean;
}

export interface DocumentMetadata {
  version: string;
  language: string;
  pageCount: number;
  wordCount: number;
  tags: string[];
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface ScannedDocument {
  id: string;
  patientId?: string;
  originalFilename: string;
  scannedFilename: string;
  fileSize: number;
  mimeType: string;
  scanDate: Date;
  scannedBy: string;
  ocrText?: string;
  ocrConfidence?: number;
  extractedData: ExtractedData;
  status: 'processing' | 'completed' | 'failed' | 'needs-review';
  tags: string[];
  isConfidential: boolean;
}

export interface ExtractedData {
  documentType?: string;
  patientName?: string;
  dateOfBirth?: Date;
  documentDate?: Date;
  keyValuePairs: { [key: string]: string };
  confidence: number;
}

// ============================================================================
// 1.10 BÚSQUEDA GLOBAL Y ACCESO RÁPIDO
// ============================================================================

export interface GlobalSearchModule {
  searchHistory: SearchHistoryItem[];
  favorites: FavoriteItem[];
  quickAccess: QuickAccessItem[];
  metrics: DashboardMetric[];
}

export interface SearchHistoryItem {
  id: string;
  userId: string;
  query: string;
  type: SearchType;
  results: SearchResult[];
  timestamp: Date;
  resultClicked?: string;
}

export type SearchType = 'global' | 'patients' | 'sessions' | 'documents' | 'assessments' | 'appointments';

export interface SearchResult {
  id: string;
  type: 'patient' | 'session' | 'document' | 'appointment' | 'assessment' | 'note';
  title: string;
  subtitle: string;
  description: string;
  url: string;
  relevanceScore: number;
  highlightedText: string[];
  metadata: { [key: string]: unknown };
}

export interface FavoriteItem {
  id: string;
  userId: string;
  type: 'patient' | 'test' | 'template' | 'report' | 'dashboard';
  itemId: string;
  name: string;
  description?: string;
  url: string;
  icon?: string;
  addedAt: Date;
  lastAccessed?: Date;
  accessCount: number;
}

export interface QuickAccessItem {
  id: string;
  userId: string;
  type: string;
  itemId: string;
  name: string;
  url: string;
  lastAccessed: Date;
  accessCount: number;
  category: 'recent' | 'frequent' | 'pinned';
}

export interface DashboardMetric {
  id: string;
  name: string;
  category: MetricCategory;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  trend?: number[];
  status: MetricStatus;
  description: string;
  lastUpdated: Date;
  refreshInterval: number; // minutes
  isVisible: boolean;
  order: number;
}

export type MetricCategory = 'patients' | 'sessions' | 'financial' | 'clinical' | 'operational' | 'quality';
export type MetricStatus = 'good' | 'warning' | 'critical' | 'neutral';

// ============================================================================
// TIPOS AUXILIARES Y UTILIDADES
// ============================================================================

export interface ClinicalSettings {
  centerId: string;
  defaultSessionDuration: number;
  reminderSettings: ReminderSettings;
  assessmentSettings: AssessmentSettings;
  documentSettings: DocumentSettings;
  privacySettings: ClinicalPrivacySettings;
}

export interface ReminderSettings {
  enabled: boolean;
  defaultTiming: number; // hours before
  methods: ('email' | 'sms' | 'push')[];
  templates: ReminderTemplate[];
}

export interface ReminderTemplate {
  id: string;
  name: string;
  type: 'appointment' | 'task' | 'payment' | 'assessment';
  subject: string;
  content: string;
  isDefault: boolean;
}

export interface AssessmentSettings {
  autoScoring: boolean;
  requireInterpretation: boolean;
  allowPatientAccess: boolean;
  retentionPeriod: number; // days
}

export interface DocumentSettings {
  autoGenerate: boolean;
  requireSignature: boolean;
  retentionPeriod: number; // years
  encryptionEnabled: boolean;
}

export interface ClinicalPrivacySettings {
  dataRetentionPeriod: number; // years
  anonymizationRules: AnonymizationRule[];
  accessControls: AccessControl[];
  auditingEnabled: boolean;
}

export interface AnonymizationRule {
  field: string;
  method: 'remove' | 'hash' | 'generalize' | 'substitute';
  parameters?: unknown;
}

export interface AccessControl {
  role: string;
  permissions: Permission[];
  restrictions: Restriction[];
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  conditions?: unknown;
}

export interface Restriction {
  field: string;
  condition: string;
  value: unknown;
}

// ============================================================================
// INTERFACES DE RESPUESTA DE API
// ============================================================================

export interface ClinicalAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  requestId: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  searchTime: number;
  suggestions: string[];
}
