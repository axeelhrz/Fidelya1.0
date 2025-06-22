'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { asociacionRegisterSchema, type AsociacionRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, User, Building2 } from 'lucide-react';

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
      label: 'Nombre completo',
      type: 'text',
      icon: <User />,
      placeholder: 'Tu nombre completo'
    },
    {
      name: 'nombreAsociacion',
      label: 'Nombre de la asociación',
      type: 'text',
      icon: <Building2 />,
      placeholder: 'Nombre de tu asociación'
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
      <AuthForm
        schema={asociacionRegisterSchema}
        onSubmit={handleRegister}
        fields={registerFields}
        submitText="Crear cuenta"
      />

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
