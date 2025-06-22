'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles, Star, Zap } from 'lucide-react';

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

const floatingElementVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente principal difuso */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-br from-indigo-400/20 via-indigo-500/10 to-transparent rounded-full blur-3xl" />
        
        {/* Círculos sutiles flotantes */}
        <motion.div
          variants={floatingElementVariants}
          animate="animate"
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-indigo-300/30 to-indigo-500/20 rounded-full blur-xl"
        />
        
        <motion.div
          variants={floatingElementVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-indigo-600/10 rounded-2xl blur-lg"
        />

        <motion.div
          variants={floatingElementVariants}
          animate="animate"
          style={{ animationDelay: '4s' }}
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-indigo-500/25 to-indigo-700/15 rounded-full blur-md"
        />

        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(79, 70, 229) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} 
          />
        </div>

        {/* Formas geométricas suaves */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400/40 rounded-full animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-indigo-500/50 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-indigo-300/60 rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Contenido principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Header con logo mejorado */}
        <motion.header variants={itemVariants} className="pt-8 pb-4">
          <div className="container-center">
            <div className="flex items-center justify-between">
              {/* Logo con efecto drop-shadow */}
              <motion.div variants={logoVariants}>
                <Link href="/" className="flex items-center space-x-4 group">
                  <div className="relative">
                    {/* Logo principal con drop-shadow */}
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden drop-shadow-sm">
                      <span className="text-white font-black text-xl tracking-tight relative z-10">F</span>
                      
                      {/* Efecto de brillo interno */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    </div>
                    
                    {/* Glow effect sutil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-300 scale-110" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-indigo-700 transition-colors duration-300">
                      Fidelita
                    </span>
                    <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
                      Premium Platform
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Indicadores de confianza mejorados */}
              <motion.div 
                variants={itemVariants}
                className="hidden sm:flex items-center space-x-6"
              >
                <div className="flex items-center space-x-2 text-gray-600 group">
                  <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Seguro</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 group">
                  <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Confiable</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 group">
                  <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
                    <Star className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Premium</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Contenido central */}
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 md:px-10">
          <div className="w-full max-w-md mx-auto">
            {/* Botón de regreso mejorado */}
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
                    className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-indigo-700 transition-colors duration-200 group tracking-tight"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Volver
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Título y subtítulo con tipografía mejorada */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight text-balance leading-tight mb-3">
                {title}
              </h1>
              {subtitle && (
                <p className="text-base text-gray-500 text-balance max-w-sm mx-auto leading-snug">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Contenedor del formulario con shadow-xl y rounded-2xl */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              {/* Tarjeta principal con efectos visuales */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 md:p-10 relative overflow-hidden">
                {/* Línea decorativa superior */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                
                {/* Efectos de fondo sutiles */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 pointer-events-none" />
                
                {/* Contenido del formulario */}
                <div className="relative z-10">
                  {children}
                </div>

                {/* Elementos decorativos internos */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br from-indigo-100/50 to-indigo-200/30 rounded-full blur-sm" />
                <div className="absolute top-4 left-4 w-6 h-6 bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 rounded-full blur-sm" />
              </div>

              {/* Sombra decorativa externa */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-800/3 rounded-2xl blur-xl scale-105 -z-10" />
              
              {/* Glow effect sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-2xl blur-2xl scale-110 -z-20" />
            </motion.div>
          </div>
        </main>

        {/* Footer mejorado */}
        <motion.footer 
          variants={itemVariants}
          className="pb-8 pt-4"
        >
          <div className="container-center text-center">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <div className="flex items-center space-x-1 text-gray-400">
                <Zap className="w-3 h-3" />
                <span className="text-xs font-medium">Powered by</span>
              </div>
              <span className="text-xs font-bold text-gray-600 tracking-wider uppercase">Fidelita</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              © 2024 Fidelita. Plataforma premium de fidelización.
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}