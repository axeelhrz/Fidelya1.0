'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { signIn, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, ArrowRight, Shield, CheckCircle2, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
        {/* Login Form */}
        <AuthForm
          schema={loginSchema}
          onSubmit={handleLogin}
          fields={loginFields}
          submitText="Iniciar sesión"
        />

        {/* Forgot Password */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForgotPassword(!showForgotPassword)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            ¿Olvidaste tu contraseña?
          </button>

          {showForgotPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-indigo-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-indigo-900 mb-1">
                    Recuperación segura
                  </h4>
                  <p className="text-sm text-indigo-700">
                    Enviaremos un enlace de recuperación a tu correo electrónico registrado.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">
              ¿No tienes cuenta?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <Link
          href="/auth/register"
          className="w-full flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-indigo-600 bg-indigo-50 border-2 border-indigo-200 rounded-xl hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
        >
          Crear cuenta nueva
          <ArrowRight size={16} />
        </Link>

        {/* Security Features */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield size={16} className="text-indigo-600" />
              <span className="font-medium">SSL Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="font-medium">Verificado</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Zap size={16} className="text-yellow-600" />
              <span className="font-medium">Acceso rápido</span>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}