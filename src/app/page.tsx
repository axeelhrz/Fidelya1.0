'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const HomePage = () => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'Fidelya';

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Hacer parpadear el cursor por un momento y luego ocultarlo
        setTimeout(() => {
          setShowCursor(false);
        }, 1500);
      }
    }, 300); // Velocidad más lenta

    // Efecto de parpadeo del cursor
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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        .poppins {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        .inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        .typewriter-cursor {
          animation: blink 1.2s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <div 
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fefefe 0%, #f8fafb 50%, #ffffff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Efectos de fondo sutiles con celeste */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '8%',
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.03) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />

        <div 
          style={{
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            padding: '0 1rem'
          }}
        >
          {/* Logo/Title con efecto typewriter */}
          <div style={{ marginBottom: '2.5rem', paddingTop: '1rem' }}>
            <h1 
              className="poppins"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 800,
                marginBottom: '0',
                letterSpacing: '-0.06em',
                lineHeight: 0.95,
                background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 50%, #38bdf8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 30px rgba(14, 165, 233, 0.1)',
                paddingBottom: '0.3rem',
                minHeight: 'clamp(2.8rem, 7.5vw, 5.5rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {displayText}
              {showCursor && (
                <span 
                  className="typewriter-cursor"
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginLeft: '0.05em'
                  }}
                >
                  |
                </span>
              )}
            </h1>
          </div>

          {/* Subtitle con animación de aparición retrasada */}
          <div
            style={{
              opacity: displayText === fullText ? 1 : 0,
              transform: displayText === fullText ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease-out 0.8s'
            }}
          >
            <h2 
              className="poppins"
              style={{
                fontSize: 'clamp(1.4rem, 4vw, 2.4rem)',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '2rem',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                maxWidth: '700px',
                margin: '0 auto 2rem auto'
              }}
            >
              El futuro de los programas de fidelidad
            </h2>

            {/* Description */}
            <p 
              className="inter"
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                color: '#64748b',
                maxWidth: '600px',
                margin: '0 auto 4rem auto',
                lineHeight: 1.7,
                fontWeight: 400
              }}
            >
              Conecta asociaciones, comercios y socios en un ecosistema inteligente 
              potenciado por IA para maximizar la fidelización y el crecimiento.
            </p>

            {/* Buttons */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1.5rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '3rem'
              }}
            >
              <Link
                href="/auth/register"
                className="poppins"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.2rem 3rem',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  minWidth: '220px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                  boxShadow: '0 6px 25px rgba(14, 165, 233, 0.25)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 35px rgba(14, 165, 233, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(14, 165, 233, 0.25)';
                }}
              >
                Comenzar Gratis
                <svg 
                  style={{ marginLeft: '0.7rem', width: '1.3rem', height: '1.3rem' }}
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
              </Link>

              <Link
                href="/auth/login"
                className="inter"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.2rem 3rem',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#475569',
                  textDecoration: 'none',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0',
                  cursor: 'pointer',
                  minWidth: '220px',
                  background: '#ffffff',
                  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                  e.currentTarget.style.color = '#0ea5e9';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.boxShadow = '0 3px 15px rgba(0, 0, 0, 0.04)';
                }}
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;