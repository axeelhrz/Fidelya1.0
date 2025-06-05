"use client";

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin' | 'user';
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
          // Obtener perfil del usuario
          const { data: clienteData, error: profileError } = await supabase
            .from('clientes')
            .select('id, correo_apoderado, nombre_apoderado, rol')
            .eq('correo_apoderado', user.email)
            .single();

          if (profileError) {
            console.error('Error getting profile:', profileError);
          } else if (clienteData) {
            setProfile({
              id: clienteData.id,
              email: clienteData.correo_apoderado,
              name: clienteData.nombre_apoderado,
              role: clienteData.rol || 'user',
            });
          }
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
          // Recargar perfil cuando el usuario se loguea
          getUser();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

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
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const isAdmin = () => {
    return profile?.role === 'admin' || profile?.role === 'super_admin';
  };

  const isSuperAdmin = () => {
    return profile?.role === 'super_admin';
  };

  return {
    user,
    profile,
    loading,
    signOut,
    isAdmin,
    isSuperAdmin,
  };
}
