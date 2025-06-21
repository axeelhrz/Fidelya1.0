'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Activity,
  Shield,
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validar credenciales
    if (email === 'admin' && password === 'admin123') {
      // Simular guardado de sesión
      localStorage.setItem('user', JSON.stringify({
        id: 'admin1',
        email: 'admin@centropsicologico.com',
        role: 'admin',
        centerId: 'center1',
        name: 'Dr. Carlos Mendoza'
      }));
      
      // Redirigir al dashboard
      router.push('/dashboard/ceo');
    } else {
      setError('Credenciales incorrectas. Use: admin / admin123');
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'IA Integrada',
      description: 'Análisis inteligente de sesiones y predicciones automáticas'
    },
    {
      icon: Shield,
      title: 'Seguridad Total',
      description: 'Protección de datos clínicos con estándares internacionales'
    },
    {
      icon: Zap,
      title: 'Automatización',
      description: 'Recordatorios, alertas y reportes completamente automatizados'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de fondo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
        `
      }} />

      {/* Partículas flotantes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Panel izquierdo - Información */}
      <div style={{
        flex: 1,
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo y título */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <Activity size={28} color="white" />
              </motion.div>
              <div>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: 'white',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Centro Psicológico
                </h1>
                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Plataforma de Gestión Inteligente
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Sparkles size={20} color="white" />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'white',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Dashboard Ejecutivo con IA
                </h3>
              </div>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Gestiona tu centro psicológico con inteligencia artificial integrada. 
                Análisis predictivos, automatizaciones inteligentes y insights en tiempo real.
              </p>
            </motion.div>
          </div>

          {/* Características */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.75rem'
                }}>
                  <feature.icon size={24} color="white" />
                </div>
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'white',
                    margin: 0,
                    marginBottom: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {feature.title}
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Información de tiempo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              marginTop: '3rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'white',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {currentTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'Inter, sans-serif'
            }}>
              {currentTime.toLocaleDateString('es-ES', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Panel derecho - Formulario de login */}
      <div style={{
        width: '480px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Header del formulario */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Shield size={36} color="white" />
            </motion.div>
            
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              marginBottom: '0.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Acceso Seguro
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Ingresa tus credenciales para acceder al dashboard
            </p>
          </div>

          {/* Credenciales de demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              padding: '1rem',
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '0.75rem',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={16} color="#2563EB" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1E40AF',
                fontFamily: 'Inter, sans-serif'
              }}>
                Credenciales de Demo
              </span>
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#1E40AF',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong>Usuario:</strong> admin<br />
              <strong>Contraseña:</strong> admin123
            </div>
          </motion.div>

          {/* Formulario */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Usuario
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF'
                }} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    padding: '0.75rem',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <AlertCircle size={16} color="#DC2626" />
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#DC2626',
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
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: '1rem',
                background: isLoading 
                  ? 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)'
                  : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%'
                    }}
                  />
                  Verificando credenciales...
                </>
              ) : (
                <>
                  Acceder al Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              textAlign: 'center',
              marginTop: '2rem',
              padding: '1rem',
              background: '#F9FAFB',
              borderRadius: '0.75rem'
            }}
          >
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              🔒 Conexión segura con cifrado SSL/TLS
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }
          .login-panel {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
