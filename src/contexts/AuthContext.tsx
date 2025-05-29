import React, { createContext, useEffect, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@fruteria.com',
    name: 'Administrador',
      role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'empleado@fruteria.com',
    name: 'Juan Pérez',
    role: 'employee',
    createdAt: new Date('2024-01-15'),
  },
];

// Mock passwords (en una app real, esto estaría en el backend)
const mockPasswords: { [email: string]: string } = {
  'admin@fruteria.com': 'admin123',
  'empleado@fruteria.com': 'empleado123',
  };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular delay de autenticación
  const simulateAuthDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

  const login = async (email: string, password: string) => {
    await simulateAuthDelay();
    
    // Verificar credenciales
    const mockPassword = mockPasswords[email];
    if (!mockPassword || mockPassword !== password) {
      throw new Error('Credenciales inválidas');
    }

    // Buscar usuario
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Guardar en localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
};

  const register = async (email: string, password: string, name: string) => {
    await simulateAuthDelay();
    
    // Verificar si el usuario ya existe
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'admin', // Por defecto admin para el demo
      createdAt: new Date()
    };

    // Agregar a la lista de usuarios mock (en memoria)
    mockUsers.push(newUser);
    mockPasswords[email] = password;

    // Guardar en localStorage
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  const logout = async () => {
    await simulateAuthDelay();
    
    // Limpiar localStorage
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // Verificar si hay un usuario guardado al cargar la app
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const user = JSON.parse(savedUser) as User;
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    // Simular delay de carga inicial
    setTimeout(checkAuthState, 500);
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};