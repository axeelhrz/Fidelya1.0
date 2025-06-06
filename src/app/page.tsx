'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users, Shield, Clock, ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-100/20 dark:bg-green-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/5 dark:to-indigo-900/5 rounded-full blur-3xl"></div>
      </div>

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Logo and brand section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 dark:shadow-blue-400/20">
                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-3 h-3 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-dm-sans mb-4 tracking-tight"
          >
            <span className="gradient-text">Casino Escolar</span>
          </motion.h1>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight font-dm-sans">
            Bienvenido a Casino Escolar
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Tu nueva forma de gestionar pedidos escolares de forma{' '}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">rápida</span>,{' '}
            <span className="text-green-600 dark:text-green-400 font-semibold">segura</span> y{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">organizada</span>
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto"
        >
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Rápido</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Pedidos en segundos</p>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Seguro</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Pagos protegidos</p>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Organizado</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Gestión centralizada</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
        >
          <Link
            href="/auth/sign-in"
            className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-400/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-400/25 hover:-translate-y-0.5 focus-ring"
          >
            <span>Iniciar sesión</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
          </Link>
          
          <Link
            href="/auth/sign-up"
            className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-ring"
          >
            <span>Crear cuenta</span>
            <Users className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={2} />
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-700/50"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Confiado por instituciones educativas
          </p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-slate-600 dark:text-slate-400" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Colegios</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Familias</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Seguridad</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}