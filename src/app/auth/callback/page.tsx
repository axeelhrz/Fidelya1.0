"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Utensils,
  ArrowRight
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const supabase = supabaseBrowser();
        
        // Obtener los parámetros de la URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (!token_hash || type !== 'email') {
          setStatus('error');
          setMessage('Enlace de verificación inválido');
          return;
        }

        // Verificar el token de email
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email'
        });

        if (error) {
          console.error('Error de verificación:', error);
          
          if (error.message.includes('expired')) {
            setStatus('expired');
            setMessage('El enlace de verificación ha expirado');
          } else if (error.message.includes('invalid')) {
            setStatus('error');
            setMessage('El enlace de verificación es inválido');
          } else {
            setStatus('error');
            setMessage(error.message || 'Error al verificar el correo electrónico');
          }
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('¡Correo verificado exitosamente!');
          
          // Redirigir al dashboard después de 3 segundos
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('No se pudo verificar el correo electrónico');
        }
      } catch (error: any) {
        console.error('Error inesperado:', error);
        setStatus('error');
        setMessage('Ocurrió un error inesperado');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Loader2 style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite' }} />,
          title: 'Verificando correo...',
          description: 'Por favor espera mientras verificamos tu correo electrónico',
          bgColor: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
          iconBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          iconColor: 'white'
        };
      case 'success':
        return {
          icon: <CheckCircle style={{ width: '48px', height: '48px' }} />,
          title: '¡Verificación exitosa!',
          description: 'Tu correo ha sido verificado correctamente. Serás redirigido al dashboard en unos segundos.',
          bgColor: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          iconBg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          iconColor: 'white'
        };
      case 'expired':
        return {
          icon: <AlertCircle style={{ width: '48px', height: '48px' }} />,
          title: 'Enlace expirado',
          description: 'El enlace de verificación ha expirado. Solicita un nuevo enlace de verificación.',
          bgColor: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
          iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          iconColor: 'white'
        };
      case 'error':
        return {
          icon: <AlertCircle style={{ width: '48px', height: '48px' }} />,
          title: 'Error de verificación',
          description: 'No se pudo verificar tu correo electrónico. Intenta nuevamente o contacta soporte.',
          bgColor: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          iconBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          iconColor: 'white'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={{
      minHeight: '100vh',
      background: config.bgColor,
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
          background: 'rgba(220, 38, 38, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-160px',
          left: '-160px',
          width: '320px',
          height: '320px',
          background: 'rgba(251, 191, 36, 0.1)',
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
          style={{ padding: '40px', textAlign: 'center' }}
        >
          {/* Icono de estado */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '96px',
              height: '96px',
              background: config.iconBg,
              borderRadius: '24px',
              marginBottom: '32px',
              color: config.iconColor
            }}
          >
            {config.icon}
          </motion.div>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--foreground)',
              marginBottom: '16px'
            }}>
              {config.title}
            </h2>
            
            <p style={{
              color: 'var(--muted-foreground)',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              {config.description}
            </p>

            {message && (
              <div style={{
                background: 'var(--muted)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                marginBottom: '24px'
              }}>
                <p style={{
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {message}
                </p>
              </div>
            )}
          </motion.div>

          {/* Acciones según el estado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {status === 'success' && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                marginBottom: '24px'
              }}>
                <p style={{
                  color: '#15803d',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Redirigiendo automáticamente...
                </p>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#bbf7d0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "linear" }}
                    style={{
                      height: '100%',
                      background: '#22c55e',
                      borderRadius: '2px'
                    }}
                  />
                </div>
              </div>
            )}

            {(status === 'error' || status === 'expired') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  href="/auth/register"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '14px 24px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Solicitar nuevo enlace
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </Link>
                
                <Link
                  href="/auth/login"
                  style={{
                    color: 'var(--muted-foreground)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.2s ease'
                  }}
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            )}

            {status === 'loading' && (
              <div style={{
                background: 'var(--muted)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <p style={{
                  color: 'var(--muted-foreground)',
                  fontSize: '14px'
                }}>
                  Este proceso puede tomar unos segundos...
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
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
