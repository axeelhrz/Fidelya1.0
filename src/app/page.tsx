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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 25%, #e0e7ff 75%, #f1f5f9 100%)'
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradientes flotantes principales */}
        <div 
          className="absolute opacity-60"
          style={{
            top: '15%',
            left: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.05) 50%, transparent 100%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute opacity-50"
          style={{
            bottom: '20%',
            right: '-10%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(165, 180, 252, 0.04) 50%, transparent 100%)',
            borderRadius: '50%',
            filter: 'blur(35px)',
            animation: 'floatDelay 8s ease-in-out infinite 2s'
          }}
        />
        <div 
          className="absolute opacity-40"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(56, 189, 248, 0.03) 50%, transparent 100%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            animation: 'float 10s ease-in-out infinite 4s'
          }}
        />
        
        {/* Grid pattern sutil */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Partículas flotantes decorativas */}
        <div 
          className="absolute opacity-60"
          style={{
            top: '20%',
            left: '15%',
            width: '8px',
            height: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute opacity-50"
          style={{
            top: '35%',
            right: '20%',
            width: '6px',
            height: '6px',
            background: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
            borderRadius: '50%',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
            animation: 'floatDelay 8s ease-in-out infinite 2s'
          }}
        />
        <div 
          className="absolute opacity-70"
          style={{
            bottom: '25%',
            left: '25%',
            width: '10px',
            height: '10px',
            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
            borderRadius: '50%',
            boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)',
            animation: 'float 10s ease-in-out infinite 4s'
          }}
        />
        <div 
          className="absolute opacity-40"
          style={{
            bottom: '15%',
            right: '15%',
            width: '12px',
            height: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
      </div>

      {/* Contenido principal */}
      <div 
        className={`relative z-10 min-h-screen flex items-center justify-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Logo/Título principal */}
          <div className="mb-12">
            <h1 
              className="font-sans font-black mb-6 tracking-tight leading-none"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
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
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                >
                  |
                </span>
              )}
            </h1>
          </div>

          {/* Contenido que aparece después del typing */}
          <div 
            className={`transition-all duration-1000 delay-1000 ${displayText === fullText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            
            {/* Subtítulo principal */}
            <div className="mb-16">
              <h2 
                className="font-sans font-bold mb-8 leading-tight"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  color: '#334155',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
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
                className="max-w-5xl mx-auto leading-relaxed font-medium mb-4"
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                  color: '#64748b',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                Conecta asociaciones, comercios y socios en un ecosistema inteligente 
                potenciado por IA para maximizar la fidelización y el crecimiento.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/auth/register"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: '280px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
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
                <span className="relative flex items-center">
                  Comenzar Gratis
                  <svg 
                    className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                
                {/* Efecto shimmer */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  style={{ top: '-2px', bottom: '-2px' }}
                />
              </Link>

              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-2xl transition-all duration-400"
                style={{
                  color: '#475569',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(226, 232, 240, 0.8)',
                  boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                  minWidth: '280px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
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
                <span className="flex items-center">
                  Ya tengo cuenta
                  <svg 
                    className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Indicadores de confianza */}
            <div 
              className="flex flex-wrap items-center justify-center gap-8 text-base font-medium"
              style={{ 
                color: '#64748b',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <span>100% Seguro</span>
              </div>
              <div 
                className="w-px h-6"
                style={{ backgroundColor: '#cbd5e1' }}
              />
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" style={{ color: '#3b82f6' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sin tarjeta de crédito</span>
              </div>
              <div 
                className="w-px h-6"
                style={{ backgroundColor: '#cbd5e1' }}
              />
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" style={{ color: '#10b981' }} fill="currentColor" viewBox="0 0 20 20">
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        style={{
          animation: 'bounce 2s ease-in-out infinite'
        }}
      >
        <div 
          className="w-8 h-12 border-2 rounded-full flex justify-center"
          style={{ borderColor: '#94a3b8' }}
        >
          <div 
            className="w-1.5 h-4 rounded-full mt-2"
            style={{ 
              backgroundColor: '#64748b',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes floatDelay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;