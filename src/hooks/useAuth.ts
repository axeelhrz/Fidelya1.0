"use client";

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import type { UserProfile, Student } from '@/lib/supabase/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (!mounted) return;
        
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
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          router.push('/auth/login');
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.email!);
          
          // Actualizar último login
          try {
            await supabase.rpc('update_last_login', { user_email: session.user.email! });
          } catch (error) {
            console.warn('Could not update last login:', error);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const loadUserProfile = async (email: string) => {
    try {
      // Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

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

      // Obtener estudiantes del usuario
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('guardian_id', userData.id)
        .eq('is_active', true);

      if (studentsError) {
        console.error('Error getting students:', studentsError);
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
      };

      console.log('User profile loaded successfully:', userProfile.email, userProfile.role);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
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

  // Verificaciones de rol
  const isUser = () => profile?.role === 'user';
  const isAdmin = () => profile?.role === 'admin' || profile?.role === 'super_admin';
  const isSuperAdmin = () => profile?.role === 'super_admin';

  return {
    user,
    profile,
    loading,
    signOut,
    isUser,
    isAdmin,
    isSuperAdmin,
    refreshProfile: () => user?.email ? loadUserProfile(user.email) : Promise.resolve(),
  };
}