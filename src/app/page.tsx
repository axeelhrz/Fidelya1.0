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
    <div className="h-screen bg-education-gradient flex items-center justify-center relative overflow-hidden">
      {/* Fondo minimalista */}
      <div className="absolute inset-0">
        {/* Elemento sutil de fondo */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-education-accent rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Contenido principal centrado */}
      <div className="relative z-10 text-center px-8 max-w-xl mx-auto">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-light text-education-primary mb-3 tracking-tight text-elegant">
            Casino
          </h1>
          <h2 className="text-3xl md:text-4xl font-light text-education-accent tracking-tight text-elegant">
            Escolar
          </h2>
          
          {/* Línea separadora minimalista */}
          <motion.div
            className="w-20 h-px bg-education-accent mx-auto mt-8 mb-6"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          <p className="text-lg text-education-secondary font-light leading-relaxed text-clean">
            Gestión inteligente de alimentación escolar
          </p>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          className="flex flex-col gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/auth/sign-in">
            <motion.button
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-64 py-4 bg-education-primary text-white font-medium rounded-lg 
                         shadow-soft hover:shadow-soft-lg transition-all duration-300 
                         focus-elegant text-clean border-none cursor-pointer"
              style={{ backgroundColor: '#1e293b' }}
            >
              Iniciar Sesión
            </motion.button>
          </Link>

          <Link href="/auth/sign-up">
            <motion.button
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-64 py-4 bg-white text-education-primary font-medium rounded-lg 
                         border border-slate-200 hover:border-education-accent
                         shadow-soft hover:shadow-soft-lg transition-all duration-300 
                         focus-elegant text-clean cursor-pointer"
            >
              Crear Cuenta
            </motion.button>
          </Link>
        </motion.div>

        {/* Indicador sutil */}
        <motion.div
          className="mt-16 text-xs text-education-secondary font-light text-clean opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Plataforma educativa
        </motion.div>
      </div>
    </div>
  );
}