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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradientes flotantes principales */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float opacity-60" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-float opacity-50" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl animate-float opacity-40" style={{ animationDelay: '4s' }} />
        
        {/* Grid pattern sutil */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        {/* Partículas flotantes decorativas */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-float opacity-60 shadow-lg" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-32 w-1 h-1 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full animate-float opacity-50 shadow-lg" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full animate-float opacity-70 shadow-lg" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-float opacity-40 shadow-lg" style={{ animationDelay: '2s' }} />
      </div>

      {/* Contenido principal */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Logo/Título principal */}
          <div className="mb-12">
            <h1 className="font-sans font-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-6 tracking-tight leading-none">
              <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                {displayText}
              </span>
              {showCursor && (
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-glow">
                  |
                </span>
              )}
            </h1>
          </div>

          {/* Contenido que aparece después del typing */}
          <div className={`transition-all duration-1000 delay-1000 ${displayText === fullText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            
            {/* Subtítulo principal */}
            <div className="mb-16">
              <h2 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-slate-700 mb-8 leading-tight">
                El futuro de los programas de{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  fidelidad
                </span>
              </h2>
              
              <p className="font-body text-lg md:text-xl lg:text-2xl text-slate-600 max-w-5xl mx-auto leading-relaxed font-medium mb-4">
                Conecta asociaciones, comercios y socios en un ecosistema inteligente 
                potenciado por IA para maximizar la fidelización y el crecimiento.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/auth/register"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-soft-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[280px] overflow-hidden"
              >
                <span className="relative flex items-center font-sans">
                  Comenzar Gratis
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                
                {/* Efecto shimmer */}
                <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 animate-shimmer opacity-0 group-hover:opacity-100" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </Link>

              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-slate-700 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl shadow-soft hover:shadow-soft-lg hover:scale-105 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 min-w-[280px]"
              >
                <span className="flex items-center font-sans">
                  Ya tengo cuenta
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Indicadores de confianza */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-base font-medium text-slate-500 font-body">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-glow shadow-lg" style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }} />
                <span>100% Seguro</span>
              </div>
              <div className="w-px h-6 bg-slate-300" />
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="w-px h-6 bg-slate-300" />
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Configuración en 5 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-glow" />
        </div>
      </div>

      {/* Estilos adicionales específicos para esta página */}
      <style jsx>{`
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .typewriter-text {
          overflow: hidden;
          border-right: 2px solid;
          white-space: nowrap;
          animation: typewriter 3s steps(40, end), blink 1s step-end infinite;
        }

        /* Mejoras para el shimmer effect */
        .group:hover .animate-shimmer {
          animation: shimmer 1.5s ease-in-out;
        }

        /* Efectos de hover mejorados */
        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
        }

        /* Animación personalizada para el cursor */
        .cursor-blink {
          animation: blink 1.2s infinite;
        }

        /* Gradientes mejorados */
        .gradient-bg {
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 25%, #e0e7ff 75%, #f1f5f9 100%);
        }

        /* Efectos de partículas */
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .particle-1 {
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
          top: 20%;
          left: 10%;
          animation: float 8s ease-in-out infinite;
        }

        .particle-2 {
          width: 6px;
          height: 6px;
          background: linear-gradient(45deg, #6366f1, #a5b4fc);
          top: 60%;
          right: 15%;
          animation: float 6s ease-in-out infinite 2s;
        }

        .particle-3 {
          width: 3px;
          height: 3px;
          background: linear-gradient(45deg, #8b5cf6, #c084fc);
          bottom: 30%;
          left: 20%;
          animation: float 10s ease-in-out infinite 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;