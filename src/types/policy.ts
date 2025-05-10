import { Timestamp } from 'firebase/firestore';
import { Customer } from './customer';

/**
 * Interface for policy tags
 */
export interface PolicyTag {
  id: string;
  name: string;
  color: string;
}

/**
 * Interface for policy reminders
 */
export interface PolicyReminder {
  id: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
  date: Timestamp;
}

/**
 * Interface for policy payment
 */
export interface PolicyPayment {
  id: string;
  amount: number;
  date: Timestamp;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  notes?: string;
}

/**
 * Interface for policy coverage
 */
export interface PolicyCoverage {
  id: string;
  name: string;
  description: string;
  amount: number;
  deductible?: number;
  isIncluded: boolean;
}

/**
 * Interface for policy data
 */
export interface Policy {
  id: string;
  userId: string;
  policyNumber: string;
  type: string;
  company: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  premium: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  startDate: Timestamp;
  endDate: Timestamp;
  renewalDate: Timestamp;
  customerId: string;
  customerName: string;
  tags?: PolicyTag[];
  description?: string;
  notes?: string;
  isStarred?: boolean;
  coverages?: PolicyCoverage[];
  payments?: PolicyPayment[];
  reminders?: PolicyReminder[];
  files?: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: Timestamp;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  errors: { message: string; field?: string; code?: string }[];
  createdBy?: string;
  isRenewal?: boolean;
  isArchived?: boolean;
  coverage?: number;
  document?: PolicyDocument;
  documents: PolicyDocument[];
}

export type PolicyDocument = {
  id: string;
  name: string;
  url: string;
  uploadedAt: Timestamp; // Using the Firestore Timestamp type that's already imported
};

/**
 * Props for policy dialog component
 */
export interface PolicyDialogProps {
  open: boolean;
  onClose: () => void;
  policy?: Policy;
  title?: string;
  onSuccess?: (policy: Partial<Policy>) => Promise<boolean>;
  customers?: Customer[];
}

/**
 * Props for policy table component
 */
export interface PolicyTableProps {
  policies: Policy[];
  loading: boolean;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onViewPolicy: (policy: Policy) => void;
  onEditPolicy: (policy: Policy) => void;
  onDeletePolicy: (policy: Policy) => void;
  onRenewPolicy: (policy: Policy) => void;
  page: number;
  onPageChange: (page: number) => void;
}

/**
 * Interface for policy statistics
 */
export interface PolicyStats {
  totalPolicies: number;
  activePolicies: number;
  pendingPolicies: number;
  expiredPolicies: number;
  cancelledPolicies: number;
  renewingPolicies: number;
  totalPremium: number;
  averagePremium: number;
  policiesByType: {
    type: string;
    count: number;
    percentage: number;
  }[];
  policiesByCompany: {
    company: string;
    count: number;
    percentage: number;
  }[];
  total: number;
  active: number;
  expired: number;
  pending: number;
  review: number;
  cancelled: number;
  expiringIn30Days: number;
}

/**
 * Props for policy header component
 */
export interface PolicyHeaderProps {
  onAddPolicy: () => void;
  onImportPolicies: () => void;
  onExportPolicies: () => void;
  onRefreshKpis: () => Promise<void>;
  onViewAnalytics: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalPolicies: number;
}

/**
 * Props for policy grid component
 */
export interface PolicyGridProps {
  policies: Policy[];
  loading: boolean;
  onViewPolicy: (policy: Policy) => void;
  onEditPolicy: (policy: Policy) => void;
  onDeletePolicy: (policy: Policy) => void;
  onRenewPolicy: (policy: Policy) => void;
  onToggleStarred: (policy: Policy) => void;
  page: number;
  onPageChange: (page: number) => void;
}

/**
 * Props for policy view dialog component
 */
export interface PolicyViewDialogProps {
  open: boolean;
  onClose: () => void;
  policy: Policy | null;
  onEdit: (policy: Policy) => void;
  onDelete: (policy: Policy) => void;
  onRenew: (policy: Policy) => void;
}

/**
 * Props for policy delete dialog component
 */
export interface PolicyDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  policy: Policy | null;
  onConfirm: (policy: Policy) => Promise<void>;
  loading: boolean;
}

/**
 * Props for policy import dialog component
 */
export interface PolicyImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
  loading: boolean;
}

/**
 * Props for policy export dialog component
 */
export interface PolicyExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => Promise<void>;
  loading: boolean;
}

/**
 * Props for policy analytics dialog component
 */
export interface PolicyAnalyticsDialogProps {
  open: boolean;
  onClose: () => void;
  stats: PolicyStats;
  loading: boolean;
}

/**
 * Props for policy filters component
 */
export interface PolicyFiltersProps {
  filters: PolicyFilters;
  onFilterChange: (filters: PolicyFilters) => void;
  onClearFilters: () => void;
  loading: boolean;
  tags: PolicyTag[];
}

/**
 * Interface for policy filters
 */
export interface PolicyFilters {
  status: string[];
  type: string[];
  company: string[];
  tags: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  premiumRange: {
    min: number | null;
    max: number | null;
  };
  isStarred: boolean | null;
  customerId: string | null;
}

/**
 * Props for policy tabs component
 */
export interface PolicyTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  tabs: {
    value: string;
    label: string;
    count?: number;
  }[];
}

/**
 * Props for policy stats component
 */
export interface PolicyStatsProps {
  stats: PolicyStats;
  loading: boolean;
  onRefresh: () => Promise<void>;
}