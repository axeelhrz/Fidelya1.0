'use client';

import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      {/* Estilos CSS en línea */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .jakarta-font {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        .inter-font {
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c084fc 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 40px rgba(165, 180, 252, 0.5);
        }
        
        .glass-button {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .primary-button {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
        }
        
        .hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
        
        .hover-glow:hover {
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.6);
        }
        
        .hover-glass:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <div 
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          position: 'relative',
          overflow: 'hidden'
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
            textAlign: 'center',
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Logo/Title */}
          <h1 
            className="jakarta-font gradient-text"
            style={{
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              fontWeight: 900,
              marginBottom: '1.5rem',
              letterSpacing: '-0.04em',
              lineHeight: 0.85
            }}
          >
            Fidelya
          </h1>

          {/* Subtitle */}
          <h2 
            className="jakarta-font"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '1rem',
              letterSpacing: '-0.01em'
            }}
          >
            El futuro de los programas de fidelidad
          </h2>

          {/* Description */}
          <p 
            className="inter-font"
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '3rem',
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
              flexDirection: window.innerWidth < 640 ? 'column' : 'row',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Link
              href="/auth/register"
              className="jakarta-font primary-button hover-scale hover-glow"
              style={{
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
                minWidth: '200px'
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
              className="inter-font glass-button hover-scale hover-glass"
              style={{
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
                minWidth: '200px'
              }}
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;