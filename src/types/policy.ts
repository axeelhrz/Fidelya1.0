import { Timestamp } from 'firebase/firestore';

export interface PolicyDocument {
  id: string;
  name: string;
  url: string;
  path: string;
  uploadedAt: Timestamp;
}

export interface PolicyReminder {
  id: string;
  date: Timestamp;
  completed: boolean;
  dueDate: Timestamp;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
  description: string;
}

export interface Policy {
  id: string;
  userId: string;
  policyNumber: string;
  company: string;
  type: string;
  customerId: string;
  customerName: string;
  startDate: Timestamp;
  endDate: Timestamp;
  premium: number;
  coverage: number;
  paymentFrequency: string;
  status: string;
  isArchived: boolean;
  isStarred: boolean;
  tags?: string[];
  notes?: string;
  isRenewal: boolean;
  renewalDate?: Timestamp;
  reminders?: {
    id: string;
    title: string;
    date: Timestamp;
    completed: boolean;
    type: 'expiration' | 'renewal' | 'payment' | 'review' | 'custom';
    description: string;
  }[];
  documents?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: Timestamp;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  errors: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Timestamp;
}

export interface Reminder {
  id: string;
  title: string;
  date: Timestamp;
  type: 'expiration' | 'renewal' | 'payment' | 'review' | 'custom';
  completed: boolean;
  description: string;
}

export type PolicyType = 'auto' | 'health' | 'life' | 'home' | 'business' | 'travel' | 'liability' | 'renewal' | 'other';
export type PolicyStatus = 'active' | 'expired' | 'pending' | 'review' | 'cancelled';
export type PaymentFrequency = 'monthly' | 'quarterly' | 'biannual' | 'annual' | 'single';

export interface Filter {
  status: PolicyStatus[];
  type: PolicyType[];
  search: string;
  startDate: Date | null;
  endDate: Date | null;
  minPremium: number | null;
  maxPremium: number | null;
  isStarred: boolean;
  company: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  premium: {
    min: number | null;
    max: number | null;
  };
  onlyStarred: boolean;
  isArchived: boolean;
  searchTerm: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface PolicyStats {
  total: number;
  active: number;
  expired: number;
  pending: number;
  review: number;
  cancelled: number;
  expiringIn30Days: number;
}