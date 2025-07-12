export interface VideoCall {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  centerId: string;
  startDateTime: Date;
  endDateTime: Date;
  duration: number; // en minutos
  status: VideoCallStatus;
  motive: string;
  notes?: string;
  videoLink: string;
  platform: VideoPlatform;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type VideoCallStatus = 
  | 'programada'
  | 'confirmada'
  | 'en_curso'
  | 'finalizada'
  | 'cancelada';

export type VideoPlatform = 
  | 'zoom'
  | 'meet'
  | 'jitsi'
  | 'daily'
  | 'custom';

export interface VideoCallFilters {
  patientName?: string;
  motive?: string;
  status?: VideoCallStatus;
  dateFrom?: Date;
  dateTo?: Date;
  professionalId?: string;
}

export interface CreateVideoCallData {
  patientId: string;
  startDateTime: Date;
  duration: number;
  motive: string;
  notes?: string;
  platform: VideoPlatform;
  customLink?: string;
}

export interface UpdateVideoCallData extends Partial<CreateVideoCallData> {
  status?: VideoCallStatus;
  videoLink?: string;
}

export interface VideoCallStats {
  total: number;
  programadas: number;
  confirmadas: number;
  enCurso: number;
  finalizadas: number;
  canceladas: number;
}
