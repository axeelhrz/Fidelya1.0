'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { asociacionRegisterSchema, type AsociacionRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, User, Building2, ArrowLeft } from 'lucide-react';

export default function AsociacionRegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: AsociacionRegisterFormData) => {
    const userData = await createUser(data.email, data.password, {
      nombre: data.nombre,
      email: data.email,
      role: 'asociacion',
      estado: 'activo',
    });
    
    const dashboardRoute = getDashboardRoute(userData.role);
    router.push(dashboardRoute);
  };

  const registerFields: {
    name: "email" | "password" | "nombre" | "confirmPassword" | "nombreAsociacion";
    label: string;
    type: string;
    icon?: React.ReactNode;
    placeholder?: string;
  }[] = [
    {
      name: 'nombre',
      label: 'Nombre del responsable',
      type: 'text',
      icon: <User />,
      placeholder: 'Tu nombre completo'
    },
    {
      name: 'nombreAsociacion',
      label: 'Nombre de la asociación',
      type: 'text',
      icon: <Building2 />,
      placeholder: 'Nombre de tu asociación u organización'
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
      title="Crear cuenta de Asociación"
      subtitle="Gestiona programas de fidelidad para tu organización"
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
          className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-800">Cuenta de Asociación</h3>
            <p className="text-xs text-blue-600">Administra programas de fidelidad</p>
          </div>
        </motion.div>

        <AuthForm
          schema={asociacionRegisterSchema}
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