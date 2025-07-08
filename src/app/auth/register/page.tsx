'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  Store, 
  User, 
  ArrowRight, 
  LogIn, 
  Sparkles, 
  Zap,
  Star,
  Shield,
  Users
} from 'lucide-react';

const RegisterPage = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const roles = [
    {
      id: 'asociacion',
      title: 'Asociación',
      description: 'Gestiona programas de fidelidad y conecta con múltiples comercios',
      icon: Building2,
      color: '#10b981',
      bgGradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      href: '/auth/register/asociacion',
      features: ['Panel administrativo', 'Gestión de comercios', 'Reportes avanzados']
    },
    {
      id: 'socio',
      title: 'Socio',
      description: 'Accede a beneficios exclusivos y descuentos especiales',
      icon: User,
      color: '#6366f1',
      bgGradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      href: '/auth/register/socio',
      features: ['Beneficios exclusivos', 'Descuentos especiales', 'Programa de puntos']
    },
    {
      id: 'comercio',
      title: 'Comercio',
      description: 'Atrae y fideliza clientes con programas de recompensas',
      icon: Store,
      color: '#8b5cf6',
      bgGradient: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      href: '/auth/register/comercio',
      features: ['Gestión de clientes', 'Programas de recompensas', 'Analytics detallados']
    },
  ];

  const benefits = [
    { icon: Shield, text: 'Seguro y confiable', color: 'text-emerald-600' },
    { icon: Users, text: 'Comunidad activa', color: 'text-blue-600' },
    { icon: Star, text: 'Beneficios únicos', color: 'text-amber-600' },
  ];

  // Fixed particle positions and animations to prevent hydration mismatch
  const particleConfigs = [
    { left: 15, top: 20, xOffset: 20, duration: 12, delay: 0 },
    { left: 85, top: 30, xOffset: -15, duration: 14, delay: 1 },
    { left: 25, top: 70, xOffset: 25, duration: 10, delay: 2 },
    { left: 75, top: 80, xOffset: -20, duration: 16, delay: 3 },
    { left: 45, top: 15, xOffset: 10, duration: 13, delay: 4 },
    { left: 65, top: 55, xOffset: -25, duration: 11, delay: 5 },
    { left: 5, top: 45, xOffset: 30, duration: 15, delay: 6 },
    { left: 95, top: 85, xOffset: -10, duration: 9, delay: 7 },
  ];

  const particles = particleConfigs.map((config, i) => (
    <motion.div
      key={i}
      className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
      animate={{
        y: [0, -120, 0],
        x: [0, config.xOffset, 0],
        opacity: [0.3, 0.8, 0.3],
      }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        delay: config.delay,
        ease: "easeInOut"
      }}
      style={{
        left: `${config.left}%`,
        top: `${config.top}%`,
      }}
    />
  ));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/60">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-32 left-16 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-20 right-16 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
        
        {/* Floating particles */}
        {particles}
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-15" />
      </div>

      {/* Enhanced Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link
          href="/"
          className="group inline-flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:bg-white"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Enhanced Logo */}
            <Link href="/" className="inline-block mb-8 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    {/* Sparkle effect */}
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  </div>
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                    Fidelya
                  </span>
                </div>
              </motion.div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-display">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Únete a{' '}
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                  Fidelya
                </span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto">
                Selecciona tu perfil y comienza a disfrutar de beneficios únicos en nuestro ecosistema de fidelización
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced Role Cards Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Glass effect background */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20" />
            
            <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
              {/* Role Cards */}
              <div className="space-y-4 mb-8">
                {roles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      href={role.href}
                      className="block group"
                      onMouseEnter={() => setHoveredCard(role.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl ${
                        hoveredCard === role.id 
                          ? `${role.borderColor} transform -translate-y-2 shadow-2xl` 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        {/* Top accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.bgGradient} rounded-t-2xl transition-opacity duration-300 ${
                          hoveredCard === role.id ? 'opacity-100' : 'opacity-0'
                        }`} />

                        <div className="flex items-center space-x-4">
                          {/* Enhanced Icon */}
                          <div className={`relative w-16 h-16 rounded-2xl ${role.bgColor} flex items-center justify-center transition-all duration-300 ${
                            hoveredCard === role.id ? 'scale-110 shadow-lg' : ''
                          }`}>
                            <role.icon className={`w-7 h-7 ${role.textColor}`} />
                            {hoveredCard === role.id && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">
                              {role.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              {role.description}
                            </p>
                            
                            {/* Features */}
                            <div className="flex flex-wrap gap-2">
                              {role.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs px-2 py-1 rounded-full ${role.bgColor} ${role.textColor} font-medium`}
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Enhanced Arrow */}
                          <div className={`transition-all duration-300 ${
                            hoveredCard === role.id 
                              ? `${role.textColor} transform translate-x-2` 
                              : 'text-slate-400'
                          }`}>
                            <ArrowRight className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Benefits Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mb-8 p-5 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/50"
              >
                <div className="flex justify-around items-center">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      className="text-center group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-2 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                      </div>
                      <p className="text-xs text-slate-600 font-semibold">{benefit.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white/80 backdrop-blur-sm text-slate-500 font-semibold text-sm rounded-full border border-slate-200">
                    ¿Ya tienes cuenta?
                  </span>
                </div>
              </div>

              {/* Enhanced Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-slate-300 text-slate-700 py-4 px-6 rounded-2xl font-semibold text-base hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar sesión</span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;