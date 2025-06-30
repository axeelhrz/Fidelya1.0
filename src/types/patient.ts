export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
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
  };
  preferences: {
    preferredLanguage: string;
    communicationMethod: 'email' | 'phone' | 'sms';
    appointmentReminders: boolean;
  };
  status: 'active' | 'inactive' | 'discharged';
  assignedTherapist?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface PatientSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: Patient['status'];
  assignedTherapist?: string;
  lastAppointment?: Date;
  nextAppointment?: Date;
}

export interface PatientSearchFilters {
  searchTerm?: string;
  status?: Patient['status'];
  assignedTherapist?: string;
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: Patient['gender'];
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Patient['gender'];
  address: Patient['address'];
  emergencyContact: Patient['emergencyContact'];
  medicalHistory: Patient['medicalHistory'];
  insuranceInfo?: Patient['insuranceInfo'];
  preferences: Patient['preferences'];
  notes?: string;
}

import type { Assessment } from './assessment';
export interface Note {
  id: string;
  patientId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  assignedTo?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  date: Date;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}
export interface PatientPortalData {
  appointments: Appointment[];
  tasks: Task[];
  assessments: Assessment[];
  notes: Note[];
}
