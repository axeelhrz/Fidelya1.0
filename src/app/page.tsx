'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const HomePage = () => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const fullText = 'Fidelya';

  useEffect(() => {
    // Animación de aparición inicial
    setTimeout(() => setIsVisible(true), 200);

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowCursor(false);
        }, 1500);
      }
    }, 250);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        
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
        
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .typewriter-cursor {
          animation: blink 1.2s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes floatDelay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: floatDelay 8s ease-in-out infinite 2s;
        }

        .animate-float-delay-long {
          animation: float 10s ease-in-out infinite 4s;
        }

        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 25%, #e0e7ff 75%, #f1f5f9 100%)',
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
          {/* Gradientes flotantes principales */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '15%',
              left: '-10%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.05) 50%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              opacity: '0.6'
            }}
          />
          <div
            className="animate-float-delay"
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '-10%',
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(165, 180, 252, 0.04) 50%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(35px)',
              opacity: '0.5'
            }}
          />
          <div
            className="animate-float-delay-long"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(56, 189, 248, 0.03) 50%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(50px)',
              opacity: '0.4'
            }}
          />

          {/* Grid pattern sutil */}
          <div
            style={{
              position: 'absolute',
              inset: '0',
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)',
              backgroundSize: '30px 30px',
              opacity: '0.3'
            }}
          />

          {/* Partículas flotantes decorativas */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
              opacity: '0.6'
            }}
          />
          <div
            className="animate-float-delay"
            style={{
              position: 'absolute',
              top: '35%',
              right: '20%',
              width: '6px',
              height: '6px',
              background: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
              borderRadius: '50%',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
              opacity: '0.5'
            }}
          />
          <div
            className="animate-float-delay-long"
            style={{
              position: 'absolute',
              bottom: '25%',
              left: '25%',
              width: '10px',
              height: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              borderRadius: '50%',
              boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)',
              opacity: '0.7'
            }}
          />
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '15%',
              width: '12px',
              height: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
              opacity: '0.4'
            }}
          />
        </div>

        {/* Contenido principal */}
        <div
          style={{
            position: 'relative',
            zIndex: '10',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            transition: 'all 1s ease-out',
            opacity: isVisible ? '1' : '0',
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)'
          }}
        >
          <div
            style={{
              maxWidth: '1536px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            {/* Logo/Título principal */}
            <div style={{ marginBottom: '3rem' }}>
              <h1
                className="font-jakarta"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  fontWeight: '900',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.025em',
                  lineHeight: '1'
                }}
              >
                <span
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #6366f1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                >
                  {displayText}
                </span>
                {showCursor && (
                  <span
                    className="typewriter-cursor"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    |
                  </span>
                )}
              </h1>
            </div>

            {/* Contenido que aparece después del typing */}
            <div
              style={{
                transition: 'all 1s ease-out 1s',
                opacity: displayText === fullText ? '1' : '0',
                transform: displayText === fullText ? 'translateY(0)' : 'translateY(24px)'
              }}
            >
              {/* Subtítulo principal */}
              <div style={{ marginBottom: '4rem' }}>
                <h2
                  className="font-jakarta"
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    fontWeight: '700',
                    color: '#334155',
                    marginBottom: '2rem',
                    lineHeight: '1.2'
                  }}
                >
                  El futuro de los programas de{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    fidelidad
                  </span>
                </h2>

                <p
                  className="font-inter"
                  style={{
                    fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                    color: '#64748b',
                    maxWidth: '1280px',
                    margin: '0 auto 1rem auto',
                    lineHeight: '1.7',
                    fontWeight: '500'
                  }}
                >
                  Conecta asociaciones, comercios y socios en un ecosistema inteligente
                  potenciado por IA para maximizar la fidelización y el crecimiento.
                </p>
              </div>

              {/* Botones de acción */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '4rem'
                }}
              >
                <Link
                  href="/auth/register"
                  className="font-jakarta"
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem 2.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    minWidth: '280px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)';
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    Comenzar Gratis
                    <svg
                      style={{
                        marginLeft: '0.75rem',
                        width: '1.5rem',
                        height: '1.5rem',
                        transition: 'transform 0.3s ease'
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(8px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>

                  {/* Efecto shimmer */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '0',
                      top: '-2px',
                      bottom: '-2px',
                      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
                      transform: 'translateX(-100%) skewX(12deg)',
                      transition: 'transform 1s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(100%) skewX(12deg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(-100%) skewX(12deg)';
                    }}
                  />
                </Link>

                <Link
                  href="/auth/login"
                  className="font-jakarta"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem 2.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#475569',
                    textDecoration: 'none',
                    borderRadius: '1rem',
                    border: '2px solid rgba(226, 232, 240, 0.8)',
                    cursor: 'pointer',
                    minWidth: '280px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    Ya tengo cuenta
                    <svg
                      style={{
                        marginLeft: '0.75rem',
                        width: '1.5rem',
                        height: '1.5rem',
                        transition: 'transform 0.3s ease'
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(8px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Indicadores de confianza */}
              <div
                className="font-inter"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#64748b'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="animate-pulse-slow"
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                    }}
                  />
                  <span>100% Seguro</span>
                </div>
                <div style={{ width: '1px', height: '1.5rem', backgroundColor: '#cbd5e1' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg
                    style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div style={{ width: '1px', height: '1.5rem', backgroundColor: '#cbd5e1' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg
                    style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Configuración en 5 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-bounce-slow"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <div
            style={{
              width: '2rem',
              height: '2.5rem',
              border: '2px solid #94a3b8',
              borderRadius: '9999px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div
              className="animate-pulse-slow"
              style={{
                width: '0.375rem',
                height: '0.75rem',
                backgroundColor: '#64748b',
                borderRadius: '9999px',
                marginTop: '0.5rem'
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;