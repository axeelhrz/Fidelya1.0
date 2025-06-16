export type UserRole = 'admin' | 'psicologo' | 'paciente';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  centerId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  profileImage?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
