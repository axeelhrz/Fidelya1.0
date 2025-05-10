import { Timestamp } from 'firebase/firestore';

export type SubscriptionStatus = 'active' | 'pending' | 'canceled' | 'expired' | 'past_due' | 'suspended';
export type SubscriptionPeriod = 'month' | 'year';
export type PaymentProvider = 'paypal' | 'stripe' | 'none';
export type PlanId = 'basic' | 'pro' | 'enterprise';

export interface PlanDetails {
  name: string;
  price: number;
  period: SubscriptionPeriod;
  trialDays: number;
}

export interface Subscription {
  plan: string;
  status: SubscriptionStatus;
  planId: PlanId;
  planDetails?: PlanDetails;
  paypalSubscriptionId?: string | null;
  paypalPlanId?: string | null;
  currentPeriodStart?: Date | Timestamp;
  currentPeriodEnd?: Date | Timestamp;
  trialEnd?: Date | Timestamp | null;
  cancelAtPeriodEnd?: boolean;
  canelSubscription?: boolean;
}

export interface SubscriptionDocument extends Omit<Subscription, 'currentPeriodStart' | 'currentPeriodEnd' | 'trialEnd'> {
  userId: string;
  orderId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  paymentProvider: PaymentProvider;
  period: SubscriptionPeriod;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  trialEnd?: Timestamp;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  type: 'basic' | 'pro' | 'enterprise';
  monthlyPrice?: number;
  annualPrice?: number;
  period: SubscriptionPeriod;
  description: string;
  features: Array<{
    text: string;
    tooltip?: string;
  }>;
  trialDays?: number;
  paypalPlanId?: string;
  popular?: boolean;
}

export interface SelectedPlan {
  id: PlanId;
  name: string;
  price: number;
  period: SubscriptionPeriod;
  trialDays?: number;
  paypalPlanId?: string;
  selectedAt: number;
}