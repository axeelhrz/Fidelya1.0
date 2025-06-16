export interface Session {
  id: string;
  centerId: string;
  patientId: string;
  psychologistId: string;
  date: Date;
  duration: number; // en minutos
  type: 'individual' | 'group' | 'family' | 'online';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: {
    objective: string;
    observations: string;
    interventions: string;
    homework?: string;
    nextSession?: string;
  };
  aiSummary?: {
    summary: string;
    keyPoints: string[];
    recommendations: string[];
    emotionalState: string;
    generatedAt: Date;
  };
  attachments?: string[]; // URLs de archivos
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
