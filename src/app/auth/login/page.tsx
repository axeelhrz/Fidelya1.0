'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { signIn, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    const userData = await signIn(data.email, data.password);
    const dashboardRoute = getDashboardRoute(userData.role);
    router.push(dashboardRoute);
  };

  const loginFields: { name: "email" | "password"; label: string; type: string; icon?: React.ReactNode; placeholder?: string }[] = [
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      icon: <Mail />,
      placeholder: "tu@email.com"
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      icon: <Lock />,
      placeholder: "Tu contraseña"
    }
  ];

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Accede a tu cuenta de Fidelita"
    >
      <AuthForm
        schema={loginSchema}
        onSubmit={handleLogin}
        fields={loginFields}
        submitText="Iniciar sesión"
      />

      <div className="mt-6 space-y-4">
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowResetPassword(!showResetPassword)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/auth/register"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Crear cuenta nueva
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
