'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { signIn, resetPassword, getDashboardRoute } from '@/lib/auth';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Shield, 
  CheckCircle2, 
  Zap, 
  Key, 
  User, 
  Sparkles,
  AlertCircle,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    try {
      const userData = await signIn(data.email, data.password);
      
      if (userData.estado === 'inactivo') {
        throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
      }

      toast.success(`¡Bienvenido, ${userData.nombre}!`);
      
      const dashboardRoute = getDashboardRoute(userData.role);
      router.push(dashboardRoute);
    } catch (error: any) {
      // El error se maneja en AuthForm
      throw error;
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast.error('Ingresa tu email para recuperar la contraseña');
      return;
    }

    if (!resetEmail.includes('@')) {
      toast.error('Ingresa un email válido');
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(resetEmail);
      toast.success('Enlace de recuperación enviado a tu email');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        toast.error('No existe una cuenta con este email');
      } else {
        toast.error('Error al enviar el enlace de recuperación');
      }
    } finally {
      setIsResetting(false);
    }
  };

  const loginFields: { name: "email" | "password"; label: string; type: string; icon?: React.ReactNode; placeholder?: string }[] = [
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      icon: <Mail size={16} />,
      placeholder: "tu@email.com"
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      icon: <Lock size={16} />,
      placeholder: "Tu contraseña"
    }
  ];

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Accede a tu cuenta de Fidelita y gestiona tu programa de fidelidad"
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
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-indigo-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
                <div className="relative bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
                  {/* Decorative Elements */}
                  <div className="absolute top-3 right-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles size={16} className="text-indigo-400" />
                    </motion.div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Key size={20} className="text-white" />
                      </motion.div>
                      <div className="text-left flex-1">
                        <h4 className="text-lg font-bold text-indigo-900 mb-2">
                          Recuperar Contraseña
                        </h4>
                        <p className="text-sm text-indigo-700 mb-4">
                          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                        </p>
                        
                        <div className="space-y-3">
                          <Input
                            type="email"
                            placeholder="tu@email.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            icon={<Mail size={16} />}
                            className="text-sm"
                          />
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={handlePasswordReset}
                              loading={isResetting}
                              disabled={isResetting || !resetEmail}
                              size="sm"
                              leftIcon={<Send size={14} />}
                              className="flex-1"
                            >
                              Enviar enlace
                            </Button>
                            <Button
                              onClick={() => {
                                setShowForgotPassword(false);
                                setResetEmail('');
                              }}
                              variant="outline"
                              size="sm"
                              className="px-4"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
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
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 py-2 bg-white text-sm font-medium text-gray-500 rounded-full">
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
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
              
              <div className="relative flex items-center justify-center gap-3 w-full px-8 py-4 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 shadow-sm">
                <User size={20} />
                <span className="tracking-wide">Crear cuenta nueva</span>
                <ArrowRight size={20} />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Access Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-green-700">Seguro</span>
          </motion.div>
          
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
              <CheckCircle2 size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-700">Confiable</span>
          </motion.div>
          
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-yellow-700">Rápido</span>
          </motion.div>
        </motion.div>

        {/* Demo Accounts Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
              <AlertCircle size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                Cuentas de Demostración
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Asociación:</strong> asociacion@demo.com / demo123</p>
                <p><strong>Comercio:</strong> comercio@demo.com / demo123</p>
                <p><strong>Socio:</strong> socio@demo.com / demo123</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
