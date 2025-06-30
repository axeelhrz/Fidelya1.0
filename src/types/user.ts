export type UserRole = 'ceo' | 'therapist' | 'patient' | 'receptionist';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  centerId: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  
  // Campos específicos por rol
  therapistInfo?: {
    specialties: string[];
    license: string;
    experience: number;
    education: string[];
    certifications: string[];
    schedule: {
      [key: string]: { // día de la semana
        start: string;
        end: string;
        available: boolean;
      };
    };
  };
  
  patientInfo?: {
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
    assignedTherapist?: string;
  };
  
  receptionistInfo?: {
    department: string;
    permissions: string[];
    workShift: 'morning' | 'afternoon' | 'night' | 'full-time';
  };
}

export interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: User['gender'];
  
  // Campos específicos por rol
  therapistData?: {
    specialties: string[];
    license: string;
    experience: number;
    education: string[];
  };
  
  patientData?: {
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
    medicalHistory?: {
      allergies: string[];
      medications: string[];
      previousDiagnoses: string[];
    };
    insuranceInfo?: {
      provider: string;
      policyNumber: string;
      groupNumber?: string;
    };
  };
  
  receptionistData?: {
    department: string;
    workShift: 'morning' | 'afternoon' | 'night' | 'full-time';
  };
}

export interface RolePermissions {
  role: UserRole;
  permissions: {
    dashboard: string[];
    patients: string[];
    sessions: string[];
    reports: string[];
    settings: string[];
    admin: string[];
  };
  defaultRoute: string;
  allowedRoutes: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  ceo: {
    role: 'ceo',
    permissions: {
      dashboard: ['view_all', 'export', 'analytics'],
      patients: ['view_all', 'create', 'edit', 'delete', 'assign'],
      sessions: ['view_all', 'create', 'edit', 'delete', 'analytics'],
      reports: ['view_all', 'create', 'export', 'financial'],
      settings: ['view_all', 'edit', 'user_management'],
      admin: ['full_access', 'billing', 'integrations']
    },
    defaultRoute: '/dashboard/ceo',
    allowedRoutes: [
      '/dashboard/ceo',
      '/dashboard/ceo/financial',
      '/dashboard/ceo/clinical',
      '/dashboard/ceo/commercial',
      '/dashboard/patients',
      '/dashboard/sessions',
      '/dashboard/agenda',
      '/dashboard/alerts',
      '/dashboard/metrics',
      '/dashboard/settings'
    ]
  },
  therapist: {
    role: 'therapist',
    permissions: {
      dashboard: ['view_own', 'analytics'],
      patients: ['view_assigned', 'edit_assigned', 'create_notes'],
      sessions: ['view_own', 'create', 'edit_own', 'notes'],
      reports: ['view_own', 'create_session_reports'],
      settings: ['view_profile', 'edit_profile'],
      admin: []
    },
    defaultRoute: '/dashboard/therapist',
    allowedRoutes: [
      '/dashboard/therapist',
      '/dashboard/therapist/patients',
      '/dashboard/therapist/sessions',
      '/dashboard/therapist/agenda',
      '/dashboard/therapist/notes',
      '/dashboard/therapist/profile'
    ]
  },
  patient: {
    role: 'patient',
    permissions: {
      dashboard: ['view_own'],
      patients: ['view_own', 'edit_own'],
      sessions: ['view_own', 'book'],
      reports: ['view_own'],
      settings: ['view_profile', 'edit_profile'],
      admin: []
    },
    defaultRoute: '/dashboard/patient',
    allowedRoutes: [
      '/dashboard/patient',
      '/dashboard/patient/appointments',
      '/dashboard/patient/history',
      '/dashboard/patient/documents',
      '/dashboard/patient/profile'
    ]
  },
  receptionist: {
    role: 'receptionist',
    permissions: {
      dashboard: ['view_reception'],
      patients: ['view_all', 'create', 'edit_basic'],
      sessions: ['view_all', 'create', 'reschedule'],
      reports: ['view_basic'],
      settings: ['view_profile', 'edit_profile'],
      admin: []
    },
    defaultRoute: '/dashboard/reception',
    allowedRoutes: [
      '/dashboard/reception',
      '/dashboard/reception/patients',
      '/dashboard/reception/appointments',
      '/dashboard/reception/calendar',
      '/dashboard/reception/profile'
    ]
  }
};
