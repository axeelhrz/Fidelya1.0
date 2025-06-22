'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { baseRegisterSchema, type BaseRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';

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
      subtitle="Únete y disfruta de beneficios exclusivos en tu comunidad"
    >
      <div className="space-y-6">
        {/* Botón de regreso */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/auth/register"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a selección de cuenta
          </Link>
        </motion.div>

        {/* Indicador de rol */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 border border-green-200">
            <User className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-800">Cuenta de Socio</h3>
            <p className="text-xs text-green-600">Acceso a beneficios y programas de fidelidad</p>
          </div>
        </motion.div>

        <AuthForm
          schema={baseRegisterSchema}
          onSubmit={handleRegister}
          fields={registerFields}
          submitText="Crear cuenta"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Iniciar sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </AuthLayout>
  );
}