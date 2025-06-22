'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles, Star, Zap, Crown, CheckCircle2 } from 'lucide-react';

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
      duration: 0.8,
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Elementos decorativos de fondo - Minimalista y elegante */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente principal sutil */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/8 via-indigo-400/4 to-transparent rounded-full blur-3xl" />
        
        {/* Elementos flotantes minimalistas */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-indigo-200/20 to-purple-200/10 rounded-2xl blur-xl"
        />
        
        <motion.div
          animate={{
            y: [0, 8, 0],
            rotate: [0, -1, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-br from-blue-200/15 to-indigo-200/8 rounded-full blur-lg"
        />

        {/* Patrón de puntos ultra sutil */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(79, 70, 229) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} 
          />
        </div>
      </div>

      {/* Contenido principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Header premium */}
        <motion.header variants={itemVariants} className="pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo premium con efectos */}
              <motion.div variants={logoVariants}>
                <Link href="/" className="flex items-center space-x-4 group">
                  <div className="relative">
                    {/* Logo principal */}
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-all duration-500 group-hover:scale-105 relative overflow-hidden">
                      <span className="text-white font-black text-xl tracking-tight relative z-10">F</span>
                      
                      {/* Efecto de brillo interno */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Shimmer effect premium */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    </div>
                    
                    {/* Glow effect sutil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 scale-110" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-700 transition-colors duration-300">
                      Fidelita
                    </span>
                    <span className="text-xs font-semibold text-slate-500 tracking-[0.1em] uppercase">
                      Premium Platform
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Indicadores de confianza premium */}
              <motion.div 
                variants={itemVariants}
                className="hidden sm:flex items-center space-x-8"
              >
                <div className="flex items-center space-x-2 text-slate-600 group cursor-default">
                  <div className="p-2 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl group-hover:from-indigo-100 group-hover:to-indigo-200/50 transition-all duration-300 shadow-sm">
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Seguro</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 group cursor-default">
                  <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl group-hover:from-emerald-100 group-hover:to-emerald-200/50 transition-all duration-300 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Confiable</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 group cursor-default">
                  <div className="p-2 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl group-hover:from-amber-100 group-hover:to-amber-200/50 transition-all duration-300 shadow-sm">
                    <Crown className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Premium</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Contenido central */}
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md mx-auto">
            {/* Botón de regreso premium */}
            <AnimatePresence>
              {showBackButton && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  variants={itemVariants}
                  className="mb-8"
                >
                  <Link
                    href={backHref}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-700 transition-all duration-300 group rounded-xl hover:bg-white/50 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                    Volver
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Título y subtítulo premium */}
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-base text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Contenedor del formulario premium */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              {/* Tarjeta principal con efectos premium */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 sm:p-10 relative overflow-hidden">
                {/* Línea decorativa superior premium */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
                
                {/* Efectos de fondo premium */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-indigo-50/20 pointer-events-none rounded-3xl" />
                
                {/* Contenido del formulario */}
                <div className="relative z-10">
                  {children}
                </div>

                {/* Elementos decorativos internos minimalistas */}
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-indigo-100/30 to-purple-100/20 rounded-2xl blur-sm" />
                <div className="absolute top-6 left-6 w-8 h-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-xl blur-sm" />
              </div>

              {/* Sombra decorativa externa premium */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/3 rounded-3xl blur-2xl scale-105 -z-10" />
              
              {/* Glow effect ultra sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/8 to-transparent rounded-3xl blur-3xl scale-110 -z-20" />
            </motion.div>
          </div>
        </main>

        {/* Footer premium */}
        <motion.footer 
          variants={itemVariants}
          className="pb-8 pt-4"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-6 mb-3">
              <div className="flex items-center space-x-2 text-slate-400">
                <Zap className="w-3 h-3" />
                <span className="text-xs font-medium tracking-wide">Powered by</span>
              </div>
              <span className="text-xs font-bold text-slate-600 tracking-[0.15em] uppercase">Fidelita</span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              © 2024 Fidelita. Plataforma premium de fidelización.
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}