import { Timestamp } from 'firebase/firestore';

export interface Pago {
  fecha: Timestamp;
  monto: number;
}

export interface Socio {
  uid: string;
  nombre: string;
  email: string;
  estado: 'activo' | 'vencido' | 'inactivo';
  asociacionId: string;
  creadoEn: Timestamp;
  telefono?: string;
  dni?: string;
  pagos?: Pago[];
}

export interface SocioFormData {
  nombre: string;
  email: string;
  estado: 'activo' | 'vencido';
  telefono?: string;
  dni?: string;
}

export interface SocioStats {
  total: number;
  activos: number;
  vencidos: number;
  inactivos: number;
  [key: string]: number | undefined;
}
