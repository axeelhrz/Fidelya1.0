'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Users, BarChart3, Shield, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = 'Fidelya';

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-20 w-4 h-4 bg-blue-400/60 rounded-full blur-sm"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-40 right-32 w-6 h-6 bg-indigo-400/40 rounded-full blur-sm"
        style={{ animationDelay: '2s' }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-32 left-40 w-3 h-3 bg-cyan-400/50 rounded-full blur-sm"
        style={{ animationDelay: '4s' }}
      />

      {/* Header */}
      <header className="absolute top-0 w-full z-50 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              {typedText}
              {!isTypingComplete && (
                <span className="animate-pulse text-blue-400">|</span>
              )}
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 3.2 }}
          >
            <Link 
              href="/auth/login"
              className="text-white/80 hover:text-white font-medium transition-colors duration-300 px-6 py-2 rounded-full border border-white/20 hover:border-white/40 backdrop-blur-sm"
            >
              Ya tengo cuenta
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-6xl mx-auto"
        >
          {/* Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
          >
            El futuro de los{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              programas de fidelidad
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12"
          >
            Conecta asociaciones, comercios y socios en un ecosistema inteligente 
            potenciado por IA para maximizar la fidelización y el crecimiento.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            variants={itemVariants}
            className="mb-16"
          >
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-3 mx-auto group"
              >
                <span>Comenzar Gratis</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Sin configuración compleja",
                description: "Implementación rápida y sencilla"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Integración en minutos",
                description: "Conecta tu ecosistema al instante"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Soporte 24/7",
                description: "Asistencia continua garantizada"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3 + index * 0.2 }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white text-xl mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 4 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex items-center space-x-12 text-white/60">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">1000+</div>
            <div className="text-sm">Comercios</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="text-sm">Socios</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-sm">Uptime</div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator (Hidden but maintains structure) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}