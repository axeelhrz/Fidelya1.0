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
  const isPsychologist = (): boolean => hasRole('psychologist');
  const isPatient = (): boolean => hasRole('patient');

  const canAccessAdminFeatures = (): boolean => isAdmin();
  const canAccessPsychologistFeatures = (): boolean => isAdmin() || isPsychologist();
  const canAccessPatientData = (): boolean => isAdmin() || isPsychologist();

  return {
    user,
    role: user?.role,
    hasRole,
    hasAnyRole,
    isAdmin,
    isPsychologist,
    isPatient,
    canAccessAdminFeatures,
    canAccessPsychologistFeatures,
    canAccessPatientData,
  };
}