export interface Patient {
  id: string;
  centerId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate: Date;
    gender: 'masculino' | 'femenino' | 'otro';
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  clinicalInfo: {
    diagnosis?: string[];
    medications?: string[];
    allergies?: string[];
    medicalHistory?: string;
    psychologicalHistory?: string;
  };
  assignedPsychologist: string; // UID del psicólogo
  status: 'active' | 'inactive' | 'discharged';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
