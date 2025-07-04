// ============================================================================
// TIPOS ESPECÍFICOS PARA PAGOS DE PACIENTES
// ============================================================================

export interface Payment {
  id: string;
  patientId: string;
  centerId: string;
  amount: number;
  currency: 'EUR' | 'USD' | 'MXN';
  description: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  transactionId?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  sessionId?: string;
  subscriptionId?: string;
  dueDate?: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: PaymentMetadata;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'overdue';

export type PaymentMethodType = 'card' | 'paypal' | 'mercadopago' | 'stripe' | 'bank_transfer' | 'cash';

export interface PaymentMetadata {
  gateway?: string;
  gatewayTransactionId?: string;
  failureReason?: string;
  refundReason?: string;
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  patientId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  isActive: boolean;
  displayName: string;
  lastFour?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  billingAddress?: BillingAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Subscription {
  id: string;
  patientId: string;
  centerId: string;
  planName: string;
  planDescription: string;
  status: SubscriptionStatus;
  amount: number;
  currency: 'EUR' | 'USD' | 'MXN';
  interval: 'monthly' | 'quarterly' | 'yearly';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate: Date;
  paymentMethodId: string;
  trialEnd?: Date;
  cancelledAt?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing' | 'incomplete';

export interface Invoice {
  id: string;
  paymentId: string;
  patientId: string;
  centerId: string;
  invoiceNumber: string;
  amount: number;
  currency: 'EUR' | 'USD' | 'MXN';
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  description: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  nextPaymentAmount: number;
  nextPaymentDate?: Date;
  currentBalance: number;
  subscriptionStatus?: SubscriptionStatus;
}

export interface PaymentFilters {
  status?: PaymentStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  paymentMethod?: PaymentMethodType[];
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface PaymentProcessRequest {
  amount: number;
  currency: 'EUR' | 'USD' | 'MXN';
  description: string;
  paymentMethodId: string;
  metadata?: Record<string, any>;
}

export interface PaymentProcessResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  status: PaymentStatus;
  message: string;
  redirectUrl?: string;
}
