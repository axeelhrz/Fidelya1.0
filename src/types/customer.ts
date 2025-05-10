import { Timestamp } from 'firebase/firestore';

export interface CustomerTag {
  id: string;
  name: string;
  color: string;
}

export interface CustomerReminder {
  id: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
}

export interface CustomerPolicyLink {
  policyId: string;
  policyNumber: string;
  type: string;
  company: string; 
  status: string;
  startDate: Timestamp;
  endDate: Timestamp;
}

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

export interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer;
  title?: string;
  onSuccess?: (customer: Partial<Customer>) => Promise<boolean>;
}

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

export interface CustomerHeaderProps {
  onAddCustomer: () => void;
  onImportCustomers: () => void;
  onExportCustomers: () => void;
  onRefreshKpis: () => Promise<boolean>;
  lastUpdated: Date | null;
}