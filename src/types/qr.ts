import { Timestamp } from 'firebase/firestore';

export interface QRScan {
  id: string;
  comercioId: string;
  socioId?: string;
  fechaEscaneo: Timestamp;
  ubicacion?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  dispositivo?: string;
  userAgent?: string;
  ip?: string;
  validado: boolean;
  beneficioId?: string;
  creadoEn: Timestamp;
}

export interface QRValidation {
  id: string;
  comercioId: string;
  socioId: string;
  qrScanId?: string;
  beneficioId?: string;
  exitoso: boolean;
  montoDescuento?: number;
  fechaValidacion: Timestamp;
  codigoValidacion: string;
  codigoUso?: string;
  estado: 'pendiente' | 'usado' | 'expirado';
  creadoEn: Timestamp;
}

export interface QRStatsData {
  totalScans: number;
  totalValidations: number;
  uniqueUsers: number;
  conversionRate: number;
  scansGrowth: number;
  validationsGrowth: number;
  usersGrowth: number;
  conversionGrowth: number;
  dailyScans: Array<{
    date: string;
    scans: number;
    validations: number;
    uniqueUsers: number;
  }>;
  hourlyActivity: Array<{
    hour: number;
    scans: number;
  }>;
  deviceStats: Array<{
    name: string;
    value: number;
  }>;
  topLocations: Array<{
    city: string;
    country: string;
    scans: number;
  }>;
  recentActivity: Array<{
    time: string;
    location: string;
    device: string;
    type: 'scan' | 'validation';
  }>;
}

export interface QRConfig {
  size: number;
  margin: number;
  color: string;
  backgroundColor: string;
  includeText: boolean;
  includeLogo: boolean;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export interface QRGenerationOptions {
  comercioId: string;
  beneficioId?: string;
  customization?: Partial<QRConfig>;
  format?: 'png' | 'svg' | 'pdf';
}

export interface QRUsageStats {
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
  validationsToday: number;
  validationsThisWeek: number;
  validationsThisMonth: number;
  conversionRate: number;
  topDevices: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  topLocations: Array<{
    city: string;
    country: string;
    count: number;
  }>;
  peakHours: Array<{
    hour: number;
    count: number;
  }>;
}

// Constants
export const QR_SCAN_STATES = {
  PENDING: 'pendiente',
  VALIDATED: 'validado',
  EXPIRED: 'expirado',
} as const;

export const QR_VALIDATION_STATES = {
  PENDING: 'pendiente',
  USED: 'usado',
  EXPIRED: 'expirado',
} as const;

export const QR_DEVICE_TYPES = {
  IPHONE: 'iPhone',
  IPAD: 'iPad',
  ANDROID: 'Android',
  WINDOWS: 'Windows',
  MAC: 'Mac',
  OTHER: 'Otro',
} as const;

export type QRScanState = typeof QR_SCAN_STATES[keyof typeof QR_SCAN_STATES];
export type QRValidationState = typeof QR_VALIDATION_STATES[keyof typeof QR_VALIDATION_STATES];
export type QRDeviceType = typeof QR_DEVICE_TYPES[keyof typeof QR_DEVICE_TYPES];
