"use client";

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export type UserRole = 'user' | 'viewer' | 'moderator' | 'admin' | 'super_admin';

export interface Permission {
  name: string;
  module: string;
  action: string;
}

export interface RoleInfo {
  role_name: UserRole;
  display_name: string;
  description: string;
  color: string;
  permissions: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roleInfo?: RoleInfo;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  loginCount: number;
  avatar?: string;
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
          await loadUserProfile(user.email!);
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
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          router.push('/auth/login');
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.email!);
          
          // Actualizar último login
          await updateLastLogin(session.user.email!);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const loadUserProfile = async (email: string) => {
    try {
      // Obtener datos del cliente
      const { data: clienteData, error: profileError } = await supabase
        .from('clientes')
        .select('id, correo_apoderado, nombre_apoderado, role, is_active, last_login, login_count')
        .eq('correo_apoderado', email)
        .single();

      if (profileError) {
        console.error('Error getting profile:', profileError);
        return;
      }

      if (!clienteData) {
        console.error('No profile found for user:', email);
        return;
      }

      // Obtener información del rol y permisos
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role_info', { user_email: email });

      const { data: permissionsData, error: permissionsError } = await supabase
        .rpc('get_user_permissions', { user_email: email });

      if (roleError) {
        console.error('Error getting role info:', roleError);
      }

      if (permissionsError) {
        console.error('Error getting permissions:', permissionsError);
      }

      const roleInfo = roleData?.[0];
      const permissions = permissionsData || [];

      setProfile({
        id: clienteData.id,
        email: clienteData.correo_apoderado,
        name: clienteData.nombre_apoderado,
        role: clienteData.role || 'user',
        roleInfo: roleInfo ? {
          role_name: roleInfo.role_name,
          display_name: roleInfo.display_name,
          description: roleInfo.description,
          color: roleInfo.color,
          permissions: roleInfo.permissions || []
        } : undefined,
        permissions: permissions.map((p: any) => ({
          name: p.permission_name,
          module: p.module,
          action: p.action
        })),
        isActive: clienteData.is_active,
        lastLogin: clienteData.last_login,
        loginCount: clienteData.login_count || 0,
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const updateLastLogin = async (email: string) => {
    try {
      await supabase
        .from('clientes')
        .update({ 
          last_login: new Date().toISOString(),
          login_count: supabase.sql`login_count + 1`
        })
        .eq('correo_apoderado', email);
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: error.message,
      });
    }
  };

  // Funciones de verificación de permisos
  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    return profile.permissions.some(p => p.name === permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!profile) return false;
    return permissions.some(permission => hasPermission(permission));
  };

  const hasModuleAccess = (module: string, action?: string): boolean => {
    if (!profile) return false;
    return profile.permissions.some(p => 
      p.module === module && (action ? p.action === action : true)
    );
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
    
    // Funciones de utilidad
    refreshProfile: () => loadUserProfile(user?.email || ''),
  };
}