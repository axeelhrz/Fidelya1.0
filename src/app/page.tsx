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
      {/* Estilos CSS integrados */}
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

        /* Animaciones personalizadas */
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

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay-2 {
          animation: floatDelay 8s ease-in-out infinite 2s;
        }

        .animate-float-delay-4 {
          animation: float 10s ease-in-out infinite 4s;
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        /* Grid pattern */
        .bg-grid {
          background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0);
          background-size: 30px 30px;
        }

        /* Glassmorphism */
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        /* Gradient text */
        .gradient-text-primary {
          background: linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #6366f1 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gradient-text-accent {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Shadows */
        .shadow-soft {
          box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
        }

        .shadow-soft-lg {
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
        }

        .shadow-glow {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }

        /* Hover effects */
        .hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-scale:hover {
          transform: translateY(-4px) scale(1.02);
        }

        /* Responsive text sizes */
        .text-responsive-xl {
          font-size: clamp(2rem, 5vw, 4rem);
        }

        .text-responsive-2xl {
          font-size: clamp(2.5rem, 6vw, 5rem);
        }

        .text-responsive-3xl {
          font-size: clamp(3rem, 8vw, 7rem);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 25%, #e0e7ff 75%, #f1f5f9 100%)'
      }}>
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradientes flotantes principales */}
          <div 
            className="absolute animate-float opacity-60"
            style={{
              top: '15%',
              left: '-10%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.05) 50%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }}
          />
          <div 
            className="absolute animate-float-delay-2 opacity-50"
            style={{
              bottom: '20%',
              right: '-10%',
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(165, 180, 252, 0.04) 50%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(35px)'
            }}
          />
          <div 
            className="absolute animate-float-delay-4 opacity-40"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(56, 189, 248, 0.03) 50%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(50px)'
            }}
          />
          
          {/* Grid pattern sutil */}
          <div className="absolute inset-0 bg-grid opacity-30" />
          
          {/* Partículas flotantes decorativas */}
          <div 
            className="absolute animate-float opacity-60"
            style={{
              top: '20%',
              left: '15%',
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
            }}
          />
          <div 
            className="absolute animate-float-delay-2 opacity-50"
            style={{
              top: '35%',
              right: '20%',
              width: '6px',
              height: '6px',
              background: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
              borderRadius: '50%',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
            }}
          />
          <div 
            className="absolute animate-float-delay-4 opacity-70"
            style={{
              bottom: '25%',
              left: '25%',
              width: '10px',
              height: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              borderRadius: '50%',
              boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)'
            }}
          />
          <div 
            className="absolute animate-float opacity-40"
            style={{
              bottom: '15%',
              right: '15%',
              width: '12px',
              height: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
            }}
          />
        </div>

        {/* Contenido principal */}
        <div className={`relative z-10 min-h-screen flex items-center justify-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Logo/Título principal */}
            <div className="mb-12">
              <h1 className="font-jakarta font-black text-responsive-3xl mb-6 tracking-tight leading-none">
                <span className="gradient-text-primary drop-shadow-sm">
                  {displayText}
                </span>
                {showCursor && (
                  <span className="gradient-text-accent animate-pulse-slow">
                    |
                  </span>
                )}
              </h1>
            </div>

            {/* Contenido que aparece después del typing */}
            <div className={`transition-all duration-1000 delay-1000 ${displayText === fullText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              
              {/* Subtítulo principal */}
              <div className="mb-12">
                <h2 className="font-jakarta font-bold text-responsive-2xl mb-8 leading-tight" style={{ color: '#334155' }}>
                  El futuro de los programas de{' '}
                  <span className="gradient-text-accent">
                    fidelidad
                  </span>
                </h2>
                
                <p className="font-inter text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto leading-relaxed font-medium" style={{ color: '#64748b' }}>
                  Conecta asociaciones, comercios y socios en un ecosistema inteligente 
                  potenciado por IA para maximizar la fidelización y el crecimiento.
                </p>
              </div>

              {/* Características destacadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
                <div className="glass-card p-8 rounded-2xl hover-scale group">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-jakarta font-bold text-xl mb-4" style={{ color: '#334155' }}>Inteligencia Artificial</h3>
                  <p className="font-inter text-base leading-relaxed" style={{ color: '#64748b' }}>
                    Optimización automática de campañas y análisis predictivo para maximizar resultados
                  </p>
                </div>
                
                <div className="glass-card p-8 rounded-2xl hover-scale group">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-jakarta font-bold text-xl mb-4" style={{ color: '#334155' }}>Ecosistema Conectado</h3>
                  <p className="font-inter text-base leading-relaxed" style={{ color: '#64748b' }}>
                    Unifica asociaciones, comercios y socios en una plataforma integral y colaborativa
                  </p>
                </div>
                
                <div className="glass-card p-8 rounded-2xl hover-scale group">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #06d6a0 100%)',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-jakarta font-bold text-xl mb-4" style={{ color: '#334155' }}>Analytics Avanzados</h3>
                  <p className="font-inter text-base leading-relaxed" style={{ color: '#64748b' }}>
                    Métricas en tiempo real y reportes detallados para decisiones estratégicas
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link
                  href="/auth/register"
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white rounded-2xl shadow-soft-lg hover:shadow-glow hover-scale min-w-[280px] overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)';
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <span className="relative flex items-center font-jakarta">
                    Comenzar Gratis
                    <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="group glass-button inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-2xl shadow-soft hover:shadow-soft-lg hover-scale min-w-[280px] transition-all duration-400"
                  style={{
                    color: '#475569',
                    borderColor: 'rgba(226, 232, 240, 0.8)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  <span className="flex items-center font-jakarta">
                    Ya tengo cuenta
                    <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Indicadores de confianza */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-base font-medium" style={{ color: '#64748b' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow shadow-glow" style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }} />
                  <span className="font-inter">100% Seguro</span>
                </div>
                <div className="w-px h-6" style={{ backgroundColor: '#cbd5e1' }} />
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-inter">Sin tarjeta de crédito</span>
                </div>
                <div className="w-px h-6" style={{ backgroundColor: '#cbd5e1' }} />
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-inter">Configuración en 5 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div 
            className="w-8 h-12 border-2 rounded-full flex justify-center"
            style={{ borderColor: '#94a3b8' }}
          >
            <div 
              className="w-1.5 h-4 rounded-full mt-2 animate-pulse-slow"
              style={{ backgroundColor: '#64748b' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;