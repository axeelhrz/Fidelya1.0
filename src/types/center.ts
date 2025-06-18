export interface CenterTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface CenterSettings {
  id: string;
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  theme: {
    light: CenterTheme;
    dark: CenterTheme;
    mode: 'light' | 'dark' | 'system';
  };
  features: {
    allowPatientRegistration: boolean;
    requireEmailVerification: boolean;
    enableNotifications: boolean;
    enableVideoSessions: boolean;
  };
  subscription: {
    plan: 'basic' | 'professional' | 'enterprise';
    maxUsers: number;
    maxPatients: number;
    expiresAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Center {
  id: string;
  name: string;
  settings: CenterSettings;
  isActive: boolean;
}