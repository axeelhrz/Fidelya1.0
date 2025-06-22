'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { baseRegisterSchema, type BaseRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, User, Star, Gift, Zap, Crown, Shield, CheckCircle } from 'lucide-react';

export default function SocioRegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: BaseRegisterFormData) => {
    const userData = await createUser(data.email, data.password, {
      nombre: data.nombre,
      email: data.email,
      role: 'socio',
      estado: 'activo'
    });
    
    const dashboardRoute = getDashboardRoute(userData.role);
    router.push(dashboardRoute);
  };

  const registerFields: {
    name: 'email' | 'password' | 'nombre' | 'confirmPassword';
    label: string;
    type: string;
    icon?: React.ReactNode;
    placeholder?: string;
  }[] = [
    {
      name: 'nombre',
      label: 'Nombre completo',
      type: 'text',
      icon: <User />,
      placeholder: 'Tu nombre completo'
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      icon: <Mail />,
      placeholder: 'tu@email.com'
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      icon: <Lock />,
      placeholder: 'Mínimo 6 caracteres'
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar contraseña',
      type: 'password',
      icon: <Lock />,
      placeholder: 'Confirma tu contraseña'
    }
  ];

  return (
    <AuthLayout
      title="Crear cuenta de Socio"
      subtitle="Únete a la comunidad premium y disfruta de beneficios exclusivos"
      showBackButton={true}
      backHref="/auth/register"
    >
      <div className="space-y-8">
        {/* Indicador de Rol Premium mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-gradient-to-r from-green-50 via-green-100/50 to-green-50 border-2 border-green-200 rounded-2xl p-6 overflow-hidden"
        >
          {/* Efecto de brillo superior */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
          
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 border-2 border-green-200 shadow-lg relative overflow-hidden">
              <Crown className="h-8 w-8 text-green-600 relative z-10" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-black text-green-900 tracking-tight">Cuenta Premium de Socio</h3>
                <Star className="w-5 h-5 text-green-600 fill-current" />
              </div>
              <p className="text-sm text-green-700 leading-snug font-medium">
                Acceso completo a beneficios exclusivos y programas de fidelidad
              </p>
            </div>
          </div>

          {/* Beneficios destacados mejorados */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-800 tracking-tight">Descuentos exclusivos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-800 tracking-tight">Puntos de fidelidad</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-800 tracking-tight">Soporte prioritario</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-800 tracking-tight">Acceso premium</span>
            </div>
          </div>
        </motion.div>

        {/* Formulario mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AuthForm
            schema={baseRegisterSchema}
            onSubmit={handleRegister}
            fields={registerFields}
            submitText="Crear cuenta premium"
          />
        </motion.div>

        {/* Link de Login mejorado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600 font-medium">
            ¿Ya tienes cuenta?{' '}
            <Link 
              href="/auth/login" 
              className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline tracking-tight"
            >
              Iniciar sesión
            </Link>
          </p>
        </motion.div>

        {/* Garantía mejorada */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center relative overflow-hidden"
        >
          {/* Línea decorativa */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            <span className="font-bold text-gray-800">Garantía de satisfacción:</span> Cancela cuando quieras. 
            Sin compromisos a largo plazo.
          </p>
        </motion.div>
      </div>
    </AuthLayout>
  );
}