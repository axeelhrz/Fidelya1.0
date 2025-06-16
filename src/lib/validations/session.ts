import { z } from 'zod';
import { SessionType, SessionStatus } from '@/types/session';

export const sessionFormSchema = z.object({
  patientId: z.string().min(1, 'Debe seleccionar un paciente'),
  date: z.string().min(1, '
