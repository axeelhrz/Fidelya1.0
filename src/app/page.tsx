'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  LogIn, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  Star, 
  CheckCircle,
  Sparkles,
  Globe,
  BarChart3,
  Heart
} from 'lucide-react';

const HomePage = () => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const fullText = 'Fidelita';

  useEffect(() => {
    // Animación de aparición inicial
    setTimeout(() => setIsVisible(true), 200);

    // Efecto de scroll parallax
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

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
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Seguridad Avanzada",
      description: "Protección de datos con encriptación de nivel empresarial y autenticación multifactor.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Velocidad Extrema",
      description: "Procesamiento en tiempo real con tecnología de vanguardia para respuestas instantáneas.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Gestión Inteligente",
      description: "IA integrada para optimizar automáticamente tus programas de fidelización.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Analytics Avanzados",
      description: "Insights profundos y reportes en tiempo real para maximizar tu ROI.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Socios Activos", icon: Users },
    { number: "2.5K+", label: "Comercios Afiliados", icon: Globe },
    { number: "99.9%", label: "Tiempo de Actividad", icon: Shield },
    { number: "4.9/5", label: "Satisfacción", icon: Star }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Directora de Marketing",
      company: "RetailMax",
      content: "Fidelita transformó completamente nuestra estrategia de fidelización. Los resultados superaron todas nuestras expectativas.",
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      role: "CEO",
      company: "TechSolutions",
      content: "La plataforma más intuitiva y poderosa que hemos usado. El ROI se vio desde el primer mes.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Gerente General",
      company: "ComercioPlus",
      content: "Increíble cómo simplificó nuestros procesos. Ahora podemos enfocarnos en lo que realmente importa.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/50 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-8">
        {/* Elementos decorativos de fondo mejorados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradientes flotantes animados */}
          <div 
            className="absolute top-[20%] left-[10%] w-72 h-72 bg-gradient-radial from-blue-500/12 to-transparent rounded-full blur-3xl opacity-60 animate-float"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div 
            className="absolute bottom-[25%] right-[15%] w-64 h-64 bg-gradient-radial from-primary-500/10 to-transparent rounded-full blur-2xl opacity-40 animate-float-delay"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
          <div 
            className="absolute top-[60%] left-[60%] w-48 h-48 bg-gradient-radial from-violet-500/8 to-transparent rounded-full blur-3xl opacity-50 animate-float"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          />
          
          {/* Partículas decorativas mejoradas */}
          <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-glow opacity-70 animate-float" />
          <div className="absolute top-[60%] right-[25%] w-1.5 h-1.5 bg-gradient-to-r from-primary-500 to-violet-400 rounded-full shadow-glow opacity-60 animate-float-delay" />
          <div className="absolute bottom-[40%] left-[30%] w-1 h-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full shadow-glow opacity-50 animate-pulse-slow" />
          
          {/* Patrón de grid mejorado */}
          <div className="absolute inset-0 bg-grid opacity-20" />
          
          {/* Efectos de luz adicionales */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-conic from-primary-500/5 via-violet-500/5 to-primary-500/5 rounded-full blur-3xl" />
        </div>

        {/* Contenido principal del hero */}
        <div className={`relative z-10 text-center max-w-6xl w-full transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          
          {/* Logo/Título principal mejorado */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 to-violet-500/10 rounded-full border border-primary-200/30 dark:border-primary-700/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  Plataforma de Nueva Generación
                </span>
              </div>
            </div>
            
            <h1 className="font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold italic mb-6 tracking-tight leading-none">
              <span className="gradient-text drop-shadow-sm">
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
            
            {/* Subtítulo mejorado */}
            <div className="mb-12">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-slate-700 dark:text-slate-300 mb-8 leading-tight">
                El futuro de los programas de{' '}
                <span className="gradient-text font-bold relative">
                  fidelidad
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500/30 to-violet-500/30 rounded-full"></div>
                </span>
              </h2>

              <p className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-4xl mx-auto text-balance mb-8">
                Conecta asociaciones, comercios y socios en un ecosistema inteligente
                potenciado por IA para maximizar la fidelización y el crecimiento.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Sin configuración compleja</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Integración en minutos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Soporte 24/7</span>
                </div>
              </div>
            </div>

            {/* Botones de acción mejorados */}
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16">
              <Link
                href="/auth/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl shadow-2xl hover:shadow-primary-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-w-[300px] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  <Sparkles className="mr-3 w-5 h-5 transition-transform group-hover:rotate-12" />
                  Comenzar Gratis
                  <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-300/50 dark:border-slate-600/50 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-slate-700 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-w-[300px]"
              >
                <span className="flex items-center">
                  <LogIn className="mr-3 w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Ya tengo cuenta
                </span>
              </Link>
            </div>

            {/* Estadísticas mejoradas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500/10 to-violet-500/10 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm lg:text-base text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicador de scroll mejorado */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-slate-400/50 dark:border-slate-600/50 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-gradient-to-b from-primary-500 to-violet-500 rounded-full mt-2 animate-pulse-slow"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 to-violet-500/10 rounded-full border border-primary-200/30 dark:border-primary-700/30 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  Características Principales
                </span>
              </div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-200 mb-6">
              Potencia tu negocio con{' '}
              <span className="gradient-text">tecnología avanzada</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Descubre las características que hacen de Fidelita la plataforma líder en gestión de fidelización
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-display text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-100/50 to-blue-100/30 dark:from-slate-800/50 dark:to-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 to-violet-500/10 rounded-full border border-primary-200/30 dark:border-primary-700/30 backdrop-blur-sm">
                <Heart className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  Testimonios
                </span>
              </div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-200 mb-6">
              Lo que dicen nuestros{' '}
              <span className="gradient-text">clientes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 bg-gradient-to-br from-primary-600 to-violet-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700/50 to-violet-700/50"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10"></div>
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                ¿Listo para transformar tu negocio?
              </h2>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Únete a miles de empresas que ya están revolucionando sus programas de fidelización
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 min-w-[250px]"
                >
                  <span className="flex items-center">
                    Empezar Ahora
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                
                <Link
                  href="/auth/login"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 min-w-[250px]"
                >
                  <span className="flex items-center">
                    <BarChart3 className="mr-2 w-5 h-5" />
                    Ver Demo
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;