
export type UserRole = 'admin' | 'psychologist' | 'patient';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  centerId: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
  profileImage?: string;
  phone?: string;
  emailVerified: boolean;
  lastLoginAt?: Date;
  // Campos específicos por rol
  specialization?: string; // Para psicólogos
  licenseNumber?: string; // Para psicólogos
  emergencyContact?: string; // Para pacientes
  phoneNumber?: string; // Para pacientes
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  centerId: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  emergencyContact?: string;
}

export interface AuthError {
  code: string;
  message: string;
}