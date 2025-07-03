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
  integrations: {
    whatsapp: {
      enabled: boolean;
      apiKey?: string;
      phoneNumber?: string;
    };
    googleSheets: {
      enabled: boolean;
      spreadsheetId?: string;
    };
    notion: {
      enabled: boolean;
      apiKey?: string;
      databaseId?: string;
    };
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
  patientId?: string;
  sessionId?: string;
  type: 'clinical' | 'financial' | 'operational' | 'system';
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
  category: 'administrative' | 'clinical' | 'financial' | 'marketing';
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  assignedTherapist: string;
  status: 'active' | 'inactive' | 'discharged';
  tags: string[];
  createdAt: Date;
  lastSession?: Date;
  totalSessions: number;
  diagnosis: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  phq9Score?: number;
  gad7Score?: number;
  notes: string;
}

export interface Session {
  id: string;
  patientId: string;
  therapistId: string;
  date: Date;
  duration: number;
  type: 'individual' | 'group' | 'family' | 'couple';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  aiSummary?: string;
  emotionalState: {
    before: number; // 1-10 scale
    after: number;
  };
  interventions: string[];
  homework: string[];
  nextSessionGoals: string[];
  cost: number;
  paid: boolean;
}

export interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specializations: string[];
  licenseNumber: string;
  status: 'active' | 'inactive';
  schedule: {
    [key: string]: { // day of week
      start: string;
      end: string;
      breaks: { start: string; end: string }[];
    };
  };
  consultingRooms: string[];
  hourlyRate: number;
}

export interface ConsultingRoom {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance';
  location: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  roomId: string;
  date: Date;
  duration: number;
  type: 'individual' | 'group' | 'family' | 'couple';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  notes?: string;
  reminderSent: boolean;
  cost: number;
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
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  arpu: number; // Average Revenue Per User
  churnRate: number;
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
}

export interface CommercialMetrics {
  conversionRate: number;
  leadGeneration: number;
  campaignEffectiveness: {
    [campaignId: string]: {
      impressions: number;
      clicks: number;
      conversions: number;
      cost: number;
      roi: number;
    };
  };
  referralRate: number;
  socialMediaEngagement: {
    followers: number;
    engagement: number;
    reach: number;
  };
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  value?: string;
  actionable: boolean;
  category: 'financial' | 'clinical' | 'operational' | 'commercial';
  createdAt: Date;
}

export interface ComplianceMetric {
  id: string;
  name: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastCheck: Date;
  nextCheck: Date;
  description: string;
  requirements: string[];
  documents: string[];
}