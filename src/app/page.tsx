'use client';

import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Logo/Title */}
        <h1 
          className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
          style={{ 
            fontFamily: 'var(--font-jakarta)',
            background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c084fc 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(165, 180, 252, 0.5)'
          }}
        >
          Fidelya
        </h1>

        {/* Subtitle */}
        <h2 
          className="text-2xl md:text-3xl font-semibold text-white/90 mb-4"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          El futuro de los programas de fidelidad
        </h2>

        {/* Description */}
        <p 
          className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Conecta asociaciones, comercios y socios en un ecosistema inteligente 
          potenciado por IA para maximizar la fidelización y el crecimiento.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              fontFamily: 'var(--font-jakarta)',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
            }}
          >
            Comenzar Gratis
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white/90 rounded-full border border-white/20 transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105"
            style={{
              fontFamily: 'var(--font-inter)',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
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