"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireSuperAdmin?: boolean;
  fallbackMessage?: string;
}

export function AdminGuard({ 
  children, 
  requiredPermission,
  requiredPermissions,
  requireSuperAdmin = false,
  fallbackMessage
}: AdminGuardProps) {
  const { 
    user, 
    profile, 
    loading, 
    canAccessAdmin, 
    isSuperAdmin, 
    hasPermission, 
    hasAnyPermission 
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-xl border-0">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="relative mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-12 w-12 text-blue-600" />
                </motion.div>
                <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Verificando acceso
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Validando permisos de usuario...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect redirigirá
  }

  // Verificar si el usuario está activo
  if (!profile?.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-xl border-0">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Cuenta Desactivada
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">
                Tu cuenta ha sido desactivada. Contacta al administrador para más información.
              </p>
              <Button 
                onClick={() => router.push('/auth/login')}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Volver al Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Verificar super admin si es requerido
  if (requireSuperAdmin && !isSuperAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-xl border-0">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-6">
                <Lock className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Acceso Restringido
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                {fallbackMessage || 'Necesitas permisos de Super Administrador para acceder a esta sección.'}
              </p>
              <div className="text-center mb-6">
                <p className="text-xs text-gray-500 mb-2">Tu rol actual:</p>
                <span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: profile?.roleInfo?.color + '20',
                    color: profile?.roleInfo?.color || '#6b7280'
                  }}
                >
                  {profile?.roleInfo?.displayName || profile?.role}
                </span>
              </div>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Verificar permiso específico
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-xl border-0">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Permiso Requerido
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                {fallbackMessage || `Necesitas el permiso "${requiredPermission}" para acceder a esta sección.`}
              </p>
              <div className="text-center mb-6">
                <p className="text-xs text-gray-500 mb-2">Tu rol actual:</p>
                <span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: profile?.roleInfo?.color + '20',
                    color: profile?.roleInfo?.color || '#6b7280'
                  }}
                >
                  {profile?.roleInfo?.displayName || profile?.role}
                </span>
              </div>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Verificar múltiples permisos (cualquiera)
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-xl border-0">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Permisos Insuficientes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                {fallbackMessage || 'No tienes los permisos necesarios para acceder a esta sección.'}
              </p>
              <div className="text-center mb-6">
                <p className="text-xs text-gray-500 mb-2">Permisos requeridos:</p>
                <div className="space-y-1">
                  {requiredPermissions.map((permission, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mr-1 mb-1"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Verificar acceso general al admin
  if (!canAccessAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-xl border-0">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Acceso Denegado
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8">
                No tienes permisos para acceder al panel administrativo.
              </p>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}