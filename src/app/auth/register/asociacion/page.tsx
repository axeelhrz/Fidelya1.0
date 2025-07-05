'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { asociacionRegisterSchema, type AsociacionRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';

const AsociacionRegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AsociacionRegisterFormData>({
    resolver: zodResolver(asociacionRegisterSchema),
  });

  const handleRegister = async (data: AsociacionRegisterFormData) => {
    try {
      setIsSubmitting(true);
      const userData = await createUser(data.email, data.password, {
        nombre: data.nombre,
        email: data.email,
        role: 'asociacion',
        estado: 'activo',
      });
      
      const dashboardRoute = getDashboardRoute(userData.role);
      router.push(dashboardRoute);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error. Inténtalo de nuevo.';
      setError('root', {
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <path d="M20 8v6"/>
          <path d="M23 11h-6"/>
        </svg>
      ), 
      text: 'Gestión centralizada' 
    },
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
          <path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/>
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <path d="M8 11h8"/>
        </svg>
      ), 
      text: 'Múltiples comercios' 
    },
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
        </svg>
      ), 
      text: 'Reportes avanzados' 
    },
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
          <path d="M13 12h3"/>
          <path d="M8 12H5"/>
        </svg>
      ), 
      text: 'Soporte especializado' 
    },
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .font-playfair {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f9ff 30%, #eff6ff 70%, #f8fafc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Elementos decorativos de fondo */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '15%',
              left: '8%',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              opacity: '0.6'
            }}
          />
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '12%',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(15px)',
              opacity: '0.4',
              animationDelay: '2s'
            }}
          />
        </div>

        {/* Botón de regreso */}
        <Link
          href="/auth/register"
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            textDecoration: 'none',
            color: '#475569',
            transition: 'all 0.3s ease',
            zIndex: '10'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
        </Link>

        {/* Contenido principal */}
        <div
          className="animate-fade-in-up"
          style={{
            position: 'relative',
            zIndex: '5',
            width: '100%',
            maxWidth: '500px'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '2rem',
                fontWeight: '900',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
                letterSpacing: '-0.02em',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(14, 165, 233, 0.3)';
              }}
            >
              F
            </Link>

            {/* Badge de organización */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                marginBottom: '1.5rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'linear-gradient(90deg, #0ea5e9, #3b82f6)'
                }}
              />
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(14, 165, 233, 0.15)',
                  color: '#0ea5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4v18"/>
                  <path d="M19 21V11l-6-4"/>
                </svg>
              </div>
              <div>
                <div
                  className="font-inter"
                  style={{
                    fontWeight: '700',
                    color: '#0ea5e9',
                    fontSize: '0.85rem',
                    lineHeight: '1.2'
                  }}
                >
                  Cuenta Asociación
                </div>
                <div
                  className="font-inter"
                  style={{
                    color: 'rgba(14, 165, 233, 0.8)',
                    fontSize: '0.7rem',
                    fontWeight: '500'
                  }}
                >
                  Para organizaciones
                </div>
              </div>
            </div>

            {/* Título */}
            <h1
              className="font-playfair"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 2.8rem)',
                fontWeight: '700',
                fontStyle: 'italic',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Crear Cuenta
              </span>
            </h1>

            {/* Subtítulo */}
            <p
              className="font-inter"
              style={{
                fontSize: '1rem',
                color: '#64748b',
                lineHeight: '1.5',
                fontWeight: '500',
                maxWidth: '420px',
                margin: '0 auto'
              }}
            >
              Gestiona programas de fidelidad para tu organización y conecta múltiples comercios
            </p>
          </div>

          {/* Formulario */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.06)',
              padding: '2rem',
              overflow: 'hidden'
            }}
          >
            {/* Sección de características */}
            <div
              style={{
                backgroundColor: 'rgba(14, 165, 233, 0.05)',
                border: '1px solid rgba(14, 165, 233, 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'linear-gradient(90deg, #0ea5e9, #3b82f6)'
                }}
              />
              <h3
                className="font-inter"
                style={{
                  fontWeight: '700',
                  color: '#0ea5e9',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  fontSize: '1rem'
                }}
              >
                Herramientas para organizaciones
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem'
                }}
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ color: '#0ea5e9', flexShrink: '0' }}>
                      {feature.icon}
                    </div>
                    <span
                      className="font-inter"
                      style={{
                        color: '#0ea5e9',
                        fontWeight: '600',
                        fontSize: '0.8rem'
                      }}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(handleRegister)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Información del responsable */}
                <div>
                  <h3
                    className="font-inter"
                    style={{
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '1rem',
                      fontSize: '1rem'
                    }}
                  >
                    Información del Responsable
                  </h3>
                  
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        zIndex: '2'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <input
                      {...register('nombre')}
                      type="text"
                      placeholder="Tu nombre completo"
                      style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        borderRadius: '12px',
                        border: `2px solid ${errors.nombre ? '#ef4444' : (focusedField === 'nombre' ? '#0ea5e9' : '#e2e8f0')}`,
                        backgroundColor: focusedField === 'nombre' ? 'white' : '#fafbfc',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onFocus={() => setFocusedField('nombre')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {errors.nombre && (
                      <p
                        className="font-inter"
                        style={{
                          color: '#ef4444',
                          fontSize: '0.8rem',
                          marginTop: '0.5rem',
                          fontWeight: '500'
                        }}
                      >
                        {errors.nombre.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Información de la organización */}
                <div>
                  <h3
                    className="font-inter"
                    style={{
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '1rem',
                      fontSize: '1rem'
                    }}
                  >
                    Información de la Organización
                  </h3>
                  
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        zIndex: '2'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18"/>
                        <path d="M5 21V7l8-4v18"/>
                        <path d="M19 21V11l-6-4"/>
                      </svg>
                    </div>
                    <input
                      {...register('nombreAsociacion')}
                      type="text"
                      placeholder="Nombre de tu asociación u organización"
                      style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        borderRadius: '12px',
                        border: `2px solid ${errors.nombreAsociacion ? '#ef4444' : (focusedField === 'nombreAsociacion' ? '#0ea5e9' : '#e2e8f0')}`,
                        backgroundColor: focusedField === 'nombreAsociacion' ? 'white' : '#fafbfc',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onFocus={() => setFocusedField('nombreAsociacion')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {errors.nombreAsociacion && (
                      <p
                        className="font-inter"
                        style={{
                          color: '#ef4444',
                          fontSize: '0.8rem',
                          marginTop: '0.5rem',
                          fontWeight: '500'
                        }}
                      >
                        {errors.nombreAsociacion.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Información de la cuenta */}
                <div>
                  <h3
                    className="font-inter"
                    style={{
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '1rem',
                      fontSize: '1rem'
                    }}
                  >
                    Información de la Cuenta
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Email */}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#94a3b8',
                          zIndex: '2'
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="tu@email.com"
                        style={{
                          width: '100%',
                          padding: '1rem 1rem 1rem 3rem',
                          borderRadius: '12px',
                          border: `2px solid ${errors.email ? '#ef4444' : (focusedField === 'email' ? '#0ea5e9' : '#e2e8f0')}`,
                          backgroundColor: focusedField === 'email' ? 'white' : '#fafbfc',
                          fontSize: '1rem',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                      {errors.email && (
                        <p
                          className="font-inter"
                          style={{
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            marginTop: '0.5rem',
                            fontWeight: '500'
                          }}
                        >
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#94a3b8',
                          zIndex: '2'
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <circle cx="12" cy="16" r="1"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        style={{
                          width: '100%',
                          padding: '1rem 3rem 1rem 3rem',
                          borderRadius: '12px',
                          border: `2px solid ${errors.password ? '#ef4444' : (focusedField === 'password' ? '#0ea5e9' : '#e2e8f0')}`,
                          backgroundColor: focusedField === 'password' ? 'white' : '#fafbfc',
                          fontSize: '1rem',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <path d="M1 1l22 22"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                      {errors.password && (
                        <p
                          className="font-inter"
                          style={{
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            marginTop: '0.5rem',
                            fontWeight: '500'
                          }}
                        >
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#94a3b8',
                          zIndex: '2'
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <circle cx="12" cy="16" r="1"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirma tu contraseña"
                        style={{
                          width: '100%',
                          padding: '1rem 3rem 1rem 3rem',
                          borderRadius: '12px',
                          border: `2px solid ${errors.confirmPassword ? '#ef4444' : (focusedField === 'confirmPassword' ? '#0ea5e9' : '#e2e8f0')}`,
                          backgroundColor: focusedField === 'confirmPassword' ? 'white' : '#fafbfc',
                          fontSize: '1rem',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {showConfirmPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <path d="M1 1l22 22"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                      {errors.confirmPassword && (
                        <p
                          className="font-inter"
                          style={{
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            marginTop: '0.5rem',
                            fontWeight: '500'
                          }}
                        >
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Alert */}
                {errors.root && (
                  <div
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '12px',
                      padding: '1rem',
                      color: '#ef4444'
                    }}
                  >
                    <p className="font-inter" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      {errors.root.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-inter"
                  style={{
                    width: '100%',
                    padding: '1.2rem',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    background: isSubmitting 
                      ? '#e2e8f0' 
                      : 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                    boxShadow: isSubmitting 
                      ? 'none' 
                      : '0 8px 32px rgba(14, 165, 233, 0.3)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(14, 165, 233, 0.3)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #94a3b8',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear cuenta
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                        <path d="M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                  <p className="font-inter" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link
                      href="/auth/login"
                      style={{
                        color: '#0ea5e9',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      Iniciar sesión
                    </Link>
                  </p>
                </div>

                {/* Enterprise Note */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    marginTop: '1rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </div>
                  <p
                    className="font-inter"
                    style={{
                      color: '#64748b',
                      fontSize: '0.85rem',
                      lineHeight: '1.4'
                    }}
                  >
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>
                      Solución empresarial:
                    </span>{' '}
                    Herramientas avanzadas para gestionar múltiples comercios y programas de fidelidad.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Animación de spin para el loading */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};

export default AsociacionRegisterPage;
