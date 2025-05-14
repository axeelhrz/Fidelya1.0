import * as React from 'react';
import { DirectionsCar, HealthAndSafety, Favorite, Home, FlightTakeoff, Gavel, MoreHoriz, Business } from '@mui/icons-material';

// Define the types here instead of importing them
export type PolicyType = 'auto' | 'health' | 'life' | 'home' | 'business' | 'travel' | 'liability' | 'other';
export type PolicyStatus = 'active' | 'expired' | 'pending' | 'review' | 'cancelled';
export type PaymentFrequency = 'monthly' | 'quarterly' | 'biannual' | 'annual' | 'single';
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// No need for custom icon components as we use React.createElement directly in the arrays below

// Constantes
export const ITEMS_PER_PAGE = 10;

// Create a const object with the enum values to use as keys
export const PlanValue = {
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const;

export const PLAN_LIMITS = {
  [PlanValue.BASIC]: 5,
  [PlanValue.PRO]: Infinity,
  [PlanValue.ENTERPRISE]: Infinity
};
export const POLICY_TYPES: { value: PolicyType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'auto', label: 'Auto', icon: React.createElement(DirectionsCar), color: '#3B82F6' },
  { value: 'health', label: 'Salud', icon: React.createElement(HealthAndSafety), color: '#10B981' },
  { value: 'life', label: 'Vida', icon: React.createElement(Favorite), color: '#EF4444' },
  { value: 'home', label: 'Hogar', icon: React.createElement(Home), color: '#F59E0B' },
  { value: 'business', label: 'Negocio', icon: React.createElement(Business), color: '#8B5CF6' },
  { value: 'travel', label: 'Viaje', icon: React.createElement(FlightTakeoff), color: '#EC4899' },
  { value: 'liability', label: 'Responsabilidad', icon: React.createElement(Gavel), color: '#6366F1' },
  { value: 'other', label: 'Otro', icon: React.createElement(MoreHoriz), color: '#9CA3AF' },
];

export const POLICY_STATUS: { value: PolicyStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Activa', color: '#10B981' },
  { value: 'expired', label: 'Vencida', color: '#EF4444' },
  { value: 'pending', label: 'Pendiente', color: '#F59E0B' },
  { value: 'review', label: 'En revisión', color: '#3B82F6' },
  { value: 'cancelled', label: 'Cancelada', color: '#9CA3AF' },
];

export const PAYMENT_FREQUENCY: { value: PaymentFrequency; label: string }[] = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'biannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' },
  { value: 'single', label: 'Pago único' },
];

export const TAGS: Tag[] = [
  { id: '1', name: 'Prioritaria', color: '#F59E0B' },
  { id: '2', name: 'VIP', color: '#3B82F6' },
  { id: '3', name: 'Renovación automática', color: '#10B981' },
  { id: '4', name: 'Descuento', color: '#EC4899' },
  { id: '5', name: 'Financiada', color: '#8B5CF6' },
];
