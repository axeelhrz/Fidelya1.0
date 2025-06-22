'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { comercioRegisterSchema, type ComercioRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, User, Store, Tag } from 'lucide-react';

export default function ComercioRegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: ComercioRegisterFormData) => {
    const userData = await createUser(data.email, data.password, {
      nombre: data.nombre,
      email: data.email,
      role: 'comercio',
      estado: 'activo',
      // nombreComercio: data.nombreComercio,
      // categoria: data.categoria
    });
    
    const dashboardRoute = getDashboardRoute(userData.role);
    router.push(dashboardRoute);
  };

  const registerFields: {
    name: "nombre" | "email" | "password" | "confirmPassword" | "nombreComercio" | "categoria";
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
      name: 'nombreComercio',
      label: 'Nombre del comercio',
      type: 'text',
      icon: <Store />,
      placeholder: 'Nombre de tu negocio'
    },
    {
      name: 'categoria',
      label: 'Categoría del negocio',
      type: 'text',
      icon: <Tag />,
      placeholder: 'Ej: Restaurante, Tienda, Servicios'
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
      title="Crear cuenta de Comercio"
      subtitle="Ofrece beneficios exclusivos a tus clientes"
    >
      <AuthForm
        schema={comercioRegisterSchema}
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
