'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, LogIn } from 'lucide-react';

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
    <div className="dashboard-container flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradientes flotantes */}
        <div className="absolute top-[20%] left-[10%] w-48 h-48 bg-gradient-radial from-blue-500/8 to-transparent rounded-full blur-3xl opacity-40 animate-float" />
        <div className="absolute bottom-[25%] right-[15%] w-44 h-44 bg-gradient-radial from-primary-500/6 to-transparent rounded-full blur-2xl opacity-30 animate-float-delay" />
        
        {/* Partículas decorativas */}
        <div className="absolute top-[30%] left-[20%] w-1 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-glow opacity-50 animate-float" />
        <div className="absolute top-[60%] right-[25%] w-0.5 h-0.5 bg-gradient-to-r from-primary-500 to-violet-400 rounded-full shadow-glow opacity-40 animate-float-delay" />
        
        {/* Patrón de grid sutil */}
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Contenido principal */}
      <div className={`relative z-10 text-center max-w-4xl w-full transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}>
        
        {/* Logo/Título principal */}
        <div className="mb-8">
          <h1 className="font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold italic mb-4 tracking-tight leading-none">
            <span className="gradient-text">
              {displayText}
            </span>
            {showCursor && (
              <span className="gradient-text animate-blink">|</span>
            )}
          </h1>
        </div>

        {/* Contenido que aparece después del typing */}
        <div className={`transition-all duration-700 ease-out delay-700 ${
          displayText === fullText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          
          {/* Subtítulo */}
          <div className="mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-700 dark:text-slate-300 mb-6 leading-tight">
              El futuro de los programas de{' '}
              <span className="gradient-text font-bold">fidelidad</span>
            </h2>

            <p className="font-sans text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-3xl mx-auto text-balance">
              Conecta asociaciones, comercios y socios en un ecosistema inteligente
              potenciado por IA para maximizar la fidelización y el crecimiento.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
            <Link
              href="/auth/register"
              className="btn-primary group min-w-[280px] text-lg"
            >
              <span className="flex items-center">
                Comenzar Gratis
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/auth/login"
              className="btn-secondary group min-w-[280px] text-lg"
            >
              <span className="flex items-center">
                <LogIn className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Ya tengo cuenta
              </span>
            </Link>
          </div>

          {/* Indicadores de confianza */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                10K+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Socios Activos
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                500+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Comercios Afiliados
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                99.9%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Tiempo de Actividad
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 dark:bg-slate-600 rounded-full mt-2 animate-pulse-slow"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;