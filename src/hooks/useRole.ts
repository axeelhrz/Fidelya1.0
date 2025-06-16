import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

export function useRole() {
  const { user } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isPsychologist = (): boolean => hasRole('psicologo');
  const isPatient = (): boolean => hasRole('paciente');

  const canAccessModule = (module: string): boolean => {
    if (!user) return false;

    const permissions = {
      admin: ['dashboard', 'patients', 'sessions', 'alerts', 'metrics', 'settings', 'subscription'],
      psicologo: ['dashboard', 'patients', 'sessions', 'alerts', 'metrics'],
      paciente: ['dashboard', 'sessions'],
    };

    return permissions[user.role]?.includes(module) || false;
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isPsychologist,
    isPatient,
    canAccessModule,
  };
}
