'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ROLE_PERMISSIONS } from '@/types/user';

interface RegisterUserData {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  register: (userData: RegisterUserData) => Promise<boolean>;
  logout: () => Promise<void>;
  dateOfBirth?: string;
  gender?: string;
  therapistData?: {
    specialties?: string[];
    license?: string;
    experience?: number;
    education?: string[];
  };
  patientData?: {
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
    };
    medicalHistory?: {
      allergies: string[];
      medications: string[];
      previousDiagnoses: string[];
      familyHistory: string[];
    };
    insuranceInfo?: {
      provider?: string;
      policyNumber?: string;
      groupNumber?: string;
      validUntil?: string;
      [key: string]: unknown;
    };
  };
  receptionistData?: {
    department?: string;
    workShift?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterUserData) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string, category?: string) => boolean;
  canAccessRoute: (route: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Establecer cookie para el middleware
          document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        clearAllCookies();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAllCookies = () => {
    const cookieFormats = [
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT',
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax',
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict',
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure',
      'user=; path=/; max-age=0',
      'user=; path=/; max-age=0; SameSite=Lax',
      'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT',
      'user=; max-age=0'
    ];

    cookieFormats.forEach(format => {
      document.cookie = format;
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de diferentes usuarios según credenciales
      let userData: User;
      
      if (email === 'admin' && password === 'admin123') {
        userData = {
          id: 'admin1',
          email: 'admin@centropsicologico.com',
          role: 'ceo',
          centerId: 'center1',
          name: 'Dr. Carlos Mendoza',
          firstName: 'Carlos',
          lastName: 'Mendoza',
          phone: '+1234567890',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date()
        };
      } else if (email === 'therapist' && password === 'therapist123') {
        userData = {
          id: 'therapist1',
          email: 'therapist@centropsicologico.com',
          role: 'therapist',
          centerId: 'center1',
          name: 'Dra. Ana García',
          firstName: 'Ana',
          lastName: 'García',
          phone: '+1234567891',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date(),
          therapistInfo: {
            specialties: ['Ansiedad', 'Depresión', 'Terapia Cognitiva'],
            license: 'PSY-12345',
            experience: 8,
            education: ['Psicología Clínica - Universidad Nacional'],
            certifications: ['Terapia Cognitivo-Conductual'],
            schedule: {
              monday: { start: '09:00', end: '17:00', available: true },
              tuesday: { start: '09:00', end: '17:00', available: true },
              wednesday: { start: '09:00', end: '17:00', available: true },
              thursday: { start: '09:00', end: '17:00', available: true },
              friday: { start: '09:00', end: '15:00', available: true },
              saturday: { start: '00:00', end: '00:00', available: false },
              sunday: { start: '00:00', end: '00:00', available: false }
            }
          }
        };
      } else if (email === 'patient' && password === 'patient123') {
        userData = {
          id: 'patient1',
          email: 'patient@email.com',
          role: 'patient',
          centerId: 'center1',
          name: 'Juan Pérez',
          firstName: 'Juan',
          lastName: 'Pérez',
          phone: '+1234567892',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date(),
          patientInfo: {
            emergencyContact: {
              name: 'María Pérez',
              relationship: 'Esposa',
              phone: '+1234567893',
              email: 'maria@email.com'
            },
            medicalHistory: {
              allergies: [],
              medications: [],
              previousDiagnoses: [],
              familyHistory: []
            },
            assignedTherapist: 'therapist1'
          }
        };
  } else if (email === 'reception' && password === 'reception123') {
    userData = {
      id: 'reception1',
      email: 'reception@centropsicologico.com',
      role: 'receptionist',
      centerId: 'center1',
      name: 'Laura Martínez',
      firstName: 'Laura',
      lastName: 'Martínez',
      phone: '+1234567894',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      receptionistInfo: {
        department: 'Recepción Principal',
        permissions: ['schedule_appointments', 'manage_patients', 'view_calendar'],
        workShift: 'full-time'
      }
    };
  } else {
    return false;
  }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Establecer cookie para el middleware
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterUserData): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular registro exitoso
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        role: userData.role as User['role'],
        centerId: 'center1',
        name: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,
        gender: (userData.gender === 'male' ||
                 userData.gender === 'female' ||
                 userData.gender === 'other' ||
                 userData.gender === 'prefer-not-to-say')
                ? userData.gender
                : undefined
      };

      // Agregar información específica del rol
      if (userData.role === 'therapist' && userData.therapistData) {
        newUser.therapistInfo = {
          specialties: userData.therapistData.specialties || [],
          license: userData.therapistData.license || '',
          experience: userData.therapistData.experience || 0,
          education: userData.therapistData.education || [],
          certifications: [],
          schedule: {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '00:00', end: '00:00', available: false },
            sunday: { start: '00:00', end: '00:00', available: false }
          }
        };
      } else if (userData.role === 'patient' && userData.patientData) {
        newUser.patientInfo = {
          emergencyContact: userData.patientData.emergencyContact,
          medicalHistory: userData.patientData.medicalHistory || {
            allergies: [],
            medications: [],
            previousDiagnoses: [],
            familyHistory: []
          },
          insuranceInfo: userData.patientData.insuranceInfo &&
            typeof userData.patientData.insuranceInfo.provider === 'string' &&
            typeof userData.patientData.insuranceInfo.policyNumber === 'string'
            ? {
                provider: userData.patientData.insuranceInfo.provider,
                policyNumber: userData.patientData.insuranceInfo.policyNumber,
                groupNumber: userData.patientData.insuranceInfo.groupNumber
              }
            : undefined
        };
      } else if (userData.role === 'receptionist' && userData.receptionistData) {
        newUser.receptionistInfo = {
          department: userData.receptionistData.department || 'Recepción',
          permissions: ['schedule_appointments', 'manage_patients'],
          workShift: ['full-time', 'morning', 'afternoon', 'night'].includes(userData.receptionistData.workShift as string)
            ? userData.receptionistData.workShift as 'full-time' | 'morning' | 'afternoon' | 'night'
            : 'full-time'
        };
      }

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Establecer cookie para el middleware
      document.cookie = `user=${JSON.stringify(newUser)}; path=/; max-age=86400; SameSite=Lax`;
      
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🔄 Iniciando proceso de logout...');
      
      setUser(null);
      localStorage.removeItem('user');
      clearAllCookies();
      
      console.log('🔄 Redirigiendo a login...');
      await router.replace('/login');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      
      console.log('✅ Logout completado');
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      window.location.href = '/login';
    }
  };

  const hasPermission = (permission: string, category: string = 'dashboard'): boolean => {
    if (!user) return false;
    
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    if (!rolePermissions) return false;
    
    const categoryPermissions = rolePermissions.permissions[category as keyof typeof rolePermissions.permissions];
    if (!categoryPermissions) return false;
    
    return categoryPermissions.includes(permission) || categoryPermissions.includes('full_access');
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false;
    
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    if (!rolePermissions) return false;
    
    return rolePermissions.allowedRoutes.some(allowedRoute => 
      route.startsWith(allowedRoute)
    );
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      hasPermission, 
      canAccessRoute 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}