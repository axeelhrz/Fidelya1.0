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
    <div className="min-h-screen bg-education-gradient flex items-center justify-center relative overflow-hidden">
      {/* Elementos de fondo sutiles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Acento geométrico minimalista */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-education-accent rounded-full blur-3xl opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Patrón de puntos sutil */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23334155' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo/Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 animate-content-appear"
        >
          {/* Título principal */}
          <div className="mb-8">
            <h1 className="text-responsive-xl font-light text-education-primary mb-2 tracking-tight leading-none text-elegant">
              Casino
            </h1>
            <h2 className="text-responsive-lg font-light text-education-accent tracking-tight leading-none text-elegant">
              Escolar
            </h2>
          </div>
          
          {/* Separador elegante */}
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <motion.div 
              className="mx-4 w-2 h-2 bg-education-accent rounded-full shadow-soft animate-soft-pulse"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </motion.div>

          {/* Subtítulo */}
          <motion.p
            className="text-responsive-base text-education-secondary font-light leading-relaxed max-w-lg mx-auto text-clean"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Plataforma digital para la gestión de alimentación escolar
          </motion.p>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Botón Iniciar Sesión */}
          <Link href="/auth/sign-in">
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary-elegant hover-lift focus-elegant min-w-[160px] animate-subtle-glow"
            >
              Iniciar Sesión
            </motion.button>
          </Link>

          {/* Botón Crear Cuenta */}
          <Link href="/auth/sign-up">
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary-elegant hover-lift focus-elegant min-w-[160px] glass-elegant"
            >
              Crear Cuenta
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer minimalista */}
        <motion.div
          className="text-sm text-education-secondary font-light tracking-wide text-clean"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-center justify-center space-x-3 animate-elegant-slide">
            <span>Nutrición</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Organización</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Bienestar</span>
          </div>
        </motion.div>
      </div>

      {/* Elemento decorativo adicional */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-6 border-2 border-slate-300 rounded-full flex items-center justify-center animate-gentle-float"
        >
          <div className="w-1 h-1 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}