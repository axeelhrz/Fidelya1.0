'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      const targetPath = user.role === 'admin' ? '/dashboard/ceo' : '/dashboard/sessions';
      router.push(targetPath);
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      
      if (success) {
        console.log('Login successful');
      } else {
        setError('Credenciales incorrectas. Use: admin / admin123');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si está cargando la autenticación inicial o si ya está autenticado
  if (authLoading || (!authLoading && user)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid rgba(226, 232, 240, 0.5)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #2563eb',
              borderRadius: '50%',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            fontFamily: 'Inter, sans-serif',
            margin: 0
          }}>
            {authLoading ? 'Verificando sesión...' : 'Redirigiendo...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative'
    }}>
      {/* Efectos de fondo muy sutiles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)
        `
      }} />

      {/* Contenedor principal del formulario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '3rem 2.5rem',
          border: '1px solid rgba(226, 232, 240, 0.5)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Header minimalista */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.2)'
            }}
          >
            <Shield size={28} color="white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              marginBottom: '0.5rem',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Centro Psicológico
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Acceso al sistema de gestión
          </motion.p>
        </div>

        {/* Credenciales de demo */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: '1rem 1.25rem',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CheckCircle size={14} color="#059669" />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#059669',
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Demo
            </span>
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#475569',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.4
          }}>
            <div><strong>Usuario:</strong> admin</div>
            <div><strong>Contraseña:</strong> admin123</div>
          </div>
        </motion.div>

        {/* Formulario */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleLogin}
        >
          {/* Campo de usuario */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.875rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: isLoading ? '#f8fafc' : 'white',
                  opacity: isLoading ? 0.7 : 1,
                  color: '#1e293b'
                }}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.08)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.875rem 2.5rem 0.875rem 2.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.875rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: isLoading ? '#f8fafc' : 'white',
                  opacity: isLoading ? 0.7 : 1,
                  color: '#1e293b'
                }}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.08)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <motion.button
                type="button"
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                onClick={() => !isLoading && setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: isLoading ? '#cbd5e1' : '#94a3b8',
                  opacity: isLoading ? 0.5 : 1,
                  padding: '0.25rem',
                  borderRadius: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </motion.button>
            </div>
          </div>

          {/* Mensaje de error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                style={{
                  padding: '0.875rem 1rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.875rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <AlertCircle size={14} color="#dc2626" />
                <span style={{
                  fontSize: '0.8rem',
                  color: '#dc2626',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {error}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón de login */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.99 }}
            style={{
              width: '100%',
              padding: '1rem',
              background: isLoading 
                ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.875rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif',
              boxShadow: isLoading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.25)',
              letterSpacing: '0.025em'
            }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%'
                  }}
                />
                Verificando...
              </>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Footer minimalista */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '1rem',
            border: '1px solid #f1f5f9'
          }}
        >
          <p style={{
            fontSize: '0.75rem',
            color: '#64748b',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Shield size={12} />
            Conexión segura SSL/TLS
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}