"use client";

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import type { 
  UserRole, 
  UserProfile, 
} from '@/lib/supabase/types';

export interface RoleInfo {
  role_name: UserRole;
  display_name: string;
  description: string;
  color: string;
  permissions: string[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          setLoading(false);
          return;
        }

        setUser(user);

        if (user) {
          await loadUserProfile(user.email!, user);
        }
      } catch (error) {
        console.error('Error in getUser:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          router.push('/auth/login');
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.email!, session.user);
          
          // Actualizar último login
          try {
            await updateLastLogin(session.user.email!);
          } catch (error) {
            console.warn('Could not update last login:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const loadUserProfile = async (email: string, authUser?: User) => {
    try {
      console.log('Loading profile for:', email);
      
      // Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      // Si no existe el usuario en la tabla users, intentar crearlo
      if (userError && userError.code === 'PGRST116' && authUser) {
        console.log('User profile not found, creating...');
        
        try {
          const { error: createError } = await supabase
            .rpc('create_user_profile_manual', {
              p_user_id: authUser.id,
              p_email: email,
              p_full_name: authUser.user_metadata?.full_name || email.split('@')[0],
              p_phone: authUser.user_metadata?.phone || null,
              p_role: 'user'
            });

          if (createError) {
            console.error('Error creating user profile:', createError);
            // Continuar sin perfil
            setProfile(null);
            return;
          }

          // Intentar cargar el perfil nuevamente
          const { data: newUserData, error: newUserError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (newUserError || !newUserData) {
            console.error('Error loading newly created profile:', newUserError);
            setProfile(null);
            return;
          }

          // Usar los datos del nuevo usuario
          await buildUserProfile(newUserData, email);
          return;
        } catch (createError) {
          console.error('Error in profile creation process:', createError);
          setProfile(null);
          return;
        }
      }

      if (userError) {
        console.error('Error getting user profile:', userError);
        setProfile(null);
        return;
      }

      if (!userData) {
        console.error('No user profile found for:', email);
        setProfile(null);
        return;
      }

      await buildUserProfile(userData, email);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
    }
  };

  const buildUserProfile = async (userData: any, email: string) => {
    try {
      // Obtener estudiantes del usuario
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('guardian_id', userData.id)
        .eq('is_active', true);

      if (studentsError) {
        console.error('Error getting students:', studentsError);
      }

      // Obtener información del rol y permisos usando las funciones RPC
      let roleInfo = null;
      let permissions: string[] = [];

      try {
        const { data: roleData, error: roleError } = await supabase
          .rpc('get_user_role_info', { user_email: email });

        if (!roleError && roleData?.[0]) {
          roleInfo = roleData[0];
        }
      } catch (error) {
        console.warn('Could not load role info:', error);
      }

      try {
        const { data: permissionsData, error: permissionsError } = await supabase
          .rpc('get_user_permissions', { user_email: email });

        if (!permissionsError && permissionsData) {
          permissions = permissionsData.map((p: { permission_name: string }) => p.permission_name);
        }
      } catch (error) {
        console.warn('Could not load permissions:', error);
      }

      const userProfile: UserProfile = {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        phone: userData.phone,
        role: userData.role,
        isActive: userData.is_active,
        lastLogin: userData.last_login,
        loginCount: userData.login_count || 0,
        students: studentsData || [],
        permissions: permissions,
        roleInfo: roleInfo ? {
          displayName: roleInfo.display_name,
          description: roleInfo.description,
          color: roleInfo.color,
        } : undefined,
      };

      console.log('User profile loaded successfully:', userProfile.email, userProfile.role);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error building user profile:', error);
      setProfile(null);
    }
  };

  const updateLastLogin = async (email: string) => {
    try {
      await supabase.rpc('update_last_login', { user_email: email });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
      
      router.push('/auth/login');
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  // Funciones de verificación de permisos
  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    return profile.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!profile) return false;
    return permissions.some(permission => hasPermission(permission));
  };

  const hasModuleAccess = (module: string, action?: string): boolean => {
    if (!profile) return false;
    const modulePermissions = profile.permissions.filter(p => 
      p.startsWith(`${module}.`)
    );
    
    if (action) {
      return modulePermissions.some(p => p === `${module}.${action}`);
    }
    
    return modulePermissions.length > 0;
  };

  // Verificaciones de rol
  const isUser = () => profile?.role === 'user';
  const isViewer = () => profile?.role === 'viewer';
  const isModerator = () => profile?.role === 'moderator';
  const isAdmin = () => profile?.role === 'admin' || profile?.role === 'super_admin';
  const isSuperAdmin = () => profile?.role === 'super_admin';

  // Verificaciones de acceso a módulos
  const canAccessAdmin = () => {
    return hasAnyPermission([
      'usuarios.read', 'pedidos.update', 'menu.update', 
      'estadisticas.read', 'configuracion.read'
    ]);
  };

  const canManageUsers = () => {
    return hasAnyPermission(['usuarios.create', 'usuarios.update', 'usuarios.delete']);
  };

  const canManageRoles = () => {
    return hasPermission('usuarios.manage_roles');
  };

  const canExportData = () => {
    return hasAnyPermission(['pedidos.export', 'estadisticas.export']);
  };

  const canManageMenu = () => {
    return hasAnyPermission(['menu.create', 'menu.update', 'menu.delete']);
  };

  const canViewReports = () => {
    return hasPermission('estadisticas.read');
  };

  const canManageOrders = () => {
    return hasAnyPermission(['pedidos.update', 'pedidos.delete']);
  };

  return {
    user,
    profile,
    loading,
    signOut,
    
    // Verificaciones de permisos
    hasPermission,
    hasAnyPermission,
    hasModuleAccess,
    
    // Verificaciones de rol
    isUser,
    isViewer,
    isModerator,
    isAdmin,
    isSuperAdmin,
    
    // Verificaciones de acceso
    canAccessAdmin,
    canManageUsers,
    canManageRoles,
    canExportData,
    canManageMenu,
    canViewReports,
    canManageOrders,
    
    // Funciones de utilidad
    refreshProfile: () => user?.email ? loadUserProfile(user.email, user) : Promise.resolve(),
  };
}