"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  ArrowLeft,
  Utensils,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Timer para el cooldown de reenvío
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResendEmail = async () => {
    if (!email || !canResend || isResending) return;

    setIsResending(true);
    setResendStatus('idle');
    setResendMessage('');

    try {
      const supabase = supabaseBrowser();
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      setResendStatus('success');
      setResendMessage('Correo reenviado exitosamente');
      setCanResend(false);
      setTimeLeft(60); // 60 segundos de cooldown
    } catch (error: any) {
      setResendStatus('error');
      if (error.message.includes('Email rate limit exceeded')) {
        setResendMessage('Has enviado demasiados correos. Espera unos minutos antes de intentar nuevamente.');
        setTimeLeft(300); // 5 minutos de cooldown
        setCanResend(false);
      } else {
        setResendMessage(error.message || 'Error al reenviar el correo');
      }
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 50%, #fefce8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative'
    }}>
      {/* Elementos decorativos de fondo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-160px',
          right: '-160px',
          width: '320px',
          height: '320px',
          background: 'rgba(220, 38, 38, 0.15)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-160px',
          left: '-160px',
          width: '320px',
          height: '320px',
          background: 'rgba(251, 191, 36, 0.15)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Header con logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="casino-gradient"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Utensils style={{ width: '32px', height: '32px', color: 'white' }} />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-heading"
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'var(--foreground)',
              marginBottom: '8px'
            }}
          >
            Casino Escolar
          </motion.h1>
        </div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="modern-card"
          style={{ padding: '40px' }}
        >
          {/* Icono de email animado */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                borderRadius: '20px',
                marginBottom: '24px',
                position: 'relative'
              }}
            >
              <Mail style={{ width: '40px', height: '40px', color: 'var(--primary)' }} />
              
              {/* Indicador de animación */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  inset: '-8px',
                  border: '2px solid var(--primary)',
                  borderRadius: '24px',
                  opacity: 0.3
                }}
              />
            </motion.div>
          </div>

          {/* Contenido principal */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--foreground)',
                marginBottom: '16px'
              }}
            >
              Verifica tu correo electrónico
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ marginBottom: '24px' }}
            >
              <p style={{ 
                color: 'var(--muted-foreground)', 
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '12px'
              }}>
                Hemos enviado un enlace de verificación a:
              </p>
              
              {email && (
                <div style={{
                  background: 'var(--muted)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  display: 'inline-block'
                }}>
                  <p style={{ 
                    color: 'var(--foreground)', 
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'monospace'
                  }}>
                    {email}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ 
                color: 'var(--muted-foreground)', 
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              Haz clic en el enlace del correo para activar tu cuenta y comenzar a usar Casino Escolar.
            </motion.p>
          </div>

          {/* Instrucciones paso a paso */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{ marginBottom: '32px' }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #fde68a'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#92400e',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock style={{ width: '18px', height: '18px' }} />
                Próximos pasos:
              </h3>
              
              <ol style={{ 
                color: '#92400e', 
                fontSize: '14px',
                lineHeight: '1.6',
                paddingLeft: '20px'
              }}>
                <li style={{ marginBottom: '4px' }}>Revisa tu bandeja de entrada</li>
                <li style={{ marginBottom: '4px' }}>Busca el correo de Casino Escolar</li>
                <li style={{ marginBottom: '4px' }}>Haz clic en "Verificar cuenta"</li>
                <li>¡Listo! Ya puedes iniciar sesión</li>
              </ol>
            </div>
          </motion.div>

          {/* Mensajes de estado del reenvío */}
          <AnimatePresence>
            {resendStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-green-50 border-green-200"
                style={{
                  border: '1px solid',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle className="text-green-500" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <p className="text-green-700" style={{ fontSize: '14px' }}>{resendMessage}</p>
                </div>
              </motion.div>
            )}

            {resendStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border-red-200"
                style={{
                  border: '1px solid',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertCircle className="text-red-500" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <p className="text-red-700" style={{ fontSize: '14px' }}>{resendMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón de reenvío */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            style={{ marginBottom: '24px' }}
          >
            <button
              onClick={handleResendEmail}
              disabled={!canResend || isResending || !email}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: canResend && !isResending ? 'var(--card)' : 'var(--muted)',
                color: canResend && !isResending ? 'var(--foreground)' : 'var(--muted-foreground)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: canResend && !isResending ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <AnimatePresence mode="wait">
                {isResending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                    Reenviando...
                  </motion.div>
                ) : !canResend ? (
                  <motion.div
                    key="cooldown"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Clock style={{ width: '18px', height: '18px' }} />
                    Reenviar en {formatTime(timeLeft)}
                  </motion.div>
                ) : (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <RefreshCw style={{ width: '18px', height: '18px' }} />
                    Reenviar correo de verificación
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* Enlaces de navegación */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              alignItems: 'center'
            }}
          >
            <Link 
              href="/auth/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'opacity 0.2s ease'
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Volver al inicio de sesión
            </Link>
            
            <p style={{ 
              fontSize: '12px', 
              color: 'var(--muted-foreground)',
              textAlign: 'center'
            }}>
              ¿No recibiste el correo? Revisa tu carpeta de spam o correo no deseado
            </p>
          </motion.div>
        </motion.div>

        {/* Footer de seguridad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ marginTop: '24px', textAlign: 'center' }}
        >
          <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
            🔒 Verificación segura • Casino Escolar
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}