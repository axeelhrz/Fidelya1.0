'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setShowSubtext(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // Animación de escritura para "Fidelya"
  const typewriterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.01, -0.05, 0.95]
      }
    }
  };

  const fidleyaLetters = "Fidelya".split("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        {/* Gradientes flotantes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-200/15 to-sky-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-sky-100/10 to-cyan-100/10 rounded-full blur-3xl"></div>
        
        {/* Partículas flotantes */}
        <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-sky-300 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Título principal con efecto de escritura */}
        <motion.div
          className="mb-12"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={typewriterVariants}
        >
          <div className="flex justify-center items-center mb-8">
            {fidleyaLetters.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="text-8xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-sky-400 via-cyan-500 to-sky-600 bg-clip-text text-transparent tracking-tight"
                style={{
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  textShadow: '0 0 40px rgba(14, 165, 233, 0.3)'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          
          {/* Cursor parpadeante */}
          <motion.div
            className="inline-block w-1.5 h-20 md:h-24 lg:h-32 bg-gradient-to-b from-sky-500 to-cyan-500 ml-4 rounded-full"
            animate={{
              opacity: [1, 0, 1],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.2
            }}
          />
        </motion.div>

        {/* Subtexto que aparece después */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={showSubtext ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
            El futuro de los programas de fidelidad
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Conecta asociaciones, comercios y socios en un ecosistema inteligente 
            potenciado por IA para maximizar la fidelización y el crecimiento.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link href="/auth/register">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px rgba(14, 165, 233, 0.4)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 flex items-center space-x-3 overflow-hidden"
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <span className="relative z-10">Comenzar Gratis</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
              </motion.button>
            </Link>
            
            <Link href="/auth/login">
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  y: -1,
                  backgroundColor: "rgba(255, 255, 255, 0.9)"
                }}
                whileTap={{ scale: 0.98 }}
                className="text-sky-600 hover:text-sky-700 font-semibold text-xl px-12 py-6 rounded-2xl border-2 border-sky-200 hover:border-sky-300 transition-all duration-300 bg-white/60 backdrop-blur-sm"
              >
                Ya tengo cuenta
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Efecto de partículas adicional */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sky-400 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
}