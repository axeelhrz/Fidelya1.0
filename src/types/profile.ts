export type SocialPlatform = 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'github';

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

export interface ProfileStatistics {
  totalClients: number;
  activePolicies: number;
  successRate: number;
  totalRevenue: number;
  lastMonthPolicies: number;
  lastUpdated: Date | string;
}

export interface ProfileNotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  newsletter: boolean;
  marketingUpdates: boolean;
}

export interface ProfilePrivacySettings {
  showEmail: boolean;
  showLocation: boolean;
  showSocialLinks: boolean;
  showStatistics: boolean;
  publicProfile: boolean;
}

export interface ProfileContact {
  phone?: string;
  alternativeEmail?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface ProfileExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string;
  current: boolean;
  description?: string;
}

export interface ProfileCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date | string;
  expirationDate?: Date | string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ProfileData {
  plan?: { name: string; [key: string]: unknown };
  name: string;
  firstName: string;
  id: string;
  displayName: string;
  email: string;
  bio: string;
  location: string;
  company: string;
  website: string;
  avatarUrl: string;
  coverPhotoUrl: string;
  
  // Información profesional
  title?: string;
  specialization?: string;
  yearsOfExperience?: number;
  languages?: string[];
  skills?: string[];
  
  // Detalles de contacto
  contact?: ProfileContact;
  
  // Enlaces sociales
  socialLinks?: SocialLinks;
  
  // Estadísticas
  statistics: ProfileStatistics;
  
  // Experiencia y certificaciones
  experience?: ProfileExperience[];
  certifications?: ProfileCertification[];
  
  // Configuraciones
  notificationSettings?: ProfileNotificationSettings;
  privacySettings?: ProfilePrivacySettings;
  
  // Metadatos
  createdAt: Date | string;
  updatedAt: Date | string;
  lastLogin?: Date | string;
  isVerified?: boolean;
  status?: 'active' | 'inactive' | 'suspended';
  
  // Preferencias
  theme?: 'light' | 'dark' | 'system';
  timezone?: string;
  locale?: string;
  
  // Métricas adicionales
  metrics?: {
    profileViews: number;
    responseRate: number;
    averageResponseTime: number;
    completionRate: number;
  };
}

export interface ProfileUpdateInput extends Partial<Omit<ProfileData, 'id' | 'createdAt'>> {
  updatedAt?: Date | string;
}

export interface ProfileImageUpload {
  file: File;
  type: 'avatar' | 'cover';
  progress?: number;
  error?: string;
}

export interface ProfileValidationError {
  field: keyof ProfileData;
  message: string;
}

export type ProfileTab = 
  | 'overview'
  | 'experience'
  | 'certifications'
  | 'settings'
  | 'privacy'
  | 'notifications';

export interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: ProfileUpdateInput) => Promise<boolean>;
  uploadImage: (data: ProfileImageUpload) => Promise<string | null>;
  deleteProfile: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}