"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-screen bg-gradient-magical flex items-center justify-center relative overflow-hidden">
      {/* Elementos de fondo artísticos */}
      <div className="absolute inset-0">
        {/* Orbes flotantes con gradientes únicos */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-orb-1 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-32 right-16 w-96 h-96 bg-gradient-orb-2 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <motion.div
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-orb-3 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* Partículas flotantes */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-particle rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Ondas de fondo */}
        <div className="absolute inset-0 bg-wave-pattern opacity-5" />
      </div>

      {/* Contenido principal con efectos únicos */}
      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto">
        {/* Título con efectos especiales */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-16"
        >
          {/* Halo de luz detrás del título */}
          <motion.div
            className="absolute inset-0 bg-gradient-halo rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative">
            <motion.h1 
              className="text-7xl md:text-8xl font-light text-gradient-title mb-4 tracking-tight text-elegant"
              animate={{
                textShadow: [
                  "0 0 20px rgba(5, 150, 105, 0.3)",
                  "0 0 40px rgba(5, 150, 105, 0.5)",
                  "0 0 20px rgba(5, 150, 105, 0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Casino
            </motion.h1>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-light text-gradient-subtitle tracking-tight text-elegant"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Escolar
            </motion.h2>
          </div>
          
          {/* Separador artístico */}
          <motion.div
            className="flex items-center justify-center mt-8 mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div 
              className="w-24 h-px bg-gradient-separator"
              animate={{
                scaleX: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="mx-6 w-3 h-3 bg-gradient-dot rounded-full shadow-glow"
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  "0 0 10px rgba(5, 150, 105, 0.5)",
                  "0 0 25px rgba(5, 150, 105, 0.8)",
                  "0 0 10px rgba(5, 150, 105, 0.5)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="w-24 h-px bg-gradient-separator"
              animate={{
                scaleX: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.p
            className="text-xl text-gradient-description font-light leading-relaxed text-clean max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Transformando la experiencia de alimentación escolar con tecnología innovadora
          </motion.p>
        </motion.div>

        {/* Botones con efectos únicos */}
        <motion.div
          className="flex flex-col gap-6 items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <Link href="/auth/sign-in">
            <motion.button
              whileHover={{ 
                y: -3, 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(5, 150, 105, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary-magical group relative overflow-hidden"
            >
              {/* Efecto de brillo que se mueve */}
              <motion.div
                className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
              <span className="relative z-10">Iniciar Sesión</span>
            </motion.button>
          </Link>

          <Link href="/auth/sign-up">
            <motion.button
              whileHover={{ 
                y: -3, 
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.95)"
              }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary-magical group relative overflow-hidden"
            >
              {/* Borde animado */}
              <motion.div
                className="absolute inset-0 border-2 border-gradient-animated rounded-xl"
                animate={{
                  borderColor: [
                    "rgba(5, 150, 105, 0.3)",
                    "rgba(5, 150, 105, 0.8)",
                    "rgba(5, 150, 105, 0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10">Crear Cuenta</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Indicador flotante */}
        <motion.div
          className="mt-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <motion.div
            className="glass-indicator px-6 py-3 rounded-full"
            animate={{
              y: [0, -5, 0],
              boxShadow: [
                "0 10px 30px rgba(0, 0, 0, 0.1)",
                "0 15px 40px rgba(0, 0, 0, 0.15)",
                "0 10px 30px rgba(0, 0, 0, 0.1)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center space-x-3 text-sm text-gradient-indicator font-medium">
              <motion.div 
                className="w-2 h-2 bg-gradient-dot rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span>Innovación Educativa</span>
              <motion.div 
                className="w-2 h-2 bg-gradient-dot rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}