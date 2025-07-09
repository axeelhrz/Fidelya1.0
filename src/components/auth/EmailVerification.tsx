import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useEmailVerification } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface EmailVerificationProps {
  onBack?: () => void;
  email?: string;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  onBack, 
  email: propEmail 
}) => {
  const { email, resendVerification } = useEmailVerification();
  const [isResending, setIsResending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);

  const displayEmail = propEmail || email;

  const handleResendVerification = async () => {
    if (isResending) return;

    setIsResending(true);
    try {
      const response = await resendVerification();
      
      if (response.success) {
        setLastSent(new Date());
        toast.success('Email de verificación enviado');
      } else {
        toast.error(response.error || 'Error al enviar email');
      }
    } catch {
      toast.error('Error al enviar email de verificación');
    } finally {
      setIsResending(false);
    }
  };

  const canResend = !lastSent || (Date.now() - lastSent.getTime()) > 60000; // 1 minute

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Back Button */}
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="mb-6 inline-flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
          </motion.button>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail size={32} className="text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifica tu email
            </h1>
            
            <p className="text-gray-600 leading-relaxed">
              Hemos enviado un enlace de verificación a tu correo electrónico. 
              Haz clic en el enlace para activar tu cuenta.
            </p>
          </div>

          {/* Email Display */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Mail size={16} className="text-gray-400" />
              <span className="text-gray-700 font-medium">{displayEmail}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600">
                Revisa tu bandeja de entrada y la carpeta de spam
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600">
                Haz clic en el enlace &quot;Verificar email&quot; en el mensaje
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600">
                Regresa aquí e inicia sesión con tu cuenta verificada
              </p>
            </div>
          </div>

          {/* Resend Button */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-4">
              ¿No recibiste el email?
            </p>
            
            <button
              onClick={handleResendVerification}
              disabled={isResending || !canResend}
              className={`
                inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                ${canResend && !isResending
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isResending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Mail size={16} />
                  <span>Reenviar email</span>
                </>
              )}
            </button>
            
            {!canResend && lastSent && (
              <p className="text-xs text-gray-500 mt-2">
                Puedes reenviar en {60 - Math.floor((Date.now() - lastSent.getTime()) / 1000)} segundos
              </p>
            )}
          </div>

          {/* Success/Error States */}
          {lastSent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3"
            >
              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium text-sm">Email enviado</p>
                <p className="text-green-600 text-xs">
                  Revisa tu bandeja de entrada
                </p>
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium text-sm mb-1">
                  ¿Problemas con la verificación?
                </p>
                <p className="text-amber-700 text-xs">
                  Contacta a soporte en soporte@fidelya.com si no recibes el email después de varios intentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};