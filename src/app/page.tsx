'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentText, setCurrentText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  const fullText = 'disfruta.';
  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setCurrentText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="homepage-container bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 right-32 w-48 h-48 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-2xl animate-floatDelay"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-cyan-300/25 to-blue-300/25 rounded-full blur-lg animate-float"></div>
      
      {/* Main content container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Logo and brand section */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Custom logo icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl blur-lg animate-pulse-glow"></div>
            </div>
            
            {/* Brand name with gradient */}
            <h1 className="text-6xl md:text-8xl font-bold gradient-text font-playfair tracking-tight">
              Fidelya
            </h1>
          </div>
        </div>

        {/* Typewriter effect section */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="h-20 flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl text-slate-700 font-medium font-jakarta">
              {currentText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-blue-600`}>
                |
              </span>
            </h2>
          </div>
        </div>

        {/* Description with enhanced styling */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-2xl md:text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-jakarta text-balance">
            La plataforma de beneficios que conecta 
            <span className="gradient-text font-semibold"> asociaciones</span>, 
            <span className="gradient-text font-semibold"> socios</span> y 
            <span className="gradient-text font-semibold"> comercios</span>
          </p>
        </div>

        {/* Enhanced CTA buttons */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link href="/auth/register" className="group">
              <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-semibold text-xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 min-w-[280px]">
                <span className="relative z-10">Registrarse ahora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-cyan-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            
            <Link href="/auth/login" className="group">
              <button className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-slate-300/50 text-slate-700 px-12 py-5 rounded-2xl font-semibold text-xl shadow-xl hover:shadow-2xl hover:bg-white hover:border-slate-400 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50 min-w-[280px]">
                <span className="relative z-10">Iniciar sesión</span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>

        {/* Enhanced role information */}
        <div className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="glass-card max-w-2xl mx-auto p-8">
            <p className="text-xl text-slate-600 mb-6 font-jakarta">
              Accede según tu rol:
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-3 rounded-xl border border-blue-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                <span className="font-semibold text-slate-700 text-lg">Asociación</span>
              </div>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-cyan-50 to-indigo-50 px-6 py-3 rounded-xl border border-cyan-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"></div>
                <span className="font-semibold text-slate-700 text-lg">Comercio</span>
              </div>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-xl border border-indigo-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                <span className="font-semibold text-slate-700 text-lg">Socio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional features showcase */}
        <div className="mt-20 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="card-hover text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-jakarta">Gestión Inteligente</h3>
              <p className="text-slate-600 leading-relaxed">Sistema completo para administrar socios, beneficios y validaciones en tiempo real.</p>
            </div>

            {/* Feature 2 */}
            <div className="card-hover text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H9V11M15,11H19V13H15V11M19,5H21V9H19V5M5,5H9V9H5V5M3,19H5V21H3V19M9,19H13V21H9V19M15,19H19V21H15V19"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-jakarta">Códigos QR</h3>
              <p className="text-slate-600 leading-relaxed">Validación rápida y segura de beneficios mediante códigos QR únicos y encriptados.</p>
            </div>

            {/* Feature 3 */}
            <div className="card-hover text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-jakarta">Analytics Avanzados</h3>
              <p className="text-slate-600 leading-relaxed">Reportes detallados y métricas en tiempo real para optimizar tu programa de fidelización.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}