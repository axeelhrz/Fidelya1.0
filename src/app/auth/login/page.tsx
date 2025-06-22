'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
      title="Bienvenido de vuelta"
      subtitle="Accede a tu cuenta de Fidelita y gestiona tus beneficios"
    >
      <div className="space-y-6">
        <AuthForm
          schema={loginSchema}
          onSubmit={handleLogin}
          fields={loginFields}
          submitText="Iniciar sesión"
        />

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <button
              type="button"
              onClick={() => setShowResetPassword(!showResetPassword)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </motion.div>

          {showResetPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-indigo-50 border border-indigo-200 rounded-xl p-4"
            >
              <p className="text-sm text-indigo-700 text-center">
                Enviaremos un enlace de recuperación a tu correo electrónico.
              </p>
            </motion.div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">¿No tienes cuenta?</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center w-full h-12 px-6 text-sm font-semibold text-indigo-600 bg-indigo-50 border-2 border-indigo-200 rounded-xl hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 tracking-wide uppercase"
            >
              Crear cuenta nueva
            </Link>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
}