export interface Center {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  settings: CenterSettings;
  subscription: Subscription;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CenterSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
  };
  notifications: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  integrations: {
    openai: boolean;
    whatsapp: boolean;
    notion: boolean;
  };
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface Subscription {
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'expired';
  startDate: Date;
  endDate: Date;
  features: string[];
  maxUsers: number;
  maxPatients: number;
}
