import { Timestamp } from 'firebase/firestore';

/**
 * Interface for customer tags
 */
export interface CustomerTag {
  id: string;
  name: string;
  color: string;
}

/**
 * Interface for customer reminders
 */
export interface CustomerReminder {
  id: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
}

/**
 * Interface for linking customers to policies
 */
export interface CustomerPolicyLink {
  policyId: string;
  policyNumber: string;
  type: string;
  company: string;
  status: string;
  startDate: Timestamp;
  endDate: Timestamp;
}

/**
 * Interface for customer data
 */
export interface Customer {
  id: string;
  userId: string;
  name: string;
  fullName: string;
  address: string;
  birthDate: Timestamp;
  status: 'active' | 'inactive' | 'lead';
  type: 'individual' | 'business' | 'family';
  tags?: CustomerTag[];
  city: string;
  createdBy?: string;
  isStarred?: boolean;
  company: string;
  occupation: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  civilStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  registeredAt: Timestamp;
  policies?: CustomerPolicyLink[];
  notes?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  photoURL?: string;
  createdAt: Timestamp;
  reminders?: CustomerReminder[];
  files?: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: Timestamp;
  }[];
}

/**
 * Props for customer dialog component
 */
export interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer;
  title?: string;
  onSuccess?: (customer: Partial<Customer>) => Promise<boolean>;
}

/**
 * Props for customer table component
 */
export interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  onEmailCustomer: (customer: Customer) => void;
  onScheduleMeeting: (customer: Customer) => void;
  page: number;
  onPageChange: (page: number) => void;
}

/**
 * Interface for customer statistics
 */
export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  leadCustomers: number;
  newCustomersThisMonth: number;
  customersWithPolicies: number;
  customersWithActivePolicies: number;
  customersWithExpiredPolicies: number;
  customersWithRenewingPolicies: number;
}


/**
 * Props for customer header component
 */
export interface CustomerHeaderProps {
  onAddCustomer: () => void;
  onImportCustomers: () => void;
  onExportCustomers: () => void;
  onRefreshKpis: () => Promise<void>;
  onViewAnalytics: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalCustomers: number;
}

/**
 * Props for customer grid component
 */
export interface CustomerGridProps {
  customers: Customer[];
  loading: boolean;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  onEmailCustomer: (customer: Customer) => void;
  onScheduleMeeting: (customer: Customer) => void;
  onToggleStarred: (customer: Customer) => void;
  page: number;
  onPageChange: (page: number) => void;
}

/**
 * Props for customer view dialog component
 */
export interface CustomerViewDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onEmailCustomer: (customer: Customer) => void;
  onScheduleMeeting: (customer: Customer) => void;
}

/**
 * Props for customer delete dialog component
 */
export interface CustomerDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onConfirm: (customer: Customer) => Promise<void>;
  loading: boolean;
}

/**
 * Props for customer import dialog component
 */
export interface CustomerImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
  loading: boolean;
}

/**
 * Props for customer export dialog component
 */
export interface CustomerExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => Promise<void>;
  loading: boolean;
}

/**
 * Props for customer analytics dialog component
 */
export interface CustomerAnalyticsDialogProps {
  open: boolean;
  onClose: () => void;
  stats: CustomerStats;
  loading: boolean;
}

/**
 * Props for customer filters component
 */
export interface CustomerFiltersProps {
  filters: CustomerFilters;
  onFilterChange: (filters: CustomerFilters) => void;
  onClearFilters: () => void;
  loading: boolean;
  tags: CustomerTag[];
}

/**
 * Interface for customer filters
 */
export interface CustomerFilters {
  status: string[];
  type: string[];
  tags: string[];
  createdDateRange: {
    start: Date | null;
    end: Date | null;
  };
  riskLevel: string[];
  hasActivePolicies: boolean | null;
  isStarred: boolean | null;
}

/**
 * Props for customer tabs component
 */
export interface CustomerTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  tabs: {
    value: string;
    label: string;
    count?: number;
  }[];
}

/**
 * Props for customer stats component
 */
export interface CustomerStatsProps {
  stats: CustomerStats;
  loading: boolean;
  onRefresh: () => Promise<void>;
}