'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

const HomePage = () => {
  useEffect(() => {
    // Cargar fuentes dinámicamente
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const jakartaFont = "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const interFont = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        fontFamily: interFont
      }}
    >
      {/* Efectos de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      <div 
        style={{
          textAlign: 'center' as const,
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Logo/Title */}
        <h1 
          style={{
            fontFamily: jakartaFont,
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            fontWeight: 900,
            marginBottom: '1.5rem',
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c084fc 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(165, 180, 252, 0.5)',
            margin: '0 0 1.5rem 0'
          }}
        >
          Fidelya
        </h1>

        {/* Subtitle */}
        <h2 
          style={{
            fontFamily: jakartaFont,
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '1rem',
            letterSpacing: '-0.01em',
            margin: '0 0 1rem 0'
          }}
        >
          El futuro de los programas de fidelidad
        </h2>

        {/* Description */}
        <p 
          style={{
            fontFamily: interFont,
            fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            lineHeight: 1.6,
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
            flexDirection: typeof window !== 'undefined' && window.innerWidth < 640 ? 'column' : 'row',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap as const'
          }}
        >
          <Link
            href="/auth/register"
            style={{
              fontFamily: jakartaFont,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              minWidth: '200px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.4)';
            }}
          >
            Comenzar Gratis
            <svg 
              style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </Link>

          <Link
            href="/auth/login"
            style={{
              fontFamily: interFont,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              minWidth: '200px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;