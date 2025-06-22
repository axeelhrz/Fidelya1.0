'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  variant?: 'default' | 'compact';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  backHref = '/auth/register',
  variant = 'default' 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 via-gray-50 to-primary-50/30 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente principal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-primary-400/20 via-primary-500/10 to-transparent rounded-full blur-3xl" />
        
        {/* Elementos flotantes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary-300/30 to-primary-500/20 rounded-3xl blur-xl"
        />
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-primary-400/20 to-primary-600/10 rounded-2xl blur-lg"
        />

        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--gray-900) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
      </div>

      {/* Contenido principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Header con logo */}
        <motion.header variants={itemVariants} className="pt-8 pb-4">
          <div className="container-center">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div variants={logoVariants}>
                <Link href="/" className="flex items-center space-x-4 group">
                  <div className="relative">
                    {/* Logo principal */}
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                      <span className="text-white font-black text-xl tracking-tight relative z-10">F</span>
                      
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300 scale-110" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-primary-700 transition-colors duration-300">
                      Fidelita
                    </span>
                    <span className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                      Premium Platform
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Indicadores de confianza */}
              <motion.div 
                variants={itemVariants}
                className="hidden sm:flex items-center space-x-6"
              >
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium">Seguro</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium">Confiable</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Contenido central */}
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md mx-auto px-4">
            {/* Botón de regreso */}
            <AnimatePresence>
              {showBackButton && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  variants={itemVariants}
                  className="mb-6"
                >
                  <Link
                    href={backHref}
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors duration-200 group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Volver
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Título y subtítulo */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight text-balance leading-tight mb-3">
                {title}
              </h1>
              {subtitle && (
                <p className="text-base text-gray-600 text-balance max-w-sm mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Contenedor del formulario */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              {/* Tarjeta principal */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                {/* Efectos visuales */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
                
                {/* Contenido */}
                <div className="relative z-10">
                  {children}
                </div>
              </div>

              {/* Sombra decorativa */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-primary-800/5 rounded-3xl blur-xl scale-105 -z-10" />
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          className="pb-8 pt-4"
        >
          <div className="container-center text-center">
            <p className="text-sm text-gray-500">
              © 2024 Fidelita. Plataforma premium de fidelización.
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}