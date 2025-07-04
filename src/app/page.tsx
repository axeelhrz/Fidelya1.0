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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@400;500;600;700&display=swap');
        
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

        .typewriter-cursor {
          animation: blink 1.2s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes floatDelay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: floatDelay 7s ease-in-out infinite 2s;
        }

        .animate-float-delay-long {
          animation: float 8s ease-in-out infinite 3s;
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
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f9ff 30%, #eff6ff 70%, #f8fafc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '2rem 1rem'
        }}
      >
        {/* Elementos decorativos de fondo más sutiles */}
        <div
          style={{
            position: 'absolute',
            inset: '0',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          {/* Gradientes flotantes más pequeños */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(30px)',
              opacity: '0.4'
            }}
          />
          <div
            className="animate-float-delay"
            style={{
              position: 'absolute',
              bottom: '25%',
              right: '15%',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(25px)',
              opacity: '0.3'
            }}
          />

          {/* Partículas más pequeñas */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '30%',
              left: '20%',
              width: '4px',
              height: '4px',
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
              opacity: '0.5'
            }}
          />
          <div
            className="animate-float-delay"
            style={{
              position: 'absolute',
              top: '60%',
              right: '25%',
              width: '3px',
              height: '3px',
              background: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)',
              opacity: '0.4'
            }}
          />
        </div>

        {/* Contenido principal más compacto */}
        <div
          style={{
            position: 'relative',
            zIndex: '10',
            textAlign: 'center',
            maxWidth: '700px',
            width: '100%',
            transition: 'all 0.8s ease-out',
            opacity: isVisible ? '1' : '0',
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          {/* Logo/Título principal más compacto */}
          <div style={{ marginBottom: '2rem' }}>
            <h1
              className="font-playfair"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 5.5rem)',
                fontWeight: '700',
                fontStyle: 'italic',
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
                lineHeight: '0.9'
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
              transition: 'all 0.8s ease-out 0.8s',
              opacity: displayText === fullText ? '1' : '0',
              transform: displayText === fullText ? 'translateY(0)' : 'translateY(15px)'
            }}
          >
            {/* Subtítulo más compacto */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2
                className="font-inter"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '600',
                  color: '#334155',
                  marginBottom: '1.2rem',
                  lineHeight: '1.3'
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
                  fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                  color: '#64748b',
                  lineHeight: '1.6',
                  fontWeight: '400',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                Conecta asociaciones, comercios y socios en un ecosistema inteligente
                potenciado por IA para maximizar la fidelización y el crecimiento.
              </p>
            </div>

            {/* Botones más compactos */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                marginBottom: '2.5rem'
              }}
            >
              <Link
                href="/auth/register"
                className="font-inter"
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.9rem 2.2rem',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  minWidth: '240px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.25)';
                }}
              >
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  Comenzar Gratis
                  <svg
                    style={{
                      marginLeft: '0.5rem',
                      width: '1.1rem',
                      height: '1.1rem',
                      transition: 'transform 0.3s ease'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>

              <Link
                href="/auth/login"
                className="font-inter"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.9rem 2.2rem',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  color: '#475569',
                  textDecoration: 'none',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #e2e8f0',
                  cursor: 'pointer',
                  minWidth: '240px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Ya tengo cuenta
                  <svg
                    style={{
                      marginLeft: '0.5rem',
                      width: '1.1rem',
                      height: '1.1rem',
                      transition: 'transform 0.3s ease'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

            {/* Indicadores de confianza más compactos */}
          </div>
        </div>

        {/* Scroll indicator más pequeño */}

      </div>
    </>
  );
};

export default HomePage;