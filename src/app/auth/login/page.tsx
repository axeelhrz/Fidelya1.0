'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { signIn, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, ArrowRight, Shield, CheckCircle2, Zap, Key, User, Sparkles } from 'lucide-react';

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
      subtitle="Accede a tu cuenta de Fidelita y gestiona tus beneficios de manera profesional"
    >
      <div className="space-y-8">
        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AuthForm
            schema={loginSchema}
            onSubmit={handleLogin}
            fields={loginFields}
            submitText="Iniciar sesión"
          />
        </motion.div>

        {/* Forgot Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <motion.button
            type="button"
            onClick={() => setShowForgotPassword(!showForgotPassword)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-indigo-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ¿Olvidaste tu contraseña?
          </motion.button>

          <AnimatePresence>
            {showForgotPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 overflow-hidden"
              >
                <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-2xl p-6">
                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles size={16} className="text-indigo-400" />
                    </motion.div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Key size={20} className="text-white" />
                    </motion.div>
                    <div className="text-left">
                      <h4 className="text-base font-black text-indigo-900 mb-2 tracking-tight">
                        Recuperación Segura
                      </h4>
                      <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                        Enviaremos un enlace de recuperación a tu correo electrónico registrado para que puedas restablecer tu contraseña de forma segura.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Elegant Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 py-2 bg-white/80 backdrop-blur-sm text-sm font-bold text-slate-600 rounded-full border border-slate-200 shadow-lg">
              ¿No tienes cuenta?
            </span>
          </div>
        </motion.div>

        {/* Register Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/auth/register" className="block">
            <motion.div
              className="relative group w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
              
              <div className="relative flex items-center justify-center gap-3 w-full px-8 py-4 text-sm font-bold text-slate-700 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-2xl hover:bg-white/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 shadow-lg">
                <User size={20} />
                <span className="tracking-wide uppercase">Crear cuenta nueva</span>
                <ArrowRight size={20} />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 border-2 border-slate-200 rounded-2xl p-6 shadow-lg"
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-3xl opacity-50" />
          
          <div className="relative flex items-center justify-center gap-8 text-sm">
            <motion.div 
              className="flex items-center gap-2 text-slate-600"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-bold">SSL Seguro</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-slate-600"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 size={16} className="text-white" />
              </div>
              <span className="font-bold">Verificado</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-slate-600"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold">Acceso Rápido</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
}