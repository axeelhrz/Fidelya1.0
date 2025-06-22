'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { baseRegisterSchema, type BaseRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, User, Star, Gift, Zap, Crown } from 'lucide-react';

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
        {/* Indicador de Rol Premium */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-gradient-to-r from-green-50 via-green-100/50 to-green-50 border-2 border-green-200 rounded-2xl p-6 overflow-hidden"
        >
          {/* Efecto de brillo */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
          
          <div className="flex items-center space-x-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 border-2 border-green-200 shadow-lg">
              <Crown className="h-7 w-7 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-black text-green-900 tracking-tight">Cuenta Premium de Socio</h3>
                <Star className="w-5 h-5 text-green-600 fill-current" />
              </div>
              <p className="text-sm text-green-700 leading-relaxed">
                Acceso completo a beneficios exclusivos y programas de fidelidad
              </p>
            </div>
          </div>

          {/* Beneficios destacados */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-800">Descuentos exclusivos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-800">Puntos de fidelidad</span>
            </div>
          </div>
        </motion.div>

        {/* Formulario */}
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

        {/* Link de Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link 
              href="/auth/login" 
              className="font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200 hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </motion.div>

        {/* Garantía */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center"
        >
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold">Garantía de satisfacción:</span> Cancela cuando quieras. 
            Sin compromisos a largo plazo.
          </p>
        </motion.div>
      </div>
    </AuthLayout>
  );
}