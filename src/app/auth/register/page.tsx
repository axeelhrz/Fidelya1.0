'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const roles = [
    {
      id: 'asociacion',
      title: 'Asociación',
      description: 'Gestiona programas de fidelidad y conecta con múltiples comercios',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18"/>
          <path d="M5 21V7l8-4v18"/>
          <path d="M19 21V11l-6-4"/>
        </svg>
      ),
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      href: '/auth/register/asociacion',
    },
    {
      id: 'socio',
      title: 'Socio',
      description: 'Accede a beneficios exclusivos y descuentos especiales',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)',
      href: '/auth/register/socio',
    },
    {
      id: 'comercio',
      title: 'Comercio',
      description: 'Atrae y fideliza clientes con programas de recompensas',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
          <path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/>
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <path d="M8 11h8"/>
        </svg>
      ),
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      href: '/auth/register/comercio',
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
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
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
              top: '10%',
              left: '5%',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              opacity: '0.4'
            }}
          />
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(15px)',
              opacity: '0.3',
              animationDelay: '2s'
            }}
          />
        </div>

        {/* Botón de regreso */}
        <Link
          href="/"
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
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
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
            maxWidth: '500px',
            textAlign: 'center'
          }}
        >
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
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              textDecoration: 'none',
              fontSize: '2rem',
              fontWeight: '900',
              marginBottom: '2rem',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              letterSpacing: '-0.02em',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)';
            }}
          >
            F
          </Link>

          {/* Título principal */}
          <h1
            className="font-playfair"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: '700',
              fontStyle: 'italic',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 60%, #6366f1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Únete a{' '}
            </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Fidelya
            </span>
          </h1>

          {/* Subtítulo */}
          <p
            className="font-inter"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              color: '#64748b',
              marginBottom: '3rem',
              lineHeight: '1.6',
              fontWeight: '500',
              maxWidth: '400px',
              margin: '0 auto 3rem auto'
            }}
          >
            Selecciona tu perfil y comienza a disfrutar de beneficios únicos
          </p>

          {/* Tarjetas de roles */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.06)',
              padding: '2rem',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {roles.map((role, index) => (
                <Link
                  key={role.id}
                  href={role.href}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    animationDelay: `${index * 0.1}s`
                  }}
                  className="animate-fade-in-up"
                  onMouseEnter={() => setHoveredCard(role.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      border: `2px solid ${hoveredCard === role.id ? role.color : '#f1f5f9'}`,
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: hoveredCard === role.id ? 'translateY(-4px)' : 'translateY(0)',
                      boxShadow: hoveredCard === role.id 
                        ? `0 12px 40px ${role.color}33` 
                        : '0 2px 10px rgba(0, 0, 0, 0.04)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Barra superior de color */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '3px',
                        background: `linear-gradient(90deg, ${role.color}, ${role.color}99)`,
                        opacity: hoveredCard === role.id ? '1' : '0',
                        transition: 'opacity 0.3s ease'
                      }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Icono */}
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          backgroundColor: role.bgColor,
                          color: role.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: '0',
                          transition: 'all 0.3s ease',
                          transform: hoveredCard === role.id ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        {role.icon}
                      </div>

                      {/* Contenido */}
                      <div style={{ flex: '1', textAlign: 'left' }}>
                        <h3
                          className="font-inter"
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.01em'
                          }}
                        >
                          {role.title}
                        </h3>
                        <p
                          className="font-inter"
                          style={{
                            fontSize: '0.9rem',
                            color: '#64748b',
                            lineHeight: '1.5',
                            fontWeight: '500'
                          }}
                        >
                          {role.description}
                        </p>
                      </div>

                      {/* Flecha */}
                      <div
                        style={{
                          color: hoveredCard === role.id ? role.color : '#cbd5e1',
                          transition: 'all 0.3s ease',
                          transform: hoveredCard === role.id ? 'translateX(4px)' : 'translateX(0)'
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14"/>
                          <path d="M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '2rem 0' }}>
              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'white',
                  padding: '0 1rem'
                }}
              >
                <span
                  className="font-inter"
                  style={{
                    color: '#94a3b8',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    letterSpacing: '0.02em'
                  }}
                >
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            {/* Botón de login */}
            <Link
              href="/auth/login"
              className="font-inter"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#475569',
                textDecoration: 'none',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                backgroundColor: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.color = '#6366f1';
                e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.03)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10,17 15,12 10,7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;